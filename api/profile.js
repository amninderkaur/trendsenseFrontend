import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const saveProfile = async (profileData) => {
  const response = await api.post("/api/profile", profileData, {
    headers: authHeader(),
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/api/profile", { headers: authHeader() });
  return response.data;
};
