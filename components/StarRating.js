import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * StarRating
 * Props:
 *   outfitHistoryId  – id of the outfit being rated
 *   currentRating    – 0–5
 *   onRate(id, star) – callback when star tapped
 *   disabled         – if true, stars are not tappable, opacity 0.5
 */
export default function StarRating({ outfitHistoryId, currentRating, onRate, disabled }) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.row, disabled && styles.disabled]}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRate && onRate(outfitHistoryId, star)}
            disabled={!!disabled}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            activeOpacity={0.7}
          >
            <Text style={[styles.star, { color: star <= currentRating ? "#FFB800" : "#E0E0E0" }]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {currentRating === 0 && (
        <Text style={styles.tapLabel}>Tap to rate</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  star: {
    fontSize: 24,
  },
  tapLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
});
