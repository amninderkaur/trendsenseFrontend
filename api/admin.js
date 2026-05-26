import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getAdminStats = async () => {
  const response = await api.get("/api/v1/admin/stats", { headers: authHeader() });
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/api/v1/admin/users", { headers: authHeader() });
  return response.data;
};

export const getAdminUserCount = async () => {
  const response = await api.get("/api/v1/admin/users/count", { headers: authHeader() });
  return response.data;
};

export const updateAdminUser = async (id, payload) => {
  const response = await api.patch(`/api/v1/admin/users/${id}`, payload, { headers: authHeader() });
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/api/v1/admin/users/${id}`, { headers: authHeader() });
  return response.data;
};

export const sendEmailToUser = async (id, subject, content) => {
  const response = await api.post(
    `/api/v1/admin/users/${id}/email`,
    { subject, content },
    { headers: authHeader() }
  );
  return response.data;
};

export const getAdminReviews = async () => {
  const response = await api.get("/api/v1/admin/reviews", { headers: authHeader() });
  return response.data;
};

export const replyToReview = async (caseNumber, reply) => {
  const response = await api.post(
    `/api/v1/admin/reviews/${caseNumber}/reply`,
    { reply },
    { headers: authHeader() }
  );
  return response.data;
};
