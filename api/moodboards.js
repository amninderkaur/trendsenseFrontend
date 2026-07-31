import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { getToken } from "@/utils/token";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getMoodboards = async () => {
  const response = await fetch(`${API_BASE_URL}/api/moodboards`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not load moodboards.");
  }

  return response.json();
};

export const createMoodboard = async ({ name, description, images }) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);

  for (const imageUri of images) {
    await appendImage(formData, imageUri);
  }

  const response = await fetch(`${API_BASE_URL}/api/moodboards`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Could not create moodboard.");
  }

  return response.json();
};

export const updateMoodboard = async ({ id, name, description, images }) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);

  for (const imageUri of images) {
    await appendImage(formData, imageUri);
  }

  const response = await fetch(`${API_BASE_URL}/api/moodboards/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Could not update moodboard.");
  }

  return response.json();
};

export const deleteMoodboardById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/moodboards/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not delete moodboard.");
  }

  return true;
};

export const addMoodboardImages = async ({ id, images }) => {
  const formData = new FormData();

  for (const imageUri of images) {
    await appendImage(formData, imageUri);
  }

  const response = await fetch(`${API_BASE_URL}/api/moodboards/${id}/images`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Could not add images.");
  }

  return response.json();
};

const appendImage = async (formData, imageUri) => {
  const uriParts = imageUri.split("/");
  const fileName = uriParts[uriParts.length - 1] || "moodboard.jpg";
  const ext = fileName.split(".").pop()?.toLowerCase();

  const mimeType =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : "image/jpeg";

  if (imageUri.startsWith("blob:") || imageUri.startsWith("http")) {
    const fetched = await fetch(imageUri);
    const blob = await fetched.blob();
    const file = new File([blob], fileName, { type: mimeType });

    formData.append("images", file);
  } else {
    formData.append("images", {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    });
  }
};