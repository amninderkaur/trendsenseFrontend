import api from "./axios";

export const register = async (email, password, name, phoneNumber, deliveryMethod = "email") => {
  const body = { email, password, name, deliveryMethod };
  if (phoneNumber) body.phoneNumber = phoneNumber;
  const response = await api.post("/api/v1/auth/register", body);
  return response.data; // { message: "Registration successful. Please log in." }
};

export const login = async (email, password) => {
  const response = await api.post("/api/v1/auth/authenticate", { email, password });
  return response.data;
  // First time:   { requiresOtp: true,  deliveryMethod: "email"|"sms" }
  // Returning:    { requiresOtp: false, token: "...", userId: "..." }
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/api/v1/auth/verify-otp", { email, otp });
  return response.data; // { token: "...", userId: "..." }
};

export const resendOtp = async (email) => {
  const response = await api.post("/api/v1/auth/resend-otp", { email });
  return response.data; // { message: "A new OTP has been sent" }
};
