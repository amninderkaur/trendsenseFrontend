import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const STATS = [
  {
    icon: "⌁",
    number: 28,
    title: "Items",
    subtitle: "in wardrobe",
    color: "#DDE7DB",
  },
  {
    icon: "✧",
    number: 12,
    title: "Outfits",
    subtitle: "created",
    color: "#E5ECE3",
  },
  {
    icon: "♡",
    number: 7,
    title: "Saved",
    subtitle: "looks",
    color: "#F5DCD8",
  },
  {
    icon: "♨",
    number: 4,
    title: "Days in",
    subtitle: "a row",
    color: "#DDE7DB",
  },
];

export default function StatsCard() {
  const { themeColors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: themeColors.card }]}>
      {STATS.map((stat, index) => (
        <React.Fragment key={stat.title}>
          <View style={styles.cell}>
            <View style={[styles.iconCircle, { backgroundColor: stat.color }]}>
              <Text style={styles.icon}>{stat.icon}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.number}>{stat.number}</Text>

              <Text style={styles.title}>{stat.title}</Text>

              <Text style={styles.subtitle}>{stat.subtitle}</Text>
            </View>
          </View>

          {index !== STATS.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 145,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    width: "100%",
    shadowColor: "#000",
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
    paddingHorizontal: 18,
  },

  divider: {
    width: 1,
    height: 72,
    backgroundColor: "rgba(29,50,37,0.10)",
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },

  icon: {
    fontSize: 24,
    color: "#1D3225",
  },

  textContainer: {
    justifyContent: "center",
  },

  number: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1D3225",
    lineHeight: 32,
    fontFamily: "Cormorant Garamond",
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D3225",
    marginTop: 4,
    fontFamily: "Cormorant Garamond",
  },

  subtitle: {
    fontSize: 13,
    color: "#455248",
    marginTop: 2,
    fontFamily: "Cormorant Garamond",
  },
});
