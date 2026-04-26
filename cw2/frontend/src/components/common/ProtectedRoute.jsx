// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   if (!user) return <Navigate to="/" />;

//   return children;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // 2. Check if user role is authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "alumni") {
      return <Navigate to="/profile" replace />;
    }

    if (user.role === "dashboard") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}