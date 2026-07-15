import { getProfile } from "@/api/profile";
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
  backgroundColor: string;
  accentColor: string;
  detailColor: string;
  buttonColor: string;
  displayName: string;
  description: string;
  traits: readonly [string, string, string];
};

const DEFAULT_DESIGN: SeasonDesign = {
  backgroundColor: "#E7DCEF",
  accentColor: "#BCA8CB",
  detailColor: "#806293",
  buttonColor: "rgba(96, 67, 117, 0.14)",
  displayName: "Colour Season",
  description: "Discover the colours that suit you best.",
  traits: ["Discover", "Define", "Glow"],
};

const SEASON_DESIGNS: Record<SeasonKey, SeasonDesign> = {
  lightSpring: {
    backgroundColor: "#FFF5F2",
    accentColor: "#EFAFAF",
    detailColor: "#C98282",
    buttonColor: "rgba(224, 139, 139, 0.24)",
    displayName: "Light Spring",
    description:
      "You are warm, light and bright. These fresh, clear colours bring out your natural glow.",
    traits: ["Light", "Warm", "Bright"],
  },

  trueSpring: {
    backgroundColor: "#F4D6A8",
    accentColor: "#EAAF62",
    detailColor: "#B9682F",
    buttonColor: "rgba(153, 93, 32, 0.14)",
    displayName: "True Spring",
    description:
      "You are warm, clear and lively. Fresh, sunlit colours reflect your natural energy.",
    traits: ["Warm", "Clear", "Lively"],
  },

  brightSpring: {
    backgroundColor: "#F6D2B5",
    accentColor: "#F29C74",
    detailColor: "#C55F39",
    buttonColor: "rgba(162, 75, 54, 0.14)",
    displayName: "Bright Spring",
    description:
      "You are bright, warm and clear. Vivid, playful colours make your features shine.",
    traits: ["Bright", "Warm", "Clear"],
  },

  lightSummer: {
    backgroundColor: "#DFE4F1",
    accentColor: "#B8C6DD",
    detailColor: "#6F83A8",
    buttonColor: "rgba(76, 93, 130, 0.14)",
    displayName: "Light Summer",
    description:
      "You are cool, light and gentle. Airy pastels enhance your soft, delicate colouring.",
    traits: ["Light", "Cool", "Soft"],
  },

  trueSummer: {
    backgroundColor: "#D8DFEB",
    accentColor: "#A9B8D0",
    detailColor: "#617699",
    buttonColor: "rgba(69, 87, 127, 0.14)",
    displayName: "True Summer",
    description:
      "You are cool, calm and softly blended. Refined, blue-based shades bring harmony.",
    traits: ["Cool", "Soft", "Calm"],
  },

  softSummer: {
    backgroundColor: "#DDDCE5",
    accentColor: "#B8B4C7",
    detailColor: "#7B748D",
    buttonColor: "rgba(91, 83, 112, 0.14)",
    displayName: "Soft Summer",
    description:
      "You are soft, cool and muted. Smoky, blended colours complement your subtle beauty.",
    traits: ["Soft", "Cool", "Muted"],
  },

  softAutumn: {
    backgroundColor: "#E6D7C2",
    accentColor: "#C8AD87",
    detailColor: "#8E6F4C",
    buttonColor: "rgba(112, 84, 52, 0.14)",
    displayName: "Soft Autumn",
    description:
      "You are soft, warm and muted. Gentle earth tones create an effortless natural glow.",
    traits: ["Soft", "Warm", "Muted"],
  },

  trueAutumn: {
    backgroundColor: "#DFCAA8",
    accentColor: "#B98954",
    detailColor: "#85582E",
    buttonColor: "rgba(113, 67, 31, 0.15)",
    displayName: "True Autumn",
    description:
      "You are warm, rich and earthy. Golden, spiced colours echo your natural warmth.",
    traits: ["Warm", "Rich", "Earthy"],
  },

  deepAutumn: {
    backgroundColor: "#D5C0AD",
    accentColor: "#8B654D",
    detailColor: "#65422F",
    buttonColor: "rgba(77, 49, 34, 0.16)",
    displayName: "Deep Autumn",
    description:
      "You are deep, warm and rich. Dark earth tones and jewel shades add striking depth.",
    traits: ["Deep", "Warm", "Rich"],
  },

  deepWinter: {
    backgroundColor: "#D5D7E4",
    accentColor: "#777E9E",
    detailColor: "#50597C",
    buttonColor: "rgba(53, 57, 92, 0.15)",
    displayName: "Deep Winter",
    description:
      "You are deep, cool and clear. Saturated jewel tones create elegant contrast.",
    traits: ["Deep", "Cool", "Clear"],
  },

  trueWinter: {
    backgroundColor: "#DDE1EA",
    accentColor: "#8E9AB8",
    detailColor: "#59698D",
    buttonColor: "rgba(52, 67, 105, 0.14)",
    displayName: "True Winter",
    description:
      "You are cool, clear and contrasted. Crisp, icy colours highlight your definition.",
    traits: ["Cool", "Clear", "Contrast"],
  },

  brightWinter: {
    backgroundColor: "#E5DDEA",
    accentColor: "#B28DC0",
    detailColor: "#805A91",
    buttonColor: "rgba(104, 59, 120, 0.14)",
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
  const { width } = useWindowDimensions();
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const eyebrowSize = isWide ? 10 : isMedium ? 9 : 9;
  const titleSize = isWide ? 36 : isMedium ? 32 : 30;
  const subtitleSize = isWide ? 15 : isMedium ? 14 : 13;
  const buttonTextSize = isWide ? 14 : 13;
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
        {
          backgroundColor: design.backgroundColor,
        },
      ]}
      onPress={openColourAnalysis}
    >
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator color="#1D3225" />
        </View>
      ) : hasAnalysis ? (
        <>
          <View style={s.analyzedContent}>
            <Text
              style={[
                s.analyzedEyebrow,
                { color: design.detailColor, fontSize: eyebrowSize },
              ]}
            >
              YOUR COLOUR SEASON
            </Text>

            <View style={s.analyzedTitleRow}>
              <Text
                style={[
                  s.analyzedTitle,
                  { fontSize: titleSize, lineHeight: titleSize + 4 },
                ]}
              >
                {design.displayName}
              </Text>
              <Text style={[s.titleSparkle, { color: design.detailColor }]}>✦</Text>
            </View>

            <Text
              style={[
                s.analyzedDescription,
                { fontSize: subtitleSize, lineHeight: subtitleSize + 6 },
              ]}
              numberOfLines={4}
            >
              {design.description}
            </Text>

            <View
              style={[
                s.analyzedButton,
                { backgroundColor: design.buttonColor },
              ]}
            >
              <Text style={[s.buttonText, { fontSize: buttonTextSize }]}> 
                View your full palette
              </Text>
              <Text style={s.buttonArrow}>→</Text>
            </View>

            <View style={s.traitsRow}>
              <Text style={[s.paletteIcon, { color: design.detailColor }]}>◉</Text>
              {design.traits.map((trait, index) => (
                <React.Fragment key={trait}>
                  {index > 0 && (
                    <Text style={[s.traitDot, { color: design.detailColor }]}>•</Text>
                  )}
                  <Text style={s.traitText}>{trait}</Text>
                </React.Fragment>
              ))}
            </View>
          </View>

          <View pointerEvents="none" style={s.analyzedDecoration}>
            <View
              style={[
                s.analyzedBackdrop,
                { backgroundColor: design.accentColor },
              ]}
            />
            <View style={s.flowerImageFrame}>
              <Image
                source={seasonImage}
                style={s.flowerImage}
                resizeMode="cover"
              />
            </View>
            <Text style={s.decorSparkleLarge}>✦</Text>
            <Text style={s.decorSparkleSmall}>✦</Text>
            <Image
              source={defaultSeasonImage}
              style={s.analyzedSwatches}
              resizeMode="contain"
            />
            <View style={s.analyzedSmallCircle} />
          </View>
        </>
      ) : (
        <>
          <View style={s.content}>
            <View style={s.textContent}>
              <Text style={[s.eyebrow, { fontSize: eyebrowSize }]}>PERSONAL COLOUR</Text>

              <Text style={[s.title, { fontSize: titleSize, lineHeight: titleSize + 4 }]}>
                {hasAnalysis ? design.displayName : "Colour Season"}
              </Text>

              <Text style={[s.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize + 6 }]}> 
                {hasAnalysis
                  ? "Your personal palette is ready."
                  : "Discover the colours that suit you best."}
              </Text>
            </View>

            <View
              style={[
                s.button,
                {
                  backgroundColor: design.buttonColor,
                },
              ]}
            >
              <Text style={[s.buttonText, { fontSize: buttonTextSize }]}> 
                {hasAnalysis ? "View full palette" : "Start analysis"}
              </Text>

              <Text style={s.buttonArrow}>→</Text>
            </View>
          </View>

          <View pointerEvents="none" style={s.decoration}>
            <View
              style={[
                s.largeCircle,
                {
                  backgroundColor: design.accentColor,
                  width: decorationCircleSize,
                  height: decorationCircleSize,
                  borderRadius: decorationCircleSize / 2,
                },
              ]}
            />

            <View style={s.smallCircle} />

            <Image
              source={seasonImage}
              style={s.seasonImage}
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

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  analyzedContent: {
    width: "48%",
    minHeight: 286,
    paddingLeft: 24,
    paddingRight: 12,
    paddingVertical: 22,
    zIndex: 4,
  },

  analyzedEyebrow: {
    color: "#C98282",
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
    color: "#1D3225",
    fontFamily: "Cormorant Garamond",
    fontWeight: "700",
    flexShrink: 1,
  },

  titleSparkle: {
    color: "#D9A545",
    fontSize: 20,
    marginLeft: 5,
    marginTop: -2,
  },

  analyzedDescription: {
    color: "#415248",
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
    color: "#D78F8F",
    fontSize: 19,
    marginRight: 2,
  },

  traitText: {
    color: "#1D3225",
    fontSize: 11,
    fontWeight: "600",
  },

  traitDot: {
    color: "#DCA1A1",
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
    borderColor: "rgba(255,255,255,0.85)",
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
    filter: "drop-shadow(0px 7px 6px rgba(0, 0, 0, 0.16))",
  },

  analyzedSmallCircle: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    right: -6,
    bottom: -15,
    backgroundColor: "rgba(255,255,255,0.42)",
    zIndex: 2,
  },

  decorSparkleLarge: {
    position: "absolute",
    top: 20,
    right: 16,
    color: "#FFFFFF",
    fontSize: 25,
    zIndex: 4,
  },

  decorSparkleSmall: {
    position: "absolute",
    top: 47,
    right: 5,
    color: "#FFFFFF",
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

  textContent: {
    flex: 1,
    flexShrink: 1,
    width: "100%",
    paddingBottom: 58,
  },

  eyebrow: {
    color: "#667469",
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
    color: "#536157",
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
    filter: "drop-shadow(0px 9px 7px rgba(0, 0, 0, 0.15))",
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
    backgroundColor: "rgba(255,255,255,0.42)",
    right: 10,
    bottom: 14,
  },

});
