import { useState } from "react";
import * as authService from "../../api/authService";
import { normalizeError } from "../../utils/normalizeError";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setLoading(true);
    setSuccess("");

    try {
      const res = await authService.forgotPassword(email);
      setSuccess(res?.data?.msg);
      setEmail("");
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
          Forgot Password
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            required
            placeholder="University Email"
            value={email}
            className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full mb-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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