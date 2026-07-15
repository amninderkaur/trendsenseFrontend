import React from "react";

type ThemeMode = "light" | "dark";

const palette = {
  // Core surfaces and controls
  bg: { light: "#F5F2EE", dark: "#1e2420" },
  bgDark: { light: "#a3bea9", dark: "#5f7f73" },
  card: { light: "#eeede8", dark: "#29312c" },
  input: { light: "#dae4e2", dark: "#45515c" },
  button: { light: "#5f7f73", dark: "#5f7f73" },
  blue: { light: "#b9d6da", dark: "#3f6870" },
  blueDark: { light: "#96b7bc", dark: "#7fa9b0" },

  // Text and shared effects
  text: { light: "#1D3225", dark: "#ffffff" },
  muted: { light: "#4B5563", dark: "#cbd5e1" },
  accent: { light: "#FF6B4A", dark: "#FF8A70" },
  white: { light: "#FFFFFF", dark: "#FFFFFF" },
  overlayDark: {
    light: "rgba(0,0,0,0.5)",
    dark: "rgba(0,0,0,0.65)",
  },
  shadow: { light: "#000000", dark: "#000000" },

  // Feedback and ratings
  error: { light: "#B4554F", dark: "#FF9B94" },
  success: { light: "#3F7D55", dark: "#9ED7AE" },
  successBg: { light: "#DCEFE2", dark: "#284936" },
  rating: { light: "#F5A623", dark: "#FFC45C" },

  // Taste profile
  tasteLoveBg: { light: "#E8F5E9", dark: "#24452E" },
  tasteLoveText: { light: "#2E7D32", dark: "#A7E3B2" },
  tasteSkipBg: { light: "#F5F5F5", dark: "#3C4853" },
  colorFallback: { light: "#CCCCCC", dark: "#697681" },
  colorBorder: { light: "#E0E0E0", dark: "#71808D" },

  // Header
  headerBg: { light: "#1C2B25", dark: "#111C18" },
  headerText: { light: "#FFFFFF", dark: "#FFFFFF" },
  headerSubtext: { light: "#B7D1C6", dark: "#7FA99B" },
  headerGold: { light: "#D9B55A", dark: "#b89745" },
  headerBorder: {
    light: "rgba(255,255,255,0.18)",
    dark: "rgba(255,255,255,0.14)",
  },
  headerAvatarBg: {
    light: "rgba(255,255,255,0.12)",
    dark: "rgba(255,255,255,0.08)",
  },
  headerDarkSubtext: { light: "#8FAFA3", dark: "#8FAFA3" },
  headerGradientStart: { light: "#203528", dark: "#203528" },
  headerGradientEnd: { light: "#5A6C5F", dark: "#203528" },
  headerCornerStart: { light: "#233728", dark: "#233728" },
  headerCornerEnd: { light: "#34493B", dark: "#203528" },
  headerSurface: { light: "#FFFFFF", dark: "#FFFFFF" },

  // Welcome card
  welcomeHeart: { light: "#8CA997", dark: "#A7C4B0" },
  welcomeButton: { light: "#19352C", dark: "#5F7F73" },
  welcomeButtonText: { light: "#FFFFFF", dark: "#FFFFFF" },

  // Wardrobe carousel
  wardrobeControlBg: {
    light: "#1d32250f",
    dark: "rgba(255,255,255,0.08)",
  },
  wardrobeImageBg: { light: "#FFFFFF", dark: "#45515c" },
  wardrobeIndicator: {
    light: "rgba(29,50,37,0.12)",
    dark: "rgba(255,255,255,0.16)",
  },
  wardrobeEmptyBg: {
    light: "rgba(29,50,37,0.04)",
    dark: "rgba(255,255,255,0.05)",
  },

  // Stats card
  statsGreen: { light: "#DDE7DB", dark: "#3d4d42" },
  statsPurple: { light: "#eae3ec", dark: "#4d4a4e" },
  statsPink: { light: "#F5DCD8", dark: "#413837" },
  statsBlue: { light: "#d7e6e5", dark: "#3b4747" },
  statsDivider: {
    light: "rgba(29,50,37,0.10)",
    dark: "rgba(255,255,255,0.12)",
  },

  // Profile accents
  profileTintGreen: { light: "#00ff0018", dark: "#6ee7b720" },
  profileTintBeige: { light: "#ff9d002c", dark: "#fbbf2426" },
  profileTintPurple: { light: "#5500ff1f", dark: "#a78bfa26" },
  profileTintGold: { light: "#ffee001e", dark: "#fde04724" },
  profileTintBlue: { light: "#0099ff27", dark: "#60a5fa26" },
  profileTintRed: { light: "#ff000042", dark: "#fb718526" },
  profileTintPink: { light: "#ff00b321", dark: "#f472b626" },
  profileIconGreen: { light: "#355D4A", dark: "#A7D0B5" },
  profileIconPurple: { light: "#9164C3", dark: "#CAB0E8" },
  profileIconOrange: { light: "#B66337", dark: "#E4A17D" },
  profileIconGold: { light: "#A57D37", dark: "#E4C176" },
  profileIconBlue: { light: "#4D6874", dark: "#A9C3CE" },
  profileIconRed: { light: "#BB5B50", dark: "#F0A19A" },

  // Main-menu feature cards
  featurePeach: { light: "#E8D5C4", dark: "#E8D5C4" },
  featurePurple: { light: "#D4C9E2", dark: "#D4C9E2" },
  featureGreen: { light: "#C8D8C4", dark: "#C8D8C4" },
  featureDark: { light: "#2A3530", dark: "#2A3530" },
  featureBeige: { light: "#E2D9C8", dark: "#E2D9C8" },
  featurePink: { light: "#F0D4CE", dark: "#F0D4CE" },
  featureBlue: { light: "#D4ECEB", dark: "#D4ECEB" },

  // Body analysis card
  bodyCardBg: { light: "#F1E4DA", dark: "#303934" },
  bodyCardButton: { light: "#E8CDBB", dark: "#52645A" },
  bodyCardDecoration: { light: "#DDBDA8", dark: "#91A69A" },
  bodyCardSubtext: { light: "#536157", dark: "#CBD5E1" },
  bodyOutline: { light: "#111111", dark: "#FFFFFF" },
} as const satisfies Record<string, Record<ThemeMode, string>>;

type PaletteKey = keyof typeof palette;

export type ThemeColors = {
  [Key in PaletteKey]: (typeof palette)[Key][ThemeMode];
};

const createTheme = (mode: ThemeMode): ThemeColors =>
  Object.fromEntries(
    Object.entries(palette).map(([key, values]) => [key, values[mode]])
  ) as ThemeColors;

const light = createTheme("light");
const dark = createTheme("dark");

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
