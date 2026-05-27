import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAppTheme } from "@/context/ThemeContext";
import api from "../../api/axios";
import { getToken } from "../../utils/token";

type PackingCategories = {
    tops: string[];
    bottoms: string[];
    outerwear: string[];
    shoes: string[];
    accessories: string[];
    extras: string[];
};

type PackingResult = {
    destination: string;
    weatherSummary: string;
    packingList: PackingCategories;
    tips: string;
};

const CATEGORIES: { key: keyof PackingCategories; label: string }[] = [
    { key: "tops", label: "Tops" },
    { key: "bottoms", label: "Bottoms" },
    { key: "outerwear", label: "Outerwear" },
    { key: "shoes", label: "Shoes" },
    { key: "accessories", label: "Accessories" },
    { key: "extras", label: "Extras" },
];

export default function TripPacking() {
    const router = useRouter();
    const { themeColors } = useAppTheme();
    const [destination, setDestination] = React.useState("");
    const [days, setDays] = React.useState("");
    const [season, setSeason] = React.useState("");
    const [activity, setActivity] = React.useState("");
    const [lightPack, setLightPack] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [result, setResult] = React.useState<PackingResult | null>(null);

    const submit = async () => {
        if (!destination.trim() || !days.trim()) {
            setError("Please enter a destination and number of days.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const activities = activity
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean);

            const res = await api.post<PackingResult>(
                "/api/packing/suggest",
                {
                    destination: destination.trim(),
                    tripLengthDays: Number(days),
                    activities,
                    season: season.trim() || "auto",
                    lightPack,
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            setResult(res.data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to generate packing list."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
    <ScrollView
        style={[
            styles.container,
            { backgroundColor: themeColors.bg },
        ]}
        contentContainerStyle={styles.content}
    >
        <Pressable
            style={[
                styles.backButton,
                { backgroundColor: themeColors.bgDark },
            ]}
            onPress={() => router.back()}
        >
            <Text
                style={[
                    styles.backText,
                    { color: themeColors.white },
                ]}
            >
                ← Back
            </Text>
        </Pressable>

        <Text
            style={[
                styles.title,
                { color: themeColors.text },
            ]}
        >
            Trip Packing Assistant
        </Text>

        <Text
            style={[
                styles.subtitle,
                { color: themeColors.muted },
            ]}
        >
            Get smart packing suggestions based on location, weather and trip type.
        </Text>

        <View
            style={[
                styles.card,
                { backgroundColor: themeColors.card },
            ]}
        >
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: themeColors.white,
                        borderColor: themeColors.input,
                        color: themeColors.text,
                    },
                ]}
                placeholder="Destination (e.g. Paris, France)"
                placeholderTextColor={themeColors.muted}
                value={destination}
                onChangeText={setDestination}
            />

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: themeColors.white,
                        borderColor: themeColors.input,
                        color: themeColors.text,
                    },
                ]}
                placeholder="Number of days"
                placeholderTextColor={themeColors.muted}
                keyboardType="numeric"
                value={days}
                onChangeText={setDays}
            />

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: themeColors.white,
                        borderColor: themeColors.input,
                        color: themeColors.text,
                    },
                ]}
                placeholder="Season (e.g. summer, winter, auto)"
                placeholderTextColor={themeColors.muted}
                value={season}
                onChangeText={setSeason}
            />

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: themeColors.white,
                        borderColor: themeColors.input,
                        color: themeColors.text,
                    },
                ]}
                placeholder="Activities (e.g. casual, business, hiking)"
                placeholderTextColor={themeColors.muted}
                value={activity}
                onChangeText={setActivity}
            />

            <View style={styles.switchRow}>
                <Text
                    style={[
                        styles.switchText,
                        { color: themeColors.text },
                    ]}
                >
                    Light packing mode
                </Text>

                <Switch
                    value={lightPack}
                    onValueChange={setLightPack}
                />
            </View>

            {error ? (
                <Text
                    style={[
                        styles.error,
                        { color: themeColors.accent },
                    ]}
                >
                    {error}
                </Text>
            ) : null}

            <Pressable
                style={[
                    styles.button,
                    { backgroundColor: themeColors.blueDark },
                ]}
                onPress={submit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={themeColors.white} />
                ) : (
                    <Text
                        style={[
                            styles.buttonText,
                            { color: themeColors.white },
                        ]}
                    >
                        Generate Packing List
                    </Text>
                )}
            </Pressable>
        </View>

        {result && (
            <View
                style={[
                    styles.resultCard,
                    { backgroundColor: themeColors.card },
                ]}
            >
                <Text
                    style={[
                        styles.resultTitle,
                        { color: themeColors.text },
                    ]}
                >
                    Packing List for {result.destination}
                </Text>

                {result.weatherSummary ? (
                    <View
                        style={[
                            styles.weatherBox,
                            { backgroundColor: themeColors.white },
                        ]}
                    >
                        <Text
                            style={[
                                styles.sectionLabel,
                                { color: themeColors.blueDark },
                            ]}
                        >
                            Weather
                        </Text>

                        <Text
                            style={[
                                styles.weatherText,
                                { color: themeColors.text },
                            ]}
                        >
                            {result.weatherSummary}
                        </Text>
                    </View>
                ) : null}

                {CATEGORIES.map(({ key, label }) => {
                    const items = result.packingList?.[key];

                    if (!items || items.length === 0) return null;

                    return (
                        <View
                            key={key}
                            style={[
                                styles.categoryBlock,
                                { backgroundColor: themeColors.white },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryTitle,
                                    { color: themeColors.text },
                                ]}
                            >
                                {label}
                            </Text>

                            {items.map((item, i) => (
                                <View key={i} style={styles.itemRow}>
                                    <Text
                                        style={[
                                            styles.bullet,
                                            { color: themeColors.blueDark },
                                        ]}
                                    >
                                        •
                                    </Text>

                                    <Text
                                        style={[
                                            styles.itemText,
                                            { color: themeColors.muted },
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    );
                })}

                {result.tips ? (
                    <View
                        style={[
                            styles.tipsBox,
                            { backgroundColor: themeColors.white },
                        ]}
                    >
                        <Text
                            style={[
                                styles.sectionLabel,
                                { color: themeColors.blueDark },
                            ]}
                        >
                            Tips
                        </Text>

                        <Text
                            style={[
                                styles.tipsText,
                                { color: themeColors.text },
                            ]}
                        >
                            {result.tips}
                        </Text>
                    </View>
                ) : null}
            </View>
        )}
    </ScrollView>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        marginBottom: 12,
    },

    backText: {
        fontWeight: "700",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
    },

    subtitle: {
        marginTop: 6,
        marginBottom: 18,
    },

    card: {
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
    },

    input: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
    },

    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    switchText: {
        fontWeight: "700",
    },

    button: {
        padding: 14,
        borderRadius: 999,
        alignItems: "center",
        marginTop: 8,
    },

    buttonText: {
        fontWeight: "700",
    },

    error: {
        marginBottom: 10,
    },

    resultCard: {
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },

    resultTitle: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 4,
    },

    weatherBox: {
        borderRadius: 12,
        padding: 12,
    },

    sectionLabel: {
        fontWeight: "700",
        marginBottom: 4,
    },

    weatherText: {
        lineHeight: 20,
    },

    categoryBlock: {
        borderRadius: 12,
        padding: 12,
    },

    categoryTitle: {
        fontWeight: "800",
        fontSize: 15,
        marginBottom: 8,
    },

    itemRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
        gap: 6,
    },

    bullet: {
        fontWeight: "700",
        fontSize: 16,
        lineHeight: 20,
    },

    itemText: {
        flex: 1,
        lineHeight: 20,
    },

    tipsBox: {
        borderRadius: 12,
        padding: 12,
    },

    tipsText: {
        lineHeight: 20,
    },
});