---
name: fydaa-design
description: The design rules for the Fydaa website (this repo). Load it before building, restyling or reviewing any page, section or component under src/ — it sets the design language ("Light and precise"), the tokens, layout, components, motion and copy rules, and says in which order to use the other design skills installed here (ui-ux-pro-max, frontend-design, transitions-dev, web-artifacts-builder, fydaa-brand). Also use it when someone says a page looks generic, broken, off-brand or "AI-made".
---

# Fydaa design rules

The human-readable version of these rules is `DESIGN.md` at the repo root. This skill is the
working checklist. When they disagree, fix whichever is wrong in the same change.

## The pipeline: which skill does what, in this order

| Step | Skill | Its job here |
| --- | --- | --- |
| 1 | `ui-ux-pro-max` | Choose the design language and check UX rules. Run its search from the repo root: `python3 -I .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`. Its palettes and fonts are suggestions only: Fydaa's tokens win. |
| 2 | Taste (rules below, from Leonxlnx/taste-skill, MIT) | Remove the generic decisions. |
| 3 | `frontend-design` | Set the visual direction: plan, critique the plan against the brief, then build. |
| 4 | `transitions-dev` | Make interaction deliberate: use its recipes and motion tokens, never ad-hoc durations. |
| 5 | `web-artifacts-builder` | Only for throwaway prototypes shared as a claude.ai artifact. Production code is this Next.js app. |
| 6 | `fydaa-brand` | Keep it recognisably Fydaa: logo, colour, type, voice, compliance. Last check before shipping. |

## The home page and the site chrome: Editorial and exact

The home page (`src/app/(site)/page.tsx`, `src/features/home/sections/`, `styles/home.css`), the
header and the footer are built to the `design-taste-frontend` skill (taste-skill 2.5.1, software
page): canvas ground, forest ink, jade accent, Mona Sans 500 headlines with DM Mono for numbers that
are codes, sharp corners, one 1280px `.wrap`, every section one or two screens at 1440x900, a dark
footer that is also the close. Load that skill when you change any of them, and run its
`consistency.mjs` and `gate.mjs` before you finish. Fydaa's own rules still win where they meet
(`fydaa-brand`: compliance lines, registrations, the real phone number, no arrows on buttons). The
rest of the site follows "Light and precise" below.

## The design language: Light and precise

Fydaa's site reads like a well-made statement of your money: white paper, forest-ink type,
big tabular rupee figures, real product UI and one jade band of proof per page.

- **Subject first.** Every section shows the thing itself: a goal with its number, the Money Vault
  net worth, the Wealth Score ring, the adviser you can call. Product UI is live HTML in a
  `ProductWindow`, never a screenshot of a generic dashboard.
- **Numbers are the typography.** The biggest thing on a product screen is a rupee figure in
  Mona Sans (width 112, tabular). Labels are small and sentence case.
- **Left-aligned.** Headings and copy align left on a shared content edge. Centre only a lone
  closing line, if anything.
- **One brand motif.** The logo's round-capped diagonal strokes: round caps on bars, chart lines
  and sliders; a marigold goal flag; at most one large stroke pair behind the jade band.
- **Spend boldness once per page.** Home: the live goal planner. Other pages: the page title set
  large and one product moment. Everything around it stays quiet.

## Tokens (never raw values in components)

- Colour roles: `paper`, `mist`, `ink`, `grey-600` (ink 2), `grey-500` (muted), `line`, `jade`,
  `emerald`, `sprout`, `marigold`, `danger`, `warning`. See `fydaa-brand` for hex and use.
- Type: `text-display`, `text-heading`, `text-title`, `text-lead`, Tailwind `text-sm`/`base`
  for UI; `.figure` / `text-figure` for money. Width via `font-stretch` utilities `stretch-wide`
  (112) and `stretch-semi` (106).
- Radius hierarchy (not one radius everywhere): `rounded-btn` 8px controls, `rounded-card` 12px
  cards and inputs, `rounded-4xl` 16px product windows and dialogs, `rounded-section` 24px the
  jade band, `rounded-full` chips, tabs, bars.
