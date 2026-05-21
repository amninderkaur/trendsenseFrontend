import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

import { resetPassword } from "../../api/user";
import { colors, globalStyles } from "../../constants/globalStyles";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      router.replace("/(auth)/login");
    } catch {
      setError("Invalid or expired code. Please try again.");
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
            Reset Password
          </Text>
          <Text style={globalStyles.subtitle}>
            Enter the code sent to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <TextInput
            placeholder="000000"
            placeholderTextColor={colors.muted}
            style={[globalStyles.input, styles.otpInput, isLargeScreen && globalStyles.largeInput]}
            value={otp}
            onChangeText={(t) => { setOtp(t.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            keyboardType="number-pad"
            maxLength={6}
          />

          <View style={[globalStyles.input, globalStyles.passwordContainer, isLargeScreen && globalStyles.largeInput]}>
            <TextInput
              placeholder="New Password"
              placeholderTextColor={colors.muted}
              style={[globalStyles.passwordInput, isLargeScreen && globalStyles.largePasswordInput]}
              secureTextEntry={secureNew}
              value={newPassword}
              onChangeText={(t) => { setNewPassword(t); setError(""); }}
            />
            <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
              <Text style={[globalStyles.showText, isLargeScreen && globalStyles.largeShowText]}>
                {secureNew ? "show" : "Hide"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[globalStyles.input, globalStyles.passwordContainer, isLargeScreen && globalStyles.largeInput]}>
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor={colors.muted}
              style={[globalStyles.passwordInput, isLargeScreen && globalStyles.largePasswordInput]}
              secureTextEntry={secureConfirm}
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setError(""); }}
            />
            <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Text style={[globalStyles.showText, isLargeScreen && globalStyles.largeShowText]}>
                {secureConfirm ? "show" : "Hide"}
              </Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[globalStyles.primaryButton, isLargeScreen && globalStyles.largePrimaryButton]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={[globalStyles.primaryButtonText, isLargeScreen && globalStyles.largePrimaryButtonText]}>Reset Password</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.centeredLink} onPress={() => router.replace("/(auth)/login")}>
            <Text style={[globalStyles.linkText, isLargeScreen && globalStyles.largeLinkText]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  otpInput: { textAlign: "center", fontSize: 24, letterSpacing: 8, fontWeight: "700" },
  emailText: { fontWeight: "700", color: colors.text },
});
