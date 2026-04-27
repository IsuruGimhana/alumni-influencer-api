import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

import InitialProfileSetupPage from "./pages/alumni/InitialProfileSetupPage";

import { useAuth } from "./hooks/useAuth";
import Loader from "./components/common/Loader";

import AlumniLayout from "./components/layout/AlumniLayout";
import ArAppLayout from "./components/layout/ArAppLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import ProfilePage from "./pages/alumni/ProfilePage";
import BiddingPage from "./pages/alumni/BiddingPage";

import DashboardPage from "./pages/auth/DashboardPage";

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

        {/* ALUMNI */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniLayout>
                <ProfilePage />
              </AlumniLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bidding"
          element={
            <ProtectedRoute allowedRoles={["alumni"]}>
              <AlumniLayout>
                <BiddingPage />
              </AlumniLayout>
            </ProtectedRoute>
          }
        />

        {/* AR APP */}
        <Route
          path="/alumni-of-day"
          element={
            <ProtectedRoute allowedRoles={["ar_app"]}>
              <ArAppLayout>
                <div>Alumni of the Day</div>
              </ArAppLayout>
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["dashboard"]}>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route path="/bidding" element={<BiddingPage />} /> */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}

        {/* <Route
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
        />         */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;