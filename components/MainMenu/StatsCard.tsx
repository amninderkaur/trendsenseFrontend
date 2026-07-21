import {
  getLoginStreak,
  getOutfitsCount,
  getSavedLooksCount,
  getWardrobeCount,
} from "@/api/user";
import { useAppTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

const STAT_META = [
  {
    icon: "⌁",
    title: "Items",
    subtitle: "in wardrobe",
    colorKey: "statsGreen",
    key: "wardrobeCount",
  },
  {
    icon: "✧",
    title: "Outfits",
    subtitle: "created",
    colorKey: "statsPurple",
    key: "outfitsCount",
  },
  {
    icon: "♡",
    title: "Saved",
    subtitle: "looks",
    colorKey: "statsPink",
    key: "savedLooksCount",
  },
  {
    icon: "♨",
    title: "Days in",
    subtitle: "a row",
    colorKey: "statsBlue",
    key: "loginStreak",
  },
] as const;

type StatsState = {
  wardrobeCount: number;
  outfitsCount: number;
  savedLooksCount: number;
  loginStreak: number;
};

export default function StatsCard() {
  const { themeColors } = useAppTheme();
  const { width } = useWindowDimensions();

  const [stats, setStats] = useState<StatsState>({
    wardrobeCount: 0,
    outfitsCount: 0,
    savedLooksCount: 0,
    loginStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const [wardrobe, outfits, saved, streak] = await Promise.allSettled([
          getWardrobeCount(),
          getOutfitsCount(),
          getSavedLooksCount(),
          getLoginStreak(),
        ]);

        if (cancelled) return;

        setStats({
          wardrobeCount:
            wardrobe.status === "fulfilled"
              ? wardrobe.value.wardrobeCount ?? 0
              : 0,
          outfitsCount:
            outfits.status === "fulfilled"
              ? outfits.value.outfitsCount ?? 0
              : 0,
          savedLooksCount:
            saved.status === "fulfilled"
              ? saved.value.savedLooksCount ?? 0
              : 0,
          loginStreak:
            streak.status === "fulfilled"
              ? streak.value.loginStreak ?? 0
              : 0,
        });
      } catch {
        // silently fail — numbers stay 0
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const cardHeight = isWide ? 170 : isMedium ? 158 : 145;
  const numberSize = isWide ? 38 : isMedium ? 34 : 30;
  const titleSize = isWide ? 17 : isMedium ? 15 : 14;
  const subtitleSize = isWide ? 15 : isMedium ? 14 : 13;
  const iconSize = isWide ? 28 : 24;
  const iconCircleSize = isWide ? 66 : 58;
  const cellPadding = isWide ? 22 : 18;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          shadowColor: themeColors.shadow,
          height: cardHeight,
        },
      ]}
    >
      {STAT_META.map((stat, index) => (
        <React.Fragment key={stat.title}>
          <View style={styles.cell}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: themeColors[stat.colorKey],
                  width: iconCircleSize,
                  height: iconCircleSize,
                  borderRadius: iconCircleSize / 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  { color: themeColors.text, fontSize: iconSize },
                ]}
              >
                {stat.icon}
              </Text>
            </View>

            <View style={[styles.textContainer, { paddingRight: cellPadding }]}>
              <Text
                style={[
                  styles.number,
                  { color: themeColors.text, fontSize: numberSize, lineHeight: numberSize + 2 },
                ]}
              >
                {loading ? "—" : stats[stat.key]}
              </Text>

              <Text
                style={[
                  styles.title,
                  { color: themeColors.text, fontSize: titleSize },
                ]}
              >
                {stat.title}
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { color: themeColors.muted, fontSize: subtitleSize },
                ]}
              >
                {stat.subtitle}
              </Text>
            </View>
          </View>

          {index !== STAT_META.length - 1 && (
            <View
              style={[
                styles.divider,
                { backgroundColor: themeColors.statsDivider },
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    width: "100%",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
  },

  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    width: 1,
    height: 72,
  },

  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  icon: {},

  textContainer: {
    justifyContent: "center",
  },

  number: {
    fontWeight: "700",
    fontFamily: "Cormorant Garamond",
  },

  title: {
    fontWeight: "700",
    marginTop: 4,
    fontFamily: "Cormorant Garamond",
  },

  subtitle: {
    marginTop: 2,
    fontFamily: "Cormorant Garamond",
  },
});
