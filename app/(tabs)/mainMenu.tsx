import React from "react";
import {
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

const { width: SW } = Dimensions.get("window");

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

const NAV = [
  { id: "home",     label: "Home",    icon: "🏠", route: "/(tabs)/mainMenu",      active: true  },
  { id: "wardrobe", label: "Wardrobe",icon: "👗", route: "/(tabs)/wardrobe",      active: false },
  { id: "upload",   label: "Upload",  icon: "📷", route: "/(tabs)/upload-clothes",active: false },
  { id: "chat",     label: "Chat",    icon: "💬", route: "/chatbot",              active: false },
  { id: "profile",  label: "Profile", icon: "👤", route: "/(tabs)/profile",       active: false },
] as const;

export default function MainMenu() {
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
    {
      href: "/",
      icon: "dashboard",
      label: "Dashboard",
      lib: "material",
    },
    {
      href: "/upload-clothes",
      icon: "add-a-photo",
      label: "Upload Clothes",
      lib: "material",
    },
    {
      href: "/wardrobe",
      icon: "checkroom",
      label: "Wardrobe",
      lib: "material",
    },
    {
      href: "/upload-outfit",
      icon: "style",
      label: "Outfit Suggestion",
      lib: "material",
    },
    {
      href: "/outfit-review",
      icon: "search",
      label: "Outfit Review",
      lib: "material",
    },
    {
      href: "/history",
      icon: "favorite",
      label: "Saved Outfits",
      lib: "material",
    },
    {
      href: "/budgeting",
      icon: "wallet",
      label: "Budgeting",
      lib: "fa5",
    },
    {
      href: "/trip-packing",
      icon: "luggage",
      label: "Trip Packing",
      lib: "material",
    },
    {
      href: "/saved-items",
      icon: "bookmark",
      label: "Saved Items",
      lib: "material",
    },
    {
      href: "/colour-analysis",
      icon: "palette",
      label: "Colour Analysis",
      lib: "material",
    },
    {
      href: "/moodboards",
      icon: "palette",
      label: "Mood Boards",
      lib: "material",
    },
    {
      href: "/profile",
      icon: "person",
      label: "Account Profile",
      lib: "material",
    },
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
      ].map((t) => (
        <View
          key={t.label}
          style={[styles.tile, isLargeScreen && styles.largeTile]}
        >
          <Text
            style={[
              styles.tileNumber,
              isLargeScreen && styles.largeTileNumber,
            ]}
          >
            {t.n}
          </Text>

          <Text
            style={[
              styles.tileLabel,
              isLargeScreen && styles.largeTileLabel,
            ]}
          >
            {t.label}
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

  if (isWeb) {
    return (
      <View style={web.root}>
        <PersonalizationModal
          visible={showPersonalization}
          onClose={() => setShowPersonalization(false)}
        />

        <View style={web.sidebar}>
          <View style={web.logoContainer}>
            <Image
              source={require("../../assets/images/trendsense-logo.png")}
              style={web.logo}
              resizeMode="contain"
            />

            <Text style={web.appName}>TrendSense</Text>
          </View>

          {navItems.map((item) => (
            <Link key={item.href} href={item.href as any} asChild>
              <Pressable style={web.navItem}>
                {item.lib === "material" ? (
                  <MaterialIcons
                    name={item.icon as any}
                    size={18}
                    color={colors.blueDark}
                    style={styles.icon}
                  />
                ) : (
                  <FontAwesome5
                    name={item.icon as any}
                    size={16}
                    color={colors.blueDark}
                    style={styles.icon}
                  />
                )}

                <Text style={web.navLabel}>{item.label}</Text>
              </Pressable>
            </Link>
          ))}

          <View style={web.divider} />

          {isLoggedIn ? (
            <Pressable style={web.navItem} onPress={handleSignOut}>
              <MaterialIcons
                name="logout"
                size={18}
                color={colors.blueDark}
                style={styles.icon}
              />

              <Text style={web.navLabel}>Sign Out</Text>
            </Pressable>
          ) : (
            <Link href="/login" asChild>
              <Pressable style={web.navItem}>
                <MaterialIcons
                  name="login"
                  size={18}
                  color={colors.blueDark}
                  style={styles.icon}
                />

                <Text style={web.navLabel}>Login</Text>
              </Pressable>
            </Link>
          )}

          {isAdmin && (
            <Pressable
              style={styles.adminButton}
              onPress={() =>
                router.replace("/admin/dashboard" as any)
              }
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={18}
                color={colors.white}
                style={styles.icon}
              />

              <Text style={styles.adminButtonText}>
                Go to Admin View
              </Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          style={web.content}
          contentContainerStyle={web.contentInner}
        >
          {welcomeName ? (
            <Text style={styles.welcome}>
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

    </SafeAreaView>
  );
}

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
    width: TILE_SIZE,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 13,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickBtnIco: { fontSize: 18 },
  quickBtnTxt: { fontSize: 13, fontWeight: "600", color: colors.text },

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
