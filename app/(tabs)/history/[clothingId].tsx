import { BASE_URL } from "@/api/axios";
import { getToken } from "@/utils/token";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = `${BASE_URL}/api/v1`;

type WardrobeItemDetail = {
  id: string;
  userId: number;
  imageUrl: string;
  detectedItems: string[];
  uploadDate: string;
  tag: string;
};

export default function HistoryDetails() {
  const { clothingId } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<WardrobeItemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItemDetails();
  }, [clothingId]);

  const loadItemDetails = async () => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Error", "Please login to view item details");
        router.back();
        return;
      }

      console.log("Fetching item details for ID:", clothingId);

      // Fetch all wardrobe items (since there's no single-item endpoint yet)
      const response = await fetch(`${API_BASE_URL}/wardrobe`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load item: ${response.status}`);
      }

      const allItems: WardrobeItemDetail[] = await response.json();

      // Find the specific item
      const foundItem = allItems.find((i) => i.id === clothingId);

      if (!foundItem) {
        Alert.alert("Error", "Item not found");
        router.back();
        return;
      }

      setItem(foundItem);
      console.log("Item loaded:", foundItem);
    } catch (error: any) {
      console.error("Failed to load item:", error);
      Alert.alert("Error", error.message || "Failed to load item details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#233443" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{
          uri: `${BASE_URL}${item.imageUrl}`,
        }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      <View style={styles.detailsSection}>
        <Text style={styles.title}>{item.tag}</Text>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Added on</Text>
          <Text style={styles.date}>{formatDate(item.uploadDate)}</Text>
          <Text style={styles.time}>{formatTime(item.uploadDate)}</Text>
        </View>

        {item.detectedItems && item.detectedItems.length > 0 && (
          <View style={styles.detectedSection}>
            <Text style={styles.sectionTitle}>Detected Items</Text>
            <View style={styles.tagBox}>
              {item.detectedItems.map((detectedItem, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{detectedItem}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Item ID:</Text>
            <Text style={styles.infoValue}>{item.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>{item.tag}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Items:</Text>
            <Text style={styles.infoValue}>
              {item.detectedItems?.length || 0} detected
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Wardrobe</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeede8",
  },
  content: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    backgroundColor: "#eeede8",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#233443",
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: "#d0685f",
    fontSize: 16,
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 400,
    backgroundColor: "#f0f0f0",
  },
  detailsSection: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#233443",
    textTransform: "capitalize",
  },
  dateContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c0d1bf",
  },
  dateLabel: {
    fontSize: 12,
    color: "#96b7bc",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  date: {
    fontSize: 16,
    color: "#233443",
    fontWeight: "600",
  },
  time: {
    fontSize: 14,
    color: "#96b7bc",
    marginTop: 2,
  },
  detectedSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c0d1bf",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#233443",
    marginBottom: 12,
  },
  tagBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#b9d6da",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: "#233443",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  infoSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c0d1bf",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#96b7bc",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#233443",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#c0d1bf",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#233443",
    fontWeight: "700",
    fontSize: 16,
  },
});
