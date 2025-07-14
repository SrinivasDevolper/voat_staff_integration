const express = require("express");
const router = express.Router();
const newAuthController = require("../controllers/newAuth.controller");
const { upload } = require("../utils/multerConfig");
//const { signInOtpLimiter, LoginOtpLimiter } = require("../utils/rateLimiters");
const authenticateJWT = require("../middleware/auth.middleware");

router.post("/signup", upload.single("file"), newAuthController.signup);
// Get Auth Status
router.get("/status", newAuthController.getAuthStatus);
// Resend Signup OTP Route
router.post(
  "/resend-signup-otp",
  /*signInOtpLimiter,*/ newAuthController.resendSignupOTP
);

//Resend Resend Login OTP Route
router.post("/resend-login-otp", newAuthController.resendLoginOTP);

//login verify otp Route
router.post("/login-verify", newAuthController.verifyOTP);

// Login with Password Route
router.post("/login-password", newAuthController.loginPassword);

// Request Login OTP Route
router.post(
  "/request-login-otp",
  /*LoginOtpLimiter,*/ newAuthController.requestLoginOTP
);

// Verify OTP Route (Signup & Login)
router.post("/verify-otp", newAuthController.verifyOTP);

// Forgot Password Request
router.post("/forgot-password", newAuthController.requestPasswordReset);

// Reset Password
router.post("/reset-password", newAuthController.resetPassword);

// Verify Email Change
router.get("/verify-email", newAuthController.verifyEmail);

// Email Change Verification
router.get("/verify-email-change", newAuthController.verifyEmailChange);

// Secure Password Change (Requires authentication)
router.put("/change-password", authenticateJWT, newAuthController.changePassword);

// Request Email Change (Requires authentication)
router.post(
  "/request-email-change",
  authenticateJWT,
  newAuthController.requestEmailChange
);

module.exports = router;