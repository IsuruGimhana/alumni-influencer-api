import LoginForm from "../../components/auth/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-1">
          Alumni Portal
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        {/* Form */}
        <LoginForm />

        {/* Links */}
        <div className="mt-4 text-center text-sm space-y-2">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>

          <div>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}