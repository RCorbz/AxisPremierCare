const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // These are the colors from your Stitch design
        "primary": "#d9ff00",
        "background-light": "#f8f8f5",
        "background-dark": "#0a0a0a",
        "surface-dark": "#171717",
        "surface-border": "#262626",
        "text-muted": "#A3A3A3"
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
    plugin(function({ addUtilities, theme }) {
      addUtilities({
        '.text-glow': {
          textShadow: theme('textShadow.glow-primary'),
        },
      })
    })
  ],
}
