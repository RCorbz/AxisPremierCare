const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black Card Palette
        "primary": "#CCFF00", // Electric Volt
        "background-light": "#f8f8f5",
        "background-dark": "#121212", // Matte Black
        "surface-dark": "#1C1C1C", // Charcoal Grey
        "surface-border": "#2A2A2A", // Subtle Border
        "text-muted": "#A3A3A3" // Silver
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['monospace'],
        "display": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"]
      },
      textShadow: {
        'glow-primary': '0 0 10px rgba(223, 255, 0, 0.7), 0 0 20px rgba(223, 255, 0, 0.5)',
      },
      boxShadow: {
        'glow-primary': '0 0 15px -3px rgba(223, 255, 0, 0.6), 0 0 30px -10px rgba(223, 255, 0, 0.7)',
        'glow-primary-lg': '0 0 25px -3px rgba(223, 255, 0, 0.7), 0 0 45px -10px rgba(223, 255, 0, 0.8)',
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        '.text-glow': {
          textShadow: theme('textShadow.glow-primary'),
        },
      })
    })
  ],
}
