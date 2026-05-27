import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import PersonalizationModal from "../(auth)/PersonalizationModal";
import { getProfile } from "../../api/profile";
import { globalStyles } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";
import {
  getRole,
  getToken,
  removeEmail,
  removeToken,
  removeUserId,
} from "../../utils/token";

const isWeb = Platform.OS === "web";

export default function Dashboard() {
  const { themeColors, isDarkMode, toggleDarkMode } = useAppTheme();

  const router = useRouter();
  const { width } = useWindowDimensions();

  const isLargeScreen = !isWeb && width >= 768;
  const isLoggedIn = !!getToken();
  const isAdmin = getRole() === "ADMIN";
  const iconSize = isLargeScreen ? 28 : 20;

  const [showPersonalization, setShowPersonalization] = React.useState(false);
  const [welcomeName, setWelcomeName] = React.useState("");

  React.useEffect(() => {
    const checkProfile = async () => {
      if (!isLoggedIn || isAdmin) return;

      try {
        const profile = await getProfile();

        if (profile?.displayName) {
          setWelcomeName(profile.displayName);
        } else {
          setShowPersonalization(true);
        }
      } catch {
        setShowPersonalization(true);
      }
    };

    checkProfile();
  }, [isLoggedIn, isAdmin]);

  const handleSignOut = () => {
    removeToken();
    removeUserId();
    removeEmail();

    router.replace("/(auth)/login");
  };

  const navItems = [
    { href: "/", icon: "dashboard", label: "Dashboard", lib: "material" },
    { href: "/upload-clothes", icon: "add-a-photo", label: "Upload Clothes", lib: "material" },
    { href: "/wardrobe", icon: "checkroom", label: "Wardrobe", lib: "material" },
    { href: "/upload-outfit", icon: "style", label: "Outfit Suggestion", lib: "material" },
    { href: "/outfit-review", icon: "search", label: "Outfit Review", lib: "material" },
    { href: "/history", icon: "favorite", label: "Saved Outfits", lib: "material" },
    { href: "/budgeting", icon: "wallet", label: "Budgeting", lib: "fa5" },
    { href: "/trip-packing", icon: "luggage", label: "Trip Packing", lib: "material" },
    { href: "/saved-items", icon: "bookmark", label: "Saved Items", lib: "material" },
    { href: "/colour-analysis", icon: "palette", label: "Colour Analysis", lib: "material" },
    { href: "/moodboards", icon: "palette", label: "Mood Boards", lib: "material" },
    { href: "/profile", icon: "person", label: "Account Profile", lib: "material" },
  ] as const;

  const StatsTiles = () => (
    <View
      style={[
        styles.tilesContainer,
        isLargeScreen && styles.largeTilesContainer,
      ]}
    >
      {[
        { n: "120", label: "Orders" },
        { n: "24", label: "New Customers" },
        { n: "8", label: "Pending" },
      ].map((tile) => (
        <View
          key={tile.label}
          style={[
            styles.tile,
            isLargeScreen && styles.largeTile,
            {
              backgroundColor: themeColors.card,
              shadowColor: themeColors.text,
            },
          ]}
        >
          <Text
            style={[
              styles.tileNumber,
              isLargeScreen && styles.largeTileNumber,
              { color: themeColors.blueDark },
            ]}
          >
            {tile.n}
          </Text>

          <Text
            style={[
              styles.tileLabel,
              isLargeScreen && styles.largeTileLabel,
              { color: themeColors.muted },
            ]}
          >
            {tile.label}
          </Text>
        </View>
      ))}
    </View>
  );

  const HeroVideo = () => (
    <View
      style={[
        styles.videoCard,
        isLargeScreen && styles.largeVideoCard,
      ]}
    >
      <Video
        source={require("../../assets/videos/dashboard.mp4")}
        resizeMode="contain"
        shouldPlay
        isLooping
        isMuted
        style={styles.video}
      />
    </View>
  );

  const ThemeToggle = () => (
    <View
      style={[
        styles.themeToggle,
        { backgroundColor: themeColors.card },
      ]}
    >
      <Text style={[styles.themeToggleText, { color: themeColors.text }]}>
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </Text>

      <Switch
        value={isDarkMode}
        onValueChange={toggleDarkMode}
        thumbColor={themeColors.white}
        trackColor={{
          false: themeColors.input,
          true: themeColors.blueDark,
        }}
      />
    </View>
  );

  if (isWeb) {
    return (
      <View style={[web.root, { backgroundColor: themeColors.bg }]}>
        <PersonalizationModal
          visible={showPersonalization}
          onClose={() => setShowPersonalization(false)}
        />

        <View
          style={[
            web.sidebar,
            {
              backgroundColor: themeColors.card,
              borderRightColor: themeColors.bgDark,
            },
          ]}
        >
          <View style={web.logoContainer}>
            <Image
              source={require("../../assets/images/trendsense-logo.png")}
              style={web.logo}
              resizeMode="contain"
            />

            <Text style={[web.appName, { color: themeColors.blueDark }]}>
              TrendSense
            </Text>
          </View>

          <ThemeToggle />

          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} asChild>
              <Pressable style={web.navItem}>
                {item.lib === "material" ? (
                  <MaterialIcons
                    name={item.icon as any}
                    size={18}
                    color={themeColors.blueDark}
                    style={styles.icon}
                  />
                ) : (
                  <FontAwesome5
                    name={item.icon as any}
                    size={16}
                    color={themeColors.blueDark}
                    style={styles.icon}
                  />
                )}

                <Text style={[web.navLabel, { color: themeColors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          ))}

          <View style={[web.divider, { backgroundColor: themeColors.bgDark }]} />

          {isLoggedIn ? (
            <Pressable style={web.navItem} onPress={handleSignOut}>
              <MaterialIcons
                name="logout"
                size={18}
                color={themeColors.blueDark}
                style={styles.icon}
              />

              <Text style={[web.navLabel, { color: themeColors.text }]}>
                Sign Out
              </Text>
            </Pressable>
          ) : (
            <Link href="/login" asChild>
              <Pressable style={web.navItem}>
                <MaterialIcons
                  name="login"
                  size={18}
                  color={themeColors.blueDark}
                  style={styles.icon}
                />

                <Text style={[web.navLabel, { color: themeColors.text }]}>
                  Login
                </Text>
              </Pressable>
            </Link>
          )}

          {isAdmin && (
            <Pressable
              style={[
                styles.adminButton,
                { backgroundColor: themeColors.blueDark },
              ]}
              onPress={() => router.replace("/admin/dashboard" as any)}
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={18}
                color={themeColors.white}
                style={styles.icon}
              />

              <Text style={[styles.adminButtonText, { color: themeColors.white }]}>
                Go to Admin View
              </Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          style={[web.content, { backgroundColor: themeColors.bg }]}
          contentContainerStyle={web.contentInner}
        >
          {welcomeName ? (
            <Text style={[styles.welcome, { color: themeColors.text }]}>
              Welcome, {welcomeName} 👋
            </Text>
          ) : null}

          <HeroVideo />
          <StatsTiles />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={[globalStyles.screen, { backgroundColor: themeColors.bg }]}
      contentContainerStyle={[
        globalStyles.dashboardContainer,
        isLargeScreen && globalStyles.largeDashboardContainer,
      ]}
    >
      <PersonalizationModal
        visible={showPersonalization}
        onClose={() => setShowPersonalization(false)}
      />

      <View style={globalStyles.dashboardContent}>
        {welcomeName ? (
          <Text style={[styles.welcome, { color: themeColors.text }]}>
            Welcome, {welcomeName} 👋
          </Text>
        ) : null}

        <HeroVideo />
        <StatsTiles />
        <ThemeToggle />

        <View style={styles.menu}>
          <Text
            style={[
              globalStyles.sectionTitle,
              isLargeScreen && globalStyles.largeSectionTitle,
              { color: themeColors.text },
            ]}
          >
            Menu
          </Text>

          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} asChild>
              <Pressable
                style={[
                  globalStyles.menuItem,
                  isLargeScreen && globalStyles.largeMenuItem,
                  { backgroundColor: themeColors.card },
                ]}
              >
                {item.lib === "material" ? (
                  <MaterialIcons
                    name={item.icon as any}
                    size={iconSize}
                    color={themeColors.blueDark}
                    style={styles.icon}
                  />
                ) : (
                  <FontAwesome5
                    name={item.icon as any}
                    size={iconSize - 2}
                    color={themeColors.blueDark}
                    style={styles.icon}
                  />
                )}

                <Text
                  style={[
                    globalStyles.menuText,
                    isLargeScreen && globalStyles.largeMenuText,
                    { color: themeColors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          ))}

          {isLoggedIn && (
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
                { backgroundColor: themeColors.card },
              ]}
              onPress={handleSignOut}
            >
              <MaterialIcons
                name="logout"
                size={iconSize}
                color={themeColors.blueDark}
                style={styles.icon}
              />

              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                  { color: themeColors.text },
                ]}
              >
                Sign Out
              </Text>
            </Pressable>
          )}

          {isAdmin && (
            <Pressable
              style={[
                styles.adminButton,
                { backgroundColor: themeColors.blueDark },
              ]}
              onPress={() => router.replace("/admin/dashboard" as any)}
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={iconSize}
                color={themeColors.white}
                style={styles.icon}
              />

              <Text style={[styles.adminButtonText, { color: themeColors.white }]}>
                Go to Admin View
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#000",
    marginVertical: 16,
  },

  largeVideoCard: {
    maxHeight: 500,
    borderRadius: 30,
  },

  video: {
    width: "100%",
    height: "100%",
  },

  tilesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    gap: 10,
  },

  largeTilesContainer: {
    gap: 16,
  },

  tile: {
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    flex: 1,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  largeTile: {
    padding: 28,
    borderRadius: 24,
  },

  tileNumber: {
    fontSize: 22,
    fontWeight: "700",
  },

  largeTileNumber: {
    fontSize: 34,
  },

  tileLabel: {
    fontSize: 14,
    textAlign: "center",
  },

  largeTileLabel: {
    fontSize: 18,
  },

  welcome: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 4,
  },

  menu: {
    marginTop: 20,
  },

  icon: {
    marginRight: 10,
  },

  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  themeToggleText: {
    fontSize: 14,
    fontWeight: "700",
  },

  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 12,
  },

  adminButtonText: {
    fontWeight: "800",
    fontSize: 15,
  },
});

const web = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },

  sidebar: {
    width: 220,
    paddingTop: 24,
    paddingHorizontal: 14,
    paddingBottom: 24,
    borderRightWidth: 1,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 6,
  },

  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  appName: {
    fontSize: 20,
    fontWeight: "800",
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
  },

  navLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  content: {
    flex: 1,
  },

  contentInner: {
    padding: 28,
    maxWidth: 860,
  },
});