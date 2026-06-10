import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { saveOutfitHistory } from "@/api/outfitHistory";
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
  useWindowDimensions,
} from "react-native";

type SelectedItem = {
  itemId: string;
  type: string;
  color: string;
  imageBase64: string;
};

type OutfitSuggestionResponse = {
  selectedItems: SelectedItem[];
  reasoning: string;
  weatherSummary: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function OutfitSuggestionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { themeColors } = useAppTheme();

  const isLargeScreen = width >= 768;

  const [occasion, setOccasion] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutfitSuggestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(true);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [savingOutfit, setSavingOutfit] = useState(false);
  const [outfitSaved, setOutfitSaved] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Ask me anything about this outfit, like why I chose an item, what shoes would work, or how to make it warmer.",
    },
  ]);

  const canSendChat = useMemo(
    () => chatInput.trim().length > 0 && !chatLoading,
    [chatInput, chatLoading],
  );

  const resetChat = () => {
    setChatOpen(false);
    setChatInput("");
    setChatMessages([
      {
        id: "assistant-welcome",
        role: "assistant",
        text: "Ask me anything about this outfit, like why I chose an item, what shoes would work, or how to make it warmer.",
      },
    ]);
  };

  const handleSuggest = async () => {
    if (!occasion.trim() || !city.trim()) {
      setError("Please enter both occasion and city.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setRating(null);
      resetChat();

      const token = await getToken();

      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/outfit/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          occasion: occasion.trim(),
          city: city.trim(),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error ${response.status}`);
      }

      const data: OutfitSuggestionResponse = await response.json();

      setResult(data);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setShowForm(true);
    setResult(null);
    setRating(null);
    setError(null);
    setOutfitSaved(false);
    resetChat();
  };

  const handleSaveOutfit = async () => {
    if (!result || savingOutfit || outfitSaved) return;
    setSavingOutfit(true);
    try {
      await saveOutfitHistory({
        occasion: occasion.trim(),
        city: city.trim(),
        weatherSummary: result.weatherSummary,
        reasoning: result.reasoning,
        selectedItems: result.selectedItems,
      });
      setOutfitSaved(true);
    } catch {
      // silently fail — don't block the UI
    } finally {
      setSavingOutfit(false);
    }
  };

  const buildOutfitContextMessage = (question: string) => {
    if (!result) return question;

    const itemsText = result.selectedItems
      .map((item) => `- ${item.color} ${item.type}`)
      .join("\n");

    return `
The user is asking a follow-up question about this exact outfit suggestion.

Occasion: ${occasion.trim()}
City: ${city.trim()}
Weather: ${result.weatherSummary}

Suggested outfit items:
${itemsText}

Original outfit reasoning:
${result.reasoning}

User question:
${question}
`;
  };

  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();

    if (!trimmed || !result || chatLoading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    const history = chatMessages
      .filter((message) => message.id !== "assistant-welcome")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        text: message.text,
      }));

    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: buildOutfitContextMessage(trimmed),
          history,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: data.reply,
      };

      setChatMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      console.error("Outfit follow-up chat error:", err);

      setChatMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "Sorry, I couldn't answer that right now. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

return (
  <ScrollView
    style={[
      globalStyles.screen,
      { backgroundColor: themeColors.bg },
    ]}
    contentContainerStyle={
      isLargeScreen
        ? [styles.scrollContent, styles.largeScrollContent]
        : styles.scrollContent
    }
    keyboardShouldPersistTaps="handled"
  >
    <View style={isLargeScreen ? globalStyles.dashboardContent : undefined}>
      <TouchableOpacity
        style={[
          styles.backButton,
          { backgroundColor: themeColors.bgDark },
        ]}
        onPress={() =>
          router.canGoBack()
            ? router.back()
            : router.replace("/(tabs)/mainMenu" as any)
        }
      >
        <Text
          style={[
            styles.backButtonText,
            { color: themeColors.text },
          ]}
        >
          ← Back
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          isLargeScreen
            ? [globalStyles.pageTitle, globalStyles.largePageTitle]
            : globalStyles.pageTitle,
          { color: themeColors.text },
        ]}
      >
        Outfit Suggestion
      </Text>

      {showForm && (
        <>
          <Text
            style={[
              isLargeScreen
                ? [globalStyles.bodyText, globalStyles.largeCardText]
                : globalStyles.bodyText,
              { color: themeColors.muted },
            ]}
          >
            Tell us your occasion and location — we'll pick the best outfit
            from your wardrobe based on the weather.
          </Text>

          <View style={styles.inputGroup}>
            <Text
              style={[
                isLargeScreen
                  ? [styles.label, styles.largeLabel]
                  : styles.label,
                { color: themeColors.text },
              ]}
            >
              Occasion
            </Text>

            <TextInput
              style={[
                isLargeScreen
                  ? [globalStyles.input, globalStyles.largeInput]
                  : globalStyles.input,
                {
                  backgroundColor: themeColors.input,
                  color: themeColors.text,
                  borderColor: themeColors.bgDark,
                },
              ]}
              placeholder="e.g. casual, work, gym, date night"
              placeholderTextColor={themeColors.blueDark}
              value={occasion}
              onChangeText={setOccasion}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[
                isLargeScreen
                  ? [styles.label, styles.largeLabel]
                  : styles.label,
                { color: themeColors.text },
              ]}
            >
              City
            </Text>

            <LocationAutocomplete
              containerStyle={{ marginBottom: 0 }}
              inputStyle={[
                isLargeScreen
                  ? [globalStyles.input, globalStyles.largeInput]
                  : globalStyles.input,
                {
                  backgroundColor: themeColors.input,
                  color: themeColors.text,
                  borderColor: themeColors.bgDark,
                  marginBottom: 0,
                },
              ]}
              placeholder="e.g. Toronto"
              placeholderTextColor={themeColors.blueDark}
              value={city}
              onChangeText={setCity}
              dropdownBg={themeColors.card}
              dropdownText={themeColors.text}
              dropdownBorder={themeColors.bgDark}
            />
          </View>

          <TouchableOpacity
            style={[
              loading
                ? [globalStyles.primaryButton, styles.disabled]
                : globalStyles.primaryButton,
              { backgroundColor: themeColors.button },
            ]}
            onPress={handleSuggest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={themeColors.white} />
            ) : (
              <Text
                style={[
                  isLargeScreen
                    ? [
                        globalStyles.primaryButtonText,
                        globalStyles.largePrimaryButtonText,
                      ]
                    : globalStyles.primaryButtonText,
                  { color: themeColors.white },
                ]}
              >
                Generate Outfit
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {error && (
        <Text
          style={[
            isLargeScreen
              ? [globalStyles.errorText, globalStyles.largeErrorText]
              : globalStyles.errorText,
            { color: themeColors.accent },
          ]}
        >
          {error}
        </Text>
      )}

      {!showForm && result && (
        <View style={styles.resultContainer}>
          {result.weatherSummary && (
            <View
              style={[
                globalStyles.dashboardCard,
                { backgroundColor: themeColors.card },
              ]}
            >
              <Text
                style={[
                  styles.infoLabel,
                  { color: themeColors.text },
                ]}
              >
                Weather
              </Text>

              <Text
                style={[
                  isLargeScreen
                    ? [globalStyles.cardText, globalStyles.largeCardText]
                    : globalStyles.cardText,
                  { color: themeColors.text },
                ]}
              >
                {result.weatherSummary}
              </Text>
            </View>
          )}

          {result.reasoning && (
            <View
              style={[
                globalStyles.dashboardCard,
                { backgroundColor: themeColors.card },
              ]}
            >
              <Text
                style={[
                  styles.infoLabel,
                  { color: themeColors.text },
                ]}
              >
                Why this outfit?
              </Text>

              <Text
                style={[
                  isLargeScreen
                    ? [globalStyles.cardText, globalStyles.largeCardText]
                    : globalStyles.cardText,
                  { color: themeColors.text },
                ]}
              >
                {result.reasoning}
              </Text>
            </View>
          )}

          {result.selectedItems.length === 0 && result.reasoning && (
            <View style={[globalStyles.dashboardCard, { backgroundColor: "#FFF3E0", borderLeftWidth: 4, borderLeftColor: "#C9A96E" }]}>
              <Text style={[styles.infoLabel, { color: "#C9A96E" }]}>
                ⚠️ Wardrobe Gap Detected
              </Text>
              <Text style={[globalStyles.cardText, { color: "#5C4033", lineHeight: 22 }]}>
                {result.reasoning}
              </Text>
            </View>
          )}

          {result.selectedItems.length > 0 && (
            <View>
              <Text
                style={[
                  isLargeScreen
                    ? [
                        globalStyles.sectionTitle,
                        globalStyles.largeSectionTitle,
                      ]
                    : globalStyles.sectionTitle,
                  { color: themeColors.text },
                ]}
              >
                Your Outfit
              </Text>

              <View style={styles.itemsGrid}>
                {result.selectedItems.map((item) => (
                  <View
                    key={item.itemId}
                    style={[
                      isLargeScreen
                        ? [styles.itemCard, styles.largeItemCard]
                        : styles.itemCard,
                      {
                        backgroundColor: themeColors.card,
                        borderColor: themeColors.bgDark,
                      },
                    ]}
                  >
                    <Image
                      source={{
                        uri: `data:image/png;base64,${item.imageBase64}`,
                      }}
                      style={styles.itemImage}
                    />

                    <Text
                      style={[
                        isLargeScreen
                          ? [styles.itemType, styles.largeItemText]
                          : styles.itemType,
                        { color: themeColors.text },
                      ]}
                    >
                      {item.type}
                    </Text>

                    <Text
                      style={[
                        isLargeScreen
                          ? [styles.itemColor, styles.largeItemText]
                          : styles.itemColor,
                        { color: themeColors.blueDark },
                      ]}
                    >
                      {item.color}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.ratingSection}>
            <Text
              style={[
                styles.ratingTitle,
                { color: themeColors.text },
              ]}
            >
              How do you feel about this outfit?
            </Text>

            <View style={styles.ratingRow}>
              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  {
                    backgroundColor:
                      rating === "up"
                        ? themeColors.bgDark
                        : themeColors.card,
                    borderColor: themeColors.bgDark,
                  },
                ]}
                onPress={() => {
                  setRating("up");
                  handleSaveOutfit();
                }}
              >
                <Text style={styles.ratingText}>👍</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ratingButton,
                  {
                    backgroundColor:
                      rating === "down"
                        ? themeColors.bgDark
                        : themeColors.card,
                    borderColor: themeColors.bgDark,
                  },
                ]}
                onPress={() => setRating("down")}
              >
                <Text style={styles.ratingText}>👎</Text>
              </TouchableOpacity>
            </View>

            {outfitSaved && (
              <Text
                style={[
                  styles.savedText,
                  { color: themeColors.blueDark },
                ]}
              >
                Outfit saved to your history!
              </Text>
            )}

            {savingOutfit && (
              <ActivityIndicator
                color={themeColors.blueDark}
                style={{ marginTop: 6 }}
              />
            )}
          </View>

          {rating === "down" && (
            <TouchableOpacity
              style={[
                styles.retryButton,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={handleRetry}
            >
              <Text
                style={[
                  styles.retryButtonText,
                  { color: themeColors.white },
                ]}
              >
                Retry Outfit Generation
              </Text>
            </TouchableOpacity>
          )}

          {!chatOpen && (
            <TouchableOpacity
              style={[
                styles.followUpButton,
                { backgroundColor: themeColors.blueDark },
              ]}
              onPress={() => setChatOpen(true)}
            >
              <Text
                style={[
                  styles.followUpButtonText,
                  { color: themeColors.white },
                ]}
              >
                Chat with the bot about this outfit
              </Text>
            </TouchableOpacity>
          )}

          {chatOpen && (
            <View
              style={[
                globalStyles.dashboardCard,
                { backgroundColor: themeColors.card },
              ]}
            >
              <Text
                style={[
                  isLargeScreen
                    ? [globalStyles.cardTitle, globalStyles.largeCardTitle]
                    : globalStyles.cardTitle,
                  { color: themeColors.text },
                ]}
              >
                Ask about this outfit
              </Text>

              <View style={styles.chatMessages}>
                {chatMessages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <View
                      key={message.id}
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
                        {message.text}
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
                  placeholder="Ask why this outfit works..."
                  placeholderTextColor={themeColors.blueDark}
                  value={chatInput}
                  onChangeText={setChatInput}
                  multiline
                />

                <Pressable
                  style={[
                    canSendChat
                      ? styles.sendButton
                      : [styles.sendButton, styles.disabled],
                    { backgroundColor: themeColors.blueDark },
                  ]}
                  onPress={sendChatMessage}
                  disabled={!canSendChat}
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
        </View>
      )}
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },

  largeScrollContent: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  inputGroup: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  largeLabel: {
    fontSize: 18,
  },

  disabled: {
    opacity: 0.6,
  },

  resultContainer: {
    gap: 16,
    marginTop: 8,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  itemCard: {
    width: "47%",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },

  largeItemCard: {
    width: "31%",
    padding: 16,
    borderRadius: 20,
  },

  itemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    resizeMode: "cover",
  },

  itemType: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  itemColor: {
    fontSize: 12,
    textTransform: "capitalize",
  },

  largeItemText: {
    fontSize: 18,
  },

  ratingSection: {
    alignItems: "center",
    gap: 10,
  },

  ratingTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  ratingButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
  },

  selectedRatingButton: {},

  ratingText: {
    fontSize: 24,
  },

  savedText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },

  retryButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },

  retryButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  followUpButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },

  followUpButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  chatMessages: {
    gap: 10,
    marginTop: 10,
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
    marginTop: 14,
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

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 4,
  },

  backButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});