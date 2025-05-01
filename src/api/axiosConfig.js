import axios from "axios";

import { getAccessToken, clearTokens } from "../utils/tokenStorage";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.success) {
          localStorage.setItem(
            "access_token",
            refreshResponse.data.data.accessToken
          );

          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;

          return axiosInstance(originalRequest);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (refreshError) {
        clearTokens();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
