import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const saveOutfitHistory = async (payload) => {
  const response = await api.post("/api/outfit/history", payload, {
    headers: authHeader(),
  });
  return response.data;
};

export const getOutfitHistory = async () => {
  const response = await api.get("/api/outfit/history", {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteOutfitHistory = async (id) => {
  const response = await api.delete(`/api/outfit/history/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};
