import api from "./axios";

export const getShoppingSuggestions = async (payload) => {
  const response = await api.post("/api/shopping/suggest", payload);
  return response.data;
};
