import HomeHeader from "@/components/MainMenu/HomeHeader";
import StatsCard from "@/components/MainMenu/StatsCard";
import WardrobeCarousel from "@/components/MainMenu/WardrobeCarousel";
import WelcomeCard from "@/components/MainMenu/WelcomeSection";
import { useAppTheme } from "@/context/ThemeContext";
import OutfitReviewCard from "@/components/MainMenu/Cards/OutfitReviewCard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { prefetchTrends } from "../api/trends";
import { getMe } from "../api/user";
import { getName, getRole } from "../utils/token";

const NAV = [
  {
    id: "home",
    label: "Home",
    icon: "⌂",
    route: "/(tabs)/mainMenu",
    active: true,
  },
  {
    id: "upload",
    label: "Upload",
    icon: "+",
    route: "/(tabs)/upload-clothes",
    active: false,
  },
  {
    id: "profile",
    label: "Me",
    icon: "◯",
    route: "/(tabs)/profile",
    active: false,
  },
] as const;

export default function WebMainMenuLayout() {
  const { themeColors, isDarkMode, toggleDarkMode } = useAppTheme();
  const router = useRouter();
  const isAdmin = getRole() === "ADMIN";
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const displayName = getName() || "TrendSense User";

  useEffect(() => {
    prefetchTrends();

    getMe()
      .then((data) => {
        if (data?.profilePicture) {
          setAvatarUri(
            `data:${data.profilePictureType};base64,${data.profilePicture}`,
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: themeColors.bg }]}>
      {isAdmin && (
        <TouchableOpacity
          style={s.adminBanner}
          onPress={() => router.replace("/admin/dashboard" as any)}
        >
          <Text style={s.adminBannerText}>⚙️ Admin — viewing as user</Text>
          <Text style={s.adminBannerLink}>Admin View →</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── HEADER ── */}
        <HomeHeader avatarUri={avatarUri} userName={displayName} />

        <View style={s.dashboardTop}>
          <WelcomeCard
            userName={displayName.split(" ")[0]}
            style={s.welcomeCardStretch}
          />

          <View style={s.rightColumn}>
            <StatsCard />

            <WardrobeCarousel />
          </View>
        </View>

        {/* ── FEATURE GRID ── */}
        <View style={s.section}>
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
              <Text style={[s.cardIcon, { color: themeColors.text }]}>✦</Text>
              <Text style={[s.cardLabel, { color: themeColors.text }]}>
                AI Styling
              </Text>
              <Text style={[s.cardSub, { color: themeColors.muted }]}>
                Outfits{"\n"}made for you
              </Text>
            </TouchableOpacity>

            <View style={s.colRight}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[s.cardShort, { backgroundColor: "#D4C9E2" }]}
                onPress={() => router.push("/(tabs)/colour-analysis" as any)}
              >
                <Text style={[s.cardIcon, { color: themeColors.text }]}>◈</Text>
                <Text style={[s.cardLabel, { color: themeColors.text }]}>
                  Colour Season
                </Text>
                <Text style={[s.cardSub, { color: themeColors.muted }]}>
                  Discover your palette
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[s.cardShort, { backgroundColor: "#C8D8C4" }]}
                onPress={() => router.push("/(tabs)/saved-items" as any)}
              >
                <Text style={[s.cardIcon, { color: themeColors.text }]}>♡</Text>
                <Text style={[s.cardLabel, { color: themeColors.text }]}>
                  Saved Looks
                </Text>
                <Text style={[s.cardSub, { color: themeColors.muted }]}>
                  Pieces you love
                </Text>
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
                <Text style={[s.cardLabel, { color: themeColors.white }]}>
                  Look History
                </Text>
                <Text style={[s.cardSub, { color: "rgba(255,255,255,0.5)" }]}>
                  Revisit your past outfits
                </Text>
              </View>
              <Text
                style={[
                  s.cardIcon,
                  { color: "rgba(255,255,255,0.6)", marginBottom: 0 },
                ]}
              >
                ○
              </Text>
            </View>
          </TouchableOpacity>

          {/* Body Analysis */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[s.cardWide, { backgroundColor: "#E2D4EC" }]}
            onPress={() => router.push("/(tabs)/body-analysis" as any)}
          >
            <View style={s.cardWideInner}>
              <View>
                <Text style={s.cardLabel}>Body Analysis</Text>
                <Text style={s.cardSub}>Find your shape & style</Text>
              </View>
              <Text style={[s.cardIcon, { marginBottom: 0 }]}>🧍</Text>
            </View>
          </TouchableOpacity>

          {/* Row 3: Budget + Trip */}
          <View style={s.gridRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.cardHalf, { backgroundColor: "#E2D9C8" }]}
              onPress={() => router.push("/(tabs)/budgeting" as any)}
            >
              <Text style={[s.cardIcon, { color: themeColors.text }]}>◇</Text>
              <Text style={[s.cardLabel, { color: themeColors.text }]}>
                Style Budget
              </Text>
              <Text style={[s.cardSub, { color: themeColors.muted }]}>
                Spend with purpose
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.cardHalf, { backgroundColor: "#F0D4CE" }]}
              onPress={() => router.push("/(tabs)/trip-packing" as any)}
            >
              <Text style={[s.cardIcon, { color: themeColors.text }]}>◻</Text>
              <Text style={[s.cardLabel, { color: themeColors.text }]}>
                Trip Edit
              </Text>
              <Text style={[s.cardSub, { color: themeColors.muted }]}>
                Pack with intention
              </Text>
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
                <Text style={[s.cardLabel, { color: themeColors.text }]}>
                  Trends
                </Text>
                <Text style={[s.cardSub, { color: themeColors.muted }]}>
                  What's in style right now
                </Text>
              </View>
              <Text
                style={[
                  s.cardIcon,
                  { color: themeColors.text, marginBottom: 0 },
                ]}
              >
                📈
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── QUICK ADD ── */}
        <View style={s.section}>
          <Text style={[s.sectionLabel, { color: themeColors.muted }]}>
            ADD TO YOUR EDIT
          </Text>
          <View style={s.quickRow}>
            <TouchableOpacity
              style={[
                s.quickBtnLight,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.input,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/upload-clothes" as any)}
            >
              <Text style={s.quickIco}>📷</Text>
              <Text style={[s.quickTxt, { color: themeColors.text }]}>
                Add Clothing
              </Text>
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
                <Text style={[s.quickTxt, { color: themeColors.white }]}>
                  Get Styled
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },

  // Admin
  adminBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a3a5c",
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  adminBannerText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  adminBannerLink: { color: "#a8d0f0", fontWeight: "700", fontSize: 12 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 26,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 20,
  },
  decCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.03)",
    top: -60,
    right: -40,
  },
  decCircle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  appName: { fontSize: 45, fontWeight: "800", color: "#fff", letterSpacing: 5 },
  tagline: {
    fontSize: 17,
    letterSpacing: 1.5,
    marginTop: 4,
    fontStyle: "italic",
  },
  avatarBtn: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarTxt: { fontSize: 15 },

  // Section
  section: { paddingHorizontal: 28, marginBottom: 20 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2.5,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  // Hero card
  heroCard: {
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#1C2B25",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  heroDecDot1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    top: -30,
    right: 20,
  },
  heroDecDot2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 10,
    right: 80,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heroEyebrow: {
    fontSize: 8,
    letterSpacing: 2.5,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  heroSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  heroIcon: { fontSize: 28 },
  heroCta: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 12,
  },
  heroCtaTxt: {
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // Grid
  gridRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  colRight: { flex: 1, gap: 10 },

  // Card base
  cardBase: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTall: {
    flex: 1,
    minHeight: 200,
    borderRadius: 20,
    padding: 16,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardShort: {
    flex: 1,
    minHeight: 92,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHalf: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardWide: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardWideInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeTxt: {
    fontSize: 9,
    fontWeight: "800",
    color: "#5A3A2A",
    letterSpacing: 1,
  },
  cardIcon: { fontSize: 22, marginBottom: 8 },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  cardSub: { fontSize: 11, lineHeight: 15 },

  // Quick add
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtnLight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#E8E4DE",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 15,
  },
  quickIco: { fontSize: 16 },
  quickTxt: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // Bottom nav
  bnav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E8EDE9",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 22 : 12,
  },
  bni: { flex: 1, alignItems: "center", gap: 2 },
  bniPill: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 16 },
  bniPillActive: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 16,
    backgroundColor: "#DCE9D8",
  },
  bniIco: { fontSize: 19 },
  bniLbl: { fontSize: 9, color: "#B0BCB4", fontWeight: "500" },
  bniLblActive: { fontWeight: "700" },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  themeToggle: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  themeToggleText: {
    fontSize: 16,
  },

  welcomeColumn: {
    flex: 0.92,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.08)",
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 6,
    color: "#1D3225",
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D3225",
    marginBottom: 3,
  },

  statLabel: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 15,
    color: "#1D3225",
  },
  dashboardTop: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 24,
    paddingHorizontal: 28,
    marginBottom: 26,
  },

  welcomeCardStretch: {
    flex: 1,
  },

  rightColumn: {
    flex: 1,
    gap: 18,
  },

  statsCard: {
    height: 142,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
  },
});
