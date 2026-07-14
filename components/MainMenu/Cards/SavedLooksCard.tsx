import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SavedLooksCard() {
  const router = useRouter();

  const goToSavedLooks = () => {
    router.push("/(tabs)/saved-items" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={s.card}
      onPress={goToSavedLooks}
    >
      <View style={s.content}>
        <View style={s.textContent}>
          <Text style={s.eyebrow}>YOUR FAVOURITES</Text>

          <Text style={s.title}>Saved Looks</Text>

          <Text style={s.subtitle}>
            Revisit the outfits and pieces you've saved for inspiration.
          </Text>
        </View>

        <View style={s.button}>
          <Text style={s.buttonText}>View saved</Text>
          <Text style={s.buttonArrow}>→</Text>
        </View>
      </View>

      <View pointerEvents="none" style={s.decoration}>
        <View style={s.largeCircle} />
        <View style={s.smallCircle} />

        <View style={s.heartCircle}>
          <Text style={s.heart}>♡</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 220,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F1D9D4",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  content: {
    width: "70%",
    minHeight: 220,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "space-between",
    zIndex: 3,
  },

  textContent: {
    flexShrink: 1,
  },

  eyebrow: {
    color: "#8B6D68",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  title: {
    color: "#1D3225",
    fontFamily: "Cormorant Garamond",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    maxWidth: 220,
    color: "#665853",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },

  button: {
    alignSelf: "flex-start",
    minWidth: 130,
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: "rgba(169,94,88,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    zIndex: 4,
  },

  buttonText: {
    color: "#1D3225",
    fontSize: 13,
    fontWeight: "700",
  },

  buttonArrow: {
    color: "#1D3225",
    fontSize: 17,
    lineHeight: 18,
  },

  decoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "38%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  largeCircle: {
    position: "absolute",
    width: 145,
    height: 145,
    borderRadius: 72.5,
    backgroundColor: "rgba(255,255,255,0.32)",
  },

  smallCircle: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(130,76,70,0.10)",
    right: 10,
    bottom: 14,
  },

  heartCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#A95E58",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  heart: {
    color: "#FFFFFF",
    fontSize: 40,
    lineHeight: 42,
  },
});
