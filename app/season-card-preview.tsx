import ColourSeasonCard, {
  type SeasonKey,
} from "@/components/MainMenu/Cards/ColorSeasonCard";
import FeatureGrid from "@/components/MainMenu/FeatureGrid";
import HomeHeader from "@/components/MainMenu/HomeHeader";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const SEASONS: SeasonKey[] = [
  "lightSpring",
  "trueSpring",
  "brightSpring",
  "lightSummer",
  "trueSummer",
  "softSummer",
  "softAutumn",
  "trueAutumn",
  "deepAutumn",
  "deepWinter",
  "trueWinter",
  "brightWinter",
];

export default function SeasonCardPreview() {
  const { themeColors } = useAppTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: themeColors.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader avatarUri={null} showProfileAction={false} />

      <FeatureGrid heading="Colour Season Card Preview">
        {SEASONS.map((season) => (
          <ColourSeasonCard key={season} previewSeason={season} />
        ))}
      </FeatureGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 48,
  },
});
