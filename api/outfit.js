import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getOutfitRatings = async () => {
  const response = await api.get("/api/outfit/rating", { headers: authHeader() });
  return response.data;
};

export const postOutfitRating = async ({ outfitHistoryId, rating }) => {
  const response = await api.post(
    "/api/outfit/rating",
    { outfitHistoryId, rating },
    { headers: authHeader() }
  );
  return response.data;
};

export const getTasteProfile = async () => {
  const response = await api.get("/api/outfit/rating/taste-profile", { headers: authHeader() });
  return response.data;
};
