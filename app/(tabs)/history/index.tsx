import { deleteOutfitHistory, getOutfitHistory } from "@/api/outfitHistory";
import { getOutfitRatings, getTasteProfile, postOutfitRating } from "@/api/outfit";
import StarRating from "@/components/StarRating";
import { useAppTheme } from "@/context/ThemeContext";
import { useResponsiveWidth } from "@/utils/platform";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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
  const responsiveWidth = useResponsiveWidth();

  const [outfits, setOutfits] = useState<OutfitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ratings map: { [outfitHistoryId]: 0–5 }
  const [ratingsMap, setRatingsMap] = useState<Record<string, number>>({});
  const [ratingInProgress, setRatingInProgress] = useState<string | null>(null);

  // toast
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // taste-profile banner
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const bannerAnim = useRef(new Animated.Value(0)).current;
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 3000);
  };

  const triggerBanner = () => {
    setShowProfileBanner(true);
    Animated.timing(bannerAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => {
      Animated.timing(bannerAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
        setShowProfileBanner(false)
      );
    }, 3000);
  };

  const load = async () => {
    setError("");

    try {
      const [data, ratingsData] = await Promise.all([
        getOutfitHistory(),
        getOutfitRatings().catch(() => []),
      ]);
      setOutfits(Array.isArray(data) ? data : []);

      const map: Record<string, number> = {};
      if (Array.isArray(ratingsData)) {
        ratingsData.forEach((r: any) => {
          if (r.outfitHistoryId != null && r.rating != null) {
            map[String(r.outfitHistoryId)] = r.rating;
          }
        });
      }
      setRatingsMap(map);
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

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const handleRate = async (outfitHistoryId: string, rating: number) => {
    const prev = ratingsMap[outfitHistoryId] ?? 0;
    // optimistic update
    setRatingsMap((m) => ({ ...m, [outfitHistoryId]: rating }));
    setRatingInProgress(outfitHistoryId);

    try {
      await postOutfitRating({ outfitHistoryId, rating });
      // check taste profile
      try {
        const profile = await getTasteProfile();
        if (profile && profile.totalRatings != null) {
          triggerBanner();
        }
      } catch {
        // taste profile not ready yet — silent
      }
    } catch {
      // revert optimistic update
      setRatingsMap((m) => ({ ...m, [outfitHistoryId]: prev }));
      showToast("Could not save, try again");
    } finally {
      setRatingInProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      await deleteOutfitHistory(id);
      setOutfits((prev) => prev.filter((o) => o.id !== id));
      setRatingsMap((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
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
    <View style={[styles.flex, { backgroundColor: themeColors.bg }]}>
      {/* Taste-profile update banner */}
      {showProfileBanner && (
        <Animated.View
          style={[
            styles.banner,
            { backgroundColor: themeColors.bgDark, opacity: bannerAnim },
          ]}
        >
          <Text style={[styles.bannerText, { color: themeColors.white }]}>
            ✨ Taste profile updated — future suggestions will improve
          </Text>
        </Animated.View>
      )}

      <ScrollView
        style={styles.flex}
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
        <View style={responsiveWidth}>
          <Pressable
            style={[styles.backButton, { backgroundColor: themeColors.bgDark }]}
            onPress={goBack}
          >
            <Text style={[styles.backButtonText, { color: themeColors.text }]}>
              ← Back
            </Text>
          </Pressable>

          <Text style={[styles.title, { color: themeColors.text }]}>
            Saved Outfits
          </Text>

          <Text style={[styles.subtitle, { color: themeColors.blueDark }]}>
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
            <Text style={[styles.errorText, { color: themeColors.accent }]}>
              {error}
            </Text>
          )}

          {!loading && outfits.length === 0 && !error && (
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
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
              {/* Gold accent bar */}
              <View style={styles.cardAccent} />

              {/* Header: occasion + remove button */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.occasionRow}>
                    <Text style={styles.occasionIcon}>✦</Text>
                    <Text style={[styles.occasion, { color: themeColors.text }]}>
                      {outfit.occasion}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={[styles.metaText, { color: themeColors.blueDark }]}>
                      📍 {outfit.city}
                    </Text>
                    {!!outfit.weatherSummary && (
                      <Text style={[styles.metaText, { color: themeColors.blueDark }]}>
                        {"  ·  "}🌤 {outfit.weatherSummary}
                      </Text>
                    )}
                  </View>
                </View>

                <Pressable
                  style={[styles.deleteButton, { borderColor: themeColors.accent }]}
                  onPress={() => handleDelete(outfit.id)}
                  disabled={deletingId === outfit.id}
                >
                  {deletingId === outfit.id ? (
                    <ActivityIndicator color={themeColors.accent} size="small" />
                  ) : (
                    <Text style={[styles.deleteText, { color: themeColors.accent }]}>
                      Remove
                    </Text>
                  )}
                </Pressable>
              </View>

              {!!outfit.reasoning && (
                <Text style={[styles.reasoning, { color: themeColors.muted }]}>
                  {outfit.reasoning}
                </Text>
              )}

              {outfit.selectedItems?.length > 0 && (
                <>
                  <View style={[styles.divider, { backgroundColor: themeColors.input }]} />
                  <View style={styles.itemsGrid}>
                    {outfit.selectedItems.map((item) => (
                      <View
                        key={item.itemId}
                        style={[styles.itemCard, { backgroundColor: themeColors.blue }]}
                      >
                        <Image
                          source={{ uri: `data:image/png;base64,${item.imageBase64}` }}
                          style={[styles.itemImage, { backgroundColor: themeColors.input }]}
                        />
                        <Text style={[styles.itemType, { color: themeColors.text }]}>
                          {item.color} {item.type}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <View style={[styles.divider, { backgroundColor: themeColors.input }]} />
              <StarRating
                outfitHistoryId={outfit.id}
                currentRating={ratingsMap[outfit.id] ?? 0}
                onRate={handleRate}
                disabled={ratingInProgress === outfit.id}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Error toast */}
      {!!toastMsg && (
        <View style={[styles.toast, { backgroundColor: themeColors.bgDark }]}>
          <Text style={[styles.toastText, { color: themeColors.white }]}>
            {toastMsg}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
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
    paddingTop: 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardAccent: {
    height: 4,
    backgroundColor: "#C9A96E",
    marginHorizontal: -16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  occasionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  occasionIcon: {
    fontSize: 12,
    color: "#C9A96E",
  },
  occasion: {
    fontSize: 17,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    lineHeight: 18,
  },
  reasoning: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 19,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: -16,
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
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  deleteText: {
    fontWeight: "600",
    fontSize: 12,
  },
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bannerText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  toast: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
