import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack, usePathname, useRouter } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

import "react-native-reanimated";

import FloatingChatButton from "@/components/floating-chat-button";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { clearSession, getToken, isSessionExpired } from "@/utils/token";

import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token || isSessionExpired()) {
      clearSession();
      router.replace("/(auth)/login");
    }
  }, []);

  const hideChatButton =
    pathname === "/" ||
    pathname.includes("login") ||
    pathname.includes("register") ||
    pathname.includes("otp") ||
    pathname.includes("upload-outfit") ||
    pathname.includes("chatbot");

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, position: "relative" }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="chatbot" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>

        {!hideChatButton && <FloatingChatButton />}
      </View>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
