import { colors } from "../constants/globalStyles";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { clearSession, getToken, hydrateSession, isSessionExpired } from "../utils/token";

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    let cancelled = false;
    // Kick off loading the persisted session immediately so it's ready
    // (or nearly ready) by the time the splash delay below elapses.
    const hydration = hydrateSession();

    const timer = setTimeout(async () => {
      await hydration;
      if (cancelled) return;

      const token = getToken();
      if (!token || isSessionExpired()) {
        clearSession();
        router.replace("/(auth)/login");
      } else {
        router.replace("/(tabs)/mainMenu");
      }
    }, 1200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/trendsense-logo.png")} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  logo: { width: 240, height: 240 },
});
