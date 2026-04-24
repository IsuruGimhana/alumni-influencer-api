import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as authService from "../../api/authService";
import { normalizeError } from "../../utils/normalizeError";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setLoading(true);
    setSuccess("");

    try {
      const res = await authService.resetPassword(token, password);

      setSuccess(res?.data?.msg || "Password reset successful");

      setPassword("");

      // optional redirect after delay
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-1">
          Reset Password
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>

          {/* Input */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              onChange={(e) =>
                setPassword(e.target.value )
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full mb-3 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Error */}
          {error.length > 0 && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                {error.map((e, i) => (
                  <li key={i}>{e.msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
              {success}
            </div>
          )}

        </form>

      </div>
    </div>
  );
}