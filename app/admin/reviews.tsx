import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

import { getAdminReviews, replyToReview } from "../../api/admin";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";

export default function AdminReviewsScreen() {
  const router = useRouter();

  // Guard — only ADMIN can see this screen
  if (getRole() !== "ADMIN") {
    return (
      <View style={styles.centered}>
        <Text style={styles.denied}>Access denied.</Text>
      </View>
    );
  }

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
  const [replyStatus, setReplyStatus] = useState<Record<number, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleReply = async (caseNumber: number) => {
    const text = replyTexts[caseNumber]?.trim();
    if (!text) return;

    setReplyLoading((prev) => ({ ...prev, [caseNumber]: true }));
    setReplyStatus((prev) => ({ ...prev, [caseNumber]: "" }));

    try {
      await replyToReview(caseNumber, text);
      setReplyStatus((prev) => ({ ...prev, [caseNumber]: "Reply sent!" }));
      setReplyTexts((prev) => ({ ...prev, [caseNumber]: "" }));
    } catch {
      setReplyStatus((prev) => ({ ...prev, [caseNumber]: "Failed to send reply." }));
    } finally {
      setReplyLoading((prev) => ({ ...prev, [caseNumber]: false }));
    }
  };

  const StarDisplay = ({ rating }: { rating: number }) => (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={[styles.star, s <= rating && styles.starFilled]}>★</Text>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>All Reviews</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.blueDark} />
      ) : reviews.length === 0 ? (
        <Text style={styles.empty}>No reviews yet.</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.id || review.caseNumber} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.caseNumber}>Case #{review.caseNumber}</Text>
              <Text style={[styles.replyBadge, review.adminReply ? styles.repliedBadge : styles.pendingBadge]}>
                {review.adminReply ? "Replied" : "Pending"}
              </Text>
            </View>

            <Text style={styles.email}>{review.email}</Text>
            <StarDisplay rating={review.rating} />
            <Text style={styles.message}>{review.message}</Text>

            {review.adminReply ? (
              <View style={styles.existingReply}>
                <Text style={styles.existingReplyLabel}>Admin reply:</Text>
                <Text style={styles.existingReplyText}>{review.adminReply}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.replyInput}
              placeholder="Write a reply..."
              placeholderTextColor={colors.muted}
              value={replyTexts[review.caseNumber] || ""}
              onChangeText={(t) =>
                setReplyTexts((prev) => ({ ...prev, [review.caseNumber]: t }))
              }
              multiline
            />

            {replyStatus[review.caseNumber] ? (
              <Text style={replyStatus[review.caseNumber] === "Reply sent!" ? styles.successText : styles.errorText}>
                {replyStatus[review.caseNumber]}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => handleReply(review.caseNumber)}
              disabled={replyLoading[review.caseNumber]}
            >
              {replyLoading[review.caseNumber] ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.replyButtonText}>Send Reply</Text>
              )}
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  denied: { fontSize: 18, color: colors.muted },
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
  empty: { color: colors.muted, fontSize: 16, textAlign: "center", marginTop: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  caseNumber: { fontWeight: "800", fontSize: 15, color: colors.text },
  replyBadge: { fontSize: 12, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  repliedBadge: { backgroundColor: "#e6f4ea", color: "#2e7d32" },
  pendingBadge: { backgroundColor: "#fff3e0", color: "#e65100" },
  email: { color: colors.muted, fontSize: 13, marginBottom: 6 },
  stars: { flexDirection: "row", marginBottom: 8, gap: 2 },
  star: { fontSize: 20, color: colors.bgDark },
  starFilled: { color: "#f5a623" },
  message: { color: colors.text, fontSize: 14, marginBottom: 12, lineHeight: 20 },
  existingReply: { backgroundColor: "#f0f4ff", borderRadius: 10, padding: 10, marginBottom: 10 },
  existingReplyLabel: { fontSize: 12, fontWeight: "700", color: colors.blueDark, marginBottom: 4 },
  existingReplyText: { fontSize: 13, color: colors.text },
  replyInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.input,
    fontSize: 14,
    color: colors.text,
    minHeight: 70,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  replyButton: {
    backgroundColor: colors.blueDark,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  replyButtonText: { color: colors.white, fontWeight: "700", fontSize: 14 },
  successText: { color: "#2e7d32", fontWeight: "700", fontSize: 13, marginBottom: 6 },
  errorText: { color: "#c62828", fontSize: 13, marginBottom: 6 },
});
