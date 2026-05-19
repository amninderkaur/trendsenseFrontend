import { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

import { colors, globalStyles } from "../../constants/globalStyles";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function PersonalizationModal({ visible, onClose }: Props) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [name, setName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const OptionButton = ({ label }: { label: string }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        isLargeScreen && styles.largeOptionButton,
        selectedOptions.includes(label) && styles.selectedButton,
      ]}
      onPress={() => toggleOption(label)}
    >
      <Text
        style={[styles.optionText, isLargeScreen && styles.largeOptionText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View
          style={[
            globalStyles.modalContainer,
            isLargeScreen && globalStyles.largeModalContainer,
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[
                globalStyles.modalTitle,
                isLargeScreen && globalStyles.largeModalTitle,
              ]}
            >
              Personalization Questionnaire
            </Text>

            <Text
              style={[
                globalStyles.modalHeading,
                isLargeScreen && globalStyles.largeModalHeading,
              ]}
            >
              What should we call you?
            </Text>

            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={colors.blueDark}
              style={[
                globalStyles.input,
                styles.modalInput,
                isLargeScreen && globalStyles.largeInput,
              ]}
              value={name}
              onChangeText={setName}
            />

            <Text
              style={[
                globalStyles.modalHeading,
                isLargeScreen && globalStyles.largeModalHeading,
              ]}
            >
              Age Group
            </Text>

            <View style={styles.optionsContainer}>
              <OptionButton label="Under 18" />
              <OptionButton label="18–24" />
              <OptionButton label="25–34" />
              <OptionButton label="35–44" />
              <OptionButton label="45+" />
            </View>

            <Text
              style={[
                globalStyles.modalHeading,
                isLargeScreen && globalStyles.largeModalHeading,
              ]}
            >
              Style Preferences
            </Text>

            <View style={styles.optionsContainer}>
              <OptionButton label="Casual" />
              <OptionButton label="Streetwear" />
              <OptionButton label="Minimalist" />
              <OptionButton label="Luxury" />
              <OptionButton label="Sporty" />
              <OptionButton label="Vintage" />
            </View>

            <Text
              style={[
                globalStyles.modalHeading,
                isLargeScreen && globalStyles.largeModalHeading,
              ]}
            >
              Favorite Colors
            </Text>

            <View style={styles.optionsContainer}>
              <OptionButton label="Black" />
              <OptionButton label="White" />
              <OptionButton label="Pastels" />
              <OptionButton label="Earth tones" />
              <OptionButton label="Bright colors" />
            </View>

            <TouchableOpacity
              style={[
                globalStyles.primaryButton,
                styles.saveButton,
                isLargeScreen && globalStyles.largePrimaryButton,
              ]}
              onPress={onClose}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen && globalStyles.largePrimaryButtonText,
                ]}
              >
                Save Preferences
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={onClose}>
              <Text
                style={[styles.skipText, isLargeScreen && styles.largeSkipText]}
              >
                Skip for Now
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modalInput: {
    backgroundColor: colors.white,
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.bgDark,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
  },

  largeOptionButton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
  },

  selectedButton: {
    backgroundColor: colors.bgDark,
  },

  optionText: {
    color: colors.text,
    fontSize: 14,
  },

  largeOptionText: {
    fontSize: 18,
  },

  saveButton: {
    marginTop: 20,
  },

  skipButton: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  skipText: {
    color: colors.blueDark,
    fontWeight: "600",
    fontSize: 15,
  },

  largeSkipText: {
    fontSize: 18,
  },
});
