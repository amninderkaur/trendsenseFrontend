// app/profile.tsx
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { removeToken, removeUserId } from "../../utils/token";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    removeUserId();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Account Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <Image
          source={{ uri: "https://placekitten.com/200/200" }} // placeholder profile image
          style={styles.avatar}
        />
        <Text style={styles.name}>Nabia Mahmood</Text>
        <Text style={styles.email}>nabia@example.com</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Orders</Text>
          <Text style={styles.infoNumber}>120</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Pending</Text>
          <Text style={styles.infoNumber}>8</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Wishlist</Text>
          <Text style={styles.infoNumber}>24</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>

      <Pressable style={[styles.button, { backgroundColor: "#a3bfa9" }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ececec" },

  header: { padding: 20, alignItems: "center" },
  headerText: { fontSize: 24, fontWeight: "700", color: "#222" },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#c0d1bf",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "700", color: "#222" },
  email: { fontSize: 14, color: "#666", marginTop: 4 },

  infoContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  infoCard: {
    backgroundColor: "#b9d6da", // light mint highlight
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: 100,
  },
  infoTitle: { fontSize: 14, color: "#222", marginBottom: 5 },
  infoNumber: { fontSize: 18, fontWeight: "700", color: "b9d6da" },

  button: {
    backgroundColor: "#a3bfa9", // teal
    paddingVertical: 14,
    marginHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
