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
  type StyleProp,
  type ViewStyle,
} from "react-native";

const clothingRackDecoration = require("@/assets/svg/ClothingRackCardDec.svg");

type Props = {
  userName: string;
  style?: StyleProp<ViewStyle>;
};

export default function WelcomeCard({ userName, style }: Props) {
  const { themeColors } = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 1180;

  return (
    <View
      style={[
        s.card,
        isCompact && s.cardCompact,
        style,
        {
          backgroundColor: themeColors.card,
          shadowColor: themeColors.shadow,
        },
      ]}
    >
      <View style={[s.textWrap, isCompact && s.textWrapCompact]}>
        <Text style={[s.welcome, { color: themeColors.text }]}>
          Welcome back,
        </Text>

        <Text style={[s.name, { color: themeColors.text }]}>
          {userName}!{" "}
          <Text style={[s.heart, { color: themeColors.welcomeHeart }]}>♡</Text>
        </Text>

        <Text style={[s.subText, { color: themeColors.text }]}>
          Let&apos;s create your best{"\n"}look today.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[s.button, { backgroundColor: themeColors.welcomeButton }]}
          onPress={() => router.push("/(tabs)/upload-outfit" as any)}
        >
          <Text
            style={[s.buttonText, { color: themeColors.welcomeButtonText }]}
          >
            Get Styled
          </Text>
          <Text
            style={[s.buttonStar, { color: themeColors.welcomeButtonText }]}
          >
            ✦
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[s.decorationWrap, isCompact && s.decorationWrapCompact]}>
        <Image
          source={clothingRackDecoration}
          style={[s.decoration, isCompact && s.decorationCompact]}
          resizeMode={isCompact ? "cover" : "cover"}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 32,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  cardCompact: {
    minHeight: 420,
    justifyContent: "center",
  },

  textWrap: {
    width: "45%",
    paddingLeft: 42,
    zIndex: 5,
  },

  textWrapCompact: {
    width: "52%",
    paddingLeft: 28,
    paddingRight: 12,
    paddingTop: 28,
    paddingBottom: 28,
  },

  welcome: {
    fontSize: 27,
    fontWeight: "500",
    marginBottom: -2,
    fontFamily: "Cormorant Garamond",
  },

  name: {
    fontSize: 62,
    fontWeight: "700",
    lineHeight: 64,
    marginBottom: 16,
    fontFamily: "Cormorant Garamond",
  },

  subText: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
    fontWeight: "400",
  },

  heart: {
    fontSize: 44,
    fontWeight: "400",
  },

  button: {
    width: 190,
    height: 44,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },

  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },

  buttonStar: {
    fontSize: 17,
  },

  decorationWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "74%",
    overflow: "hidden",
    zIndex: 1,
  },

  decorationWrapCompact: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "78%",
    overflow: "hidden",
    zIndex: 1,
  },

  decoration: {
    width: "100%",
    height: "100%",
  },

  decorationCompact: {
    width: "100%",
    height: "100%",
  },
});
