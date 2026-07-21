import { getProfile } from "@/api/profile";
import { type ThemeColors, useAppTheme } from "@/context/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const defaultSeasonImage = require("@/assets/images/seasons/PaletteSwatches.png");

const SEASON_IMAGES: Record<SeasonKey, ImageSourcePropType> = {
  lightSpring: require("@/assets/images/seasons/Light-Spring.png"),
  trueSpring: require("@/assets/images/seasons/True-Spring.png"),
  brightSpring: require("@/assets/images/seasons/Bright-Spring.png"),
  lightSummer: require("@/assets/images/seasons/Light-Summer.png"),
  trueSummer: require("@/assets/images/seasons/True-Summer.png"),
  softSummer: require("@/assets/images/seasons/Soft-Summer.png"),
  softAutumn: require("@/assets/images/seasons/Soft-Autumn.png"),
  trueAutumn: require("@/assets/images/seasons/True-Autumn.png"),
  deepAutumn: require("@/assets/images/seasons/Deep-Autumn.png"),
  deepWinter: require("@/assets/images/seasons/Deep-Winter.png"),
  trueWinter: require("@/assets/images/seasons/True-Winter.png"),
  brightWinter: require("@/assets/images/seasons/Bright-Winter.png"),
};

export type SeasonKey =
  | "lightSpring"
  | "trueSpring"
  | "brightSpring"
  | "lightSummer"
  | "trueSummer"
  | "softSummer"
  | "softAutumn"
  | "trueAutumn"
  | "deepAutumn"
  | "deepWinter"
  | "trueWinter"
  | "brightWinter";

type SeasonDesign = {
  backgroundColor: keyof ThemeColors;
  accentColor: keyof ThemeColors;
  detailColor: keyof ThemeColors;
  buttonColor: keyof ThemeColors;
  displayName: string;
  description: string;
  traits: readonly [string, string, string];
};

const DEFAULT_DESIGN: SeasonDesign = {
  backgroundColor: "colourSeasonDefaultBg",
  accentColor: "colourSeasonDefaultAccent",
  detailColor: "colourSeasonDefaultDetail",
  buttonColor: "colourSeasonDefaultButton",
  displayName: "Colour Season",
  description: "Discover the colours that suit you best.",
  traits: ["Discover", "Define", "Glow"],
};

