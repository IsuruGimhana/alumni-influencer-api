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
import Loader from "../../components/common/Loader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, authLoading } = useAuth();

  if (authLoading) return <Loader />;

  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}