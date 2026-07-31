import React from "react";
import { Platform, useWindowDimensions } from "react-native";

import MobileMainMenuLayout from "../../layouts/MobileMainMenuLayout";
import WebMainMenuLayout from "../../layouts/WebMainMenuLayout";

export default function MainMenu() {
  const { width } = useWindowDimensions();
  const useWebLayout = Platform.OS === "web" && width >= 768;

  return useWebLayout ? <WebMainMenuLayout /> : <MobileMainMenuLayout />;
}
