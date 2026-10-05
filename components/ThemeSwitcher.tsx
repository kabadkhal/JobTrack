"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      title={
        isDark
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:scale-105 hover:bg-white/10"
      style={{
        color: "var(--text-secondary)",
      }}
    >
      {isDark ? (
        <Sun
          size={19}
          strokeWidth={1.8}
        />
      ) : (
        <Moon
          size={19}
          strokeWidth={1.8}
        />
      )}
    </button>
  );
}