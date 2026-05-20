import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import PersonalizationModal from "../(auth)/PersonalizationModal";
import { colors, globalStyles } from "../../constants/globalStyles";
import { getPreferencesCompleted, getToken, removeEmail, removeToken, removeUserId } from "../../utils/token";

const isWeb = Platform.OS === "web";

export default function Dashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = !isWeb && width >= 768;
  const isLoggedIn = !!getToken();
  const [showPersonalization, setShowPersonalization] = React.useState(false);

  React.useEffect(() => {
    const checkPreferences = async () => {
      const completed = await getPreferencesCompleted();
      if (isLoggedIn && !completed) setShowPersonalization(true);
    };
    checkPreferences();
  }, [isLoggedIn]);

  const iconSize = isLargeScreen ? 28 : 20;

  const handleSignOut = () => {
    removeToken();
    removeUserId();
    removeEmail();
    router.replace("/(auth)/login");
  };

  const navItems = [
    { href: "/", icon: "dashboard", label: "Dashboard", lib: "material" },
    { href: "/upload-clothes", icon: "add-a-photo", label: "Upload Clothes", lib: "material" },
    { href: "/upload-outfit", icon: "checkroom", label: "Outfit Suggestion", lib: "material" },
    { href: "/budgeting", icon: "wallet", label: "Budgeting", lib: "fa5" },
    { href: "/reviews", icon: "rate-review", label: "Reviews", lib: "material" },
    { href: "/profile", icon: "person", label: "Account Profile", lib: "material" },
    { href: "/admin/dashboard", icon: "admin-panel-settings", label: "Admin", lib: "material" },
  ] as const;

  const StatsTiles = () => (
    <View style={[styles.tilesContainer, isLargeScreen && styles.largeTilesContainer]}>
      {[{ n: "120", label: "Orders" }, { n: "24", label: "New Customers" }, { n: "8", label: "Pending" }].map((t) => (
        <View key={t.label} style={[styles.tile, isLargeScreen && styles.largeTile]}>
          <Text style={[styles.tileNumber, isLargeScreen && styles.largeTileNumber]}>{t.n}</Text>
          <Text style={[styles.tileLabel, isLargeScreen && styles.largeTileLabel]}>{t.label}</Text>
        </View>
      ))}
    </View>
  );

  const HeroVideo = () => (
    <View style={[styles.videoCard, isLargeScreen && styles.largeVideoCard]}>
      <Video
        source={require("../../assets/videos/dashboard.mp4")}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
        style={styles.video}
      />
    </View>
  );

  if (isWeb) {
    return (
      <View style={web.root}>
        <PersonalizationModal visible={showPersonalization} onClose={() => setShowPersonalization(false)} />
        <View style={web.sidebar}>
          <Text style={web.appName}>TrendSense</Text>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} asChild>
              <Pressable style={web.navItem}>
                {item.lib === "material" ? <MaterialIcons name={item.icon as any} size={18} color={colors.blueDark} style={styles.icon} /> : <FontAwesome5 name={item.icon as any} size={16} color={colors.blueDark} style={styles.icon} />}
                <Text style={web.navLabel}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}
          <View style={web.divider} />
          {isLoggedIn ? (
            <Pressable style={web.navItem} onPress={handleSignOut}>
              <MaterialIcons name="logout" size={18} color={colors.blueDark} style={styles.icon} />
              <Text style={web.navLabel}>Sign Out</Text>
            </Pressable>
          ) : (
            <Link href="/login" asChild>
              <Pressable style={web.navItem}><MaterialIcons name="login" size={18} color={colors.blueDark} style={styles.icon} /><Text style={web.navLabel}>Login</Text></Pressable>
            </Link>
          )}
        </View>
        <ScrollView style={web.content} contentContainerStyle={web.contentInner}>
          <HeroVideo />
          <StatsTiles />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={[globalStyles.dashboardContainer, isLargeScreen && globalStyles.largeDashboardContainer]}>
      <PersonalizationModal visible={showPersonalization} onClose={() => setShowPersonalization(false)} />
      <View style={globalStyles.dashboardContent}>
        <HeroVideo />
        <StatsTiles />
        <View style={styles.menu}>
          <Text style={[globalStyles.sectionTitle, isLargeScreen && globalStyles.largeSectionTitle]}>Menu</Text>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} asChild>
              <Pressable style={StyleSheet.flatten([globalStyles.menuItem, isLargeScreen && globalStyles.largeMenuItem])}>
                {item.lib === "material" ? <MaterialIcons name={item.icon as any} size={iconSize} color={colors.blueDark} style={styles.icon} /> : <FontAwesome5 name={item.icon as any} size={iconSize - 2} color={colors.blueDark} style={styles.icon} />}
                <Text style={StyleSheet.flatten([globalStyles.menuText, isLargeScreen && globalStyles.largeMenuText])}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}
          {isLoggedIn && (
            <Pressable style={StyleSheet.flatten([globalStyles.menuItem, isLargeScreen && globalStyles.largeMenuItem])} onPress={handleSignOut}>
              <MaterialIcons name="logout" size={iconSize} color={colors.blueDark} style={styles.icon} />
              <Text style={StyleSheet.flatten([globalStyles.menuText, isLargeScreen && globalStyles.largeMenuText])}>Sign Out</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  videoCard: { width: "100%", height: 220, borderRadius: 22, overflow: "hidden", backgroundColor: colors.blue, marginVertical: 16 },
  largeVideoCard: { height: 320, borderRadius: 30 },
  video: { width: "100%", height: "100%" },
  tilesContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10, gap: 10 },
  largeTilesContainer: { gap: 16 },
  tile: { backgroundColor: colors.card, borderRadius: 16, padding: 15, alignItems: "center", flex: 1, shadowColor: colors.text, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  largeTile: { padding: 28, borderRadius: 24 },
  tileNumber: { fontSize: 22, fontWeight: "700", color: colors.blueDark },
  largeTileNumber: { fontSize: 34 },
  tileLabel: { fontSize: 14, color: colors.muted, textAlign: "center" },
  largeTileLabel: { fontSize: 18 },
  menu: { marginTop: 20 },
  icon: { marginRight: 10 },
});

const web = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: colors.bg },
  sidebar: { width: 220, backgroundColor: colors.card, paddingTop: 24, paddingHorizontal: 14, paddingBottom: 24, borderRightWidth: 1, borderRightColor: colors.bgDark },
  appName: { fontSize: 18, fontWeight: "800", color: colors.blueDark, marginBottom: 24, paddingHorizontal: 6 },
  navItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, marginBottom: 4 },
  navLabel: { fontSize: 14, color: colors.text, fontWeight: "500" },
  divider: { height: 1, backgroundColor: colors.bgDark, marginVertical: 12 },
  content: { flex: 1, backgroundColor: colors.bg },
  contentInner: { padding: 28, maxWidth: 860 },
});
