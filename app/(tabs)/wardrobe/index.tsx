import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ClothingItem = {
  id: string;
  generatedImageBase64: string;
  tags: {
    type: string;
    color: string;
    style: string;
    occasion: string[];
  };
};

// ── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",         label: "All",         icon: "✦",  keywords: [] },
  { id: "tops",        label: "Tops",        icon: "👕",  keywords: ["shirt", "t-shirt", "tee", "top", "blouse", "sweater", "hoodie", "jacket", "coat", "blazer", "vest", "cardigan", "polo", "crop"] },
  { id: "bottoms",     label: "Bottoms",     icon: "👖",  keywords: ["pant", "jean", "short", "skirt", "trouser", "legging", "chino", "jogger"] },
  { id: "dresses",     label: "Dresses",     icon: "👗",  keywords: ["dress", "gown", "jumpsuit", "romper", "maxi", "midi"] },
  { id: "shoes",       label: "Shoes",       icon: "👟",  keywords: ["shoe", "sneaker", "boot", "heel", "sandal", "loafer", "flat", "slipper", "oxford"] },
  { id: "accessories", label: "Accessories", icon: "👜",  keywords: ["bag", "hat", "scarf", "belt", "jewelry", "watch", "sunglass", "necklace", "bracelet", "earring", "purse", "backpack", "wallet", "cap", "beanie"] },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

function matchCategory(type: string): CategoryId {
  const t = (type || "").toLowerCase();
  for (const cat of CATEGORIES.slice(1)) {
    if ((cat.keywords as readonly string[]).some((kw) => t.includes(kw))) {
      return cat.id;
    }
  }
  return "tops"; // default
}

function countForCategory(items: ClothingItem[], catId: CategoryId): number {
  if (catId === "all") return items.length;
  return items.filter((i) => matchCategory(i.tags?.type) === catId).length;
}

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ isDark }: { isDark: boolean }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const base  = isDark ? "#2A3530" : "#E8E0D4";
  const inner = isDark ? "#1A2220" : "#D0C8BC";

  return (
    <Animated.View style={[sk.card, { backgroundColor: base, opacity }]}>
      <View style={[sk.img,   { backgroundColor: inner }]} />
      <View style={[sk.line,  { backgroundColor: inner, width: "70%" }]} />
      <View style={[sk.line,  { backgroundColor: inner, width: "45%" }]} />
    </Animated.View>
  );
}

