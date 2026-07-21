import { useAppTheme } from "@/context/ThemeContext";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
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
  const isMobile = width < 600;

  return (
    <View
      style={[
        s.card,
        isCompact && s.cardCompact,
        isMobile && s.cardMobile,
        style,
        {
          backgroundColor: themeColors.card,
          shadowColor: themeColors.shadow,
        },
      ]}
    >
      {isMobile && (
        <LinearGradient
          pointerEvents="none"
          colors={[
            themeColors.card,
            themeColors.card,
            `${themeColors.card}00`,
          ]}
          locations={[0, 0.58, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.mobileTextFade}
        />
      )}

      <View
        style={[
          s.textWrap,
          isCompact && s.textWrapCompact,
          isMobile && s.textWrapMobile,
        ]}
      >
        <Text
          style={[
            s.welcome,
            isMobile && s.welcomeMobile,
            { color: themeColors.text },
          ]}
        >
          Welcome back,
        </Text>

        <Text
          style={[
            s.name,
            isMobile && s.nameMobile,
            { color: themeColors.text },
          ]}
        >
          {userName}!{" "}
          <Text style={[s.heart, { color: themeColors.welcomeHeart }]}>♡</Text>
        </Text>

        <Text
          style={[
            s.subText,
            isMobile && s.subTextMobile,
            { color: themeColors.text },
          ]}
        >
          Let&apos;s create your best{"\n"}look today.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            s.button,
            isMobile && s.buttonMobile,
            { backgroundColor: themeColors.welcomeButton },
          ]}
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

      <View
        style={[
          s.decorationWrap,
          isCompact && s.decorationWrapCompact,
          isMobile && s.decorationWrapMobile,
        ]}
      >
        <Image
          source={clothingRackDecoration}
          style={[s.decoration, isCompact && s.decorationCompact]}
          contentFit="cover"
          contentPosition="right center"
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

  cardMobile: {
    minHeight: 280,
    borderRadius: 26,
  },

  mobileTextFade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "76%",
    zIndex: 3,
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

  textWrapMobile: {
    width: "68%",
    paddingLeft: 22,
    paddingRight: 8,
    paddingTop: 24,
    paddingBottom: 24,
  },

  welcome: {
    fontSize: 27,
    fontWeight: "500",
    marginBottom: -2,
    fontFamily: "Cormorant Garamond",
  },

  welcomeMobile: {
    fontSize: 22,
    lineHeight: 27,
    marginBottom: 1,
  },

  name: {
    fontSize: 62,
    fontWeight: "700",
    lineHeight: 64,
    marginBottom: 16,
    fontFamily: "Cormorant Garamond",
  },

  nameMobile: {
    fontSize: 42,
    lineHeight: 47,
    marginBottom: 18,
  },

  subText: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
    fontWeight: "400",
  },

  subTextMobile: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
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

  buttonMobile: {
    width: 150,
    height: 42,
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

  decorationWrapMobile: {
    width: "82%",
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
