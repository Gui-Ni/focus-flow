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
        brand: {
          50: "#e6f4ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69aeff",
          400: "#4090ff",
          500: "#4FACFE", // Primary
          600: "#0070f0",
          700: "#0056c0",
          800: "#004090",
          900: "#003060",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "breathe": "breathe 4s ease-in-out infinite",
        "ripple": "ripple 1.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79, 172, 254, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(79, 172, 254, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
