/* 
 * Colour Analysis Page
 * Users can upload selfies and answer questions about their colouring.
 * The backend/Gemini then generates a colour analysis result with:
 * - season
 * - undertone
 * - contrast level
 * - best jewelry
 * - recommended colours
 * - AI summary
*/

// ================
//     IMPORTS
// ================
import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { clearColourAnalysis, getProfile } from "@/api/profile";
import ColourAnalysisForm from "@/components/ColourAnalysis/ColourAnalysisForm";
import ColourAnalysisHeader from "@/components/ColourAnalysis/ColourAnalysisHeader";
import ColourAnalysisResult from "@/components/ColourAnalysis/ColourAnalysisResult";
import { colors, globalStyles } from "@/constants/globalStyles";
import { seasonPalettes } from "@/constants/seasonPalettes";
import { getToken } from "@/utils/token";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

// ==============
//     TYPES
// ==============
export type SeasonKey =
    | "lightSpring"
    | "trueSpring"
    | "brightSpring"
    | "lightSummer"
    | "trueSummer"
    | "softSummer"
    | "softAutumn"
    | "trueAutumn"
    | "deepAutumn"
    | "deepWinter"
    | "trueWinter"
    | "brightWinter";

export type ColourAnalysisResultData = {
    season: string;
    seasonKey: SeasonKey | null;
    undertone: string;
    contrast: string;
    bestJewelry: string;
    summary: string;
    recommendedColors: string[];
    bestColors: string[];
    bestColorsDescription: string;
    worstColors: string[];
    worstColorsDescription: string;
};

type BackendColourResponse = {
    season?: string;
    undertone?: string;
    contrast?: string;
    bestJewelry?: string;
    recommendedColors?: string[];
    colorsToAvoid?: string[];
    analysis?: string;
    summary?: string;
    [key: string]: any;
};

// ================
//     CONSTANTS
// ================
const fallbackAnalysis: ColourAnalysisResultData = {
    season: "Not provided",
    seasonKey: null,
    undertone: "Not provided",
    contrast: "Not provided",
    bestJewelry: "Not provided",
    summary: "No summary was provided.",
    recommendedColors: [],
    bestColors: [],
    bestColorsDescription: "Not provided",
    worstColors: [],
    worstColorsDescription: "Not provided",
};

// ================
//     HELPERS
// ================

// Converts backend season names into 
// keys used by seasonpalettes
const seasonNameToKey = (season: string): SeasonKey | null => {
    const normalized = season.toLowerCase().replace(/\s+/g, "");

    const map: Record<string, SeasonKey> = {
        lightspring: "lightSpring",
        truespring: "trueSpring",
        brightspring: "brightSpring",
        lightsummer: "lightSummer",
        truesummer: "trueSummer",
        softsummer: "softSummer",
        softautumn: "softAutumn",
        trueautumn: "trueAutumn",
        deepautumn: "deepAutumn",
        deepwinter: "deepWinter",
        truewinter: "trueWinter",
        brightwinter: "brightWinter",
    };

    return map[normalized] || null;
};

// ================
// COLOUR ANALYSIS COMPONENT
// ================
export default function ColourAnalysisScreen() {

    // navigation / responsive layout
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 768;

    // result state
    const [hasAnalysis, setHasAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] =
        useState<ColourAnalysisResultData>(fallbackAnalysis);

    // form state
    const [selfies, setSelfies] = useState<string[]>([]);
    const [naturalHair, setNaturalHair] = useState("");
    const [currentHair, setCurrentHair] = useState("");
    const [eyeColor, setEyeColor] = useState("");
    const [jewelry, setJewelry] = useState("");
    const [veins, setVeins] = useState("");
    const [sunReaction, setSunReaction] = useState("");

    // loading / error state
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [analysing, setAnalysing] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [isSavedResult, setIsSavedResult] = useState(false);
    const [error, setError] = useState("");

    // safely reads strings from backend response
    const safeString = (value: unknown, fallback: string) => {
        return typeof value === "string" && value.trim().length > 0
            ? value
            : fallback;
    };

    // safely reads color arrays from backend response
    const safeColorArray = (value: unknown): string[] => {
        if (!Array.isArray(value)) return [];

        return value.filter(
            (item) => typeof item === "string" && item.trim().length > 0
        );
    };

    // converts raw backend response data 
    // into the frontend result format
    const normalizeAnalysisResult = (
        data: BackendColourResponse
    ): ColourAnalysisResultData => {
        const season = safeString(
            data.season || data.colourSeason,
            fallbackAnalysis.season
        );

        const seasonKey = seasonNameToKey(season);
        const palette = seasonKey ? seasonPalettes[seasonKey] : null;

        return {
            season,
            seasonKey,

            undertone: safeString(
                data.undertone || data.colourUndertone,
                fallbackAnalysis.undertone
            ),

<<<<<<< HEAD
      {loadingSaved && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.blueDark} />
          <Text style={styles.loadingText}>Loading your saved profile...</Text>
        </View>
      )}

      {analysing && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.blueDark} />
          <Text style={styles.loadingText}>Analysing your colours...</Text>
        </View>
      )}
