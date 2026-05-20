import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { getShoppingSuggestions, saveShoppingItem } from "../../api/shopping";
import { colors, globalStyles } from "../../constants/globalStyles";

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
      <Pressable style={styles.backButton} onPress={() => router.back()}><Text style={styles.backButtonText}>← Back</Text></Pressable>
      <Text style={styles.title}>Budgeting</Text>
      <Text style={styles.subtitle}>Find real shopping links based on your budget, currency, location, and focus category.</Text>

      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Budget" keyboardType="numeric" value={budget} onChangeText={setBudget} />
        <TextInput style={styles.input} placeholder="Currency" value={currency} onChangeText={setCurrency} autoCapitalize="characters" />
        <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
        <TextInput style={styles.input} placeholder="Focus category e.g. shoes, outerwear" value={focusCategory} onChangeText={setFocusCategory} />
        <View style={styles.switchRow}><Text style={styles.switchText}>Online stores only</Text><Switch value={preferOnline} onValueChange={setPreferOnline} /></View>
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
        <Pressable style={globalStyles.primaryButton} onPress={submit} disabled={loading}>{loading ? <ActivityIndicator color={colors.white} /> : <Text style={globalStyles.primaryButtonText}>Get Shopping Suggestions</Text>}</Pressable>
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
          {!!item.link && <Pressable style={styles.linkButton} onPress={() => Linking.openURL(item.link)}><Text style={styles.linkText}>Open Product Link</Text></Pressable>}
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
});
