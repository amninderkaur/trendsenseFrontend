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
      <View style={styles.center}>
        <View style={styles.emptyStateIcon}>
          <Text style={styles.emptyStateIconText}>🔒</Text>
        </View>
        <Text style={styles.deniedTitle}>Access Denied</Text>
        <Text style={styles.deniedText}>Admin access required to view this page.</Text>
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
      setReplyStatus((prev) => ({ ...prev, [caseNumber]: "✓ Reply sent!" }));
      setReplyTexts((prev) => ({ ...prev, [caseNumber]: "" }));
      setTimeout(() => {
        setReplyStatus((prev) => ({ ...prev, [caseNumber]: "" }));
      }, 3000);
    } catch {
      setReplyStatus((prev) => ({ ...prev, [caseNumber]: "✗ Failed to send" }));
    } finally {
      setReplyLoading((prev) => ({ ...prev, [caseNumber]: false }));
    }
  };

  const StarDisplay = ({ rating }: { rating: number }) => (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={[styles.star, s <= rating && styles.starFilled]}>
          ★
        </Text>
      ))}
    </View>
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#4caf50";
    if (rating >= 3) return "#ff9800";
    return "#f44336";
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Dashboard</Text>
      </Pressable>

      <View style={styles.headerSection}>
        <View>
          <Text style={styles.title}>Review History</Text>
          <Text style={styles.subtitle}>Manage and respond to user feedback</Text>
        </View>
        <View style={styles.reviewCountBadge}>
          <Text style={styles.reviewCountIcon}>⭐</Text>
          <Text style={styles.reviewCountText}>{reviews.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blueDark} />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptyText}>
            User reviews will appear here once customers leave feedback.
          </Text>
        </View>
      ) : (
        reviews.map((review, index) => (
          <View key={review.id || review.caseNumber} style={styles.card}>
            {/* Review Header */}
            <View style={styles.cardHeader}>
              <View style={styles.caseInfo}>
                <Text style={styles.caseNumber}>Case #{review.caseNumber}</Text>
                <Text style={styles.userEmail}>{review.email}</Text>
              </View>
              <Text
                style={[
                  styles.replyBadge,
                  review.adminReply ? styles.repliedBadge : styles.pendingBadge,
                ]}
              >
                {review.adminReply ? "✓ Replied" : "⏳ Pending"}
              </Text>
            </View>

            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <StarDisplay rating={review.rating} />
              <View
                style={[
                  styles.ratingBadge,
                  { backgroundColor: getRatingColor(review.rating) + "20" },
                ]}
              >
                <Text style={[styles.ratingText, { color: getRatingColor(review.rating) }]}>
                  {review.rating}.0 / 5.0
                </Text>
              </View>
            </View>

            {/* Review Message */}
            <View style={styles.messageSection}>
              <Text style={styles.messageLabel}>Feedback</Text>
              <Text style={styles.message}>{review.message}</Text>
            </View>

            {/* Existing Reply */}
            {review.adminReply ? (
              <View style={styles.existingReply}>
                <View style={styles.existingReplyHeader}>
                  <Text style={styles.existingReplyIcon}>💬</Text>
                  <Text style={styles.existingReplyLabel}>Your Reply</Text>
                </View>
                <Text style={styles.existingReplyText}>{review.adminReply}</Text>
              </View>
            ) : null}

            {/* Reply Input */}
            {!review.adminReply && (
              <View style={styles.replySection}>
                <Text style={styles.replyLabel}>📝 Write a Reply</Text>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Type your response here..."
                  placeholderTextColor={colors.muted}
                  value={replyTexts[review.caseNumber] || ""}
                  onChangeText={(t) =>
                    setReplyTexts((prev) => ({ ...prev, [review.caseNumber]: t }))
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                {/* Status Message */}
                {replyStatus[review.caseNumber] && (
                  <Text
                    style={[
                      styles.statusText,
                      replyStatus[review.caseNumber].includes("✓")
                        ? styles.successText
                        : styles.errorText,
                    ]}
                  >
                    {replyStatus[review.caseNumber]}
                  </Text>
                )}

                {/* Send Button */}
                <TouchableOpacity
                  style={[
                    styles.replyButton,
                    replyLoading[review.caseNumber] && styles.replyButtonDisabled,
                  ]}
                  onPress={() => handleReply(review.caseNumber)}
                  disabled={replyLoading[review.caseNumber]}
                >
                  {replyLoading[review.caseNumber] ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <>
                      <Text style={styles.replyButtonIcon}>✉️</Text>
                      <Text style={styles.replyButtonText}>Send Reply</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },

  // Empty/Access States
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateIconText: { fontSize: 40 },
  deniedTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  deniedText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  // Back Button
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.input,
  },
  backButtonText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },

  // Header Section
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "500",
  },
  reviewCountBadge: {
    backgroundColor: "#F5A623" + "20",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    gap: 4,
  },
  reviewCountIcon: {
    fontSize: 20,
  },
  reviewCountText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F5A623",
  },

  // Loading
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: colors.muted,
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    gap: 12,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Card Header
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.input,
  },
  caseInfo: {
    flex: 1,
    gap: 4,
  },
  caseNumber: {
    fontWeight: "800",
    fontSize: 15,
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "500",
  },

  // Badge
  replyBadge: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  repliedBadge: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  pendingBadge: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
  },

  // Rating Section
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 18,
    color: colors.input,
  },
  starFilled: {
    color: "#F5A623",
  },
  ratingBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Message Section
  messageSection: {
    gap: 6,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  message: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },

  // Existing Reply
  existingReply: {
    backgroundColor: colors.blueDark + "15",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.blueDark,
    gap: 8,
  },
  existingReplyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  existingReplyIcon: {
    fontSize: 16,
  },
  existingReplyLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.blueDark,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  existingReplyText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
    lineHeight: 20,
  },

  // Reply Section
  replySection: {
    gap: 10,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  replyInput: {
    backgroundColor: colors.input + "20",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.input,
    fontSize: 14,
    color: colors.text,
    minHeight: 90,
    textAlignVertical: "top",
    fontWeight: "500",
  },

  // Status Message
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  successText: {
    color: "#2e7d32",
  },
  errorText: {
    color: "#d32f2f",
  },

  // Reply Button
  replyButton: {
    backgroundColor: colors.blueDark,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: colors.blueDark,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  replyButtonDisabled: {
    opacity: 0.6,
  },
  replyButtonIcon: {
    fontSize: 16,
  },
  replyButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
