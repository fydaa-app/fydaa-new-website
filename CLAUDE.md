# Fydaa website

Next.js 16 (App Router, route groups `(site)`, `(app)`, `(transactional)`), React 19, TypeScript
strict, Tailwind 3. Node 24 (`.nvmrc`).

## Before any UI work

Load the `fydaa-design` skill, then `fydaa-brand`. They set the design language, tokens and copy
rules, and say when to use the other design skills in `.claude/skills/`. `DESIGN.md` is the same
system written for people.

## Rules

- Business facts (registrations, phone, email, app links, UPI handles) come from
  `src/config/site.ts`. Never hard-code them in components.
- Use the shared primitives in `src/components/` and the tokens in `tailwind.config.ts` /
  `src/app/globals.css`; no raw hex, pixel font sizes or ad-hoc durations in components.
- Every projection or return figure carries the assumption and the market-risk line.
- Don't send real requests to production APIs from tests.

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run format:check
npm run build && npm run test:e2e
```

`e2e/layout.spec.ts` fails on horizontal scroll or clipped content from 320 to 1440px.
