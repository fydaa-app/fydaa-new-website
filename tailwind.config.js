/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',          // Next.js App Router
    './pages/**/*.{js,ts,jsx,tsx}',        // Optional: pages folder if using
    './components/**/*.{js,ts,jsx,tsx}',   // All components
    './src/**/*.{js,ts,jsx,tsx}',          // Optional: if you use /src structure
    'node_modules/flowbite-react/lib/esm/**/*.js', // Flowbite React components
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
        gilroy: ['Gilroy', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        jade: {
          DEFAULT: '#0C4A3E',
          hover: '#0A3D33',
          deep: '#065F46',
          tint: '#ECFDF5',
          200: '#A7F3D0',
          300: '#6EE7B7',
        },
        grey: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          150: '#F0F0F0',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          800: '#262626',
        },
        ink: '#0A0A0A',
      },
      borderRadius: {
        '4xl': '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(10,10,10,.04), 0 0 1px rgba(10,10,10,.06)',
        'card-hover': '0 2px 12px rgba(10,10,10,.08), 0 0 1px rgba(10,10,10,.08)',
      },
      keyframes: {

        'fade-in': {
          '0%': { opacity: '0', transform: 'translate(-50%, 8px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
