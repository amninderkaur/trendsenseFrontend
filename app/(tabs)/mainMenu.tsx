import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { colors, globalStyles } from "../../constants/globalStyles";
import { getToken, removeToken, removeUserId } from "../../utils/token";

const isWeb = Platform.OS === "web";

export default function Dashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // isLargeScreen only used for native tablet scaling
  const isLargeScreen = !isWeb && width >= 768;
  const isLoggedIn = !!getToken();
  const iconSize = isLargeScreen ? 28 : 20;

  const handleSignOut = () => {
    removeToken();
    removeUserId();
    router.replace("/(auth)/login");
  };

  // ── Shared nav items data ─────────────────────────────────────────────────
  const navItems = [
    { href: "/", icon: "dashboard", label: "Dashboard", lib: "material" },
    { href: "/upload-clothes", icon: "add-a-photo", label: "Upload Clothes", lib: "material" },
    { href: "/upload-outfit", icon: "checkroom", label: "Outfit Suggestion", lib: "material" },
    { href: "/trends", icon: "chart-line", label: "Trends", lib: "fa5" },
    { href: "/profile", icon: "person", label: "Account Profile", lib: "material" },
  ] as const;

  // ── Stats tiles ───────────────────────────────────────────────────────────
  const StatsTiles = () => (
    <View style={[styles.tilesContainer, isLargeScreen && styles.largeTilesContainer]}>
      {[{ n: "120", label: "Orders" }, { n: "24", label: "New Customers" }, { n: "8", label: "Pending" }].map(
        (t) => (
          <View key={t.label} style={[styles.tile, isLargeScreen && styles.largeTile]}>
            <Text style={[styles.tileNumber, isLargeScreen && styles.largeTileNumber]}>{t.n}</Text>
            <Text style={[styles.tileLabel, isLargeScreen && styles.largeTileLabel]}>{t.label}</Text>
          </View>
        )
      )}
    </View>
  );

  // ── Overview card ─────────────────────────────────────────────────────────
  const OverviewCard = () => (
    <View style={[globalStyles.dashboardCard, isLargeScreen && globalStyles.largeDashboardCard]}>
      <Text style={[globalStyles.cardTitle, isLargeScreen && globalStyles.largeCardTitle]}>Overview</Text>
      <Text style={[globalStyles.cardText, isLargeScreen && globalStyles.largeCardText]}>
        Here's a quick summary of your dashboard.
      </Text>
      <Link href="/wardrobe" asChild>
        <Pressable style={StyleSheet.flatten([globalStyles.primaryButton, isLargeScreen && globalStyles.largePrimaryButton])}>
          <Text style={StyleSheet.flatten([globalStyles.primaryButtonText, isLargeScreen && globalStyles.largePrimaryButtonText])}>
            Go to Wardrobe
          </Text>
        </Pressable>
      </Link>
      <Link href="/history" asChild>
        <Pressable style={StyleSheet.flatten([globalStyles.primaryButton, styles.secondButton, isLargeScreen && globalStyles.largePrimaryButton])}>
          <Text style={StyleSheet.flatten([globalStyles.primaryButtonText, isLargeScreen && globalStyles.largePrimaryButtonText])}>
            Go to History
          </Text>
        </Pressable>
      </Link>
    </View>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // WEB LAYOUT — sidebar + content
  // ─────────────────────────────────────────────────────────────────────────
  if (isWeb) {
    return (
      <View style={web.root}>
        {/* Sidebar */}
        <View style={web.sidebar}>
          <Text style={web.appName}>FashionApp</Text>

          {navItems.map((item) => (
            <Link key={item.href} href={item.href} asChild>
              <Pressable style={web.navItem}>
                {item.lib === "material" ? (
                  <MaterialIcons name={item.icon as any} size={18} color={colors.blueDark} style={styles.icon} />
                ) : (
                  <FontAwesome5 name={item.icon as any} size={16} color={colors.blueDark} style={styles.icon} />
                )}
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
            <>
              <Link href="/login" asChild>
                <Pressable style={web.navItem}>
                  <MaterialIcons name="login" size={18} color={colors.blueDark} style={styles.icon} />
                  <Text style={web.navLabel}>Login</Text>
                </Pressable>
              </Link>
              <Link href="/register" asChild>
                <Pressable style={web.navItem}>
                  <MaterialIcons name="person-add" size={18} color={colors.blueDark} style={styles.icon} />
                  <Text style={web.navLabel}>Sign Up</Text>
                </Pressable>
              </Link>
            </>
          )}
        </View>

        {/* Main content */}
        <ScrollView style={web.content} contentContainerStyle={web.contentInner}>
          <Text style={web.pageTitle}>Dashboard</Text>

          <OverviewCard />

          <View style={web.slideshow}>
            <Text style={web.slideshowText}>Slideshow Placeholder</Text>
          </View>

          <StatsTiles />
        </ScrollView>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NATIVE LAYOUT — scrollable cards (unchanged)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={[
        globalStyles.dashboardContainer,
        isLargeScreen && globalStyles.largeDashboardContainer,
      ]}
    >
      <View style={globalStyles.dashboardContent}>
        <View style={styles.header}>
          <Text style={[globalStyles.pageTitle, isLargeScreen && globalStyles.largePageTitle]}>
            Dashboard
          </Text>
          <Text style={[globalStyles.bodyText, isLargeScreen && styles.largeTimeText]}>
            09:00 AM
          </Text>
        </View>

        <OverviewCard />

        <View style={[styles.slideshow, isLargeScreen && styles.largeSlideshow]}>
          <Text style={[styles.slideshowText, isLargeScreen && styles.largeSlideshowText]}>
            Slideshow Placeholder
          </Text>
        </View>

        <StatsTiles />

        <View style={styles.menu}>
          <Text style={[globalStyles.sectionTitle, isLargeScreen && globalStyles.largeSectionTitle]}>
            Menu
          </Text>

          {navItems.map((item) => (
            <Link key={item.href} href={item.href} asChild>
              <Pressable style={StyleSheet.flatten([globalStyles.menuItem, isLargeScreen && globalStyles.largeMenuItem])}>
                {item.lib === "material" ? (
                  <MaterialIcons name={item.icon as any} size={iconSize} color={colors.blueDark} style={styles.icon} />
                ) : (
                  <FontAwesome5 name={item.icon as any} size={iconSize - 2} color={colors.blueDark} style={styles.icon} />
                )}
                <Text style={StyleSheet.flatten([globalStyles.menuText, isLargeScreen && globalStyles.largeMenuText])}>
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          ))}

          {isLoggedIn ? (
            <Pressable
              style={StyleSheet.flatten([globalStyles.menuItem, isLargeScreen && globalStyles.largeMenuItem])}
              onPress={handleSignOut}
            >
              <MaterialIcons name="logout" size={iconSize} color={colors.blueDark} style={styles.icon} />
              <Text style={StyleSheet.flatten([globalStyles.menuText, isLargeScreen && globalStyles.largeMenuText])}>
                Sign Out
              </Text>
            </Pressable>
          ) : (
            <>
              <Link href="/login" asChild>
                <Pressable style={StyleSheet.flatten([globalStyles.menuItem, isLargeScreen && globalStyles.largeMenuItem])}>
                  <MaterialIcons name="login" size={iconSize} color={colors.blueDark} style={styles.icon} />
                  <Text style={StyleSheet.flatten([globalStyles.menuText, isLargeScreen && globalStyles.largeMenuText])}>Login</Text>
                </Pressable>
              </Link>
              <Link href="/register" asChild>
                <Pressable style={StyleSheet.flatten([globalStyles.menuItem, isLargeScreen && globalStyles.largeMenuItem])}>
                  <MaterialIcons name="person-add" size={iconSize} color={colors.blueDark} style={styles.icon} />
                  <Text style={StyleSheet.flatten([globalStyles.menuText, isLargeScreen && globalStyles.largeMenuText])}>Signup</Text>
                </Pressable>
              </Link>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// ── Shared native styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: { paddingVertical: 15 },
  largeTimeText: { fontSize: 18 },
  secondButton: { marginTop: 0 },
  slideshow: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  largeSlideshow: { height: 240, borderRadius: 28 },
  slideshowText: { color: colors.blueDark, fontWeight: "700" },
  largeSlideshowText: { fontSize: 22 },
  tilesContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10, gap: 10 },
  largeTilesContainer: { gap: 16 },
  tile: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    flex: 1,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  largeTile: { padding: 28, borderRadius: 24 },
  tileNumber: { fontSize: 22, fontWeight: "700", color: colors.blueDark },
  largeTileNumber: { fontSize: 34 },
  tileLabel: { fontSize: 14, color: colors.muted, textAlign: "center" },
  largeTileLabel: { fontSize: 18 },
  menu: { marginTop: 20 },
  icon: { marginRight: 10 },
});

// ── Web-only styles ─────────────────────────────────────────────────────────
const web = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.bg,
  },
  sidebar: {
    width: 220,
    backgroundColor: colors.card,
    paddingTop: 24,
    paddingHorizontal: 14,
    paddingBottom: 24,
    borderRightWidth: 1,
    borderRightColor: colors.bgDark,
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.blueDark,
    marginBottom: 24,
    paddingHorizontal: 6,
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
    color: colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.bgDark,
    marginVertical: 12,
  },
  content: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  contentInner: {
    padding: 28,
    maxWidth: 860,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  slideshow: {
    backgroundColor: colors.blue,
    borderRadius: 14,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 14,
  },
  slideshowText: {
    color: colors.blueDark,
    fontWeight: "700",
    fontSize: 15,
  },
});