const sk = StyleSheet.create({
  card:  { width: "48%", borderRadius: 14, marginBottom: 18, padding: 10 },
  img:   { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
  line:  { height: 10, borderRadius: 5, marginBottom: 6 },
});

// ── Main screen ──────────────────────────────────────────────────────────────
export default function WardrobeIndex() {
  const router = useRouter();
  const { themeColors, isDarkMode } = useAppTheme();

  const [items,       setItems]       = useState<ClothingItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<ClothingItem | null>(null);
  const [activeTab,   setActiveTab]   = useState<CategoryId>("all");

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const response = await fetch(`${API_BASE_URL}/api/wardrobe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to load wardrobe (${response.status})`);
      const data: ClothingItem[] = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load wardrobe");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadWardrobe(); }, []));

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/mainMenu" as any);
  };

  const deleteItem = async () => {
    if (!confirmItem) return;
    const id = confirmItem.id;
    setDeletingId(id);
    setConfirmItem(null);
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/api/wardrobe/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Could not remove item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((i) => matchCategory(i.tags?.type) === activeTab);

  // ── Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: themeColors.bg }}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: themeColors.bgDark }]}
          onPress={goBack}
        >
          <Text style={[styles.backButtonText, { color: themeColors.text }]}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: themeColors.text }]}>My Wardrobe</Text>

        {/* Category tabs skeleton */}
        <View style={styles.tabRow}>
          {CATEGORIES.map((cat) => (
            <View
              key={cat.id}
              style={[styles.tabSkeleton, { backgroundColor: isDarkMode ? "#2A3530" : "#E8E0D4" }]}
            />
          ))}
        </View>

        {/* Grid skeleton */}
        <View style={styles.grid}>
          {[1, 2, 3, 4].map((n) => (
            <SkeletonCard key={n} isDark={isDarkMode} />
          ))}
        </View>
      </ScrollView>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.bg }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: themeColors.bgDark, marginBottom: 24 }]}
          onPress={goBack}
        >
          <Text style={[styles.backButtonText, { color: themeColors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.errorText, { color: themeColors.accent }]}>{error}</Text>
      </View>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Delete confirmation modal */}
      <Modal visible={!!confirmItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: themeColors.bg }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Remove Item</Text>
            <Text style={[styles.modalMessage, { color: themeColors.muted }]}>
              Remove this{" "}
              <Text style={{ fontWeight: "700", color: themeColors.text }}>
                {confirmItem?.tags?.color} {confirmItem?.tags?.type}
              </Text>{" "}
              from your wardrobe? This cannot be undone.
            </Text>
            <TouchableOpacity
              style={[styles.modalDeleteBtn, { backgroundColor: themeColors.accent }]}
              onPress={deleteItem}
            >
              <Text style={[styles.modalDeleteText, { color: themeColors.white }]}>
                Yes, Remove
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalCancelBtn, { backgroundColor: themeColors.bgDark }]}
              onPress={() => setConfirmItem(null)}
            >
              <Text style={[styles.modalCancelText, { color: themeColors.white }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={{ flex: 1, backgroundColor: themeColors.bg }}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: themeColors.bgDark }]}
          onPress={goBack}
        >
          <Text style={[styles.backButtonText, { color: themeColors.text }]}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: themeColors.text }]}>My Wardrobe</Text>

        {/* ── Category tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {CATEGORIES.map((cat) => {
            const count   = countForCategory(items, cat.id);
            const isActive = activeTab === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.tab,
                  isActive
                    ? { backgroundColor: "#C9A96E", borderColor: "#C9A96E" }
                    : { backgroundColor: isDarkMode ? "#1A2220" : "#FFF", borderColor: isDarkMode ? "#2A3530" : "#EDE8E0" },
                ]}
                onPress={() => setActiveTab(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.tabIcon}>{cat.icon}</Text>
                <Text style={[styles.tabLabel, { color: isActive ? "#fff" : themeColors.text }]}>
                  {cat.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: isActive ? "rgba(255,255,255,0.3)" : "#C9A96E" }]}>
                    <Text style={styles.tabBadgeText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Items grid ── */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>
              {activeTab === "all" ? "👗" : CATEGORIES.find((c) => c.id === activeTab)?.icon ?? "✦"}
            </Text>
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              {activeTab === "all"
                ? "No items yet. Upload some clothes to get started!"
                : `No ${CATEGORIES.find((c) => c.id === activeTab)?.label.toLowerCase()} yet.`}
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: themeColors.blue }]}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/wardrobe/[outfitId]",
                      params: { outfitId: item.id },
                    } as any)
                  }
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: `data:image/png;base64,${item.generatedImageBase64}` }}
                    style={[styles.image, { backgroundColor: themeColors.input }]}
                    resizeMode="cover"
                  />
                  <Text style={[styles.itemName, { color: themeColors.text }]}>
                    {item.tags?.color} {item.tags?.type}
                  </Text>
                  <View style={styles.tagContainer}>
                    {item.tags?.style && (
                      <Text style={[styles.tag, { backgroundColor: themeColors.blueDark, color: themeColors.text }]}>
                        {item.tags.style}
                      </Text>
                    )}
                    {item.tags?.occasion?.map((occ) => (
                      <Text
                        key={occ}
                        style={[styles.tag, { backgroundColor: themeColors.blueDark, color: themeColors.text }]}
                      >
                        {occ}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: themeColors.accent }]}
                  onPress={() => setConfirmItem(item)}
                  disabled={deletingId === item.id}
                >
                  <Text style={[styles.deleteText, { color: themeColors.white }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  // ── Tabs ──
  tabRow: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 20,
    paddingRight: 20,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabSkeleton: {
    width: 80,
    height: 36,
    borderRadius: 999,
  },
  tabIcon:  { fontSize: 13 },
  tabLabel: { fontSize: 13, fontWeight: "600" },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
  },

  // ── Grid ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 16,
    marginBottom: 18,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  image: {
    width: "100%",
    height: 165,
    borderRadius: 10,
  },
  itemName: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 13,
    textTransform: "capitalize",
    letterSpacing: 0.2,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    gap: 4,
  },
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  deleteButton: {
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  deleteText: {
    fontWeight: "700",
    fontSize: 11,
  },

  // ── Empty ──
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
  },

  // ── Back button ──
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 12,
  },
  backButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },

  // ── Error ──
  errorText: {
    fontSize: 15,
    textAlign: "center",
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  modalBox: {
    borderRadius: 25,
    padding: 28,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  modalDeleteBtn: {
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    marginBottom: 10,
  },
  modalDeleteText: {
    fontWeight: "700",
    fontSize: 16,
  },
  modalCancelBtn: {
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
  },
  modalCancelText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
