/* 
 * Profile Action Cards component
 * This component displays a grid
 * of cards for different profile 
 * actions including:
 * - Edit Profile
 * - Change Password
 * - Edit Preferences
 * - Reviews
 * - Logout
 * - Delete Account
 */
// ================
//     IMPORTS
// ================
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
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
}: Props) {
    const { themeColors } = useAppTheme();

    // Responsive card sizing 
    const { width } = useWindowDimensions();
    const isPhone = width < 650;
    const isTablet = width >= 650 && width < 1050;

    const cardContainerStyle = [
        styles.actionCardContainer,
        {
            backgroundColor: themeColors.card,
            shadowColor: themeColors.shadow,
        },
        isPhone
            ? styles.phoneActionCard
            : isTablet
              ? styles.tabletActionCard
              : styles.desktopActionCard,
    ];

    const ActionCard = ({
        title,
        description,
        icon,
        iconBackground,
        iconColor,
        onPress,
    }: {
        title: string;
        description: string;
        icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
        iconBackground: string;
        iconColor: string;
        onPress: () => void;
    }) => (
        <View style={cardContainerStyle}>
            <TouchableOpacity
                style={[
                    styles.actionCard,
                    { backgroundColor: themeColors.card },
                ]}
                onPress={onPress}
                activeOpacity={0.82}
            >
                <View
                    style={[
                        styles.iconCircle,
                        { backgroundColor: iconBackground },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={icon}
                        size={25}
                        color={iconColor}
                    />
                </View>

                <View style={styles.cardText}>
                    <Text style={[styles.actionTitle, { color: themeColors.text }]}> 
                        {title}
                    </Text>
                    <Text
                        style={[styles.actionDescription, { color: themeColors.muted }]}
                        numberOfLines={2}
                    >
                        {description}
                    </Text>
                </View>

                <MaterialCommunityIcons
                    name="chevron-right"
                    size={27}
                    color={themeColors.text}
                />
            </TouchableOpacity>
        </View>
    );

    // ================
    //     RENDER
    // ================
    return (
        <View style={styles.actionGrid}>
            <ActionCard
                title="Edit Profile"
                description="Update your name, email, profile picture and personal info."
                icon="account-outline"
                iconBackground={themeColors.profileTintGreen}
                iconColor={themeColors.profileIconGreen}
                onPress={onEditInfo}
            />
            <ActionCard
                title="Change Password"
                description="Update your password to keep your account secure."
                icon="lock"
                iconBackground={themeColors.profileTintPurple}
                iconColor={themeColors.profileIconPurple}
                onPress={onChangePassword}
            />
            <ActionCard
                title="Edit Preferences"
                description="Update your style, body, color season and outfit preferences."
                icon="tune-variant"
                iconBackground={themeColors.profileTintBeige}
                iconColor={themeColors.profileIconOrange}
                onPress={onPreferences}
            />
            <ActionCard
                title="Reviews"
                description="See your past AI outfit reviews and color analysis results."
                icon="star-outline"
                iconBackground={themeColors.profileTintGold}
                iconColor={themeColors.profileIconGold}
                onPress={onReview}
            />
            <ActionCard
                title="Logout"
                description="Sign out of your account on this device."
                icon="logout-variant"
                iconBackground={themeColors.profileTintBlue}
                iconColor={themeColors.profileIconBlue}
                onPress={onLogout}
            />
            <ActionCard
                title="Delete Account"
                description="Permanently delete your account and all your data."
                icon="trash-can-outline"
                iconBackground={themeColors.profileTintRed}
                iconColor={themeColors.profileIconRed}
                onPress={onDelete}
            />
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
        rowGap: 14,
    },

    actionCardContainer: {
        minHeight: 108,
        borderRadius: 16,
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
    },

    actionCard: {
        flex: 1,
        minHeight: 108,
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 16,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },

    desktopActionCard: {
        width: "32%",
    },

    tabletActionCard: {
        width: "48%",
    },

    phoneActionCard: {
        width: "100%",
    },

    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    cardText: {
        flex: 1,
        minWidth: 0,
    },

    actionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 5,
        fontFamily: "Cormorant Garamond",
    },

    actionDescription: {
        fontSize: 12,
        lineHeight: 17,
    },
});
