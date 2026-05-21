import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { getToken } from "@/utils/token";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, globalStyles } from "../../constants/globalStyles";

type AnalysisResult = {
  occasion: string;
  styleScore: number;
  weatherVerdict: string;
  weatherReason: string;
  whatWorksWell: string[];
  suggestions: string[];
  overallVerdict: string;
  currentWeather: string | null;
};

export default function OutfitReview() {
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [occasion, setOccasion] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Permission to access photos is required.");
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!picked.canceled && picked.assets.length > 0) {
      const asset = picked.assets[0];
      setImageUri(asset.uri);
      setImageMime(asset.mimeType ?? "image/jpeg");
      setResult(null);
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri) {
      setError("Please select a photo of your outfit.");
      return;
    }
    if (!occasion.trim()) {
      setError("Please enter the occasion.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const uriParts = imageUri.split("/");
      const fileName = uriParts[uriParts.length - 1] || "outfit.jpg";
      const ext = fileName.split(".").pop()?.toLowerCase();
      const mimeType =
        ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
        ext === "png" ? "image/png" :
        ext === "webp" ? "image/webp" :
        imageMime || "image/jpeg";

      const formData = new FormData();

      if (imageUri.startsWith("blob:") || imageUri.startsWith("http")) {
        const fetched = await fetch(imageUri);
        const blob = await fetched.blob();
        const file = new File([blob], fileName, { type: mimeType });
        formData.append("image", file);
      } else {
        formData.append("image", { uri: imageUri, name: fileName, type: mimeType } as any);
      }

      formData.append("occasion", occasion.trim());
      if (city.trim()) formData.append("city", city.trim());

      const responseText = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/outfit/analyze`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
          else reject(new Error(xhr.responseText || `Error ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      const data: AnalysisResult = JSON.parse(responseText);
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/mainMenu" as any);
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return "#5a9e6f";
    if (score >= 5) return "#d4a847";
    return "#c0726e";
  };

  const verdictColor = (verdict: string) => {
    if (verdict === "suitable") return "#5a9e6f";
    if (verdict === "unknown") return "#96b7bc";
    return "#c0726e";
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Outfit Review</Text>
      <Text style={styles.subtitle}>
        Upload a photo of your outfit and get AI feedback on your style, fit for
        the occasion, and weather suitability.
      </Text>

      {/* Image picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>📸</Text>
            <Text style={styles.imagePlaceholderText}>Tap to select outfit photo</Text>
            <Text style={styles.imagePlaceholderSub}>JPEG, PNG, or WebP</Text>
          </View>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity style={styles.changePhoto} onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change photo</Text>
        </TouchableOpacity>
      )}

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Occasion <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. job interview, casual brunch, wedding"
          placeholderTextColor={colors.muted}
          value={occasion}
          onChangeText={setOccasion}
        />

        <Text style={styles.label}>City <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Toronto — for weather check"
          placeholderTextColor={colors.muted}
          value={city}
          onChangeText={setCity}
        />

        {!!error && <Text style={globalStyles.errorText}>{error}</Text>}

        <Pressable
          style={[styles.analyzeButton, loading && { opacity: 0.6 }]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.analyzeButtonText}>Analyse Outfit</Text>}
        </Pressable>
      </View>

      {/* Result */}
      {result && (
        <View style={styles.resultContainer}>
          {/* Score */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Style Score</Text>
            <Text style={[styles.scoreValue, { color: scoreColor(result.styleScore) }]}>
              {result.styleScore}/10
            </Text>
            <Text style={styles.scoreOccasion}>{result.occasion}</Text>
          </View>

          {/* Overall verdict */}
          {!!result.overallVerdict && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Verdict</Text>
              <Text style={styles.verdictText}>{result.overallVerdict}</Text>
            </View>
          )}

          {/* Weather */}
          {result.currentWeather && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weather Check</Text>
              <Text style={styles.weatherInfo}>{result.currentWeather}</Text>
              <View style={[styles.verdictBadge, { backgroundColor: verdictColor(result.weatherVerdict) }]}>
                <Text style={styles.verdictBadgeText}>
                  {result.weatherVerdict === "suitable"
                    ? "Suitable for the weather"
                    : result.weatherVerdict === "not suitable"
                    ? "Not suitable for the weather"
                    : "Weather check skipped"}
                </Text>
              </View>
              {!!result.weatherReason && (
                <Text style={styles.weatherReason}>{result.weatherReason}</Text>
              )}
            </View>
          )}

          {/* What works well */}
          {result.whatWorksWell?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What Works Well</Text>
              {result.whatWorksWell.map((point, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletGreen}>✓</Text>
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              {result.suggestions.map((s, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletBlue}>→</Text>
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setResult(null);
              setImageUri(null);
              setOccasion("");
              setCity("");
            }}
          >
            <Text style={styles.retryButtonText}>Analyse Another Outfit</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: "flex-start", backgroundColor: colors.bgDark, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: colors.white, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.muted, fontSize: 14, marginBottom: 20, lineHeight: 20 },

  imagePicker: { width: "100%", borderRadius: 18, overflow: "hidden", marginBottom: 8, borderWidth: 2, borderColor: colors.bgDark, borderStyle: "dashed" },
  previewImage: { width: "100%", height: 320 },
  imagePlaceholder: { height: 220, alignItems: "center", justifyContent: "center", backgroundColor: colors.card, gap: 8 },
  imagePlaceholderIcon: { fontSize: 40 },
  imagePlaceholderText: { fontSize: 15, fontWeight: "600", color: colors.text },
  imagePlaceholderSub: { fontSize: 12, color: colors.muted },
  changePhoto: { alignItems: "center", marginBottom: 16 },
  changePhotoText: { color: colors.blueDark, fontWeight: "600", fontSize: 13 },

  formCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6, marginTop: 4 },
  required: { color: "#c0726e" },
  optional: { color: colors.muted, fontWeight: "400" },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.input, color: colors.text },
  analyzeButton: { backgroundColor: colors.blueDark, paddingVertical: 14, borderRadius: 999, alignItems: "center", marginTop: 4 },
  analyzeButtonText: { color: colors.white, fontWeight: "700", fontSize: 16 },

  resultContainer: { gap: 14 },
  scoreCard: { backgroundColor: colors.card, borderRadius: 18, padding: 20, alignItems: "center", gap: 4 },
  scoreLabel: { fontSize: 13, fontWeight: "600", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  scoreValue: { fontSize: 52, fontWeight: "800" },
  scoreOccasion: { fontSize: 14, color: colors.text, textTransform: "capitalize", marginTop: 2 },

  section: { backgroundColor: colors.card, borderRadius: 16, padding: 16, gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  verdictText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  weatherInfo: { fontSize: 14, color: colors.muted },
  verdictBadge: { alignSelf: "flex-start", paddingVertical: 5, paddingHorizontal: 14, borderRadius: 999 },
  verdictBadgeText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  weatherReason: { fontSize: 14, color: colors.text, lineHeight: 20, marginTop: 4 },

  bulletRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  bulletGreen: { color: "#5a9e6f", fontWeight: "700", fontSize: 15, marginTop: 1 },
  bulletBlue: { color: colors.blueDark, fontWeight: "700", fontSize: 15, marginTop: 1 },
  bulletText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },

  retryButton: { backgroundColor: colors.bgDark, paddingVertical: 14, borderRadius: 999, alignItems: "center", marginTop: 4 },
  retryButtonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
});
