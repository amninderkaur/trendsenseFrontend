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
import { globalStyles } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">(
    "email"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (digits.startsWith("1") && digits.length > 1) {
      digits = digits.slice(1);
    }

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
      // Registration returns no token — redirect to login
      await register(
        email,
        password,
        name.trim(),
        e164Phone || undefined,
        deliveryMethod
      );

      router.replace("/(auth)/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.screen,
        { backgroundColor: themeColors.bg },
      ]}
    >
      <View
        style={[
          globalStyles.topRightCircle,
          {
            backgroundColor: themeColors.bgDark,
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
            backgroundColor: themeColors.blue,
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
            { backgroundColor: themeColors.card },
          ]}
        >
          <Text
            style={[
              globalStyles.pageTitle,
              isLargeScreen && globalStyles.largePageTitle,
              { color: themeColors.text },
            ]}
          >
            Create an Account
          </Text>

          <Text
            style={[
              globalStyles.subtitle,
              { color: themeColors.muted },
            ]}
          >
            Join us to explore your wardrobe
          </Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor={themeColors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
              {
                backgroundColor: themeColors.input,
                color: themeColors.text,
                borderColor: themeColors.bgDark,
              },
            ]}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            placeholder="email@domain.com"
            placeholderTextColor={themeColors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
              {
                backgroundColor: themeColors.input,
                color: themeColors.text,
                borderColor: themeColors.bgDark,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={themeColors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
              {
                backgroundColor: themeColors.input,
                color: themeColors.text,
                borderColor: themeColors.bgDark,
              },
            ]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={themeColors.muted}
            style={[
              globalStyles.input,
              isLargeScreen && globalStyles.largeInput,
              {
                backgroundColor: themeColors.input,
                color: themeColors.text,
                borderColor: themeColors.bgDark,
              },
            ]}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.muted },
            ]}
          >
            Phone Number (optional)
          </Text>

          <View
            style={[
              globalStyles.input,
              styles.phoneRow,
              isLargeScreen && globalStyles.largeInput,
              {
                backgroundColor: themeColors.input,
                borderColor: themeColors.bgDark,
              },
            ]}
          >
            <Text
              style={[
                styles.countryCode,
                { color: themeColors.text },
              ]}
            >
              +1
            </Text>

            <View
              style={[
                styles.phoneDivider,
                { backgroundColor: themeColors.muted },
              ]}
            />

            <TextInput
              placeholder="(647) 123-4567"
              placeholderTextColor={themeColors.muted}
              style={[
                styles.phoneInput,
                { color: themeColors.text },
              ]}
              value={formatPhoneDisplay(phoneDigits)}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />
          </View>

          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.muted },
            ]}
          >
            Receive verification code via
          </Text>

          <View
            style={[
              styles.toggleRow,
              { borderColor: themeColors.input },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: themeColors.input },
                deliveryMethod === "email" && {
                  backgroundColor: themeColors.button,
                },
              ]}
              onPress={() => {
                setDeliveryMethod("email");
                setError("");
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: themeColors.muted },
                  deliveryMethod === "email" && {
                    color: themeColors.white,
                  },
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: themeColors.input },
                deliveryMethod === "sms" && {
                  backgroundColor: themeColors.button,
                },
              ]}
              onPress={() => {
                setDeliveryMethod("sms");
                setError("");
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: themeColors.muted },
                  deliveryMethod === "sms" && {
                    color: themeColors.white,
                  },
                ]}
              >
                SMS
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <Text
              style={[
                globalStyles.errorText,
                isLargeScreen && globalStyles.largeErrorText,
              ]}
            >
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              globalStyles.primaryButton,
              isLargeScreen && globalStyles.largePrimaryButton,
              { backgroundColor: themeColors.button },
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={themeColors.white} />
            ) : (
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen && globalStyles.largePrimaryButtonText,
                  { color: themeColors.white },
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
                { color: themeColors.blueDark },
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
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
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
  },
  phoneDivider: {
    width: 1,
    alignSelf: "stretch",
    opacity: 0.3,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
});