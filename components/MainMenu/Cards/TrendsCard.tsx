import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

export default function TrendsCard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const eyebrowSize = isWide ? 10 : isMedium ? 9 : 9;
  const titleSize = isWide ? 36 : isMedium ? 32 : 30;
  const subtitleSize = isWide ? 15 : isMedium ? 14 : 13;
  const buttonTextSize = isWide ? 14 : 13;

  const goToTrends = () => {
    router.push("/(tabs)/trends" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={s.card}
      onPress={goToTrends}
    >
      <View style={s.content}>
        <View style={s.textContent}>
          <Text style={[s.eyebrow, { fontSize: eyebrowSize }]}>STYLE DISCOVERY</Text>

          <Text style={[s.title, { fontSize: titleSize, lineHeight: titleSize + 4 }]}>Trends</Text>

          <Text style={[s.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize + 6 }]}> 
            Explore what is trending now and discover new inspiration for your
            wardrobe.
          </Text>
        </View>

        <View style={s.button}>
          <Text style={[s.buttonText, { fontSize: buttonTextSize }]}>Explore trends</Text>
          <Text style={s.buttonArrow}>→</Text>
        </View>
      </View>

      <View pointerEvents="none" style={s.decoration}>
        <View style={s.largeCircle} />
        <View style={s.smallCircle} />

        <View style={s.trendCircle}>
          <Text style={s.trendIcon}>↗</Text>
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
    backgroundColor: "#D4ECEB",

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
    flex: 1,
    flexShrink: 1,
    paddingBottom: 58,
  },

  eyebrow: {
    color: "#537674",
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
    maxWidth: 240,
    color: "#4F6663",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },

  button: {
    position: "absolute",
    left: 24,
    bottom: 24,
    minWidth: 140,
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: "rgba(45,101,96,0.12)",
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
    backgroundColor: "#A9D2CF",
    opacity: 0.58,
  },

  smallCircle: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.42)",
    right: 10,
    bottom: 14,
  },

  trendCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#4F8580",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  trendIcon: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "500",
  },
});