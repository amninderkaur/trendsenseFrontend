import { isWeb } from "@/utils/platform";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMG_WIDTH  = Math.min(SCREEN_WIDTH, isWeb ? 420 : SCREEN_WIDTH) - 48;
const IMG_HEIGHT = IMG_WIDTH * (4 / 3);

const GOLD = "#C9A96E";
const BRACKET = 28;
const THICKNESS = 3;

type Props = {
  imageUri: string;
  message?: string;
  submessage?: string;
};

export default function ScannerOverlay({
  imageUri,
  message = "Analysing your clothing",
  submessage = "AI is detecting your item",
}: Props) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState("");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const scanLineY = scanAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, IMG_HEIGHT - 3],
  });

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>TRENDSENSE</Text>
      <Text style={styles.subtitle}>Scanner</Text>

      <View style={[styles.imgWrap, { width: IMG_WIDTH, height: IMG_HEIGHT }]}>
        <Image source={{ uri: imageUri }} style={styles.img} resizeMode="cover" />

        <View style={styles.vignette} />

        {/* Corner brackets */}
        <View style={[styles.corner, { top: 0,    left:  0, borderTopWidth:    THICKNESS, borderLeftWidth:  THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <View style={[styles.corner, { top: 0,    right: 0, borderTopWidth:    THICKNESS, borderRightWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <View style={[styles.corner, { bottom: 0, left:  0, borderBottomWidth: THICKNESS, borderLeftWidth:  THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />
        <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS, borderColor: GOLD, width: BRACKET, height: BRACKET }]} />

        {/* Scan line */}
        <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}>
          <LinearGradient
            colors={["transparent", "rgba(201,169,110,0.9)", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 2, width: "100%" }}
          />
        </Animated.View>
      </View>

      <View style={styles.statusWrap}>
        <Text style={styles.statusText}>{message}{dots}</Text>
        <Text style={styles.statusSub}>{submessage}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#060C09",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 6,
    marginBottom: 4,
  },
  subtitle: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 3,
    fontStyle: "italic",
    marginBottom: 32,
  },
  imgWrap: {
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  corner: {
    position: "absolute",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  statusWrap: {
    marginTop: 32,
    alignItems: "center",
  },
  statusText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statusSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
