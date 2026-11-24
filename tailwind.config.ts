import type { Config } from "tailwindcss";
import flowbitePlugin from "flowbite/plugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1680px',
        '4xl': '1920px',
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
          // Darkened from #737373 so small text passes WCAG AA on grey-100 cards.
          500: '#6B6B6B',
          600: '#525252',
          800: '#262626',
        },
        ink: '#0A0A0A',
        dark: '#262626',
        tertiary: '#525252',
        secondary: '#666666',
        // Text token: #A3A3A3 was 2.5:1 on white (WCAG AA needs 4.5:1).
        muted: '#6B6B6B',
        'border-mid': '#D4D4D4',
        border: '#E5E5E5',
        surface: '#F5F5F5',
        bg: '#FAFAFA',
        emerald: '#047857',
        tint: '#ECFDF5',
      },
      borderRadius: {
        '4xl': '20px',
        card: '14px',
        btn: '10px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(10,10,10,.04), 0 0 1px rgba(10,10,10,.06)',
        'card-hover': '0 2px 12px rgba(10,10,10,.08), 0 0 1px rgba(10,10,10,.08)',
        elevated: '0 4px 12px rgba(10,10,10,.06)',
        modal: '0 20px 60px rgba(10,10,10,.15)',
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
    flowbitePlugin,
  ],
};

export default config;