=======
            contrast: safeString(
                data.contrast || data.colourContrast,
                fallbackAnalysis.contrast
            ),

            bestJewelry: safeString(data.bestJewelry, fallbackAnalysis.bestJewelry),
>>>>>>> bd722ab (Add moodboards API & refactor colour analysis)

            summary: safeString(
                data.summary || data.colourSummary || data.analysis,
                fallbackAnalysis.summary
            ),

            recommendedColors: safeColorArray(data.recommendedColors),

            bestColors: palette?.bestColors || [],
            bestColorsDescription:
                palette?.bestColorsDescription || fallbackAnalysis.bestColorsDescription,

            worstColors: palette?.worstColors || safeColorArray(data.colorsToAvoid),
            worstColorsDescription:
                palette?.worstColorsDescription ||
                fallbackAnalysis.worstColorsDescription,
        };
    };

    // loads saved analysis when screen
    //  becomes active
    useFocusEffect(
        useCallback(() => {
            const loadSavedAnalysis = async () => {
                setLoadingSaved(true);
                setError("");
                setIsSavedResult(false);

                try {
                    const profile = await getProfile();

                    const hasSavedAnalysis =
                        profile?.colourSeason ||
                        profile?.season ||
                        profile?.colourUndertone ||
                        profile?.colourContrast;
                    /* Replace with this after backend change -
        
                    profile?.season ||
                    profile?.contrast ||
                    profile?.undertone ||
                    profile?.bestJewelry ||
                    profile?.recommendedColors?.length ||
                    profile?.summary;
                    */

                    if (hasSavedAnalysis) {
                        const savedResult = normalizeAnalysisResult({
                            season: profile.colourSeason || profile.season,
                            undertone: profile.colourUndertone || profile.undertone,
                            contrast: profile.colourContrast || profile.contrast,
                            bestJewelry: profile.bestJewelry,
                            recommendedColors: profile.recommendedColors,
                            colorsToAvoid: profile.colorsToAvoid,
                            summary: profile.colourSummary || profile.summary,
                        });
                        /* Replace with this after backend change -
            
                        if (hasSavedAnalysis) {
                            const savedResult = normalizeAnalysisResult({
                                season: profile.season,
                                undertone: profile.undertone,
                                contrast: profile.contrast,
                                bestJewelry: profile.bestJewelry,
                                recommendedColors: profile.recommendedColors,
                                summary: profile.summary,
                            });
                        */

                        setAnalysisResult(savedResult);
                        setHasAnalysis(true);
                        setIsSavedResult(true);
                    } else {
                        setAnalysisResult(fallbackAnalysis);
                        setHasAnalysis(false);
                        setIsSavedResult(false);
                    }
                } catch {
                    setAnalysisResult(fallbackAnalysis);
                    setHasAnalysis(false);
                    setIsSavedResult(false);
                } finally {
                    setLoadingSaved(false);
                }
            };

            loadSavedAnalysis();
        }, [])
    );

    // requests gallery access permissions
    const requestMediaPermissions = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "We need access to your gallery to upload selfies."
            );
            return false;
        }

        return true;
    };

    // requests camera access permission
    const requestCameraPermissions = async () => {
        const permission =
            await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "We need camera access to take a selfie."
            );
            return false;
        }

        return true;
    };

    // picks an image from the gallery
    const pickImage = async (index: number) => {
        const ok = await requestMediaPermissions();

        if (!ok) return;

        const picked = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!picked.canceled && picked.assets.length > 0) {
            const updated = [...selfies];
            updated[index] = picked.assets[0].uri;

            setSelfies(updated);
            setError("");
            setIsSavedResult(false);
        }
    };

    // takes a photo with the camera and adds 
    // it to the first upload spot
    const takePhoto = async () => {
        const ok = await requestCameraPermissions();

        if (!ok) return;

        const picked = await ImagePicker.launchCameraAsync({
            quality: 0.85,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!picked.canceled && picked.assets.length > 0) {
            const updated = [...selfies];
            updated[0] = picked.assets[0].uri;

            setSelfies(updated);
            setError("");
            setIsSavedResult(false);
        }
    };

    // converts uploaded images into FormData for
    // backend API request
    const appendImageToFormData = async (
        formData: FormData,
        imageUri: string,
        fieldName: string
    ) => {
        const uriParts = imageUri.split("/");
        const fileName = uriParts[uriParts.length - 1] || "selfie.jpg";
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
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: mimeType });

            formData.append(fieldName, file);
        } else {
            formData.append(fieldName, {
                uri: imageUri,
                name: fileName,
                type: mimeType,
            } as any);
        }
    };

    // sends images and form data to backend 
    // API to generate colour analysis result
    const generateAnalysis = async () => {
        const validSelfies = selfies.filter(Boolean);

        if (validSelfies.length === 0) {
            setError("Please upload at least one selfie before generating analysis.");
            return;
        }

        setAnalysing(true);
        setError("");

        try {
            const token = await getToken();

            if (!token) {
                throw new Error("No authentication token found. Please log in again.");
            }

            const formData = new FormData();

            await appendImageToFormData(formData, validSelfies[0], "file");

            for (let i = 1; i < validSelfies.length; i++) {
                await appendImageToFormData(
                    formData,
                    validSelfies[i],
                    "additionalFiles"
                );
            }

            formData.append("naturalHair", naturalHair.trim());
            formData.append("currentHair", currentHair.trim());
            formData.append("eyeColor", eyeColor.trim());
            formData.append("jewelry", jewelry);
            formData.append("veins", veins);
            formData.append("sunReaction", sunReaction);

            const rawResult = await new Promise<string>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open("POST", `${API_BASE_URL}/api/colour/analyze`);
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    } else {
                        reject(
                            new Error(
                                `Analysis failed: ${xhr.status} - ${xhr.responseText}`
                            )
                        );
                    }
                };

                xhr.onerror = () => reject(new Error("Network error"));
                xhr.send(formData);
            });

            console.log("RAW AI RESPONSE TEXT:", rawResult);

            const data: BackendColourResponse = JSON.parse(rawResult);

            console.log("PARSED AI RESPONSE:", JSON.stringify(data, null, 2));

            const formattedResult = normalizeAnalysisResult(data);

            console.log(
                "NORMALIZED AI RESULT:",
                JSON.stringify(formattedResult, null, 2)
            );

            setAnalysisResult(formattedResult);
            setHasAnalysis(true);
            setIsSavedResult(false);
        } catch (err: any) {
            setError(err?.message || "Analysis failed. Please try again.");
        } finally {
            setAnalysing(false);
        }
    };

    // shows the form again without deleting
    //  previous result 
    const retakeAnalysis = () => {
        setHasAnalysis(false);
        setIsSavedResult(false);
        setError("");
    };

    // clears saved analysis from backend
    const clearSavedAnalysis = async () => {
        setClearing(true);
        setError("");

        try {
            await clearColourAnalysis();

            setHasAnalysis(false);
            setIsSavedResult(false);
            setAnalysisResult(fallbackAnalysis);
        } catch {
            setError("Could not clear your saved analysis. Please try again.");
        } finally {
            setClearing(false);
        }
    };

    // navigates back to previous screen or main menu
    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(tabs)/mainMenu" as any);
        }
    };

    // ================
    //     RENDER
    // ================
    return (
        <ScrollView
            style={globalStyles.screen}
            contentContainerStyle={[
                styles.scrollContent,
                isLargeScreen && styles.largeScrollContent,
            ]}
        >
            <View style={styles.pageContainer}>
                <ColourAnalysisHeader
                    isLargeScreen={isLargeScreen}
                    onBack={goBack}
                />

                {loadingSaved ? (
                    <View style={[globalStyles.card, styles.loadingCard]}>
                        <ActivityIndicator size="large" color={colors.blueDark} />

                        <Text style={styles.loadingText}>
                            Loading your saved colour analysis...
                        </Text>
                    </View>
                ) : hasAnalysis ? (
                    <ColourAnalysisResult
                        result={analysisResult}
                        isSavedResult={isSavedResult}
                        clearing={clearing}
                        onRetake={retakeAnalysis}
                        onClearSaved={clearSavedAnalysis}
                    />
                ) : (
                    <ColourAnalysisForm
                        selfies={selfies}
                        naturalHair={naturalHair}
                        currentHair={currentHair}
                        eyeColor={eyeColor}
                        jewelry={jewelry}
                        veins={veins}
                        sunReaction={sunReaction}
                        loading={analysing}
                        error={error}
                        onPickImage={pickImage}
                        onTakePhoto={takePhoto}
                        setNaturalHair={setNaturalHair}
                        setCurrentHair={setCurrentHair}
                        setEyeColor={setEyeColor}
                        setJewelry={setJewelry}
                        setVeins={setVeins}
                        setSunReaction={setSunReaction}
                        onGenerate={generateAnalysis}
                    />
                )}

                {hasAnalysis && error ? (
                    <Text style={globalStyles.errorText}>{error}</Text>
                ) : null}
            </View>
        </ScrollView>
    );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
<<<<<<< HEAD
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
    backgroundColor: colors.card,
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
  subtitle: { fontSize: 14, color: colors.blueDark, marginBottom: 4 },
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
    backgroundColor: colors.blue,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  analyseButtonText: { color: "#233443", fontWeight: "700", fontSize: 15 },
  loadingBox: { alignItems: "center", paddingVertical: 24, gap: 12 },
  loadingText: { color: colors.blueDark, fontSize: 14, fontWeight: "500" },
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
    backgroundColor: colors.blue,
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
    color: colors.blueDark,
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
=======
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },

    largeScrollContent: {
        alignItems: "center",
    },

    pageContainer: {
        width: "100%",
        maxWidth: 1100,
        gap: 20,
    },

    loadingCard: {
        borderRadius: 24,
        padding: 28,
        alignItems: "center",
        gap: 12,
    },

    loadingText: {
        color: colors.muted,
        fontSize: 15,
        fontWeight: "600",
    },
});
>>>>>>> bd722ab (Add moodboards API & refactor colour analysis)
