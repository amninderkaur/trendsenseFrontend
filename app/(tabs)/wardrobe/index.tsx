import { colors } from "../../../constants/globalStyles";
import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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

export default function WardrobeIndex() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<ClothingItem | null>(null);

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/wardrobe`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to load wardrobe (${response.status})`);
      }

      const data: ClothingItem[] = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load wardrobe");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWardrobe();
    }, [])
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/mainMenu" as any);
    }
  };

  const deleteItem = async () => {
    if (!confirmItem) return;

    const id = confirmItem.id;
    setDeletingId(id);
    setConfirmItem(null);

    try {
      const token = await getToken();

      await fetch(`${API_BASE_URL}/api/wardrobe/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Could not remove item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
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
<<<<<<< HEAD
        <ActivityIndicator size="large" color={colors.blueDark} />
        <Text style={styles.loadingText}>Loading wardrobe...</Text>
=======

        <ActivityIndicator size="large" color={themeColors.blueDark} />

        <Text
          style={[
            styles.loadingText,
            { color: themeColors.text },
          ]}
        >
          Loading wardrobe...
        </Text>
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.loadingContainer,
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
          {error}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Modal visible={!!confirmItem} transparent animationType="fade">
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
                {confirmItem?.tags?.color} {confirmItem?.tags?.type}
              </Text>{" "}
              from your wardrobe? This cannot be undone.
            </Text>

            <TouchableOpacity
              style={[
                styles.modalDeleteBtn,
                { backgroundColor: themeColors.accent },
              ]}
              onPress={deleteItem}
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
              onPress={() => setConfirmItem(null)}
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

        <Text
          style={[
            styles.title,
            { color: themeColors.text },
          ]}
        >
          My Wardrobe
        </Text>

        {items.length === 0 ? (
          <Text
            style={[
              styles.emptyText,
              { color: themeColors.text },
            ]}
          >
            No items yet. Upload some clothes to get started!
          </Text>
        ) : (
          <View style={styles.grid}>
            {items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  { backgroundColor: themeColors.blue },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/wardrobe/[outfitId]",
                      params: { outfitId: item.id },
                    } as any)
                  }
                  activeOpacity={0.85}
                >
                  <Image
                    source={{
                      uri: `data:image/png;base64,${item.generatedImageBase64}`,
                    }}
                    style={[
                      styles.image,
                      { backgroundColor: themeColors.input },
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

                  <View style={styles.tagContainer}>
                    {item.tags?.style && (
                      <Text
                        style={[
                          styles.tag,
                          {
                            backgroundColor: themeColors.blueDark,
                            color: themeColors.text,
                          },
                        ]}
                      >
                        {item.tags.style}
                      </Text>
                    )}

                    {item.tags?.occasion?.map((occ) => (
                      <Text
                        key={occ}
                        style={[
                          styles.tag,
                          {
                            backgroundColor: themeColors.blueDark,
                            color: themeColors.text,
                          },
                        ]}
                      >
                        {occ}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: themeColors.accent },
                  ]}
                  onPress={() => setConfirmItem(item)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? (
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
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: colors.card },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#233443", marginBottom: 20 },
  loadingContainer: { flex: 1, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#233443" },
  errorText: { color: "#d0685f", fontSize: 15, textAlign: "center" },
  emptyText: { fontSize: 15, color: "#233443", opacity: 0.7, textAlign: "center", marginTop: 60 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: colors.blue, borderRadius: 14, marginBottom: 18, padding: 10 },
  image: { width: "100%", height: 150, borderRadius: 10, backgroundColor: "#dfe9ea" },
  itemName: { marginTop: 8, fontWeight: "700", color: "#233443", textTransform: "capitalize" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 4 },
  tag: { backgroundColor: colors.blueDark, color: "#233443", paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20, fontSize: 11, textTransform: "capitalize" },
  deleteButton: { backgroundColor: "#c0726e", paddingVertical: 6, borderRadius: 999, alignItems: "center", marginTop: 8 },
  deleteText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  backButton: { alignSelf: "flex-start", backgroundColor: "#c0d1bf", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 28 },
  modalBox: { backgroundColor: colors.card, borderRadius: 25, padding: 28, width: "100%", maxWidth: 380, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#000", textAlign: "center", marginBottom: 12 },
  modalMessage: { fontSize: 15, color: colors.muted, lineHeight: 22, textAlign: "center", marginBottom: 24 },
  modalDeleteBtn: { backgroundColor: "#c0726e", paddingVertical: 18, borderRadius: 32, alignItems: "center", marginBottom: 10 },
  modalDeleteText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  modalCancelBtn: { backgroundColor: colors.bgDark, paddingVertical: 18, borderRadius: 32, alignItems: "center" },
  modalCancelText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
=======
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 60,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 14,
    marginBottom: 18,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  itemName: {
    marginTop: 8,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 4,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 11,
    textTransform: "capitalize",
  },
  deleteButton: {
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 12,
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
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
