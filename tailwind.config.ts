import type { Config } from "tailwindcss";

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
          DEFAULT: "#0056FF", // 01 Royal Blue
          hover: "#2277FF",   // 02 Azure Blue
          light: "#E3E7FC",   // 04 Soft Lavender
          dark: "#0036CC",    // Midnight Surge Accent
        },
        brand: {
          royal: "#0056FF",
          azure: "#2277FF",
          black: "#000000",
          lavender: "#E3E7FC",
          dark: "#080E1E",
        },
        primary: "#000000",     // 03 Black
        secondary: "#334155",   // Editorial Slate
        muted: "#64748B",
        surface: "#FFFFFF",     // 05 White
      },
      backgroundImage: {
        "futurewave": "linear-gradient(135deg, #0056FF 0%, #2277FF 55%, #6098FF 100%)",
        "midnight-surge": "linear-gradient(135deg, #05112E 0%, #0A2266 50%, #0056FF 100%)",
        "soft-glow": "linear-gradient(180deg, #FFFFFF 0%, #F5F7FF 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        malayalam: ["'Noto Serif Malayalam'", "'Manjari'", "serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "royal": "0 4px 20px rgba(0, 86, 255, 0.15)",
        "royal-lg": "0 10px 30px rgba(0, 86, 255, 0.22)",
        "card": "0 2px 14px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 30px rgba(0, 86, 255, 0.10)",
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
    require("@tailwindcss/typography"),
  ],
};

export default config;
