import React from "react";

const light = {
  bg: "#F5F2EE",
  bgDark: "#a3bea9",
  card: "#eeede8",
  input: "#dae4e2",
  button: "#5f7f73",
  blue: "#b9d6da",
  blueDark: "#96b7bc",
  text: "#000000",
  muted: "#4B5563",
  accent: "#FF6B4A",
  white: "#FFFFFF",
  overlayDark: "rgba(0,0,0,0.5)",

  headerBg: "#1C2B25",
  headerText: "#FFFFFF",
  headerSubtext: "#B7D1C6",
  headerGold: "#D9B55A",
  headerBorder: "rgba(255,255,255,0.18)",
  headerAvatarBg: "rgba(255,255,255,0.12)",

  profileTintGreen: "#00ff0018",
  profileTintBeige: "#ff9d002c",
  profileTintPurple: "#5500ff1f",
  profileTintGold: "#ffee001e",
  profileTintBlue: "#0099ff27",
  profileTintRed: "#ff000042",
  profileTintPink: "#ff00b321",

  featurePeach: "#E8D5C4",
  featurePurple: "#D4C9E2",
  featureGreen: "#C8D8C4",
  featureDark: "#2A3530",
  featureBeige: "#E2D9C8",
  featurePink: "#F0D4CE",
  featureBlue: "#D4ECEB",

  headerDarkText: "#1C2B25",
  headerDarkSubtext: "#8FAFA3",
  headerGradientStart: "#203528",
  headerGradientEnd: "#5A6C5F",
  headerCornerStart: "#233728",
  headerCornerEnd: "#34493B",
  headerSurface: "#FFFFFF",
};

const dark = {
  bg: "#1f2933",
  bgDark: "#5f7f73",
  card: "#2f3b46",
  input: "#45515c",
  button: "#5f7f73",
  blue: "#3f6870",
  blueDark: "#7fa9b0",
  text: "#ffffff",
  muted: "#cbd5e1",
  accent: "#FF8A70",
  white: "#FFFFFF",
  overlayDark: "rgba(0,0,0,0.65)",

  headerBg: "#111C18",
  headerText: "#FFFFFF",
  headerSubtext: "#7FA99B",
  headerGold: "#D9B55A",
  headerBorder: "rgba(255,255,255,0.14)",
  headerAvatarBg: "rgba(255,255,255,0.08)",

  profileTintGreen: "#6ee7b720",
  profileTintBeige: "#fbbf2426",
  profileTintPurple: "#a78bfa26",
  profileTintGold: "#fde04724",
  profileTintBlue: "#60a5fa26",
  profileTintRed: "#fb718526",
  profileTintPink: "#f472b626",

  featurePeach: "#E8D5C4",
  featurePurple: "#D4C9E2",
  featureGreen: "#C8D8C4",
  featureDark: "#2A3530",
  featureBeige: "#E2D9C8",
  featurePink: "#F0D4CE",
  featureBlue: "#D4ECEB",

  headerDarkText: "#1C2B25",
  headerDarkSubtext: "#8FAFA3",
  headerGradientStart: "#203528",
  headerGradientEnd: "#5A6C5F",
  headerCornerStart: "#233728",
  headerCornerEnd: "#34493B",
  headerSurface: "#FFFFFF",
};
export type ThemeColors = typeof light;

export type AppTheme = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColors: ThemeColors;
};

const ThemeContext = React.createContext<AppTheme>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  themeColors: light,
});

const canUseLocalStorage = () =>
  typeof window !== "undefined" && !!window.localStorage;

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (canUseLocalStorage()) {
      setIsDarkMode(window.localStorage.getItem("darkMode") === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;

      if (canUseLocalStorage()) {
        window.localStorage.setItem("darkMode", String(next));
      }

      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        themeColors: isDarkMode ? dark : light,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => React.useContext(ThemeContext);
