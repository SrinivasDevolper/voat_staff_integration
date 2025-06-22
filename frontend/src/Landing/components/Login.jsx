import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Eye, EyeOff, Home, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../utilits/apiUrl";
import Cookies from "js-cookie";

export default function OTPLogin() {
  const [step, setStep] = useState(1); //change to otp form
  const [email, setEmail] = useState(""); // for email
  const [password, setPassword] = useState(""); //for password
  const [otp, setOtp] = useState(Array(6).fill("")); //For otp
  const [showPassword, setShowPassword] = useState(false); //show password

  //Msg Toast
  const [errorMsg, setErrorMsg] = useState(""); //error Message for failure
  const [toast, setToast] = useState(null); //toast message for success

  //Timings
  const [resendCooldown, setResendCooldown] = useState(0); //otpExpires Cooldown
  const [retryIn, setRetryIn] = useState(0); //after otp send cooldown timing
  const [freezeTimerLogin, setFreezeTimerLogin] = useState(0); //Blocked Timing
  const [isBlocked, setIsBlocked] = useState(false); //checks Blocked or not

  //Attempts
  const [attemptsLeftLogin, setAttemptsLeftLogin] = useState(5); //password Login Attempts
  const [attemptsLeftOTP, setAttemptsLeftOTP] = useState(3); //otp login Attempts
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(3); //otp verify attempts

  //loading
  const [otpLoading, setOtpLoading] = useState(false); //otp Loading
  const [loading, setLoading] = useState(false); //loading

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  // useEffect(() => {
  //   const token = Cookies.get("jwtToken");
  //   const userDetails = Cookies.get("userDetails");

  //   if (token && userDetails) {
  //     try {
  //       const user = JSON.parse(userDetails);
  //       switch (user.role) {
  //         case "jobseeker":
  //           navigate("/profile");
  //           break;
  //         case "hr":
  //           navigate("/hr");
  //           break;
  //         case "admin":
  //           navigate("/admin");
  //           break;
  //         case "superadmin":
  //           navigate("/superadmin");
  //           break;
  //         default:
  //           navigate("/");
  //       }
  //     } catch (err) {
  //       console.error("Invalid userDetails cookie:", err);
  //       // Cookies.remove("jwtToken");
  //       // Cookies.remove("userDetails");
  //     }
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Resend OTP cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const interval = setInterval(() => setResendCooldown((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendCooldown]);

  // RetryIn OTP cooldown
  useEffect(() => {
    if (retryIn > 0) {
      const interval = setInterval(() => setRetryIn((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [retryIn]);

  //Block Account cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      setFreezeTimerLogin((prev) => Math.max(prev - 1, 0));
    }, 1000);

    if (attemptsLeftOTP === 0 && freezeTimerLogin === 0 && isBlocked == true) {
      window.location.reload(); // 🔁 Auto reloads the page
    }

    return () => clearInterval(interval);
  }, [freezeTimerLogin]);

  // console.log(freezeTimerLogin, "freezeTimerLogin");

  const showToast = (type, message) => setToast({ type, message });

  const handleSendOTP = async () => {
    if (!email) {
      setErrorMsg("Email required.");
      return;
    }

    setOtpLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(`${apiUrl}/request-login-otp`, {
        email,
      });
      console.log(res, "res");
      const data = res.data;
      setToast({ type: "success", message: data.message });
      setResendCooldown(data.otpExpiresIn || 0);
      setRetryIn(data.retryIn || 0);
      setAttemptsLeftOTP(data.otpAttemptsLeft || 0);
      setOtpAttemptsLeft(data.otpVerifyAttemptsLeft || 0);
      setAttemptsLeftLogin(
        data?.attemptsLeft || data?.passwordAttemptsLeft || 0
      );
      setFreezeTimerLogin(data.remainingBlockSeconds || 0); // ✅ correct
      setIsBlocked((data.remainingBlockSeconds || 0) > 0); // ✅ correct
      setStep(2);
    } catch (error) {
      console.log(error, "error");
      const errData = error.response?.data || {};
      setErrorMsg(errData.error || "OTP request failed");
      console.log(errData, "errData");
      setResendCooldown(errData.otpExpiresIn || 0);
      setRetryIn(errData.retryIn || 0);
      setAttemptsLeftOTP(errData.otpAttemptsLeft || 0);
      setOtpAttemptsLeft(errData.otpVerifyAttemptsLeft || 0);
      setAttemptsLeftLogin(
        errData?.attemptsLeft || errData?.passwordAttemptsLeft || 0
      );
      console.log(
        errData?.remainingBlockSeconds,
        "errData?.error?.remainingBlockSeconds"
      );
      if (errData?.remainingBlockSeconds > 0) {
        setFreezeTimerLogin(errData?.remainingBlockSeconds || 0); // ✅ correct
        setIsBlocked((errData?.remainingBlockSeconds || 0) > 0); // ✅ correct
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    setOtpLoading(true);
    setIsBlocked(false);

    try {
      const res = await axios.post(`${apiUrl}/login-verify`, {
        email,
        otp: enteredOtp,
        type: "login",
      });

      const {
        token,
        data: user,
        remainingBlockSeconds,
        lockoutExpires,
        otpAttempts,
        otpAttemptsLeft,
        otpVerifyAttempts,
        otpVerifyAttemptsLeft,
        passwordAttempts,
        passwordAttemptsLeft,
      } = res.data;
      console.log("res", res);
      // ✅ Success: update hooks and redirect
      Cookies.set("jwtToken", token, { expires: 7 });
      Cookies.set("userDetails", JSON.stringify(res.data.data), { expires: 7 });

      setErrorMsg("");
      setOtp(Array(6).fill(""));
      setAttemptsLeftOTP(otpAttemptsLeft || 0);
      setOtpAttemptsLeft(otpVerifyAttemptsLeft || 0);
      setAttemptsLeftLogin(passwordAttemptsLeft || 0);
      setFreezeTimerLogin(0); // reset timer

      switch (user.role) {
        case "jobseeker":
          navigate("/profile");
          break;
        case "hr":
          navigate("/hr");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "superadmin":
          navigate("/superadmin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.log(err, "err");
      const {
        error,
        remainingBlockSeconds,
        otpAttemptsLeft,
        otpVerifyAttemptsLeft,
        passwordAttemptsLeft,
      } = err?.response?.data || {};
      console.log(remainingBlockSeconds, "remainingBlockSeconds");
      if (remainingBlockSeconds > 0) {
        setFreezeTimerLogin(remainingBlockSeconds);
        setIsBlocked((remainingBlockSeconds || 0) > 0); // ✅ correct
      }
      if (typeof otpAttemptsLeft === "number") {
        setAttemptsLeftOTP(otpAttemptsLeft);
      }
      if (typeof otpVerifyAttemptsLeft === "number") {
        setOtpAttemptsLeft(otpVerifyAttemptsLeft);
      }
      if (typeof passwordAttemptsLeft === "number") {
        setAttemptsLeftLogin(passwordAttemptsLeft);
      }

      setErrorMsg(error || "OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Email and password required.");
      return;
    }

    // if (isBlocked) {
    //   setToast({
    //     type: "error",
    //     message: `Please wait ${freezeTimerLogin}s before trying again.`,
    //   });
    //   return;
    // }

    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/login-password`, {
        email,
        password,
      });
      console.log(res, "res");

      const { token, data } = res.data;

      Cookies.set("jwtToken", token, { expires: 7 });
      Cookies.set("userDetails", JSON.stringify(data), { expires: 7 });
      setFreezeTimerLogin(0);
      setIsBlocked(false);

      switch (data.role) {
        case "jobseeker":
          navigate("/profile");
          break;
        case "hr":
          navigate("/hr");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "superadmin":
          navigate("/superadmin");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      const errData = error.response?.data || {};
      console.log(error, errData.attemptsLeft, "errorIkaa");
      setErrorMsg(errData.error || "Login failed");
      setRetryIn(errData.retryIn || 0);
      setAttemptsLeftLogin(errData?.passwordAttemptsLeft || 0);
      setAttemptsLeftOTP(errData.otpAttemptsLeft || 0);
      if (errData?.remainingBlockSeconds > 0) {
        setFreezeTimerLogin(errData?.remainingBlockSeconds || 0); // ✅ correct
        setIsBlocked((errData?.remainingBlockSeconds || 0) > 0); // ✅ correct
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    if (isBlocked || otpAttemptsLeft < 0 || resendCooldown > 0) return;

    if (!email) {
      setErrorMsg("Email required");
      return;
    }

    setOtpLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(`${apiUrl}/resend-login-otp`, { email });
      const data = res.data;
      console.log(res, "res");
      setOtp(Array(6).fill(""));
      setToast({
        type: "success",
        message: data.message || "OTP resent successfully",
      });

      setResendCooldown(data.otpExpiresIn || 0);
      setRetryIn(data.retryIn || 0);

      setAttemptsLeftOTP(data.otpAttemptsLeft || 0);
      setOtpAttemptsLeft(data.otpVerifyAttemptsLeft || 0);
      setAttemptsLeftLogin(
        data?.passwordAttemptsLeft || data?.attemptsLeft || 0
      );

      // setAttemptsLeftOTP(3 - (data.otpAttempts || 0));
      // setOtpAttemptsLeft(3 - (data.otpVerifyAttempts || 0));
      // setAttemptsLeftLogin(5 - (data.passwordAttempts || 0));

      setFreezeTimerLogin(data.remainingBlockSeconds || 0);
      setIsBlocked((data.remainingBlockSeconds || 0) > 0);
    } catch (error) {
      console.log(error, "error");
      const errData = error.response?.data || {};
      setErrorMsg(errData.error || "Failed to resend OTP");
      setResendCooldown(errData.otpExpiresIn || 0);
      setRetryIn(errData.retryIn || 0);

      setAttemptsLeftOTP(errData.otpAttemptsLeft || 0);
      setOtpAttemptsLeft(errData.otpVerifyAttemptsLeft || 0);
      setAttemptsLeftLogin(
        errData?.attemptsLeft || errData?.passwordAttemptsLeft || 0
      );

      // setAttemptsLeftOTP(3 - (errData.otpAttempts || 0));
      // setOtpAttemptsLeft(3 - (errData.otpVerifyAttempts || 0));
      // setAttemptsLeftLogin(5 - (errData.passwordAttempts || 0));

      setFreezeTimerLogin(errData.remainingBlockSeconds || 0);
      setIsBlocked((errData.remainingBlockSeconds || 0) > 0);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotPassword = () => navigate("/forgot-password");

  // console.log(freezeTimerLogin);

  // console.log(
  //   freezeTimerLogin > 0,
  //   otpAttemptsLeft < 0,
  //   resendCooldown < 0,
  //   otpLoading,
  //   "orlf"
  // );
  // console.log(attemptsLeftOTP, "attemptsLeftOTP");
  // console.log(
  //   attemptsLeftLogin,
  //   "password Login Attempts",
  //   attemptsLeftOTP,
  //   "otp login Attempts",
  //   otpAttemptsLeft,
  //   "otp verify attempts",
  //   errorMsg,
  //   "errorMsg",
  //   toast,
  //   "toast",
  //   resendCooldown,
  //   "otpExpires Cooldown",
  //   retryIn,
  //   "after otp send cooldown timing",
  //   freezeTimerLogin,
  //   "Blocked Timing",
  //   isBlocked,
  //   "isBlocked"
  // );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#bfdbfe] via-[#a5b4fc] to-[#93c5fd] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full"
      >
        <motion.div
          className="md:w-1/2 flex items-center justify-center bg-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7863.jpg?w=740"
            alt="OTP Illustration"
            className="w-full h-auto object-contain p-6"
          />
        </motion.div>

        <motion.div
          className="md:w-1/2 p-8 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>
          {email && resendCooldown > 0 && (
            <div className="text-green-600 bg-green-100 border border-green-300 mb-4 p-2 rounded font-medium text-sm">
              OTP sent to {email}
            </div>
          )}
          {isBlocked && freezeTimerLogin > 0 && (
            <div className="mb-4 text-sm text-red-600 font-medium bg-red-100 border border-red-300 p-2 rounded">
              Please wait {freezeTimerLogin}s before trying OTP again.
            </div>
          )}

          {resendCooldown > 0 && (
            <div className="mb-4 text-sm text-red-600 font-medium bg-red-100 border border-red-300 p-2 rounded">
              Please wait {resendCooldown}s before trying OTP again.
            </div>
          )}

          {errorMsg && !isBlocked && (
            <div
              className={`mb-4 text-sm ${
                errorMsg === "Please enter the complete 6-digit OTP."
                  ? "text-red-600  bg-green-100 border border-green-300"
                  : "text-red-600 font-medium bg-red-100 border border-red-300"
              }  font-medium  p-2 rounded`}
            >
              {errorMsg}
            </div>
          )}

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-4 p-3 rounded text-white font-medium text-center ${
                  toast.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP}>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      required
                    />
                    <Mail
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                </div>
                <div className="mb-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="mb-6 text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:underline text-sm font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            <AnimatePresence>
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp(Array(6).fill(""));
                        setErrorMsg("");
                        setAttemptsLeftOTP(3);
                        setFreezeTimerOTP(0);
                      }}
                      className="text-gray-600 hover:underline text-sm"
                    >
                      &larr; Login with Password
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <div className="flex justify-center gap-2 mb-3">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center border border-gray-400 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        whileFocus={{ scale: 1.1 }}
                        disabled={
                          retryIn < 0 ||
                          otpAttemptsLeft < 0 ||
                          resendCooldown < 0 ||
                          freezeTimerLogin > 0
                        }
                      />
                    ))}
                  </div>
                  {/* <p className="text-red-500 text-sm">
                    The OTP is send to {email}
                  </p> */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={
                        resendCooldown > 0 ||
                        retryIn > 0 ||
                        freezeTimerLogin > 0
                      }
                      className={`text-blue-600 hover:underline text-sm ${
                        resendCooldown > 0 ||
                        retryIn > 0 ||
                        freezeTimerLogin > 0
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      {retryIn > 0
                        ? `Wait ${resendCooldown}s to resend OTP`
                        : resendCooldown > 0
                        ? `Resend OTP in ${resendCooldown}s`
                        : `Resend OTP (${attemptsLeftOTP} Left)`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step === 1 ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleTraditionalLogin}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isBlocked || loading || freezeTimerLogin > 0}
                  className={`w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300  ${
                    isBlocked || loading || freezeTimerLogin > 0
                      ? "bg-gray-300 cursor-not-allowed text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {loading
                    ? "Logging in..."
                    : `Login (${attemptsLeftLogin} Left)`}
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={
                    otpLoading ||
                    otpAttemptsLeft < 0 ||
                    retryIn > 0 ||
                    freezeTimerLogin > 0
                  }
                  className={`w-full bg-blue-600 text-white py-2 rounded-md transition duration-300 ${
                    otpLoading ||
                    otpAttemptsLeft < 0 ||
                    retryIn > 0 ||
                    freezeTimerLogin > 0
                      ? "bg-blue-100 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {retryIn > 0
                    ? `Try again in ${retryIn}s`
                    : otpLoading
                    ? "Sending..."
                    : `Login with OTP (${attemptsLeftOTP} left)`}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={
                  otpAttemptsLeft < 0 ||
                  resendCooldown < 0 ||
                  otpLoading ||
                  freezeTimerLogin > 0
                }
                className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
                  otpAttemptsLeft < 0 ||
                  resendCooldown < 0 ||
                  freezeTimerLogin > 0 ||
                  otpLoading
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                Verify OTP ({otpAttemptsLeft})
              </button>
            )}
          </form>
          <div className="mt-4 flex justify-between">
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
            >
              <Home size={16} /> Go To Home
            </span>
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
            >
              <UserPlus size={16} /> Go to Register now
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
