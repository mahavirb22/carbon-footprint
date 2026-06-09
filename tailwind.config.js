/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(34,197,94,0.25)',
        'glow-lg': '0 0 40px rgba(34,197,94,0.3)',
        'soft':    '0 2px 16px rgba(0,0,0,0.06)',
        'card':    '0 4px 24px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'linear-gradient(135deg, #f0fdf4 0%, #f0f4ff 50%, #faf5ff 100%)',
      },
    },
  },
  plugins: [],
};
