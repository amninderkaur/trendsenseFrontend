import { useAppTheme } from "@/context/ThemeContext";
import React, { Children } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function FeatureGrid({ children }: Props) {
  const { themeColors } = useAppTheme();

  const cards = Children.toArray(children);

  const topRowCards = cards.slice(0, 4);
  const bottomRowCards = cards.slice(4, 8);

  return (
    <View style={s.container}>
      <Text style={[s.heading, { color: themeColors.text }]}>Explore</Text>

      <View style={s.grid}>
        <View style={s.topRow}>
          {topRowCards.map((card, index) => (
            <View key={index} style={s.topCardSlot}>
              {card}
            </View>
          ))}
        </View>

        <View style={s.bottomRow}>
          {bottomRowCards.map((card, index) => (
            <View
              key={index}
              style={[
                s.bottomCardSlot,
                index === bottomRowCards.length - 1 && s.trendsCardSlot,
              ]}
            >
              {card}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingHorizontal: 28,
  },

  heading: {
    fontSize: 38,
    fontFamily: "Cormorant Garamond",
    fontWeight: "600",
    marginBottom: 18,
    marginLeft: 4,
  },

  grid: {
    gap: 18,
  },

  topRow: {
    flexDirection: "row",
    gap: 18,
    alignItems: "stretch",
  },

  topCardSlot: {
    flex: 1,
    minWidth: 0,
  },

  bottomRow: {
    flexDirection: "row",
    gap: 18,
    alignItems: "stretch",
  },

  bottomCardSlot: {
    flex: 1,
    minWidth: 0,
  },

  trendsCardSlot: {
    flex: 1.45,
  },
});
