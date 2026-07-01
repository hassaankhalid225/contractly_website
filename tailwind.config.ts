import type { Config } from "tailwindcss";

/**
 * Design tokens. Surface/ink/line colors are driven by CSS variables (see
 * globals.css) so the whole app supports light & dark mode from one source.
 * The brand scale and semantic colors stay fixed. Tokens trace back to the
 * User Flow doc §9.2, refined for a premium, Apple-grade visual language.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#534AB7",
          50: "rgb(var(--primary-50) / <alpha-value>)",
          100: "rgb(var(--primary-100) / <alpha-value>)",
          500: "#534AB7",
          600: "#463E9E",
          700: "#383275",
          fg: "rgb(var(--primary-fg) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          subtle: "rgb(var(--surface-subtle) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary) / <alpha-value>)",
        },
        line: "rgb(var(--line) / <alpha-value>)",
        success: "#0F6E56",
        warning: "#856404",
        error: "#D32F2F",
        risk: { low: "#0F6E56", medium: "#856404", high: "#D32F2F" },
      },
      borderRadius: { input: "8px", card: "14px", pill: "20px", xl: "20px" },
      boxShadow: {
        card: "0 1px 2px rgba(16,16,32,0.04), 0 1px 8px rgba(16,16,32,0.04)",
        pop: "0 12px 40px rgba(16,16,32,0.16), 0 2px 8px rgba(16,16,32,0.08)",
        glow: "0 0 0 1px rgb(var(--line)), 0 8px 30px rgba(83,74,183,0.12)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        urdu: ["var(--font-urdu)", "Noto Nastaliq Urdu", "serif"],
      },
      spacing: { "1u": "8px", "2u": "16px", "3u": "24px", "4u": "32px", "6u": "48px" },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease both",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.22,1,0.36,1) both",
        "slide-down": "slide-down 0.2s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
