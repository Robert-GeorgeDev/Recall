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
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -14px rgba(15,23,42,0.14)",
        lift: "0 30px 80px -24px rgba(15,23,42,0.28)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
