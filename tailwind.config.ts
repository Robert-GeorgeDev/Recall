import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: "#F5F3FF",
        navy: "#0B1F3A",
        brand: { DEFAULT: "#4F46E5", dark: "#4338CA", soft: "#EEF2FF", accent: "#6366F1" },
        cta: { DEFAULT: "#4F46E5", dark: "#4338CA" },
        ink: "#111827",
        muted: "#6B7280",
        surface: "#FAFAF9",
        line: "#E7E7E5",
        overdue: "#D92D3A",
        today: "#C47A00",
        done: "#16805C",
        success: "#10B981",
        upcoming: "#94A3B8",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15,23,42,0.04), 0 8px 30px rgba(15,23,42,0.04)",
        lift: "0 1px 3px rgba(15,23,42,0.05), 0 24px 60px -24px rgba(15,23,42,0.18)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
