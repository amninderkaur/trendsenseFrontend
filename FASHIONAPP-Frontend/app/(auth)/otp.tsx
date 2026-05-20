import { useLocalSearchParams, useRouter } from "expo-router";
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

import { verifyOtp } from "../../api/auth";
import { colors, globalStyles } from "../../constants/globalStyles";
import { saveEmail, saveToken, saveUserId } from "../../utils/token";
import PersonalizationModal from "./PersonalizationModal";

export default function OtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPersonalization, setShowPersonalization] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await verifyOtp(email, otp);
      saveToken(data.token);
      saveUserId(data.userId);
      saveEmail(email);
      // First-time login — show personalization questionnaire
      setShowPersonalization(true);
    } catch (err: any) {
      setError("Invalid or expired code. Please try again.");
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

      <PersonalizationModal
        visible={showPersonalization}
        onClose={() => {
          setShowPersonalization(false);
          router.replace("/(tabs)/mainMenu");
        }}
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
            Verify Your Identity
          </Text>

          <Text style={globalStyles.subtitle}>
            Enter the 6-digit code sent to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <TextInput
            placeholder="000000"
            placeholderTextColor={colors.muted}
            style={[
              globalStyles.input,
              styles.otpInput,
              isLargeScreen && globalStyles.largeInput,
            ]}
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/\D/g, "").slice(0, 6));
              if (error) setError("");
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          {error ? (
            <Text style={globalStyles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              globalStyles.primaryButton,
              isLargeScreen && globalStyles.largePrimaryButton,
            ]}
            onPress={handleVerify}
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
                Verify
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.centeredLink}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text
              style={[
                globalStyles.linkText,
                isLargeScreen && globalStyles.largeLinkText,
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

const styles = StyleSheet.create({
  otpInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "700",
  },
  emailText: {
    fontWeight: "700",
    color: colors.text,
  },
});
