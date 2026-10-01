import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#2557D6", dark: "#1B43AB", soft: "#EEF3FF" },
        cta: { DEFAULT: "#FF7A59", dark: "#E8603E" },
        ink: "#0F172A",
        surface: "#F8FAFC",
        line: "#E2E8F0",
        overdue: "#E5484D",
        today: "#F5A524",
        done: "#30A46C",
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
