import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#E62727", // Primary Brand Crimson
          hover: "#cf1f1f",   // Deep Crimson Hover
          light: "#FEE8E8",   // Soft Red Tint
          dark: "#B91C1C",    // Dark Crimson
        },
        brand: {
          royal: "#E62727",
          azure: "#FF4D4D",
          black: "#000000",
          lavender: "#FEE8E8",
          dark: "#1A0505",
        },
        primary: "#000000",     // 03 Black
        secondary: "#334155",   // Editorial Slate
        muted: "#64748B",
        surface: "#FFFFFF",     // 05 White
      },
      backgroundImage: {
        "futurewave": "linear-gradient(135deg, #E62727 0%, #FF4D4D 55%, #FF7070 100%)",
        "midnight-surge": "linear-gradient(135deg, #1A0505 0%, #4D0A0A 50%, #E62727 100%)",
        "soft-glow": "linear-gradient(180deg, #FFFFFF 0%, #FFF5F5 100%)",
      },
      fontFamily: {
        sans: ["'Manjari'", "ui-serif", "Georgia", "Cambria", "\"Times New Roman\"", "Times", "serif"],
        serif: ["'Manjari'", "ui-serif", "Georgia", "Cambria", "\"Times New Roman\"", "Times", "serif"],
        malayalam: ["'Manjari'", "\"Noto Serif Malayalam\"", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "royal": "0 4px 20px rgba(230, 39, 39, 0.15)",
        "royal-lg": "0 10px 30px rgba(230, 39, 39, 0.22)",
        "card": "0 2px 14px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 30px rgba(230, 39, 39, 0.10)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
