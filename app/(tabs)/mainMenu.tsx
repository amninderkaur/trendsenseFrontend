import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/globalStyles";
import { getRole } from "../../utils/token";
import { prefetchTrends } from "../../api/trends";

const NAV = [
  { id: "home",    label: "Home",   icon: "⌂", route: "/(tabs)/mainMenu",       active: true  },
  { id: "upload",  label: "Upload", icon: "+", route: "/(tabs)/upload-clothes",  active: false },
  { id: "profile", label: "Me",     icon: "◯", route: "/(tabs)/profile",         active: false },
] as const;

export default function MainMenu() {
  const router = useRouter();
  const isAdmin = getRole() === "ADMIN";

  useEffect(() => {
    prefetchTrends();
  }, []);

  return (
    <SafeAreaView style={s.safe}>

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

        {/* ── FEATURE GRID ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>EXPLORE</Text>

          {/* Row 1: AI Styling (tall) + right column */}
          <View style={s.gridRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.cardTall, { backgroundColor: "#E8D5C4" }]}
              onPress={() => router.push("/(tabs)/outfit-review" as any)}
            >
              <View style={s.badge}>
                <Text style={s.badgeTxt}>AI</Text>
              </View>
              <Text style={s.cardIcon}>✦</Text>
              <Text style={s.cardLabel}>AI Styling</Text>
              <Text style={s.cardSub}>Outfits{"\n"}made for you</Text>
            </TouchableOpacity>

            <View style={s.colRight}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[s.cardShort, { backgroundColor: "#D4C9E2" }]}
                onPress={() => router.push("/(tabs)/colour-analysis" as any)}
              >
                <Text style={s.cardIcon}>◈</Text>
                <Text style={s.cardLabel}>Colour Season</Text>
                <Text style={s.cardSub}>Discover your palette</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[s.cardShort, { backgroundColor: "#C8D8C4" }]}
                onPress={() => router.push("/(tabs)/saved-items" as any)}
              >
                <Text style={s.cardIcon}>♡</Text>
                <Text style={s.cardLabel}>Saved Looks</Text>
                <Text style={s.cardSub}>Pieces you love</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Look History full width */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[s.cardWide, { backgroundColor: "#2A3530" }]}
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

          {/* Row 3: Budget + Trip */}
          <View style={s.gridRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.cardHalf, { backgroundColor: "#E2D9C8" }]}
              onPress={() => router.push("/(tabs)/budgeting" as any)}
            >
              <Text style={s.cardIcon}>◇</Text>
              <Text style={s.cardLabel}>Style Budget</Text>
              <Text style={s.cardSub}>Spend with purpose</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.cardHalf, { backgroundColor: "#F0D4CE" }]}
              onPress={() => router.push("/(tabs)/trip-packing" as any)}
            >
              <Text style={s.cardIcon}>◻</Text>
              <Text style={s.cardLabel}>Trip Edit</Text>
              <Text style={s.cardSub}>Pack with intention</Text>
            </TouchableOpacity>
          </View>

          {/* Row 4: Trends */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[s.cardWide, { backgroundColor: "#D4ECEB" }]}
            onPress={() => router.push("/(tabs)/trends" as any)}
          >
            <View style={s.cardWideInner}>
              <View>
                <Text style={s.cardLabel}>Trends</Text>
                <Text style={s.cardSub}>What's in style right now</Text>
              </View>
              <Text style={[s.cardIcon, { marginBottom: 0 }]}>📈</Text>
            </View>
          </TouchableOpacity>
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
              style={{ flex: 1 }}
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
    </SafeAreaView>
  );
}

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
  appName: { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: 5 },
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
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  heroSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: 0.2 },
  heroIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
  },
  heroIcon: { fontSize: 28 },
  heroCta: {
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingTop: 12,
  },
  heroCtaTxt: { color: colors.blueDark, fontWeight: "600", fontSize: 13, letterSpacing: 0.3 },

  // Grid
  gridRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  colRight: { flex: 1, gap: 10 },

  // Card base
  cardBase: {
    borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cardTall: {
    flex: 1, minHeight: 200, borderRadius: 20, padding: 16,
    justifyContent: "flex-end",
    shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cardShort: {
    flex: 1, minHeight: 92, borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cardHalf: {
    flex: 1, borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cardWide: {
    borderRadius: 20, padding: 16, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  cardWideInner: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  badge: {
    position: "absolute", top: 14, right: 14,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeTxt: { fontSize: 9, fontWeight: "800", color: "#5A3A2A", letterSpacing: 1 },
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
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 16, paddingVertical: 15,
  },
  quickIco: { fontSize: 16 },
  quickTxt: { fontSize: 13, fontWeight: "600", color: colors.text, letterSpacing: 0.2 },

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
  bniPillActive: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 16, backgroundColor: "#DCE9D8" },
  bniIco: { fontSize: 19 },
  bniLbl: { fontSize: 9, color: "#B0BCB4", fontWeight: "500" },
  bniLblActive: { color: colors.accent, fontWeight: "700" },
});
