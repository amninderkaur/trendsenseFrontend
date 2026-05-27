/*
 * Moodboards Page
 * Displays the user's moodboards and controls whether the user is:
 * - viewing all moodboards
 * - creating a new moodboard
 * - editing an existing moodboard
 * - viewing one moodboard in detail
 */

// ================
//     IMPORTS
// ================

import MoodboardCard from "@/components/Moodboards/MoodboardCard";
import MoodboardDetail from "@/components/Moodboards/MoodboardDetail";
import MoodboardForm from "@/components/Moodboards/MoodboardForm";
import { colors, globalStyles } from "@/constants/globalStyles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

// ================
//     TYPES
// ================

export type Moodboard = {
  id: string;
  name: string;
  description: string;
  images: string[];
};

type ScreenMode = "list" | "create" | "detail" | "edit";

// ================
// MOODBOARDS PAGE COMPONENT
// ================
export default function MoodboardsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;

  const [screenMode, setScreenMode] = useState<ScreenMode>("list");
  const [selectedMoodboard, setSelectedMoodboard] =
    useState<Moodboard | null>(null);

  // Temporary mock data until backend endpoints are added
  const [moodboards, setMoodboards] = useState<Moodboard[]>([
    {
      id: "1",
      name: "Soft Neutral Outfits",
      description: "Calm everyday outfit inspiration with soft colours.",
      images: [],
    },
  ]);

  const goBack = () => {
    if (screenMode === "list") {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/mainMenu" as any);
      }

      return;
    }

    setScreenMode("list");
    setSelectedMoodboard(null);
  };

  const openMoodboard = (moodboard: Moodboard) => {
    setSelectedMoodboard(moodboard);
    setScreenMode("detail");
  };

  const startCreate = () => {
    setSelectedMoodboard(null);
    setScreenMode("create");
  };

  const startEdit = (moodboard: Moodboard) => {
    setSelectedMoodboard(moodboard);
    setScreenMode("edit");
  };

  const saveMoodboard = (moodboard: Moodboard) => {
    setMoodboards((prev) => {
      const exists = prev.some((item) => item.id === moodboard.id);

      if (exists) {
        return prev.map((item) =>
          item.id === moodboard.id ? moodboard : item
        );
      }

      return [moodboard, ...prev];
    });

    setSelectedMoodboard(moodboard);
    setScreenMode("detail");
  };

  const deleteMoodboard = (id: string) => {
    setMoodboards((prev) => prev.filter((item) => item.id !== id));
    setSelectedMoodboard(null);
    setScreenMode("list");
  };

  const addImagesToMoodboard = (id: string, newImages: string[]) => {
    setMoodboards((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          images: [...item.images, ...newImages].slice(0, 12),
        };
      })
    );

    setSelectedMoodboard((prev) => {
      if (!prev || prev.id !== id) return prev;

      return {
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 12),
      };
    });
  };

  // ================
  //     RENDER
  // ================
  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        isLargeScreen && styles.largeScrollContent,
      ]}
    >
      <View style={styles.pageContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>
            {screenMode === "list" ? "← Back" : "← Back to Moodboards"}
          </Text>
        </TouchableOpacity>

        {screenMode === "list" ? (
          <>
            <View style={[globalStyles.card, styles.headerCard]}>
              <View style={styles.headerTextBlock}>
                <Text
                  style={[
                    globalStyles.pageTitle,
                    isLargeScreen && globalStyles.largePageTitle,
                  ]}
                >
                  Moodboards
                </Text>

                <Text style={styles.subtitle}>
                  Create visual collections for outfit inspiration, aesthetics,
                  trips, events, or style goals.
                </Text>
              </View>

              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={startCreate}
              >
                <Text style={globalStyles.primaryButtonText}>
                  Create Moodboard
                </Text>
              </TouchableOpacity>
            </View>

            {moodboards.length === 0 ? (
              <View style={[globalStyles.card, styles.emptyCard]}>
                <Text style={styles.emptyTitle}>No moodboards yet</Text>

                <Text style={styles.emptyText}>
                  Start by creating a moodboard with a name, short description,
                  and at least one inspiration image.
                </Text>

                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={startCreate}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Create Your First Moodboard
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.grid}>
                {moodboards.map((moodboard) => (
                  <MoodboardCard
                    key={moodboard.id}
                    moodboard={moodboard}
                    onPress={() => openMoodboard(moodboard)}
                  />
                ))}
              </View>
            )}
          </>
        ) : null}

        {screenMode === "create" ? (
          <MoodboardForm
            mode="create"
            initialMoodboard={null}
            onSave={saveMoodboard}
            onCancel={goBack}
          />
        ) : null}

        {screenMode === "edit" && selectedMoodboard ? (
          <MoodboardForm
            mode="edit"
            initialMoodboard={selectedMoodboard}
            onSave={saveMoodboard}
            onCancel={goBack}
          />
        ) : null}

        {screenMode === "detail" && selectedMoodboard ? (
          <MoodboardDetail
            moodboard={selectedMoodboard}
            onEdit={() => startEdit(selectedMoodboard)}
            onDelete={() => deleteMoodboard(selectedMoodboard.id)}
            onAddImages={(images) =>
              addImagesToMoodboard(selectedMoodboard.id, images)
            }
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  largeScrollContent: {
    alignItems: "center",
  },

  pageContainer: {
    width: "100%",
    maxWidth: 1200,
    gap: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  backButtonText: {
    color: colors.text,
    fontWeight: "700",
  },

  headerCard: {
    borderRadius: 28,
    padding: 24,
    gap: 18,
  },

  headerTextBlock: {
    gap: 8,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  emptyCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 520,
  },
});