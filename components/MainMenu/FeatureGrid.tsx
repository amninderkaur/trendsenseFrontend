import { useAppTheme } from "@/context/ThemeContext";
import React, { Children } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  children: React.ReactNode;
  heading?: string;
};

export default function FeatureGrid({ children, heading = "Explore" }: Props) {
  const { themeColors } = useAppTheme();
  const { width } = useWindowDimensions();

  const cards = Children.toArray(children);

  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const columns = isWide ? 4 : isMedium ? 2 : 1;
  const rows = Array.from(
    { length: Math.ceil(cards.length / columns) },
    (_, index) => cards.slice(index * columns, (index + 1) * columns),
  );
  const slotStyle = isWide
    ? s.slotWide
    : isMedium
      ? s.slotMedium
      : s.slotNarrow;

  return (
    <View style={s.container}>
      <Text style={[s.heading, { color: themeColors.text }]}>{heading}</Text>

      <View style={s.grid}>
        {rows.map((rowCards, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              s.row,
              isWide && s.rowWide,
              isMedium && s.rowMedium,
              !isWide && !isMedium && s.rowNarrow,
            ]}
          >
            {rowCards.map((card, cardIndex) => (
              <View key={cardIndex} style={slotStyle}>
                {card}
              </View>
            ))}
          </View>
        ))}
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

  row: {
    flexDirection: "row",
    gap: 18,
    alignItems: "stretch",
  },

  rowWide: {
    flexWrap: "nowrap",
  },

  rowMedium: {
    flexWrap: "wrap",
  },

  rowNarrow: {
    flexWrap: "wrap",
  },

  slotWide: {
    flex: 1,
    minWidth: 0,
  },

  slotMedium: {
    flex: 1,
    minWidth: "calc(50% - 9px)" as any,
  },

  slotNarrow: {
    flex: 1,
    minWidth: "100%" as any,
  },

});
