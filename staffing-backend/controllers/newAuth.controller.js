const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  loadUsers,
  saveUsers,
  updateIds,
  loadJSON,
  saveJSON,
} = require("../utils/fileHelpers");
const {
  generateOTP,
  sendOTP,
  sendPasswordResetEmail,
  generateToken,
  sendEmailVerificationEmail,
} = require("../utils/otpHelpers");
const validatePassword = require("../utils/passwordHelpers");
const crypto = require("crypto"); // Import crypto for token generation
const {
  findUserByEmail,
  createUser,
  updateUser,
  findUserByResetToken,
  findUserByVerificationToken,
  createPendingSignup,
  findPendingSignupByEmail,
  updatePendingSignup,
  deletePendingSignup,
  findPendingSignupByToken,
  findMaxVoatIdSuffix,
  findJobseekerProfileByUserId,
} = require("../utils/dbHelpers");
const { pool } = require("../utils/dbHelpers");
const { error } = require("console");

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password, role, isStateCheck } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const resumeFile = role === "jobseeker" ? req.file?.filename : null;

    const now = Date.now();
    const BLOCK_DURATION = 5 * 60 * 1000;
    const OTP_VALIDITY = 60 * 1000;
    const COOLDOWN_PERIOD = 60 * 1000;
    const MAX_ATTEMPTS = 3;

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Enter a vaild email" });
    }

    let pendingSignup = await findPendingSignupByEmail(normalizedEmail);

    // ✅ Reset expired block and attempts
    if (pendingSignup?.blockExpires && pendingSignup.blockExpires <= now) {
      await updatePendingSignup(pendingSignup.id, {
        blockExpires: null,
        otpAttempts: 0,
        otpVerifyAttempts: 0,
      });
      pendingSignup = await findPendingSignupByEmail(normalizedEmail);
      // pendingSignup.otpAttempts = 0;
      // pendingSignup.otpVerifyAttempts = 0;
      // pendingSignup.blockExpires = null;
    }

    const lastSent = pendingSignup?.lastOtpSent || 0;
    const retryIn = Math.max(
      0,
      Math.ceil((COOLDOWN_PERIOD - (now - lastSent)) / 1000)
    );
    const otpExpiresIn = pendingSignup?.otpExpires
      ? Math.max(0, Math.ceil((pendingSignup.otpExpires - now) / 1000))
      : null;
    const blockDuration = pendingSignup?.blockExpires
      ? Math.max(0, Math.ceil((pendingSignup.blockExpires - now) / 1000))
      : null;
    const attemptsLeft = Math.max(
      0,
      MAX_ATTEMPTS - (pendingSignup?.otpAttempts || 0)
    );

    // 🟢 State check request (UI refresh)
    if (isStateCheck) {
      return res.status(200).json({
        message: "Signup state retrieved",
        tempToken: pendingSignup?.tempToken || null,
        otpExpiresIn,
        retryIn,
        blockExpires: pendingSignup?.blockExpires || null,
        blockDuration,
        attemptsLeft,
        otpVerifyAttempts: Math.max(
          0,
          3 - (pendingSignup?.otpVerifyAttempts || 0)
        ),
      });
    }

    // Validate inputs
    if (!name?.trim()) return res.status(400).json({ error: "Invalid name" });
    if (!["superadmin", "admin", "hr", "jobseeker"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    if (role === "jobseeker" && !resumeFile) {
      return res.status(400).json({ error: "Resume required for jobseekers" });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Weak password", details: passwordErrors });
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(403).json({
        error: "If an account exists, please login or reset password.",
      });
    }

    // ⛔ Still blocked
    if (pendingSignup?.blockExpires && pendingSignup.blockExpires > now) {
      return res.status(429).json({
        error: "Too many attempts. Account is temporarily blocked.",
        tempToken: pendingSignup.tempToken,
        blockExpires: pendingSignup.blockExpires,
        blockDuration,
        retryIn,
        otpExpiresIn,
        attemptsLeft: 0,
        otpVerifyAttempts: 0,
      });
    }

    // ⏳ Cooldown active
    if (pendingSignup && now - lastSent < COOLDOWN_PERIOD) {
      return res.status(429).json({
        error: `Please wait ${retryIn} seconds before trying again.`,
        tempToken: pendingSignup.tempToken,
        blockExpires: null,
        retryIn,
        otpExpiresIn,
        attemptsLeft,
        otpVerifyAttempts: Math.max(
          0,
          3 - (pendingSignup.otpVerifyAttempts || 0)
        ),
      });
    }

    // 🔁 Resend OTP
    if (pendingSignup) {
      const newAttempts = pendingSignup.otpAttempts + 1;

      if (newAttempts > MAX_ATTEMPTS) {
        const blockUntil = now + BLOCK_DURATION;
        await updatePendingSignup(pendingSignup.id, {
          blockExpires: blockUntil,
          otpAttempts: newAttempts,
        });
        return res.status(429).json({
          error: "Too many OTP requests. Blocked for 5 minutes.",
          tempToken: pendingSignup.tempToken,
          blockExpires: blockUntil,
          blockDuration: Math.ceil(BLOCK_DURATION / 1000),
          retryIn: 0,
          otpExpiresIn: null,
          attemptsLeft: 0,
          otpVerifyAttempts: 0,
        });
      }

      const newOtp = generateOTP();
      const updatedOtpExpires = now + OTP_VALIDITY;

      await updatePendingSignup(pendingSignup.id, {
        otpCode: newOtp,
        otpExpires: updatedOtpExpires,
        lastOtpSent: now,
        otpAttempts: newAttempts,
        otpVerifyAttempts: 0, // ✅ reset verify attempts
      });

      console.log(normalizedEmail, newOtp, "🔁 Resent OTP");

      return res.status(200).json({
        message: "OTP re-sent. Check your inbox.",
        tempToken: pendingSignup.tempToken,
        blockExpires: null,
        blockDuration: null,
        retryIn: 60,
        otpExpiresIn: Math.ceil((updatedOtpExpires - now) / 1000),
        attemptsLeft: MAX_ATTEMPTS - newAttempts,
        otpVerifyAttempts: Math.max(
          0,
          3 - (pendingSignup.otpVerifyAttempts || 0)
        ),
      });
    }

    // 🆕 New signup
    const otp = generateOTP();
    const tempToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedOtpExpires = now + OTP_VALIDITY;

    const newSignup = {
      name,
      email: normalizedEmail,
      hashedPassword,
      resume_filepath: resumeFile,
      role,
      otpCode: otp,
      otpExpires: updatedOtpExpires,
      lastOtpSent: now,
      otpAttempts: 1,
      otpVerifyAttempts: 0,
      blockExpires: null,
    };

    await createPendingSignup({ tempToken, ...newSignup });

    console.log(normalizedEmail, otp, "🆕 New OTP");

    return res.status(200).json({
      message: "OTP sent",
      tempToken,
      blockExpires: null,
      blockDuration: null,
      retryIn: 60,
      otpExpiresIn: Math.ceil((updatedOtpExpires - now) / 1000),
      attemptsLeft: MAX_ATTEMPTS - 1, // user just used 1
      otpVerifyAttempts: MAX_ATTEMPTS,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res
      .status(500)
      .json({ error: "An unexpected server error occurred." });
  }
};

const signupStatus = async (req, res) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const pendingSignup = await findPendingSignupByEmail(email);
  if (!pendingSignup) {
    return res.status(404).json({ error: "No pending signup found." });
  }

  const now = Date.now();
  const OTP_COOLDOWN = 30 * 1000;
  const MAX_OTP_SEND_ATTEMPTS = 3;

  const retryIn =
    pendingSignup.lastOtpSent && now - pendingSignup.lastOtpSent < OTP_COOLDOWN
      ? Math.ceil((OTP_COOLDOWN - (now - pendingSignup.lastOtpSent)) / 1000)
      : 0;

  res.json({
    attemptsLeft: Math.max(
      0,
      MAX_OTP_SEND_ATTEMPTS - (pendingSignup.otpAttempts || 0)
    ),
    blockExpires: pendingSignup.blockExpires || 0,
    retryIn,
    otpExpires: pendingSignup.otpExpires || 0,
  });
};

// Resend Signup OTP Controller
const resendSignupOTP = async (req, res) => {
  const { email, tempToken } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!tempToken) {
    return res.status(400).json({ error: "Missing temp token" });
  }

  const pendingSignup = await findPendingSignupByToken(tempToken);
  if (!pendingSignup || pendingSignup.email !== email) {
    return res
      .status(400)
      .json({ error: "Invalid or expired token/email mismatch" });
  }

  const now = Date.now();
  const OTP_COOLDOWN = 60 * 1000;
  const MAX_OTP_ATTEMPTS = 3;
  const MAX_VERIFY_ATTEMPTS = 3;
  const BLOCK_DURATION = 5 * 60 * 1000;

  // ✅ Reset block + attempts if block expired
  if (pendingSignup.blockExpires && pendingSignup.blockExpires <= now) {
    await updatePendingSignup(pendingSignup.id, {
      blockExpires: null,
      otpAttempts: 0,
      otpVerifyAttempts: 0,
    });
    // pendingSignup.blockExpires = null;
    // pendingSignup.otpAttempts = 0;
    // pendingSignup.otpVerifyAttempts = 0;
    pendingSignup = await findPendingSignupByToken(tempToken);
  }

  // ⛔ Still blocked
  if (pendingSignup.blockExpires && pendingSignup.blockExpires > now) {
    const remainingBlockSeconds = Math.ceil(
      (pendingSignup.blockExpires - now) / 1000
    );
    return res.status(429).json({
      error: "Too many OTP send attempts. Account temporarily blocked.",
      blockExpires: pendingSignup.blockExpires,
      remainingBlockSeconds,
      attemptsLeft: 0,
      verifyAttemptsLeft: 0,
    });
  }

  // ⏳ Cooldown check
  if (
    pendingSignup.lastOtpSent &&
    now - pendingSignup.lastOtpSent < OTP_COOLDOWN
  ) {
    return res.status(429).json({
      error: `Please wait 60 seconds before trying again.`,
      retryIn: 60,
      otpExpiresIn: Math.max(
        0,
        Math.ceil((pendingSignup.otpExpires - now) / 1000)
      ),
      attemptsLeft: Math.max(
        0,
        MAX_OTP_ATTEMPTS - (pendingSignup.otpAttempts || 0)
      ),
      verifyAttemptsLeft: Math.max(
        0,
        MAX_VERIFY_ATTEMPTS - (pendingSignup.otpVerifyAttempts || 0)
      ),
    });
  }

  // ✅ Generate new OTP
  const newOtp = generateOTP();
  const newAttempts = (pendingSignup.otpAttempts || 0) + 1;
  const updatedOtpExpires = now + 60 * 1000; // ⏱ 2 minutes

  let updates = {
    otpCode: newOtp,
    otpExpires: updatedOtpExpires,
    lastOtpSent: now,
    otpAttempts: newAttempts,
    otpVerifyAttempts: 0, // ✅ Reset verification chances
  };

  // ⛔ Block on 4th attempt
  if (newAttempts > MAX_OTP_ATTEMPTS) {
    const blockUntil = now + BLOCK_DURATION;
    updates.blockExpires = blockUntil;
    await updatePendingSignup(pendingSignup.id, updates);
    return res.status(429).json({
      error: `Too many OTP send attempts. Blocked for 5 minutes.`,
      blockExpires: blockUntil,
      remainingBlockSeconds: Math.ceil(BLOCK_DURATION / 1000),
      attemptsLeft: 0,
      otpExpiresIn: null,
      verifyAttemptsLeft: 0,
    });
  }

  // ✅ Save + Respond
  try {
    await updatePendingSignup(pendingSignup.id, updates);
    // await sendOTP(email, newOtp);
    console.log(email, newOtp, "📨 Resent OTP");

    return res.status(200).json({
      message: "New OTP sent successfully!",
      tempToken,
      blockExpires: null,
      retryIn: 60,
      otpExpiresIn: Math.ceil((updatedOtpExpires - now) / 1000),
      attemptsLeft: MAX_OTP_ATTEMPTS - newAttempts,
      verifyAttemptsLeft: MAX_VERIFY_ATTEMPTS, // ✅ Always return full reset here
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ error: "Failed to resend OTP." });
  }
};

