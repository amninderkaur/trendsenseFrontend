import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createReview, getMyReviews } from "../../api/reviews";
import { colors, globalStyles } from "../../constants/globalStyles";

export default function Reviews() {
  const router = useRouter();
  const [rating, setRating] = React.useState("5");
  const [comment, setComment] = React.useState("");
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadReviews = async () => {
    try {
      const data = await getMyReviews();
      setReviews(Array.isArray(data) ? data : data?.reviews || []);
    } catch {
      setReviews([]);
    }
  };

  React.useEffect(() => { loadReviews(); }, []);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await createReview({ rating: Number(rating), comment });
      setComment("");
      await loadReviews();
    } catch (err: any) {
      setError(err?.message || "Could not save review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}><Text style={styles.backButtonText}>← Back</Text></Pressable>
      <Text style={styles.title}>Reviews</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} value={rating} onChangeText={setRating} keyboardType="numeric" placeholder="Rating 1-5" />
        <TextInput style={[styles.input, styles.comment]} value={comment} onChangeText={setComment} placeholder="Write your review" multiline />
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
        <Pressable style={globalStyles.primaryButton} onPress={submit} disabled={loading}>{loading ? <ActivityIndicator color={colors.white} /> : <Text style={globalStyles.primaryButtonText}>Submit Review</Text>}</Pressable>
      </View>

      <Text style={styles.sectionTitle}>Review History</Text>
      {reviews.map((review, index) => (
        <View key={review.id || index} style={styles.reviewCard}>
          <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
          <Text style={styles.reviewText}>{review.comment}</Text>
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
  sectionTitle: { fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 10 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 18 },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.input },
  comment: { minHeight: 100, textAlignVertical: "top" },
  reviewCard: { backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10 },
  reviewRating: { fontWeight: "800", color: colors.text, marginBottom: 4 },
  reviewText: { color: colors.muted },
});
