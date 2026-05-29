import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { getTasteProfile } from "@/api/outfit";
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const { themeColors } = useAppTheme();
  const params = useLocalSearchParams<{ trendContext?: string }>();

  // trendContext banner (from TrendsScreen navigation)
  const [trendBanner, setTrendBanner] = useState<string | null>(
    params.trendContext ? String(params.trendContext) : null
  );
  const trendBannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // personalised badge
  const [showPersonalisedBadge, setShowPersonalisedBadge] = useState(false);

  useEffect(() => {
    if (trendBanner) {
      trendBannerTimer.current = setTimeout(() => setTrendBanner(null), 4000);
    }
    return () => {
      if (trendBannerTimer.current) clearTimeout(trendBannerTimer.current);
    };
  }, []);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [occasion, setOccasion] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; role: "user" | "assistant"; text: string }[]>([
    { id: "welcome", role: "assistant", text: "Ask me anything about this outfit review — why the score, how to improve it, what to add, or how to make it work for the weather." },
  ]);

  const resetChat = () => {
    setChatOpen(false);
    setChatInput("");
    setChatMessages([
      { id: "welcome", role: "assistant", text: "Ask me anything about this outfit review — why the score, how to improve it, what to add, or how to make it work for the weather." },
    ]);
  };

  const buildChatContext = (question: string) => {
    if (!result) return question;
    return `
The user is asking a follow-up question about this outfit analysis result.

Occasion: ${occasion.trim()}
${city.trim() ? `City: ${city.trim()}` : ""}
${result.currentWeather ? `Current Weather: ${result.currentWeather}` : ""}
Style Score: ${result.styleScore}/10
Weather Verdict: ${result.weatherVerdict}
${result.weatherReason ? `Weather Reason: ${result.weatherReason}` : ""}
What Works Well: ${result.whatWorksWell?.join(", ") || "none"}
Suggestions: ${result.suggestions?.join(", ") || "none"}
Overall Verdict: ${result.overallVerdict}

User question: ${question}
    `.trim();
  };

  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const userMsg = { id: `${Date.now()}-user`, role: "user" as const, text: trimmed };
    const history = chatMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", text: m.text }));

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: buildChatContext(trimmed), history }),
      });
      const data = await response.json();
      setChatMessages((prev) => [...prev, { id: `${Date.now()}-assistant`, role: "assistant", text: data.reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { id: `${Date.now()}-error`, role: "assistant", text: "Sorry, I couldn't answer that right now. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

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

      // check taste profile for personalised badge
      try {
        const profile = await getTasteProfile();
        if (profile?.totalRatings >= 3) {
          setShowPersonalisedBadge(true);
        }
      } catch {
        // taste profile not available yet
      }
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
    if (verdict === "unknown") return colors.blueDark;
    return "#c0726e";
  };

  // ============
  // RENDER
  // ============
return (
  <ScrollView
    style={[
      styles.container,
      { backgroundColor: themeColors.bg },
    ]}
    contentContainerStyle={styles.content}
  >
    {/* Trending now banner (from TrendsScreen) */}
    {!!trendBanner && (
      <TouchableOpacity
        style={[styles.trendBanner, { backgroundColor: themeColors.bgDark }]}
        onPress={() => setTrendBanner(null)}
        activeOpacity={0.85}
      >
        <Text style={[styles.trendBannerText, { color: themeColors.white }]}>
          ✨ Trending now: {trendBanner}
        </Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={[
        styles.backButton,
        { backgroundColor: themeColors.bgDark },
      ]}
      onPress={goBack}
    >
      <Text
        style={[
          styles.backButtonText,
          { color: themeColors.white },
        ]}
      >
        ← Back
      </Text>
    </TouchableOpacity>

    <Text
      style={[
        styles.title,
        { color: themeColors.text },
      ]}
    >
      Outfit Review
    </Text>

    <Text
      style={[
        styles.subtitle,
        { color: themeColors.muted },
      ]}
    >
      Upload a photo of your outfit and get AI feedback on your style, fit for
      the occasion, and weather suitability.
    </Text>

    {/* Image picker */}
    <TouchableOpacity
      style={[
        styles.imagePicker,
        { borderColor: themeColors.bgDark },
      ]}
      onPress={pickImage}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: themeColors.card },
          ]}
        >
          <Text style={styles.imagePlaceholderIcon}>📸</Text>

          <Text
            style={[
              styles.imagePlaceholderText,
              { color: themeColors.text },
            ]}
          >
            Tap to select outfit photo
          </Text>

          <Text
            style={[
              styles.imagePlaceholderSub,
              { color: themeColors.muted },
            ]}
          >
            JPEG, PNG, or WebP
          </Text>
        </View>
      )}
    </TouchableOpacity>

    {imageUri && (
      <TouchableOpacity
        style={styles.changePhoto}
        onPress={pickImage}
      >
        <Text
          style={[
            styles.changePhotoText,
            { color: themeColors.blueDark },
          ]}
        >
          Change photo
        </Text>
      </TouchableOpacity>
    )}

    {/* Form */}
    <View
      style={[
        styles.formCard,
        { backgroundColor: themeColors.card },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: themeColors.text },
        ]}
      >
        Occasion{" "}
        <Text
          style={[
            styles.required,
            { color: themeColors.accent },
          ]}
        >
          *
        </Text>
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.input,
            color: themeColors.text,
          },
        ]}
        placeholder="e.g. job interview, casual brunch, wedding"
        placeholderTextColor={themeColors.muted}
        value={occasion}
        onChangeText={setOccasion}
      />

      <Text
        style={[
          styles.label,
          { color: themeColors.text },
        ]}
      >
        City{" "}
        <Text
          style={[
            styles.optional,
            { color: themeColors.muted },
          ]}
        >
          (optional)
        </Text>
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.input,
            color: themeColors.text,
          },
        ]}
        placeholder="e.g. Toronto — for weather check"
        placeholderTextColor={themeColors.muted}
        value={city}
        onChangeText={setCity}
      />

      {!!error && (
        <Text
          style={[
            globalStyles.errorText,
            { color: themeColors.accent },
          ]}
        >
          {error}
        </Text>
      )}

      <Pressable
        style={[
          styles.analyzeButton,
          { backgroundColor: themeColors.blueDark },
          loading && { opacity: 0.6 },
        ]}
        onPress={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={themeColors.white} />
        ) : (
          <Text
            style={[
              styles.analyzeButtonText,
              { color: themeColors.white },
            ]}
          >
            Analyse Outfit
          </Text>
        )}
      </Pressable>
    </View>

    {/* Result */}
    {result && (
      <View style={styles.resultContainer}>
        {/* Personalised badge */}
        {showPersonalisedBadge && (
          <View style={styles.personalisedBadge}>
            <Text style={styles.personalisedBadgeText}>
              ✨ Personalised to your taste
            </Text>
          </View>
        )}

        {/* Score */}
        <View
          style={[
            styles.scoreCard,
            { backgroundColor: themeColors.card },
          ]}
        >
          <Text
            style={[
              styles.scoreLabel,
              { color: themeColors.muted },
            ]}
          >
            Style Score
          </Text>

          <Text
            style={[
              styles.scoreValue,
              { color: scoreColor(result.styleScore) },
            ]}
          >
            {result.styleScore}/10
          </Text>

          <Text
            style={[
              styles.scoreOccasion,
              { color: themeColors.text },
            ]}
          >
            {result.occasion}
          </Text>
        </View>

        {/* Overall verdict */}
        {!!result.overallVerdict && (
          <View
            style={[
              styles.section,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              Overall Verdict
            </Text>

            <Text
              style={[
                styles.verdictText,
                { color: themeColors.text },
              ]}
            >
              {result.overallVerdict}
            </Text>
          </View>
        )}

        {/* Weather */}
        {result.currentWeather && (
          <View
            style={[
              styles.section,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              Weather Check
            </Text>

            <Text
              style={[
                styles.weatherInfo,
                { color: themeColors.muted },
              ]}
            >
              {result.currentWeather}
            </Text>

            <View
              style={[
                styles.verdictBadge,
                {
                  backgroundColor: verdictColor(
                    result.weatherVerdict
                  ),
                },
              ]}
            >
              <Text
                style={[
                  styles.verdictBadgeText,
                  { color: themeColors.white },
                ]}
              >
                {result.weatherVerdict === "suitable"
                  ? "Suitable for the weather"
                  : result.weatherVerdict === "not suitable"
                  ? "Not suitable for the weather"
                  : "Weather check skipped"}
              </Text>
            </View>

            {!!result.weatherReason && (
              <Text
                style={[
                  styles.weatherReason,
                  { color: themeColors.text },
                ]}
              >
                {result.weatherReason}
              </Text>
            )}
          </View>
        )}

        {/* What works well */}
        {result.whatWorksWell?.length > 0 && (
          <View
            style={[
              styles.section,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              What Works Well
            </Text>

            {result.whatWorksWell.map((point, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletGreen}>✓</Text>

                <Text
                  style={[
                    styles.bulletText,
                    { color: themeColors.text },
                  ]}
                >
                  {point}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Suggestions */}
        {result.suggestions?.length > 0 && (
          <View
            style={[
              styles.section,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              Suggestions
            </Text>

            {result.suggestions.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text
                  style={[
                    styles.bulletBlue,
                    { color: themeColors.blueDark },
                  ]}
                >
                  →
                </Text>

                <Text
                  style={[
                    styles.bulletText,
                    { color: themeColors.text },
                  ]}
                >
                  {s}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!chatOpen && (
          <TouchableOpacity
            style={[
              styles.chatButton,
              { backgroundColor: themeColors.blueDark },
            ]}
            onPress={() => setChatOpen(true)}
          >
            <Text
              style={[
                styles.chatButtonText,
                { color: themeColors.white },
              ]}
            >
              Chat with the bot about this review
            </Text>
          </TouchableOpacity>
        )}

        {chatOpen && (
          <View
            style={[
              styles.chatCard,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Text
              style={[
                styles.chatTitle,
                { color: themeColors.text },
              ]}
            >
              Ask about this outfit
            </Text>

            <View style={styles.chatMessages}>
              {chatMessages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <View
                    key={msg.id}
                    style={[
                      isUser
                        ? styles.userBubble
                        : styles.botBubble,
                      {
                        backgroundColor: isUser
                          ? themeColors.blueDark
                          : themeColors.input,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        isUser
                          ? styles.userBubbleText
                          : styles.botBubbleText,
                        {
                          color: isUser
                            ? themeColors.white
                            : themeColors.text,
                        },
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                );
              })}

              {chatLoading && (
                <View
                  style={[
                    styles.botBubble,
                    { backgroundColor: themeColors.input },
                  ]}
                >
                  <ActivityIndicator color={themeColors.blueDark} />
                </View>
              )}
            </View>

            <View style={styles.chatInputRow}>
              <TextInput
                style={[
                  styles.chatInput,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.blueDark,
                    color: themeColors.text,
                  },
                ]}
                placeholder="Ask why the score, how to improve..."
                placeholderTextColor={themeColors.muted}
                value={chatInput}
                onChangeText={setChatInput}
                multiline
              />

              <Pressable
                style={[
                  styles.sendButton,
                  { backgroundColor: themeColors.blueDark },
                  (!chatInput.trim() || chatLoading) && {
                    opacity: 0.5,
                  },
                ]}
                onPress={sendChatMessage}
                disabled={!chatInput.trim() || chatLoading}
              >
                <Text
                  style={[
                    styles.sendButtonText,
                    { color: themeColors.white },
                  ]}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <Pressable
          style={[
            styles.retryButton,
            { backgroundColor: themeColors.bgDark },
          ]}
          onPress={() => {
            setResult(null);
            setImageUri(null);
            setOccasion("");
            setCity("");
            resetChat();
          }}
        >
          <Text
            style={[
              styles.retryButtonText,
              { color: themeColors.white },
            ]}
          >
            Analyse Another Outfit
          </Text>
        </Pressable>
      </View>
    )}
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },

  backButtonText: {
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },

  imagePicker: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 2,
    borderStyle: "dashed",
  },

  previewImage: {
    width: "100%",
    height: 320,
  },

  imagePlaceholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  imagePlaceholderIcon: {
    fontSize: 40,
  },

  imagePlaceholderText: {
    fontSize: 15,
    fontWeight: "600",
  },

  imagePlaceholderSub: {
    fontSize: 12,
  },

  changePhoto: {
    alignItems: "center",
    marginBottom: 16,
  },

  changePhotoText: {
    fontWeight: "600",
    fontSize: 13,
  },

  formCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 4,
  },

  required: {},

  optional: {
    fontWeight: "400",
  },

  input: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  analyzeButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },

  analyzeButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },

  resultContainer: {
    gap: 14,
  },

  scoreCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    gap: 4,
  },

  scoreLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  scoreValue: {
    fontSize: 52,
    fontWeight: "800",
  },

  scoreOccasion: {
    fontSize: 14,
    textTransform: "capitalize",
    marginTop: 2,
  },

  section: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  verdictText: {
    fontSize: 15,
    lineHeight: 22,
  },

  weatherInfo: {
    fontSize: 14,
  },

  verdictBadge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  verdictBadgeText: {
    fontWeight: "700",
    fontSize: 13,
  },

  weatherReason: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  bulletRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },

  bulletGreen: {
    color: "#5a9e6f",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 1,
  },

  bulletBlue: {
    fontWeight: "700",
    fontSize: 15,
    marginTop: 1,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  retryButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },

  retryButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  chatButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },

  chatButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  chatCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },

  chatTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  chatMessages: {
    gap: 10,
    marginBottom: 12,
  },

  botBubble: {
    alignSelf: "flex-start",
    maxWidth: "88%",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "88%",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  botBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },

  userBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },

  chatInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },

  chatInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 14,
  },

  sendButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  sendButtonText: {
    fontWeight: "700",
  },

  trendBanner: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  trendBannerText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  personalisedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 4,
  },
  personalisedBadgeText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "700",
  },
});