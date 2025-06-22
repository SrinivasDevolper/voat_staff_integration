import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { apiUrl } from "../../utilits/apiUrl";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // <-- loading state
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return pattern.test(pwd);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include a number and a special character."
      );
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true); // <-- start loading
      await axios.post(`${apiUrl}/reset-password`, {
        email,
        token,
        oldPassword: password,
        newPassword: confirm,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Something went wrong while resetting the password.";
      setError(msg);
    } finally {
      setLoading(false); // <-- stop loading
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full p-8 md:p-10 border">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">
          Reset Password
        </h2>

        {success ? (
          <div className="text-green-700 font-semibold text-center space-y-4">
            <p>Your password has been successfully reset.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <input type="hidden" value={email} />
            <input type="hidden" value={token} />

            <div className="relative">
              <label className="block mb-2 font-semibold text-gray-700">
                New Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading} // disable input when loading
              />
              <div
                onClick={() => setShowPass(!showPass)}
                className="absolute top-10 right-4 cursor-pointer text-gray-500"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <div className="relative">
              <label className="block mb-2 font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading} // disable input when loading
              />
              <div
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-10 right-4 cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {error && (
              <div className="text-red-600 font-medium text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white font-semibold py-3 rounded-lg text-lg transition`}
            >
              {loading ? "Loading..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Previous Page
          </button>
        </div>
      </div>
    </section>
  );
}
