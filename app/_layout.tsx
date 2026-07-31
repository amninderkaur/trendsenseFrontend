import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack, usePathname } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { Platform, View, useWindowDimensions } from "react-native";

import "react-native-reanimated";

import ErrorBoundary from "@/components/ErrorBoundary";
import FloatingChatButton from "@/components/floating-chat-button";
import MobileBottomNav from "@/components/MainMenu/MobileBottomNav";
import { AppThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

import "../global.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppThemeProvider>
        <RootLayoutNav />
      </AppThemeProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { themeColors } = useAppTheme();
  const isMobileViewport = Platform.OS !== "web" || width < 768;

  const hideChatButton =
    pathname === "/" ||
    pathname.includes("login") ||
    pathname.includes("register") ||
    pathname.includes("otp") ||
    pathname.includes("upload-outfit") ||
    pathname.includes("chatbot");
  const showMobileBottomNav =
    isMobileViewport &&
    ["/mainMenu", "/chatbot", "/profile"].includes(pathname);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, position: "relative" }}>
        {/* Explicit contentStyle keeps every screen's native base layer in
            sync with the app's own theme. Without it, native-stack falls
            back to the React Navigation theme's background — which is
            pure black in DarkTheme — regardless of what the app's own
            (separately-tracked) theme renders on top, causing a black
            flash/strip behind the status bar/notch when the OS is in dark
            mode but the app's theme isn't. */}
        <Stack screenOptions={{ contentStyle: { backgroundColor: themeColors.bg } }}>
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

        {Platform.OS === "web" &&
          !isMobileViewport &&
          !hideChatButton && <FloatingChatButton />}
        {showMobileBottomNav && <MobileBottomNav />}
      </View>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
