/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./screens/**/*.{js,ts,jsx,tsx}", "./app/_layout.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D65E48', 
          50: '#FFF4F1',
          100: '#FFE6E0',
          200: '#F9CFC6',
          300: '#F2B1A3',
          400: '#E98E7E',
          500: '#E2725B',
          600: '#D65E48',
          700: '#C4513E',
          800: '#A24436',
          900: '#7F362C',
          950: '#5A241E',
        },
        secondary: {
          DEFAULT: '#8B0D19', 
          50: '#FFF5F6',
          100: '#FFE7EA',
          200: '#FFC9D0',
          300: '#F59AA6',
          400: '#DE6B7B',
          500: '#B94A5D',
          600: '#8B0D19',
          700: '#730914',
          800: '#5A0710',
          900: '#42040B',
          950: '#2B0207',
        },
      },
    },
  },
  plugins: [],
}
