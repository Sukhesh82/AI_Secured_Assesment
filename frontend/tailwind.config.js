/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ffecd6',
          100: '#ffdbb3',
          500: '#ff6b2b',
          600: '#e65c22',
          700: '#bf4716',
          900: '#662207',
        },
        bg: {
          dark: '#0e0e11',
          surface: '#17171a',
          'surface-hover': '#1f1f23',
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.3)',
        'soft-lg': '0 20px 60px -15px rgba(0,0,0,0.5)',
        'glow-orange': '0 0 40px -10px rgba(255, 107, 43, 0.4)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.5)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
