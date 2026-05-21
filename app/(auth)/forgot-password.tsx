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
import { colors, globalStyles } from "../../constants/globalStyles";

export default function ForgotPasswordScreen() {
  const router = useRouter();
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
      router.push({ pathname: "/(auth)/reset-password", params: { email: email.trim() } });
    } catch {
      setError("Could not send reset code. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={[globalStyles.topRightCircle, { width: circleSize, height: circleSize, borderRadius: circleSize / 2, top: -circleSize * 0.45, right: -circleSize * 0.45 }]} />
      <View style={[globalStyles.bottomLeftCircle, { width: smallCircleSize, height: smallCircleSize, borderRadius: smallCircleSize / 2, bottom: -smallCircleSize * 0.45, left: -smallCircleSize * 0.45 }]} />

      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View style={[globalStyles.formCard, isLargeScreen && globalStyles.largeFormCard]}>
          <Text style={[globalStyles.pageTitle, isLargeScreen && globalStyles.largePageTitle]}>
            Forgot Password
          </Text>
          <Text style={globalStyles.subtitle}>
            Enter your email and we'll send you a reset code.
          </Text>

          <TextInput
            placeholder="email@domain.com"
            placeholderTextColor={colors.muted}
            style={[globalStyles.input, isLargeScreen && globalStyles.largeInput]}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(""); }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[globalStyles.primaryButton, isLargeScreen && globalStyles.largePrimaryButton]}
            onPress={handleSend}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={[globalStyles.primaryButtonText, isLargeScreen && globalStyles.largePrimaryButtonText]}>Send Reset Code</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.centeredLink} onPress={() => router.back()}>
            <Text style={[globalStyles.linkText, isLargeScreen && globalStyles.largeLinkText]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
