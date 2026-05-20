import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PersonalizationModal from "../(auth)/PersonalizationModal";
import { getProfile } from "../../api/profile";
import { useAppTheme } from "../../context/ThemeContext";
import { getEmail, removeEmail, removeToken, removeUserId } from "../../utils/token";

export default function Profile() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, themeColors } = useAppTheme();
  const email = getEmail() || "user@example.com";

  const [displayName, setDisplayName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => setDisplayName(data?.displayName || ""))
      .catch(() => {})
      .finally(() => setLoadingName(false));
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUserId();
    removeEmail();
    router.replace("/(auth)/login");
  };

  return (
    <>
      <PersonalizationModal
        visible={showEdit}
        onClose={() => {
          setShowEdit(false);
          // Refresh name after editing
          getProfile().then((data) => setDisplayName(data?.displayName || "")).catch(() => {});
        }}
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
          <Image source={{ uri: "https://placekitten.com/200/200" }} style={styles.avatar} />
          {loadingName ? (
            <ActivityIndicator style={{ marginBottom: 4 }} />
          ) : (
            <Text style={[styles.name, { color: themeColors.text }]}>
              {displayName || "TrendSense User"}
            </Text>
          )}
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
      </ScrollView>
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
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "700" },
  email: { fontSize: 14, marginTop: 4 },
  switchRow: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  infoCard: { backgroundColor: "#b9d6da", padding: 15, borderRadius: 12, alignItems: "center", width: 100 },
  infoTitle: { fontSize: 14, color: "#222", marginBottom: 5 },
  infoNumber: { fontSize: 18, fontWeight: "700", color: "#233443" },
  button: { paddingVertical: 14, marginHorizontal: 20, borderRadius: 30, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
