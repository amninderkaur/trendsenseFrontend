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
import { colors, globalStyles } from "@/constants/globalStyles";
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

  // responsive layout state
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 900;

  // ================
  //     RENDER
  // ================
  return (
    <View style={[styles.profileHero, isLargeScreen && styles.largeProfileHero]}>

      {/* Main profile content */}
      <View style={styles.profileHeroContent}>

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

          {/* Default profile image */}
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons
                name="person"
                size={isLargeScreen ? 88 : 60}
                color={colors.white}
              />
            </View>
          )}

          {/* Edit overlay only when in edit mode */}
          {isEditing && (
            <View style={styles.avatarOverlay}>
              {/* Uploading state */}
              {uploadingAvatar ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                //Edit label
                <Text style={styles.avatarEditText}>Edit</Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* User Information */}
        <View style={styles.profileTextBlock}>
          <Text style={[styles.heroName, isLargeScreen && styles.largeHeroName]}>
            {name} ✨
          </Text>

          <Text
            style={[styles.heroEmail, isLargeScreen && styles.largeHeroEmail]}
          >
            {email}
          </Text>
        </View>
      </View>

      {/* Decorative image on larger screens */}
      <View style={styles.heroImageBlock}>
        <Image
          source={require("../../assets/images/ClothingRack.png")}
          style={styles.heroDecorImage}
        />
      </View>
    </View>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  profileHero: {
    ...globalStyles.card,
    borderRadius: 28,
    minHeight: 240,
    padding: 28,
    overflow: "hidden",
    position: "relative",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
  },

  largeProfileHero: {
    minHeight: 360,
    borderRadius: 40,
    padding: 44,
  },

  profileHeroContent: {
    ...globalStyles.row,
    gap: 18,
    zIndex: 2,
    marginTop: 34,
  },

  avatarTouchable: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
  },

  largeAvatarTouchable: {
    width: 170,
    height: 170,
    borderRadius: 85,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderColor: colors.white,
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    backgroundColor: colors.blueDark,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarEditText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  profileTextBlock: {
    gap: 6,
  },

  heroName: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },

  largeHeroName: {
    fontSize: 44,
  },

  heroEmail: {
    fontSize: 15,
    color: colors.muted,
  },

  largeHeroEmail: {
    fontSize: 22,
  },

  heroImageBlock: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "38%",
  },

  heroDecorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.9,
  },
});