import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ColourSeasonCard() {
  const router = useRouter();

  // TODO: Replace with actual user data
  const hasColourSeason = false;

  const season = "Light Spring";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        s.card,
        {
          backgroundColor: hasColourSeason
            ? "#F7E5C9"
            : "#E7DCEF",
        },
      ]}
      onPress={() => router.push("/(tabs)/colour-analysis" as any)}
    >
      <View style={s.content}>
        <Text style={s.eyebrow}>
          PERSONAL COLOUR
        </Text>

        <Text style={s.title}>
          {hasColourSeason
            ? season
            : "Colour Season"}
        </Text>

        <Text style={s.subtitle}>
          {hasColourSeason
            ? "View your palette and best colours."
            : "Discover the colours that suit you best."}
        </Text>

        <View style={s.button}>
          <Text style={s.buttonText}>
            {hasColourSeason
              ? "View palette"
              : "Start analysis"}
          </Text>

          <Text style={s.buttonArrow}>→</Text>
        </View>
      </View>

      {/* Thumbnail placeholder */}
      <View style={s.thumbnail}>
        <View
          style={[
            s.circle,
            {
              backgroundColor: hasColourSeason
                ? "#F4D59E"
                : "#CDBDDD",
            },
          ]}
        />

        <Text style={s.icon}>
          {hasColourSeason ? "✿" : "◈"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 210,
    borderRadius: 28,
    overflow: "hidden",
    padding: 26,

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
    flex: 1,
    justifyContent: "space-between",
    zIndex: 2,
  },

  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
    color: "#677268",
    marginBottom: 8,
  },

  title: {
    fontFamily: "Cormorant Garamond",
    fontSize: 30,
    fontWeight: "600",
    color: "#1D3225",
    marginBottom: 8,
  },

  subtitle: {
    color: "#56645A",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },

  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D3225",
  },

  buttonArrow: {
    fontSize: 18,
    color: "#1D3225",
  },

  thumbnail: {
    position: "absolute",
    right: 18,
    bottom: 18,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  icon: {
    fontSize: 34,
    color: "#1D3225",
  },
});