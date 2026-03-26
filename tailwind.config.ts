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
          50: "#eaf4fd",
          100: "#cce7f9",
          200: "#99cff3",
          300: "#68baf4", // Primary light
          400: "#68baf4", // Primary
          500: "#5ba8e8",
          600: "#4a90d4",
          700: "#3a78b8",
          800: "#2a6098",
          900: "#1a4878",
        },
      },
      animation: {
        "breathe": "breathe 4s ease-in-out infinite",
        "ripple": "ripple 1.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 20s ease-in-out infinite",
        "float-slower": "float 25s ease-in-out infinite",
        "pulse-slow": "pulse-slow 8s ease-in-out infinite",
        "float-particle": "float-particle 10s ease-in-out infinite",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(104, 186, 244, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(104, 186, 244, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(50px, 30px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-50px, -30px)" },
        },
        "pulse-slow": {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)", opacity: "0.1" },
          "50%": { transform: "translate(-50%, -50%) scale(1.2)", opacity: "0.15" },
        },
        "float-particle": {
          "0%, 100%": { transform: "translate(0, 0)", opacity: "0.3" },
          "50%": { transform: "translate(15px, -30px)", opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
