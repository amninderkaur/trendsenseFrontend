import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getAdminReviews } from "../../api/admin";
import { colors } from "../../constants/globalStyles";

export default function AdminReviews() {
  const router = useRouter();
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminReviews();
        setReviews(Array.isArray(data) ? data : data?.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}><Text style={styles.backButtonText}>← Back</Text></Pressable>
      <Text style={styles.title}>Review History</Text>
      {loading ? <ActivityIndicator /> : reviews.map((review, index) => (
        <View key={review.id || index} style={styles.card}>
          <Text style={styles.label}>User: {review.userEmail || review.email || review.userId || "Unknown"}</Text>
          <Text style={styles.label}>Rating: {review.rating}</Text>
          <Text style={styles.text}>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { alignSelf: "flex-start", backgroundColor: colors.bgDark, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 12 },
  backButtonText: { color: colors.white, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 16, marginBottom: 12 },
  label: { color: colors.text, marginBottom: 6, fontWeight: "800" },
  text: { color: colors.muted },
});
