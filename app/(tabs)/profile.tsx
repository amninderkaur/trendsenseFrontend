import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PersonalizationModal from "../(auth)/PersonalizationModal";
import { deleteAccount, getMe, uploadProfilePicture } from "../../api/user";
import { useAppTheme } from "../../context/ThemeContext";
import { getEmail, getName, removeEmail, removeName, removeToken, removeUserId } from "../../utils/token";

export default function Profile() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, themeColors } = useAppTheme();
  const email = getEmail() || "user@example.com";
  const displayName = getName() || "TrendSense User";

  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        if (data?.profilePicture) {
          setAvatarUri(`data:${data.profilePictureType};base64,${data.profilePicture}`);
        }
      })
      .catch(() => {});
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploadingPic(true);
    try {
      await uploadProfilePicture(asset.uri);
      setAvatarUri(asset.uri);
    } catch {
      // silently fail — keep old image
    } finally {
      setUploadingPic(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    removeUserId();
    removeEmail();
    removeName();
    router.replace("/(auth)/login");
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
    } catch {
      // still clear local state even if request fails
    }
    removeToken();
    removeUserId();
    removeEmail();
    router.replace("/(auth)/login");
  };

  return (
    <>
      <PersonalizationModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.bg }]}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: themeColors.button }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: themeColors.text }]}>Account Profile</Text>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper} disabled={uploadingPic}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={60} color="#fff" />
              </View>
            )}
            {uploadingPic ? (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <View style={styles.avatarOverlay}>
                <Text style={styles.avatarEditText}>Edit</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.name, { color: themeColors.text }]}>{displayName}</Text>
          <Text style={[styles.email, { color: themeColors.muted }]}>{email}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <View style={styles.switchRow}>
            <Text style={[styles.name, { color: themeColors.text }]}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}><Text style={styles.infoTitle}>Orders</Text><Text style={styles.infoNumber}>120</Text></View>
          <View style={styles.infoCard}><Text style={styles.infoTitle}>Pending</Text><Text style={styles.infoNumber}>8</Text></View>
          <View style={styles.infoCard}><Text style={styles.infoTitle}>Wishlist</Text><Text style={styles.infoNumber}>24</Text></View>
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={() => router.push("/edit-info" as any)}
        >
          <Text style={styles.buttonText}>Edit Info</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={() => router.push("/change-password" as any)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={() => setShowEdit(true)}
        >
          <Text style={styles.buttonText}>Edit Preferences</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={() => router.push("/reviews" as any)}
        >
          <Text style={styles.buttonText}>Leave / View Reviews</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: "#a3bfa9" }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#c0726e" }]} onPress={() => setShowDeleteConfirm(true)}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              You will not be able to access any of your data. This will permanently delete your wardrobe, outfits, saved items, and profile — you will have to start from the beginning to rebuild your wardrobe. This cannot be undone.
            </Text>
            <TouchableOpacity
              style={styles.modalDeleteBtn}
              onPress={confirmDelete}
              disabled={deleting}
            >
              {deleting
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.modalBtnText}>Yes, Delete My Account</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: "center" },
  headerText: { fontSize: 24, fontWeight: "700" },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  card: { borderRadius: 16, alignItems: "center", padding: 20, marginHorizontal: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  avatarWrapper: { width: 100, height: 100, borderRadius: 50, marginBottom: 12, overflow: "hidden" },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#b0c4cc", justifyContent: "center", alignItems: "center" },
  avatarOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 32, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  avatarEditText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700" },
  email: { fontSize: 14, marginTop: 4 },
  switchRow: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  infoCard: { backgroundColor: "#b9d6da", padding: 15, borderRadius: 12, alignItems: "center", width: 100 },
  infoTitle: { fontSize: 14, color: "#222", marginBottom: 5 },
  infoNumber: { fontSize: 18, fontWeight: "700", color: "#233443" },
  button: { paddingVertical: 14, marginHorizontal: 20, borderRadius: 30, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 28 },
  modalBox: { backgroundColor: "#eeede8", borderRadius: 25, padding: 28, width: "100%", maxWidth: 380, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#000", textAlign: "center", marginBottom: 12 },
  modalMessage: { fontSize: 15, color: "#4B5563", lineHeight: 22, textAlign: "center", marginBottom: 24 },
  modalDeleteBtn: { backgroundColor: "#c0726e", paddingVertical: 18, borderRadius: 32, alignItems: "center", marginBottom: 10 },
  modalCancelBtn: { backgroundColor: "#a3bea9", paddingVertical: 18, borderRadius: 32, alignItems: "center" },
  modalBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
