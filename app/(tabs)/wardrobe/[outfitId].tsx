import { colors } from "../../../constants/globalStyles";
import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ClothingItem = {
  id: string;
  generatedImageBase64: string;
  tags: {
    type: string;
    color: string;
    style: string;
    occasion: string[];
  };
};

export default function ClothingDetails() {
  const { outfitId } = useLocalSearchParams<{ outfitId: string }>();
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        const response = await fetch(`${API_BASE_URL}/api/wardrobe`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to load item");

        const data: ClothingItem[] = await response.json();
        setItem(data.find((i) => i.id === outfitId) ?? null);
      } catch {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [outfitId]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/wardrobe" as any);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setDeleting(true);
    setShowConfirm(false);

    try {
      const token = await getToken();

      await fetch(`${API_BASE_URL}/api/wardrobe/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      router.replace("/wardrobe" as any);
    } catch {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: themeColors.bg },
        ]}
      >
        <TouchableOpacity
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
        </TouchableOpacity>

        <ActivityIndicator size="large" color={themeColors.blueDark} />

        <Text
          style={[
            styles.loadingText,
            { color: themeColors.blueDark },
          ]}
        >
          Loading...
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
        <TouchableOpacity
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
        </TouchableOpacity>

        <Text
          style={[
            styles.errorText,
            { color: themeColors.accent },
          ]}
        >
          Item not found.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: themeColors.bg },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: themeColors.text },
              ]}
            >
              Remove Item
            </Text>

            <Text
              style={[
                styles.modalMessage,
                { color: themeColors.muted },
              ]}
            >
              Remove this{" "}
              <Text style={{ fontWeight: "700", color: themeColors.text }}>
                {item.tags?.color} {item.tags?.type}
              </Text>{" "}
              from your wardrobe? This cannot be undone.
            </Text>

            <TouchableOpacity
              style={[
                styles.modalDeleteBtn,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={handleDelete}
            >
              <Text
                style={[
                  styles.modalDeleteText,
                  { color: themeColors.white },
                ]}
              >
                Yes, Remove
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalCancelBtn,
                { backgroundColor: themeColors.bgDark },
              ]}
              onPress={() => setShowConfirm(false)}
            >
              <Text
                style={[
                  styles.modalCancelText,
                  { color: themeColors.white },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: themeColors.bg },
        ]}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity
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
        </TouchableOpacity>

        <Image
          source={{
            uri: `data:image/png;base64,${item.generatedImageBase64}`,
          }}
          style={[
            styles.image,
            { borderColor: themeColors.bgDark },
          ]}
          resizeMode="cover"
        />

        <Text
          style={[
            styles.itemName,
            { color: themeColors.text },
          ]}
        >
          {item.tags?.color} {item.tags?.type}
        </Text>

        {item.tags?.style && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              Style
            </Text>

            <Text
              style={[
                styles.detail,
                { color: themeColors.blueDark },
              ]}
            >
              {item.tags.style}
            </Text>
          </>
        )}

        {item.tags?.occasion?.length > 0 && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.text },
              ]}
            >
              Occasions
            </Text>

            <View style={styles.tagContainer}>
              {item.tags.occasion.map((occ) => (
                <View
                  key={occ}
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
                    {occ}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: themeColors.accent },
            deleting && { opacity: 0.6 },
          ]}
          onPress={() => setShowConfirm(true)}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color={themeColors.white} />
          ) : (
            <Text
              style={[
                styles.deleteText,
                { color: themeColors.white },
              ]}
            >
              Remove from Wardrobe
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 18,
    marginVertical: 16,
    borderWidth: 2,
  },
  itemName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 28,
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 16,
  },
  backButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  modalBox: {
    borderRadius: 25,
    padding: 28,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  modalDeleteBtn: {
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: 10,
  },
  modalDeleteText: {
    fontWeight: "700",
    fontSize: 16,
  },
  modalCancelBtn: {
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
  },
  modalCancelText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
