import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center font-sans">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 text-center max-w-md w-full">

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldX className="text-red-500 w-8 h-8" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-sm text-gray-600 mt-2">
          You don’t have permission to view this page.
        </p>

        <p className="text-xs text-gray-400 mt-4">
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Action button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
}