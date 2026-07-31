/* 
* Colour Analysis Result Component
* displays the results of the colour analysis including:
*  - season type
*  - undertone and contrast level
*  - best jewelry colour
*  - AI-generated summary of colouring characteristics
*  - recommended colour palette with descriptions
*  - option to retake analysis or clear saved result
*/
// ================
//     IMPORTS
// ================
import type { ColourAnalysisResultData } from "@/app/(tabs)/colour-analysis";
import { globalStyles } from "@/constants/globalStyles";
import { useAppTheme } from "@/context/ThemeContext";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ==============
//     TYPES
// ==============
type Props = {
  result: ColourAnalysisResultData;
  isSavedResult: boolean;
  clearing: boolean;
  onRetake: () => void;
  onClearSaved: () => void;
};

export default function ColourAnalysisResult({
  result,
  isSavedResult,
  clearing,
  onRetake,
  onClearSaved,
}: Props) {
  const ColorDots = ({ colorsList }: { colorsList: string[] }) => (
    <View style={styles.colorRow}>
      {colorsList.map((color, index) => (
        <View
          key={`${color}-${index}`}
          style={[styles.colorDot, { backgroundColor: color }]}
        />
      ))}
    </View>
  );

   // ================
  //     RENDER
  // ================
 const { themeColors } = useAppTheme();

return (
  <View
    style={[
      globalStyles.card,
      styles.resultCard,
      { backgroundColor: themeColors.card },
    ]}
  >
    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
      Your Colour Results
    </Text>

    {isSavedResult ? (
      <View
        style={[
          styles.savedBadge,
          { backgroundColor: themeColors.bgDark },
        ]}
      >
        <Text
          style={[
            styles.savedBadgeText,
            { color: themeColors.white },
          ]}
        >
          Saved to your profile
        </Text>
      </View>
    ) : null}

    <View
      style={[
        styles.seasonCard,
        { backgroundColor: themeColors.input },
      ]}
    >
      <Text
        style={[
          styles.seasonLabel,
          { color: themeColors.muted },
        ]}
      >
        Your Season
      </Text>

      <Text
        style={[
          styles.seasonValue,
          { color: themeColors.text },
        ]}
      >
        {result.season}
      </Text>
    </View>

    <View style={styles.resultGrid}>
      <View
        style={[
          styles.resultItem,
          { backgroundColor: themeColors.input },
        ]}
      >
        <Text
          style={[
            styles.resultLabel,
            { color: themeColors.muted },
          ]}
        >
          Undertone
        </Text>

        <Text
          style={[
            styles.resultValue,
            { color: themeColors.text },
          ]}
        >
          {result.undertone}
        </Text>
      </View>

      <View
        style={[
          styles.resultItem,
          { backgroundColor: themeColors.input },
        ]}
      >
        <Text
          style={[
            styles.resultLabel,
            { color: themeColors.muted },
          ]}
        >
          Contrast
        </Text>

        <Text
          style={[
            styles.resultValue,
            { color: themeColors.text },
          ]}
        >
          {result.contrast}
        </Text>
      </View>

      <View
        style={[
          styles.resultItem,
          { backgroundColor: themeColors.input },
        ]}
      >
        <Text
          style={[
            styles.resultLabel,
            { color: themeColors.muted },
          ]}
        >
          Best Jewelry
        </Text>

        <Text
          style={[
            styles.resultValue,
            { color: themeColors.text },
          ]}
        >
          {result.bestJewelry}
        </Text>
      </View>
    </View>

    <View
      style={[
        styles.summaryBox,
        { backgroundColor: themeColors.input },
      ]}
    >
      <Text
        style={[
          styles.summaryTitle,
          { color: themeColors.text },
        ]}
      >
        Summary
      </Text>

      <Text
        style={[
          styles.summaryText,
          { color: themeColors.muted },
        ]}
      >
        {result.summary}
      </Text>
    </View>

    <Text
      style={[
        styles.paletteTitle,
        { color: themeColors.text },
      ]}
    >
      Recommended Colours
    </Text>

    <ColorDots colorsList={result.recommendedColors} />

    <Text
      style={[
        styles.paletteDescription,
        { color: themeColors.muted },
      ]}
    >
      AI-selected colours based on your uploaded selfies and answers.
    </Text>

    <Text
      style={[
        styles.paletteTitle,
        { color: themeColors.text },
      ]}
    >
      Best Colours
    </Text>

    <Text
      style={[
        styles.paletteDescription,
        { color: themeColors.muted },
      ]}
    >
      {result.bestColorsDescription}
    </Text>

    <ColorDots colorsList={result.bestColors} />

    <Text
      style={[
        styles.paletteTitle,
        { color: themeColors.text },
      ]}
    >
      Worst Colours
    </Text>

    <Text
      style={[
        styles.paletteDescription,
        { color: themeColors.muted },
      ]}
    >
      {result.worstColorsDescription}
    </Text>

    <ColorDots colorsList={result.worstColors} />

    <TouchableOpacity
      style={[
        globalStyles.primaryButton,
        { backgroundColor: themeColors.button },
      ]}
      onPress={onRetake}
    >
      <Text
        style={[
          globalStyles.primaryButtonText,
          { color: themeColors.white },
        ]}
      >
        Retake Analysis
      </Text>
    </TouchableOpacity>

    {isSavedResult ? (
      <TouchableOpacity
        style={[
          styles.clearButton,
          { borderColor: themeColors.accent },
        ]}
        onPress={onClearSaved}
        disabled={clearing}
      >
        {clearing ? (
          <ActivityIndicator color={themeColors.accent} />
        ) : (
          <Text
            style={[
              styles.clearButtonText,
              { color: themeColors.accent },
            ]}
          >
            Clear Saved Analysis
          </Text>
        )}
      </TouchableOpacity>
    ) : null}
  </View>
);
}
// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  resultCard: {
    borderRadius: 24,
    padding: 24,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },

  savedBadge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 14,
  },

  savedBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  seasonCard: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
    alignItems: "center",
  },

  seasonLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  seasonValue: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  resultItem: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
  },

  resultLabel: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "700",
  },

  resultValue: {
    fontSize: 17,
    fontWeight: "800",
  },

  summaryBox: {
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },

  paletteTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 8,
  },

  paletteDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  colorDot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
  },

  clearButton: {
    marginTop: 14,
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
  },

  clearButtonText: {
    fontWeight: "800",
    fontSize: 15,
  },
});