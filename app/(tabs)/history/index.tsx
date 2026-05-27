import { colors } from "../../../constants/globalStyles";
import { getOutfitHistory, deleteOutfitHistory } from "@/api/outfitHistory";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SelectedItem = {
  itemId: string;
  type: string;
  color: string;
  imageBase64: string;
};

type OutfitRecord = {
  id: string;
  occasion: string;
  city: string;
  weatherSummary: string;
  reasoning: string;
  selectedItems: SelectedItem[];
};

export default function SavedOutfitsIndex() {
  const router = useRouter();
  const [outfits, setOutfits] = useState<OutfitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setError("");
    try {
      const data = await getOutfitHistory();
      setOutfits(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load saved outfits.");
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
      await deleteOutfitHistory(id);
      setOutfits((prev) => prev.filter((o) => o.id !== id));
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/mainMenu" as any);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <Pressable style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Saved Outfits</Text>
      <Text style={styles.subtitle}>Outfits you liked from AI suggestions.</Text>

      {loading && (
        <ActivityIndicator color="#233443" size="large" style={{ marginTop: 40 }} />
      )}

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && outfits.length === 0 && !error && (
        <Text style={styles.emptyText}>
          No saved outfits yet. Like an outfit suggestion to save it here.
        </Text>
      )}

      {outfits.map((outfit) => (
        <View key={outfit.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.occasion}>{outfit.occasion}</Text>
              <Text style={styles.city}>{outfit.city}</Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(outfit.id)}
              disabled={deletingId === outfit.id}
            >
              {deletingId === outfit.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.deleteText}>Remove</Text>
              )}
            </Pressable>
          </View>

          {!!outfit.weatherSummary && (
            <Text style={styles.weather}>{outfit.weatherSummary}</Text>
          )}

          {!!outfit.reasoning && (
            <Text style={styles.reasoning}>{outfit.reasoning}</Text>
          )}

          {outfit.selectedItems?.length > 0 && (
            <View style={styles.itemsGrid}>
              {outfit.selectedItems.map((item) => (
                <View key={item.itemId} style={styles.itemCard}>
                  <Image
                    source={{ uri: `data:image/png;base64,${item.imageBase64}` }}
                    style={styles.itemImage}
                  />
                  <Text style={styles.itemType}>{item.color} {item.type}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 40 },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#c0d1bf",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
  title: { fontSize: 26, fontWeight: "700", color: "#233443", marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.blueDark, marginBottom: 16 },
  errorText: { color: "#d0685f", fontSize: 15, textAlign: "center", marginTop: 20 },
  emptyText: {
    fontSize: 15,
    color: "#233443",
    opacity: 0.7,
    textAlign: "center",
    marginTop: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#c0d1bf",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  occasion: {
    fontSize: 18,
    fontWeight: "700",
    color: "#233443",
    textTransform: "capitalize",
  },
  city: { fontSize: 13, color: colors.blueDark, marginTop: 2 },
  weather: { fontSize: 13, color: "#5a8a8d", marginBottom: 6 },
  reasoning: { fontSize: 14, color: "#233443", marginBottom: 10, lineHeight: 20 },
  itemsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  itemCard: {
    width: "47%",
    backgroundColor: colors.blue,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    resizeMode: "cover",
    backgroundColor: "#dfe9ea",
  },
  itemType: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#233443",
    textTransform: "capitalize",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#c0726e",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  deleteText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
