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

import { colors } from "../../constants/globalStyles";
import { getToken } from "../../utils/token";

type PackItem = {
  item: string;
  category: string;
  reason: string;
  weatherBased: string;
};

export default function TripPacking() {
  const router = useRouter();

  const [location, setLocation] = React.useState("Toronto, Canada");
  const [days, setDays] = React.useState("5");
  const [season, setSeason] = React.useState("auto");
  const [activity, setActivity] = React.useState("casual travel");
  const [lightPack, setLightPack] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState<PackItem[]>([]);

  const submit = async () => {
    setLoading(true);
    setError("");
    setResult([]);

    try {
      const token = getToken();

      const res = await fetch("YOUR_TRIP_PACKING_ENDPOINT_HERE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          days: Number(days),
          season,
          activity,
          lightPack,
        }),
      });

      const data = await res.json();

      setResult(data.items || []);
    } catch (err: any) {
      setError(err?.message || "Failed to generate packing list.");
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
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Number of days"
          keyboardType="numeric"
          value={days}
          onChangeText={setDays}
        />

        <TextInput
          style={styles.input}
          placeholder="Season (or leave auto)"
          value={season}
          onChangeText={setSeason}
        />

        <TextInput
          style={styles.input}
          placeholder="Trip type (casual, business, adventure)"
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

      {result.length > 0 && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Packing List</Text>

          {result.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.item}</Text>
              <Text style={styles.itemText}>Category: {item.category}</Text>
              <Text style={styles.itemText}>Reason: {item.reason}</Text>
              <Text style={styles.itemText}>
                Weather: {item.weatherBased}
              </Text>
            </View>
          ))}
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
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: colors.text,
  },

  itemCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginBottom: 10,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  itemText: {
    color: colors.muted,
    marginBottom: 2,
  },
});