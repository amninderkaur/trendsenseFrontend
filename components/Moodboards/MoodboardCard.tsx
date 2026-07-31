/*
 * Moodboard Card
 * Small preview card used on the main moodboards page.
 * Displays:
 * - moodboard name
 * - short description
 * - up to 4 preview images
 */

// ================
//     IMPORTS
// ================

import type { Moodboard } from "@/app/(tabs)/moodboards";
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

// ================
//     TYPES
// ================

type Props = {
    moodboard: Moodboard;
    onPress: () => void;
};

// ================
//  MOODBOARD CARD COMPONENT
// ================

export default function MoodboardCard({
    moodboard,
    onPress,
}: Props) {
    const { width } = useWindowDimensions();
    const { themeColors } = useAppTheme();
    const isLargeScreen = width >= 768;

    // Only display the first 4 images on the preview card
    const previewImages = moodboard.images.slice(0, 4);

    // ================
    //     RENDER
    // ================

    return (
        <TouchableOpacity
            style={[
                globalStyles.card,
                styles.card,
                isLargeScreen && styles.largeCard,
                { backgroundColor: themeColors.card },
            ]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View
                style={[
                    styles.imageGrid,
                    { backgroundColor: themeColors.input },
                ]}
            >
                {previewImages.length > 0 ? (
                    previewImages.map((image, index) => (
                        <Image
                            key={`${image}-${index}`}
                            source={{ uri: image }}
                            style={styles.previewImage}
                        />
                    ))
                ) : (
                    <View style={styles.emptyPreview}>
                        <MaterialIcons
                            name="photo-library"
                            size={34}
                            color={themeColors.blueDark}
                        />

                        <Text
                            style={[
                                styles.emptyPreviewText,
                                { color: themeColors.muted },
                            ]}
                        >
                            No Images Yet
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text
                    style={[
                        styles.title,
                        { color: themeColors.text },
                    ]}
                    numberOfLines={1}
                >
                    {moodboard.name}
                </Text>

                <Text
                    style={[
                        styles.description,
                        { color: themeColors.muted },
                    ]}
                    numberOfLines={2}
                >
                    {moodboard.description}
                </Text>

                <View style={styles.footer}>
                    <View
                        style={[
                            styles.imageCountBadge,
                            { backgroundColor: themeColors.blueDark },
                        ]}
                    >
                        <MaterialIcons
                            name="collections"
                            size={16}
                            color={themeColors.white}
                        />

                        <Text
                            style={[
                                styles.imageCountText,
                                { color: themeColors.white },
                            ]}
                        >
                            {moodboard.images.length}/12
                        </Text>
                    </View>

                    <MaterialIcons
                        name="arrow-forward-ios"
                        size={16}
                        color={themeColors.muted}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
    card: {
        width: "100%",
        borderRadius: 24,
        overflow: "hidden",
        padding: 0,
    },

    largeCard: {
        width: "48%",
    },

    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: 180,
    },

    previewImage: {
        width: "50%",
        aspectRatio: 1,
    },

    emptyPreview: {
        flex: 1,
        minHeight: 180,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    emptyPreviewText: {
        fontWeight: "700",
        fontSize: 15,
    },

    content: {
        padding: 18,
        gap: 10,
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
    },

    description: {
        fontSize: 14,
        lineHeight: 21,
    },

    footer: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    imageCountBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
    },

    imageCountText: {
        fontWeight: "700",
        fontSize: 13,
    },
});