import BodyAnalysisCard from "@/components/MainMenu/Cards/BodyAnalysisCard";
import ColourSeasonCard from "@/components/MainMenu/Cards/ColorSeasonCard";
import LookHistoryCard from "@/components/MainMenu/Cards/LookHistoryCard";
import OutfitReviewCard from "@/components/MainMenu/Cards/OutfitReviewCard";
import SavedLooksCard from "@/components/MainMenu/Cards/SavedLooksCard";
import StyleBudgetCard from "@/components/MainMenu/Cards/StyleBudgetCard";
import TrendsCard from "@/components/MainMenu/Cards/TrendsCard";
import TripPackingCard from "@/components/MainMenu/Cards/TripPackingCard";
import FeatureGrid from "@/components/MainMenu/FeatureGrid";
import HomeHeader from "@/components/MainMenu/HomeHeader";
import StatsCard from "@/components/MainMenu/StatsCard";
import WardrobeCarousel from "@/components/MainMenu/WardrobeCarousel";
import WelcomeCard from "@/components/MainMenu/WelcomeSection";
import { useAppTheme } from "@/context/ThemeContext";

import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { prefetchTrends } from "../api/trends";
import { getMe } from "../api/user";
import { getName, getRole } from "../utils/token";

export default function MobileMainMenuLayout() {
  const { themeColors } = useAppTheme();
  const router = useRouter();

  const isAdmin = getRole() === "ADMIN";
  const displayName = getName() || "TrendSense User";

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    prefetchTrends();
  }, []);

  /*
   * Reload the profile picture whenever the user returns
   * to the main menu from the profile page.
   */
  const loadProfilePicture = useCallback(() => {
    getMe()
      .then((data) => {
        if (data?.profilePicture) {
          setAvatarUri(
            `data:${data.profilePictureType};base64,${data.profilePicture}`,
          );
        } else {
          setAvatarUri(null);
        }
      })
      .catch(() => {
        // Keep the existing image if the request fails.
      });
  }, []);

  useFocusEffect(loadProfilePicture);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: themeColors.headerGradientStart,
        },
      ]}
    >
      <View style={[styles.pageShell, { backgroundColor: themeColors.bg }]}>
        {/* Admin banner */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.adminBanner}
            activeOpacity={0.85}
            onPress={() => router.replace("/admin/dashboard" as any)}
          >
            <Text style={styles.adminBannerText}>
              ⚙️ Admin — viewing as user
            </Text>

            <Text style={styles.adminBannerLink}>Admin View →</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <HomeHeader
            avatarUri={avatarUri}
            userName={displayName}
          />

          {/* Main dashboard cards */}
          <View style={styles.dashboardContent}>
            <WelcomeCard
              userName={displayName.split(" ")[0]}
              style={styles.fullWidthCard}
            />

            <StatsCard />

            <WardrobeCarousel />
          </View>

          {/* Feature cards */}
          <View style={styles.featureSection}>
            <FeatureGrid>
              <OutfitReviewCard />
              <BodyAnalysisCard />
              <ColourSeasonCard />
              <SavedLooksCard />
              <LookHistoryCard />
              <TripPackingCard />
              <StyleBudgetCard />
              <TrendsCard />
            </FeatureGrid>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  pageShell: {
    flex: 1,
    width: "100%",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 36,
  },

  adminBanner: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#1a3a5c",
  },

  adminBannerText: {
    flexShrink: 1,
    marginRight: 10,

    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  adminBannerLink: {
    color: "#A8D0F0",
    fontSize: 11,
    fontWeight: "700",
  },

  dashboardContent: {
    width: "100%",

    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 24,

    gap: 16,
  },

  fullWidthCard: {
    width: "100%",
  },

  featureSection: {
    width: "100%",
  },
});
