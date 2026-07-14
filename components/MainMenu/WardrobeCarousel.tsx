import { BASE_URL as API_BASE_URL } from "@/api/axios";
import { useAppTheme } from "@/context/ThemeContext";
import { getToken } from "@/utils/token";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ClothingItem = {
  id: string;
  generatedImageBase64: string;
  tags?: {
    type?: string;
    color?: string;
    style?: string;
    occasion?: string[];
  };
};

const INDICATOR_COUNT = 5;

export default function WardrobeCarousel() {
  const { themeColors } = useAppTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);

  const isWeb = Platform.OS === "web";

  const activeIndicator = Math.min(
    INDICATOR_COUNT - 1,
    Math.floor((scrollX / Math.max(1, cardWidth)) * INDICATOR_COUNT),
  );

  useEffect(() => {
    const loadWardrobe = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/wardrobe`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data: ClothingItem[] = await response.json();
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadWardrobe();
  }, []);

  const goToWardrobe = () => {
    router.push("/(tabs)/wardrobe" as any);
  };

  const goToItem = (id: string) => {
    router.push({
      pathname: "/(tabs)/wardrobe/[outfitId]" as any,
      params: { outfitId: id, from: "home" },
    });
  };

  const scrollBy = (direction: "left" | "right") => {
    const nextX =
      direction === "right"
        ? scrollX + cardWidth * 0.35
        : scrollX - cardWidth * 0.35;

    const safeX = Math.max(0, nextX);

    scrollRef.current?.scrollTo({
      x: safeX,
      animated: true,
    });

    setScrollX(safeX);
  };

  const getItemName = (item: ClothingItem) => {
    const name = `${item.tags?.color ?? ""} ${item.tags?.type ?? ""}`.trim();
    return name || "Wardrobe Item";
  };

  if (loading) {
    return (
      <View style={[s.card, { backgroundColor: themeColors.card }]}>
        <ActivityIndicator color="#1D3225" />
      </View>
    );
  }

  return (
    <View
      style={[s.card, { backgroundColor: themeColors.card }]}
      onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
    >
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.hangerIcon}>♧</Text>
          <Text style={s.title}>My Wardrobe</Text>
        </View>

        <View style={s.rightActions}>
          <TouchableOpacity activeOpacity={0.75} onPress={goToWardrobe}>
            <Text style={s.viewAll}>View all →</Text>
          </TouchableOpacity>

          {isWeb && (
            <View style={s.arrowRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={s.arrowBtn}
                onPress={() => scrollBy("left")}
              >
                <Text style={s.arrowTxt}>‹</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                style={s.arrowBtn}
                onPress={() => scrollBy("right")}
              >
                <Text style={s.arrowTxt}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {items.length === 0 ? (
        <TouchableOpacity
          activeOpacity={0.85}
          style={s.emptyState}
          onPress={goToWardrobe}
        >
          <Text style={s.emptyTitle}>No wardrobe pieces yet</Text>
          <Text style={s.emptySub}>
            Browse your wardrobe or add your first item.
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
            scrollEventThrottle={16}
            contentContainerStyle={s.carouselContent}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={s.itemWrap}
                onPress={() => goToItem(item.id)}
              >
                <View style={s.imageBox}>
                  <Image
                    source={{
                      uri: `data:image/png;base64,${item.generatedImageBase64}`,
                    }}
                    style={s.itemImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={s.itemName} numberOfLines={1}>
                  {getItemName(item)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.dots}>
            {Array.from({ length: INDICATOR_COUNT }).map((_, index) => (
              <View
                key={index}
                style={[s.dot, index === activeIndicator && s.dotActive]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    height: 250,
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  hangerIcon: {
    fontSize: 22,
    color: "#1D3225",
  },

  title: {
    fontSize: 23,
    fontWeight: "600",
    color: "#1D3225",
    fontFamily: "Cormorant Garamond",
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  viewAll: {
    fontSize: 13,
    color: "#1D3225",
    fontWeight: "500",
  },

  arrowRow: {
    flexDirection: "row",
    gap: 8,
  },

  arrowBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(29,50,37,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowTxt: {
    color: "#1D3225",
    fontSize: 24,
    fontWeight: "600",
    marginTop: -2,
  },

  carouselContent: {
    gap: 18,
    paddingRight: 18,
  },

  itemWrap: {
    width: 102,
    alignItems: "center",
  },

  imageBox: {
    width: 102,
    height: 102,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  itemImage: {
    width: "92%",
    height: "92%",
  },

  itemName: {
    marginTop: 10,
    color: "#1D3225",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "capitalize",
  },

  dots: {
    marginTop: 14,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },

  dot: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(29,50,37,0.12)",
  },

  dotActive: {
    backgroundColor: "#1D3225",
  },

  emptyState: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(29,50,37,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    color: "#1D3225",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },

  emptySub: {
    color: "#455248",
    fontSize: 13,
  },
});
