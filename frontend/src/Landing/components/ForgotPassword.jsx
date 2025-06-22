import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Home, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../utilits/apiUrl";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleResetPasswords = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email.");
    setSubmitted(true);
    setTimeout(() => {
      alert(`Password reset link sent to ${email}`);
    }, 500);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const { data } = await axios.post(`${apiUrl}/forgot-password`, { email });
      console.log(data, "data");
      console.log("Reset email sent:", data.message);
      setSubmitted(false);
      setTimeout(() => {
        alert(data.message);
      }, 500);
    } catch (err) {
      console.log("Reset email sent:", err);
      setSubmitted(false);
      setTimeout(() => {
        alert(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed Resent Link"
        );
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#bfdbfe] via-[#a5b4fc] to-[#93c5fd] p-6">
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
            alt="Forgot Illustration"
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
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your registered email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f52ba] text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              {submitted ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center">
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-semibold cursor-pointer transition-all duration-200 hover:underline hover:text-blue-700 flex items-center gap-1"
            >
              <Home size={16} /> Go To Home
            </motion.button>

            <motion.button
              onClick={() => navigate("/login")}
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
