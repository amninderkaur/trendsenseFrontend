/* 
* Profile Page
* This page handles
*  - Profile display (profile picture, name, email)
*  - Profile editing (name, phone, profile picture)
*  - Profile card animations and transitions
*  - Password changing
*  - Viewing and submitting reviews
*  - Account deletion
*  - Logging out
*/

// ================
//     IMPORTS
// ================
import ChangePasswordSection from "@/components/Profile/ChangePasswordSection";
import EditInfoSection from "@/components/Profile/EditInfoSection";
import ProfileActionCards from "@/components/Profile/ProfileActionCards";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ReviewsSection from "@/components/Profile/ReviewSection";
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import TasteProfileCard from "@/components/TasteProfileCard";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PersonalizationModal from "../(auth)/PersonalizationModal";
import { deleteAccount, getMe, uploadProfilePicture } from "../../api/user";
import { getTasteProfile } from "../../api/outfit";
import {
  getEmail,
  getName,
  removeEmail,
  removeName,
  removeToken,
  removeUserId,
} from "../../utils/token";

// ================
//     TYPES
// ================
type ProfileSection = "cards" | "editInfo" | "changePassword" | "review";

// ================
// PROFILE COMPONENT
// ================
export default function Profile() {

  //Navigation / theming
  const router = useRouter();
  const { themeColors } = useAppTheme();

  // User information
  const email = getEmail() || "user@example.com";
  const displayName = getName() || "TrendSense User";

  // Model state
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Profile image state
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // section navigation state
  const [activeSection, setActiveSection] = useState<ProfileSection>("cards");

  // display state
  const [displayNameState, setDisplayNameState] = useState(displayName);

  // section transition animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // temporary placeholder stats until
  // backend endpoints are implemented
  const profileStats = {
    outfitsGenerated: 0,
    outfitsReviewed: 0,
    wardrobeItems: 0,
  };

  // Taste profile state
  const [tasteProfile, setTasteProfile] = useState<any>(null);
  const [tasteProfileLocked, setTasteProfileLocked] = useState(false);
  const [tasteProfileLoading, setTasteProfileLoading] = useState(true);

  // animates the current section
  // out, switches the section, 
  // then animates the new section in
  const animateToSection = (
    nextSection: ProfileSection,
    direction: "left" | "right"
  ) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "left" ? -60 : 60,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveSection(nextSection);

      slideAnim.setValue(direction === "left" ? 60 : -60);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // open a profile section
  const openSection = (section: ProfileSection) => {
    animateToSection(section, "left");
  };

  // return to main cards view
  const closeSection = () => {
    animateToSection("cards", "right");
  };

  // initial profile load
  useEffect(() => {
    getMe()
      .then((data) => {
        if (data?.profilePicture) {
          setAvatarUri(
            `data:${data.profilePictureType};base64,${data.profilePicture}`
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        setProfileLoading(false);
      });
  }, []);

  // load taste profile
  const loadTasteProfile = useCallback(() => {
    setTasteProfileLoading(true);
    getTasteProfile()
      .then((data) => {
        setTasteProfile(data);
        setTasteProfileLocked(false);
      })
      .catch((err: any) => {
        const status = err?.response?.status;
        setTasteProfile(null);
        setTasteProfileLocked(status === 404 || status === 400);
      })
      .finally(() => {
        setTasteProfileLoading(false);
      });
  }, []);

  useFocusEffect(loadTasteProfile);

  // upload and update profile image
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setUploadingPic(true);

    try {
      await uploadProfilePicture(asset.uri);
      setAvatarUri(asset.uri);
    } catch {
      // keep old image if upload fails
    } finally {
      setUploadingPic(false);
    }
  };

  // log out user and clear 
  // session data
  const handleLogout = () => {
    removeToken();
    removeUserId();
    removeEmail();
    removeName();
    router.replace("/(auth)/login");
  };

  // permanently delete account
  const confirmDelete = async () => {
    setDeleting(true);

    try {
      await deleteAccount();
    } catch {
      // still clear local state even
      // if request fails
    }

    removeToken();
    removeUserId();
    removeEmail();
    removeName();

    router.replace("/(auth)/login");
  };

  // loading state while fetching profile data
  if (profileLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: themeColors.bg },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.button} />
      </View>
    );
  }

