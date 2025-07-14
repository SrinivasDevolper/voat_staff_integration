import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Home, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { apiUrl } from "../../utilits/apiUrl";
import Cookies from "js-cookie";

export default function Register() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("left");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  //OTP code
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  // Attempts logic
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [lockTimer, setLockTimer] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  //verify OTP
  const [verifyAttemptsLeft, setVerifyAttemptsLeft] = useState(3);
  const [isBlockTime, setIsBlockTime] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    const userDetails = Cookies.get("userDetails");

    if (token && userDetails) {
      try {
        const user = JSON.parse(userDetails);
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
        console.error("Invalid userDetails cookie:", err);
        // Cookies.remove("jwtToken");
        // Cookies.remove("userDetails");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (otpExpiresIn > 0) {
      const interval = setInterval(() => {
        setOtpExpiresIn((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiresIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => Math.max(prev - 1, 0));
      setLockTimer((prev) => Math.max(prev - 1, 0));
      setOtpExpiresIn((prev) => Math.max(prev - 1, 0));
    }, 1000);

    // ✅ Handle auto-reload condition separately
    if (attemptsLeft === 0 && lockTimer === 0 && isBlockTime == true) {
      window.location.reload(); // 🔁 Auto reloads the page
    }

    return () => clearInterval(interval);
  }, [attemptsLeft, lockTimer]);
  // ✅ include in deps

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const validateName = (name) => /^[a-zA-Z\s]{3,50}$/.test(name.trim());
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(
      password
    );
  const validateFile = (file) => file && file.type === "application/pdf";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  //handle otpChange
  const handleOtpChange = (e, idx) => {
    if (lockTimer > 0) return; // disable input if locked
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (idx < 5) inputRefs.current[idx + 1].focus();
  };

  //handle OtpKeyDown
  const handleOtpKeyDown = (e, idx) => {
    if (lockTimer > 0) return; // disable input if locked
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1].focus();
      }
    }
  };

  //handle GetOtp
  const handleGetOtp = async (e, isResend = false) => {
    if (e) e.preventDefault();

    // if (!validateName(name)) {
    //   toast.error(
    //     "Invalid Name. Only alphabets and spaces allowed (3-50 chars)."
    //   );
    //   return;
    // }
    if (!validateEmail(email)) {
      toast.error("Invalid Email format.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must be 8+ chars with uppercase, lowercase, digit, special char."
      );
      return;
    }
    if (activeTab === "left" && !validateFile(selectedFile)) {
      toast.error("Please upload a valid PDF resume.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("role", activeTab === "left" ? "jobseeker" : "hr");
      if (activeTab === "left") {
        formData.append("file", selectedFile);
      }

      const { data } = await axios.post(`${apiUrl}/signup`, formData);
      console.log(data, "data");
      setTempToken(data.tempToken);
      toast.success(data?.message);

      // Set timers ONLY if valid resend state
      // if (!isResend || data.otpExpiresIn >= 60) {
      //   setOtpExpiresIn(60);
      // }
      setResendTimer(data?.retryIn || 0);
      setOtpExpiresIn(data?.otpExpiresIn || 0);
      setAttemptsLeft(data?.attemptsLeft ?? 3);
      setVerifyAttemptsLeft(data?.otpVerifyAttempts);
      setLockTimer(data?.blockDuration || 0);
      if (data?.blockDuration) {
        setIsBlockTime(true);
      }
      //Otp
      setShowOtp(true);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      const data = error.response?.data;
      console.log(data, error, "error");
      toast.error(data?.error || "Failed to send OTP, please try again.");
      console.log(resendTimer, "resendTimer");
      // Always respect backend timing on error
      setResendTimer(data?.retryIn || 0);
      console.log(resendTimer, "resendTimer");
      setOtpExpiresIn(data?.otpExpiresIn || 0);
      setAttemptsLeft(data?.attemptsLeft ?? 0);
      setLockTimer(data?.blockDuration || 0);
      if (data?.blockDuration) {
        setIsBlockTime(true);
      }
      //otp
      // setShowOtp(true);
      // setOtp(new Array(6).fill(""));
      // inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  //handle verifyOtp
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (lockTimer > 0) {
      toast.error(`Too many attempts. Please wait ${lockTimer}s.`);
      return;
    }
    if (otp.includes("")) {
      toast.error("Please enter complete OTP.");
      return;
    }

    if (otpExpiresIn === 0) {
      toast.error("OTP expired");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/signup-verify-otp`, {
        email,
        otp: otp.join(""),
        tempToken,
        type: "signup",
      });
      const { message, token, data } = response.data; // ✅ CORRECT ACCESS
      console.log(response, data, "data");

      // Store token and user data in cookies
      Cookies.set("jwtToken", token, { expires: 7 }); // Set cookie to expire in 7 days
      Cookies.set("userDetails", JSON.stringify(data), { expires: 7 }); // Set cookie to expire in 7 days

      toast.success(message || "Registration successful!");
      setShowOtp(false);
      setLoading(false);
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      console.log(error);
      const errData = error.response?.data || {};
      toast.error(errData.error || "OTP verification failed.");
      setVerifyAttemptsLeft(errData.otpVerifyAttemptsLeft || 0);
      setLockTimer(errData.remainingBlockSeconds || 0);
      setIsBlockTime((errData.remainingBlockSeconds || 0) > 0);
    } finally {
      setLoading(false);
    }
  };

  //handle resendOtp
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(`${apiUrl}/resend-signup-otp`, {
        email,
        tempToken,
      });
      console.log(data, "data");
      toast.success(data.message || "OTP resent successfully!");
      setTempToken(data?.tempToken);
      // Update states from backend response
      setResendTimer(data.retryIn); // starts cooldown
      setOtpExpiresIn(data.otpExpiresIn);
      setAttemptsLeft(data.attemptsLeft ?? attemptsLeft);
      setVerifyAttemptsLeft(data.verifyAttemptsLeft ?? 3);
      setOtp(new Array(6).fill("")); // reset OTP input
    } catch (error) {
      console.log(error, "error");
      const errMsg = error.response?.data?.error || "Failed to resend OTP.";
      toast.error(errMsg);
      const res = error.response?.data;
      setOtpExpiresIn(res.otpExpiresIn ?? 0);
      if (res?.retryIn) {
        setResendTimer(res.retryIn);
      }

      if (res?.blockExpires || res?.remainingBlockSeconds) {
        setLockTimer(res.remainingBlockSeconds);
        setAttemptsLeft(data.attemptsLeft ?? attemptsLeft);
        setVerifyAttemptsLeft(data.verifyAttemptsLeft ?? verifyAttemptsLeft);
      }

      if (typeof res?.attemptsLeft === "number") {
        setAttemptsLeft(data.attemptsLeft ?? attemptsLeft);
        // Wrong OTP case
        setAttemptsLeft((prev) => prev - 1);
        toast.error(
          `Incorrect OTP. Attempts left: ${
            attemptsLeft - 1 > 0 ? attemptsLeft - 1 : 0
          }`
        );
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();

        if (attemptsLeft - 1 <= 0) {
          setLockTimer(60); // lock for 60 seconds
          toast.error("Too many wrong attempts. Please wait 60 seconds.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  // console.log(lockTimer, verifyAttemptsLeft, "verifyBlockTimer");

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-100 transition-colors duration-500">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden bg-white"
      >
        <div className="md:w-1/2 hidden md:block">
          <img
            src="https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-online-registration_516790-1807.jpg"
            alt="Register"
            className="h-full w-full object-cover p-6"
          />
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-center items-center">
          {!showOtp && (
            <div className="mb-6 flex justify-center w-full max-w-md">
              <div className="flex bg-gray-100 rounded-full p-1 relative w-[200px]">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 w-1/2 bg-blue-500 center rounded-full z-0"
                  animate={{ x: activeTab === "right" ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button
                  className={`w-1/2 relative z-10 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                    activeTab === "left"
                      ? "bg-blue-500 text-white"
                      : "text-blue-600"
                  }`}
                  onClick={() => setActiveTab("left")}
                >
                  User
                </button>
                <button
                  className={`w-1/2 relative z-10 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                    activeTab === "right"
                      ? "bg-blue-500 text-white"
                      : "text-blue-600"
                  }`}
                  onClick={() => setActiveTab("right")}
                >
                  HR
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showOtp ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-4"
              >
                <h2 className="text-center text-2xl font-bold mb-6 text-gray-900">
                  Create an Account
                </h2>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      if (/^[a-zA-Z\s]*$/.test(e.target.value))
                        setName(e.target.value);
                    }}
                    maxLength={50}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder-blue-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={100}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white placeholder-blue-400"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="relative">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    maxLength={30}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-m text-gray-900  placeholder-blue-400 bg-white"
                    placeholder="Min 8 chars with upper, lower, digit & special"
                  />
                  <span
                    className="absolute top-9 right-3 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>

                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Password strength:</span>
                      <span
                        className={`font-medium ${getPasswordStrengthColor().replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div
                        className={`flex items-center gap-1 ${
                          password.length >= 8 ? "text-green-600" : ""
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        At least 8 characters
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          /[A-Z]/.test(password) ? "text-green-600" : ""
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        One uppercase letter
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          /[a-z]/.test(password) ? "text-green-600" : ""
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        One lowercase letter
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          /[0-9]/.test(password) ? "text-green-600" : ""
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        One number
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                            ? "text-green-600"
                            : ""
                        }`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        One special character
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "left" && (
                  <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Upload Resume (PDF, DOC, or DOCX)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="file-upload"
                      />
                      <div
                        className={`border-2 border-dashed rounded-lg p-3 text-center transition-all duration-300 bg-white ${
                          isDragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {selectedFile ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                document.getElementById("file-upload").value =
                                  "";
                              }}
                              className="text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, or DOCX (max 10MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={handleGetOtp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading || lockTimer > 0 || resendTimer > 0}
                  className={`w-full font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center ${
                    loading || lockTimer > 0 || resendTimer > 0
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800 text-white"
                  }`}
                >
                  {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                  Get OTP ({attemptsLeft} Left)
                </motion.button>

                {resendTimer > 0 && (
                  <p className="text-red-400 font-medium">
                    Please wait {resendTimer}s before requesting another OTP.
                  </p>
                )}

                {lockTimer > 0 && (
                  <p className="mb-4 text-red-400 font-semibold">
                    Account is temporarily blocked for {lockTimer}s.
                  </p>
                )}

                <div className="mt-4 flex justify-between">
                  <span
                    onClick={() => navigate("/")}
                    className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
                  >
                    <Home size={16} /> Go To Home
                  </span>
                  <span
                    onClick={() => navigate("/login")}
                    className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
                  >
                    <UserPlus size={16} /> Go to Login Now
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md flex flex-col items-center"
              >
                <h2 className="text-center text-2xl font-bold mb-6 text-gray-900">
                  Enter OTP
                </h2>
                <div className="flex space-x-2 mb-4">
                  {otp.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      disabled={loading || lockTimer > 0 || otpExpiresIn === 0}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      className={`w-10 h-12 text-center text-lg border rounded-md ${
                        lockTimer > 0
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    />
                  ))}
                </div>
                <motion.button
                  onClick={handleVerifyOtp}
                  disabled={loading || lockTimer > 0} // verifyBlockTimer, verifyAttemptsLeft,
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full font-semibold py-2 rounded-lg transition duration-300 flex items-center justify-center ${
                    loading || lockTimer > 0
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800 text-white"
                  }`}
                >
                  {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                  Verify OTP (
                  {verifyAttemptsLeft <= 1
                    ? verifyAttemptsLeft
                    : verifyAttemptsLeft + "s"}
                  )
                </motion.button>
                {lockTimer > 0 && (
                  <p className="mb-4 text-red-400 font-semibold">
                    Too many wrong attempts. Please wait {lockTimer}s.
                  </p>
                )}
                <p className="mt-4 text-gray-600">
                  Didn't receive OTP?{" "}
                  {otpExpiresIn <= 0 && (
                    <button
                      onClick={(e) => {
                        if (otpExpiresIn === 0 && !loading) handleResendOtp();
                      }}
                      disabled={otpExpiresIn !== 0 || loading || lockTimer > 0}
                      className={`text-blue-600 underline cursor-pointer ${
                        otpExpiresIn !== 0
                          ? "cursor-not-allowed text-gray-400"
                          : ""
                      }`}
                    >
                      Resend OTP (
                      {attemptsLeft <= 1
                        ? attemptsLeft + "left"
                        : attemptsLeft + "lefts"}
                      ) {otpExpiresIn > 0 && `(${otpExpiresIn}s)`}
                    </button>
                  )}
                  {otpExpiresIn > 0 && `(${otpExpiresIn}s)`}
                </p>
                <p
                  onClick={() => {
                    setShowOtp(false);
                    setOtp(new Array(6).fill(""));
                    // setAttemptsLeft(3);
                    // setLockTimer(0);
                  }}
                  className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer"
                >
                  Back to Signup
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
