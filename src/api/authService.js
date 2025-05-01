import axiosInstance from "./axiosConfig";
import { clearTokens, setAccessToken } from "../utils/tokenStorage";

const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  verifyEmail: async (verificationData) => {
    const response = await axiosInstance.post(
      "/auth/verify-email",
      verificationData
    );

    if (response.data.success) {
      setAccessToken(response.data.data.accessToken);
    }

    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);

    if (response.data.success) {
      setAccessToken(response.data.data.accessToken);
    }

    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await axiosInstance.post(
      "/auth/reset-password",
      resetData
    );
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await axiosInstance.post("/auth/resend-verification", {
      email,
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh-token", {});

    if (response.data.success) {
      setAccessToken(response.data.data.accessToken);
    }

    return response.data;
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");

      clearTokens();

      return response.data;
    } catch (error) {
      clearTokens();
      throw error;
    }
  },
};

export default authService;
