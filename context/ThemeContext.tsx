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

  // Colour season card
  colourSeasonText: { light: "#1D3225", dark: "#F4F7F5" },
  colourSeasonSubtext: { light: "#415248", dark: "#D2DDD6" },
  colourSeasonEyebrow: { light: "#667469", dark: "#B9C9C0" },
  colourSeasonSparkle: { light: "#D9A545", dark: "#F1C96E" },
  colourSeasonFrame: { light: "rgba(255,255,255,0.85)", dark: "rgba(255,255,255,0.45)" },
  colourSeasonCircle: { light: "rgba(255,255,255,0.42)", dark: "rgba(255,255,255,0.12)" },
  colourSeasonDecoration: { light: "#FFFFFF", dark: "#F4F7F5" },
  colourSeasonShadow: { light: "#000000", dark: "#000000" },
  colourSeasonSwatchShadow: { light: "drop-shadow(0px 7px 6px rgba(0,0,0,0.16))", dark: "drop-shadow(0px 7px 6px rgba(0,0,0,0.34))" },
  colourSeasonImageShadow: { light: "drop-shadow(0px 9px 7px rgba(0,0,0,0.15))", dark: "drop-shadow(0px 9px 7px rgba(0,0,0,0.32))" },
  colourSeasonDefaultBg: { light: "#E7DCEF", dark: "#342E3B" },
  colourSeasonDefaultAccent: { light: "#BCA8CB", dark: "#685B73" },
  colourSeasonDefaultDetail: { light: "#806293", dark: "#D2B7E2" },
  colourSeasonDefaultButton: { light: "rgba(96,67,117,0.14)", dark: "rgba(210,183,226,0.18)" },
  lightSpringBg: { light: "#FFF5F2", dark: "#3D302F" },
  lightSpringAccent: { light: "#EFAFAF", dark: "#754F52" },
  lightSpringDetail: { light: "#C98282", dark: "#F0B2B2" },
  lightSpringButton: { light: "rgba(224,139,139,0.24)", dark: "rgba(240,178,178,0.18)" },
  trueSpringBg: { light: "#F4D6A8", dark: "#3F3425" },
  trueSpringAccent: { light: "#EAAF62", dark: "#76552F" },
  trueSpringDetail: { light: "#B9682F", dark: "#F0B06F" },
  trueSpringButton: { light: "rgba(153,93,32,0.14)", dark: "rgba(240,176,111,0.18)" },
  brightSpringBg: { light: "#F6D2B5", dark: "#412F28" },
  brightSpringAccent: { light: "#F29C74", dark: "#7B4937" },
  brightSpringDetail: { light: "#C55F39", dark: "#F3A17F" },
  brightSpringButton: { light: "rgba(162,75,54,0.14)", dark: "rgba(243,161,127,0.18)" },
  lightSummerBg: { light: "#DFE4F1", dark: "#2D3340" },
  lightSummerAccent: { light: "#B8C6DD", dark: "#536078" },
  lightSummerDetail: { light: "#6F83A8", dark: "#B8C9E8" },
  lightSummerButton: { light: "rgba(76,93,130,0.14)", dark: "rgba(184,201,232,0.18)" },
  trueSummerBg: { light: "#D8DFEB", dark: "#2C323D" },
  trueSummerAccent: { light: "#A9B8D0", dark: "#4D5B72" },
  trueSummerDetail: { light: "#617699", dark: "#AFC3E4" },
  trueSummerButton: { light: "rgba(69,87,127,0.14)", dark: "rgba(175,195,228,0.18)" },
  softSummerBg: { light: "#DDDCE5", dark: "#33313A" },
  softSummerAccent: { light: "#B8B4C7", dark: "#5C576A" },
  softSummerDetail: { light: "#7B748D", dark: "#C5BED7" },
  softSummerButton: { light: "rgba(91,83,112,0.14)", dark: "rgba(197,190,215,0.18)" },
  softAutumnBg: { light: "#E6D7C2", dark: "#393228" },
  softAutumnAccent: { light: "#C8AD87", dark: "#67563E" },
  softAutumnDetail: { light: "#8E6F4C", dark: "#D8BB91" },
  softAutumnButton: { light: "rgba(112,84,52,0.14)", dark: "rgba(216,187,145,0.18)" },
  trueAutumnBg: { light: "#DFCAA8", dark: "#3B3023" },
  trueAutumnAccent: { light: "#B98954", dark: "#65472B" },
  trueAutumnDetail: { light: "#85582E", dark: "#DBA76D" },
  trueAutumnButton: { light: "rgba(113,67,31,0.15)", dark: "rgba(219,167,109,0.18)" },
  deepAutumnBg: { light: "#D5C0AD", dark: "#352B26" },
  deepAutumnAccent: { light: "#8B654D", dark: "#5A4032" },
  deepAutumnDetail: { light: "#65422F", dark: "#C99D82" },
  deepAutumnButton: { light: "rgba(77,49,34,0.16)", dark: "rgba(201,157,130,0.18)" },
  deepWinterBg: { light: "#D5D7E4", dark: "#292B38" },
  deepWinterAccent: { light: "#777E9E", dark: "#454B68" },
  deepWinterDetail: { light: "#50597C", dark: "#AEB6DC" },
  deepWinterButton: { light: "rgba(53,57,92,0.15)", dark: "rgba(174,182,220,0.18)" },
  trueWinterBg: { light: "#DDE1EA", dark: "#292E38" },
  trueWinterAccent: { light: "#8E9AB8", dark: "#495570" },
  trueWinterDetail: { light: "#59698D", dark: "#B2C3E7" },
  trueWinterButton: { light: "rgba(52,67,105,0.14)", dark: "rgba(178,195,231,0.18)" },
  brightWinterBg: { light: "#E5DDEA", dark: "#342C39" },
  brightWinterAccent: { light: "#B28DC0", dark: "#624A6B" },
  brightWinterDetail: { light: "#805A91", dark: "#D5AFE3" },
  brightWinterButton: { light: "rgba(104,59,120,0.14)", dark: "rgba(213,175,227,0.18)" },

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
