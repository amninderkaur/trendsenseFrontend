import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

export default function OutfitReviewCard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const eyebrowSize = isMobile ? 12 : isWide ? 10 : isMedium ? 9 : 10;
  const titleSize = isMobile ? 40 : isWide ? 38 : isMedium ? 35 : 34;
  const subtitleSize = isMobile ? 17 : isWide ? 15 : isMedium ? 14 : 14;
  const buttonTextSize = isMobile ? 16 : isWide ? 15 : 14;

  const goToOutfitReview = () => {
    router.push("/(tabs)/outfit-review" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[s.card, isMobile && s.cardMobile]}
      onPress={goToOutfitReview}
    >
      <View style={s.content}>
        <View style={s.textWrap}>
          <Text style={[s.eyebrow, { fontSize: eyebrowSize }]}>AI OUTFIT REVIEW</Text>

          <Text style={[s.title, { fontSize: titleSize, lineHeight: titleSize + 4 }]}>Review Your Look</Text>

          <Text style={[s.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize + 6 }]}> 
            Get personalized feedback on the outfit you are wearing.
          </Text>

          <View style={s.button}>
            <Text style={[s.buttonText, { fontSize: buttonTextSize }]}>Review outfit</Text>
            <Text style={s.buttonIcon}>✦</Text>
          </View>
        </View>

        <View style={s.decoration}>
          <View style={s.largeCircle} />
          <View style={s.smallCircle} />

          <View style={s.sparkleWrap}>
            <Text style={s.sparkleLarge}>✦</Text>
            <Text style={s.sparkleSmall}>✧</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 276,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#DDE7DC",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  cardMobile: {
    minHeight: 310,
  },

  content: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  textWrap: {
    width: "70%",
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 58,
    zIndex: 3,
  },

  eyebrow: {
    color: "#718176",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.2,
    marginBottom: 10,
  },

  title: {
    color: "#1D3225",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "600",
    fontFamily: "Cormorant Garamond",
    marginBottom: 10,
  },

  subtitle: {
    color: "#526057",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },

  button: {
    position: "absolute",
    left: 24,
    bottom: 24,
    minWidth: 142,
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: "rgba(29,50,37,0.12)",
    borderWidth: 1,
    borderColor: "rgba(29,50,37,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  buttonText: {
    color: "#1D3225",
    fontSize: 13,
    fontWeight: "700",
  },

  buttonIcon: {
    color: "#1D3225",
    fontSize: 17,
  },

  decoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "42%",
    alignItems: "center",
    justifyContent: "center",
  },

  largeCircle: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,255,255,0.32)",
    right: -22,
    top: 16,
  },

  smallCircle: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(29,50,37,0.08)",
    right: 94,
    bottom: 18,
  },

  sparkleWrap: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: "#1D3225",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-6deg" }],
  },

  sparkleLarge: {
    color: "#FFFFFF",
    fontSize: 43,
    lineHeight: 46,
  },

  sparkleSmall: {
    position: "absolute",
    color: "#BFD1C2",
    fontSize: 20,
    right: 18,
    top: 17,
  },
});
