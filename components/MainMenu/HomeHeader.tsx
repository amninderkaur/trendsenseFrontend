import { useAppTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderSvg from "./HeaderSvg";

type Props = {
  avatarUri: string | null;
  userName?: string;
  showProfileAction?: boolean;
};

export default function HomeHeader({
  avatarUri,
  userName = "there",
  showProfileAction = true,
}: Props) {
  const router = useRouter();
  const { themeColors, isDarkMode } = useAppTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [svgKey, setSvgKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setSvgKey((prev) => prev + 1);
    }, []),
  );

  const isWeb = Platform.OS === "web";
  const useMobileHeader = !isWeb || width < 768;
  const isSmallWeb = width < 900;
  const isMediumWeb = width < 1200;

  const headerHeight = isSmallWeb ? 145 : 165;
  const horizontalPadding = isSmallWeb ? 22 : isMediumWeb ? 32 : 40;
  const titleSize = isSmallWeb ? 29 : isMediumWeb ? 34 : 42;
  const taglineSize = isSmallWeb ? 11 : isMediumWeb ? 13 : 15;
  const avatarSize = isSmallWeb ? 54 : isMediumWeb ? 66 : 76;
  const profileTextSize = isSmallWeb ? 14 : isMediumWeb ? 17 : 20;
  const viewProfileSize = isSmallWeb ? 11 : isMediumWeb ? 12 : 14;
  const letterSpacing = isSmallWeb ? 2 : isMediumWeb ? 3.5 : 5;

  if (useMobileHeader) {
    return (
      <LinearGradient
        colors={[
          themeColors.headerGradientStart,
          themeColors.headerGradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.mobileHeader, { paddingTop: 22 + insets.top }]}
      >
        <View>
          <Text style={[s.mobileAppName, { color: themeColors.headerText }]}>
            TRENDSENSE
          </Text>
          <Text style={[s.mobileTagline, { color: themeColors.headerSubtext }]}>
            dress for the life you want
          </Text>
        </View>

        {showProfileAction && (
          <TouchableOpacity
            style={[
              s.mobileAvatarBtn,
              {
                backgroundColor: themeColors.headerAvatarBg,
                borderColor: themeColors.headerBorder,
              },
            ]}
            onPress={() => router.push("/(tabs)/profile" as any)}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatarImage} />
            ) : (
              <Text style={{ color: themeColors.headerText }}>👤</Text>
            )}
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  }

  return (
    <View style={[s.webHeader, { height: headerHeight }]}>
      <View style={[s.svgWrap, { height: headerHeight }]} pointerEvents="none">
        <HeaderSvg
          key={`header-svg-${svgKey}-${isDarkMode}`}
          gradientStart={themeColors.headerGradientStart}
          gradientEnd={themeColors.headerGradientEnd}
          cornerStart={themeColors.headerCornerStart}
          cornerEnd={themeColors.headerCornerEnd}
          showLeaves={!isDarkMode}
          width="100%"
          height="100%"
        />
      </View>

      <View style={[s.webHeaderRow, { paddingHorizontal: horizontalPadding }]}>
        <View style={s.titleBlock}>
          <Text
            style={[
              s.webAppName,
              {
                color: themeColors.headerText,
                fontSize: titleSize,
                letterSpacing,
              },
            ]}
          >
            TRENDSENSE
          </Text>

          <Text
            style={[
              s.webTagline,
              {
                color: themeColors.headerDarkSubtext,
                fontSize: taglineSize,
              },
            ]}
          >
            dress for the life you want
          </Text>
        </View>

        {showProfileAction && (
          <TouchableOpacity
            style={[s.profileBlock, { gap: isSmallWeb ? 8 : 12 }]}
            onPress={() => router.push("/(tabs)/profile" as any)}
            activeOpacity={0.85}
          >
            <View
              style={[
                s.webAvatarBtn,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                  backgroundColor: themeColors.headerAvatarBg,
                  borderColor: themeColors.headerBorder,
                },
              ]}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={s.avatarImage} />
              ) : (
                <Text style={{ color: themeColors.headerText }}>👤</Text>
              )}
            </View>

            {!isSmallWeb && (
              <View>
                <Text
                  style={[
                    s.greeting,
                    {
                      color: themeColors.headerText,
                      fontSize: profileTextSize,
                    },
                  ]}
                >
                  Hi, {userName}
                </Text>

                <Text
                  style={[
                    s.viewProfile,
                    {
                      color: themeColors.headerGold,
                      fontSize: viewProfileSize,
                    },
                  ]}
                >
                  View Profile →
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  avatarImage: {
    width: "100%",
    height: "100%",
  },

  mobileHeader: {
    minHeight: 124,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  mobileAppName: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 3,
  },

  mobileTagline: {
    fontSize: 19,
    lineHeight: 21,
    letterSpacing: 0.8,
    marginTop: 5,
    fontStyle: "italic",
  },

  mobileAvatarBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  webHeader: {
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
    zIndex: 10,
  },

  svgWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 1,
  },

  headerSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },

  webHeaderRow: {
    height: "100%",
    zIndex: 5,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleBlock: {
    flexShrink: 1,
  },

  webAppName: {
    fontWeight: "700",
    fontFamily: "Cormorant Garamond",
  },

  webTagline: {
    letterSpacing: 1.4,
    marginTop: 4,
    fontStyle: "italic",
    fontWeight: "500",
    fontFamily: "Cormorant Garamond",
  },

  profileBlock: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },

  webAvatarBtn: {
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  greeting: {
    fontWeight: "700",
  },

  viewProfile: {
    fontWeight: "700",
    marginTop: 4,
  },
});
