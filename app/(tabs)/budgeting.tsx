import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { getShoppingSuggestions, saveShoppingItem } from "../../api/shopping";
import { globalStyles } from "../../constants/globalStyles";
import { getToken } from "../../utils/token";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function Budgeting() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const [budget, setBudget] = React.useState("200");
  const [currency, setCurrency] = React.useState("CAD");
  const [location, setLocation] = React.useState("Toronto, Ontario");
  const [focusCategory, setFocusCategory] = React.useState("outerwear");
  const [preferOnline, setPreferOnline] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState<any>(null);
  const [savedItems, setSavedItems] = React.useState<Record<number, boolean>>(
    {}
  );
  const [savingItems, setSavingItems] = React.useState<Record<number, boolean>>(
    {}
  );

  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatInput, setChatInput] = React.useState("");
  const [chatLoading, setChatLoading] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: 'Want more precise results? Ask me to refine these suggestions — e.g. "I want something cheaper", "show me more formal options", or "I prefer in-store shopping near me".',
    },
  ]);

  const resetChat = () => {
    setChatOpen(false);
    setChatInput("");
    setChatMessages([
      {
        id: "welcome",
        role: "assistant",
        text: 'Want more precise results? Ask me to refine these suggestions — e.g. "I want something cheaper", "show me more formal options", or "I prefer in-store shopping near me".',
      },
    ]);
  };

  const buildChatContext = (question: string) => {
    if (!result) return question;

    const suggestionsSummary = (result.suggestions || [])
      .map(
        (s: any) =>
          `- ${s.item} (${s.category}), ${s.estimatedPrice} at ${s.storeName}`
      )
      .join("\n");

    return `
The user is asking a follow-up question about their shopping suggestions to get more precise results.

Their shopping preferences:
- Budget: ${budget} ${currency}
- Location: ${location}
- Focus Category: ${focusCategory}
- Prefers Online: ${preferOnline ? "Yes" : "No"}
- Season: ${result.season || "Not specified"}
- Wardrobe Gaps: ${(result.gapsIdentified || []).join(", ") || "None"}
- Total Estimate: ${result.totalEstimate || "N/A"}

Current suggestions:
${suggestionsSummary}

User question: ${question}
    `.trim();
  };

  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    const history = chatMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.text,
      }));

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: buildChatContext(trimmed),
          history,
        }),
      });

      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
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

  const handleSaveItem = async (item: any, index: number) => {
    if (savedItems[index] || savingItems[index]) return;

    setSavingItems((prev) => ({ ...prev, [index]: true }));

    try {
      await saveShoppingItem({
        item: item.item,
        category: item.category,
        whyItFits: item.whyItFits,
        estimatedPrice: item.estimatedPrice,
        storeName: item.storeName,
        storeType: item.storeType,
        link: item.link,
        nearbyLocation: item.nearbyLocation,
      });

      setSavedItems((prev) => ({ ...prev, [index]: true }));
    } catch {
      // silently fail
    } finally {
      setSavingItems((prev) => ({ ...prev, [index]: false }));
    }
  };

  const submit = async () => {
    setSavedItems({});
    resetChat();
    setLoading(true);
    setError("");

    try {
      const data = await getShoppingSuggestions({
        destination: "Canada",
        budget: Number(budget) || 0,
        currency,
        location,
        focusCategory,
        preferOnline,
      });

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Could not load shopping suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = result?.suggestions || [];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeColors.bg },
      ]}
      contentContainerStyle={styles.content}
    >
      <Pressable
        style={[
          styles.backButton,
          { backgroundColor: themeColors.bgDark },
        ]}
        onPress={() => router.back()}
      >
        <Text
          style={[
            styles.backButtonText,
            { color: themeColors.white },
          ]}
        >
          ← Back
        </Text>
      </Pressable>

      <Text
        style={[
          styles.title,
          { color: themeColors.text },
        ]}
      >
        Budgeting
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: themeColors.muted },
        ]}
      >
        Find real shopping links based on your budget, currency, location, and
        focus category.
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: themeColors.card },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.input,
              borderColor: themeColors.input,
              color: themeColors.text,
            },
          ]}
          placeholder="Budget"
          placeholderTextColor={themeColors.muted}
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.input,
              borderColor: themeColors.input,
              color: themeColors.text,
            },
          ]}
          placeholder="Currency"
          placeholderTextColor={themeColors.muted}
          value={currency}
          onChangeText={setCurrency}
          autoCapitalize="characters"
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.input,
              borderColor: themeColors.input,
              color: themeColors.text,
            },
          ]}
          placeholder="Location"
          placeholderTextColor={themeColors.muted}
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeColors.input,
              borderColor: themeColors.input,
              color: themeColors.text,
            },
          ]}
          placeholder="Focus category e.g. shoes, outerwear"
          placeholderTextColor={themeColors.muted}
          value={focusCategory}
          onChangeText={setFocusCategory}
        />

        <View style={styles.switchRow}>
          <Text
            style={[
              styles.switchText,
              { color: themeColors.text },
            ]}
          >
            Online stores only
          </Text>

          <Switch
            value={preferOnline}
            onValueChange={setPreferOnline}
            trackColor={{
              false: themeColors.input,
              true: themeColors.blue,
            }}
            thumbColor={
              preferOnline ? themeColors.blueDark : themeColors.white
            }
          />
        </View>

        {error ? (
          <Text
            style={[
              globalStyles.errorText,
              { color: themeColors.accent },
            ]}
          >
            {error}
          </Text>
        ) : null}

        <Pressable
          style={[
            globalStyles.primaryButton,
            { backgroundColor: themeColors.button },
          ]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={themeColors.white} />
          ) : (
            <Text
              style={[
                globalStyles.primaryButtonText,
                { color: themeColors.white },
              ]}
            >
              Get Shopping Suggestions
            </Text>
          )}
        </Pressable>
      </View>

      {result && (
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: themeColors.blue },
          ]}
        >
          <Text
            style={[
              styles.summaryText,
              { color: themeColors.text },
            ]}
          >
            Season: {result.season || "Not provided"}
          </Text>

          <Text
            style={[
              styles.summaryText,
              { color: themeColors.text },
            ]}
          >
            Gaps: {(result.gapsIdentified || []).join(", ") || "None"}
          </Text>

          <Text
            style={[
              styles.summaryText,
              { color: themeColors.text },
            ]}
          >
            Total Estimate: {result.totalEstimate || "N/A"}
          </Text>

          <Text
            style={[
              styles.summaryText,
              { color: themeColors.text },
            ]}
          >
            Within Budget: {result.withinBudget ? "Yes" : "No"}
          </Text>
        </View>
      )}

      {suggestions.map((item: any, index: number) => (
        <View
          key={`${item.item}-${index}`}
          style={[
            styles.productCard,
            { backgroundColor: themeColors.card },
          ]}
        >
          <Text
            style={[
              styles.itemName,
              { color: themeColors.text },
            ]}
          >
            {item.item}
          </Text>

          <Text
            style={[
              styles.detail,
              { color: themeColors.muted },
            ]}
          >
            Category: {item.category}
          </Text>

          <Text
            style={[
              styles.detail,
              { color: themeColors.muted },
            ]}
          >
            Why it fits: {item.whyItFits}
          </Text>

          <Text
            style={[
              styles.detail,
              { color: themeColors.muted },
            ]}
          >
            Price: {item.estimatedPrice}
          </Text>

          <Text
            style={[
              styles.detail,
              { color: themeColors.muted },
            ]}
          >
            Store: {item.storeName} ({item.storeType})
          </Text>

          <Text
            style={[
              styles.detail,
              { color: themeColors.muted },
            ]}
          >
            Nearby: {item.nearbyLocation || "Online"}
          </Text>

          {!!item.link && (
            <Pressable
              style={[
                styles.linkButton,
                { backgroundColor: themeColors.bgDark },
              ]}
              onPress={() => Linking.openURL(item.link)}
            >
              <Text
                style={[
                  styles.linkText,
                  { color: themeColors.white },
                ]}
              >
                Open Product Link
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.saveButton,
              { backgroundColor: themeColors.blueDark },
              savedItems[index] && { backgroundColor: themeColors.bgDark },
            ]}
            onPress={() => handleSaveItem(item, index)}
            disabled={!!savedItems[index] || !!savingItems[index]}
          >
            {savingItems[index] ? (
              <ActivityIndicator color={themeColors.white} />
            ) : (
              <Text
                style={[
                  styles.saveButtonText,
                  { color: themeColors.white },
                ]}
              >
                {savedItems[index] ? "Saved" : "Save Item"}
              </Text>
            )}
          </Pressable>
        </View>
      ))}

      {result && suggestions.length > 0 && (
        <>
          {!chatOpen && (
            <Pressable
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
                Refine results with AI chat
              </Text>
            </Pressable>
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
                Refine your shopping results
              </Text>

              <View style={styles.chatMessages}>
                {chatMessages.map((msg) => {
                  const isUser = msg.role === "user";

                  return (
                    <View
                      key={msg.id}
                      style={[
                        isUser ? styles.userBubble : styles.botBubble,
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
                  placeholder="e.g. I want something cheaper..."
                  placeholderTextColor={themeColors.muted}
                  value={chatInput}
                  onChangeText={setChatInput}
                  multiline
                />

                <Pressable
                  style={[
                    styles.sendButton,
                    { backgroundColor: themeColors.blueDark },
                    (!chatInput.trim() || chatLoading) && { opacity: 0.5 },
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
        </>
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
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  switchText: {
    fontWeight: "700",
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryText: {
    marginBottom: 4,
    fontWeight: "600",
  },
  productCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  detail: {
    marginBottom: 4,
  },
  linkButton: {
    padding: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    fontWeight: "700",
  },
  saveButton: {
    padding: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontWeight: "700",
  },
  chatButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  chatButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },
  chatCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
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
});