import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useInitializeCsrf } from "./hooks/useInitializeCsrf";
import Loader from "./components/common/Loader";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Guards
import ProtectedRoute from "./components/common/ProtectedRoute";
import AlumniProfileRoute from"./components/common/AlumniProfileRoute";

// Layouts
import AlumniLayout from "./components/layout/AlumniLayout";
import DeveloperLayout from "./components/layout/DeveloperLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Alumni
import ProfilePage from "./pages/alumni/ProfilePage";
import BiddingPage from "./pages/alumni/BiddingPage";
import InitialProfileSetupPage from "./pages/alumni/InitialProfileSetupPage";

// Developer
import ApiKeyPage from "./pages/developer/ApiKeyPage";

// Dashboard
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import AlumniDirectoryPage from "./pages/dashboard/AlumniDirectoryPage";

import Unauthorized from "./pages/auth/Unauthorized"; 

function App() {
  useInitializeCsrf();
  const { authLoading } = useAuth();
  if (authLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= ALUMNI ================= */}
        <Route
          path="/alumni/setup"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniLayout>
                <InitialProfileSetupPage />
              </AlumniLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumni/profile"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniProfileRoute>
                <AlumniLayout>
                  <ProfilePage />
                </AlumniLayout>
              </AlumniProfileRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumni/bidding"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniProfileRoute>
                <AlumniLayout>
                  <BiddingPage />
                </AlumniLayout>
              </AlumniProfileRoute>
            </ProtectedRoute>
          }
        />

        {/* ================= DEVELOPER ================= */}
        <Route
          path="/developer/api-keys"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DeveloperLayout>
                <ApiKeyPage />
              </DeveloperLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["dashboard"]}>
              <DashboardLayout>
                <DashboardHomePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/directory"
          element={
            <ProtectedRoute allowedRoles={["dashboard"]}>
              <DashboardLayout>
                <AlumniDirectoryPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;