import { getTrends } from "@/api/trends";
import { useAppTheme } from "@/context/ThemeContext";
import { WEB_MAX_WIDTH, useResponsiveWidth } from "@/utils/platform";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ── types ──────────────────────────────────────────────────────
type TrendItem = {
  trendName: string;
  description: string;
  keyPieces: string[];
  colors: string[];
  wearItHow: string;
};

type WardrobeMatch = {
  itemId: string;
  itemType: string;
  color: string;
  imageBase64: string;
  matchingTrends: string[];
  stylingTip: string;
};

type TrendsData = {
  season: string;
  summary: string;
  fetchedAt: string;
  trends: TrendItem[];
  wardrobeMatches: WardrobeMatch[];
};

// ── helpers ────────────────────────────────────────────────────
const isValidHex = (color: string) =>
  typeof color === "string" && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);

const safeColor = (color: string, fallback = "#F5F5F5") => {
  if (!color || typeof color !== "string") return fallback;
  // Accept hex or simple named colors (no spaces, no numbers)
  if (isValidHex(color)) return color;
  if (/^[a-zA-Z]+$/.test(color)) return color;
  return fallback;
};

const safeDotColor = (color: string) => safeColor(color, "#CCCCCC");

// ── TrendCard ──────────────────────────────────────────────────
function TrendCard({ trend, width, themeColors }: { trend: TrendItem; width: number; themeColors: any }) {
  return (
    <View
      style={[
        styles.trendCard,
        {
          width,
          backgroundColor: themeColors.card,
          shadowColor: themeColors.text,
        },
        Platform.OS === "web" && ({ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } as any),
      ]}
    >
      {/* Soft color tint strip at top */}
      <View
        style={[
          styles.trendCardTint,
          { backgroundColor: safeColor(trend.colors?.[0], themeColors.blue) + "33" },
        ]}
      />

      <Text style={[styles.trendName, { color: themeColors.text }]}>
        {trend.trendName}
      </Text>

      <Text
        style={[styles.trendDescription, { color: themeColors.muted }]}
        numberOfLines={2}
      >
        {trend.description}
      </Text>

      {trend.keyPieces?.length > 0 && (
        <View style={styles.trendSection}>
          <Text style={[styles.trendSectionLabel, { color: themeColors.muted }]}>
            Key pieces:
          </Text>
          <View style={styles.pillRow}>
            {trend.keyPieces.map((piece, i) => (
              <View
                key={i}
                style={[styles.keyPill, { backgroundColor: themeColors.input }]}
              >
                <Text style={[styles.keyPillText, { color: themeColors.text }]}>
                  {piece}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {trend.colors?.length > 0 && (
        <View style={styles.trendSection}>
          <Text style={[styles.trendSectionLabel, { color: themeColors.muted }]}>
            Colors:
          </Text>
          <View style={styles.dotRow}>
            {trend.colors.map((c, i) => (
              <View
                key={i}
                style={[styles.colorDot, { backgroundColor: safeDotColor(c) }]}
              />
            ))}
          </View>
        </View>
      )}

      {!!trend.wearItHow && (
        <View style={styles.trendSection}>
          <Text style={[styles.trendSectionLabel, { color: themeColors.muted }]}>
            How to wear it:
          </Text>
          <Text style={[styles.wearItHow, { color: themeColors.text }]}>
            {trend.wearItHow}
          </Text>
        </View>
      )}
    </View>
  );
}

// ── WardrobeMatchCard ──────────────────────────────────────────
function WardrobeMatchCard({
  match,
  cardWidth,
  themeColors,
  onPress,
}: {
  match: WardrobeMatch;
  cardWidth: number;
  themeColors: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.matchCard,
        { width: cardWidth, backgroundColor: themeColors.card },
      ]}
    >
      {match.imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${match.imageBase64}` }}
          style={{ width: cardWidth, height: cardWidth * 1.25 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.matchImagePlaceholder,
            { width: cardWidth, height: cardWidth * 1.25, backgroundColor: themeColors.input },
          ]}
        >
          <Text style={{ fontSize: 28 }}>👗</Text>
        </View>
      )}

      <View style={styles.matchInfo}>
        <Text
          style={[styles.matchItemType, { color: themeColors.text }]}
          numberOfLines={1}
        >
          {match.itemType} · {match.color}
        </Text>

        {match.matchingTrends?.length > 0 && (
          <View style={styles.pillRow}>
            {match.matchingTrends.slice(0, 2).map((t, i) => (
              <View key={i} style={styles.trendPill}>
                <Text style={styles.trendPillText} numberOfLines={1}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!!match.stylingTip && (
          <Text
            style={[styles.matchStylingTip, { color: themeColors.muted }]}
            numberOfLines={2}
          >
            {match.stylingTip}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ────────────────────────────────────────────────
export default function TrendsScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();
  const responsiveWidth = useResponsiveWidth();

  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isWeb = Platform.OS === "web";
  const windowWidth = isWeb ? WEB_MAX_WIDTH : Dimensions.get("window").width;
  const trendCardWidth = windowWidth - 48;
  const matchCardWidth = (windowWidth - 48) / 2;

  const fetchTrends = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getTrends();
      setData(result);
    } catch {
      setError("Could not load trends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/mainMenu" as any);
  };

  // ── Loading ──
  if (loading) {
    return (
      <View style={[styles.centeredScreen, { backgroundColor: themeColors.bg }]}>
        <ActivityIndicator size="large" color={themeColors.blueDark} />
        <Text style={[styles.loadingText, { color: themeColors.muted }]}>
          Searching what's trending right now...
        </Text>
      </View>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <View style={[styles.centeredScreen, { backgroundColor: themeColors.bg }]}>
        <Text style={[styles.errorMsg, { color: themeColors.text }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: themeColors.blueDark }]}
          onPress={fetchTrends}
        >
          <Text style={[styles.retryBtnText, { color: themeColors.white }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Content ──
  const wardrobeMatches = data?.wardrobeMatches ?? [];
  const trends = data?.trends ?? [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={responsiveWidth}>
        {/* Back button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: themeColors.bgDark }]}
          onPress={goBack}
        >
          <Text style={[styles.backButtonText, { color: themeColors.white }]}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={[styles.pageTitle, { color: themeColors.text }]}>
          {data?.season ?? "Latest"} Trends
        </Text>
        {!!data?.summary && (
          <Text style={[styles.pageSummary, { color: themeColors.muted }]}>
            {data.summary}
          </Text>
        )}
        <Text style={[styles.pageCaption, { color: themeColors.muted }]}>
          Updated just now
        </Text>

        {/* ── Trend Cards ── */}
        {trends.length > 0 && (
          <View style={styles.trendsSection}>
            {isWeb ? (
              // Web: vertical stack
              <View>
                {trends.map((trend, i) => (
                  <TrendCard
                    key={i}
                    trend={trend}
                    width={trendCardWidth}
                    themeColors={themeColors}
                  />
                ))}
              </View>
            ) : (
              // iOS: horizontal paginated FlatList
              <FlatList
                data={trends}
                keyExtractor={(_, i) => String(i)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={trendCardWidth + 16}
                decelerationRate="fast"
                contentContainerStyle={{ gap: 16, paddingRight: 24 }}
                renderItem={({ item }) => (
                  <TrendCard
                    trend={item}
                    width={trendCardWidth}
                    themeColors={themeColors}
                  />
                )}
              />
            )}
          </View>
        )}

        {/* ── Already In Your Wardrobe ── */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Already In Your Wardrobe
        </Text>

        {wardrobeMatches.length === 0 ? (
          <View style={styles.emptyMatches}>
            <Text style={[styles.emptyMatchesText, { color: themeColors.muted }]}>
              None of your current items match these trends
            </Text>
            <TouchableOpacity
              style={[styles.shopBtn, { backgroundColor: themeColors.accent }]}
              onPress={() => router.push("/(tabs)/saved-items" as any)}
            >
              <Text style={[styles.shopBtnText, { color: themeColors.white }]}>
                Shop Missing Pieces
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.matchGrid}>
            {wardrobeMatches.map((match, i) => (
              <WardrobeMatchCard
                key={i}
                match={match}
                cardWidth={matchCardWidth}
                themeColors={themeColors}
                onPress={() =>
                  router.push(
                    `/(tabs)/outfit-review?trendContext=${encodeURIComponent(match.matchingTrends?.[0] ?? "")}` as any
                  )
                }
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  centeredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  errorMsg: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  retryBtnText: {
    fontWeight: "700",
    fontSize: 14,
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
    fontSize: 14,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  pageSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  pageCaption: {
    fontSize: 11,
    marginBottom: 20,
  },

  // Trends section
  trendsSection: {
    marginBottom: 28,
  },
  trendCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    position: "relative",
  },
  trendCardTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  trendName: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 4,
  },
  trendDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  trendSection: {
    marginBottom: 10,
  },
  trendSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  keyPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  keyPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  wearItHow: {
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 19,
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  // Empty matches
  emptyMatches: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  emptyMatchesText: {
    fontSize: 14,
    textAlign: "center",
  },
  shopBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  shopBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },

  // Match grid
  matchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  matchCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  matchImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  matchInfo: {
    padding: 8,
    gap: 4,
  },
  matchItemType: {
    fontSize: 13,
    fontWeight: "700",
  },
  trendPill: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    maxWidth: 120,
  },
  trendPillText: {
    color: "#2E7D32",
    fontSize: 10,
    fontWeight: "600",
  },
  matchStylingTip: {
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 16,
  },
});
