import axios from "axios";
import { clearSession } from "../utils/token";

const BASE_URL = "https://fashionapp-backend-gtatg0hjbwh4c2dk.canadacentral-01.azurewebsites.net";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Redirect to login on 401 (expired or invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      // Use dynamic import to avoid circular deps with expo-router
      import("expo-router").then(({ router }) => {
        router.replace("/(auth)/login");
      });
    }
    return Promise.reject(error);
  }
);

export { BASE_URL };
export default api;
