<<<<<<< HEAD
import React from "react";
import {
<<<<<<< HEAD
=======
  Image,
=======
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
>>>>>>> 2a922e7 (ui)
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
<<<<<<< HEAD
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/globalStyles";

<<<<<<< HEAD
const { width: SW } = Dimensions.get("window");
=======
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
>>>>>>> fab4ee9 (Fixed Dark mode toggle)

const TILES = [
  {
    id: "wardrobe",
    icon: "👗",
    label: "My Wardrobe",
    sub: "Browse your items",
    tileBg: "#DCE9D8",
    route: "/(tabs)/wardrobe",
  },
  {
    id: "outfits",
    icon: "✨",
    label: "AI Outfits",
    sub: "Styled for you",
    tileBg: "#D4ECEB",
    route: "/(tabs)/outfit-review",
  },
  {
    id: "colour",
    icon: "🎨",
    label: "Colour Analysis",
    sub: "Your season",
    tileBg: "#DCE9D8",
    route: "/(tabs)/colour-analysis",
  },
  {
    id: "trends",
    icon: "📈",
    label: "Trends",
    sub: "What's in style",
    tileBg: "#D4ECEB",
    route: "/(tabs)/trends",
  },
  {
    id: "packing",
    icon: "✈️",
    label: "Trip Packing",
    sub: "Pack smart",
    tileBg: "#E8E4D8",
    route: "/(tabs)/trip-packing",
  },
  {
    id: "budget",
    icon: "💳",
    label: "Budgeting",
    sub: "Track your spend",
    tileBg: "#DCE9D8",
    route: "/(tabs)/budgeting",
  },
  {
    id: "saved",
    icon: "🔖",
    label: "Saved Items",
    sub: "Your favourites",
    tileBg: "#D4ECEB",
    route: "/(tabs)/saved-items",
  },
  {
    id: "history",
    icon: "📋",
    label: "History",
    sub: "Past looks",
    tileBg: "#E8E4D8",
    route: "/(tabs)/history",
  },
] as const;

<<<<<<< HEAD
const NAV = [
  { id: "home",     label: "Home",    icon: "🏠", route: "/(tabs)/mainMenu",      active: true  },
  { id: "wardrobe", label: "Wardrobe",icon: "👗", route: "/(tabs)/wardrobe",      active: false },
  { id: "upload",   label: "Upload",  icon: "📷", route: "/(tabs)/upload-clothes",active: false },
  { id: "chat",     label: "Chat",    icon: "💬", route: "/chatbot",              active: false },
  { id: "profile",  label: "Profile", icon: "👤", route: "/(tabs)/profile",       active: false },
] as const;

export default function MainMenu() {
=======
export default function Dashboard() {
  const { themeColors, isDarkMode, toggleDarkMode } = useAppTheme();

>>>>>>> fab4ee9 (Fixed Dark mode toggle)
  const router = useRouter();
<<<<<<< HEAD
=======
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
>>>>>>> bd722ab (Add moodboards API & refactor colour analysis)

  return (
<<<<<<< HEAD
    <SafeAreaView style={s.safe}>

      {/* HEADER */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.greet}>Welcome back,</Text>
            <Text style={s.name}>TrendSense</Text>
          </View>
          <View style={s.headerIcons}>
            <TouchableOpacity
              style={s.headerIconBtn}
              onPress={() => router.push("/(tabs)/saved-items" as any)}
            >
              <Text style={{ fontSize: 16 }}>🛍️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.headerIconBtn}
              onPress={() => router.push("/(tabs)/profile" as any)}
            >
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </TouchableOpacity>
          </View>
=======
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
=======
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";

const { width: SW } = Dimensions.get("window");
const COL = (SW - 48) / 2;

const NAV = [
  { id: "home",    label: "Home",   icon: "⌂", route: "/(tabs)/mainMenu",       active: true  },
  { id: "upload",  label: "Upload", icon: "+", route: "/(tabs)/upload-clothes",  active: false },
  { id: "profile", label: "Me",     icon: "◯", route: "/(tabs)/profile",         active: false },
] as const;

export default function MainMenu() {
  const router = useRouter();
  const isAdmin = getRole() === "ADMIN";

  return (
    <SafeAreaView style={s.safe}>
>>>>>>> 2a922e7 (ui)

      {isAdmin && (
        <TouchableOpacity
          style={s.adminBanner}
          onPress={() => router.replace("/admin/dashboard" as any)}
        >
          <Text style={s.adminBannerText}>⚙️  Admin — viewing as user</Text>
          <Text style={s.adminBannerLink}>Admin View →</Text>
        </TouchableOpacity>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── HEADER ── */}
        <LinearGradient
          colors={["#1C2B25", "#2A3D35", "#3A4F44"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.header}
        >
          {/* decorative circles */}
          <View style={s.decCircle1} />
          <View style={s.decCircle2} />

          <View style={s.headerRow}>
            <View>
              <Text style={s.appName}>TRENDSENSE</Text>
              <Text style={s.tagline}>dress for the life you want</Text>
            </View>
            <TouchableOpacity
              style={s.avatarBtn}
              onPress={() => router.push("/(tabs)/profile" as any)}
            >
              <Text style={s.avatarTxt}>👤</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.searchBar}
            onPress={() => router.push("/(tabs)/wardrobe" as any)}
          >
            <Text style={s.searchIcon}>◎</Text>
            <Text style={s.searchTxt}>Search your wardrobe...</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── HERO CARD — WARDROBE ── */}
        <View style={s.section}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/(tabs)/wardrobe" as any)}
          >
            <LinearGradient
              colors={["#1C2B25", "#2E4A3E", "#4A6B5A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.heroCard}
            >
<<<<<<< HEAD
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
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
        </View>
        <TouchableOpacity
          style={s.search}
          onPress={() => router.push("/(tabs)/wardrobe" as any)}
        >
          <Text style={s.searchIco}>🔍</Text>
          <Text style={s.searchTxt}>Search your wardrobe...</Text>
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Text style={s.sec}>FEATURES</Text>

        <View style={s.grid}>
          {TILES.map((tile) => (
            <TouchableOpacity
              key={tile.id}
              style={[s.tile, { backgroundColor: tile.tileBg }]}
              activeOpacity={0.75}
              onPress={() => router.push(tile.route as any)}
            >
              <Text style={s.tileIcon}>{tile.icon}</Text>
              <Text style={s.tileLabel}>{tile.label}</Text>
              <Text style={s.tileSub}>{tile.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.sec, { marginTop: 14 }]}>QUICK ADD</Text>
        <View style={s.quickRow}>
          <TouchableOpacity
            style={s.quickBtn}
            onPress={() => router.push("/(tabs)/upload-clothes" as any)}
          >
            <Text style={s.quickBtnIco}>📷</Text>
            <Text style={s.quickBtnTxt}>Upload Clothes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.quickBtn}
            onPress={() => router.push("/(tabs)/upload-outfit" as any)}
          >
            <Text style={s.quickBtnIco}>✨</Text>
            <Text style={s.quickBtnTxt}>Upload Outfit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={s.bnav}>
        {NAV.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={s.bni}
            onPress={() => {
              if (!item.active) router.push(item.route as any);
            }}
          >
            <View style={[s.bniPill, item.active && s.bniPillActive]}>
              <Text style={s.bniIco}>{item.icon}</Text>
            </View>
            <Text style={[s.bniLbl, item.active && s.bniLblActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

=======
              <View style={s.heroDecDot1} />
              <View style={s.heroDecDot2} />
              <View style={s.heroContent}>
                <View>
                  <Text style={s.heroEyebrow}>YOUR COLLECTION</Text>
                  <Text style={s.heroTitle}>My Wardrobe</Text>
                  <Text style={s.heroSub}>Your curated closet, always with you</Text>
                </View>
                <View style={s.heroIconWrap}>
                  <Text style={s.heroIcon}>👗</Text>
                </View>
              </View>
              <View style={s.heroCta}>
                <Text style={s.heroCtaTxt}>Browse pieces  →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── 2-COL GRID ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>EXPLORE</Text>
          <View style={s.grid}>

            {/* AI Styling — tall left */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.card, s.cardTall, { backgroundColor: "#E8D5C4" }]}
              onPress={() => router.push("/(tabs)/outfit-review" as any)}
            >
              <View style={s.cardBadge}>
                <Text style={s.cardBadgeTxt}>AI</Text>
              </View>
              <Text style={s.cardIcon}>✦</Text>
              <Text style={s.cardLabel}>AI Styling</Text>
              <Text style={s.cardSub}>Outfits{"\n"}made for you</Text>
            </TouchableOpacity>

            {/* right col — two stacked */}
            <View style={s.colRight}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[s.card, s.cardShort, { backgroundColor: "#D4C9E2" }]}
                onPress={() => router.push("/(tabs)/colour-analysis" as any)}
              >
                <Text style={s.cardIcon}>◈</Text>
                <Text style={s.cardLabel}>Colour Season</Text>
                <Text style={s.cardSub}>Discover your palette</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[s.card, s.cardShort, { backgroundColor: "#C8D8C4" }]}
                onPress={() => router.push("/(tabs)/saved-items" as any)}
              >
                <Text style={s.cardIcon}>♡</Text>
                <Text style={s.cardLabel}>Saved Looks</Text>
                <Text style={s.cardSub}>Pieces you love</Text>
              </TouchableOpacity>
            </View>

            {/* History — full width strip */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.card, s.cardWide, { backgroundColor: "#2A3530" }]}
              onPress={() => router.push("/(tabs)/history" as any)}
            >
              <View style={s.cardWideInner}>
                <View>
                  <Text style={[s.cardLabel, { color: "#fff" }]}>Look History</Text>
                  <Text style={[s.cardSub, { color: "rgba(255,255,255,0.5)" }]}>
                    Revisit your past outfits
                  </Text>
                </View>
                <Text style={[s.cardIcon, { color: "rgba(255,255,255,0.6)", marginBottom: 0 }]}>○</Text>
              </View>
            </TouchableOpacity>

            {/* Budget */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.card, { backgroundColor: "#E2D9C8", width: COL }]}
              onPress={() => router.push("/(tabs)/budgeting" as any)}
            >
              <Text style={s.cardIcon}>◇</Text>
              <Text style={s.cardLabel}>Style Budget</Text>
              <Text style={s.cardSub}>Spend with purpose</Text>
            </TouchableOpacity>

            {/* Trip */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.card, { backgroundColor: "#F0D4CE", width: COL }]}
              onPress={() => router.push("/(tabs)/trip-packing" as any)}
            >
              <Text style={s.cardIcon}>◻</Text>
              <Text style={s.cardLabel}>Trip Edit</Text>
              <Text style={s.cardSub}>Pack with intention</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* ── QUICK ADD ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>ADD TO YOUR EDIT</Text>
          <View style={s.quickRow}>
            <TouchableOpacity
              style={s.quickBtnLight}
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/upload-clothes" as any)}
            >
              <Text style={s.quickIco}>📷</Text>
              <Text style={s.quickTxt}>Add Clothing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/upload-outfit" as any)}
            >
              <LinearGradient
                colors={["#2A3D35", "#1C2B25"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.quickBtnDark}
              >
                <Text style={s.quickIco}>✦</Text>
                <Text style={[s.quickTxt, { color: "#fff" }]}>Get Styled</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={s.bnav}>
        {NAV.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={s.bni}
            onPress={() => { if (!item.active) router.push(item.route as any); }}
          >
            {item.active ? (
              <LinearGradient
                colors={["#2A3D35", "#1C2B25"]}
                style={s.bniPillActive}
              >
                <Text style={[s.bniIco, { color: "#fff" }]}>{item.icon}</Text>
              </LinearGradient>
            ) : (
              <View style={s.bniPill}>
                <Text style={s.bniIco}>{item.icon}</Text>
              </View>
            )}
            <Text style={[s.bniLbl, item.active && s.bniLblActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

>>>>>>> 2a922e7 (ui)
    </SafeAreaView>
  );
}

<<<<<<< HEAD
const TILE_SIZE = (SW - 44) / 2;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // Header
  header: {
    backgroundColor: colors.bgDark,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  greet: { fontSize: 11, color: colors.blueDark, marginBottom: 2 },
  name:  { fontSize: 18, fontWeight: "900", color: colors.white },
  headerIcons: { flexDirection: "row", gap: 8 },
  headerIconBtn: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchIco: { fontSize: 13 },
  searchTxt: { fontSize: 12, color: "rgba(255,255,255,0.4)" },

  // Scroll
  scroll: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 24 },

  // Section label
  sec: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 0.7,
    marginBottom: 10,
    textTransform: "uppercase",
  },

  // Tile grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
<<<<<<< HEAD
    width: TILE_SIZE,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    borderRadius: 16,
    padding: 14,
    minHeight: 110,
    justifyContent: "flex-end",
  },
  tileIcon:  { fontSize: 26, marginBottom: 8 },
  tileLabel: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 2 },
  tileSub:   { fontSize: 11, color: colors.muted },

  // Quick row
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtn: {
    flex: 1,
<<<<<<< HEAD
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 13,
    shadowColor: colors.text,
=======
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickBtnIco: { fontSize: 18 },
  quickBtnTxt: { fontSize: 13, fontWeight: "600", color: colors.text },

<<<<<<< HEAD
  // Bottom nav
  bnav: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: "#E8EDE9",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 22 : 12,
  },
  bni:  { flex: 1, alignItems: "center", gap: 2 },
  bniPill: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 16 },
  bniPillActive: { backgroundColor: "#DCE9D8" },
  bniIco: { fontSize: 19 },
  bniLbl: { fontSize: 9, color: "#B0BCB4", fontWeight: "500" },
  bniLblActive: { color: colors.accent, fontWeight: "700" },
});
=======
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

=======
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F2EE" },

  scroll: { paddingBottom: 32 },

  // Admin
  adminBanner: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#1a3a5c", paddingVertical: 8, paddingHorizontal: 14,
  },
  adminBannerText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  adminBannerLink: { color: "#a8d0f0", fontWeight: "700", fontSize: 12 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 20,
  },
  decCircle1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.03)", top: -60, right: -40,
  },
  decCircle2: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)", bottom: -20, left: 60,
  },
  headerRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 16,
  },
