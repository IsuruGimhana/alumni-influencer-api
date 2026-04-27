import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import Loader from "../../components/common/Loader";

export default function AlumniProfileRoute({ children }) {
  const { user } = useAuth();
  const { profile, loadingProfile } = useProfile();

  // ONLY load profile for alumni routes
  if (loadingProfile) return <Loader />;

  if (!profile) {
    return <Navigate to="/alumni/setup" replace />;
  }

  return children;
}