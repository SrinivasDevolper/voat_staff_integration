import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Eye, EyeOff, Home, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../utilits/apiUrl";

export default function OTPLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [attemptsLeftLogin, setAttemptsLeftLogin] = useState(3);
  const [attemptsLeftOTP, setAttemptsLeftOTP] = useState(3);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [freezeTimerLogin, setFreezeTimerLogin] = useState(0);
  const [freezeTimerOTP, setFreezeTimerOTP] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(3);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isOtpBlocked, setIsOtpBlocked] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("loginBlockExpiresAt");
    if (stored) {
      const expiresAt = parseInt(stored, 10);
      const now = Date.now();
      if (expiresAt > now) {
        const secondsLeft = Math.ceil((expiresAt - now) / 1000);
        setFreezeTimerLogin(secondsLeft);
        setIsBlocked(true);
      } else {
        localStorage.removeItem("loginBlockExpiresAt");
        setIsBlocked(false);
      }
    }
  }, []);

  // Toast auto-clear
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

  // Freeze timer countdown for login
  // useEffect(() => {
  //   if (freezeTimerLogin > 0) {
  //     const interval = setInterval(() => {
  //       setFreezeTimerLogin((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(interval);
  //           localStorage.removeItem("loginBlockExpiresAt");
  //           setIsBlocked(false);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [freezeTimerLogin]);
  useEffect(() => {
    if (freezeTimerLogin > 0) {
      const interval = setInterval(() => {
        setFreezeTimerLogin((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            localStorage.removeItem("loginBlockExpiresAt");
            setIsBlocked(false); // ✅ Release block
            setErrorMsg(""); // ✅ Clear error UI
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (freezeTimerLogin === 0 && isBlocked) {
      // Edge case backup
      setIsBlocked(false);
    }
  }, [freezeTimerLogin]);

  // Freeze timer countdown for OTP
  useEffect(() => {
    if (freezeTimerOTP > 0) {
      const interval = setInterval(() => {
        setFreezeTimerOTP((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (freezeTimerOTP === 0 && attemptsLeftOTP === 0) {
      setAttemptsLeftOTP(3);
    }
  }, [freezeTimerOTP]);

  useEffect(() => {
    const stored = localStorage.getItem("otpBlockExpiresAt");
    if (stored) {
      const expiresAt = parseInt(stored, 10);
      const now = Date.now();
      if (expiresAt > now) {
        const remaining = Math.ceil((expiresAt - now) / 1000);
        setOtpCooldown(remaining);
        setIsOtpBlocked(true);
        setOtpAttemptsLeft(0);
      } else {
        localStorage.removeItem("otpBlockExpiresAt");
      }
    }
  }, []);

  useEffect(() => {
    if (otpCooldown > 0) {
      const interval = setInterval(() => {
        setOtpCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsOtpBlocked(false);
            setOtpAttemptsLeft(3);
            localStorage.removeItem("otpBlockExpiresAt");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpCooldown]);

  useEffect(() => {
    const stored = localStorage.getItem("resendCooldownExpiresAt");
    if (stored) {
      const expiresAt = parseInt(stored, 10);
      const now = Date.now();
      if (expiresAt > now) {
        const seconds = Math.ceil((expiresAt - now) / 1000);
        setResendCooldown(seconds);
      } else {
        localStorage.removeItem("resendCooldownExpiresAt");
      }
    }
  }, []);

  const showToast = (type, message) => setToast({ type, message });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (isOtpBlocked) {
      setErrorMsg(`Please wait ${otpCooldown}s before trying again.`);
      return;
    }

    setOtpLoading(true);
    setErrorMsg("");
    try {
      // Simulate sending OTP
      const generatedOTP = "123456"; // This would be the OTP sent to email
      localStorage.setItem("tempOTP", generatedOTP);
      setStep(2);
      setErrorMsg(`OTP sent to ${email}`);
      setOtpAttemptsLeft(3);
      setResendCooldown(60);
    } catch (error) {
      setErrorMsg("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    if (isOtpBlocked) {
      setErrorMsg(`Please wait ${otpCooldown}s before trying again.`);
      return;
    }

    setLoading(true);
    try {
      const storedOTP = localStorage.getItem("tempOTP");
      if (enteredOtp !== storedOTP) {
        setOtpAttemptsLeft((prev) => prev - 1);
        if (otpAttemptsLeft <= 1) {
          setOtpCooldown(60);
          setIsOtpBlocked(true);
          setErrorMsg("Too many wrong attempts. Please wait 60 seconds.");
        } else {
          setErrorMsg(`Invalid OTP. ${otpAttemptsLeft - 1} attempts remaining.`);
        }
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      // OTP is correct
      setErrorMsg("OTP verified successfully!");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Proceed with login
      localStorage.setItem("token", "dummy-token");
      localStorage.removeItem("tempOTP");
      setErrorMsg("");
      setOtpAttemptsLeft(3);
      setOtp(Array(6).fill(""));
      
      // Navigate based on role (defaulting to jobseeker for now)
      navigate("/profile");
    } catch (err) {
      setErrorMsg("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    if (!password) {
      setErrorMsg("Password is required");
      return;
    }

    setLoading(true);
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("token", "dummy-token");
      navigate("/profile");
    } catch (error) {
      setErrorMsg("Login failed. Please try again.");
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
    if (resendCooldown > 0 || isOtpBlocked) return;

    setOtpLoading(true);
    setErrorMsg("");
    try {
      const generatedOTP = "123456";
      localStorage.setItem("tempOTP", generatedOTP);
      setResendCooldown(60);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setErrorMsg(`OTP resent to ${email}`);
    } catch (err) {
      setErrorMsg("Failed to resend OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotPassword = () => navigate("/forgot-password");

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
          {isBlocked && freezeTimerLogin > 0 && (
            <div className="mb-4 text-sm text-red-600 font-medium bg-red-100 border border-red-300 p-2 rounded">
              Please wait {freezeTimerLogin}s before trying OTP again.
            </div>
          )}

          {isOtpBlocked && otpCooldown > 0 && (
            <div className="mb-4 text-sm text-red-600 font-medium bg-red-100 border border-red-300 p-2 rounded">
              Please wait {otpCooldown}s before trying OTP again.
            </div>
          )}

          {errorMsg && !isBlocked && !isOtpBlocked && (
            <div
              className={`mb-4 text-sm ${
                errorMsg.includes("OTP sent to") || errorMsg.includes("OTP resent to") || errorMsg === "OTP verified successfully!"
                  ? "text-green-600 bg-green-100 border border-green-300"
                  : "text-red-600 font-medium bg-red-100 border border-red-300"
              } p-2 rounded`}
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
                      setErrorMsg(""); // Clear error when user types
                      if (step === 2) {
                        setStep(1);
                        setOtp(Array(6).fill(""));
                        setErrorMsg("");
                        setAttemptsLeftOTP(3);
                        setFreezeTimerOTP(0);
                      }
                    }}
                    required
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    title="Please enter a valid email address"
                  />
                  <Mail
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <>
                <div className="mb-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
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
                  <label className="block text-sm font-medium text-bold text-gray-700 mb-2">Enter OTP</label>

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
                        disabled={freezeTimerOTP > 0}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || freezeTimerOTP > 0}
                      className={`text-blue-600 hover:underline text-sm ${
                        resendCooldown > 0 || freezeTimerOTP > 0
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      {freezeTimerOTP > 0
                        ? `Wait ${freezeTimerOTP}s to resend OTP`
                        : resendCooldown > 0
                        ? `Resend OTP in ${resendCooldown}s`
                        : "Resend OTP"}
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
                  disabled={isBlocked || loading}
                  className={`w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300  ${
                    isBlocked || loading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {loading
                    ? "Logging in..."
                    : isBlocked
                    ? `Try again in ${freezeTimerLogin}s`
                    : "Login"}
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpLoading || isOtpBlocked || otpAttemptsLeft < 0}
                  className={`w-full bg-blue-600 text-white py-2 rounded-md transition duration-300 ${
                    otpLoading || isOtpBlocked || otpAttemptsLeft < 0
                      ? "bg-blue-300 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isOtpBlocked && otpCooldown > 0
                    ? `Try again in ${otpCooldown}s`
                    : otpLoading
                    ? "Sending..."
                    : "Login with OTP"}
                </button>
              </div>
            ) : (
              
              <button
                type="submit"
                disabled={freezeTimerOTP > 0 || loading}
                className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
                  freezeTimerOTP > 0 || loading
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-4 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                      <div className="w-1.5 h-4 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]"></div>
                      <div className="w-1.5 h-4 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_0.4s_infinite]"></div>
                      <div className="w-1.5 h-4 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_0.6s_infinite]"></div>
                    </div>
                    <span className="ml-2">Logging in...</span>
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
              
            )}
             
             
            
          </form>
          {/* <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Not registered?</span>{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Register now
            </a>
          </div> */}
    <div className="mt-4 flex justify-between">
      <span
        onClick={() => navigate('/')}
        className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
      >
        <Home size={16} /> Go To Home
      </span>
      <span
        onClick={() => navigate('/register')}
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
