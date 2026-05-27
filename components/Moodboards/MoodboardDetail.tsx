/*
 * Moodboard Detail
 * Displays one moodboard with:
 * - name
 * - description
 * - all images
 * - add image option
 * - edit/delete actions
 */

// ================
//     IMPORTS
// ================

import type { Moodboard } from "@/app/(tabs)/moodboards";
import { colors, globalStyles } from "@/constants/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ================
//     TYPES
// ================

type Props = {
  moodboard: Moodboard;
  onEdit: () => void;
  onDelete: () => void;
  onAddImages: (images: string[]) => void;
};

// ================
//  MOODBOARD DETAIL COMPONENT
// ================

export default function MoodboardDetail({
  moodboard,
  onEdit,
  onDelete,
  onAddImages,
}: Props) {
  const canAddMore = moodboard.images.length < 12;

  const pickImages = async () => {
    if (!canAddMore) {
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "We need access to your gallery to add moodboard images."
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets.length) return;

    const remainingSlots = 12 - moodboard.images.length;

    const selectedImages = result.assets
      .slice(0, remainingSlots)
      .map((asset) => asset.uri);

    onAddImages(selectedImages);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Moodboard",
      "Are you sure you want to delete this moodboard?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  // ================
  //     RENDER
  // ================
  return (
    <View style={[globalStyles.card, styles.detailCard]}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{moodboard.name}</Text>

          <Text style={styles.description}>{moodboard.description}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
            <MaterialIcons
              name="edit"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteIconButton]}
            onPress={confirmDelete}
          >
            <MaterialIcons
              name="delete"
              size={20}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageHeaderRow}>
        <Text style={styles.sectionTitle}>Images</Text>

        <Text style={styles.imageCount}>
          {moodboard.images.length}/12
        </Text>
      </View>

      <View style={styles.imageGrid}>
        {moodboard.images.map((image, index) => (
          <Image
            key={`${image}-${index}`}
            source={{ uri: image }}
            style={styles.moodboardImage}
          />
        ))}

        {canAddMore ? (
          <TouchableOpacity
            style={styles.addImageBox}
            onPress={pickImages}
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={32}
              color={colors.blueDark}
            />

            <Text style={styles.addImageText}>Add Images</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!canAddMore ? (
        <Text style={styles.limitText}>
          This moodboard has reached the 12 image limit.
        </Text>
      ) : null}
    </View>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  detailCard: {
    borderRadius: 24,
    padding: 24,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },

  titleBlock: {
    flex: 1,
    gap: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.text,
  },

  description: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.input,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteIconButton: {
    backgroundColor: colors.profileTintRed,
  },

  imageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },

  imageCount: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "700",
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  moodboardImage: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: colors.input,
  },

  addImageBox: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.blueDark,
    backgroundColor: colors.input,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  addImageText: {
    marginTop: 8,
    color: colors.blueDark,
    fontWeight: "700",
    textAlign: "center",
  },

  limitText: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
});