- Shadow: only `shadow-window` (product windows, dialogs, menus). Content cards are flat:
  `bg-mist` or a `border-line` hairline, never a soft grey shadow.
- Space: sections use `.section` (block padding `clamp(4rem, 3rem + 4vw, 7.5rem)`); content sits in
  `<Container>` (72rem, gutters 16/24/32px).
- Motion: `--duration-*`, `--ease-*`, `--distance-*`, `--scale-*`, `--blur-*` from transitions-dev,
  defined once in `globals.css`.

## Layout

- Every section is `<section>` > `<Container>`; its `h2` comes first. One idea per section, one
  or two screens tall at 1440×900. No second heading peeking into the first screen.
- Grids use `minmax(0, 1fr)` tracks. No horizontal scroll or clipped content from 320 to 1920px;
  `e2e/layout.spec.ts` enforces it.
- Phones: 16px inputs, 44px targets, sticky primary action only where a page is long and has one
  job (job pages).

## Components to reuse

`Container`, `SectionHeader`, `Button`/`ButtonLink` (`.btn .btn-primary|secondary|ghost|inverse
.btn-md|lg`), `TextField`, `CodeInput`, `Accordion`/`FaqList`, `TableScroll`, `ProductWindow`,
`ProofBand`, `Figure`. Add to these rather than writing a one-off.

## Motion (from transitions-dev + Taste)

Three layers, nothing else moves:

1. **One entrance** on load, once: the hero's lines rise in a stagger (`texts-reveal`,
   `--duration-very-slow`, `--distance-medium`, `--blur-medium`). About 1s, then the hero stands.
2. **One moment** per page (two on home): the goal planner's figures and curve morphing as you
   type (`number-subtle-change`, `tabs-sliding`), the Wealth Score ring drawing once in view
   (`donut-chart`).
3. **Answers to the reader:** buttons step up 1px on hover and press to `scale(.98)`; linked cards
   lift 2px; text links draw their underline; accordions use `accordion` (grid rows); dialogs
   `modal`; menus `menu-dropdown`; errors `error-state-shake`; confirmations `success-check`.

Never: fade-and-rise on every section while scrolling, parallax on text, marquees, carousels,
timed tabs, tilt, bounce on UI. Animate `transform`, `opacity`, `filter` only. Every animation
has a `prefers-reduced-motion: reduce` path that shows the final state.

## Remove the generic decisions (Taste + Frontend Design)

Before you ship a section, none of these may be on it:

- an all-caps tracked label above a heading, or any label that only repeats the heading;
- one word in a heading set in another colour, italic or serif;
- a row of three or four stats under a hero ("10L+ users · 4.8★ · ₹500Cr");
- identical rounded cards with the same soft shadow in a 3- or 4-up grid as the default layout;
- numbered markers (01 / 02 / 03) on content that is not a sequence;
- "→" appended to a button or link label; middle dots joining meta strings;
- headings shaped "X. Y." or "Not X, but Y"; contrast frames; virtue words ("honest", "simple");
- stock phrases: "Unlock", "Empower", "Seamless", "Your financial journey", "In today's world";
- invented specifics: user counts, ratings or returns that are not in the brief or the code;
- decorative gradients, glassmorphism, blobs, emoji icons, stock 3D illustrations;
- a section that only exists to fill space.

Copy: write the copy before the layout. The h1 names what Fydaa does and for whom. A noun in every
heading. Buttons are a verb and an object. 60–80 words a screen outside product UI.

## Pre-delivery checklist

- [ ] Tokens only; no new hex, px font sizes or durations in components.
- [ ] Left edges line up with the header logo at 1440 and 1920.
- [ ] 320, 360, 390, 768, 1024, 1440, 1920: no overflow, no clipping, nothing overlaps.
- [ ] Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI strokes; visible focus ring on every control.
- [ ] Reduced motion shows final states; the page is whole without JavaScript animation.
- [ ] Compliance lines present next to every projection; footer disclaimer intact.
- [ ] Screenshots at 390 and 1440 reviewed; remove one accessory before calling it done.
- [ ] `npm run lint && npm run typecheck && npm test && npm run test:e2e` pass.
