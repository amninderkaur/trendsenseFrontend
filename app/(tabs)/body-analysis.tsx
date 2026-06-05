import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { pickImageFromCamera, pickImageFromGallery } from "@/utils/imagePicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMG_WIDTH = SCREEN_WIDTH - 48;
const IMG_HEIGHT = IMG_WIDTH * (4 / 3);

// ── Types ─────────────────────────────────────────────────────────────────────
type BodyAnalysisResult = {
  bodyShape: string;
  summary: string;
  bestStyles: string[];
  stylesToAvoid: string[];
  tips: string[];
};

// ── Scanning overlay ──────────────────────────────────────────────────────────
function ScannerOverlay({ imageUri }: { imageUri: string }) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState("");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
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
    inputRange: [0, 1],
    outputRange: [0, IMG_HEIGHT - 3],
  });

  const BRACKET = 28;
  const THICKNESS = 3;
  const GOLD = "#C9A96E";

  return (
    <SafeAreaView style={sc.root}>
      <Text style={sc.title}>TRENDSENSE</Text>
      <Text style={sc.subtitle}>Body Scanner</Text>
      <View style={[sc.imgWrap, { width: IMG_WIDTH, height: IMG_HEIGHT }]}>
        <Image source={{ uri: imageUri }} style={sc.img} resizeMode="cover" />
        <View style={sc.vignette} />
        <View style={[sc.corner, { top: 0, left: 0, borderTopWidth: THICKNESS, borderLeftWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <View style={[sc.corner, { top: 0, right: 0, borderTopWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <View style={[sc.corner, { bottom: 0, left: 0, borderBottomWidth: THICKNESS, borderLeftWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <View style={[sc.corner, { bottom: 0, right: 0, borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <Animated.View style={[sc.scanLine, { transform: [{ translateY: scanLineY }] }]}>
          <LinearGradient
            colors={["transparent", "rgba(201,169,110,0.9)", "transparent"]}
            start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
            style={{ height: 2, width: "100%" }}
          />
        </Animated.View>
      </View>
      <View style={sc.statusWrap}>
        <Text style={sc.statusText}>Analysing your body shape{dots}</Text>
        <Text style={sc.statusSub}>AI is detecting your proportions</Text>
      </View>
    </SafeAreaView>
  );
}

const sc = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#060C09", alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 6, marginBottom: 4 },
  subtitle: { color: "#C9A96E", fontSize: 11, letterSpacing: 3, fontStyle: "italic", marginBottom: 32 },
  imgWrap: { borderRadius: 18, overflow: "hidden", position: "relative" },
  img: { width: "100%", height: "100%" },
  vignette: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  corner: { position: "absolute" },
  scanLine: { position: "absolute", left: 0, right: 0, top: 0 },
  statusWrap: { marginTop: 32, alignItems: "center" },
  statusText: { color: "#C9A96E", fontSize: 16, fontWeight: "700", letterSpacing: 0.5, marginBottom: 6 },
  statusSub: { color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 0.3 },
});

// ── Shape badge colours ───────────────────────────────────────────────────────
const SHAPE_COLORS: Record<string, string> = {
  Hourglass: "#C9A96E",
  Pear: "#7AAE8A",
  Apple: "#E07B6A",
  Rectangle: "#7A9ABE",
  "Inverted Triangle": "#A87EB5",
};

// ── Main screen ───────────────────────────────────────────────────────────────
export default function BodyAnalysisScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BodyAnalysisResult | null>(null);

  // Optional measurements
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");

  const handlePickImage = async () => {
    const picked = await pickImageFromGallery();
    if (picked) { setImageUri(picked.uri); setImageBase64(picked.base64); setResult(null); setError(null); }
  };

  const handleTakePhoto = async () => {
    const picked = await pickImageFromCamera();
    if (picked) { setImageUri(picked.uri); setImageBase64(picked.base64); setResult(null); setError(null); }
  };

  const handleAnalyse = async () => {
    if (!imageUri || !imageBase64) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAnalysing(true);
    setError(null);

    const tempPath = `${FileSystem.cacheDirectory}body_analysis_tmp.jpg`;
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token found");

      await FileSystem.writeAsStringAsync(tempPath, imageBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append("file", {
        uri: tempPath,
        name: "body.jpg",
        type: "image/jpeg",
      } as any);
      if (height.trim()) formData.append("height", height.trim());
      if (weight.trim()) formData.append("weight", weight.trim());
      if (chest.trim())  formData.append("chest",  chest.trim());
      if (waist.trim())  formData.append("waist",  waist.trim());
      if (hips.trim())   formData.append("hips",   hips.trim());

      const response = await fetch(`${API_BASE_URL}/api/body-analysis/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const text = await response.text();
      if (!response.ok) {
        setError(text || "Analysis failed. Please try again.");
        return;
      }

      const data: BodyAnalysisResult = JSON.parse(text);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAnalysing(false);
      FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
    }
  };

  if (analysing && imageUri) return <ScannerOverlay imageUri={imageUri} />;

  const shapeColor = result ? (SHAPE_COLORS[result.bodyShape] ?? "#C9A96E") : "#C9A96E";

  return (
    <SafeAreaView style={[s.root, { backgroundColor: themeColors.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={[s.backArrow, { color: themeColors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: themeColors.text }]}>Body Analysis</Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* Intro */}
          <Text style={[s.intro, { color: themeColors.muted }]}>
            Upload a full body photo in fitted clothes (head to toe) to discover your body shape and get personalised style tips.
          </Text>

          {/* Photo section */}
          <View style={s.pickRow}>
            <TouchableOpacity
              style={[s.pickBtn, { backgroundColor: themeColors.bgDark }]}
              onPress={handlePickImage}
            >
              <Text style={s.pickIcon}>🖼</Text>
              <Text style={[s.pickLabel, { color: themeColors.text }]}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.pickBtn, { backgroundColor: themeColors.bgDark }]}
              onPress={handleTakePhoto}
            >
              <Text style={s.pickIcon}>📷</Text>
              <Text style={[s.pickLabel, { color: themeColors.text }]}>Camera</Text>
            </TouchableOpacity>
          </View>

          {imageUri ? (
            <View style={s.previewWrap}>
              <Image source={{ uri: imageUri }} style={s.previewImage} resizeMode="cover" />
            </View>
          ) : (
            <View style={[s.emptyPreview, { borderColor: themeColors.input }]}>
              <Text style={s.emptyIcon}>🧍</Text>
              <Text style={[s.emptyText, { color: themeColors.muted }]}>
                Full body photo preview will appear here
              </Text>
            </View>
          )}

          {/* Measurements section */}
          <View style={[s.measureCard, { backgroundColor: themeColors.bgDark, borderColor: themeColors.input }]}>
            <View style={s.measureHeader}>
              <Text style={[s.measureTitle, { color: themeColors.text }]}>Measurements</Text>
              <View style={s.optionalBadge}>
                <Text style={s.optionalText}>Optional</Text>
              </View>
            </View>
            <Text style={[s.measureHint, { color: themeColors.muted }]}>
              Adding measurements improves accuracy — recommended for better results.
            </Text>

            <View style={s.measureGrid}>
              {[
                { label: "Height", placeholder: "e.g. 165 cm", value: height, setter: setHeight },
                { label: "Weight", placeholder: "e.g. 60 kg", value: weight, setter: setWeight },
                { label: "Chest", placeholder: "e.g. 90 cm", value: chest, setter: setChest },
                { label: "Waist", placeholder: "e.g. 70 cm", value: waist, setter: setWaist },
                { label: "Hips", placeholder: "e.g. 95 cm", value: hips, setter: setHips },
              ].map(({ label, placeholder, value, setter }) => (
                <View key={label} style={s.measureField}>
                  <Text style={[s.measureLabel, { color: themeColors.muted }]}>{label}</Text>
                  <TextInput
                    style={[s.measureInput, { color: themeColors.text, borderColor: themeColors.input, backgroundColor: themeColors.bg }]}
                    placeholder={placeholder}
                    placeholderTextColor={themeColors.muted}
                    value={value}
                    onChangeText={setter}
                    keyboardType="default"
                    returnKeyType="done"
                  />
                </View>
              ))}
            </View>
          </View>

          {error && (
            <View style={s.errorCard}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* Analyse button */}
          <TouchableOpacity
            style={[s.analyseBtn, (!imageUri || !imageBase64) && { opacity: 0.4 }]}
            disabled={!imageUri || !imageBase64}
            onPress={handleAnalyse}
          >
            <LinearGradient
              colors={["#C9A96E", "#9A6E38"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.analyseBtnGrad}
            >
              <Text style={s.analyseBtnText}>Analyse My Body Shape</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Results */}
          {result && (
            <View style={s.resultsWrap}>
              {/* Shape badge */}
              <View style={[s.shapeBadge, { backgroundColor: shapeColor + "22", borderColor: shapeColor }]}>
                <Text style={[s.shapeIcon]}>◆</Text>
                <Text style={[s.shapeLabel, { color: shapeColor }]}>{result.bodyShape}</Text>
              </View>

              {/* Summary */}
              <View style={[s.resultCard, { backgroundColor: themeColors.bgDark }]}>
                <Text style={[s.resultCardTitle, { color: themeColors.text }]}>About Your Shape</Text>
                <Text style={[s.resultCardBody, { color: themeColors.muted }]}>{result.summary}</Text>
              </View>

              {/* Best styles */}
              <View style={[s.resultCard, { backgroundColor: themeColors.bgDark }]}>
                <Text style={[s.resultCardTitle, { color: themeColors.text }]}>✓  Styles That Flatter You</Text>
                {result.bestStyles.map((style, i) => (
                  <View key={i} style={s.listRow}>
                    <View style={[s.listDot, { backgroundColor: shapeColor }]} />
                    <Text style={[s.listText, { color: themeColors.text }]}>{style}</Text>
                  </View>
                ))}
              </View>

              {/* Styles to avoid */}
              <View style={[s.resultCard, { backgroundColor: themeColors.bgDark }]}>
                <Text style={[s.resultCardTitle, { color: themeColors.text }]}>✕  Styles to Avoid</Text>
                {result.stylesToAvoid.map((style, i) => (
                  <View key={i} style={s.listRow}>
                    <View style={[s.listDot, { backgroundColor: "#E07B6A" }]} />
                    <Text style={[s.listText, { color: themeColors.text }]}>{style}</Text>
                  </View>
                ))}
              </View>

              {/* Tips */}
              <View style={[s.resultCard, { backgroundColor: themeColors.bgDark, marginBottom: 32 }]}>
                <Text style={[s.resultCardTitle, { color: themeColors.text }]}>✦  Style Tips</Text>
                {result.tips.map((tip, i) => (
                  <View key={i} style={s.listRow}>
                    <View style={[s.listDot, { backgroundColor: "#C9A96E" }]} />
                    <Text style={[s.listText, { color: themeColors.text }]}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  backBtn: { width: 40, alignItems: "flex-start", justifyContent: "center" },
  backArrow: { fontSize: 22, fontWeight: "600" },
  headerTitle: { fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },

  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  intro: { fontSize: 13, lineHeight: 19, marginBottom: 20 },

  pickRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  pickBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: "center", gap: 6 },
  pickIcon: { fontSize: 22 },
  pickLabel: { fontSize: 13, fontWeight: "600" },

  previewWrap: { borderRadius: 18, overflow: "hidden", height: 320, marginBottom: 20 },
  previewImage: { width: "100%", height: "100%" },

  emptyPreview: {
    height: 200, borderRadius: 18, borderWidth: 1.5, borderStyle: "dashed",
    alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 13, textAlign: "center", paddingHorizontal: 24 },

  // Measurements
  measureCard: {
    borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 20,
  },
  measureHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  measureTitle: { fontSize: 15, fontWeight: "700" },
  optionalBadge: {
    backgroundColor: "rgba(201,169,110,0.15)", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  optionalText: { color: "#C9A96E", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  measureHint: { fontSize: 12, lineHeight: 17, marginBottom: 16 },
  measureGrid: { gap: 12 },
  measureField: { gap: 4 },
  measureLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 },
  measureInput: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14,
  },

  errorCard: {
    backgroundColor: "rgba(224,123,106,0.12)", borderRadius: 14, padding: 14, marginBottom: 16,
  },
  errorText: { color: "#E07B6A", fontSize: 13, lineHeight: 19, fontWeight: "600" },

  analyseBtn: { borderRadius: 999, overflow: "hidden", marginBottom: 28 },
  analyseBtnGrad: { paddingVertical: 16, alignItems: "center" },
  analyseBtnText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 },

  // Results
  resultsWrap: { gap: 14 },
  shapeBadge: {
    borderRadius: 18, borderWidth: 1.5, padding: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12,
  },
  shapeIcon: { fontSize: 24, color: "#C9A96E" },
  shapeLabel: { fontSize: 26, fontWeight: "900", letterSpacing: 0.5 },

  resultCard: { borderRadius: 16, padding: 16, gap: 10 },
  resultCardTitle: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5, marginBottom: 2 },
  resultCardBody: { fontSize: 13, lineHeight: 20 },

  listRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  listDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 6, flexShrink: 0 },
  listText: { flex: 1, fontSize: 13, lineHeight: 20 },
});
