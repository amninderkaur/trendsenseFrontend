import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import { isWeb } from "@/utils/platform";
import ScannerOverlay from "@/components/ScannerOverlay";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { pickImageFromCamera, pickImageFromGallery } from "@/utils/imagePicker";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BASE_URL as API_BASE_URL } from "@/api/axios";

// ── Success overlay ───────────────────────────────────────────────────────────
function SuccessOverlay() {
  return (
    <SafeAreaView style={success.root}>
      <View style={success.circle}>
        <Text style={success.check}>✓</Text>
      </View>
      <Text style={success.title}>Item Added!</Text>
      <Text style={success.subtitle}>Your clothing has been saved to your wardrobe.</Text>
    </SafeAreaView>
  );
}

const success = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#060C09",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C9A96E",
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 42,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    letterSpacing: 0.2,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

// ── Main screen ──────────────────────────────────────────────────────────────
export default function UploadWardrobeScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();
  const [imageUri,       setImageUri]       = useState<string | null>(null);
  const [imageBase64,    setImageBase64]    = useState<string | null>(null);
  const [uploading,      setUploading]      = useState(false);
  const [uploadSuccess,  setUploadSuccess]  = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setImageUri(null);
      setImageBase64(null);
      setError(null);
    }, [])
  );

const handlePickImage = async () => {
    const picked = await pickImageFromGallery();
    if (picked) { setImageUri(picked.uri); setImageBase64(picked.base64); setError(null); }
  };

  const handleTakePhoto = async () => {
    const picked = await pickImageFromCamera();
    if (picked) { setImageUri(picked.uri); setImageBase64(picked.base64); setError(null); }
  };

  const handleUploadToWardrobe = async () => {
    if (!imageUri || !imageBase64) return;

    if (!isWeb) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setUploading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token found");

      if (isWeb) {
        // Web: convert base64 string to Blob and upload via fetch + FormData
        const byteString = atob(imageBase64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("file", blob, "upload.jpg");

        const response = await fetch(`${API_BASE_URL}/api/wardrobe/add`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) {
          const body = await response.text().catch(() => "");
          throw new Error(`Upload failed: ${response.status}${body ? ` — ${body}` : ""}`);
        }
      } else {
        // Native (iOS/Android): write base64 to temp file and use FileSystem.uploadAsync
        // expo-image-picker encodes as JPEG (UIImageJPEGRepresentation on iOS),
        // so this avoids HEIC rejection from the backend.
        const tempPath = `${FileSystem.cacheDirectory}upload_tmp.jpg`;
        try {
          await FileSystem.writeAsStringAsync(tempPath, imageBase64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const result = await FileSystem.uploadAsync(
            `${API_BASE_URL}/api/wardrobe/add`,
            tempPath,
            {
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: "file",
              mimeType:  "image/jpeg",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (result.status !== 200) {
            throw new Error(`Upload failed: ${result.status} — ${result.body}`);
          }
        } finally {
          FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
        }
      }

      // Show success overlay briefly before navigating
      setUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        router.replace("/(tabs)/wardrobe" as any);
      }, 1500);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  // Show overlays during upload / after success
  if (uploadSuccess) return <SuccessOverlay />;
  if (uploading && imageUri) return <ScannerOverlay imageUri={imageUri} />;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: themeColors.bg }]}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={[styles.backArrow, { color: themeColors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Add Clothing</Text>
        <View style={styles.backBtn} />
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>
        <Text style={[styles.subtitle, { color: themeColors.muted }]}>
          Take a photo or choose from your gallery to add a piece to your wardrobe.
        </Text>

        {/* Pick buttons */}
        <View style={styles.pickRow}>
          <TouchableOpacity
            style={[
              styles.pickBtn,
              { backgroundColor: themeColors.bgDark },
              isWeb && styles.pickBtnFull,
            ]}
            onPress={handlePickImage}
          >
            <Text style={styles.pickIcon}>🖼</Text>
            <Text style={[styles.pickLabel, { color: themeColors.text }]}>Gallery</Text>
          </TouchableOpacity>

          {!isWeb && (
            <TouchableOpacity
              style={[styles.pickBtn, { backgroundColor: themeColors.bgDark }]}
              onPress={handleTakePhoto}
            >
              <Text style={styles.pickIcon}>📷</Text>
              <Text style={[styles.pickLabel, { color: themeColors.text }]}>Camera</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preview */}
        {imageUri ? (
          <View style={styles.previewWrap}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={[styles.emptyPreview, { borderColor: themeColors.input }]}>
            <Text style={styles.emptyIcon}>👗</Text>
            <Text style={[styles.emptyText, { color: themeColors.muted }]}>
              Your item preview will appear here
            </Text>
          </View>
        )}

        {error && (
          <Text style={[styles.errorText, { color: "#E07B6A" }]}>{error}</Text>
        )}
      </View>

      {/* ── Footer — pinned to bottom ── */}
      <View style={[styles.footer, { borderTopColor: themeColors.input }]}>
        <TouchableOpacity
          style={[
            styles.uploadBtn,
            { backgroundColor: "#C9A96E" },
            (!imageUri || !imageBase64) && { opacity: 0.4 },
          ]}
          disabled={!imageUri || !imageBase64}
          onPress={handleUploadToWardrobe}
        >
          <Text style={styles.uploadBtnText}>Add to Wardrobe</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Body ──
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },

  // Pick buttons
  pickRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  pickBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 6,
  },
  pickBtnFull: { flex: 1 },
  pickIcon:  { fontSize: 22 },
  pickLabel: { fontSize: 13, fontWeight: "600" },

  // Preview
  previewWrap: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  emptyPreview: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 13, textAlign: "center", paddingHorizontal: 24 },

  errorText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  uploadBtn: {
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#C9A96E",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  uploadBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
