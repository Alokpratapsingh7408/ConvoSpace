import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#60A5FA",
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
        },
        secondary: {
          light: "#A78BFA",
          DEFAULT: "#8B5CF6",
          dark: "#7C3AED",
        },
        dark: {
          bg: "#1F2937",
          card: "#374151",
          hover: "#4B5563",
        },
      },
    },
  },
  plugins: [],
};

export default config;
