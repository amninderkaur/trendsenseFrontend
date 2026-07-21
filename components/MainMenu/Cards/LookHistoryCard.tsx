import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

export default function LookHistoryCard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const goToHistory = () => {
    router.push("/(tabs)/history" as any);
  };

  return (
    <TouchableOpacity activeOpacity={0.88} style={[s.card, isMobile && s.cardMobile]} onPress={goToHistory}>
      <View style={[s.content, isMobile && s.contentMobile]}>
        <View style={s.textContent}>
          <Text style={[s.eyebrow, isMobile && s.eyebrowMobile]}>STYLE JOURNEY</Text>

          <Text style={[s.title, isMobile && s.titleMobile]}>Look History</Text>

          <Text style={[s.subtitle, isMobile && s.subtitleMobile]}>
            Browse your previous outfits and see how your style has evolved.
          </Text>
        </View>

        <View style={s.button}>
          <Text style={[s.buttonText, isMobile && s.buttonTextMobile]}>View history</Text>
          <Text style={s.buttonArrow}>→</Text>
        </View>
      </View>

      <View pointerEvents="none" style={s.decoration}>
        <View style={s.largeCircle} />
        <View style={s.smallCircle} />

        <View style={s.clockCircle}>
          <Text style={s.clock}>◴</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 236,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#24322D",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 5,
  },

  cardMobile: { minHeight: 290 },

  content: {
    width: "70%",
    minHeight: 236,
    paddingHorizontal: 26,
    paddingVertical: 24,
    justifyContent: "space-between",
    zIndex: 3,
  },

  contentMobile: { minHeight: 290 },

  textContent: {
    flexShrink: 1,
    paddingBottom: 58,
  },

  eyebrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  eyebrowMobile: { fontSize: 12 },

  title: {
    color: "#FFFFFF",
    fontFamily: "Cormorant Garamond",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
    marginBottom: 8,
  },

  titleMobile: { fontSize: 36, lineHeight: 40 },

  subtitle: {
    maxWidth: 220,
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },

  subtitleMobile: { fontSize: 17, lineHeight: 23 },

  button: {
    position: "absolute",
    left: 26,
    bottom: 24,
    minWidth: 132,
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    zIndex: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  buttonTextMobile: { fontSize: 16 },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 18,
  },

  decoration: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "38%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  largeCircle: {
    position: "absolute",
    width: 155,
    height: 155,
    borderRadius: 77.5,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  smallCircle: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.04)",
    right: 10,
    bottom: 14,
  },

  clockCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.09)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  clock: {
    fontSize: 36,
    color: "#FFFFFF",
  },
});
