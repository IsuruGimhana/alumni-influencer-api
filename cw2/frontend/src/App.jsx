import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/auth/DashboardPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

import InitialProfileSetupPage from "./pages/profile/InitialProfileSetupPage";
import ProfilePage from "./pages/profile/ProfilePage";

import { useAuth } from "./hooks/useAuth";
import Loader from "./components/common/Loader";

function App() {
  
  const { authLoading } = useAuth();
  if (authLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["dashboard"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-profile" 
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <InitialProfileSetupPage />
            </ProtectedRoute>
          }
        />        
      </Routes>
    </BrowserRouter>
  );
}

export default App;