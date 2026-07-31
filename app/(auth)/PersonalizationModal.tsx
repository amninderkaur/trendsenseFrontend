import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { getProfile, saveProfile } from "../../api/profile";
import { globalStyles } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Preferences = {
  name: string;
  ageGroup: string;
  gender: string;
  genderOther: string;
  style: string[];
  outfitInspiration: string;
  outfitImages: string[];
  favoriteColors: string[];
  avoidedColors: string;
  shoppingFor: string[];
  preferredFit: string;
  fabrics: string[];
  fitConcerns: string[];
  lifestyle: string[];
  climate: string;
  budget: string;
  shopFrequency: string;
  shoppingMatters: string[];
  favoriteBrands: string[];
  avoidedBrands: string[];
  recommendationFeatures: string[];
  notifications: string;
};

const brandOptions = [
  "Zara",
  "H&M",
  "Nike",
  "Adidas",
  "Uniqlo",
  "Aritzia",
  "Shein",
  "Gap",
  "Old Navy",
  "Mango",
  "Winners",
  "Hudson's Bay",
  "Lululemon",
  "Garage",
  "Dynamite",
];

const splitCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function PersonalizationModal({ visible, onClose }: Props) {
  const { themeColors } = useAppTheme();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [favoriteBrandSearch, setFavoriteBrandSearch] = useState("");
  const [avoidBrandSearch, setAvoidBrandSearch] = useState("");

  const emptyPreferences: Preferences = {
    name: "",
    ageGroup: "",
    gender: "",
    genderOther: "",
    style: [],
    outfitInspiration: "",
    outfitImages: [],
    favoriteColors: [],
    avoidedColors: "",
    shoppingFor: [],
    preferredFit: "",
    fabrics: [],
    fitConcerns: [],
    lifestyle: [],
    climate: "",
    budget: "",
    shopFrequency: "",
    shoppingMatters: [],
    favoriteBrands: [],
    avoidedBrands: [],
    recommendationFeatures: [],
    notifications: "",
  };

  const [preferences, setPreferences] =
    useState<Preferences>(emptyPreferences);

  useEffect(() => {
    if (!visible) return;

    const loadSaved = async () => {
      try {
        const data = await getProfile();

        if (data) {
          setPreferences({
            ...emptyPreferences,
            name: data.displayName || "",
            ageGroup: data.ageGroup || "",
            gender: data.gender || "",
            genderOther: "",
            style: data.styles || [],
            outfitInspiration: "",
            outfitImages: [],
            favoriteColors: data.favoriteColors || [],
            avoidedColors: (data.colorsToAvoid || []).join(", "),
            shoppingFor: data.shoppingFor || [],
            preferredFit: Array.isArray(data.preferredFit)
              ? data.preferredFit[0] || ""
              : data.preferredFit || "",
            fabrics: data.preferredFabrics || [],
            fitConcerns: data.fitConcerns || [],
            lifestyle: data.dressFor || [],
            climate: data.climate || "",
            budget: data.budgetPerItem || "",
            shopFrequency: data.shoppingFrequency || "",
            shoppingMatters: data.shoppingPriorities || [],
            favoriteBrands: data.favoriteBrands || [],
            avoidedBrands: data.brandsToAvoid || [],
            recommendationFeatures: data.recommendationBases || [],
            notifications:
              data.styleNotifications === true
                ? "Yes"
                : data.styleNotifications === false
                ? "No"
                : "",
          });

          return;
        }
      } catch {
        // No saved profile yet
      }
    };

    loadSaved();
  }, [visible]);

  const setSingle = (key: keyof Preferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  const toggleMulti = (
    key: keyof Preferences,
    value: string,
    max?: number
  ) => {
    setPreferences((prev) => {
      const current = prev[key] as string[];

      if (current.includes(value)) {
        return {
          ...prev,
          [key]: current.filter((item) => item !== value),
        };
      }

      if (max && current.length >= max) return prev;

      return {
        ...prev,
        [key]: [...current, value],
      };
    });
  };

  const updateText = (key: keyof Preferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickOutfitImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError("Please allow photo access to upload inspiration images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);

      setPreferences((prev) => ({
        ...prev,
        outfitImages: [...prev.outfitImages, ...uris],
      }));
    }
  };

  const buildProfilePayload = () => ({
    displayName: preferences.name,
    ageGroup: preferences.ageGroup,
    gender:
      preferences.gender === "Self-describe"
        ? preferences.genderOther
        : preferences.gender,
    styles: preferences.style,
    favoriteColors: preferences.favoriteColors,
    colorsToAvoid: splitCommaList(preferences.avoidedColors),
    shoppingFor: preferences.shoppingFor,
    preferredFit: preferences.preferredFit
      ? [preferences.preferredFit]
      : [],
    preferredFabrics: preferences.fabrics,
    fitConcerns: preferences.fitConcerns,
    dressFor: preferences.lifestyle,
    climate: preferences.climate,
    budgetPerItem: preferences.budget,
    shoppingFrequency: preferences.shopFrequency,
    shoppingPriorities: preferences.shoppingMatters,
    favoriteBrands: preferences.favoriteBrands,
    brandsToAvoid: preferences.avoidedBrands,
    recommendationBases: preferences.recommendationFeatures,
    styleNotifications: preferences.notifications === "Yes",
  });

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await saveProfile(buildProfilePayload());
      onClose();
    } catch (err: any) {
      setError(err?.message || "Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const SingleOption = ({
    field,
    label,
  }: {
    field: keyof Preferences;
    label: string;
  }) => {
    const selected = preferences[field] === label;

    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          isLargeScreen && styles.largeOptionButton,
          {
            borderColor: themeColors.bgDark,
            backgroundColor: selected
              ? themeColors.blueDark
              : themeColors.card,
          },
        ]}
        onPress={() => setSingle(field, label)}
      >
        <Text
          style={[
            styles.optionText,
            selected && styles.selectedOptionText,
            isLargeScreen && styles.largeOptionText,
            {
              color: selected ? themeColors.white : themeColors.text,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const MultiOption = ({
    field,
    label,
    max,
  }: {
    field: keyof Preferences;
    label: string;
    max?: number;
  }) => {
    const selected = (preferences[field] as string[]).includes(label);

    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          isLargeScreen && styles.largeOptionButton,
          {
            borderColor: themeColors.bgDark,
            backgroundColor: selected
              ? themeColors.blueDark
              : themeColors.card,
          },
        ]}
        onPress={() => toggleMulti(field, label, max)}
      >
        <Text
          style={[
            styles.optionText,
            selected && styles.selectedOptionText,
            isLargeScreen && styles.largeOptionText,
            {
              color: selected ? themeColors.white : themeColors.text,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const Q = ({ children }: { children: React.ReactNode }) => (
    <Text
      style={[
        globalStyles.modalHeading,
        isLargeScreen && globalStyles.largeModalHeading,
        { color: themeColors.text },
      ]}
    >
      {children}
    </Text>
  );

  const inputStyle = [
    globalStyles.input,
    styles.modalInput,
    isLargeScreen && globalStyles.largeInput,
    {
      backgroundColor: themeColors.input,
      color: themeColors.text,
      borderColor: themeColors.bgDark,
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={[
          styles.overlay,
          { backgroundColor: themeColors.overlayDark },
        ]}
      >
        <View
          style={[
            globalStyles.modalContainer,
            isLargeScreen && globalStyles.largeModalContainer,
            { backgroundColor: themeColors.card },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ outline: "none" } as any}
          >
            <Text
              style={[
                globalStyles.modalTitle,
                isLargeScreen && globalStyles.largeModalTitle,
                { color: themeColors.text },
              ]}
            >
              Fashion App Personalization Questionnaire
            </Text>

            <Q>What should we call you?</Q>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={themeColors.blueDark}
              style={inputStyle}
              value={preferences.name}
              onChangeText={(text) => updateText("name", text)}
            />

            <Q>Age Group</Q>
            <View style={styles.optionsContainer}>
              {["Under 18", "18–24", "25–34", "35–44", "45+"].map(
                (item) => (
                  <SingleOption key={item} field="ageGroup" label={item} />
                )
              )}
            </View>

            <Q>How do you identify? (Optional)</Q>
            <View style={styles.optionsContainer}>
              {[
                "Women",
                "Men",
                "Non-binary",
                "Prefer not to say",
                "Self-describe",
              ].map((item) => (
                <SingleOption key={item} field="gender" label={item} />
              ))}
            </View>

            <TextInput
              placeholder="Self-describe (optional)"
              placeholderTextColor={themeColors.blueDark}
              style={inputStyle}
              value={preferences.genderOther}
              onChangeText={(text) => updateText("genderOther", text)}
            />

            <Q>How would you describe your style? (Select up to 3)</Q>
            <View style={styles.optionsContainer}>
              {[
                "Casual",
                "Streetwear",
                "Minimalist",
                "Business/Formal",
                "Vintage",
                "Trendy",
                "Luxury",
                "Sporty/Athleisure",
                "Boho",
                "Edgy",
                "Classic",
                "Other",
              ].map((item) => (
                <MultiOption
                  key={item}
                  field="style"
                  label={item}
                  max={3}
                />
              ))}
            </View>

            <Q>Which outfits inspire you most?</Q>
            <TextInput
              placeholder="Write mood board style or image idea"
              placeholderTextColor={themeColors.blueDark}
              style={inputStyle}
              value={preferences.outfitInspiration}
              onChangeText={(text) =>
                updateText("outfitInspiration", text)
              }
            />

            <TouchableOpacity
              style={[
                globalStyles.primaryButton,
                styles.uploadButton,
                { backgroundColor: themeColors.button },
              ]}
              onPress={pickOutfitImage}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  { color: themeColors.white },
                ]}
              >
                Upload Inspiration Images
              </Text>
            </TouchableOpacity>

            <View style={styles.imageRow}>
              {preferences.outfitImages.map((uri, index) => (
                <Image
                  key={`${uri}-${index}`}
                  source={{ uri }}
                  style={styles.previewImage}
                />
              ))}
            </View>

            <Q>Favourite colours?</Q>
            <View style={styles.optionsContainer}>
              {[
                "Black",
                "White",
                "Neutral tones",
                "Bright colors",
                "Pastels",
                "Earth tones",
                "Custom selection",
              ].map((item) => (
                <MultiOption
                  key={item}
                  field="favoriteColors"
                  label={item}
                />
              ))}
            </View>

            <Q>Colours you avoid?</Q>
            <TextInput
              placeholder="e.g. yellow, orange, neon"
              placeholderTextColor={themeColors.blueDark}
              style={inputStyle}
              value={preferences.avoidedColors}
              onChangeText={(text) => updateText("avoidedColors", text)}
            />

            <Q>What are you shopping for most often?</Q>
            <View style={styles.optionsContainer}>
              {[
                "Tops",
                "Bottoms",
                "Dresses",
                "Outerwear",
                "Shoes",
                "Accessories",
                "Activewear",
                "Workwear",
              ].map((item) => (
                <MultiOption key={item} field="shoppingFor" label={item} />
              ))}
            </View>

            <Q>Preferred fit?</Q>
            <View style={styles.optionsContainer}>
              {["Oversized", "Relaxed", "Regular", "Slim/Fitted", "Mixed"].map(
                (item) => (
                  <SingleOption
                    key={item}
                    field="preferredFit"
                    label={item}
                  />
                )
              )}
            </View>

            <Q>Preferred fabrics?</Q>
            <View style={styles.optionsContainer}>
              {[
                "Cotton",
                "Linen",
                "Denim",
                "Wool",
                "Synthetic blends",
                "Sustainable materials",
              ].map((item) => (
                <MultiOption key={item} field="fabrics" label={item} />
              ))}
            </View>

            <Q>Fit concerns? (Optional)</Q>
            <View style={styles.optionsContainer}>
              {[
                "Petite",
                "Tall",
                "Curvy",
                "Broad shoulders",
                "Long legs",
                "Other",
              ].map((item) => (
                <MultiOption key={item} field="fitConcerns" label={item} />
              ))}
            </View>

            <Q>What do you dress for most?</Q>
            <View style={styles.optionsContainer}>
              {[
                "College/School",
                "Office",
                "Casual everyday",
                "Parties",
                "Travel",
                "Gym",
                "Dates",
                "Special events",
              ].map((item) => (
                <MultiOption key={item} field="lifestyle" label={item} />
              ))}
            </View>

            <Q>Climate where you live</Q>
            <View style={styles.optionsContainer}>
              {["Cold", "Moderate", "Hot", "Mixed seasons"].map((item) => (
                <SingleOption key={item} field="climate" label={item} />
              ))}
            </View>

            <Q>Budget per item</Q>
            <View style={styles.optionsContainer}>
              {[
                "Under $25",
                "$25–$50",
                "$50–$100",
                "$100–$200",
                "$200+",
              ].map((item) => (
                <SingleOption key={item} field="budget" label={item} />
              ))}
            </View>

            <Q>How often do you shop?</Q>
            <View style={styles.optionsContainer}>
              {["Weekly", "Monthly", "Seasonally", "Only when needed"].map(
                (item) => (
                  <SingleOption
                    key={item}
                    field="shopFrequency"
                    label={item}
                  />
                )
              )}
            </View>

            <Q>What matters most when shopping?</Q>
            <View style={styles.optionsContainer}>
              {["Price", "Quality", "Brand", "Sustainability", "Comfort", "Trends"].map(
                (item) => (
                  <MultiOption
                    key={item}
                    field="shoppingMatters"
                    label={item}
                  />
                )
              )}
            </View>

            <Q>Favourite brands</Q>
            <TextInput
              placeholder="Search favourite brands"
              placeholderTextColor={themeColors.blueDark}
              style={inputStyle}
              value={favoriteBrandSearch}
              onChangeText={setFavoriteBrandSearch}
            />

            <View style={styles.optionsContainer}>
              {brandOptions
                .filter((brand) =>
                  brand
                    .toLowerCase()
                    .includes(favoriteBrandSearch.toLowerCase())
                )
                .map((brand) => (
                  <MultiOption
                    key={brand}
                    field="favoriteBrands"
                    label={brand}
                  />
                ))}
            </View>

            <Q>Brands you avoid</Q>
            <TextInput
              placeholder="Search brands to avoid"
              placeholderTextColor={themeColors.blueDark}
              style={inputStyle}
              value={avoidBrandSearch}
              onChangeText={setAvoidBrandSearch}
            />

            <View style={styles.optionsContainer}>
              {brandOptions
                .filter((brand) =>
                  brand
                    .toLowerCase()
                    .includes(avoidBrandSearch.toLowerCase())
                )
                .map((brand) => (
                  <MultiOption
                    key={brand}
                    field="avoidedBrands"
                    label={brand}
                  />
                ))}
            </View>

            <Q>Would you like recommendations based on:</Q>
            <View style={styles.optionsContainer}>
              {[
                "Current weather",
                "Upcoming events",
                "Social media trends",
                "Wardrobe matching",
                "AI outfit generation",
              ].map((item) => (
                <MultiOption
                  key={item}
                  field="recommendationFeatures"
                  label={item}
                />
              ))}
            </View>

            <Q>Would you like style notifications?</Q>
            <View style={styles.optionsContainer}>
              {["Yes", "No"].map((item) => (
                <SingleOption key={item} field="notifications" label={item} />
              ))}
            </View>

            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                globalStyles.primaryButton,
                styles.saveButton,
                isLargeScreen && globalStyles.largePrimaryButton,
                { backgroundColor: themeColors.button },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen && globalStyles.largePrimaryButtonText,
                  { color: themeColors.white },
                ]}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={onClose}>
              <Text
                style={[
                  styles.skipText,
                  isLargeScreen && styles.largeSkipText,
                  { color: themeColors.blueDark },
                ]}
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
    justifyContent: "center",
    padding: 20,
  },

  modalInput: {},

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
    marginRight: 10,
    marginBottom: 10,
  },

  largeOptionButton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
  },

  optionText: {
    fontSize: 14,
  },

  selectedOptionText: {
    fontWeight: "700",
  },

  largeOptionText: {
    fontSize: 18,
  },

  uploadButton: {
    marginTop: 0,
    marginBottom: 10,
  },

  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
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
    fontWeight: "600",
    fontSize: 15,
  },

  largeSkipText: {
    fontSize: 18,
  },
});