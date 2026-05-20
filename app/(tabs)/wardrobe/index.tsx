import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { getToken } from "@/utils/token";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ClothingItem = {
  id: string;
  generatedImageBase64: string;
  tags: {
    type: string;
    color: string;
    style: string;
    occasion: string[];
  };
};

export default function WardrobeIndex() {
  const router = useRouter();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`${API_BASE_URL}/api/wardrobe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to load wardrobe (${response.status})`);
      const data: ClothingItem[] = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load wardrobe");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWardrobe();
    }, [])
  );

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/mainMenu" as any);
  };

  const confirmDelete = (item: ClothingItem) => {
    Alert.alert(
      "Remove Item",
      `Remove this ${item.tags?.color} ${item.tags?.type} from your wardrobe?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => deleteItem(item.id) },
      ]
    );
  };

  const deleteItem = async (id: string) => {
    setDeletingId(id);
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/api/v1/wardrobe/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      Alert.alert("Error", "Could not remove item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <ActivityIndicator size="large" color="#96b7bc" />
        <Text style={styles.loadingText}>Loading wardrobe...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>My Wardrobe</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>
          No items yet. Upload some clothes to get started!
        </Text>
      ) : (
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/wardrobe/[outfitId]", params: { outfitId: item.id } } as any)}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: `data:image/png;base64,${item.generatedImageBase64}` }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.itemName}>
                  {item.tags?.color} {item.tags?.type}
                </Text>
                <View style={styles.tagContainer}>
                  {item.tags?.style && <Text style={styles.tag}>{item.tags.style}</Text>}
                  {item.tags?.occasion?.map((occ) => (
                    <Text key={occ} style={styles.tag}>{occ}</Text>
                  ))}
                </View>
              </TouchableOpacity>
              <Pressable
                style={styles.deleteButton}
                onPress={() => confirmDelete(item)}
                disabled={deletingId === item.id}
              >
                {deletingId === item.id
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.deleteText}>Remove</Text>}
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eeede8" },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#233443", marginBottom: 20 },
  loadingContainer: { flex: 1, backgroundColor: "#eeede8", alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#233443" },
  errorText: { color: "#d0685f", fontSize: 15, textAlign: "center" },
  emptyText: { fontSize: 15, color: "#233443", opacity: 0.7, textAlign: "center", marginTop: 60 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: "#b9d6da", borderRadius: 14, marginBottom: 18, padding: 10 },
  image: { width: "100%", height: 150, borderRadius: 10, backgroundColor: "#dfe9ea" },
  itemName: { marginTop: 8, fontWeight: "700", color: "#233443", textTransform: "capitalize" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 4 },
  tag: { backgroundColor: "#96b7bc", color: "#233443", paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20, fontSize: 11, textTransform: "capitalize" },
  deleteButton: { backgroundColor: "#c0726e", paddingVertical: 6, borderRadius: 999, alignItems: "center", marginTop: 8 },
  deleteText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  backButton: { alignSelf: "flex-start", backgroundColor: "#c0d1bf", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
});
