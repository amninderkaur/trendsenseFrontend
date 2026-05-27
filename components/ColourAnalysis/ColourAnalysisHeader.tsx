/* 
* Colour Analysis Header Component
* displays the title, description, and icon for the colour analysis flow
* includes a back button to return to the previous screen
*/
// ================
//     IMPORTS
// ================
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ==============
//     TYPES
// ==============
type Props = {
  isLargeScreen: boolean;
  onBack: () => void;
};

// ================
// COLOUR ANALYSIS HEADER COMPONENT
// ================
export default function ColourAnalysisHeader({ isLargeScreen, onBack }: Props) {

    const { themeColors } = useAppTheme();

  // ================
  //     RENDER
  // ================
  return (
  <>
    <TouchableOpacity
      style={[
        styles.backButton,
        { backgroundColor: themeColors.card },
      ]}
      onPress={onBack}
    >
      <Text
        style={[
          styles.backText,
          { color: themeColors.text },
        ]}
      >
        ← Back
      </Text>
    </TouchableOpacity>

    <View
      style={[
        globalStyles.card,
        styles.heroCard,
        { backgroundColor: themeColors.card },
      ]}
    >
      <View style={styles.heroTextBlock}>
        <Text
          style={[
            globalStyles.pageTitle,
            isLargeScreen && globalStyles.largePageTitle,
            { color: themeColors.text },
          ]}
        >
          Colour Analysis
        </Text>

        <Text
          style={[
            globalStyles.subtitle,
            isLargeScreen && styles.largeSubtitle,
            { color: themeColors.muted },
          ]}
        >
          Upload selfies and answer a few quick questions so AI can suggest
          your undertone, contrast level, and seasonal colour palette.
        </Text>
      </View>

      <View
        style={[
          styles.heroIconCircle,
          { backgroundColor: themeColors.blueDark },
        ]}
      >
        <MaterialIcons
          name="palette"
          size={isLargeScreen ? 70 : 42}
          color={themeColors.white}
        />
      </View>
    </View>
  </>
);
}
// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  backText: {
    fontWeight: "700",
  },

  heroCard: {
    borderRadius: 28,
    padding: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  heroTextBlock: {
    flex: 1,
    paddingRight: 20,
  },

  largeSubtitle: {
    fontSize: 20,
    lineHeight: 28,
  },

  heroIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
});