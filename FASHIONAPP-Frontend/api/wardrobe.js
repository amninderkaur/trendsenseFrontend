import api from "./axios";

export async function uploadWardrobeItem(imageUrl, detectedItems, tag) {
  const response = await api.post("/wardrobe", {
    imageUrl,
    detectedItems,
    tag,
    uploadDate: new Date(),
  });
  return response.data;
}