>>>>>>> 2a922e7 (ui)
  appName: {
    fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: 5,
  },
  tagline: {
    fontSize: 10, color: colors.blueDark, letterSpacing: 1.5,
    marginTop: 4, fontStyle: "italic",
  },
  avatarBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  avatarTxt: { fontSize: 15 },
  searchBar: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  searchIcon: { fontSize: 13, color: colors.blueDark },
  searchTxt: { fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 0.3 },

  // Section
  section: { paddingHorizontal: 14, marginBottom: 20 },
  sectionLabel: {
    fontSize: 9, fontWeight: "700", color: colors.muted,
    letterSpacing: 2.5, marginBottom: 12, textTransform: "uppercase",
  },

  // Hero card
  heroCard: {
    borderRadius: 24, padding: 20, overflow: "hidden",
    shadowColor: "#1C2B25", shadowOpacity: 0.25,
    shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  heroDecDot1: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)", top: -30, right: 20,
  },
  heroDecDot2: {
    position: "absolute", width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)", bottom: 10, right: 80,
  },
  heroContent: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  heroEyebrow: {
    fontSize: 8, color: colors.blueDark, letterSpacing: 2.5,
    fontWeight: "700", marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: 0.5,
  },
  heroSub: {
    fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: 0.2,
  },
  heroIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
  },
  heroIcon: { fontSize: 28 },
  heroCta: {
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 12,
  },
  heroCtaTxt: {
    color: colors.blueDark, fontWeight: "600", fontSize: 13, letterSpacing: 0.3,
  },

  // Cards
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cardTall: { width: COL, minHeight: 200, justifyContent: "flex-end" },
  cardShort: { width: COL, minHeight: 92 },
  cardWide: { width: "100%" },
  cardWideInner: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  colRight: { gap: 10 },
  cardBadge: {
    position: "absolute", top: 14, right: 14,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  cardBadgeTxt: { fontSize: 9, fontWeight: "800", color: "#5A3A2A", letterSpacing: 1 },
  cardIcon: { fontSize: 22, marginBottom: 8, color: colors.text },
  cardLabel: { fontSize: 13, fontWeight: "700", color: colors.text, letterSpacing: 0.2, marginBottom: 3 },
  cardSub: { fontSize: 11, color: colors.muted, lineHeight: 15 },

  // Quick add
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtnLight: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#fff", borderRadius: 16, paddingVertical: 15,
    borderWidth: 1, borderColor: "#E8E4DE",
    shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  quickBtnDark: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 16, paddingVertical: 15,
  },
  quickIco: { fontSize: 16 },
  quickTxt: { fontSize: 13, fontWeight: "600", color: colors.text, letterSpacing: 0.2 },

  // Bottom nav
  bnav: {
    flexDirection: "row", backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: "#EDEAE6",
    paddingTop: 10, paddingBottom: Platform.OS === "ios" ? 26 : 12,
    shadowColor: "#000", shadowOpacity: 0.05,
    shadowRadius: 10, shadowOffset: { width: 0, height: -3 },
  },
<<<<<<< HEAD

  contentInner: {
    padding: 28,
    maxWidth: 860,
  },
});
>>>>>>> fab4ee9 (Fixed Dark mode toggle)
=======
  bni: { flex: 1, alignItems: "center", gap: 3 },
  bniPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  bniPillActive: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  bniIco: { fontSize: 17, color: "#B8BDB9" },
  bniLbl: { fontSize: 9, color: "#B8BDB9", fontWeight: "500", letterSpacing: 0.5 },
  bniLblActive: { color: "#2A3530", fontWeight: "700" },
});
>>>>>>> 2a922e7 (ui)