// Login with Password Controller
const loginPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Account not found" });

  const now = Date.now();
  const PASSWORD_ATTEMPT_LIMIT = 5;
  const OTP_ATTEMPT_LIMIT = 3;
  const ACCOUNT_BLOCK_DURATION = 5 * 60 * 1000;
  const OTP_COOLDOWN = 60 * 1000;

  if (user.lockoutExpires && user.lockoutExpires <= now) {
    console.log(user.lockoutExpires, "lockoutExpires");
    await updateUser(user.id, {
      otpAttempts: 0,
      otpVerifyAttempts: 0,
      passwordAttempts: 0,
      lockoutExpires: null,
      lastFailedLoginAttempt: null,
    });
    user.otpAttempts = 0;
    user.otpVerifyAttempts = 0;
    user.passwordAttempts = 0;
    user.lockoutExpires = null;
  }

  const passwordAttemptsLeft = Math.max(
    0,
    PASSWORD_ATTEMPT_LIMIT - (user.passwordAttempts || 0)
  );
  const otpAttemptsLeft = Math.max(
    0,
    OTP_ATTEMPT_LIMIT - (user.otpAttempts || 0)
  );
  const otpVerifyAttemptsLeft = Math.max(
    0,
    OTP_ATTEMPT_LIMIT - (user.otpVerifyAttempts || 0)
  );

  if (user.lockoutExpires && user.lockoutExpires > now) {
    const remainingMillis = user.lockoutExpires - now;
    return res.status(429).json({
      error: `Account temporarily blocked. Try again in ${Math.ceil(
        remainingMillis / 60 / 1000
      )} minute(s).`,
      remainingBlockSeconds: Math.ceil(remainingMillis / 1000),
      attemptsLeft: 0,
      passwordAttempts: user.passwordAttempts || 0,
      otpAttempts: user.otpAttempts || 0,
      otpVerifyAttempts: user.otpVerifyAttempts || 0,
      passwordAttemptsLeft,
      otpAttemptsLeft,
      otpVerifyAttemptsLeft,
      lockoutExpires: user.lockoutExpires,
      retryIn:
        user.lastOtpSent && now - user.lastOtpSent < OTP_COOLDOWN
          ? Math.ceil((OTP_COOLDOWN - (now - user.lastOtpSent)) / 1000)
          : 0,
    });
  }

  if (!user.verified)
    return res.status(400).json({ error: "Account not verified" });

  if (!(await bcrypt.compare(password, user.password))) {
    const newPasswordAttempts = (user.passwordAttempts || 0) + 1;
    const attemptsLeft = PASSWORD_ATTEMPT_LIMIT - newPasswordAttempts;
    const updates = {
      passwordAttempts: newPasswordAttempts,
      lastFailedLoginAttempt: now,
    };

    if (newPasswordAttempts <= PASSWORD_ATTEMPT_LIMIT) {
      await updateUser(user.id, updates);
      return res.status(400).json({
        error: `Incorrect password. ${attemptsLeft} attempts left.`,
        attemptsLeft,
        passwordAttempts: newPasswordAttempts,
        otpAttempts: user.otpAttempts || 0,
        otpVerifyAttempts: user.otpVerifyAttempts || 0,
        passwordAttemptsLeft: Math.max(
          0,
          PASSWORD_ATTEMPT_LIMIT - newPasswordAttempts
        ),
        otpAttemptsLeft,
        otpVerifyAttemptsLeft,
        retryIn:
          user.lastOtpSent && now - user.lastOtpSent < OTP_COOLDOWN
            ? Math.ceil((OTP_COOLDOWN - (now - user.lastOtpSent)) / 1000)
            : 0,
      });
    } else {
      updates.lockoutExpires = now + ACCOUNT_BLOCK_DURATION;
      await updateUser(user.id, updates);
      return res.status(429).json({
        error: `Account temporarily blocked due to too many incorrect password attempts (${PASSWORD_ATTEMPT_LIMIT}).`,
        attemptsLeft: 0,
        passwordAttempts: newPasswordAttempts,
        otpAttempts: user.otpAttempts || 0,
        otpVerifyAttempts: user.otpVerifyAttempts || 0,
        passwordAttemptsLeft: 0,
        otpAttemptsLeft,
        otpVerifyAttemptsLeft,
        lockoutExpires: updates.lockoutExpires,
        remainingBlockSeconds: Math.ceil(ACCOUNT_BLOCK_DURATION / 1000),
        retryIn: 0,
      });
    }
  }
  try {
    await updateUser(user.id, {
      passwordAttempts: 0,
      otp: null,
      otpExpires: null,
      otpAttempts: 0,
      otpVerifyAttempts: 0,
      lastFailedLoginAttempt: null,
      lockoutExpires: null,
      lastOtpSent: null,
    });

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in Successfully",
      token: jwtToken,
      data: {
        email: user.email,
        role: user.role,
        name: user.username,
        id: user.id,
      },
    });
  } catch (err) {
    console.error("❌ DB Update Failed:", err);
    return res.status(500).json({ error: "Failed to update user data." });
  }
};

