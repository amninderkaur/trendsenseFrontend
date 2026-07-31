import axios from "axios";
import { clearSession } from "../utils/token";

const BASE_URL =
  "https://fashionapp-backend-gtatg0hjbwh4c2dk.canadacentral-01.azurewebsites.net";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Auth endpoints that legitimately return 401 (wrong OTP, bad credentials)
// — don't redirect to login for these, let the screen handle the error
const AUTH_ENDPOINTS = [
  "/api/v1/auth/authenticate",
  "/api/v1/auth/verify-otp",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/forgot-password",
  "/api/v1/user/me/change-password",
];

// Redirect to login on 401 (expired or invalid token) — but not for auth endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "";
    const is401 = error?.response?.status === 401;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((e) => url.includes(e));

    if (is401 && !isAuthEndpoint) {
      clearSession();
      import("expo-router").then(({ router }) => {
        router.replace("/(auth)/login");
      });
    }
    return Promise.reject(error);
  },
);

export { BASE_URL };
export default api;
