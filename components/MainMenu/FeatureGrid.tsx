import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function FeatureGrid({ children }: Props) {
  const { themeColors } = useAppTheme();

  return (
    <View style={s.container}>
      <Text style={[s.heading, { color: themeColors.text }]}>Explore</Text>

      <View style={s.grid}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  heading: {
    fontSize: 38,
    fontFamily: "Cormorant Garamond",
    fontWeight: "600",
    marginBottom: 18,
    marginLeft: 4,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
});