// Request Login OTP Controller
const requestLoginOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a vaild email" });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Account not found" });
  if (!user.verified)
    return res.status(400).json({ error: "Account not verified" });

  const now = Date.now();
  const OTP_COOLDOWN = 60 * 1000;
  const ACCOUNT_BLOCK_DURATION = 5 * 60 * 1000;
  const OTP_ATTEMPT_LIMIT = 3;

  if (user.lockoutExpires && user.lockoutExpires <= now) {
    await updateUser(user.id, {
      otpAttempts: 0,
      otpVerifyAttempts: 0,
      passwordAttempts: 0,
      lockoutExpires: null,
      lastFailedLoginAttempt: null,
    });
    user.otpAttempts = 0;
    user.otpVerifyAttempts = 0;
    user.passwordAttempts = 0;
    user.lockoutExpires = null;
  }

  const passwordAttemptsLeft = Math.max(0, 5 - (user.passwordAttempts || 0));
  const otpAttemptsLeft = Math.max(
    0,
    OTP_ATTEMPT_LIMIT - (user.otpAttempts || 0)
  );
  const otpVerifyAttemptsLeft = Math.max(
    0,
    OTP_ATTEMPT_LIMIT - (user.otpVerifyAttempts || 0)
  );

  if (user.lockoutExpires && user.lockoutExpires > now) {
    const remaining = Math.ceil((user.lockoutExpires - now) / 1000);
    return res.status(429).json({
      error: `Too many OTP requests. Account is blocked for ${remaining} seconds.`,
      remainingBlockSeconds: remaining,
      lockoutExpires: user.lockoutExpires,
      otpAttempts: user.otpAttempts,
      otpAttemptsLeft,
      otpVerifyAttempts: user.otpVerifyAttempts,
      otpVerifyAttemptsLeft,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
    });
  }

  if (user.lastOtpSent && now - user.lastOtpSent < OTP_COOLDOWN) {
    const retryIn = Math.ceil((OTP_COOLDOWN - (now - user.lastOtpSent)) / 1000);
    return res.status(429).json({
      error: `Please wait ${retryIn} seconds before trying again.`,
      retryIn,
      otpExpiresIn: user.otpExpires
        ? Math.ceil((user.otpExpires - now) / 1000)
        : null,
      otpAttempts: user.otpAttempts,
      otpAttemptsLeft,
      otpVerifyAttempts: user.otpVerifyAttempts,
      otpVerifyAttemptsLeft,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
    });
  }

  const newOtpAttempts = (user.otpAttempts || 0) + 1;

  if (newOtpAttempts > OTP_ATTEMPT_LIMIT) {
    const blockUntil = now + ACCOUNT_BLOCK_DURATION;
    await updateUser(user.id, {
      lockoutExpires: blockUntil,
      otpAttempts: newOtpAttempts,
    });
    return res.status(429).json({
      error: `Too many OTP attempts. Account is blocked for ${Math.ceil(
        ACCOUNT_BLOCK_DURATION / 1000
      )} seconds.`,
      remainingBlockSeconds: Math.ceil(ACCOUNT_BLOCK_DURATION / 1000),
      lockoutExpires: blockUntil,
      otpAttempts: newOtpAttempts,
      otpAttemptsLeft: 0,
      otpVerifyAttempts: user.otpVerifyAttempts,
      otpVerifyAttemptsLeft,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
    });
  }

  const otp = generateOTP();
  const otpExpires = now + 60 * 1000;

  try {
    await updateUser(user.id, {
      otp,
      otpExpires,
      lastOtpSent: now,
      otpAttempts: newOtpAttempts,
      otpVerifyAttempts: 0,
    });

    console.log(email, otp, "✅ OTP sent");

    return res.status(200).json({
      message: "OTP sent",
      otpExpiresIn: Math.ceil((otpExpires - now) / 1000),
      retryIn: 60,
      otpAttempts: newOtpAttempts,
      otpAttemptsLeft: OTP_ATTEMPT_LIMIT - newOtpAttempts,
      otpVerifyAttempts: 0,
      otpVerifyAttemptsLeft: OTP_ATTEMPT_LIMIT,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
      lockoutExpires: null,
      remainingBlockSeconds: 0,
    });
  } catch (err) {
    console.error("❌ DB Update Failed:", err);
    return res.status(500).json({ error: "Failed to update user data." });
  }
};

const resendLoginOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a vaild email" });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Account not found" });
  if (!user.verified)
    return res.status(400).json({ error: "Account not verified" });

  const now = Date.now();
  const OTP_COOLDOWN = 60 * 1000;
  const ACCOUNT_BLOCK_DURATION = 5 * 60 * 1000;
  const OTP_ATTEMPT_LIMIT = 3;

  if (user.lockoutExpires && user.lockoutExpires <= now) {
    await updateUser(user.id, {
      otpAttempts: 0,
      otpVerifyAttempts: 0,
      passwordAttempts: 0,
      lockoutExpires: null,
      lastFailedLoginAttempt: null,
    });
    user.otpAttempts = 0;
    user.otpVerifyAttempts = 0;
    user.passwordAttempts = 0;
    user.lockoutExpires = null;
  }

  const passwordAttemptsLeft = Math.max(0, 5 - (user.passwordAttempts || 0));
  const otpAttemptsLeft = Math.max(
    0,
    OTP_ATTEMPT_LIMIT - (user.otpAttempts || 0)
  );
  const otpVerifyAttemptsLeft = Math.max(
    0,
    OTP_ATTEMPT_LIMIT - (user.otpVerifyAttempts || 0)
  );

  if (user.lockoutExpires && user.lockoutExpires > now) {
    const remaining = Math.ceil((user.lockoutExpires - now) / 1000);
    return res.status(429).json({
      error: `Too many OTP requests. Account is blocked for ${remaining} seconds.`,
      remainingBlockSeconds: remaining,
      lockoutExpires: user.lockoutExpires,
      otpAttempts: user.otpAttempts,
      otpAttemptsLeft,
      otpVerifyAttempts: user.otpVerifyAttempts,
      otpVerifyAttemptsLeft,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
    });
  }

  if (user.lastOtpSent && now - user.lastOtpSent < OTP_COOLDOWN) {
    const retryIn = Math.ceil((OTP_COOLDOWN - (now - user.lastOtpSent)) / 1000);
    return res.status(429).json({
      error: `Please wait ${retryIn} seconds before trying again.`,
      retryIn,
      otpExpiresIn: user.otpExpires
        ? Math.ceil((user.otpExpires - now) / 1000)
        : null,
      otpAttempts: user.otpAttempts,
      otpAttemptsLeft,
      otpVerifyAttempts: user.otpVerifyAttempts,
      otpVerifyAttemptsLeft,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
    });
  }

  const newOtpAttempts = (user.otpAttempts || 0) + 1;

  if (newOtpAttempts > OTP_ATTEMPT_LIMIT) {
    const blockUntil = now + ACCOUNT_BLOCK_DURATION;
    await updateUser(user.id, {
      lockoutExpires: blockUntil,
      otpAttempts: newOtpAttempts,
    });
    return res.status(429).json({
      error: `Too many OTP attempts. Account is blocked for ${Math.ceil(
        ACCOUNT_BLOCK_DURATION / 1000
      )} seconds.`,
      remainingBlockSeconds: Math.ceil(ACCOUNT_BLOCK_DURATION / 1000),
      lockoutExpires: blockUntil,
      otpAttempts: newOtpAttempts,
      otpAttemptsLeft: 0,
      otpVerifyAttempts: user.otpVerifyAttempts,
      otpVerifyAttemptsLeft,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
    });
  }

  const otp = generateOTP();
  const otpExpires = now + 60 * 1000;

  try {
    await updateUser(user.id, {
      otp,
      otpExpires,
      lastOtpSent: now,
      otpAttempts: newOtpAttempts,
      otpVerifyAttempts: 0,
    });

    console.log(email, otp, "✅ New OTP sent successfully!");

    return res.status(200).json({
      message: "New OTP sent successfully!",
      otpExpiresIn: Math.ceil((otpExpires - now) / 1000),
      retryIn: 60,
      otpAttempts: newOtpAttempts,
      otpAttemptsLeft: OTP_ATTEMPT_LIMIT - newOtpAttempts,
      otpVerifyAttempts: 0,
      otpVerifyAttemptsLeft: OTP_ATTEMPT_LIMIT,
      passwordAttempts: user.passwordAttempts,
      passwordAttemptsLeft,
      lockoutExpires: null,
      remainingBlockSeconds: 0,
    });
  } catch (err) {
    console.error("❌ DB Update Failed:", err);
    return res.status(500).json({ error: "Failed to update user data." });
  }
};

