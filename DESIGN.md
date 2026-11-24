# Fydaa design system

How the Fydaa website looks, moves and speaks, and why. Code is the source of truth for values
(`tailwind.config.ts`, `src/app/globals.css`); this file explains them. Agents load the
`fydaa-design` and `fydaa-brand` skills in `.claude/skills/`, which follow these rules.

## The brief

**What:** Fydaa helps people in India invest in mutual funds for specific goals (a home, a
child's education, retirement), see all their money in one place and get advice from a SEBI
registered adviser.
**Who:** salaried 25 to 40 year olds, many investing for the first time, on phones more than laptops.
**The page's job:** start a goal SIP, or book a free call with an adviser.

## Direction: Light and precise

White paper, forest-ink type, big rupee figures set in tabular numbers, real product UI, and one
jade band of proof per page. It should feel as exact as a good bank statement and as easy as
the app.

### What we considered and rejected

| Idea                                                      | Why not                                                                       |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Dark "neo-bank" site, glowing green on near-black         | The default look for fintech today; hard on long legal and compliance reading |
| Gold and purple on navy (UI UX Pro Max's fintech palette) | Generic, and not Fydaa's colours                                              |
| Cream background with a serif display                     | The most common generated-page look; reads as a lifestyle brand, not money    |
| Three equal feature cards with soft shadows               | Template layout; says nothing about the product                               |
| A strip of big stats under the hero                       | We'd have to invent numbers; real facts go in sentences and the proof band    |

### What makes it Fydaa

1. **Numbers as typography.** Money is set large in Mona Sans at width 112 with tabular
   figures, Indian grouping (₹12,34,567) and short forms (₹11.6 L, ₹1.2 Cr).
2. **The logo's strokes.** The two round-capped diagonal strokes in the logo become round caps
   on every bar, chart line and slider, and a marigold "goal flag" on projections.
3. **Product, not pictures of product.** Goals, Money Vault and the Wealth Score are built as live
   HTML in product windows.
4. **One bold moment per page.** On home it's the goal planner: change the amount or the years and
   the figure and the curve move with you.

## Colour

| Role                        | Token      | Hex       | Contrast on paper                  |
| --------------------------- | ---------- | --------- | ---------------------------------- |
| Paper                       | `paper`    | `#FFFFFF` | —                                  |
| Mist (alternate ground)     | `mist`     | `#F3F7F5` | —                                  |
| Ink (text)                  | `ink`      | `#0E2721` | 15.8:1                             |
| Ink 2 (secondary text)      | `grey-600` | `#44544F` | 8.0:1                              |
| Muted (captions)            | `grey-500` | `#5E6E69` | 5.4:1 (5.0:1 on mist)              |
| Line                        | `line`     | `#DDE6E2` | —                                  |
| Jade (brand, primary)       | `jade`     | `#0C4A3E` | 10.2:1                             |
| Emerald (links, gains)      | `emerald`  | `#047857` | 5.5:1                              |
| Sprout (chart strokes only) | `sprout`   | `#1A9E6E` | 3.4:1 (graphics only)              |
| Marigold (the goal)         | `marigold` | `#F2A93B` | never text on paper; 5.1:1 on jade |
| Danger                      | `danger`   | `#B42318` | 6.6:1                              |
| Warning                     | `warning`  | `#B45309` | 5.0:1                              |

Jade is the only primary colour. Green means growth or done; red means loss or error.

## Type

One family: **Mona Sans** (variable weight and width), loaded with `next/font`.

| Step                 | Token          | Size      | Width / weight             |
| -------------------- | -------------- | --------- | -------------------------- |
| Display (page title) | `text-display` | 40 → 80px | 112 / 700, −0.035em        |
| Heading (section)    | `text-heading` | 30 → 48px | 108 / 650, −0.025em        |
| Title (card, step)   | `text-title`   | 18 → 22px | 104 / 600                  |
| Lead                 | `text-lead`    | 17 → 20px | 100 / 400                  |
| Body                 | `text-base`    | 16px      | 100 / 400, line height 1.6 |
| Small                | `text-sm`      | 14px      | 100 / 500                  |
| Figure (money)       | `text-figure`  | 36 → 60px | 112 / 650, tabular         |

Sentence case everywhere. No all-caps labels. Line length under 70 characters.

## Shape and depth

- Radius by level: controls 8px (`rounded-btn`), cards and inputs 12px (`rounded-card`), product
  windows and dialogs 16px (`rounded-4xl`), the jade band 24px (`rounded-section`), chips and bars
  fully round.
- One shadow (`shadow-window`) for things that float: product windows, dialogs, menus. Everything
  else is flat: a mist ground or a hairline.

## Layout

- Content width 72rem with 16/24/32px gutters (`<Container>`). Left-aligned.
- Sections: one idea each, one or two screens tall on a laptop. Vertical rhythm from `.section`.
- One jade proof band per page (`<ProofBand>`): registrations, where your money goes, how to
  verify it.
- Phones first: 16px inputs, 44px touch targets, no horizontal scroll from 320px.

## Motion

Timing comes from transitions.dev's motion tokens (`--duration-*`, `--ease-*` in `globals.css`).

- **Entrance:** the hero's lines rise once on load, staggered by 40ms. Nothing else enters on scroll.
- **Moments:** home's goal planner (figures cross-fade digit by digit, the curve morphs, the tab
  pill slides) and the Wealth Score ring drawing once.
- **Feedback:** buttons lift 1px on hover and press to 98%; linked cards lift 2px; links draw
  their underline; accordions open on grid rows; dialogs scale from 96%; wrong codes shake;
  confirmations draw a check.
- **Never:** scroll-triggered fade-ins on every section, parallax, marquees, carousels, bounce.
- `prefers-reduced-motion: reduce` shows every final state instantly.

## Words

- Plain and specific: what it is, what it costs, what happens next.
- Buttons are a verb and an object: "Start a SIP", "Book a free call", "Log in".
- No hype words (seamless, unlock, empower, holistic, journey), no arrows after labels, no emoji.
- Projections always say: "Illustration at an assumed X% a year. Returns are not guaranteed." and
  "Mutual fund investments are subject to market risks."

## Skills used to make this

| Skill                 | Source                                                          | Used for                                                             |
| --------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| UI UX Pro Max         | nextlevelbuilder/ui-ux-pro-max-skill (MIT)                      | Page pattern ("Trust & Authority + Conversion"), UX rules, checklist |
| Taste                 | Leonxlnx/taste-skill (MIT), rules distilled into `fydaa-design` | Removing generic decisions; motion layers; copy tells                |
| Frontend Design       | anthropics/skills (Apache 2.0)                                  | Direction, plan-then-critique process, restraint                     |
| Transitions           | Jakubantalik/transitions.dev                                    | Motion tokens and interaction recipes                                |
| Web Artifacts Builder | anthropics/skills (Apache 2.0)                                  | Prototypes only                                                      |
| Fydaa brand           | this repo, structured after Anthropic's brand-guidelines        | Logo, colour, type, voice, compliance                                |
