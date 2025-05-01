import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import authService from "../api/authService";
import userService from "../api/userService";
import { clearTokens, isAuthenticated } from "../utils/tokenStorage";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const response = await userService.getCurrentUser();
          if (response.success) {
            setCurrentUser(response.data);
          }
        } catch (err) {
          console.error("Error loading user", err);
          if (err.response?.status === 401) {
            clearTokens();
          }
        }
      } else {
        try {
          const refreshResponse = await authService.refreshToken();
          if (refreshResponse.success) {
            const userResponse = await userService.getCurrentUser();
            if (userResponse.success) {
              setCurrentUser(userResponse.data);
            }
          }
        } catch (refreshErr) {
          console.error("Error refreshing token", refreshErr);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);

      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // Verify email with OTP
  const verifyEmail = async (verificationData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.verifyEmail(verificationData);

      if (response.success) {
        try {
          const userResponse = await userService.getCurrentUser();
          if (userResponse.success) {
            setCurrentUser(userResponse.data);
          }
        } catch (userErr) {
          console.error("Error fetching user after verification:", userErr);
        }
      }

      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Verification failed");
      throw err;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(credentials);

      if (response.success) {
        try {
          const userResponse = await userService.getCurrentUser();
          if (userResponse.success) {
            setCurrentUser(userResponse.data);

            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from);
          }
        } catch (userErr) {
          console.error("Error fetching user after login:", userErr);
        }
      }

      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
      clearTokens();
      setLoading(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setCurrentUser(null);
      clearTokens();
      setLoading(false);
      navigate("/login");
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.forgotPassword(email);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Request failed");
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.resetPassword(resetData);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.resendVerification(email);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Resend verification failed");
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await userService.updateProfile(profileData);
      if (response.success) {
        setCurrentUser(response.data);
      }
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword,
    resendVerification,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
