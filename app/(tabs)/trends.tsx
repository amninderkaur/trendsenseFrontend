import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Trends() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Trends</Text>
        <Text style={{ color: "#666", marginTop: 4 }}>
          Overview of product movement and analytics
        </Text>
      </View>

      {/* Section: Popular categories */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Popular Categories
        </Text>

        <View style={{ backgroundColor: "#eee", padding: 20, borderRadius: 12, marginBottom: 12 }}>
          <Text>Category A</Text>
        </View>

        <View style={{ backgroundColor: "#eee", padding: 20, borderRadius: 12, marginBottom: 12 }}>
          <Text>Category B</Text>
        </View>

        <View style={{ backgroundColor: "#eee", padding: 20, borderRadius: 12, marginBottom: 12 }}>
          <Text>Category C</Text>
        </View>
      </View>

      {/* Section: Best Selling Items */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Best Selling Items
        </Text>

        <View style={{ backgroundColor: "#eee", padding: 20, borderRadius: 12, marginBottom: 12 }}>
          <Text>Item 1</Text>
        </View>

        <View style={{ backgroundColor: "#eee", padding: 20, borderRadius: 12, marginBottom: 12 }}>
          <Text>Item 2</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#c0d1bf",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
});
