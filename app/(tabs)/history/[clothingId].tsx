import { colors } from "../../../constants/globalStyles";
import { BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
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
  const { themeColors } = useAppTheme();

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
      const foundItem = allItems.find((i) => i.id === clothingId);

      if (!foundItem) {
        Alert.alert("Error", "Item not found");
        router.back();
        return;
      }

      setItem(foundItem);
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
      <View
        style={[
          styles.center,
          { backgroundColor: themeColors.bg },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.text} />
        <Text
          style={[
            styles.loadingText,
            { color: themeColors.text },
          ]}
        >
          Loading item details...
        </Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: themeColors.bg },
        ]}
      >
        <Text
          style={[
            styles.errorText,
            { color: themeColors.accent },
          ]}
        >
          Item not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeColors.bg },
      ]}
      contentContainerStyle={styles.content}
    >
      <Image
        source={{
          uri: `${BASE_URL}${item.imageUrl}`,
        }}
        style={[
          styles.mainImage,
          { backgroundColor: themeColors.input },
        ]}
        resizeMode="cover"
      />

      <View style={styles.detailsSection}>
        <Text
          style={[
            styles.title,
            { color: themeColors.text },
          ]}
        >
          {item.tag}
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.card, borderColor: themeColors.bgDark },
          ]}
        >
          <Text
            style={[
              styles.dateLabel,
              { color: themeColors.blueDark },
            ]}
          >
            Added on
          </Text>

          <Text
            style={[
              styles.date,
              { color: themeColors.text },
            ]}
          >
            {formatDate(item.uploadDate)}
          </Text>

          <Text
            style={[
              styles.time,
              { color: themeColors.blueDark },
            ]}
          >
            {formatTime(item.uploadDate)}
          </Text>
        </View>

        {item.detectedItems && item.detectedItems.length > 0 && (
          <View
            style={[
              styles.card,
              { backgroundColor: themeColors.card, borderColor: themeColors.bgDark },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              Detected Items
            </Text>

            <View style={styles.tagBox}>
              {item.detectedItems.map((detectedItem, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: themeColors.blue },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: themeColors.text },
                    ]}
                  >
                    {detectedItem}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.card, borderColor: themeColors.bgDark },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: themeColors.text },
            ]}
          >
            Details
          </Text>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: themeColors.blueDark },
              ]}
            >
              Item ID:
            </Text>

            <Text
              style={[
                styles.infoValue,
                { color: themeColors.text },
              ]}
            >
              {item.id}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: themeColors.blueDark },
              ]}
            >
              Category:
            </Text>

            <Text
              style={[
                styles.infoValue,
                { color: themeColors.text },
              ]}
            >
              {item.tag}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: themeColors.blueDark },
              ]}
            >
              Total Items:
            </Text>

            <Text
              style={[
                styles.infoValue,
                { color: themeColors.text },
              ]}
            >
              {item.detectedItems?.length || 0} detected
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: themeColors.button },
          ]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.backButtonText,
              { color: themeColors.white },
            ]}
          >
            Back to Wardrobe
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: colors.card,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
  },
  content: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: colors.card,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 400,
  },
  detailsSection: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateLabel: {
    fontSize: 12,
<<<<<<< HEAD
    color: colors.blueDark,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 14,
<<<<<<< HEAD
    color: colors.blueDark,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tagBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
<<<<<<< HEAD
    backgroundColor: colors.blue,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontWeight: "600",
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
<<<<<<< HEAD
    color: colors.blueDark,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
});