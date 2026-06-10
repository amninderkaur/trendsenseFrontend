import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="mainMenu" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="trends" />
      <Stack.Screen name="budgeting" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="upload-clothes" />
      <Stack.Screen name="upload-outfit" />
      <Stack.Screen name="colour-analysis" />
      <Stack.Screen name="body-analysis" />
      <Stack.Screen name="wardrobe/index" />
      <Stack.Screen name="wardrobe/[outfitId]" />
      <Stack.Screen name="history/index" />
      <Stack.Screen name="history/[clothingId]" />
    </Stack>
  );
}
