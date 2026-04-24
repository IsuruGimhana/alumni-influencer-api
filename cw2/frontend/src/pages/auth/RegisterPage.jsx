import RegisterForm from "../../components/auth/RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-1">
          Alumni Portal
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Create your account
        </p>

        {/* Form */}
        <RegisterForm />

        {/* Footer */}
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}