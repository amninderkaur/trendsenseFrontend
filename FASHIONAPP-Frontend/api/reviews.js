import api from "./axios";

export const createReview = async (payload) => {
  const response = await api.post("/api/reviews", payload);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await api.get("/api/reviews/me");
  return response.data;
};
