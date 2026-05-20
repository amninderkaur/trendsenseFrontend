import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/register");
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