const SEASON_DESIGNS: Record<SeasonKey, SeasonDesign> = {
  lightSpring: {
    backgroundColor: "lightSpringBg",
    accentColor: "lightSpringAccent",
    detailColor: "lightSpringDetail",
    buttonColor: "lightSpringButton",
    displayName: "Light Spring",
    description:
      "You are warm, light and bright. These fresh, clear colours bring out your natural glow.",
    traits: ["Light", "Warm", "Bright"],
  },

  trueSpring: {
    backgroundColor: "trueSpringBg",
    accentColor: "trueSpringAccent",
    detailColor: "trueSpringDetail",
    buttonColor: "trueSpringButton",
    displayName: "True Spring",
    description:
      "You are warm, clear and lively. Fresh, sunlit colours reflect your natural energy.",
    traits: ["Warm", "Clear", "Lively"],
  },

  brightSpring: {
    backgroundColor: "brightSpringBg",
    accentColor: "brightSpringAccent",
    detailColor: "brightSpringDetail",
    buttonColor: "brightSpringButton",
    displayName: "Bright Spring",
    description:
      "You are bright, warm and clear. Vivid, playful colours make your features shine.",
    traits: ["Bright", "Warm", "Clear"],
  },

  lightSummer: {
    backgroundColor: "lightSummerBg",
    accentColor: "lightSummerAccent",
    detailColor: "lightSummerDetail",
    buttonColor: "lightSummerButton",
    displayName: "Light Summer",
    description:
      "You are cool, light and gentle. Airy pastels enhance your soft, delicate colouring.",
    traits: ["Light", "Cool", "Soft"],
  },

  trueSummer: {
    backgroundColor: "trueSummerBg",
    accentColor: "trueSummerAccent",
    detailColor: "trueSummerDetail",
    buttonColor: "trueSummerButton",
    displayName: "True Summer",
    description:
      "You are cool, calm and softly blended. Refined, blue-based shades bring harmony.",
    traits: ["Cool", "Soft", "Calm"],
  },

  softSummer: {
    backgroundColor: "softSummerBg",
    accentColor: "softSummerAccent",
    detailColor: "softSummerDetail",
    buttonColor: "softSummerButton",
    displayName: "Soft Summer",
    description:
      "You are soft, cool and muted. Smoky, blended colours complement your subtle beauty.",
    traits: ["Soft", "Cool", "Muted"],
  },

  softAutumn: {
    backgroundColor: "softAutumnBg",
    accentColor: "softAutumnAccent",
    detailColor: "softAutumnDetail",
    buttonColor: "softAutumnButton",
    displayName: "Soft Autumn",
    description:
      "You are soft, warm and muted. Gentle earth tones create an effortless natural glow.",
    traits: ["Soft", "Warm", "Muted"],
  },

  trueAutumn: {
    backgroundColor: "trueAutumnBg",
    accentColor: "trueAutumnAccent",
    detailColor: "trueAutumnDetail",
    buttonColor: "trueAutumnButton",
    displayName: "True Autumn",
    description:
      "You are warm, rich and earthy. Golden, spiced colours echo your natural warmth.",
    traits: ["Warm", "Rich", "Earthy"],
  },

  deepAutumn: {
    backgroundColor: "deepAutumnBg",
    accentColor: "deepAutumnAccent",
    detailColor: "deepAutumnDetail",
    buttonColor: "deepAutumnButton",
    displayName: "Deep Autumn",
    description:
      "You are deep, warm and rich. Dark earth tones and jewel shades add striking depth.",
    traits: ["Deep", "Warm", "Rich"],
  },

  deepWinter: {
    backgroundColor: "deepWinterBg",
    accentColor: "deepWinterAccent",
    detailColor: "deepWinterDetail",
    buttonColor: "deepWinterButton",
    displayName: "Deep Winter",
    description:
      "You are deep, cool and clear. Saturated jewel tones create elegant contrast.",
    traits: ["Deep", "Cool", "Clear"],
  },

  trueWinter: {
    backgroundColor: "trueWinterBg",
    accentColor: "trueWinterAccent",
    detailColor: "trueWinterDetail",
    buttonColor: "trueWinterButton",
    displayName: "True Winter",
    description:
      "You are cool, clear and contrasted. Crisp, icy colours highlight your definition.",
    traits: ["Cool", "Clear", "Contrast"],
  },

  brightWinter: {
    backgroundColor: "brightWinterBg",
    accentColor: "brightWinterAccent",
    detailColor: "brightWinterDetail",
    buttonColor: "brightWinterButton",
    displayName: "Bright Winter",
    description:
      "You are bright, cool and clear. Electric jewel tones amplify your vivid presence.",
    traits: ["Bright", "Cool", "Clear"],
  },
};

function seasonNameToKey(season?: string | null): SeasonKey | null {
  if (!season) return null;

  const normalized = season.toLowerCase().replace(/[\s-_]+/g, "");

  const map: Record<string, SeasonKey> = {
    lightspring: "lightSpring",
    truespring: "trueSpring",
    brightspring: "brightSpring",
    lightsummer: "lightSummer",
    truesummer: "trueSummer",
    softsummer: "softSummer",
    softautumn: "softAutumn",
    trueautumn: "trueAutumn",
    deepautumn: "deepAutumn",
    deepwinter: "deepWinter",
    truewinter: "trueWinter",
    brightwinter: "brightWinter",
  };

  return map[normalized] ?? null;
}

type Props = {
  previewSeason?: SeasonKey;
};

