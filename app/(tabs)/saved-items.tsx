import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { deleteShoppingItem, getSavedShoppingItems } from "../../api/shopping";
import { colors, globalStyles } from "../../constants/globalStyles";
import { useFocusEffect } from "@react-navigation/native";

export default function SavedItems() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setError("");
    try {
      const data = await getSavedShoppingItems();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load saved items.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [])
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteShoppingItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <Pressable style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/mainMenu" as any)}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Saved Items</Text>
      <Text style={styles.subtitle}>Shopping items you've saved from budgeting suggestions.</Text>

      {loading && <ActivityIndicator color={colors.blueDark} style={{ marginTop: 40 }} />}

      {!!error && <Text style={globalStyles.errorText}>{error}</Text>}

      {!loading && items.length === 0 && !error && (
        <Text style={styles.emptyText}>No saved items yet. Save items from the Budgeting screen.</Text>
      )}

      {items.map((item: any) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.itemName}>{item.item}</Text>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id
                ? <ActivityIndicator color={colors.white} size="small" />
                : <Text style={styles.deleteText}>Remove</Text>}
            </Pressable>
          </View>
          <Text style={styles.detail}>Category: {item.category}</Text>
          <Text style={styles.detail}>Why it fits: {item.whyItFits}</Text>
          <Text style={styles.detail}>Price: {item.estimatedPrice}</Text>
          <Text style={styles.detail}>Store: {item.storeName} ({item.storeType})</Text>
          {!!item.nearbyLocation && (
            <Text style={styles.detail}>Nearby: {item.nearbyLocation}</Text>
          )}
          {!!item.link && (
            <Pressable style={styles.linkButton} onPress={() => Linking.openURL(item.link)}>
              <Text style={styles.linkText}>Open Product Link</Text>
            </Pressable>
          )}
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
  emptyText: { fontSize: 15, color: colors.muted, textAlign: "center", marginTop: 60 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  itemName: { fontSize: 17, fontWeight: "800", color: colors.text, flex: 1, marginRight: 8 },
  detail: { color: colors.muted, marginBottom: 4 },
  deleteButton: { backgroundColor: "#c0726e", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999 },
  deleteText: { color: colors.white, fontWeight: "700", fontSize: 13 },
  linkButton: { backgroundColor: colors.bgDark, padding: 12, borderRadius: 999, alignItems: "center", marginTop: 10 },
  linkText: { color: colors.white, fontWeight: "700" },
});
