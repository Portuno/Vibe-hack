
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', "serif"],
        'sans': ['Inter', "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.5rem",
      },
      colors: {
        // Terreta Hub Palette
        'terra-cotta': "#D86C5B",
        'crema': "#FAF3E0",
        'mediterraneo': "#2C6E91",
        'arena': "#E8D9C4",
        'negro-suave': "#2B2B2B",
        'gris-piedra': "#888888",
        'verde-olivo': "#91B29B",
        'rojo-oxidado': "#C1443C",
        // para tailwind base compliance
        border: "#E8D9C4",
        input: "#E8D9C4",
        background: "#FAF3E0",
        foreground: "#2B2B2B",
      },
      boxShadow: {
        'card': "0 8px 32px 0 rgba(216,108,91,0.08), 0 1.5px 4px 0 rgba(44,110,145,0.06)",
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(.47,1.64,.41,.8)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(.47,1.64,.41,.8)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
