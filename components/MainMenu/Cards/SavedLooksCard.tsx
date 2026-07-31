import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

export default function SavedLooksCard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const eyebrowSize = isMobile ? 12 : isWide ? 10 : isMedium ? 9 : 9;
  const titleSize = isMobile ? 36 : isWide ? 36 : isMedium ? 32 : 30;
  const subtitleSize = isMobile ? 17 : isWide ? 15 : isMedium ? 14 : 13;
  const buttonTextSize = isMobile ? 16 : isWide ? 14 : 13;

  const goToSavedLooks = () => {
    router.push("/(tabs)/saved-items" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[s.card, isMobile && s.cardMobile]}
      onPress={goToSavedLooks}
    >
      <View style={[s.content, isMobile && s.contentMobile]}>
        <View style={s.textContent}>
          <Text style={[s.eyebrow, { fontSize: eyebrowSize }]}>YOUR FAVOURITES</Text>

          <Text style={[s.title, { fontSize: titleSize, lineHeight: titleSize + 4 }]}>Saved Looks</Text>

          <Text style={[s.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize + 6 }]}> 
            Revisit the outfits and pieces you&apos;ve saved for inspiration.
          </Text>
        </View>

        <View style={s.button}>
          <Text style={[s.buttonText, { fontSize: buttonTextSize }]}>View saved</Text>
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
    minHeight: 236,
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

  cardMobile: { minHeight: 290 },

  content: {
    width: "70%",
    minHeight: 236,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "space-between",
    zIndex: 3,
  },

  contentMobile: { minHeight: 290 },

  textContent: {
    flex: 1,
    flexShrink: 1,
    paddingBottom: 58,
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
    position: "absolute",
    left: 24,
    bottom: 24,
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
