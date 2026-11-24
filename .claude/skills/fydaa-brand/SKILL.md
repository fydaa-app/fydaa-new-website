---
name: fydaa-brand
description: Fydaa's brand identity for anything that should look and sound like Fydaa — the website, emails, decks, social images, app screens or a one-off artifact. Covers the logo and its motif, colours, typefaces, number formatting (₹, lakh, crore), voice, product names and the SEBI/AMFI compliance lines that must appear. Use whenever brand colours, fonts, copy tone, logo use or regulatory wording come up for Fydaa. (Modelled on the structure of Anthropic's brand-guidelines skill; the content is Fydaa's own.)
---

# Fydaa brand

Fydaa is an Indian goal-based investing app. Two regulated entities sit behind it and every
page must keep them straight:

| Entity | Role | Registration |
| --- | --- | --- |
| Fydaa Analytics Private Limited | Mutual fund distributor | AMFI ARN-358522 |
| Multistrato Capital Advisors Private Limited | Investment adviser (Fydaa Direct Plan) | SEBI RIA INA000015969 |

The source of truth for these facts is `src/config/site.ts`. Never type them by hand in a
component; import `siteConfig`.

## Logo

- File: `public/fydaa-logo.png` (black, 409×147). Wordmark "fydaa" in lowercase, to the right of
  a rounded square holding two diagonal pill strokes.
- On light grounds use it as is. On the jade band use it white: `filter: brightness(0) invert(1)`.
- Clear space: the height of the rounded square on every side. Minimum height 24px on screen.
- Never recolour it green, stretch it, add a shadow or set the wordmark in another font.
- Always write the name **Fydaa** (capital F) in text. The lowercase "fydaa" exists only in the logo.

### The motif

The two **round-capped diagonal strokes** in the logo are the brand's one graphic device. Use
them, not stock icons or blobs, when a page needs a mark:

- progress bars, chart lines and sliders use **round caps** (`stroke-linecap: round`,
  `border-radius: 999px` on bars);
- the goal flag on a projection chart is a short round-capped stroke in marigold;
- one large pair of strokes may sit behind the jade proof band at the logo's angle (about −38°).
  Once per page at most.

## Colour

Roles first; hex values live in `tailwind.config.ts` and `src/app/globals.css`.

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Paper | `paper` / `white` | `#FFFFFF` | Page ground |
| Mist | `mist` | `#F3F7F5` | Alternate section ground, input fills, product-window chrome |
| Ink | `ink` | `#0E2721` | Headings and body text (forest ink, 15.8:1 on paper) |
| Ink 2 | `grey-600` | `#44544F` | Secondary text (8:1) |
| Muted | `grey-500` | `#5E6E69` | Captions, helper text (5.4:1 paper, 5:1 mist) |
| Line | `line` / `grey-200` | `#DDE6E2` | Hairlines, borders |
| Jade | `jade` | `#0C4A3E` | The brand colour: primary buttons, the proof band, focus rings |
| Emerald | `emerald` | `#047857` | Links and positive figures in text (5.5:1) |
| Sprout | `sprout` | `#1A9E6E` | Chart strokes and fills, never text on paper |
| Marigold | `marigold` | `#F2A93B` | The goal colour: goal flags, the active goal, one highlight per view. Never text on paper; ink text on marigold is fine |
| Danger | `danger` | `#B42318` | Errors, losses |
| Warning text | `warning` | `#B45309` | Warnings |

Rules:
- Jade is the only primary. No navy, no purple, no gradients on text.
- One dark surface per page at most: the jade proof band. The site has no dark theme.
- Green means growth or "done" and red means loss or error. Never use them decoratively.

## Type

- **Mona Sans** (variable: weight 200–900, width 75–125), self-hosted with `next/font`, latin and
  latin-ext subsets (latin-ext carries ₹). One family; width is the expressive axis.
- Display (page titles): width 112, weight 700, tracking −0.035em, line height 1.02.
- Headings: width 108, weight 650. Titles: width 104, weight 600. Body: width 100, weight 400.
- **Figures** (money, scores, percentages) always use tabular numbers (`.figure` /
  `tabular-nums`), width 112, weight 650. Big numbers are the brand's typography: set the rupee
  amount large and the label small, never the other way round.
- Sentence case everywhere: headings, buttons, labels, nav. No all-caps labels.

## Numbers

- Indian grouping: `₹12,34,567`, never `₹1,234,567`. Use `toLocaleString('en-IN')` or `fmt()` in
  `src/features/home/utils/format.js`.
- Short forms: `₹11.6 L` and `₹1.2 Cr` in figures; "lakh" and "crore" in sentences.
- Projections always carry their assumption next to the number (see Compliance).

## Product names

Use exactly: **Fydaa**, **Money Vault**, **Wealth Score**, **Fydaa Direct Plan**, **Goal
investing** (sentence case in running text: "goal-based investing"). Not "AI Coach" until it ships.

## Voice

Plain, specific and calm, like a good relationship manager explaining your options.

- Say what happens: "Start a SIP", "Book a free call", "Log in". The same action keeps the same
  name through a flow.
- Use the reader's goals, not finance jargon: "a home in 10 years", not "long-horizon allocation".
- One fact beats three adjectives. No "seamless", "effortless", "unlock", "empower", "holistic",
  "journey", "cutting-edge", "world-class". No exclamation marks in body copy.
- No arrows appended to button or link text. No emoji as icons.
- Errors say what went wrong and how to fix it; they don't apologise.

## Compliance (must appear)

- Any return figure, projection or calculator: "Illustration only, at an assumed X% a year.
  Returns are not guaranteed." plus "Mutual fund investments are subject to market risks. Read all
  scheme-related documents carefully."
- Never promise returns, never say "safe" or "guaranteed" about market-linked products. "Your
  money goes directly to the fund house" is fine (it's true and checkable on MF Central).
- The footer carries the full disclaimer and both registrations on every page.
- Testimonials are real customers' words, unedited in meaning, with first name and initial.
