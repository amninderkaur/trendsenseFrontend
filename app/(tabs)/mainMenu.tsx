import React from "react";
import { Platform } from "react-native";

import MobileMainMenuLayout from "../../layouts/MobileMainMenuLayout";
import WebMainMenuLayout from "../../layouts/WebMainMenuLayout";

export default function MainMenu() {
  const isWeb = Platform.OS === "web";

  return isWeb ? <WebMainMenuLayout /> : <MobileMainMenuLayout />;
}
