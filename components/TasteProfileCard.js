import { useAppTheme } from "@/context/ThemeContext";
import { useResponsiveWidth } from "@/utils/platform";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * TasteProfileCard
 * Props:
 *   profile: {
 *     lovedCombinations, favoriteColors, favoriteStyles,
 *     dislikedCombinations, avoidedColors, totalRatings, averageRating
 *   }
 */
export default function TasteProfileCard({ profile }) {
  const { themeColors } = useAppTheme();
  const responsiveWidth = useResponsiveWidth();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.card },
        responsiveWidth,
      ]}
    >
      <Text style={[styles.cardTitle, { color: themeColors.text }]}>
        AI Taste Profile
      </Text>

      {/* What you love */}
      {profile.lovedCombinations?.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: themeColors.muted }]}>
            What you love
          </Text>
          <View style={styles.pillRow}>
            {profile.lovedCombinations.map((item, i) => (
              <View key={i} style={styles.lovePill}>
                <Text style={styles.lovePillText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Your colours */}
      {profile.favoriteColors?.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: themeColors.muted }]}>
            Your colours
          </Text>
          <View style={styles.colorRowWrap}>
            {profile.favoriteColors.map((color, i) => (
              <View key={i} style={styles.colorEntry}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: color || "#CCCCCC" },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: themeColors.text }]}>
                  {color}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* You skip */}
      {profile.dislikedCombinations?.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: themeColors.muted }]}>
            You skip
          </Text>
          <View style={styles.pillRow}>
            {profile.dislikedCombinations.map((item, i) => (
              <View key={i} style={styles.skipPill}>
                <Text style={[styles.skipPillText, { color: themeColors.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={[styles.footer, { color: themeColors.muted }]}>
        Based on {profile.totalRatings} ratings · avg {profile.averageRating}/5 ★
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
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
  lovePill: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  lovePillText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "600",
  },
  skipPill: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  skipPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  colorRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorEntry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  footer: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
