import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#145231",
          950: "#052e16",
        },
        accent: {
          50: "#faf5f0",
          100: "#f3ede6",
          200: "#e8dcc9",
          300: "#dcc4a6",
          400: "#c4997a",
          500: "#a87c59",
          600: "#8b7355",
          700: "#6b5447",
          800: "#4a3a31",
          900: "#2d241c",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      animation: {
        bounce: "bounce 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        'fade-in-up': "fadeInUp 0.6s ease-out",
        'fade-in-down': "fadeInDown 0.6s ease-out",
        'slide-in-left': "slideInLeft 0.6s ease-out",
        'slide-in-right': "slideInRight 0.6s ease-out",
        'float-up': "floatUp 3s ease-in-out infinite",
        'glow': "glow 2s ease-in-out infinite",
        'scale-in': "scaleIn 0.5s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(45, 80, 22, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(45, 80, 22, 0.5)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
