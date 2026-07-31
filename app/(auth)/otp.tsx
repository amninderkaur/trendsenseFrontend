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
import { globalStyles } from "../../constants/globalStyles";
import { useAppTheme } from "../../context/ThemeContext";
import {
  saveEmail,
  saveLoginTime,
  saveName,
  saveRole,
  saveToken,
  saveUserId,
} from "../../utils/token";
import PersonalizationModal from "./PersonalizationModal";

const RESEND_COOLDOWN = 30;

export default function OtpScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const { email, deliveryMethod } = useLocalSearchParams<{
    email: string;
    deliveryMethod?: string;
  }>();

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
      if (data.name) saveName(data.name);
      if (email) saveEmail(email);

      saveLoginTime();

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
            Verify Your Identity
          </Text>

          <Text
            style={[
              globalStyles.subtitle,
              { color: themeColors.muted },
            ]}
          >
            {deliveryMethod === "sms" ? (
              "Enter the 6-digit code sent to your phone number"
            ) : (
              <>
                Enter the 6-digit code sent to{"\n"}
                <Text style={[styles.emailText, { color: themeColors.text }]}>
                  {email}
                </Text>
              </>
            )}
          </Text>

          <TextInput
            placeholder="000000"
            placeholderTextColor={themeColors.muted}
            style={[
              globalStyles.input,
              styles.otpInput,
              isLargeScreen && globalStyles.largeInput,
              {
                backgroundColor: themeColors.input,
                color: themeColors.text,
                borderColor: themeColors.bgDark,
              },
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

          {resendMessage ? (
            <Text style={styles.successText}>{resendMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              globalStyles.primaryButton,
              isLargeScreen && globalStyles.largePrimaryButton,
              { backgroundColor: themeColors.button },
            ]}
            onPress={handleVerify}
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
              <ActivityIndicator color={themeColors.blueDark} />
            ) : (
              <Text
                style={[
                  styles.resendText,
                  { color: themeColors.blueDark },
                  countdown > 0 && {
                    color: themeColors.muted,
                    fontWeight: "500",
                  },
                ]}
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend Code"}
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

const styles = StyleSheet.create({
  otpInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "700",
  },

  emailText: {
    fontWeight: "700",
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
    fontWeight: "700",
    fontSize: 14,
  },

  successText: {
    color: "#5a9e6f",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});