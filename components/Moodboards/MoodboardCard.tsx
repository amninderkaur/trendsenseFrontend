/*
 * Moodboard Card
 * Small preview card used on the main moodboards page.
 * Displays:
 * - moodboard name
 * - short description
 * - up to 4 preview images
 */

// ================
//     IMPORTS
// ================

import type { Moodboard } from "@/app/(tabs)/moodboards";
import { colors, globalStyles } from "@/constants/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

// ================
//     TYPES
// ================

type Props = {
  moodboard: Moodboard;
  onPress: () => void;
};

// ================
//  MOODBOARD CARD COMPONENT
// ================

export default function MoodboardCard({
  moodboard,
  onPress,
}: Props) {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;

  // Only display the first 4 images on the preview card
  const previewImages = moodboard.images.slice(0, 4);

  // ================
  //     RENDER
  // ================
  return (
    <TouchableOpacity
      style={[
        globalStyles.card,
        styles.card,
        isLargeScreen && styles.largeCard,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageGrid}>
        {previewImages.length > 0 ? (
          previewImages.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              source={{ uri: image }}
              style={styles.previewImage}
            />
          ))
        ) : (
          <View style={styles.emptyPreview}>
            <MaterialIcons
              name="photo-library"
              size={34}
              color={colors.blueDark}
            />

            <Text style={styles.emptyPreviewText}>
              No Images Yet
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {moodboard.name}
        </Text>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {moodboard.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.imageCountBadge}>
            <MaterialIcons
              name="collections"
              size={16}
              color={colors.white}
            />

            <Text style={styles.imageCountText}>
              {moodboard.images.length}/12
            </Text>
          </View>

          <MaterialIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.muted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    padding: 0,
  },

  largeCard: {
    width: "48%",
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.input,
    minHeight: 180,
  },

  previewImage: {
    width: "50%",
    aspectRatio: 1,
  },

  emptyPreview: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  emptyPreviewText: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 15,
  },

  content: {
    padding: 18,
    gap: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },

  footer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.blueDark,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  imageCountText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
});