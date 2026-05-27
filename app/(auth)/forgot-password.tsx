import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { forgotPassword } from "../../api/user";
import { globalStyles } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email.trim());

      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: email.trim() },
      });
    } catch {
      setError(
        "Could not send reset code. Please check your email and try again."
      );
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
            Forgot Password
          </Text>

          <Text
            style={[
              globalStyles.subtitle,
              { color: themeColors.muted },
            ]}
          >
            Enter your email and we'll send you a reset code.
          </Text>

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
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {error ? (
            <Text style={globalStyles.errorText}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              globalStyles.primaryButton,
              isLargeScreen && globalStyles.largePrimaryButton,
              { backgroundColor: themeColors.button },
            ]}
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={themeColors.white} />
            ) : (
              <Text
                style={[
                  globalStyles.primaryButtonText,
                  isLargeScreen &&
                    globalStyles.largePrimaryButtonText,
                  { color: themeColors.white },
                ]}
              >
                Send Reset Code
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.centeredLink}
            onPress={() => router.back()}
          >
            <Text
              style={[
                globalStyles.linkText,
                isLargeScreen && globalStyles.largeLinkText,
                { color: themeColors.blueDark },
              ]}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}