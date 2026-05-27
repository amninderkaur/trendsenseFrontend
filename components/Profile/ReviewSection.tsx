/* 
* Reviews Section Component
* This component allows users to:
*  - select a star rating between 1 and 5
*  - write a review message
*  - submit the review 
*  - see submission success/errors
*/
// ================
//     IMPORTS
// ================
import { colors, globalStyles } from "@/constants/globalStyles";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { createReview } from "../../api/reviews";

// ==============
//     TYPES
// ==============
type Props = {
    onClose: () => void;
};

// ================
//   REVIEW SECTION COMPONENT
// ================
export default function ReviewsSection({ onClose }: Props) {

    // Review form state
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");

    // Submission state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Submit review to backend API
    const submit = async () => {
        // validate star rating
        if (!rating) {
            setError("Please select a star rating.");
            return;
        }

        // validate review message
        if (!message.trim()) {
            setError("Please write a review message.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Send review to backend
            const data = await createReview({
                message: message.trim(),
                rating,
            });

            // Reset form after successful submission
            setSuccessMsg(`Your review has been submitted! Case #${data.caseNumber}`);
            setMessage("");
            setRating(0);
        } catch (err: any) {
            // display error message from backend
            setError(
                err?.response?.data?.message ||
                "Could not submit review. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ================
    //     RENDER
    // ================
    return (
        <View style={[globalStyles.card, styles.card]}>
            {/* Return to Profile page */}
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Text style={styles.backButtonText}>← Back to Profile</Text>
            </TouchableOpacity>

            {/* Section Title */}
            <Text style={styles.title}>Leave a Review</Text>

            <Text style={styles.description}>
                Tell us how your experience has been so we can keep improving
                TrendSense.
            </Text>

            {/* Star Rating section */}
            <Text style={styles.label}>Rating</Text>

            <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => {
                            setRating(star);
                            setError("");
                        }}
                    >
                        <Text style={[styles.star, star <= rating && styles.starFilled]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Written Review section */}
            <Text style={styles.label}>Your Review</Text>

            <TextInput
                style={[globalStyles.input, styles.textArea]}
                value={message}
                onChangeText={(text) => {
                    setMessage(text);
                    setError("");
                }}
                placeholder="Write your review here..."
                placeholderTextColor={colors.muted}
                multiline
                textAlignVertical="top"
            />

            {/* Validation or error message */}
            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

            {/* Success message */}
            {successMsg ? (
                <View style={styles.successBox}>
                    <Text style={styles.successText}>{successMsg}</Text>
                </View>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <Pressable
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={onClose}
                    disabled={loading}
                >
                    <Text style={styles.actionButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                    style={[styles.actionButton, styles.submitButton]}
                    onPress={submit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.actionButtonText}>Submit Review</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
    },

    backButton: {
        alignSelf: "flex-start",
        backgroundColor: colors.input,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        marginBottom: 16,
    },

    backButtonText: {
        color: colors.text,
        fontWeight: "700",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.text,
        marginBottom: 8,
    },

    description: {
        fontSize: 15,
        color: colors.muted,
        lineHeight: 22,
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    stars: {
        flexDirection: "row",
        marginBottom: 18,
        gap: 8,
    },

    star: {
        fontSize: 38,
        color: colors.bgDark,
    },

    starFilled: {
        color: "#f5a623",
    },

    textArea: {
        minHeight: 140,
        marginBottom: 14,
    },

    successBox: {
        backgroundColor: "#af7d2b",
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },

    successText: {
        color: "#af7d2b",
        fontWeight: "700",
        fontSize: 15,
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },

    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
    },

    cancelButton: {
        backgroundColor: colors.muted,
    },

    submitButton: {
        backgroundColor: colors.bgDark,
    },

    actionButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "700",
    },
});