export default function ColourSeasonCard({ previewSeason }: Props) {
  const router = useRouter();
  const { themeColors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const eyebrowSize = isMobile ? 12 : isWide ? 10 : isMedium ? 9 : 9;
  const titleSize = isMobile ? 36 : isWide ? 36 : isMedium ? 32 : 30;
  const subtitleSize = isMobile ? 17 : isWide ? 15 : isMedium ? 14 : 13;
  const buttonTextSize = isMobile ? 16 : isWide ? 14 : 13;
  const decorationCircleSize = isWide ? 190 : isMedium ? 170 : 150;

  const [season, setSeason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (previewSeason) {
        setLoading(false);
        return;
      }

      let isActive = true;

      const loadColourSeason = async () => {
        setLoading(true);

        try {
          const profile = await getProfile();

          const savedSeason = profile?.colourSeason ?? profile?.season ?? null;

          if (!isActive) return;

          setSeason(
            typeof savedSeason === "string" && savedSeason.trim().length > 0
              ? savedSeason.trim()
              : null,
          );
        } catch {
          if (isActive) {
            setSeason(null);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadColourSeason();

      return () => {
        isActive = false;
      };
    }, [previewSeason]),
  );

  const seasonKey = previewSeason ?? seasonNameToKey(season);
  const design = seasonKey ? SEASON_DESIGNS[seasonKey] : DEFAULT_DESIGN;
  const designColors = {
    backgroundColor: themeColors[design.backgroundColor],
    accentColor: themeColors[design.accentColor],
    detailColor: themeColors[design.detailColor],
    buttonColor: themeColors[design.buttonColor],
  };

  const hasAnalysis = seasonKey !== null;
  const seasonImage = seasonKey
    ? SEASON_IMAGES[seasonKey]
    : defaultSeasonImage;

  const openColourAnalysis = () => {
    router.push("/(tabs)/colour-analysis" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        s.card,
        isMobile && s.cardMobile,
        {
          backgroundColor: designColors.backgroundColor,
          shadowColor: themeColors.colourSeasonShadow,
        },
      ]}
      onPress={openColourAnalysis}
    >
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator color={themeColors.colourSeasonText} />
        </View>
      ) : hasAnalysis ? (
        <>
          <View style={[s.analyzedContent, isMobile && s.analyzedContentMobile]}>
            <Text
              style={[
                s.analyzedEyebrow,
                { color: designColors.detailColor, fontSize: eyebrowSize },
              ]}
            >
              YOUR COLOUR SEASON
            </Text>

            <View style={s.analyzedTitleRow}>
              <Text
                style={[
                  s.analyzedTitle,
                  { color: themeColors.colourSeasonText, fontSize: titleSize, lineHeight: titleSize + 4 },
                ]}
              >
                {design.displayName}
              </Text>
              <Text style={[s.titleSparkle, { color: designColors.detailColor }]}>✦</Text>
            </View>

            <Text
              style={[
                s.analyzedDescription,
                { color: themeColors.colourSeasonSubtext, fontSize: subtitleSize, lineHeight: subtitleSize + 6 },
              ]}
              numberOfLines={4}
            >
              {design.description}
            </Text>

            <View
              style={[
                s.analyzedButton,
                { backgroundColor: designColors.buttonColor },
              ]}
            >
              <Text style={[s.buttonText, { color: themeColors.colourSeasonText, fontSize: buttonTextSize }]}> 
                View your full palette
              </Text>
              <Text style={[s.buttonArrow, { color: themeColors.colourSeasonText }]}>→</Text>
            </View>

            <View style={s.traitsRow}>
              <Text style={[s.paletteIcon, { color: designColors.detailColor }]}>◉</Text>
              {design.traits.map((trait, index) => (
                <React.Fragment key={trait}>
                  {index > 0 && (
                    <Text style={[s.traitDot, { color: designColors.detailColor }]}>•</Text>
                  )}
                  <Text style={[s.traitText, { color: themeColors.colourSeasonText }]}>{trait}</Text>
                </React.Fragment>
              ))}
            </View>
          </View>

          <View pointerEvents="none" style={s.analyzedDecoration}>
            <View
              style={[
                s.analyzedBackdrop,
                { backgroundColor: designColors.accentColor },
              ]}
            />
            <View style={[s.flowerImageFrame, { borderColor: themeColors.colourSeasonFrame }]}>
              <Image
                source={seasonImage}
                style={s.flowerImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[s.decorSparkleLarge, { color: themeColors.colourSeasonDecoration }]}>✦</Text>
            <Text style={[s.decorSparkleSmall, { color: themeColors.colourSeasonDecoration }]}>✦</Text>
            <Image
              source={defaultSeasonImage}
              style={[s.analyzedSwatches, { filter: themeColors.colourSeasonSwatchShadow } as any]}
              resizeMode="contain"
            />
            <View style={[s.analyzedSmallCircle, { backgroundColor: themeColors.colourSeasonCircle }]} />
          </View>
        </>
      ) : (
        <>
          <View style={[s.content, isMobile && s.contentMobile]}>
            <View style={s.textContent}>
              <Text style={[s.eyebrow, { color: themeColors.colourSeasonEyebrow, fontSize: eyebrowSize }]}>PERSONAL COLOUR</Text>

              <Text style={[s.title, { color: themeColors.colourSeasonText, fontSize: titleSize, lineHeight: titleSize + 4 }]}> 
                {hasAnalysis ? design.displayName : "Colour Season"}
              </Text>

              <Text style={[s.subtitle, { color: themeColors.colourSeasonSubtext, fontSize: subtitleSize, lineHeight: subtitleSize + 6 }]}> 
                {hasAnalysis
                  ? "Your personal palette is ready."
                  : "Discover the colours that suit you best."}
              </Text>
            </View>

            <View
              style={[
                s.button,
                {
                  backgroundColor: designColors.buttonColor,
                },
              ]}
            >
              <Text style={[s.buttonText, { color: themeColors.colourSeasonText, fontSize: buttonTextSize }]}> 
                {hasAnalysis ? "View full palette" : "Start analysis"}
              </Text>

              <Text style={[s.buttonArrow, { color: themeColors.colourSeasonText }]}>→</Text>
            </View>
          </View>

          <View pointerEvents="none" style={s.decoration}>
            <View
              style={[
                s.largeCircle,
                {
                  backgroundColor: designColors.accentColor,
                  width: decorationCircleSize,
                  height: decorationCircleSize,
                  borderRadius: decorationCircleSize / 2,
                },
              ]}
            />

            <View style={[s.smallCircle, { backgroundColor: themeColors.colourSeasonCircle }]} />

            <Image
              source={seasonImage}
              style={[s.seasonImage, { filter: themeColors.colourSeasonImageShadow } as any]}
              resizeMode="contain"
            />
          </View>
        </>
      )}
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

    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  cardMobile: {
    minHeight: 300,
  },

  analyzedContent: {
    width: "48%",
    minHeight: 286,
    paddingLeft: 24,
    paddingRight: 12,
    paddingVertical: 22,
    zIndex: 4,
  },

  analyzedContentMobile: { minHeight: 300 },

  analyzedEyebrow: {
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },

  analyzedTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  analyzedTitle: {
    fontFamily: "Cormorant Garamond",
    fontWeight: "700",
    flexShrink: 1,
  },

  titleSparkle: {
    fontSize: 20,
    marginLeft: 5,
    marginTop: -2,
  },

  analyzedDescription: {
    marginBottom: 14,
  },

  analyzedButton: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  traitsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },

  paletteIcon: {
    fontSize: 19,
    marginRight: 2,
  },

  traitText: {
    fontSize: 11,
    fontWeight: "600",
  },

  traitDot: {
    fontSize: 11,
  },

  analyzedDecoration: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "52%",
    overflow: "hidden",
  },

  analyzedBackdrop: {
    position: "absolute",
    width: "145%",
    aspectRatio: 1,
    borderRadius: 999,
    top: -95,
    left: -25,
    opacity: 0.3,
  },

  flowerImageFrame: {
    position: "absolute",
    top: 18,
    right: 14,
    width: "88%",
    height: "76%",
    borderTopLeftRadius: 95,
    borderTopRightRadius: 95,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 2,
    overflow: "hidden",
  },

  flowerImage: {
    width: "100%",
    height: "100%",
  },

  analyzedSwatches: {
    position: "absolute",
    width: "72%",
    height: "55%",
    right: -4,
    bottom: -9,
    zIndex: 3,
  },

  analyzedSmallCircle: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    right: -6,
    bottom: -15,
    zIndex: 2,
  },

  decorSparkleLarge: {
    position: "absolute",
    top: 20,
    right: 16,
    fontSize: 25,
    zIndex: 4,
  },

  decorSparkleSmall: {
    position: "absolute",
    top: 47,
    right: 5,
    fontSize: 16,
    zIndex: 4,
  },

  loadingWrap: {
    flex: 1,
    minHeight: 236,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    width: "48%",
    minHeight: 236,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "space-between",
    zIndex: 3,
  },

  contentMobile: { minHeight: 300 },

  textContent: {
    flex: 1,
    flexShrink: 1,
    width: "100%",
    paddingBottom: 58,
  },

  eyebrow: {
    fontSize: 9,
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
    marginBottom: 18,
  },

  button: {
    position: "absolute",
    left: 24,
    right: 12,
    bottom: 24,
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    zIndex: 4,
  },

  buttonText: {
    fontSize: 13,
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
    width: "52%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 1,
  },

  seasonImage: {
    width: "100%",
    height: "100%",
    zIndex: 2,
  },

  largeCircle: {
    position: "absolute",
    opacity: 0.58,
    transform: [
      { translateX: 18 },
      { translateY: -14 },
    ],
  },

  smallCircle: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    right: 10,
    bottom: 14,
  },

});
