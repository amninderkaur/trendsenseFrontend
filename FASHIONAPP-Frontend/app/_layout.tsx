import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack, usePathname } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import "react-native-reanimated";

import FloatingChatButton from "@/components/floating-chat-button";
import { AppThemeProvider } from "../context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const hideChatButton =
    pathname.includes("login") ||
    pathname.includes("register") ||
    pathname.includes("otp") ||
    pathname.includes("upload-outfit") ||
    pathname.includes("chatbot");

  return (
    <AppThemeProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, position: "relative" }}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
            <Stack.Screen name="chatbot" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
          </Stack>
          {!hideChatButton && <FloatingChatButton />}
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppThemeProvider>
  );
}
