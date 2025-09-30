/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',          // Next.js App Router
    './pages/**/*.{js,ts,jsx,tsx}',        // Optional: pages folder if using
    './components/**/*.{js,ts,jsx,tsx}',   // All components
    './src/**/*.{js,ts,jsx,tsx}',          // Optional: if you use /src structure
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
    },
  },
  plugins: [],
};
