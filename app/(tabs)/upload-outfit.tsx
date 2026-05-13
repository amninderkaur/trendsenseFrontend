import { getToken } from "@/utils/token";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BASE_URL as API_BASE_URL } from "@/api/axios";

type SelectedItem = {
  itemId: string;
  type: string;
  color: string;
  imageBase64: string;
};

type OutfitSuggestionResponse = {
  selectedItems: SelectedItem[];
  reasoning: string;
  weatherSummary: string;
};

export default function OutfitSuggestionScreen() {
  const [occasion, setOccasion] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutfitSuggestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (!occasion.trim() || !city.trim()) {
      setError("Please enter both occasion and city.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const token = await getToken();
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const response = await fetch(`${API_BASE_URL}/api/outfit/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ occasion: occasion.trim(), city: city.trim() }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Error ${response.status}`);
      }

      const data: OutfitSuggestionResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Outfit Suggestion</Text>
      <Text style={styles.subtitle}>
        Tell us your occasion and location — we'll pick the best outfit from
        your wardrobe based on the weather.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Occasion</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. casual, work, gym, date night"
          placeholderTextColor="#96b7bc"
          value={occasion}
          onChangeText={setOccasion}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Toronto"
          placeholderTextColor="#96b7bc"
          value={city}
          onChangeText={setCity}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSuggest}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#233443" />
        ) : (
          <Text style={styles.buttonText}>Suggest Outfit</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && (
        <View style={styles.resultContainer}>
          {result.weatherSummary && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Weather</Text>
              <Text style={styles.infoValue}>{result.weatherSummary}</Text>
            </View>
          )}

          {result.reasoning && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Why this outfit?</Text>
              <Text style={styles.infoValue}>{result.reasoning}</Text>
            </View>
          )}

          {result.selectedItems && result.selectedItems.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Your Outfit</Text>
              <View style={styles.itemsGrid}>
                {result.selectedItems.map((item) => (
                  <View key={item.itemId} style={styles.itemCard}>
                    <Image
                      source={{ uri: `data:image/png;base64,${item.imageBase64}` }}
                      style={styles.itemImage}
                    />
                    <Text style={styles.itemType}>{item.type}</Text>
                    <Text style={styles.itemColor}>{item.color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
    backgroundColor: "#eeede8",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#233443",
  },
  subtitle: {
    fontSize: 14,
    color: "#96b7bc",
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#233443",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#233443",
    borderWidth: 1,
    borderColor: "#a3bfa9",
  },
  button: {
    backgroundColor: "#b9d6da",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#233443",
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    color: "#d0685f",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  resultContainer: {
    gap: 16,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "#c0d1bf",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#a3bfa9",
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#233443",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: "#233443",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#233443",
    marginBottom: 12,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  itemCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#a3bfa9",
    alignItems: "center",
    gap: 6,
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    resizeMode: "cover",
  },
  itemType: {
    fontSize: 13,
    fontWeight: "600",
    color: "#233443",
    textTransform: "capitalize",
  },
  itemColor: {
    fontSize: 12,
    color: "#96b7bc",
    textTransform: "capitalize",
  },
});
