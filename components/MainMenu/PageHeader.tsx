import { useAppTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderSvg from "./HeaderSvg";

type Props = {
  onBack?: () => void;
  /** Pass negative margins to counteract the parent ScrollView's contentContainerStyle padding.
   *  e.g. style={{ marginHorizontal: -20, marginTop: -20 }} for padding:20 pages */
  style?: StyleProp<ViewStyle>;
};

export default function PageHeader({ onBack, style }: Props) {
  const router = useRouter();
  const { themeColors, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isSmallWeb = width < 900;
  const isMediumWeb = width < 1200;

  const headerHeight = isSmallWeb ? 145 : 165;
  const horizontalPadding = isSmallWeb ? 22 : isMediumWeb ? 32 : 40;
  const titleSize = isSmallWeb ? 26 : isMediumWeb ? 34 : 42;
  const taglineSize = isSmallWeb ? 11 : isMediumWeb ? 13 : 15;
  const letterSpacing = isSmallWeb ? 2 : isMediumWeb ? 3.5 : 5;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/mainMenu" as any);
    }
  };

  // ── Mobile ───────────────────────────────────────────────────
  if (!isWeb) {
    return (
      <View
        style={[
          s.mobileHeader,
          {
            backgroundColor: themeColors.headerBg,
            paddingTop: 30 + insets.top,
          },
          style,
        ]}
      >
        <View>
          <Text style={[s.mobileAppName, { color: themeColors.headerText }]}>
            TRENDSENSE
          </Text>
          <Text style={[s.mobileTagline, { color: themeColors.headerSubtext }]}>
            dress for the life you want
          </Text>
        </View>

        <TouchableOpacity
          style={[
            s.mobileBackBtn,
            {
              backgroundColor: themeColors.headerAvatarBg,
              borderColor: themeColors.headerBorder,
            },
          ]}
          onPress={handleBack}
          activeOpacity={0.75}
        >
          <Text style={[s.mobileBackArrow, { color: themeColors.headerText }]}>
            ←
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Web ──────────────────────────────────────────────────────
  return (
    <View style={[s.webHeader, { height: headerHeight }, style]}>
      <View style={[s.svgWrap, { height: headerHeight }]} pointerEvents="none">
        <HeaderSvg
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

        <TouchableOpacity
          style={[
            s.webBackBtn,
            {
              backgroundColor: themeColors.headerAvatarBg,
              borderColor: themeColors.headerBorder,
            },
          ]}
          onPress={handleBack}
          activeOpacity={0.75}
        >
          <Text style={[s.webBackArrow, { color: themeColors.headerText }]}>
            ←
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  // ── Mobile ──
  mobileHeader: {
    paddingHorizontal: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mobileAppName: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 3,
  },
  mobileTagline: {
    fontSize: 13,
    letterSpacing: 1,
    marginTop: 4,
    fontStyle: "italic",
  },
  mobileBackBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileBackArrow: {
    fontSize: 22,
    fontWeight: "700",
  },

  // ── Web ──
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
  webBackBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  webBackArrow: {
    fontSize: 22,
    fontWeight: "700",
  },
});
