import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { clearSession, getToken, isSessionExpired } from "../utils/token";

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const token = getToken();
      if (!token || isSessionExpired()) {
        clearSession();
        router.replace("/(auth)/login");
      } else {
        router.replace("/(tabs)/mainMenu");
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/trendsense-logo.png")} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#c1d1bf" },
  logo: { width: 240, height: 240 },
});
