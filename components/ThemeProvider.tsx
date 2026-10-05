"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined);

export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("dark");

  const [resolvedTheme, setResolvedTheme] =
    useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("jobtrack-theme");

    if (
      storedTheme === "dark" ||
      storedTheme === "light"
    ) {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(theme);

    setResolvedTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(
      "jobtrack-theme",
      newTheme
    );

    setThemeState(newTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}