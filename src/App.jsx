import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResetPassword from "./Auth/ResetPassword/resetPassword";
import OTPVerification from "./Auth/OTP/otpVerification";
import ForgotPassword from "./Auth/ForgotPassword/forgotPassword";
import AuthPage from "./Auth/AuthPage/authForm";
import FirstTimePassword from "./Auth/FirstTimePassword/FirstTimePassword";
import Layout from "./components/Layout";
import Home from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import DashboardPage from "./Pages/DashboardPage";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/variables.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/first-time-password"
              element={
                <ProtectedRoute>
                  <FirstTimePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
