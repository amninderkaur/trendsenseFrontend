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
import { colors, globalStyles } from "../../constants/globalStyles";
import { saveToken, saveUserId, saveRole } from "../../utils/token";

export default function LoginScreen() {
  const router = useRouter();

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
          params: { email, deliveryMethod: data.deliveryMethod ?? "email" },
        });
      } else {
        // Returning user — token returned directly
        saveToken(data.token);
        saveUserId(data.userId);
        if (data.role) saveRole(data.role);
        // Admin goes to admin dashboard, regular users go to main menu
        router.replace(data.role === "ADMIN" ? "/admin/dashboard" : "/(tabs)/mainMenu");
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
              Log in
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

            <View
              style={[
                globalStyles.input,
                globalStyles.passwordContainer,
                isLargeScreen && globalStyles.largeInput,
              ]}
            >
              <TextInput
                placeholder="••••••"
                placeholderTextColor={colors.muted}
                style={[
                  globalStyles.passwordInput,
                  isLargeScreen && globalStyles.largePasswordInput,
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
              ]}
              onPress={onSubmit}
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
                  Log In
                </Text>
              )}
            </Pressable>

            <Link href="/register" asChild>
              <Pressable style={globalStyles.centeredLink}>
                <Text
                  style={[
                    globalStyles.linkText,
                    isLargeScreen && globalStyles.largeLinkText,
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
