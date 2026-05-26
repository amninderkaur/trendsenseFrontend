import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { clearColourAnalysis, getProfile } from "@/api/profile";
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
import { colors } from "../../constants/globalStyles";

type ColourAnalysisResponse = {
  season?: string;
  subSeason?: string;
  dominantColors?: string[];
  recommendedColors?: string[];
  colorsToAvoid?: string[];
  analysis?: string;
  summary?: string;
  undertone?: string;
  palette?: string;
  [key: string]: any;
};

export default function ColourAnalysisScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<ColourAnalysisResponse | null>(null);
  const [isSavedResult, setIsSavedResult] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setImageUri(null);
      setResult(null);
      setIsSavedResult(false);
      setError(null);

      // Load previously saved colour analysis from profile
      const loadSaved = async () => {
        setLoadingSaved(true);
        try {
          const profile = await getProfile();
          if (profile?.colourSeason || profile?.colourPalette) {
            setResult({
              season: profile.colourSeason ?? undefined,
              palette: profile.colourPalette ?? undefined,
            });
            setIsSavedResult(true);
          }
        } catch {
          // No saved data — nothing to show
        } finally {
          setLoadingSaved(false);
        }
      };

      loadSaved();
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

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (!pickerResult.canceled && pickerResult.assets) {
      setImageUri(pickerResult.assets[0].uri);
      setResult(null);
      setError(null);
    }
  };

  const handleTakePhoto = async () => {
    const ok = await requestCameraPermissions();
    if (!ok) return;

    const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!pickerResult.canceled && pickerResult.assets) {
      setImageUri(pickerResult.assets[0].uri);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyse = async () => {
    if (!imageUri) return;

    setAnalysing(true);
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token found");

      const uriParts = imageUri.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const ext = fileName.split(".").pop()?.toLowerCase();
      const mimeType =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : "image/jpeg";

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

      const rawResult = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/api/colour/analyze`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.onload = () => {
          if (xhr.status === 200) resolve(xhr.responseText);
          else reject(new Error(`Analysis failed: ${xhr.status} - ${xhr.responseText}`));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      const data: ColourAnalysisResponse = JSON.parse(rawResult);
      setResult(data);
    } catch (err: any) {
      console.error("Colour analysis failed:", err);
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalysing(false);
    }
  };

  const handleReset = () => {
    setImageUri(null);
    setResult(null);
    setIsSavedResult(false);
    setError(null);
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await clearColourAnalysis();
      setResult(null);
      setIsSavedResult(false);
      setError(null);
    } catch {
      setError("Could not clear your saved analysis. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  // Maps common fashion/seasonal colour names → hex. Falls back to the name
  // itself (works for basic CSS colours like "navy", "coral") then grey.
  const colourNameToHex = (name: string): string => {
    const trimmed = name.trim();
    // Already a hex code — use it directly
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) return trimmed;

    const map: Record<string, string> = {
      // Neutrals
      white: "#FFFFFF", ivory: "#FFFFF0", cream: "#FFFDD0", beige: "#F5F5DC",
      ecru: "#C2B280", offwhite: "#FAF9F6", "off-white": "#FAF9F6",
      lightgrey: "#D3D3D3", "light grey": "#D3D3D3", grey: "#808080",
      gray: "#808080", darkgrey: "#A9A9A9", "dark grey": "#A9A9A9",
      charcoal: "#36454F", black: "#000000",
      // Browns & tans
      tan: "#D2B48C", camel: "#C19A6B", sand: "#C2B280",
      khaki: "#C3B091", taupe: "#483C32", mocha: "#6F4E37",
      chocolate: "#7B3F00", "dark brown": "#5C4033", brown: "#964B00",
      cognac: "#9A463D", rust: "#B7410E", terracotta: "#E2725B",
      // Pinks & reds
      blush: "#DE5D83", dustyrose: "#DCAE96", "dusty rose": "#DCAE96",
      rose: "#FF007F", mauve: "#E0B0FF", pink: "#FFC0CB",
      hotpink: "#FF69B4", "hot pink": "#FF69B4",
      salmon: "#FA8072", coral: "#FF7F50", red: "#FF0000",
      crimson: "#DC143C", burgundy: "#800020", wine: "#722F37",
      maroon: "#800000",
      // Oranges & yellows
      orange: "#FFA500", peach: "#FFCBA4", apricot: "#FBCEB1",
      amber: "#FFBF00", mustard: "#FFDB58", yellow: "#FFFF00",
      gold: "#FFD700", lemon: "#FFF44F",
      // Greens
      mint: "#98FF98", sage: "#BCB88A", "sage green": "#B2C99B",
      olive: "#808000", "olive green": "#6B8E23", green: "#008000",
      emerald: "#50C878", forest: "#228B22", "forest green": "#228B22",
      teal: "#008080", "dark green": "#006400",
      // Blues
      "light blue": "#ADD8E6", skyblue: "#87CEEB", "sky blue": "#87CEEB",
      "powder blue": "#B0E0E6", "soft blue": "#779ECB", blue: "#0000FF",
      cobalt: "#0047AB", navy: "#001F3F", "navy blue": "#001F3F",
      denim: "#1560BD", "royal blue": "#4169E1", indigo: "#4B0082",
      // Purples
      lavender: "#E6E6FA", lilac: "#C8A2C8", "dusty purple": "#9E7BB5",
      periwinkle: "#CCCCFF", purple: "#800080", violet: "#EE82EE",
      plum: "#DDA0DD", eggplant: "#614051",
      // Whites/metallic
      silver: "#C0C0C0", bronze: "#CD7F32", platinum: "#E5E4E2",
      nude: "#E3BC9A", "warm nude": "#D4A574", "cool nude": "#C7B8B2",
    };

    const key = name.toLowerCase().trim();
    if (map[key]) return map[key];

    // Try removing spaces/hyphens for compound names
    const compact = key.replace(/[\s-]/g, "");
    if (map[compact]) return map[compact];

    // Try partial match (e.g. "deep navy" → navy)
    for (const [k, v] of Object.entries(map)) {
      if (key.includes(k) || k.includes(key)) return v;
    }

    return "#CCCCCC"; // neutral grey fallback
  };

  const ColourChip = ({ name }: { name: string }) => (
    <View style={styles.listRow}>
      <View style={[styles.colourSwatch, { backgroundColor: colourNameToHex(name) }]} />
      <Text style={styles.listItem}>{name}</Text>
    </View>
  );

  const renderList = (items: string[], label: string) => (
    <View style={styles.resultSection}>
      <Text style={styles.resultLabel}>{label}</Text>
      {items.map((item, i) => <ColourChip key={i} name={String(item)} />)}
    </View>
  );

  // Renders an object shaped as { tops: string[], bottoms: string[], outerwear: string[], shoes: string[] }
  const renderCategoryPalette = (palette: Record<string, string[]>, label: string) => (
    <View style={styles.resultSection}>
      <Text style={styles.resultLabel}>{label}</Text>
      {Object.entries(palette).map(([category, colours]) => (
        <View key={category} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          {Array.isArray(colours) && colours.map((colour, i) => (
            <ColourChip key={i} name={String(colour)} />
          ))}
        </View>
      ))}
    </View>
  );

  // Returns true when a value is a plain object (not an array)
  const isObject = (val: any): val is Record<string, any> =>
    val !== null && typeof val === "object" && !Array.isArray(val);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Colour Analysis</Text>
      <Text style={styles.subtitle}>
        Upload a clear photo of your face to discover your personal colour season and ideal palette.
      </Text>

      {!result && (
        <>
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>🎨</Text>
                <Text style={styles.imagePlaceholderText}>Tap to select a photo</Text>
                <Text style={styles.imagePlaceholderSub}>JPEG, PNG, or WebP</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.imageActions}>
            {imageUri && (
              <TouchableOpacity onPress={handlePickImage}>
                <Text style={styles.imageActionLink}>Change photo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleTakePhoto}>
              <Text style={styles.imageActionLink}>Take a photo instead</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.analyseButton, (!imageUri || analysing) && { opacity: 0.6 }]}
            disabled={!imageUri || analysing}
            onPress={handleAnalyse}
          >
            {analysing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyseButtonText}>Analyse my colours</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {loadingSaved && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#96b7bc" />
          <Text style={styles.loadingText}>Loading your saved profile...</Text>
        </View>
      )}

      {analysing && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#96b7bc" />
          <Text style={styles.loadingText}>Analysing your colours...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Colour Profile</Text>

          {result.season && (
            <View style={styles.seasonBadge}>
              <Text style={styles.seasonText}>{result.season}</Text>
              {result.subSeason && (
                <Text style={styles.subSeasonText}>{result.subSeason}</Text>
              )}
            </View>
          )}

          {result.undertone && (
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Skin Undertone</Text>
              <Text style={styles.resultValue}>{result.undertone}</Text>
            </View>
          )}

          {result.palette && (
            isObject(result.palette)
              ? renderCategoryPalette(result.palette, "Colour Palette")
              : (
                <View style={styles.resultSection}>
                  <Text style={styles.resultLabel}>Colour Palette</Text>
                  <Text style={styles.resultValue}>{result.palette}</Text>
                </View>
              )
          )}

          {result.dominantColors && (
            Array.isArray(result.dominantColors)
              ? result.dominantColors.length > 0 && renderList(result.dominantColors, "Your Dominant Colours")
              : isObject(result.dominantColors) && renderCategoryPalette(result.dominantColors, "Your Dominant Colours")
          )}

          {result.recommendedColors && (
            Array.isArray(result.recommendedColors)
              ? result.recommendedColors.length > 0 && renderList(result.recommendedColors, "Recommended Colours")
              : isObject(result.recommendedColors) && renderCategoryPalette(result.recommendedColors, "Recommended Colours")
          )}

          {result.colorsToAvoid && (
            Array.isArray(result.colorsToAvoid)
              ? result.colorsToAvoid.length > 0 && renderList(result.colorsToAvoid, "Colours to Avoid")
              : isObject(result.colorsToAvoid) && renderCategoryPalette(result.colorsToAvoid, "Colours to Avoid")
          )}

          {result.analysis && (
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Analysis</Text>
              <Text style={styles.analysisText}>{result.analysis}</Text>
            </View>
          )}

          {result.summary && (
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Summary</Text>
              <Text style={styles.analysisText}>{result.summary}</Text>
            </View>
          )}

          {/* Fallback: show any other string fields from the response */}
          {Object.entries(result)
            .filter(
              ([key, val]) =>
                typeof val === "string" &&
                !["season", "subSeason", "undertone", "palette", "analysis", "summary"].includes(key)
            )
            .map(([key, val]) => (
              <View key={key} style={styles.resultSection}>
                <Text style={styles.resultLabel}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </Text>
                <Text style={styles.resultValue}>{val as string}</Text>
              </View>
            ))}

          {isSavedResult && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>Saved to your profile</Text>
            </View>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Analyse another photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.clearButton, clearing && { opacity: 0.6 }]}
            onPress={handleClear}
            disabled={clearing}
          >
            {clearing
              ? <ActivityIndicator color="#c0726e" />
              : <Text style={styles.clearButtonText}>Clear saved analysis</Text>
            }
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
    backgroundColor: "#eeede8",
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#c0d1bf",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 4,
  },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
  title: { fontSize: 22, fontWeight: "700", color: "#233443" },
  subtitle: { fontSize: 14, color: "#96b7bc", marginBottom: 4 },
  imagePicker: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.bgDark,
    borderStyle: "dashed",
    marginBottom: 8,
  },
  previewImage: { width: "100%", height: 320 },
  imagePlaceholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    gap: 8,
  },
  imagePlaceholderIcon: { fontSize: 40 },
  imagePlaceholderText: { fontSize: 15, fontWeight: "600", color: colors.text },
  imagePlaceholderSub: { fontSize: 12, color: colors.muted },
  imageActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 8,
  },
  imageActionLink: { color: colors.blueDark, fontWeight: "600", fontSize: 13 },
  analyseButton: {
    marginTop: 8,
    backgroundColor: "#b9d6da",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  analyseButtonText: { color: "#233443", fontWeight: "700", fontSize: 15 },
  loadingBox: { alignItems: "center", paddingVertical: 24, gap: 12 },
  loadingText: { color: "#96b7bc", fontSize: 14, fontWeight: "500" },
  errorText: { color: "#d0685f", marginTop: 4, fontSize: 14, fontWeight: "600" },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#233443",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#233443",
    marginBottom: 4,
  },
  seasonBadge: {
    backgroundColor: "#b9d6da",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  seasonText: { fontSize: 22, fontWeight: "800", color: "#233443" },
  subSeasonText: { fontSize: 14, color: "#4a6572", marginTop: 2 },
  resultSection: { gap: 6 },
  resultLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#96b7bc",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resultValue: { fontSize: 15, color: "#233443", fontWeight: "500" },
  analysisText: { fontSize: 14, color: "#4a6572", lineHeight: 22 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  colourSwatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  listItem: { fontSize: 14, color: "#233443", flexShrink: 1 },
  categoryBlock: { marginTop: 6, gap: 4 },
  categoryTitle: { fontSize: 13, fontWeight: "600", color: "#4a6572", marginBottom: 2 },
  savedBadge: {
    alignSelf: "center",
    backgroundColor: "#c0d1bf",
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  savedBadgeText: { fontSize: 12, fontWeight: "600", color: "#233443" },
  resetButton: {
    marginTop: 8,
    backgroundColor: "#c0d1bf",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  resetButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
  clearButton: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d0a09a",
  },
  clearButtonText: { color: "#c0726e", fontWeight: "600", fontSize: 14 },
});
