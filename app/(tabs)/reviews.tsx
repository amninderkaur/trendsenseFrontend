import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createReview } from "../../api/reviews";
import { colors, globalStyles } from "../../constants/globalStyles";

export default function ReviewsScreen() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submit = async () => {
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a review message.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await createReview({ message: message.trim(), rating });
      setSuccessMsg(`Your review has been submitted! Case #${data.caseNumber}`);
      setMessage("");
      setRating(0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Leave a Review</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => { setRating(star); setError(""); }}>
              <Text style={[styles.star, star <= rating && styles.starFilled]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={(t) => { setMessage(t); setError(""); }}
          placeholder="Write your review here..."
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
        />

        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        {successMsg ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        <Pressable style={globalStyles.primaryButton} onPress={submit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.primaryButtonText}>Submit Review</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.bgDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 16,
  },
  backButtonText: { color: colors.white, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 20 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 18 },
  label: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 8 },
  stars: { flexDirection: "row", marginBottom: 18, gap: 6 },
  star: { fontSize: 36, color: colors.bgDark },
  starFilled: { color: "#f5a623" },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.input,
    fontSize: 15,
    color: colors.text,
  },
  textArea: { minHeight: 120 },
  successBox: {
    backgroundColor: "#e6f4ea",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  successText: { color: "#2e7d32", fontWeight: "700", fontSize: 15 },
});
