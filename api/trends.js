import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getTrends = async () => {
  const response = await api.get("/api/trends", { headers: authHeader() });
  return response.data;
};
