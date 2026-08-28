/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foodie: {
          yellow: '#FFC107',
          'yellow-dark': '#FFA000',
          'yellow-light': '#FFECB3',
          'yellow-soft': '#FFF8E1',
          amber: '#F59E0B',
          'amber-dark': '#D97706',
          cream: '#FFFDF7',
          app: '#FAF8F2',
          charcoal: '#18181B',
          muted: '#71717A',
          border: '#ECE8DC',
          orange: '#FF6B00',
          red: '#E11D48',
          green: '#10B981',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'foodie-card': '0 6px 20px rgba(0, 0, 0, 0.05)',
        'foodie-hover': '0 12px 28px rgba(245, 158, 11, 0.18)',
        'foodie-glow': '0 8px 30px rgba(255, 193, 7, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
