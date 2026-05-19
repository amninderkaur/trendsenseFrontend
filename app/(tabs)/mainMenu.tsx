import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { colors, globalStyles } from "../../constants/globalStyles";
import { getToken, removeToken, removeUserId } from "../../utils/token";

export default function Dashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;
  const isLoggedIn = !!getToken();

  const iconSize = isLargeScreen ? 28 : 20;

  const handleSignOut = () => {
    removeToken();
    removeUserId();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={[
        globalStyles.dashboardContainer,
        isLargeScreen && globalStyles.largeDashboardContainer,
      ]}
    >
      <View style={globalStyles.dashboardContent}>
        <View style={styles.header}>
          <Text
            style={[
              globalStyles.pageTitle,
              isLargeScreen && globalStyles.largePageTitle,
            ]}
          >
            Dashboard
          </Text>

          <Text
            style={[
              globalStyles.bodyText,
              isLargeScreen && styles.largeTimeText,
            ]}
          >
            09:00 AM
          </Text>
        </View>

        <View
          style={[
            globalStyles.dashboardCard,
            isLargeScreen && globalStyles.largeDashboardCard,
          ]}
        >
          <Text
            style={[
              globalStyles.cardTitle,
              isLargeScreen && globalStyles.largeCardTitle,
            ]}
          >
            Overview
          </Text>

          <Text
            style={[
              globalStyles.cardText,
              isLargeScreen && globalStyles.largeCardText,
            ]}
          >
            Here’s a quick summary of your dashboard.
          </Text>

          <Link href="/wardrobe" asChild>
            <Pressable
              style={[
                globalStyles.primaryButton,
                isLargeScreen && globalStyles.largePrimaryButton,
              ]}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen && globalStyles.largePrimaryButtonText,
                ]}
              >
                Go to Wardrobe
              </Text>
            </Pressable>
          </Link>

          <Link href="/history" asChild>
            <Pressable
              style={[
                globalStyles.primaryButton,
                styles.secondButton,
                isLargeScreen && globalStyles.largePrimaryButton,
              ]}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen && globalStyles.largePrimaryButtonText,
                ]}
              >
                Go to History
              </Text>
            </Pressable>
          </Link>
        </View>

        <View
          style={[styles.slideshow, isLargeScreen && styles.largeSlideshow]}
        >
          <Text
            style={[
              styles.slideshowText,
              isLargeScreen && styles.largeSlideshowText,
            ]}
          >
            Slideshow Placeholder
          </Text>
        </View>

        <View
          style={[
            styles.tilesContainer,
            isLargeScreen && styles.largeTilesContainer,
          ]}
        >
          <View style={[styles.tile, isLargeScreen && styles.largeTile]}>
            <Text
              style={[
                styles.tileNumber,
                isLargeScreen && styles.largeTileNumber,
              ]}
            >
              120
            </Text>
            <Text
              style={[styles.tileLabel, isLargeScreen && styles.largeTileLabel]}
            >
              Orders
            </Text>
          </View>

          <View style={[styles.tile, isLargeScreen && styles.largeTile]}>
            <Text
              style={[
                styles.tileNumber,
                isLargeScreen && styles.largeTileNumber,
              ]}
            >
              24
            </Text>
            <Text
              style={[styles.tileLabel, isLargeScreen && styles.largeTileLabel]}
            >
              New Customers
            </Text>
          </View>

          <View style={[styles.tile, isLargeScreen && styles.largeTile]}>
            <Text
              style={[
                styles.tileNumber,
                isLargeScreen && styles.largeTileNumber,
              ]}
            >
              8
            </Text>
            <Text
              style={[styles.tileLabel, isLargeScreen && styles.largeTileLabel]}
            >
              Pending
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <Text
            style={[
              globalStyles.sectionTitle,
              isLargeScreen && globalStyles.largeSectionTitle,
            ]}
          >
            Menu
          </Text>

          <Link href="/" asChild>
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
              ]}
            >
              <MaterialIcons
                name="dashboard"
                size={iconSize}
                color={colors.blueDark}
                style={styles.icon}
              />
              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                ]}
              >
                Dashboard
              </Text>
            </Pressable>
          </Link>

          <Link href="/upload-clothes" asChild>
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
              ]}
            >
              <MaterialIcons
                name="add-a-photo"
                size={iconSize}
                color={colors.blueDark}
                style={styles.icon}
              />
              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                ]}
              >
                Upload Clothes
              </Text>
            </Pressable>
          </Link>

          <Link href="/upload-outfit" asChild>
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
              ]}
            >
              <MaterialIcons
                name="checkroom"
                size={iconSize}
                color={colors.blueDark}
                style={styles.icon}
              />
              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                ]}
              >
                Outfit Suggestion
              </Text>
            </Pressable>
          </Link>

          <Link href="/trends" asChild>
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
              ]}
            >
              <FontAwesome5
                name="chart-line"
                size={iconSize}
                color={colors.blueDark}
                style={styles.icon}
              />
              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                ]}
              >
                Trends
              </Text>
            </Pressable>
          </Link>

          <Link href="/profile" asChild>
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
              ]}
            >
              <MaterialIcons
                name="person"
                size={iconSize}
                color={colors.blueDark}
                style={styles.icon}
              />
              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                ]}
              >
                Account Profile
              </Text>
            </Pressable>
          </Link>

          {isLoggedIn ? (
            <Pressable
              style={[
                globalStyles.menuItem,
                isLargeScreen && globalStyles.largeMenuItem,
              ]}
              onPress={handleSignOut}
            >
              <MaterialIcons
                name="logout"
                size={iconSize}
                color={colors.blueDark}
                style={styles.icon}
              />
              <Text
                style={[
                  globalStyles.menuText,
                  isLargeScreen && globalStyles.largeMenuText,
                ]}
              >
                Sign Out
              </Text>
            </Pressable>
          ) : (
            <>
              <Link href="/login" asChild>
                <Pressable
                  style={[
                    globalStyles.menuItem,
                    isLargeScreen && globalStyles.largeMenuItem,
                  ]}
                >
                  <MaterialIcons
                    name="login"
                    size={iconSize}
                    color={colors.blueDark}
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      globalStyles.menuText,
                      isLargeScreen && globalStyles.largeMenuText,
                    ]}
                  >
                    Login
                  </Text>
                </Pressable>
              </Link>

              <Link href="/register" asChild>
                <Pressable
                  style={[
                    globalStyles.menuItem,
                    isLargeScreen && globalStyles.largeMenuItem,
                  ]}
                >
                  <MaterialIcons
                    name="person-add"
                    size={iconSize}
                    color={colors.blueDark}
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      globalStyles.menuText,
                      isLargeScreen && globalStyles.largeMenuText,
                    ]}
                  >
                    Signup
                  </Text>
                </Pressable>
              </Link>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
  },

  largeTimeText: {
    fontSize: 18,
  },

  secondButton: {
    marginTop: 0,
  },

  slideshow: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  largeSlideshow: {
    height: 240,
    borderRadius: 28,
  },

  slideshowText: {
    color: colors.blueDark,
    fontWeight: "700",
  },

  largeSlideshowText: {
    fontSize: 22,
  },

  tilesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    gap: 10,
  },

  largeTilesContainer: {
    gap: 16,
  },

  tile: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    flex: 1,

    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  largeTile: {
    padding: 28,
    borderRadius: 24,
  },

  tileNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.blueDark,
  },

  largeTileNumber: {
    fontSize: 34,
  },

  tileLabel: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },

  largeTileLabel: {
    fontSize: 18,
  },

  menu: {
    marginTop: 20,
  },

  icon: {
    marginRight: 10,
  },
});
