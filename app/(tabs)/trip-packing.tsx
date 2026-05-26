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

import api from "../../api/axios";
import { colors } from "../../constants/globalStyles";
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>← Back</Text>
            </Pressable>

            <Text style={styles.title}>Trip Packing Assistant</Text>
            <Text style={styles.subtitle}>
                Get smart packing suggestions based on location, weather and trip type.
            </Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Destination (e.g. Paris, France)"
                    placeholderTextColor={colors.muted}
                    value={destination}
                    onChangeText={setDestination}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Number of days"
                    placeholderTextColor={colors.muted}
                    keyboardType="numeric"
                    value={days}
                    onChangeText={setDays}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Season (e.g. summer, winter, auto)"
                    placeholderTextColor={colors.muted}
                    value={season}
                    onChangeText={setSeason}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Activities (e.g. casual, business, hiking)"
                    placeholderTextColor={colors.muted}
                    value={activity}
                    onChangeText={setActivity}
                />

                <View style={styles.switchRow}>
                    <Text style={styles.switchText}>Light packing mode</Text>
                    <Switch value={lightPack} onValueChange={setLightPack} />
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable style={styles.button} onPress={submit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>Generate Packing List</Text>
                    )}
                </Pressable>
            </View>

            {result && (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>
                        Packing List for {result.destination}
                    </Text>

                    {result.weatherSummary ? (
                        <View style={styles.weatherBox}>
                            <Text style={styles.sectionLabel}>Weather</Text>
                            <Text style={styles.weatherText}>{result.weatherSummary}</Text>
                        </View>
                    ) : null}

                    {CATEGORIES.map(({ key, label }) => {
                        const items = result.packingList?.[key];
                        if (!items || items.length === 0) return null;
                        return (
                            <View key={key} style={styles.categoryBlock}>
                                <Text style={styles.categoryTitle}>{label}</Text>
                                {items.map((item, i) => (
                                    <View key={i} style={styles.itemRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.itemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}

                    {result.tips ? (
                        <View style={styles.tipsBox}>
                            <Text style={styles.sectionLabel}>Tips</Text>
                            <Text style={styles.tipsText}>{result.tips}</Text>
                        </View>
                    ) : null}
                </View>
            )}
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
        marginBottom: 12,
    },
    backText: { color: colors.white, fontWeight: "700" },

    title: { fontSize: 28, fontWeight: "800", color: colors.text },
    subtitle: { color: colors.muted, marginTop: 6, marginBottom: 18 },

    card: {
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
    },

    input: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.input,
        color: colors.text,
    },

    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    switchText: { fontWeight: "700", color: colors.text },

    button: {
        backgroundColor: colors.blueDark,
        padding: 14,
        borderRadius: 999,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: { color: colors.white, fontWeight: "700" },

    error: { color: "red", marginBottom: 10 },

    resultCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 4,
        color: colors.text,
    },

    weatherBox: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
    },
    sectionLabel: { fontWeight: "700", color: colors.blueDark, marginBottom: 4 },
    weatherText: { color: colors.text, lineHeight: 20 },

    categoryBlock: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
    },
    categoryTitle: {
        fontWeight: "800",
        fontSize: 15,
        color: colors.text,
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
        gap: 6,
    },
    bullet: { color: colors.blueDark, fontWeight: "700", fontSize: 16, lineHeight: 20 },
    itemText: { color: colors.muted, flex: 1, lineHeight: 20 },

    tipsBox: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
    },
    tipsText: { color: colors.text, lineHeight: 20 },
});
