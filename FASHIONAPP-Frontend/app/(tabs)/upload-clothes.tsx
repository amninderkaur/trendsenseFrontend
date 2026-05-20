import { getToken } from "@/utils/token";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import { BASE_URL as API_BASE_URL } from "@/api/axios";

type DetectedClothingItem = {
  id: string;
  name: string;
  category: string;
  confidence: number;
  imageUrl?: string;
};

type UploadResponse = {
  message: string;
  item: {
    id: string;
    userId: number;
    imageUrl: string;
    detectedItems: string[];
    uploadDate: string;
    tag: string;
  };
  detections: Array<{
    class: string;
    confidence: number;
    bbox: number[];
  }>;
};

export default function UploadWardrobeScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<DetectedClothingItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(
  useCallback(() => {
  
    setImageUri(null);
    setResult(null);
    setError(null);
  }, [])
);


  const requestMediaPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your gallery.");
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need camera access.");
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    const ok = await requestMediaPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      setResult(null);
      setError(null);
    }
  };

  const handleTakePhoto = async () => {
    const ok = await requestCameraPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      setResult(null);
      setError(null);
    }
  };

 const handleUploadToWardrobe = async () => {
  if (!imageUri) return;

  setUploading(true);
  setError(null);
  setResult(null);

  try {
    const token = await getToken();
    if (!token) throw new Error("No authentication token found");

    const uriParts = imageUri.split("/");
    const fileName = uriParts[uriParts.length - 1];
    const ext = fileName.split(".").pop()?.toLowerCase();
    const mimeType =
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "png" ? "image/png" :
      ext === "webp" ? "image/webp" :
      "image/jpeg";

    const formData = new FormData();

    if (imageUri.startsWith("blob:") || imageUri.startsWith("http")) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: mimeType });
      formData.append("file", file);
    } else {
      formData.append("file", {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as any);
    }

    const uploadResult = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", `${API_BASE_URL}/api/wardrobe/add`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.onload = () => {
        if (xhr.status === 200) resolve(xhr.responseText);
        else reject(new Error(`Upload failed: ${xhr.status} - ${xhr.responseText}`));
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(formData);
    });

    const data: UploadResponse = JSON.parse(uploadResult);

    // If you still want detection results, keep this (optional)
    if (data.detections && data.detections.length > 0) {
      const first = data.detections[0];

      const mapped: DetectedClothingItem = {
        id: data.item.id,
        name: first.class,
        category: data.item.tag,
        confidence: first.confidence,
        imageUrl: data.item.imageUrl,
      };

      setResult(mapped);
    }

    // 🔥 FULL SCREEN RESET HERE
    setImageUri(null);
    setResult(null);
    setError(null);

  } catch (err: any) {
    console.error("Upload failed:", err);
    setError(err.message || "Upload failed");
  } finally {
    setUploading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Upload a clothing item</Text>
      <Text style={styles.subtitle}>
        Add new pieces to your wardrobe by taking a photo or selecting one from your gallery.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Choose from gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={handleTakePhoto}>
          <Text style={styles.buttonOutlineText}>Take a photo</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>
      )}

      <TouchableOpacity
        style={[styles.uploadButton, (!imageUri || uploading) && { opacity: 0.6 }]}
        disabled={!imageUri || uploading}
        onPress={handleUploadToWardrobe}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Add to wardrobe</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, gap: 16, backgroundColor: "#eeede8" },
  title: { fontSize: 22, fontWeight: "700", color: "#233443" },
  subtitle: { fontSize: 14, color: "#96b7bc", marginBottom: 4 },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  button: { flex: 1, backgroundColor: "#c0d1bf", paddingVertical: 12, borderRadius: 999, alignItems: "center" },
  buttonText: { color: "#233443", fontWeight: "600" },
  buttonOutline: { flex: 1, borderColor: "#a3bfa9", borderWidth: 1, paddingVertical: 12, borderRadius: 999, alignItems: "center" },
  buttonOutlineText: { color: "#233443", fontWeight: "600" },
  previewContainer: { marginTop: 24 },
  previewImage: { width: "100%", aspectRatio: 3 / 4, borderRadius: 16, marginTop: 8, borderWidth: 2, borderColor: "#a3bfa9" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#233443" },
  uploadButton: { marginTop: 24, backgroundColor: "#b9d6da", paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  uploadButtonText: { color: "#233443", fontWeight: "700", fontSize: 15 },
  resultBox: { backgroundColor: "#c0d1bf", marginTop: 20, borderRadius: 14, padding: 16 },
  resultItem: { color: "#233443", marginBottom: 4, fontWeight: "500" },
  errorText: { color: "#d0685f", marginTop: 12, fontSize: 14, fontWeight: "600" },
  backButton: { alignSelf: "flex-start", backgroundColor: "#c0d1bf", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
});