/* 
* Colour Analysis Form Component
* collects user selfies and optional
* colouring information for AI analysis
*/
// ================
//     IMPORTS
// ================
import { colors, globalStyles } from "@/constants/globalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ==============
//     TYPES
// ==============
type Props = {
  selfies: string[];
  naturalHair: string;
  currentHair: string;
  eyeColor: string;
  jewelry: string;
  veins: string;
  sunReaction: string;
  onPickImage: (index: number) => void;
  setNaturalHair: (value: string) => void;
  setCurrentHair: (value: string) => void;
  setEyeColor: (value: string) => void;
  setJewelry: (value: string) => void;
  setVeins: (value: string) => void;
  setSunReaction: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
error: string;
onTakePhoto: () => void;
};

// ================
// COLOUR ANALYSIS FORM COMPONENT
// ================
export default function ColourAnalysisForm({
  selfies,
  naturalHair,
  currentHair,
  eyeColor,
  jewelry,
  veins,
  sunReaction,
  onPickImage,
  setNaturalHair,
  setCurrentHair,
  setEyeColor,
  setJewelry,
  setVeins,
  setSunReaction,
  onGenerate,
}: Props) {
  const OptionButton = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // ================
  //     RENDER
  // ================
  return (
    <View style={[globalStyles.card, styles.formCard]}>
      <Text style={styles.sectionTitle}>Start Your Analysis</Text>

      <Text style={styles.description}>
        For best results, use natural lighting, no filters, and minimal makeup.
        You can upload up to 3 selfies.
      </Text>

      <Text style={styles.label}>Selfies</Text>

      <View style={styles.selfieRow}>
        {[0, 1, 2].map((index) => (
          <TouchableOpacity
            key={index}
            style={styles.selfieBox}
            onPress={() => onPickImage(index)}
          >
            {selfies[index] ? (
              <Image
                source={{ uri: selfies[index] }}
                style={styles.selfieImage}
              />
            ) : (
              <>
                <MaterialIcons
                  name="add-a-photo"
                  size={28}
                  color={colors.blueDark}
                />

                <Text style={styles.selfieText}>Add Selfie</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Natural Hair Colour</Text>
      <TextInput
        style={globalStyles.input}
        value={naturalHair}
        onChangeText={setNaturalHair}
        placeholder="e.g. dark brown, blonde, black"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Current Hair Colour</Text>
      <TextInput
        style={globalStyles.input}
        value={currentHair}
        onChangeText={setCurrentHair}
        placeholder="e.g. natural, dyed red, highlighted"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Eye Colour</Text>
      <TextInput
        style={globalStyles.input}
        value={eyeColor}
        onChangeText={setEyeColor}
        placeholder="e.g. brown, hazel, blue, green"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Which jewelry looks better?</Text>
      <View style={styles.optionsContainer}>
        {["Gold", "Silver", "Both", "Unsure"].map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={jewelry === item}
            onPress={() => setJewelry(item)}
          />
        ))}
      </View>

      <Text style={styles.label}>What colour do your veins appear?</Text>
      <View style={styles.optionsContainer}>
        {["Blue/Purple", "Green", "Both", "Unsure"].map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={veins === item}
            onPress={() => setVeins(item)}
          />
        ))}
      </View>

      <Text style={styles.label}>How does your skin react to sun?</Text>
      <View style={styles.optionsContainer}>
        {["Burns", "Tans", "Both", "Unsure"].map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={sunReaction === item}
            onPress={() => setSunReaction(item)}
          />
        ))}
      </View>

      <TouchableOpacity style={globalStyles.primaryButton} onPress={onGenerate}>
        <Text style={globalStyles.primaryButtonText}>
          Generate Colour Analysis
        </Text>
      </TouchableOpacity>
    </View>
  );
}
// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  formCard: {
    borderRadius: 24,
    padding: 24,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
  },

  selfieRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  selfieBox: {
    flex: 1,
    height: 130,
    borderRadius: 18,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.blueDark,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  selfieImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  selfieText: {
    marginTop: 8,
    color: colors.blueDark,
    fontWeight: "700",
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  optionButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.bgDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  selectedOption: {
    backgroundColor: colors.bgDark,
  },

  optionText: {
    color: colors.text,
    fontWeight: "600",
  },

  selectedOptionText: {
    color: colors.white,
  },
});