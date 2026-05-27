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