// Verify OTP Controller (Signup & Login)
const verifyOTP = async (req, res) => {
  const { email, otp, tempToken, type } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a vaild email" });
  }

  if (!otp || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const now = Date.now();
  const SIGNUP_OTP_ATTEMPTS_LIMIT = 3; // Allow 3 tries before showing 0
  const SIGNUP_BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  if (type === "signup") {
    if (!tempToken) {
      return res.status(400).json({ error: "Missing token" });
    }

    const pendingSignup = await findPendingSignupByToken(tempToken);
    if (!pendingSignup || pendingSignup.email !== email) {
      return res.status(400).json({ error: "Invalid token or email mismatch" });
    }

    // ✅ Reset block & attempts after expiry
    if (pendingSignup.blockExpires && pendingSignup.blockExpires <= now) {
      await updatePendingSignup(pendingSignup.id, {
        blockExpires: null,
        otpVerifyAttempts: 0,
        otpAttempts: 0,
      });
      // pendingSignup.otpVerifyAttempts = 0;
      // pendingSignup.otpAttempts = 0;
      // pendingSignup.blockExpires = null;
      pendingSignup = await findPendingSignupByToken(tempToken);
    }

    // ⛔ Still blocked
    if (pendingSignup.blockExpires && pendingSignup.blockExpires > now) {
      const remainingMillis = pendingSignup.blockExpires - now;
      return res.status(429).json({
        error: `Account temporarily blocked. Try again in ${Math.ceil(
          Math.ceil(remainingMillis / 1000)
        )} minute(s).`,
        blockExpires: pendingSignup.blockExpires,
        remainingBlockSeconds: Math.ceil(remainingMillis / 1000),
        attemptsLeft: 0,
        resendAttemptsLeft: Math.max(0, 3 - (pendingSignup.otpAttempts || 0)),
      });
    }

    // ❌ OTP expired
    if (pendingSignup.otpExpires < now) {
      await deletePendingSignup(pendingSignup.id);
      return res.status(400).json({ error: "OTP expired" });
    }

    // ❌ Wrong OTP handling
    if (pendingSignup.otpCode !== otp) {
      const newVerifyAttempts = (pendingSignup.otpVerifyAttempts || 0) + 1;
      let updates = { otpVerifyAttempts: newVerifyAttempts };

      // ➕ Allow 3 wrong attempts, block only after 4th
      if (newVerifyAttempts > SIGNUP_OTP_ATTEMPTS_LIMIT) {
        const blockUntil = now + SIGNUP_BLOCK_DURATION;
        updates.blockExpires = blockUntil;

        await updatePendingSignup(pendingSignup.id, updates);
        return res.status(429).json({
          error: `Too many incorrect OTP attempts. Blocked for 5 minutes.`,
          attemptsLeft: 0,
          resendAttemptsLeft: Math.max(0, 3 - (pendingSignup.otpAttempts || 0)),
          blockExpires: blockUntil,
          remainingBlockSeconds: Math.ceil(SIGNUP_BLOCK_DURATION / 1000),
        });
      }

      // ✅ Send warning on first 3 failed attempts
      const attemptsLeft = Math.max(
        0,
        SIGNUP_OTP_ATTEMPTS_LIMIT - newVerifyAttempts
      );
      await updatePendingSignup(pendingSignup.id, updates);

      return res.status(400).json({
        error: `Incorrect OTP. ${attemptsLeft} attempts left.`,
        attemptsLeft,
        resendAttemptsLeft: Math.max(0, 3 - (pendingSignup.otpAttempts || 0)),
      });
    }

    // ✅ Correct OTP
    try {
      const voatId = `VOAT-${String((await findMaxVoatIdSuffix()) + 1).padStart(
        3,
        "0"
      )}`;

      // Step 1: Create user and get ID
      const createdUserResult = await createUser({
        username: pendingSignup.name,
        email: pendingSignup.email,
        hashedPassword: pendingSignup.hashedPassword,
        role: pendingSignup.role,
        voatId,
        verified: true,
        resume_filepath: pendingSignup.resume_filepath,
      });

      // Step 2: Fetch full user details using ID
      const createdUser = await findJobseekerProfileByUserId(
        createdUserResult.id
      );

      // Step 3: Cleanup pending signup
      await deletePendingSignup(pendingSignup.id);

      // Step 4: Generate JWT
      const jwtToken = jwt.sign(
        {
          id: createdUser.userId,
          email: createdUser.email,
          role: createdUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Step 5: Send full user data to client
      return res.json({
        message: "Signup verified successfully",
        token: jwtToken,
        data: {
          email: createdUser.email,
          role: createdUser.role,
          name: createdUser.username,
          id: createdUser.userId,
        },
      });
    } catch (error) {
      console.error("Signup verification failed:", error);
      return res.status(500).json({ error: "Signup creation failed" });
    }
  }

  // 🟡 Leave login path unchanged
};

const loginOtpVerify = async (req, res) => {
  const { email, otp, type } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Enter and OTP and Email" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email" });
  }

  if (!otp || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const now = Date.now();
  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 5 * 60 * 1000;

  if (type === "login") {
    let loginRecord = await findUserByEmail(email);
    if (!loginRecord) {
      return res
        .status(400)
        .json({ error: "No login OTP requested for this email" });
    }

    // ✅ Reset all OTP-related state if block expired
    if (loginRecord.lockoutExpires && loginRecord.lockoutExpires <= now) {
      await updateUser(loginRecord.id, {
        lockoutExpires: null,
        otpVerifyAttempts: 0,
        otpAttempts: 0,
        passwordAttempts: 0,
        otp: null,
        otpExpires: null,
      });
      loginRecord = await findUserByEmail(email); // refresh after reset
    }

    const otpVerifyAttempts = loginRecord.otpVerifyAttempts || 0;
    const otpVerifyAttemptsLeft = Math.max(0, MAX_ATTEMPTS - otpVerifyAttempts);
    const otpAttempts = loginRecord.otpAttempts || 0;
    const otpAttemptsLeft = Math.max(0, MAX_ATTEMPTS - otpAttempts);
    const passwordAttempts = loginRecord.passwordAttempts || 0;
    const passwordAttemptsLeft = Math.max(0, MAX_ATTEMPTS - passwordAttempts);
    console.log(loginRecord, "loginRecord");
    // ⛔ Block still active
    if (loginRecord.lockoutExpires && loginRecord.lockoutExpires > now) {
      const remainingBlockSeconds = Math.ceil(
        (loginRecord.blockExpires - now) / 1000
      );
      return res.status(429).json({
        error: `Account is temporarily blocked. Try again in ${remainingBlockSeconds} seconds.`,
        remainingBlockSeconds,
        lockoutExpires: loginRecord.lockoutExpires,
        otpAttempts,
        otpAttemptsLeft,
        otpVerifyAttempts,
        otpVerifyAttemptsLeft,
        passwordAttempts,
        passwordAttemptsLeft,
      });
    }

    // ❌ Expired OTP
    if (loginRecord.otpExpires < now) {
      await updateUser(loginRecord.id, {
        otp: null,
        otpExpires: null,
      });
      return res.status(400).json({ error: "OTP expired" });
    }

    // ❌ Incorrect OTP
    if (loginRecord.otp !== otp) {
      const newAttempts = otpVerifyAttempts + 1;
      const updates = { otpVerifyAttempts: newAttempts };

      if (newAttempts > MAX_ATTEMPTS) {
        const blockUntil = now + BLOCK_DURATION;
        updates.lockoutExpires = blockUntil;
        await updateUser(loginRecord.id, updates);

        return res.status(429).json({
          error: `Too many incorrect attempts. Account blocked for ${Math.ceil(
            BLOCK_DURATION / 1000
          )}  minutes.`,
          remainingBlockSeconds: Math.ceil(BLOCK_DURATION / 1000),
          lockoutExpires: blockUntil,
          otpAttempts,
          otpAttemptsLeft,
          otpVerifyAttempts: newAttempts,
          otpVerifyAttemptsLeft: 0,
          passwordAttempts,
          passwordAttemptsLeft,
        });
      }

      const attemptsLeft = MAX_ATTEMPTS - newAttempts;
      await updateUser(loginRecord.id, updates);
      return res.status(400).json({
        error: `Incorrect OTP. ${attemptsLeft} attempt${
          attemptsLeft !== 1 ? "s" : ""
        } left.`,
        attemptsLeft,
        otpAttempts,
        otpAttemptsLeft,
        otpVerifyAttempts: newAttempts,
        otpVerifyAttemptsLeft: attemptsLeft,
        passwordAttempts,
        passwordAttemptsLeft,
      });
    }

    // ✅ OTP is correct
    try {
      const user = await findUserByEmail(email);
      if (!user) return res.status(404).json({ error: "User not found" });

      await updateUser(loginRecord.id, {
        otp: null,
        otpExpires: null,
        otpVerifyAttempts: 0,
        lockoutExpires: null,
        loginAttempts: 0,
        passwordAttempts: 0,
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login OTP verified successfully",
        token,
        data: {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("OTP verify failed:", err);
      return res
        .status(500)
        .json({ error: "An unexpected server error occurred." });
    }
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email" });
  }

  const user = await findUserByEmail(email);
  console.log(user, "user");

  // ⛔ Fake generic message for unknown users
  if (!user) {
    console.log(`Password reset requested for non-existent email: ${email}`);
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }

  const token = generateToken();
  const resetExpires = Date.now() + 3600000; // 1 hour
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await updateUser(user.id, {
      resetToken: token,
      resetExpires,
    });

    // 📨 Optional: Replace this with actual email sending
    // await sendPasswordResetEmail(email, resetLink);

    console.log(`🔐 Password reset link for ${email}: ${resetLink}`);

    res.json({
      message: `Password reset link sent to ${email}`,
      resetLink, // return for dev/test visibility
    });
  } catch (error) {
    console.error("Password Reset Error:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and new password are required" });
  }

  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      error: "Password does not meet the requirements:",
      details: passwordErrors,
    });
  }

  const userToReset = await findUserByResetToken(token);

  if (!userToReset) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Check if the new password is the same as the old password
  if (await bcrypt.compare(newPassword, userToReset.password)) {
    return res
      .status(400)
      .json({ error: "New password cannot be the same as the old password." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await updateUser(userToReset.id, {
      password: hashedPassword,
      resetToken: null,
      resetExpires: null,
    });
    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Verify Email Controller (for initial signup verification)
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token required" });
  }

  const userToVerify = await findUserByVerificationToken(token);

  if (!userToVerify) {
    return res
      .status(400)
      .json({ error: "Invalid or expired verification token" });
  }

  try {
    await updateUser(userToVerify.id, {
      verified: true,
      verificationToken: null,
    });
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
};

// Secure Password Change Controller
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = req.user; // Get user from authenticated JWT payload
  console.log(user, "user");
  if (!user) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not found in token." }); // Should ideally not happen if auth middleware works
  }

  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      error: "New password does not meet the requirements:",
      details: passwordErrors,
    });
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ error: "Incorrect old password" });
  }

  // Check if the new password is the same as the old password
  if (await bcrypt.compare(newPassword, user.password)) {
    return res
      .status(400)
      .json({ error: "New password cannot be the same as the old password." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await updateUser(user.id, { password: hashedPassword });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

// Request Email Change Controller
const requestEmailChange = async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  if (!validator.isEmail(oldEmail) || !validator.isEmail(newEmail)) {
    return res.status(400).json({ error: "Enter a vaild email" });
  }

  const user = await findUserByEmail(oldEmail);
  // Security Best Practice: Respond generically if old email not found
  if (!user) {
    console.log(
      `Email change requested for non-existent old email: ${oldEmail}`
    );
    return res
      .status(400)
      .json({ error: "Invalid request or account not found." }); // Generic error
  }

  const existingNewEmailUser = await findUserByEmail(newEmail);
  if (existingNewEmailUser) {
    return res.status(400).json({ error: "New email is already in use" });
  }

  const verificationToken = generateToken();
  const verificationExpires = Date.now() + 3600000; // 1 hour

  try {
    await updateUser(user.id, {
      newEmail: newEmail,
      verificationToken: verificationToken,
      verificationExpires: verificationExpires,
    });
    await sendEmailVerificationEmail(newEmail, verificationToken);
    res.json({
      message: "Verification email sent to new email (if account exists).",
    }); // Generic success message
  } catch (error) {
    console.error("Request Email Change Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to send verification email." }); // Generic error
  }
};

const verifyEmailChange = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token required" });
  }

  const userToVerify = await findUserByVerificationToken(token);

  if (!userToVerify || !userToVerify.newEmail) {
    return res.status(400).json({
      error:
        "Invalid or expired verification token, or no pending email change.",
    });
  }

  // Check if the token has expired (though findUserByVerificationToken already does this for reset/signup)
  // For email change, it's tied to 'newEmail' which might not have 'verificationExpires' directly linked to it in the same way as `verificationToken` column.
  // Re-checking the general `verificationExpires` on the user object is good.
  if (userToVerify.verificationExpires < Date.now()) {
    await updateUser(userToVerify.id, {
      newEmail: null,
      verificationToken: null,
      verificationExpires: null,
    });
    return res.status(400).json({
      error:
        "Verification token has expired. Please request a new email change.",
    });
  }

  try {
    // Update the primary email and clear pending change fields
    await updateUser(userToVerify.id, {
      email: userToVerify.newEmail, // Set new email as primary
      newEmail: null,
      verificationToken: null,
      verificationExpires: null,
    });
    res.json({ message: "Email address updated successfully" });
  } catch (error) {
    console.error("Email Change Verification Error:", error);
    res
      .status(500)
      .json({ error: "Failed to verify and update email address." });
  }
};

