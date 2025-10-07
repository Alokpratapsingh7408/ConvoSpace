"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";

export function useThemeMode() {
  const { theme, setTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check system preference on mount
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Only apply theme after mounting to avoid hydration issues
    if (theme === "system") {
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return { theme, setTheme, toggleTheme, mounted };
}
