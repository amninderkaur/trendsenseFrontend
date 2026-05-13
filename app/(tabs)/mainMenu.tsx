import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <Text style={styles.timeText}>09:00 AM</Text>
      </View>

      {/* Overview Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Overview</Text>
        <Text style={styles.infoText}>Here’s a quick summary of your dashboard.</Text>

        
        <Link href="/wardrobe" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go to Wardrobe</Text>
          </Pressable>
        </Link>
        <Link href="/history" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go to History</Text>
          </Pressable>
        </Link>
      </View>

      {/* Slideshow */}
      <View style={styles.slideshow}>
        <Text style={styles.slideshowText}>Slideshow Placeholder</Text>
      </View>

      {/* Tiles */}
      <View style={styles.tilesContainer}>
        <View style={styles.tile}>
          <Text style={styles.tileNumber}>120</Text>
          <Text style={styles.tileLabel}>Orders</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileNumber}>24</Text>
          <Text style={styles.tileLabel}>New Customers</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileNumber}>8</Text>
          <Text style={styles.tileLabel}>Pending</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Menu</Text>

        <Link href="/" asChild>
          <Pressable style={styles.menuItem}>
            <MaterialIcons name="dashboard" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Dashboard</Text>
          </Pressable>
        </Link>

        <Link href="/upload-clothes" asChild>
          <Pressable style={styles.menuItem}>
            <MaterialIcons name="add-a-photo" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Upload Clothes</Text>
          </Pressable>
        </Link>

        <Link href="/upload-outfit" asChild>
          <Pressable style={styles.menuItem}>
            <MaterialIcons name="checkroom" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Outfit Suggestion</Text>
          </Pressable>
        </Link>

        <Link href="/trends" asChild>
          <Pressable style={styles.menuItem}>
            <FontAwesome5 name="chart-line" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Trends</Text>
          </Pressable>
        </Link>

        <Link href="/profile" asChild>
          <Pressable style={styles.menuItem}>
            <MaterialIcons name="person" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Account Profile</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable style={styles.menuItem}>
            <MaterialIcons name="login" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Login</Text>
          </Pressable>
        </Link>

        <Link href="/register" asChild>
          <Pressable style={styles.menuItem}>
            <MaterialIcons name="person-add" size={20} color="#00A6A6" style={styles.icon} />
            <Text>Signup</Text>
          </Pressable>
        </Link>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7f6", padding: 15 },

  header: { paddingVertical: 15 },
  headerText: { fontSize: 28, fontWeight: "700", color: "#222" },
  timeText: { fontSize: 16, color: "#666", marginTop: 4 },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  infoTitle: { fontSize: 20, fontWeight: "700", marginBottom: 6, color: "#222" },
  infoText: { fontSize: 14, color: "#666", marginBottom: 10 },

  button: {
    backgroundColor: "#c0d1bf",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  slideshow: {
    backgroundColor: "#b9d6da",
    borderRadius: 16,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  slideshowText: { color: "#008080", fontWeight: "700" },

  tilesContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  tile: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tileNumber: { fontSize: 22, fontWeight: "700", color: "#96b7bc" },
  tileLabel: { fontSize: 14, color: "#666" },

  menu: { marginTop: 20 },
  menuTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#222" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: { marginRight: 10 },
});
