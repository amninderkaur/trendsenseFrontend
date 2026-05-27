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
import { globalStyles } from "@/constants/globalStyles";
import { seasonPalettes } from "@/constants/seasonPalettes";
import { useAppTheme } from "@/context/ThemeContext";
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
    const { themeColors } = useAppTheme();

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

            contrast: safeString(
                data.contrast || data.colourContrast,
                fallbackAnalysis.contrast
            ),

            bestJewelry: safeString(data.bestJewelry, fallbackAnalysis.bestJewelry),

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
      style={[
        globalStyles.screen,
        { backgroundColor: themeColors.bg },
      ]}
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
          <View
            style={[
              globalStyles.card,
              styles.loadingCard,
              { backgroundColor: themeColors.card },
            ]}
          >
            <ActivityIndicator size="large" color={themeColors.blueDark} />

            <Text
              style={[
                styles.loadingText,
                { color: themeColors.muted },
              ]}
            >
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
          <Text
            style={[
              globalStyles.errorText,
              { color: themeColors.accent },
            ]}
          >
            {error}
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
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
        fontSize: 15,
        fontWeight: "600",
    },
});