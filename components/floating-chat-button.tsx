import { MaterialIcons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "@/constants/globalStyles";

export default function FloatingChatButton() {
  const pathname = usePathname();

  if (pathname === "/chatbot") {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <Link href="/chatbot" asChild>
        <Pressable
          style={styles.button}
          accessibilityRole="button"
          accessibilityLabel="Open chatbot"
        >
          <MaterialIcons name="chat" size={24} color={colors.white} />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 28,
    zIndex: 50,
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blueDark,
    shadowColor: colors.text,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },
});
