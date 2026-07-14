import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import type { ViewStyle } from "react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const clothingRackDecoration = require("@/assets/svg/ClothingRackCardDec.svg");

type Props = {
  userName: string;
  style?: ViewStyle;
};

export default function WelcomeCard({ userName, style }: Props) {
  const { themeColors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[s.card, style, { backgroundColor: themeColors.card }]}>
      <View style={s.textWrap}>
        <Text style={s.welcome}>Welcome back,</Text>

        <Text style={s.name}>
          {userName}! <Text style={s.heart}>♡</Text>
        </Text>

        <Text style={s.subText}>Let's create your best{"\n"}look today.</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={s.button}
          onPress={() => router.push("/(tabs)/upload-outfit" as any)}
        >
          <Text style={s.buttonText}>Get Styled</Text>
          <Text style={s.buttonStar}>✦</Text>
        </TouchableOpacity>
      </View>

      <View style={s.decorationWrap}>
        <Image
          source={clothingRackDecoration}
          style={s.decoration}
          resizeMode="cover"
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  textWrap: {
    width: "45%",
    paddingLeft: 42,
    zIndex: 5,
  },

  welcome: {
    color: "#1D3225",
    fontSize: 27,
    fontWeight: "500",
    marginBottom: -2,
    fontFamily: "Cormorant Garamond",
  },

  name: {
    color: "#1D3225",
    fontSize: 62,
    fontWeight: "700",
    lineHeight: 64,
    marginBottom: 16,
    fontFamily: "Cormorant Garamond",
  },

  subText: {
    color: "#1D3225",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
    fontWeight: "400",
  },

  heart: {
    color: "#8CA997",
    fontSize: 44,
    fontWeight: "400",
  },

  button: {
    backgroundColor: "#19352C",
    width: 190,
    height: 44,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  buttonStar: {
    color: "#fff",
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

  decoration: {
    width: "100%",
    height: "100%",
  },
});
