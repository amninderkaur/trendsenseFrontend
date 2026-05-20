import React from "react";

export type AppTheme = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColors: {
    bg: string;
    card: string;
    text: string;
    muted: string;
    button: string;
    input: string;
  };
};

const light = {
  bg: "#c1d1bf",
  card: "#eeede8",
  text: "#000000",
  muted: "#4B5563",
  button: "#a3bea9",
  input: "#dae4e2",
};

const dark = {
  bg: "#1f2933",
  card: "#2f3b46",
  text: "#ffffff",
  muted: "#cbd5e1",
  button: "#5f7f73",
  input: "#45515c",
};

const ThemeContext = React.createContext<AppTheme>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  themeColors: light,
});

const canUseLocalStorage = () => typeof window !== "undefined" && !!window.localStorage;

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
      if (canUseLocalStorage()) window.localStorage.setItem("darkMode", String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, themeColors: isDarkMode ? dark : light }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => React.useContext(ThemeContext);