// Keep tempUsers in this file for now, or consider a more robust temporary storage
// Need padNumber function for verifyOTP signup case - assuming it's a helper
const padNumber = (num, length = 3) => String(num).padStart(length, "0");

// Get Auth Status
const getAuthStatus = async (req, res) => {
  const { email } = req.query; // Expect email as a query parameter

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Enter a vaild email" });
  }

  const pendingSignup = await findPendingSignupByEmail(email);
  const now = Date.now();

  let status = {
    attemptsLeft: 3, // Default for signup OTP send attempts (from MAX_OTP_SEND_ATTEMPTS)
    cooldown: 0, // In seconds
    blocked: false,
    blockExpires: 0,
    message: "Ready to send OTP",
  };

  if (pendingSignup) {
    const OTP_COOLDOWN = 30 * 1000; // 30 seconds
    const MAX_OTP_SEND_ATTEMPTS = 3; // Max times OTP can be sent for a single signup attempt
    const SIGNUP_BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

    if (pendingSignup.blockExpires && pendingSignup.blockExpires > now) {
      status.blocked = true;
      status.blockExpires = pendingSignup.blockExpires;
      const remainingMillis = pendingSignup.blockExpires - now;
      const remainingMinutes = Math.ceil(remainingMillis / (60 * 1000));
      status.message = `Too many OTP send attempts. Please try again in ${remainingMinutes} minute(s).`;
    } else if (
      pendingSignup.lastOtpSent &&
      now - pendingSignup.lastOtpSent < OTP_COOLDOWN
    ) {
      const remainingSeconds = Math.ceil(
        (OTP_COOLDOWN - (now - pendingSignup.lastOtpSent)) / 1000
      );
      status.cooldown = remainingSeconds;
      status.message = `Please wait ${remainingSeconds} second(s) before requesting another OTP.`;
    } else {
      // Calculate remaining attempts
      status.attemptsLeft =
        MAX_OTP_SEND_ATTEMPTS - (pendingSignup.otpAttempts || 0);
      if (status.attemptsLeft < 0) status.attemptsLeft = 0; // Should not happen if blocking is working
      status.message = "Ready to send OTP";
    }

    // If a pending signup exists, but no block or cooldown, update attemptsLeft
    if (!status.blocked && status.cooldown === 0) {
      status.attemptsLeft =
        MAX_OTP_SEND_ATTEMPTS - (pendingSignup.otpAttempts || 0);
      if (status.attemptsLeft < 0) status.attemptsLeft = 0;
    }
  }

  res.json(status);
};

module.exports = {
  signup,
  signupStatus,
  loginPassword,
  requestLoginOTP,
  verifyOTP,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  changePassword,
  requestEmailChange,
  verifyEmailChange,
  resendSignupOTP,
  resendLoginOTP,
  loginOtpVerify,
  // tempUsers // No longer needed, removed from export
};
