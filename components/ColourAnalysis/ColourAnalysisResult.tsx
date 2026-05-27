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
import { colors, globalStyles } from "@/constants/globalStyles";
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
  return (
    <View style={[globalStyles.card, styles.resultCard]}>
      <Text style={styles.sectionTitle}>Your Colour Results</Text>

      {isSavedResult ? (
        <View style={styles.savedBadge}>
          <Text style={styles.savedBadgeText}>Saved to your profile</Text>
        </View>
      ) : null}

      <View style={styles.seasonCard}>
        <Text style={styles.seasonLabel}>Your Season</Text>
        <Text style={styles.seasonValue}>{result.season}</Text>
      </View>

      <View style={styles.resultGrid}>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Undertone</Text>
          <Text style={styles.resultValue}>{result.undertone}</Text>
        </View>

        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Contrast</Text>
          <Text style={styles.resultValue}>{result.contrast}</Text>
        </View>

        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Best Jewelry</Text>
          <Text style={styles.resultValue}>{result.bestJewelry}</Text>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>{result.summary}</Text>
      </View>

      <Text style={styles.paletteTitle}>Recommended Colours</Text>
      <ColorDots colorsList={result.recommendedColors} />

      <Text style={styles.paletteDescription}>
        AI-selected colours based on your uploaded selfies and answers.
      </Text>

      <Text style={styles.paletteTitle}>Best Colours</Text>
      <Text style={styles.paletteDescription}>
        {result.bestColorsDescription}
      </Text>
      <ColorDots colorsList={result.bestColors} />

      <Text style={styles.paletteTitle}>Worst Colours</Text>
      <Text style={styles.paletteDescription}>
        {result.worstColorsDescription}
      </Text>
      <ColorDots colorsList={result.worstColors} />

      <TouchableOpacity style={globalStyles.primaryButton} onPress={onRetake}>
        <Text style={globalStyles.primaryButtonText}>Retake Analysis</Text>
      </TouchableOpacity>

      {isSavedResult ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClearSaved}
          disabled={clearing}
        >
          {clearing ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <Text style={styles.clearButtonText}>Clear Saved Analysis</Text>
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
    color: colors.text,
    marginBottom: 12,
  },

  savedBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.bgDark,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 14,
  },

  savedBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  seasonCard: {
    backgroundColor: colors.input,
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
    alignItems: "center",
  },

  seasonLabel: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  seasonValue: {
    fontSize: 30,
    color: colors.text,
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
    backgroundColor: colors.input,
    borderRadius: 18,
    padding: 16,
  },

  resultLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
    fontWeight: "700",
  },

  resultValue: {
    fontSize: 17,
    color: colors.text,
    fontWeight: "800",
  },

  summaryBox: {
    backgroundColor: colors.input,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },

  summaryTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },

  paletteTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 8,
  },

  paletteDescription: {
    fontSize: 14,
    color: colors.muted,
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
    borderColor: colors.white,
  },

  clearButton: {
    marginTop: 14,
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.accent,
  },

  clearButtonText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 15,
  },
});