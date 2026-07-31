import api from "./axios";
import { getToken } from "../utils/token";

export const createReview = async ({ message, rating }) => {
  const token = getToken();
  const response = await api.post(
    "/api/v1/reviews",
    { message, rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // { caseNumber: ... }
};
