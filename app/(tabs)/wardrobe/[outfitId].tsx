import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { getToken } from "@/utils/token";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
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
    if (router.canGoBack()) router.back();
    else router.replace("/wardrobe" as any);
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
      <View style={styles.center}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <ActivityIndicator size="large" color="#96b7bc" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>
    );
  }

  return (
    <>
      {/* Delete confirmation modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Remove Item</Text>
            <Text style={styles.modalMessage}>
              Remove this{" "}
              <Text style={{ fontWeight: "700" }}>
                {item.tags?.color} {item.tags?.type}
              </Text>{" "}
              from your wardrobe? This cannot be undone.
            </Text>
            <TouchableOpacity style={styles.modalDeleteBtn} onPress={handleDelete}>
              <Text style={styles.modalDeleteText}>Yes, Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowConfirm(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: `data:image/png;base64,${item.generatedImageBase64}` }}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.itemName}>
          {item.tags?.color} {item.tags?.type}
        </Text>

        {item.tags?.style && (
          <>
            <Text style={styles.sectionTitle}>Style</Text>
            <Text style={styles.detail}>{item.tags.style}</Text>
          </>
        )}

        {item.tags?.occasion?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Occasions</Text>
            <View style={styles.tagContainer}>
              {item.tags.occasion.map((occ) => (
                <View key={occ} style={styles.tag}>
                  <Text style={styles.tagText}>{occ}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.deleteButton, deleting && { opacity: 0.6 }]}
          onPress={() => setShowConfirm(true)}
          disabled={deleting}
        >
          {deleting
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.deleteText}>Remove from Wardrobe</Text>}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eeede8" },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: "#eeede8", alignItems: "center", justifyContent: "center", padding: 20 },
  loadingText: { fontSize: 16, color: "#96b7bc", marginTop: 12 },
  image: { width: "100%", aspectRatio: 3 / 4, borderRadius: 18, marginVertical: 16, borderWidth: 2, borderColor: "#a3bfa9" },
  itemName: { fontSize: 22, fontWeight: "700", color: "#233443", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#233443", marginTop: 16, marginBottom: 6 },
  detail: { fontSize: 14, color: "#5a8a8d", textTransform: "capitalize" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#b9d6da", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  tagText: { fontSize: 13, color: "#233443", fontWeight: "600", textTransform: "capitalize" },
  deleteButton: { backgroundColor: "#c0726e", paddingVertical: 14, borderRadius: 999, alignItems: "center", marginTop: 28 },
  deleteText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  errorText: { color: "#d0685f", textAlign: "center", marginTop: 20, fontSize: 14 },
  backButton: { alignSelf: "flex-start", backgroundColor: "#c0d1bf", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 16 },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 28 },
  modalBox: { backgroundColor: "#eeede8", borderRadius: 25, padding: 28, width: "100%", maxWidth: 380, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#000", textAlign: "center", marginBottom: 12 },
  modalMessage: { fontSize: 15, color: "#4B5563", lineHeight: 22, textAlign: "center", marginBottom: 24 },
  modalDeleteBtn: { backgroundColor: "#c0726e", paddingVertical: 18, borderRadius: 32, alignItems: "center", marginBottom: 10 },
  modalDeleteText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  modalCancelBtn: { backgroundColor: "#a3bea9", paddingVertical: 18, borderRadius: 32, alignItems: "center" },
  modalCancelText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
