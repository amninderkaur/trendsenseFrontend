import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const deleteAccount = async () => {
  const response = await api.delete("/api/v1/user/me", {
    headers: authHeader(),
  });
  return response.data;
};
