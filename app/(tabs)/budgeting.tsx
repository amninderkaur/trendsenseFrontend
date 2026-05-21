import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { getShoppingSuggestions, saveShoppingItem } from "../../api/shopping";
import { colors, globalStyles } from "../../constants/globalStyles";
import { getToken } from "../../utils/token";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

export default function Budgeting() {
  const router = useRouter();
  const [budget, setBudget] = React.useState("200");
  const [currency, setCurrency] = React.useState("CAD");
  const [location, setLocation] = React.useState("Toronto, Ontario");
  const [focusCategory, setFocusCategory] = React.useState("outerwear");
  const [preferOnline, setPreferOnline] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState<any>(null);
  const [savedItems, setSavedItems] = React.useState<Record<number, boolean>>({});
  const [savingItems, setSavingItems] = React.useState<Record<number, boolean>>({});

  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatInput, setChatInput] = React.useState("");
  const [chatLoading, setChatLoading] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: "Want more precise results? Ask me to refine these suggestions — e.g. \"I want something cheaper\", \"show me more formal options\", or \"I prefer in-store shopping near me\"." },
  ]);

  const resetChat = () => {
    setChatOpen(false);
    setChatInput("");
    setChatMessages([
      { id: "welcome", role: "assistant", text: "Want more precise results? Ask me to refine these suggestions — e.g. \"I want something cheaper\", \"show me more formal options\", or \"I prefer in-store shopping near me\"." },
    ]);
  };

  const buildChatContext = (question: string) => {
    if (!result) return question;
    const suggestionsSummary = (result.suggestions || [])
      .map((s: any) => `- ${s.item} (${s.category}), ${s.estimatedPrice} at ${s.storeName}`)
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

    const userMsg: ChatMessage = { id: `${Date.now()}-user`, role: "user", text: trimmed };
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Budgeting</Text>
      <Text style={styles.subtitle}>Find real shopping links based on your budget, currency, location, and focus category.</Text>

      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Budget" keyboardType="numeric" value={budget} onChangeText={setBudget} />
        <TextInput style={styles.input} placeholder="Currency" value={currency} onChangeText={setCurrency} autoCapitalize="characters" />
        <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
        <TextInput style={styles.input} placeholder="Focus category e.g. shoes, outerwear" value={focusCategory} onChangeText={setFocusCategory} />
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Online stores only</Text>
          <Switch value={preferOnline} onValueChange={setPreferOnline} />
        </View>
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
        <Pressable style={globalStyles.primaryButton} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.white} /> : <Text style={globalStyles.primaryButtonText}>Get Shopping Suggestions</Text>}
        </Pressable>
      </View>

      {result && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Season: {result.season || "Not provided"}</Text>
          <Text style={styles.summaryText}>Gaps: {(result.gapsIdentified || []).join(", ") || "None"}</Text>
          <Text style={styles.summaryText}>Total Estimate: {result.totalEstimate || "N/A"}</Text>
          <Text style={styles.summaryText}>Within Budget: {result.withinBudget ? "Yes" : "No"}</Text>
        </View>
      )}

      {suggestions.map((item: any, index: number) => (
        <View key={`${item.item}-${index}`} style={styles.productCard}>
          <Text style={styles.itemName}>{item.item}</Text>
          <Text style={styles.detail}>Category: {item.category}</Text>
          <Text style={styles.detail}>Why it fits: {item.whyItFits}</Text>
          <Text style={styles.detail}>Price: {item.estimatedPrice}</Text>
          <Text style={styles.detail}>Store: {item.storeName} ({item.storeType})</Text>
          <Text style={styles.detail}>Nearby: {item.nearbyLocation || "Online"}</Text>
          {!!item.link && (
            <Pressable style={styles.linkButton} onPress={() => Linking.openURL(item.link)}>
              <Text style={styles.linkText}>Open Product Link</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.saveButton, savedItems[index] && styles.saveButtonSaved]}
            onPress={() => handleSaveItem(item, index)}
            disabled={!!savedItems[index] || !!savingItems[index]}
          >
            {savingItems[index]
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.saveButtonText}>{savedItems[index] ? "Saved" : "Save Item"}</Text>}
          </Pressable>
        </View>
      ))}

      {result && suggestions.length > 0 && (
        <>
          {!chatOpen && (
            <Pressable style={styles.chatButton} onPress={() => setChatOpen(true)}>
              <Text style={styles.chatButtonText}>Refine results with AI chat</Text>
            </Pressable>
          )}

          {chatOpen && (
            <View style={styles.chatCard}>
              <Text style={styles.chatTitle}>Refine your shopping results</Text>

              <View style={styles.chatMessages}>
                {chatMessages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <View key={msg.id} style={isUser ? styles.userBubble : styles.botBubble}>
                      <Text style={isUser ? styles.userBubbleText : styles.botBubbleText}>{msg.text}</Text>
                    </View>
                  );
                })}
                {chatLoading && (
                  <View style={styles.botBubble}>
                    <ActivityIndicator color={colors.blueDark} />
                  </View>
                )}
              </View>

              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="e.g. I want something cheaper..."
                  placeholderTextColor={colors.muted}
                  value={chatInput}
                  onChangeText={setChatInput}
                  multiline
                />
                <Pressable
                  style={[styles.sendButton, (!chatInput.trim() || chatLoading) && { opacity: 0.5 }]}
                  onPress={sendChatMessage}
                  disabled={!chatInput.trim() || chatLoading}
                >
                  <Text style={styles.sendButtonText}>Send</Text>
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
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: "flex-start", backgroundColor: colors.bgDark, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: colors.white, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  subtitle: { color: colors.muted, marginTop: 6, marginBottom: 18 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 16 },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.input },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  switchText: { fontWeight: "700", color: colors.text },
  summaryCard: { backgroundColor: colors.blue, padding: 16, borderRadius: 16, marginBottom: 16 },
  summaryText: { color: colors.text, marginBottom: 4, fontWeight: "600" },
  productCard: { backgroundColor: colors.card, padding: 16, borderRadius: 16, marginBottom: 12 },
  itemName: { fontSize: 18, fontWeight: "800", marginBottom: 8, color: colors.text },
  detail: { color: colors.muted, marginBottom: 4 },
  linkButton: { backgroundColor: colors.bgDark, padding: 12, borderRadius: 999, alignItems: "center", marginTop: 10 },
  linkText: { color: colors.white, fontWeight: "700" },
  saveButton: { backgroundColor: colors.blueDark, padding: 12, borderRadius: 999, alignItems: "center", marginTop: 8 },
  saveButtonSaved: { backgroundColor: "#7aab86" },
  saveButtonText: { color: colors.white, fontWeight: "700" },
  chatButton: { backgroundColor: colors.blueDark, paddingVertical: 14, borderRadius: 999, alignItems: "center", marginTop: 8, marginBottom: 12 },
  chatButtonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
  chatCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 12 },
  chatTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 10 },
  chatMessages: { gap: 10, marginBottom: 12 },
  botBubble: { alignSelf: "flex-start", maxWidth: "88%", backgroundColor: colors.input, borderRadius: 16, borderBottomLeftRadius: 4, paddingVertical: 10, paddingHorizontal: 12 },
  userBubble: { alignSelf: "flex-end", maxWidth: "88%", backgroundColor: colors.blueDark, borderRadius: 16, borderBottomRightRadius: 4, paddingVertical: 10, paddingHorizontal: 12 },
  botBubbleText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  userBubbleText: { color: colors.white, fontSize: 14, lineHeight: 20 },
  chatInputRow: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  chatInput: { flex: 1, minHeight: 48, maxHeight: 120, backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.blueDark, color: colors.text, fontSize: 14 },
  sendButton: { backgroundColor: colors.blueDark, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 999 },
  sendButtonText: { color: colors.white, fontWeight: "700" },
});