// ================
//     RENDER
// ================
 return (
  <>
    <PersonalizationModal
      visible={showEdit}
      onClose={() => setShowEdit(false)}
    />

    <ScrollView
      style={[
        globalStyles.screen,
        { backgroundColor: themeColors.bg },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.pageContainer}>

        {/* Profile Header always remains visible */}
        <ProfileHeader
          name={displayNameState}
          email={email}
          avatarUrl={avatarUri ?? undefined}
          isEditing={activeSection === "editInfo"}
          uploadingAvatar={uploadingPic}
          onAvatarPress={handlePickImage}
        />

        {/* Animated content area switches
            between cards, edit info, password
            and reviews  */}
        <Animated.View
          style={[
            styles.animatedSection,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >

          {/* Main profile action cards */}
          {activeSection === "cards" && (
            <ProfileActionCards
              onEditInfo={() => openSection("editInfo")}
              onPreferences={() => setShowEdit(true)}
              onChangePassword={() => openSection("changePassword")}
              onReview={() => openSection("review")}
              onLogout={handleLogout}
              onDelete={() => setShowDeleteConfirm(true)}
              onDashboard={() => router.replace("/(tabs)/mainMenu")}
              outfitsGenerated={profileStats.outfitsGenerated}
              outfitsReviewed={profileStats.outfitsReviewed}
              wardrobeItems={profileStats.wardrobeItems}
            />
          )}

          {/* Edit Info Section */}
          {activeSection === "editInfo" && (
            <EditInfoSection
              initialName={displayNameState}
              onNameChange={setDisplayNameState}
              onClose={closeSection}
            />
          )}

          {/* Change Password Section */}
          {activeSection === "changePassword" && (
            <ChangePasswordSection
              onClose={closeSection}
              onPasswordChanged={() => router.replace("/(auth)/login")}
            />
          )}

          {/* Reviews Section */}
          {activeSection === "review" && (
            <ReviewsSection onClose={closeSection} />
          )}
        </Animated.View>

        {/* ── Your Taste Profile ── */}
        {!tasteProfileLoading && (
          <View style={styles.tasteSectionWrapper}>
            <Text style={[styles.tasteSectionTitle, { color: themeColors.text }]}>
              Your Taste Profile
            </Text>

            {tasteProfile && (
              <TasteProfileCard profile={tasteProfile} />
            )}

            {tasteProfileLocked && (
              <View
                style={[
                  styles.tasteLockedCard,
                  { backgroundColor: themeColors.card },
                ]}
              >
                <Text style={styles.tasteLockedIcon}>🔒</Text>
                <Text style={[styles.tasteLockedTitle, { color: themeColors.text }]}>
                  AI Taste Profile
                </Text>
                <Text style={[styles.tasteLockedBody, { color: themeColors.muted }]}>
                  Rate at least 3 outfits to unlock personalised suggestions
                </Text>
                <TouchableOpacity
                  style={[styles.tasteLockedBtn, { backgroundColor: themeColors.button }]}
                  onPress={() => router.push("/(tabs)/history" as any)}
                >
                  <Text style={[styles.tasteLockedBtnText, { color: themeColors.white }]}>
                    Go to Outfit History
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 8 }}
                  onPress={loadTasteProfile}
                >
                  <Text style={{ color: themeColors.muted, fontSize: 13 }}>
                    Already rated? Check again ↻
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>

    {/* Delete Account Confirmation Modal */}
    <Modal visible={showDeleteConfirm} transparent animationType="fade">
      <View
        style={[
          styles.modalOverlay,
          { backgroundColor: themeColors.blueDark },
        ]}
      >
        <View
          style={[
            styles.modalBox,
            { backgroundColor: themeColors.card },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: themeColors.text },
            ]}
          >
            Delete Account
          </Text>

          <Text
            style={[
              styles.modalMessage,
              { color: themeColors.muted },
            ]}
          >
            You will not be able to access any of your data. This will
            permanently delete your wardrobe, outfits, saved items, and
            profile — you will have to start from the beginning to rebuild
            your wardrobe. This cannot be undone.
          </Text>

          <TouchableOpacity
            style={[
              styles.modalDeleteBtn,
              { backgroundColor: themeColors.accent },
            ]}
            onPress={confirmDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color={themeColors.white} />
            ) : (
              <Text
                style={[
                  styles.modalBtnText,
                  { color: themeColors.white },
                ]}
              >
                Yes, Delete My Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalCancelBtn,
              { backgroundColor: themeColors.button },
            ]}
            onPress={() => setShowDeleteConfirm(false)}
            disabled={deleting}
          >
            <Text
              style={[
                styles.modalBtnText,
                { color: themeColors.white },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </>
);
}
// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 40,
  },

  pageContainer: {
    width: "100%",
    maxWidth: 1900,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 20,
  },

  animatedSection: {
    width: "100%",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  modalBox: {
    borderRadius: 25,
    padding: 28,
    width: "100%",
    maxWidth: 380,

    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

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

  modalCancelBtn: {
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
  },

  modalBtnText: {
    fontWeight: "700",
    fontSize: 16,
  },

  // Taste profile
  tasteSectionWrapper: {
    width: "100%",
    marginTop: 4,
  },
  tasteSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  tasteLockedCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tasteLockedIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  tasteLockedTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  tasteLockedBody: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
  tasteLockedBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    marginTop: 4,
  },
  tasteLockedBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
