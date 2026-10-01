import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#4F46E5", dark: "#4338CA", soft: "#EEF2FF", accent: "#6366F1" },
        cta: { DEFAULT: "#4F46E5", dark: "#4338CA" },
        ink: "#0F172A",
        muted: "#64748B",
        surface: "#F8FAFC",
        line: "#E2E8F0",
        overdue: "#DC2626",
        today: "#F59E0B",
        done: "#047857",
        success: "#10B981",
        upcoming: "#94A3B8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
