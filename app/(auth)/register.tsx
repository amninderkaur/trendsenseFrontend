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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneDigits, setPhoneDigits] = useState(""); // 10 raw digits, no country code
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">(
    "email",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Formats 10 digits as (XXX) XXX-XXXX — +1 is shown as a fixed prefix
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

  const handlePhoneChange = (text: string) => {
    // Strip all non-digits; drop leading 1 if user typed the country code
    let digits = text.replace(/\D/g, "");
    if (digits.startsWith("1") && digits.length > 1) digits = digits.slice(1);
    setPhoneDigits(digits.slice(0, 10));
    if (error) setError("");
  };

  // E.164 value sent to the API — only valid when all 10 digits are entered
  const e164Phone = phoneDigits.length === 10 ? "+1" + phoneDigits : "";

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (deliveryMethod === "sms" && !phoneDigits) {
      setError("Please enter a phone number to use SMS delivery.");
      return;
    }

    if (phoneDigits && phoneDigits.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(email, password, name.trim(), e164Phone || undefined, deliveryMethod);
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
            placeholder="Full Name"
            placeholderTextColor={colors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
            ]}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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
          <View
            style={[
              globalStyles.input,
              styles.phoneRow,
              isLargeScreen && globalStyles.largeInput,
            ]}
          >
            <Text style={styles.countryCode}>+1</Text>
            <View style={styles.phoneDivider} />
            <TextInput
              placeholder="(647) 123-4567"
              placeholderTextColor={colors.muted}
              style={styles.phoneInput}
              value={formatPhoneDisplay(phoneDigits)}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.fieldLabel}>Receive verification code via</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                deliveryMethod === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => {
                setDeliveryMethod("email");
                setError("");
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
          {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  countryCode: {
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
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
    color: colors.text,
  },
});
