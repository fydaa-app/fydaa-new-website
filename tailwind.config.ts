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
      // One typeface site-wide. `font-inter` is kept as an alias for existing markup.
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      /*
       * Type scale. Body and UI text use Tailwind's steps (xs 12 · sm 14 · base 16 · lg 18 ·
       * xl 20 · 2xl 24 · 3xl 30 · 4xl 36 · 5xl 48). Headings use the fluid semantic steps
       * below so every page title and section title matches at every width.
       */
      fontSize: {
        // Values live in globals.css (:root) so CSS modules and Tailwind share them.
        display: ['var(--text-display)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        heading: ['var(--text-heading)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        title: ['var(--text-title)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        lead: ['var(--text-lead)', { lineHeight: '1.6' }],
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
      // Radius set: controls (btn) · cards · large feature panels (section).
      borderRadius: {
        '4xl': '20px',
        card: '14px',
        btn: '10px',
        section: '32px',
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
