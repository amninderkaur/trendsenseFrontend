import { getProfile } from "@/api/profile";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type SeasonKey =
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
  buttonColor: string;
  displayName: string;
};

const DEFAULT_DESIGN: SeasonDesign = {
  backgroundColor: "#E7DCEF",
  accentColor: "#BCA8CB",
  buttonColor: "rgba(96, 67, 117, 0.14)",
  displayName: "Colour Season",
};

const SEASON_DESIGNS: Record<SeasonKey, SeasonDesign> = {
  lightSpring: {
    backgroundColor: "#F7E4C8",
    accentColor: "#F2C98E",
    buttonColor: "rgba(154, 112, 51, 0.14)",
    displayName: "Light Spring",
  },

  trueSpring: {
    backgroundColor: "#F4D6A8",
    accentColor: "#EAAF62",
    buttonColor: "rgba(153, 93, 32, 0.14)",
    displayName: "True Spring",
  },

  brightSpring: {
    backgroundColor: "#F6D2B5",
    accentColor: "#F29C74",
    buttonColor: "rgba(162, 75, 54, 0.14)",
    displayName: "Bright Spring",
  },

  lightSummer: {
    backgroundColor: "#DFE4F1",
    accentColor: "#B8C6DD",
    buttonColor: "rgba(76, 93, 130, 0.14)",
    displayName: "Light Summer",
  },

  trueSummer: {
    backgroundColor: "#D8DFEB",
    accentColor: "#A9B8D0",
    buttonColor: "rgba(69, 87, 127, 0.14)",
    displayName: "True Summer",
  },

  softSummer: {
    backgroundColor: "#DDDCE5",
    accentColor: "#B8B4C7",
    buttonColor: "rgba(91, 83, 112, 0.14)",
    displayName: "Soft Summer",
  },

  softAutumn: {
    backgroundColor: "#E6D7C2",
    accentColor: "#C8AD87",
    buttonColor: "rgba(112, 84, 52, 0.14)",
    displayName: "Soft Autumn",
  },

  trueAutumn: {
    backgroundColor: "#DFCAA8",
    accentColor: "#B98954",
    buttonColor: "rgba(113, 67, 31, 0.15)",
    displayName: "True Autumn",
  },

  deepAutumn: {
    backgroundColor: "#D5C0AD",
    accentColor: "#8B654D",
    buttonColor: "rgba(77, 49, 34, 0.16)",
    displayName: "Deep Autumn",
  },

  deepWinter: {
    backgroundColor: "#D5D7E4",
    accentColor: "#777E9E",
    buttonColor: "rgba(53, 57, 92, 0.15)",
    displayName: "Deep Winter",
  },

  trueWinter: {
    backgroundColor: "#DDE1EA",
    accentColor: "#8E9AB8",
    buttonColor: "rgba(52, 67, 105, 0.14)",
    displayName: "True Winter",
  },

  brightWinter: {
    backgroundColor: "#E5DDEA",
    accentColor: "#B28DC0",
    buttonColor: "rgba(104, 59, 120, 0.14)",
    displayName: "Bright Winter",
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

export default function ColourSeasonCard() {
  const router = useRouter();

  const [season, setSeason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
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
    }, []),
  );

  const seasonKey = seasonNameToKey(season);
  const design = seasonKey ? SEASON_DESIGNS[seasonKey] : DEFAULT_DESIGN;

  const hasAnalysis = seasonKey !== null;

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
      ) : (
        <>
          <View style={s.content}>
            <View style={s.textContent}>
              <Text style={s.eyebrow}>PERSONAL COLOUR</Text>

              <Text style={s.title}>
                {hasAnalysis ? design.displayName : "Colour Season"}
              </Text>

              <Text style={s.subtitle}>
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
              <Text style={s.buttonText}>
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
                },
              ]}
            />

            <View style={s.smallCircle} />

            <Text style={s.symbol}>{hasAnalysis ? "✦" : "◈"}</Text>
          </View>
        </>
      )}
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

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  loadingWrap: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
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
    flexShrink: 1,
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
    alignSelf: "flex-start",
    minWidth: 146,
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

  symbol: {
    color: "#1D3225",
    fontSize: 40,
    zIndex: 2,
  },
});
