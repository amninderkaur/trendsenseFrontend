import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

type WardrobeItem = {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
};

export default function ClothingDetails() {
  const { clothingId } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(false); // temporary
    };

    loadItem();
  }, [clothingId]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : !item ? (
        <Text style={styles.errorText}>Item not found.</Text>
      ) : (
        <>
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagContainer}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeede8", 
    padding: 20,
  },

  loadingText: {
    fontSize: 16,
    color: "#96b7bc",
    textAlign: "center",
    marginTop: 40,
  },

  itemName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#233443", 
    marginBottom: 12,
    textAlign: "center",
  },

  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 18,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#a3bfa9", 
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#233443",
    marginTop: 20,
    marginBottom: 8,
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },

  tag: {
    backgroundColor: "#b9d6da", 
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  tagText: {
    fontSize: 13,
    color: "#233443",
    fontWeight: "600",
  },

  errorText: {
    color: "#d0685f",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  backButton: { alignSelf: "flex-start", backgroundColor: "#c0d1bf", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, marginBottom: 16 },
  backButtonText: { color: "#233443", fontWeight: "600", fontSize: 14 },
});
