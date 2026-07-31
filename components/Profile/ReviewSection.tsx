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
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
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
    const { themeColors } = useAppTheme();

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
        <View style={[globalStyles.card, styles.card, { backgroundColor: themeColors.card, shadowColor: themeColors.shadow }]}>
            {/* Return to Profile page */}
            <TouchableOpacity style={[styles.backButton, { backgroundColor: themeColors.input }]} onPress={onClose}>
                <Text style={[styles.backButtonText, { color: themeColors.text }]}>← Back to Profile</Text>
            </TouchableOpacity>

            {/* Section Title */}
            <Text style={[styles.title, { color: themeColors.text }]}>Leave a Review</Text>

            <Text style={[styles.description, { color: themeColors.muted }]}>
                Tell us how your experience has been so we can keep improving
                TrendSense.
            </Text>

            {/* Star Rating section */}
            <Text style={[styles.label, { color: themeColors.text }]}>Rating</Text>

            <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => {
                            setRating(star);
                            setError("");
                        }}
                    >
                        <Text style={[styles.star, { color: star <= rating ? themeColors.rating : themeColors.bgDark }]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Written Review section */}
            <Text style={[styles.label, { color: themeColors.text }]}>Your Review</Text>

            <TextInput
                style={[globalStyles.input, styles.textArea, { color: themeColors.text, backgroundColor: themeColors.input }]}
                value={message}
                onChangeText={(text) => {
                    setMessage(text);
                    setError("");
                }}
                placeholder="Write your review here..."
                placeholderTextColor={themeColors.muted}
                multiline
                textAlignVertical="top"
            />

            {/* Validation or error message */}
            {error ? <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text> : null}

            {/* Success message */}
            {successMsg ? (
                <View style={[styles.successBox, { backgroundColor: themeColors.successBg }]}>
                    <Text style={[styles.successText, { color: themeColors.success }]}>{successMsg}</Text>
                </View>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <Pressable
                    style={[styles.actionButton, { backgroundColor: themeColors.muted }]}
                    onPress={onClose}
                    disabled={loading}
                >
                    <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Cancel</Text>
                </Pressable>

                <Pressable
                    style={[styles.actionButton, { backgroundColor: themeColors.bgDark }]}
                    onPress={submit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={themeColors.white} />
                    ) : (
                        <Text style={[styles.actionButtonText, { color: themeColors.white }]}>Submit Review</Text>
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
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
    },

    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        marginBottom: 16,
    },

    backButtonText: {
        fontWeight: "700",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 8,
    },

    description: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
    },

    stars: {
        flexDirection: "row",
        marginBottom: 18,
        gap: 8,
    },

    star: {
        fontSize: 38,
    },

    textArea: {
        minHeight: 140,
        marginBottom: 14,
    },

    successBox: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },

    successText: {
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

    actionButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },

    errorText: {
        fontSize: 13,
        marginTop: 8,
        textAlign: "center",
    },
});
