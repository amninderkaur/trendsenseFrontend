import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { pickImageFromCamera, pickImageFromGallery } from "@/utils/imagePicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BASE_URL as API_BASE_URL } from "@/api/axios";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMG_WIDTH  = SCREEN_WIDTH - 48;
const IMG_HEIGHT = IMG_WIDTH * (4 / 3);

// ── Scanning overlay ─────────────────────────────────────────────────────────
function ScannerOverlay({ imageUri }: { imageUri: string }) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState("");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const scanLineY = scanAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, IMG_HEIGHT - 3],
  });

  const BRACKET = 28;
  const THICKNESS = 3;
  const GOLD = "#C9A96E";

  return (
    <SafeAreaView style={scanner.root}>
      <Text style={scanner.title}>TRENDSENSE</Text>
      <Text style={scanner.subtitle}>Scanner</Text>

      {/* Image + scan overlay */}
      <View style={[scanner.imgWrap, { width: IMG_WIDTH, height: IMG_HEIGHT }]}>
        <Image
          source={{ uri: imageUri }}
          style={scanner.img}
          resizeMode="cover"
        />

        {/* Dark vignette over image */}
        <View style={scanner.vignette} />

        {/* Corner brackets */}
        {/* Top-left */}
        <View style={[scanner.corner, { top: 0, left: 0, borderTopWidth: THICKNESS, borderLeftWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        {/* Top-right */}
        <View style={[scanner.corner, { top: 0, right: 0, borderTopWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        {/* Bottom-left */}
        <View style={[scanner.corner, { bottom: 0, left: 0, borderBottomWidth: THICKNESS, borderLeftWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        {/* Bottom-right */}
        <View style={[scanner.corner, { bottom: 0, right: 0, borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />

        {/* Scan line */}
        <Animated.View style={[scanner.scanLine, { transform: [{ translateY: scanLineY }] }]}>
          <LinearGradient
            colors={["transparent", "rgba(201,169,110,0.9)", "transparent"]}
            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
            style={{ height: 2, width: "100%" }}
          />
        </Animated.View>
      </View>

      {/* Status text */}
      <View style={scanner.statusWrap}>
        <Text style={scanner.statusText}>Analysing your clothing{dots}</Text>
        <Text style={scanner.statusSub}>AI is detecting your item</Text>
      </View>
    </SafeAreaView>
  );
}

const scanner = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#060C09",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 4,
  },
  subtitle: {
    color: "#C9A96E",
    fontSize: 11,
    letterSpacing: 3,
    fontStyle: "italic",
    marginBottom: 32,
  },
  imgWrap: {
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  corner: {
    position: "absolute",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  statusWrap: {
    marginTop: 32,
    alignItems: "center",
  },
  statusText: {
    color: "#C9A96E",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statusSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

// ── Main screen ──────────────────────────────────────────────────────────────
export default function UploadWardrobeScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();
  const [imageUri,    setImageUri]    = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);

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

    // Immediate haptic so the button feels responsive before scanner appears
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUploading(true);
    setError(null);

    // Write the base64-encoded JPEG to a temp file so we can upload real bytes.
    // expo-image-picker uses UIImageJPEGRepresentation on iOS (quality 0.85),
    // so asset.base64 is guaranteed JPEG — avoids HEIC rejection from the backend.
    const tempPath = `${FileSystem.cacheDirectory}upload_tmp.jpg`;

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token found");

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
        throw new Error(`Upload failed: ${result.status} - ${result.body}`);
      }

      router.replace("/(tabs)/wardrobe" as any);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed");
      setUploading(false);
    } finally {
      // Clean up temp file regardless of outcome
      FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
    }
  };

  // Show scanner overlay during upload
  if (uploading && imageUri) {
    return <ScannerOverlay imageUri={imageUri} />;
  }

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
            style={[styles.pickBtn, { backgroundColor: themeColors.bgDark }]}
            onPress={handlePickImage}
          >
            <Text style={styles.pickIcon}>🖼</Text>
            <Text style={[styles.pickLabel, { color: themeColors.text }]}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pickBtn, { backgroundColor: themeColors.bgDark }]}
            onPress={handleTakePhoto}
          >
            <Text style={styles.pickIcon}>📷</Text>
            <Text style={[styles.pickLabel, { color: themeColors.text }]}>Camera</Text>
          </TouchableOpacity>
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
