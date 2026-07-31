/* 
* Profile Header Component
* displays:
*  - User's profile image
*  - User's name and email
*  - Editable profile image button when in edit mode
*/

// ================
//     IMPORTS
// ================
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const lightHeroImage = require("@/assets/images/LightMode/Profile-Hero-Light.png");
const darkHeroImage = require("@/assets/images/DarkMode/Profile-Hero-Dark.png");

// ==============
//     TYPES
// ============== 
type ProfileHeaderProps = {
  name: string;
  email: string;
  avatarUrl?: string;
  isEditing?: boolean;
  onAvatarPress?: () => void;
  uploadingAvatar?: boolean;
};

// ================
// PROFILE HEADER COMPONENT
// ================
export default function ProfileHeader({
  name,
  email,
  avatarUrl,
  isEditing = false,
  onAvatarPress,
  uploadingAvatar = false,
}: ProfileHeaderProps) {
  const { themeColors, isDarkMode } = useAppTheme();

  // responsive layout state
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;
  const isMobile = width < 600;

  // ================
  //     RENDER
  // ================
  return (
    <View
      style={[
        styles.profileHero,
        {
          backgroundColor: themeColors.card,
          shadowColor: themeColors.shadow,
        },
        isMobile && styles.mobileProfileHero,
        isLargeScreen && styles.largeProfileHero,
      ]}
    >
      <View
        style={[
          styles.profileHeroSurface,
          { backgroundColor: themeColors.card },
          isMobile && styles.mobileProfileHeroSurface,
          isLargeScreen && styles.largeProfileHeroSurface,
        ]}
      >
        <View
          style={[
            styles.profileHeroContent,
            isMobile && styles.mobileProfileHeroContent,
            isLargeScreen && styles.largeProfileHeroContent,
          ]}
        >
          {/* Editable profile image */}
          <TouchableOpacity
            style={[
              styles.avatarTouchable,
              isLargeScreen && styles.largeAvatarTouchable,
            ]}
            onPress={onAvatarPress}
            disabled={!isEditing || uploadingAvatar}
            activeOpacity={isEditing ? 0.8 : 1}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: themeColors.blue },
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={isLargeScreen ? 86 : 64}
                  color={themeColors.white}
                />
              </View>
            )}

            {isEditing && (
              <View
                style={[
                  styles.avatarOverlay,
                  { backgroundColor: themeColors.blueDark },
                ]}
              >
                {uploadingAvatar ? (
                  <ActivityIndicator color={themeColors.white} />
                ) : (
                  <Text
                    style={[
                      styles.avatarEditText,
                      { color: themeColors.white },
                    ]}
                  >
                    Edit
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          <View
            style={[
              styles.profileTextBlock,
              isMobile && styles.mobileProfileTextBlock,
            ]}
          >
            <Text
              style={[
                styles.heroName,
                { color: themeColors.text },
                isMobile && styles.mobileHeroText,
                isLargeScreen && styles.largeHeroName,
              ]}
            >
              {name}
            </Text>

            <Text
              style={[
                styles.heroEmail,
                { color: themeColors.muted },
                isMobile && styles.mobileHeroText,
                isLargeScreen && styles.largeHeroEmail,
              ]}
            >
              {email}
            </Text>
          </View>
        </View>

        {!isMobile && (
          <View
            style={[
              styles.heroImageBlock,
              isLargeScreen && styles.largeHeroImageBlock,
            ]}
            pointerEvents="none"
          >
            <Image
              source={isDarkMode ? darkHeroImage : lightHeroImage}
              style={styles.heroDecorImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  profileHero: {
    borderRadius: 28,
    minHeight: 200,
    position: "relative",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
  },

  largeProfileHero: {
    minHeight: 300,
    borderRadius: 40,
  },

  mobileProfileHero: {
    minHeight: 270,
  },

  profileHeroSurface: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    flexDirection: "row",
  },

  largeProfileHeroSurface: {
    borderRadius: 40,
  },

  mobileProfileHeroSurface: {
    flexDirection: "column",
  },

  profileHeroContent: {
    width: "62%",
    minHeight: 200,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 2,
  },

  largeProfileHeroContent: {
    width: "45%",
    minHeight: 300,
    paddingHorizontal: 44,
    gap: 24,
  },

  mobileProfileHeroContent: {
    width: "100%",
    minHeight: 270,
    paddingHorizontal: 24,
    paddingVertical: 28,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  avatarTouchable: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    flexShrink: 0,
  },

  largeAvatarTouchable: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarEditText: {
    fontSize: 13,
    fontWeight: "700",
  },

  profileTextBlock: {
    gap: 6,
    flexShrink: 1,
  },

  mobileProfileTextBlock: {
    width: "100%",
    alignItems: "center",
  },

  mobileHeroText: {
    textAlign: "center",
  },

  heroName: {
    fontSize: 26,
    fontWeight: "700",
  },

  largeHeroName: {
    fontSize: 34,
  },

  heroEmail: {
    fontSize: 15,
  },

  largeHeroEmail: {
    fontSize: 18,
  },

  heroImageBlock: {
    width: "38%",
    height: "100%",
    overflow: "hidden",
  },

  largeHeroImageBlock: {
    width: "55%",
  },

  heroDecorImage: {
    height: "100%",
    aspectRatio: 1176 / 301,
    position: "absolute",
    top: 0,
    left: 0,
  },

});
