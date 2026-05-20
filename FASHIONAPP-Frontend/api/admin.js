import api from "./axios";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/user/${id}`);
  return response.data;
};

export const updateAdminUser = async (id, payload) => {
  const response = await api.put(`/admin/user/${id}`, payload);
  return response.data;
};

export const getAdminReviews = async () => {
  const response = await api.get("/admin/reviews");
  return response.data;
};
