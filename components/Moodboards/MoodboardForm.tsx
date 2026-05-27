/*
 * Moodboard Form
 * Used for creating and editing moodboards.
 * A moodboard requires:
 * - name
 * - short description
 * - at least 1 image
 * - maximum 12 images
 */

// ================
//     IMPORTS
// ================

import type { Moodboard } from "@/app/(tabs)/moodboards";
import { colors, globalStyles } from "@/constants/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ================
//     TYPES
// ================

type Props = {
  mode: "create" | "edit";
  initialMoodboard: Moodboard | null;
  onSave: (moodboard: Moodboard) => void;
  onCancel: () => void;
};

// ================
// MOODBOARD FORM COMPONENT
// ================

export default function MoodboardForm({
  mode,
  initialMoodboard,
  onSave,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialMoodboard?.name || "");
  const [description, setDescription] = useState(
    initialMoodboard?.description || ""
  );
  const [images, setImages] = useState<string[]>(
    initialMoodboard?.images || []
  );
  const [error, setError] = useState("");

  const pickImages = async () => {
    if (images.length >= 12) {
      setError("You can only add up to 12 images.");
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

    const selectedImages = result.assets.map((asset) => asset.uri);

    setImages((prev) =>
      [...prev, ...selectedImages].slice(0, 12)
    );

    setError("");
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a moodboard name.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a short description.");
      return;
    }

    if (images.length === 0) {
      setError("Please add at least one image.");
      return;
    }

    const moodboard: Moodboard = {
      id: initialMoodboard?.id || Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      images,
    };

    onSave(moodboard);
  };

  // ================
  //     RENDER
  // ================
  return (
    <View style={[globalStyles.card, styles.formCard]}>
      <Text style={styles.title}>
        {mode === "create" ? "Create Moodboard" : "Edit Moodboard"}
      </Text>

      <Text style={styles.descriptionText}>
        Add a name, short description, and inspiration images for this
        moodboard.
      </Text>

      <Text style={styles.label}>Moodboard Name</Text>

      <TextInput
        style={globalStyles.input}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError("");
        }}
        placeholder="e.g. Summer Streetwear"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Short Description</Text>

      <TextInput
        style={[globalStyles.input, styles.textArea]}
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setError("");
        }}
        placeholder="Describe the aesthetic or outfit inspiration..."
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.imageHeaderRow}>
        <Text style={styles.label}>Images</Text>

        <Text style={styles.imageCount}>
          {images.length}/12
        </Text>
      </View>

      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <View key={`${image}-${index}`} style={styles.imageBox}>
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
            />

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <MaterialIcons
                name="close"
                size={18}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 12 ? (
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

      {error ? (
        <Text style={globalStyles.errorText}>
          {error}
        </Text>
      ) : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.actionButtonText}>
            {mode === "create" ? "Create" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ================
//     STYLES
// ================

const styles = StyleSheet.create({
  formCard: {
    borderRadius: 24,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },

  descriptionText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },

  textArea: {
    minHeight: 110,
  },

  imageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  imageCount: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 14,
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
    marginBottom: 18,
  },

  imageBox: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.input,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.blueDark,
    alignItems: "center",
    justifyContent: "center",
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

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: colors.muted,
  },

  saveButton: {
    backgroundColor: colors.bgDark,
  },

  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});