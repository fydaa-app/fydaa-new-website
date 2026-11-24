# TODO: assets and links to swap in

The app-first home ships with placeholders so the layout, motion and flows can be reviewed now.
Search the code for `TODO(assets)` and `TODO(branch)` to find every spot.

## 1. Branch deep link — TODO(branch)

- [ ] Set `NEXT_PUBLIC_BRANCH_LINK` (e.g. `https://fydaa.app.link/abc123`) in Netlify for production and
      staging, and in `.env.local` for development.
- What it changes: every "Get the app" button and QR code (`src/config/app-link.ts`) switches from
  `/download` to the Branch link. The goal planner adds the plan as query parameters, which Branch passes
  to the app as link data: `goal`, `target`, `years`, `sip`, `category`, `source`.
- [ ] In the app: read that link data after install (deferred deep link) and open the goal screen with
      the plan filled in.
- [ ] Update `e2e/download.spec.ts` ("every Download App button uses the smart link") to expect the Branch
      host instead of `/download`.

## 2. App screenshots — TODO(assets)

- [ ] 4–6 real screenshots at 1170×2532 (iPhone) or 1080×2400 (Android), PNG or WebP, no status-bar
      clutter: goal detail, SIP setup, portfolio, Wealth Score, Money Vault, relationship manager.
- Put them in `public/app/screens/` and pass `src` to `<PhoneFrame>` in
  `src/features/home/components/AppTour.tsx` and `Hero.tsx`. The mock screens in
  `src/features/home/components/app-screens/` are the placeholders.

## 3. Relationship managers and advisers — TODO(assets)

- [ ] 2–3 people who agree to be shown: photo (square, at least 600×600, plain background), first name
      and initial, role (relationship manager / SEBI-registered adviser), languages spoken, years of
      experience.
- Replace the mock entries in `src/features/home/data/people.ts`. The photo goes in `public/people/`.

## 4. Nice to have

- [ ] App Store / Play Store rating to show once there are enough reviews.
- [ ] Hindi (हिंदी) copy for the home page, planner and FAQs.
