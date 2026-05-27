import { Link, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { login } from "../../api/auth";
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

export default function LoginScreen() {
  const router = useRouter();
  const { themeColors } = useAppTheme();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const circleSize = Math.max(width * 0.6, 180);
  const smallCircleSize = Math.max(width * 0.45, 140);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [secure, setSecure] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    setError(null);
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await login(email, password);

      if (data.requiresOtp) {
        // First-time login — go to OTP screen
        router.push({
          pathname: "/(auth)/otp",
          params: {
            email,
            deliveryMethod: data.deliveryMethod ?? "email",
          },
        });
      } else {
        // Returning user — token returned directly
        saveToken(data.token);
        saveUserId(data.userId);

        if (data.role) saveRole(data.role);
        if (data.name) saveName(data.name);

        saveEmail(email);
        saveLoginTime();
        // Admin goes to admin dashboard, regular users go to main menu

        router.replace(
          data.role === "ADMIN"
            ? "/admin/dashboard"
            : "/(tabs)/mainMenu"
        );
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
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
              Log in
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
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View
              style={[
                globalStyles.input,
                globalStyles.passwordContainer,
                isLargeScreen && globalStyles.largeInput,
                {
                  backgroundColor: themeColors.input,
                  borderColor: themeColors.bgDark,
                },
              ]}
            >
              <TextInput
                placeholder="••••••"
                placeholderTextColor={themeColors.muted}
                style={[
                  globalStyles.passwordInput,
                  isLargeScreen && globalStyles.largePasswordInput,
                  { color: themeColors.text },
                ]}
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Text
                  style={[
                    globalStyles.showText,
                    isLargeScreen && globalStyles.largeShowText,
                    { color: themeColors.blueDark },
                  ]}
                >
                  {secure ? "show" : "Hide"}
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

            <Pressable
              style={[
                globalStyles.primaryButton,
                isLargeScreen && globalStyles.largePrimaryButton,
                { backgroundColor: themeColors.button },
              ]}
              onPress={onSubmit}
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
                  Log In
                </Text>
              )}
            </Pressable>

            <Pressable
              style={globalStyles.centeredLink}
              onPress={() =>
                router.push("/(auth)/forgot-password" as any)
              }
            >
              <Text
                style={[
                  globalStyles.linkText,
                  isLargeScreen && globalStyles.largeLinkText,
                  { color: themeColors.blueDark },
                ]}
              >
                Forgot password?
              </Text>
            </Pressable>

            <Link href="/register" asChild>
              <Pressable style={globalStyles.centeredLink}>
                <Text
                  style={[
                    globalStyles.linkText,
                    isLargeScreen && globalStyles.largeLinkText,
                    { color: themeColors.blueDark },
                  ]}
                >
                  Don&apos;t have an account?
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}