import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const bodyOutline = require("@/assets/svg/Body-Outline.svg");

export default function BodyAnalysisCard() {
  const { themeColors } = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 760;
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const eyebrowSize = isWide ? 10 : 9;
  const titleSize = isWide ? 36 : isMedium ? 32 : 30;
  const subtitleSize = isWide ? 15 : isMedium ? 14 : 13;

  const goToBodyAnalysis = () => {
    router.push("/(tabs)/body-analysis" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={goToBodyAnalysis}
      style={[
        s.card,
        isCompact && s.cardCompact,
        {
          backgroundColor: themeColors.bodyCardBg,
          shadowColor: themeColors.shadow,
        },
      ]}
    >
      <View style={[s.content, isCompact && s.contentCompact]}>
        <Text
          style={[
            s.eyebrow,
            { color: themeColors.bodyCardDecoration, fontSize: eyebrowSize },
          ]}
        >
          BODY ANALYSIS
        </Text>

        <Text
          style={[
            s.title,
            {
              color: themeColors.text,
              fontSize: titleSize,
              lineHeight: titleSize + 4,
            },
          ]}
        >
          Body Analysis
        </Text>

        <Text
          style={[
            s.subtitle,
            {
              color: themeColors.bodyCardSubtext,
              fontSize: subtitleSize,
              lineHeight: subtitleSize + 6,
            },
          ]}
        >
          Find your shape &amp; style
        </Text>

        <View
          style={[
            s.button,
            isCompact && s.buttonCompact,
            { backgroundColor: themeColors.bodyCardButton },
          ]}
        >
          <Text style={[s.buttonText, { color: themeColors.text }]}>Start analysis</Text>
          <Text style={[s.buttonArrow, { color: themeColors.text }]}>→</Text>
        </View>
      </View>

      <View
        pointerEvents="none"
        style={[s.decoration, isCompact && s.decorationCompact]}
      >
        <Text style={[s.sparkleLeft, { color: themeColors.bodyCardDecoration }]}>✦</Text>
        <Image
          source={bodyOutline}
          resizeMode="contain"
          style={[s.figure, { tintColor: themeColors.bodyOutline }]}
        />
        <Text style={[s.sparkleRight, { color: themeColors.bodyCardDecoration }]}>✦</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 260,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  cardCompact: {
    minHeight: 220,
  },

  content: {
    width: "57%",
    minHeight: 260,
    paddingLeft: 30,
    paddingVertical: 28,
    zIndex: 3,
  },

  contentCompact: {
    minHeight: 220,
    paddingLeft: 22,
    paddingVertical: 22,
  },

  eyebrow: {
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  title: {
    fontFamily: "Cormorant Garamond",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    maxWidth: 220,
    fontSize: 13,
    lineHeight: 19,
  },

  button: {
    position: "absolute",
    left: 30,
    bottom: 28,
    minWidth: 150,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonCompact: {
    left: 22,
    bottom: 22,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  buttonArrow: {
    fontSize: 17,
    lineHeight: 18,
  },

  decoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "43%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  decorationCompact: {
    width: "40%",
  },

  sparkleLeft: {
    position: "absolute",
    left: -2,
    top: "24%",
    fontSize: 25,
  },

  sparkleRight: {
    position: "absolute",
    right: 6,
    bottom: "20%",
    fontSize: 34,
  },

  figure: {
    width: "90%",
    height: "100%",
    opacity: 0.88,
  },
});
