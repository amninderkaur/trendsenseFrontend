/* 
* Edit Info Section component
* This component allows users to:
* - edit their name
* - edit their phone number
* - select their preferred verification code delivery method
* - change their profile image (through the header)
* - save changes to the backend
*/
// ================
//     IMPORTS
// ================
import { colors, globalStyles } from "@/constants/globalStyles";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { updateUser } from "../../api/user";
import { useAppTheme } from "../../context/ThemeContext";
import { saveName } from "../../utils/token";

// ==============
//     TYPES
// ==============
type Props = {
  initialName: string;
  onNameChange: (name: string) => void;
  onClose: () => void;
};

// ================
// EDIT INFO COMPONENT
// ================
export default function EditInfoSection({
  initialName,
  onNameChange,
  onClose,
}: Props) {
  const { themeColors } = useAppTheme();

  // Form state
  const [name, setName] = useState(initialName || "");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [deliveryMethod, setDeliveryMethod] =
    useState<"email" | "sms">("email");

  // Submission state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Format phone number for display as (123) 456-7890
  const formatPhoneDisplay = (digits: string) => {
    if (!digits) return "";

    const area = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6, 10);

    let out = "";

    if (area) out += "(" + area;
    if (area.length === 3) out += ")";
    if (prefix) out += " " + prefix;
    if (line) out += "-" + line;

    return out;
  };

  // Keep phone input to digits only and max 10 characters
  const handlePhoneChange = (text: string) => {
    let digits = text.replace(/\D/g, "");

    if (digits.startsWith("1") && digits.length > 1) {
      digits = digits.slice(1);
    }

    setPhoneDigits(digits.slice(0, 10));
    setError("");
  };

  // validate and save updated profile info
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (phoneDigits && phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateUser({
        name: name.trim(),
        phoneNumber: phoneDigits ? "+1" + phoneDigits : undefined,
        deliveryMethod,
      });

      saveName(name.trim());
      onNameChange(name.trim());
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ================
  //     RENDER
  // ================
  return (
    <View style={[globalStyles.card, styles.card]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Edit Profile
      </Text>

      <Text style={[styles.description, { color: colors.muted }]}>
        Update your basic account details. Your profile image can be changed
        from the header while editing.
      </Text>

      <Text style={[styles.label, { color: colors.muted }]}>
        Full Name
      </Text>

      <TextInput
        style={[globalStyles.input, styles.input, { color: colors.text }]}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError("");
        }}
        placeholder="Full Name"
        placeholderTextColor={colors.muted}
        autoCapitalize="words"
      />

      <Text style={[styles.label, { color: colors.muted }]}>
        Phone Number
      </Text>

      <View style={styles.phoneRow}>
        <Text style={[styles.countryCode, { color: colors.text }]}>
          +1
        </Text>

        <View style={styles.phoneDivider} />

        <TextInput
          style={[styles.phoneInput, { color: colors.text }]}
          value={formatPhoneDisplay(phoneDigits)}
          onChangeText={handlePhoneChange}
          placeholder="(647) 123-4567"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={[styles.label, { color: colors.muted }]}>
        Verification Code Delivery
      </Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            deliveryMethod === "email" && styles.toggleActive,
          ]}
          onPress={() => setDeliveryMethod("email")}
        >
          <Text
            style={[
              styles.toggleText,
              deliveryMethod === "email" && styles.toggleTextActive,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            deliveryMethod === "sms" && styles.toggleActive,
          ]}
          onPress={() => setDeliveryMethod("sms")}
        >
          <Text
            style={[
              styles.toggleText,
              deliveryMethod === "sms" && styles.toggleTextActive,
            ]}
          >
            SMS
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onClose}
          disabled={saving}
        >
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.bgDark },
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.actionButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ================
//     STYLES
// ================
const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    marginBottom: 0,
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    borderRadius: 14,
    overflow: "hidden",
  },

  countryCode: {
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
  },

  phoneDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.muted,
    opacity: 0.3,
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },

  toggleRow: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.input,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: colors.input,
  },

  toggleActive: {
    backgroundColor: colors.blueDark,
  },

  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.muted,
  },

  toggleTextActive: {
    color: colors.white,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: colors.muted,
  },

  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});