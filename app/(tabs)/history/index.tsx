import { BASE_URL } from "@/api/axios";
import { getToken } from "@/utils/token";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = `${BASE_URL}/api/v1`;

type WardrobeItem = {
  id: string;
  userId: number;
  imageUrl: string;
  detectedItems: string[];
  uploadDate: string;
  tag: string;
};

export default function HistoryIndex() {
  const router = useRouter();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWardrobeItems = async () => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Error", "Please login to view your wardrobe");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/wardrobe`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load wardrobe: ${response.status}`);
      }

      const data = await response.json();
      console.log("Wardrobe items:", data);

      // Sort by upload date (newest first)
      const sortedItems = data.sort(
        (a: WardrobeItem, b: WardrobeItem) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      );

      setItems(sortedItems);
    } catch (error: any) {
      console.error("Failed to load wardrobe:", error);
      Alert.alert("Error", error.message || "Failed to load wardrobe items");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWardrobeItems();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadWardrobeItems();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <ActivityIndicator size="large" color="#233443" />
        <Text style={styles.loadingText}>Loading your wardrobe...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
        <Text style={styles.emptySubtitle}>
          Start adding clothing items to build your wardrobe!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>My Wardrobe</Text>
      <Text style={styles.subtitle}>
        {items.length} item{items.length !== 1 ? "s" : ""}
      </Text>

      {items.map((item) => (
        <Link key={item.id} href={`/history/${item.id}`} asChild>
          <TouchableOpacity style={styles.card}>
            <Image
              source={{
                uri: `${API_BASE_URL.replace("/api/v1", "")}${item.imageUrl}`,
              }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.tag}</Text>

              {item.detectedItems && item.detectedItems.length > 0 && (
                <Text style={styles.detectedItems}>
                  {item.detectedItems.join(", ")}
                </Text>
              )}

              <Text style={styles.cardDate}>{formatDate(item.uploadDate)}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeede8",
  },
  content: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#233443",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#96b7bc",
    marginBottom: 10,
  },
  center: {
    flex: 1,
    backgroundColor: "#eeede8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#233443",
    fontSize: 16,
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#233443",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#96b7bc",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#c0d1bf",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  cardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#233443",
    textTransform: "capitalize",
  },
  detectedItems: {
    fontSize: 13,
    color: "#5a8a8d",
    marginTop: 4,
    textTransform: "capitalize",
  },
  cardDate: {
    color: "#96b7bc",
    marginTop: 6,
    fontSize: 12,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#c0d1bf",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
});
