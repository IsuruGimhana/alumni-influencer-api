import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as authService from "../../api/authService";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    authService.verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/"), 2500);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="mb-4">
          {status === "loading" && (
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
          )}

          {status === "success" && (
            <div className="text-green-500 text-5xl">✔</div>
          )}

          {status === "error" && (
            <div className="text-red-500 text-5xl">✖</div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">
          {status === "loading" && "Verifying Email"}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {status === "loading" &&
            "Please wait while we verify your email address..."}
          {status === "success" &&
            "Your email has been successfully verified. Redirecting you to login..."}
          {status === "error" &&
            "This link is invalid or has expired. Please request a new verification email."}
        </p>

        {/* Action Button */}
        {status !== "loading" && (
          <button
            onClick={() => navigate("/")}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              status === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}