import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getShoppingSuggestions = async (payload) => {
  const response = await api.post("/api/shopping/suggest", payload, {
    headers: authHeader(),
  });
  return response.data;
};

export const saveShoppingItem = async (payload) => {
  const response = await api.post("/api/shopping/saved", payload, {
    headers: authHeader(),
  });
  return response.data;
};

export const getSavedShoppingItems = async () => {
  const response = await api.get("/api/shopping/saved", {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteShoppingItem = async (id) => {
  const response = await api.delete(`/api/shopping/saved/${id}`, {
    headers: authHeader(),
  });
  return response.data;
};
