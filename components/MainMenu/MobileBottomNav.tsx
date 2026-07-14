import { useAppTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const NAV = [
  {
    id: "home",
    label: "Home",
    icon: "⌂",
    route: "/(tabs)/mainMenu",
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    icon: "▣",
    route: "/(tabs)/wardrobe",
  },
  {
    id: "advice",
    label: "Outfit Advice",
    icon: "✦",
    route: "/(tabs)/upload-outfit",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "◯",
    route: "/(tabs)/profile",
  },
] as const;

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useAppTheme();

  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.input,
        },
      ]}
    >
      {NAV.map((item) => {
        const active = pathname === item.route;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => {
              if (!active) router.push(item.route as any);
            }}
          >
            {active ? (
              <LinearGradient
                colors={[themeColors.button, themeColors.bgDark]}
                style={styles.activePill}
              >
                <Text style={[styles.icon, { color: themeColors.white }]}>
                  {item.icon}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactivePill}>
                <Text style={[styles.icon, { color: themeColors.text }]}>
                  {item.icon}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.label,
                { color: active ? themeColors.accent : themeColors.muted },
                active && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 22 : 12,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },

  activePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  inactivePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  icon: {
    fontSize: 19,
  },

  label: {
    fontSize: 9,
    fontWeight: "500",
  },

  activeLabel: {
    fontWeight: "700",
  },
});
