import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import flowbitePlugin from "flowbite/plugin";

/*
 * Fydaa design tokens ("Light and precise"). DESIGN.md explains every value; the fluid type
 * sizes and motion tokens live in src/app/globals.css (:root) so CSS files share them.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "3xl": "1680px",
        "4xl": "1920px",
      },
      // One family: Mona Sans (variable weight + width). `font-inter` stays as an alias for old markup.
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        inter: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      /*
       * Body and UI text use Tailwind's steps (xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24).
       * Titles and money use the fluid semantic steps; width (font-stretch) is set in globals.css.
       */
      fontSize: {
        display: [
          "var(--text-display)",
          { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "700" },
        ],
        heading: [
          "var(--text-heading)",
          { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "650" },
        ],
        title: ["var(--text-title)", { lineHeight: "1.25", letterSpacing: "-0.012em", fontWeight: "600" }],
        lead: ["var(--text-lead)", { lineHeight: "1.55" }],
        figure: ["var(--text-figure)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "650" }],
      },
      colors: {
        paper: "#FFFFFF",
        // The home page and site chrome (tasteskill revamp): warm off-white ground, one step darker
        // for the alternate band; the footer's dark ground is ink.
        canvas: {
          DEFAULT: "#F7F6F2",
          alt: "#EEEDE7",
        },
        mist: "#F3F7F5",
        line: "#DDE6E2",
        ink: "#0E2721",
        jade: {
          DEFAULT: "#0C4A3E",
          hover: "#093A31",
          deep: "#065F46",
          tint: "#E6F2EC",
          200: "#A7F3D0",
          300: "#6EE7B7",
        },
        emerald: "#047857",
        sprout: "#1A9E6E",
        marigold: {
          DEFAULT: "#F2A93B",
          tint: "#FDF1DC",
        },
        danger: "#B42318",
        warning: "#B45309",
        // Green-tinted neutrals: the brand temperature carried into every grey.
        grey: {
          50: "#F7FAF8",
          100: "#F1F5F3",
          150: "#EBF0EE",
          200: "#DDE6E2",
          300: "#C9D4D0",
          400: "#98A6A1",
          500: "#5E6E69",
          600: "#44544F",
          800: "#1F2E29",
        },
        // Legacy aliases, mapped onto the roles above.
        dark: "#1F2E29",
        tertiary: "#44544F",
        secondary: "#5E6E69",
        muted: "#5E6E69",
        "border-mid": "#C9D4D0",
        border: "#DDE6E2",
        surface: "#F1F5F3",
        bg: "#F7FAF8",
        tint: "#E6F2EC",
      },
      // Radius by level: controls · cards and inputs · product windows and dialogs · the jade band.
      borderRadius: {
        btn: "8px",
        card: "12px",
        "4xl": "16px",
        section: "24px",
      },
      boxShadow: {
        // The one shadow for things that float: product windows, dialogs, menus.
        window: "0 1px 2px rgba(14,39,33,.06), 0 16px 40px -12px rgba(14,39,33,.18)",
        // Legacy names, retinted.
        card: "0 1px 2px rgba(14,39,33,.05), 0 0 0 1px rgba(14,39,33,.04)",
        "card-hover": "0 4px 16px -4px rgba(14,39,33,.12), 0 0 0 1px rgba(14,39,33,.05)",
        elevated: "0 6px 20px -8px rgba(14,39,33,.14)",
        modal: "0 1px 2px rgba(14,39,33,.06), 0 24px 60px -16px rgba(14,39,33,.28)",
      },
      transitionDuration: {
        quick: "var(--duration-quick)",
        fast: "var(--duration-fast)",
        medium: "var(--duration-medium)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        "smooth-out": "var(--ease-smooth-out)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translate(-50%, 8px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [
    flowbitePlugin,
    // Mona Sans width axis. `font-stretch` selects the axis; the variation setting is the fallback
    // for engines that ignore font-stretch on a face without a declared range.
    plugin(({ addUtilities }) => {
      const stretch = (pct: number) => ({
        fontStretch: `${pct}%`,
        fontVariationSettings: `"wdth" ${pct}`,
      });
      addUtilities({
        ".stretch-condensed": stretch(88),
        ".stretch-normal": stretch(100),
        ".stretch-semi": stretch(106),
        ".stretch-wide": stretch(112),
      });
    }),
  ],
};

export default config;
