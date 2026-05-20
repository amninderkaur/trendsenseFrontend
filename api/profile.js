import api from "./axios";

export const saveProfile = async (profileData) => {
  const response = await api.post("/api/profile", profileData);
  return response.data;
};
