# TODO: links to swap in

"Get the app" buttons and QR codes point at `/download` (which sends phones to their store) until the
Branch link exists. Search the code for `TODO(branch)`.

## 1. Branch deep link — TODO(branch)

- [ ] Set `NEXT_PUBLIC_BRANCH_LINK` (e.g. `https://fydaa.app.link/abc123`) in Netlify for production and
      staging, and in `.env.local` for development.
- What it changes: every "Get the app" button and QR code (`src/config/app-link.ts`) switches from
  `/download` to the Branch link and adds where the visitor came from as query parameters, which Branch
  passes to the app as link data: `source` everywhere, plus `category`, `amount` and `years` from the
  home calculator.
- [ ] In the app: read that link data after install (deferred deep link), e.g. to open the SIP the
      visitor set up in the calculator.
- [ ] Update `e2e/download.spec.ts` ("every Download App button uses the smart link") to expect the Branch
      host instead of `/download`.

## 2. Nice to have

- [ ] App Store / Play Store rating to show once there are enough reviews.
- [ ] Hindi (हिंदी) copy for the home page and FAQs.
