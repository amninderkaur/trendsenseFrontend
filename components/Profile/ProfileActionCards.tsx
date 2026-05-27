/* 
 * Profile Action Cards component
 * This component displays a grid
 * of cards for different profile 
 * actions including:
 * - Edit Profile
 * - Change Password
 * - Edit Preferences
 * - Reviews
 * - Dashboard
 * - Logout
 * - Delete Account
 * It also shows user stats like:
 * - Outfits Generated
 * - Outfits Reviewed
 * - Wardrobe Items
 */
// ================
//     IMPORTS
// ================
import { colors } from "@/constants/globalStyles";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

// ==============
//     TYPES
// ==============
type Props = {
    onEditInfo: () => void;
    onPreferences: () => void;
    onChangePassword: () => void;
    onReview: () => void;
    onLogout: () => void;
    onDelete: () => void;
    onDashboard: () => void;
    outfitsGenerated: number;
    outfitsReviewed: number;
    wardrobeItems: number;
};

// ================
// PROFILE ACTION CARDS COMPONENT
// ================
export default function ProfileActionCards({
    onEditInfo,
    onPreferences,
    onChangePassword,
    onReview,
    onLogout,
    onDelete,
    onDashboard,
    outfitsGenerated,
    outfitsReviewed,
    wardrobeItems,
}: Props) {

    // Responsive card sizing 
    const { width } = useWindowDimensions();
    const isMobile = width < 700;

    const baseCardStyle = [
        styles.actionCard,
        isMobile ? styles.mobileActionCard : styles.desktopActionCard,
    ];

    // ================
    //     RENDER
    // ================
    return (
        <View style={styles.actionGrid}>
            {/* Activity Stats Card */}
            <View
                style={[
                    styles.largeStatsCard,
                    isMobile ? styles.mobileLargeStatsCard : styles.desktopLargeStatsCard,
                ]}
            >
                <Text style={styles.statsTitle}>Your Activity</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <View style={styles.statCircle}>
                            <Text style={styles.statNumber}>{outfitsGenerated}</Text>
                        </View>
                        <Text style={styles.statLabel}>Generated</Text>
                    </View>

                    <View style={styles.statItem}>
                        <View style={styles.statCircle}>
                            <Text style={styles.statNumber}>{outfitsReviewed}</Text>
                        </View>
                        <Text style={styles.statLabel}>Reviewed</Text>
                    </View>

                    <View style={styles.statItem}>
                        <View style={styles.statCircle}>
                            <Text style={styles.statNumber}>{wardrobeItems}</Text>
                        </View>
                        <Text style={styles.statLabel}>Wardrobe</Text>
                    </View>
                </View>
            </View>

            {/* Edit Profile Card */}
            <TouchableOpacity style={baseCardStyle} onPress={onEditInfo}>
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintGreen },
                    ]}
                />
                <Text style={styles.actionIcon}>👤</Text>
                <Text style={styles.actionTitle}>Edit Profile</Text>
                <Text style={styles.actionDescription}>
                    Update your name, phone number, and profile image.
                </Text>
                <Text style={styles.actionLink}>Manage →</Text>
            </TouchableOpacity>

            {/* Change Password Card */}
            <TouchableOpacity style={baseCardStyle} onPress={onChangePassword}>
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintBeige },
                    ]}
                />
                <Text style={styles.actionIcon}>🔒</Text>
                <Text style={styles.actionTitle}>Change Password</Text>
                <Text style={styles.actionDescription}>
                    Update your account password securely.
                </Text>
                <Text style={styles.actionLink}>Manage →</Text>
            </TouchableOpacity>

            {/* Edit Preferences Card */}
            <TouchableOpacity style={baseCardStyle} onPress={onPreferences}>
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintPurple },
                    ]}
                />
                <Text style={styles.actionIcon}>✨</Text>
                <Text style={styles.actionTitle}>Edit Preferences</Text>
                <Text style={styles.actionDescription}>
                    Update your style identity and AI personalization.
                </Text>
                <Text style={styles.actionLink}>Update →</Text>
            </TouchableOpacity>

            {/* Reviews Card */}
            <TouchableOpacity style={baseCardStyle} onPress={onReview}>
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintGold },
                    ]}
                />
                <Text style={styles.actionIcon}>⭐</Text>
                <Text style={styles.actionTitle}>Reviews</Text>
                <Text style={styles.actionDescription}>
                    Leave or view reviews from your experiences.
                </Text>
                <Text style={styles.actionLink}>Open →</Text>
            </TouchableOpacity>

            {/* Back to Dashboard Card */}
            <TouchableOpacity style={baseCardStyle} onPress={onDashboard}>
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintPink },
                    ]}
                />
                <Text style={styles.actionIcon}>🏠</Text>
                <Text style={styles.actionTitle}>Back to Dashboard</Text>
                <Text style={styles.actionDescription}>
                    Return to your main dashboard and app features.
                </Text>
                <Text style={styles.actionLink}>Go back →</Text>
            </TouchableOpacity>

            {/* Logout Card */}
            <TouchableOpacity
                style={baseCardStyle}
                onPress={onLogout}
            >
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintBlue },
                    ]}
                />
                <Text style={styles.actionIcon}>🚪</Text>
                <Text style={styles.actionTitle}>Logout</Text>
                <Text style={styles.actionDescription}>Sign out of your account.</Text>
                <Text style={styles.actionLink}>Logout →</Text>
            </TouchableOpacity>

            {/* Delete Account Card */}
            <TouchableOpacity
                style={baseCardStyle}
                onPress={onDelete}
            >
                <View
                    style={[
                        styles.cardTint,
                        { backgroundColor: colors.profileTintRed },
                    ]}
                />
                <Text style={styles.actionIcon}>🗑️</Text>
                <Text style={styles.actionTitle}>Delete Account</Text>
                <Text style={styles.actionDescription}>
                    Permanently remove your account and data.
                </Text>
                <Text style={styles.actionLink}>Delete →</Text>
            </TouchableOpacity>
        </View>
    );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
    actionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 16,
    },

    actionCard: {
        minHeight: 190,
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 22,
        overflow: "hidden",
        position: "relative",
        shadowColor: colors.text,
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    desktopActionCard: {
        width: "32%",
    },

    mobileActionCard: {
        width: "48%",
    },

    largeStatsCard: {
        minHeight: 190,
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 22,
        overflow: "hidden",
        position: "relative",
        shadowColor: colors.text,
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    desktopLargeStatsCard: {
        width: "66%",
    },

    mobileLargeStatsCard: {
        width: "100%",
    },

    cardTint: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.45,
        borderRadius: 24,
    },

    statsTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 22,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    statItem: {
        alignItems: "center",
        flex: 1,
    },

    statCircle: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: colors.bgDark,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: colors.text,
        shadowOpacity: 0.04,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    statNumber: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.text,
    },

    statLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.muted,
    },

    actionIcon: {
        fontSize: 24,
        marginBottom: 10,
        zIndex: 1,
    },

    actionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 10,
        zIndex: 1,
    },

    actionDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.muted,
        zIndex: 1,
    },

    actionLink: {
        marginTop: "auto",
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
        zIndex: 1,
    },
});