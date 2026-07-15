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
  useWindowDimensions,
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
  const { width } = useWindowDimensions();

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);

  const isWeb = Platform.OS === "web";
  const isWide = width >= 1500;
  const isMedium = width >= 1100 && width < 1500;
  const titleSize = isWide ? 26 : isMedium ? 24 : 23;
  const viewAllSize = isWide ? 14 : 13;
  const emptyTitleSize = isWide ? 18 : 16;
  const emptySubSize = isWide ? 14 : 13;

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

  if (loading) {
    return (
      <View
        style={[
          s.card,
          {
            backgroundColor: themeColors.card,
            shadowColor: themeColors.shadow,
          },
        ]}
      >
        <ActivityIndicator color={themeColors.text} />
      </View>
    );
  }

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: themeColors.card,
          shadowColor: themeColors.shadow,
        },
      ]}
      onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
    >
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={[s.hangerIcon, { color: themeColors.text }]}>♧</Text>
          <Text style={[s.title, { color: themeColors.text, fontSize: titleSize }]}>My Wardrobe</Text>
        </View>

        <View style={s.rightActions}>
          <TouchableOpacity activeOpacity={0.75} onPress={goToWardrobe}>
            <Text style={[s.viewAll, { color: themeColors.text, fontSize: viewAllSize }]}>View all →</Text>
          </TouchableOpacity>

          {isWeb && (
            <View style={s.arrowRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[s.arrowBtn, { backgroundColor: themeColors.wardrobeControlBg }]}
                onPress={() => scrollBy("left")}
              >
                <Text style={[s.arrowTxt, { color: themeColors.text }]}>‹</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                style={[s.arrowBtn, { backgroundColor: themeColors.wardrobeControlBg }]}
                onPress={() => scrollBy("right")}
              >
                <Text style={[s.arrowTxt, { color: themeColors.text }]}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {items.length === 0 ? (
        <TouchableOpacity
          activeOpacity={0.85}
          style={[s.emptyState, { backgroundColor: themeColors.wardrobeEmptyBg }]}
          onPress={goToWardrobe}
        >
          <Text style={[s.emptyTitle, { color: themeColors.text, fontSize: emptyTitleSize }]}>No wardrobe pieces yet</Text>
          <Text style={[s.emptySub, { color: themeColors.muted, fontSize: emptySubSize }]}> 
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
                <View style={[s.imageBox, { backgroundColor: themeColors.wardrobeImageBg }]}>
                  <Image
                    source={{
                      uri: `data:image/png;base64,${item.generatedImageBase64}`,
                    }}
                    style={s.itemImage}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.dots}>
            {Array.from({ length: INDICATOR_COUNT }).map((_, index) => (
              <View
                key={index}
                style={[
                  s.dot,
                  {
                    backgroundColor:
                      index === activeIndicator
                        ? themeColors.text
                        : themeColors.wardrobeIndicator,
                  },
                ]}
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
  },

  title: {
    fontWeight: "600",
    fontFamily: "Cormorant Garamond",
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  viewAll: {
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
    alignItems: "center",
    justifyContent: "center",
  },

  arrowTxt: {
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
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  itemImage: {
    width: "92%",
    height: "92%",
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
  },

  emptyState: {
    flex: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },

  emptySub: {
  },
});
