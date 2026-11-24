# Fydaa website

Marketing site, onboarding (signup/KYC) and investor dashboard for [fydaa.com](https://fydaa.com).
Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS.

## Getting started

Requires Node.js 24 (see `.nvmrc`; ≥ 20.9 works).

```bash
npm ci
cp .env.example .env.local   # optional: production defaults are built in
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                  | What it does                                               |
| ------------------------ | ---------------------------------------------------------- |
| `npm run dev`            | Development server                                         |
| `npm run build`          | Production build                                           |
| `npm run start`          | Serve the production build                                 |
| `npm run lint`           | ESLint (Next.js core-web-vitals + TypeScript rules)        |
| `npm run typecheck`      | `tsc --noEmit`                                             |
| `npm run test`           | Unit tests (Vitest + Testing Library)                      |
| `npm run test:e2e`       | Playwright smoke tests against `next start` (build first)  |
| `npm run format`         | Prettier                                                   |
| `npm run check`          | Lint, typecheck, unit tests and format check in one go     |

CI (`.github/workflows/ci.yml`) runs all of the above plus the e2e suite on every pull request.

## Project structure

```
src/
  app/            Routes (App Router). Pages stay thin and compose feature/UI code.
  components/ui/  Accessible, reusable primitives (Button, TextField, CodeInput, Accordion).
  config/         Validated environment (env.ts) and static business facts (site.ts).
  lib/
    auth/         Token storage, session helpers and the useAuthStatus hook.
    http/         Typed fetch client and ApiError with user-safe messages.
    seo/          Page metadata and JSON-LD helpers.
    utils/        Small shared utilities (cn).
  test/           Vitest setup.
e2e/              Playwright specs.
```

Conventions for new code:

- **Config:** read configuration from `@/config/env` and never from `process.env` directly. Invalid config fails the build.
- **Network calls:** go through `@/lib/http/client`. Never show raw backend or parser errors to users.
- **Metadata:** every page exports `metadata` built with `pageMetadata()`. App, auth and transactional pages are `noIndex`.
- **Forms:** use the primitives in `components/ui` (labels linked to inputs, accessible errors, real `<form>` submit).
- **Formatting:** Prettier formats all new code. Legacy folders listed in `.prettierignore` are removed from that list as they are rewritten.

## Environment

See `.env.example`. All variables are `NEXT_PUBLIC_*` (inlined at build time), so never store secrets in them.
Set `NEXT_PUBLIC_APP_ENV=stage` for staging builds. Staging must also set `NEXT_PUBLIC_BASE_URL(_STAGE)`.
