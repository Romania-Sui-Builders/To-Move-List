/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        sui: {
          blue: '#4DA2FF',
          dark: '#1F1F1F',
          light: '#F7F9FB',
        },
      },
    },
  },
  plugins: [],
}
