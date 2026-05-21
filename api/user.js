import { Platform } from "react-native";
import { getToken } from "../utils/token";
import api from "./axios";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// 1. Register
export const register = async ({
  email,
  password,
  name,
  phoneNumber,
  deliveryMethod,
}) => {
  const response = await api.post("/api/v1/auth/register", {
    email,
    password,
    name,
    phoneNumber,
    deliveryMethod,
  });
  return response.data;
};

// 3. Get current user info
export const getMe = async () => {
  const response = await api.get("/api/v1/user/me", {
    headers: authHeader(),
  });
  return response.data;
};

// 4. Update user info (name, phoneNumber, deliveryMethod — send only what changed)
export const updateUser = async ({ name, phoneNumber, deliveryMethod }) => {
  const body = {};
  if (name !== undefined) body.name = name;
  if (phoneNumber !== undefined) body.phoneNumber = phoneNumber;
  if (deliveryMethod !== undefined) body.deliveryMethod = deliveryMethod;

  const response = await api.patch("/api/v1/user/me", body, {
    headers: authHeader(),
  });
  return response.data;
};

// 5. Upload profile picture
export const uploadProfilePicture = async (imageUri) => {
  const ext = imageUri.split(".").pop().toLowerCase();
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const formData = new FormData();
  if (Platform.OS === "web") {
    const res = await fetch(imageUri);
    const blob = await res.blob();
    formData.append("file", blob, `profile.${ext}`);
  } else {
    formData.append("file", {
      uri: imageUri,
      type: mimeType,
      name: `profile.${ext}`,
    });
  }

  const response = await api.post("/api/v1/user/me/profile-picture", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": undefined,
    },
  });
  return response.data;
};

// 6. Change password (logged in)
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post(
    "/api/v1/user/me/change-password",
    { currentPassword, newPassword },
    { headers: authHeader() }
  );
  return response.data;
};

// 7. Forgot password — sends OTP to email (no token needed)
export const forgotPassword = async (email) => {
  const response = await api.post("/api/v1/auth/forgot-password", { email });
  return response.data;
};

// 8. Reset password — verifies OTP then sets new password (no token needed)
export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/api/v1/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

// Delete account
export const deleteAccount = async () => {
  const response = await api.delete("/api/v1/user/me", {
    headers: authHeader(),
  });
  return response.data;
};
