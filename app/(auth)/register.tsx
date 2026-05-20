import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { register } from "../../api/auth";
import { colors, globalStyles } from "../../constants/globalStyles";

const PRIMARY = "#ff9c85";

export default function RegisterScreen() {
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (text: string) => {
    // Strip everything except digits, then prepend + to enforce E.164 format
    const digits = text.replace(/\D/g, "");
    setPhoneNumber(digits ? "+" + digits : "");
    if (error) setError("");
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (deliveryMethod === "sms" && !phoneNumber) {
      setError("Please enter a phone number to use SMS delivery.");
      return;
    }

    if (phoneNumber && !/^\+\d{7,15}$/.test(phoneNumber)) {
      setError("Phone number must be in E.164 format, e.g. +16471234567");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(email, password, phoneNumber || undefined, deliveryMethod);
      // Registration returns no token — redirect to login
      router.replace("/(auth)/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View
        style={[
          globalStyles.topRightCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            top: -circleSize * 0.45,
            right: -circleSize * 0.45,
          },
        ]}
      />

      <View
        style={[
          globalStyles.bottomLeftCircle,
          {
            width: smallCircleSize,
            height: smallCircleSize,
            borderRadius: smallCircleSize / 2,
            bottom: -smallCircleSize * 0.45,
            left: -smallCircleSize * 0.45,
          },
        ]}
      />

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View
          style={[
            globalStyles.formCard,
            isLargeScreen && globalStyles.largeFormCard,
          ]}
        >
          <Text
            style={[
              globalStyles.pageTitle,
              isLargeScreen && globalStyles.largePageTitle,
            ]}
          >
            Create an Account
          </Text>

          <Text style={globalStyles.subtitle}>
            Join us to explore your wardrobe
          </Text>

          <TextInput
            placeholder="email@domain.com"
            placeholderTextColor={colors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
            ]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
            ]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={colors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
            ]}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <Text style={styles.fieldLabel}>Phone Number (optional)</Text>
          <TextInput
            placeholder="Include country code, e.g. +16471234567"
            placeholderTextColor={colors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
            ]}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
          />

          <Text style={styles.fieldLabel}>Receive verification code via</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                deliveryMethod === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => {
                setDeliveryMethod("email");
                setSmsError("");
              }}
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
                deliveryMethod === "sms" && styles.toggleButtonActive,
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
          {error ? (
            <Text style={globalStyles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              globalStyles.primaryButton,
              isLargeScreen && globalStyles.largePrimaryButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen && globalStyles.largePrimaryButtonText,
                ]}
              >
                Register
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.centeredLink}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text
              style={[
                globalStyles.linkText,
                isLargeScreen && globalStyles.largeLinkText,
              ]}
            >
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.input,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.input,
  },
  toggleButtonActive: {
    backgroundColor: PRIMARY,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.muted,
  },
  toggleTextActive: {
    color: colors.white,
  },
});
