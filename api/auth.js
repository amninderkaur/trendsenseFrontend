import api from "./axios";

export const register = async (email, password, phoneNumber) => {
  const body = { email, password };
  if (phoneNumber) body.phoneNumber = phoneNumber;
  const response = await api.post("/api/v1/auth/register", body);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/api/v1/auth/authenticate", {
    email,
    password,
    deliveryMethod: "email",
  });
  return response.data;
};
