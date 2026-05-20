import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

import { resendOtp, verifyOtp } from "../../api/auth";
import { colors, globalStyles } from "../../constants/globalStyles";
import { saveToken, saveUserId, saveRole } from "../../utils/token";
import PersonalizationModal from "./PersonalizationModal";

const RESEND_COOLDOWN = 30;

export default function OtpScreen() {
  const router = useRouter();
  const { email, deliveryMethod } = useLocalSearchParams<{ email: string; deliveryMethod?: string }>();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPersonalization, setShowPersonalization] = useState(false);

  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCountdown();
    return () => clearTimer();
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startCountdown = () => {
    clearTimer();
    setCountdown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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
      if (data.role) saveRole(data.role);
      if (data.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        setShowPersonalization(true);
      }
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setResendMessage("");
    setError("");
    try {
      await resendOtp(email);
      setResendMessage("A new code has been sent.");
      startCountdown();
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
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
            {deliveryMethod === "sms"
              ? "Enter the 6-digit code sent to your phone number"
              : <>Enter the 6-digit code sent to{"\n"}<Text style={styles.emailText}>{email}</Text></>}
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

          {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
          {resendMessage ? <Text style={styles.successText}>{resendMessage}</Text> : null}

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
            style={[
              styles.resendButton,
              countdown > 0 && styles.resendButtonDisabled,
            ]}
            onPress={handleResend}
            disabled={countdown > 0 || resending}
          >
            {resending ? (
              <ActivityIndicator color={colors.blueDark} />
            ) : (
              <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
                {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
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
  resendButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: colors.blueDark,
    fontWeight: "700",
    fontSize: 14,
  },
  resendTextDisabled: {
    color: colors.muted,
    fontWeight: "500",
  },
  successText: {
    color: "#5a9e6f",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});
