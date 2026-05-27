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

import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { deleteShoppingItem, getSavedShoppingItems } from "../../api/shopping";

export default function SavedItems() {
  const { themeColors } = useAppTheme(); 
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
    style={[
      styles.container,
      { backgroundColor: themeColors.bg },
    ]}
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
    <Pressable
      style={[
        styles.backButton,
        { backgroundColor: themeColors.bgDark },
      ]}
      onPress={() =>
        router.canGoBack()
          ? router.back()
          : router.replace("/(tabs)/mainMenu" as any)
      }
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
      Saved Items
    </Text>

    <Text
      style={[
        styles.subtitle,
        { color: themeColors.muted },
      ]}
    >
      Shopping items you've saved from budgeting suggestions.
    </Text>

    {loading && (
      <ActivityIndicator
        color={themeColors.blueDark}
        style={{ marginTop: 40 }}
      />
    )}

    {!!error && (
      <Text
        style={[
          globalStyles.errorText,
          { color: themeColors.accent },
        ]}
      >
        {error}
      </Text>
    )}

    {!loading && items.length === 0 && !error && (
      <Text
        style={[
          styles.emptyText,
          { color: themeColors.muted },
        ]}
      >
        No saved items yet. Save items from the Budgeting screen.
      </Text>
    )}

    {items.map((item: any) => (
      <View
        key={item.id}
        style={[
          styles.card,
          { backgroundColor: themeColors.card },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.itemName,
              { color: themeColors.text },
            ]}
          >
            {item.item}
          </Text>

          <Pressable
            style={[
              styles.deleteButton,
              { backgroundColor: themeColors.accent },
            ]}
            onPress={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
          >
            {deletingId === item.id ? (
              <ActivityIndicator
                color={themeColors.white}
                size="small"
              />
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

        {!!item.nearbyLocation && (
          <Text
            style={[
              styles.detail,
              { color: themeColors.muted },
            ]}
          >
            Nearby: {item.nearbyLocation}
          </Text>
        )}

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

  emptyText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 60,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  itemName: {
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
    marginRight: 8,
  },

  detail: {
    marginBottom: 4,
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

  linkButton: {
    padding: 12,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
  },

  linkText: {
    fontWeight: "700",
  },
});
