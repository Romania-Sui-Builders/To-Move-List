/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sui: {
          blue: '#4DA2FF',
          'blue-dark': '#3B82F6',
          dark: '#1F1F1F',
          light: '#F7F9FB',
          navy: '#101827',
        },
        status: {
          todo: '#6B7280',
          'in-progress': '#F59E0B',
          'awaiting-check': '#8B5CF6',
          verified: '#10B981',
          failed: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
