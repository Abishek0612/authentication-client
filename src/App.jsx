import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OTPVerification from "./Auth/OTP/otpVerification";
import ForgotPassword from "./Auth/ForgotPassword/forgotPassword";
import AuthPage from "./Auth/AuthPage/authForm";
import Layout from "./components/Layout";
import Home from "./Pages/HomePage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
