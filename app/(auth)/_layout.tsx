import { useAppTheme } from '@/context/ThemeContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const { themeColors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: themeColors.bg },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}
