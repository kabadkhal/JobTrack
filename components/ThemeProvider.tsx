"use client";

import {
  createContext,
  useCallback,
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
  resolvedTheme: Theme;
}

const STORAGE_KEY = "jobtrack-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Becomes true once the saved/system theme has been read,
  // so we never overwrite the class set by the <head> script
  // with the default "dark" (this caused the dark flash).
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: Theme = "dark";

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored === "dark" || stored === "light") {
        initial = stored;
      } else if (
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        initial = "light";
      }
    } catch {
      // localStorage unavailable (private mode, etc.)
    }

    setThemeState(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme, ready]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }

    setThemeState(newTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme: theme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}