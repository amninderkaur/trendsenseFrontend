import { deleteOutfitHistory, getOutfitHistory } from "@/api/outfitHistory";
import { useAppTheme } from "@/context/ThemeContext";
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
  const { themeColors } = useAppTheme();

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
      style={[
        styles.container,
        { backgroundColor: themeColors.bg },
      ]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor={themeColors.text}
          colors={[themeColors.text]}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <Pressable
        style={[
          styles.backButton,
          { backgroundColor: themeColors.bgDark },
        ]}
        onPress={goBack}
      >
        <Text
          style={[
            styles.backButtonText,
            { color: themeColors.text },
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
        Saved Outfits
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: themeColors.blueDark },
        ]}
      >
        Outfits you liked from AI suggestions.
      </Text>

      {loading && (
        <ActivityIndicator
          color={themeColors.text}
          size="large"
          style={{ marginTop: 40 }}
        />
      )}

      {!!error && (
        <Text
          style={[
            styles.errorText,
            { color: themeColors.accent },
          ]}
        >
          {error}
        </Text>
      )}

      {!loading && outfits.length === 0 && !error && (
        <Text
          style={[
            styles.emptyText,
            { color: themeColors.text },
          ]}
        >
          No saved outfits yet. Like an outfit suggestion to save it here.
        </Text>
      )}

      {outfits.map((outfit) => (
        <View
          key={outfit.id}
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.bgDark,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.occasion,
                  { color: themeColors.text },
                ]}
              >
                {outfit.occasion}
              </Text>

              <Text
                style={[
                  styles.city,
                  { color: themeColors.blueDark },
                ]}
              >
                {outfit.city}
              </Text>
            </View>

            <Pressable
              style={[
                styles.deleteButton,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={() => handleDelete(outfit.id)}
              disabled={deletingId === outfit.id}
            >
              {deletingId === outfit.id ? (
                <ActivityIndicator color={themeColors.white} size="small" />
              ) : (
                <Text
                  style={[
                    styles.deleteText,
                    { color: themeColors.white },
                  ]}
                >
                  Remove
                </Text>
              )}
            </Pressable>
          </View>

          {!!outfit.weatherSummary && (
            <Text
              style={[
                styles.weather,
                { color: themeColors.blueDark },
              ]}
            >
              {outfit.weatherSummary}
            </Text>
          )}

          {!!outfit.reasoning && (
            <Text
              style={[
                styles.reasoning,
                { color: themeColors.text },
              ]}
            >
              {outfit.reasoning}
            </Text>
          )}

          {outfit.selectedItems?.length > 0 && (
            <View style={styles.itemsGrid}>
              {outfit.selectedItems.map((item) => (
                <View
                  key={item.itemId}
                  style={[
                    styles.itemCard,
                    { backgroundColor: themeColors.blue },
                  ]}
                >
                  <Image
                    source={{
                      uri: `data:image/png;base64,${item.imageBase64}`,
                    }}
                    style={[
                      styles.itemImage,
                      { backgroundColor: themeColors.input },
                    ]}
                  />

                  <Text
                    style={[
                      styles.itemType,
                      { color: themeColors.text },
                    ]}
                  >
                    {item.color} {item.type}
                  </Text>
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
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 60,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
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
    textTransform: "capitalize",
  },
  city: {
    fontSize: 13,
    marginTop: 2,
  },
  weather: {
    fontSize: 13,
    marginBottom: 6,
  },
  reasoning: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemCard: {
    width: "47%",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    resizeMode: "cover",
  },
  itemType: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
    textAlign: "center",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 13,
  },
});