import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeContext";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard" as const,
    route: "/(tabs)/mainMenu",
    pathname: "/mainMenu",
  },
  {
    id: "chatbot",
    label: "Chatbot",
    icon: "chat-bubble-outline" as const,
    route: "/chatbot",
    pathname: "/chatbot",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "person-outline" as const,
    route: "/(tabs)/profile",
    pathname: "/profile",
  },
] as const;

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { themeColors } = useAppTheme();

  return (
    <View
      style={[
        styles.nav,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.input,
          shadowColor: themeColors.shadow,
        },
      ]}
    >
      {NAV.map((item) => {
        const active = pathname === item.pathname;

        return (
          <TouchableOpacity
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            activeOpacity={0.75}
            style={styles.navItem}
            onPress={() => {
              if (!active) router.replace(item.route as any);
            }}
          >
            <View
              style={[
                styles.iconPill,
                active && { backgroundColor: themeColors.welcomeButton },
              ]}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={
                  active ? themeColors.welcomeButtonText : themeColors.muted
                }
              />
            </View>

            <Text
              style={[
                styles.label,
                { color: active ? themeColors.text : themeColors.muted },
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
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
    zIndex: 50,
  },

  navItem: {
    flex: 1,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  iconPill: {
    minWidth: 54,
    height: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
  },

  activeLabel: {
    fontWeight: "700",
  },
});
