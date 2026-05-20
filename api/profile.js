import api from "./axios";
import { getToken } from "../utils/token";

export const saveProfile = async (profileData) => {
  const token = getToken();
  const response = await api.post("/api/v1/profile", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
