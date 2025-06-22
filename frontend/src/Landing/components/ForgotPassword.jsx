import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Home, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const interval = setInterval(() => setResendCooldown((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendCooldown]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSuccess(true);
      setResendCooldown(60);
      toast.success(`Password reset link sent to ${email}!`);
      
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendCooldown(60);
      toast.success(`Reset link resent to ${email}!`);
      
    } catch (error) {
      toast.error("Failed to resend reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#bfdbfe] via-[#a5b4fc] to-[#93c5fd] p-6">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full"
      >
        {/* Left Side Image */}
        <motion.div
          className="md:w-1/2 flex items-center justify-center bg-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?t=st=1716381507~exp=1716385107~hmac=5d0257721ec8305b24ce9fc65852b3d7879b1402e02ff02c68dba861e0fd2572&w=740"
            alt="Forgot Password"
            className="w-full h-auto object-contain p-6"
          />
        </motion.div>

        {/* Right Side Form */}
        <motion.div
          className="md:w-1/2 p-8 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Forgot Password
          </h2>
          
          <p className="text-gray-600 text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition duration-300 ${
                    loading
                      ? "bg-blue-300 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading && <Loader2 className="animate-spin h-5 w-5" />}
                  {loading ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <span className="font-medium text-gray-800">{email}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>

                <div className="space-y-3">
                  <motion.button
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition duration-300 ${
                      resendCooldown > 0 || loading
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {loading && <Loader2 className="animate-spin h-5 w-5" />}
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Email"}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                      setResendCooldown(0);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 text-blue-600 hover:text-blue-700 transition duration-300"
                  >
                    Try a different email
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-between items-center">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
            >
              <Home size={16} /> Go To Home
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Back to Login
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
