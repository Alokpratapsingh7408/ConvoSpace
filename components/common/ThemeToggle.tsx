"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useUIStore } from "@/store/uiStore";
import IconButton from "./IconButton";

export default function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  if (!mounted) {
    // Return a placeholder to prevent layout shift
    return (
      <div className="p-2 text-base">
        <div className="w-5 h-5" />
      </div>
    );
  }

  return (
    <IconButton
      icon={theme === "dark" ? <FiSun /> : <FiMoon />}
      onClick={toggleTheme}
      variant="ghost"
    />
  );
}
