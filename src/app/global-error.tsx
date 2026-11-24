"use client";

import { useEffect } from "react";

/*
 * Last-resort boundary for failures in the root layout itself. It replaces the whole document, so
 * it cannot rely on app styles or fonts: the brand tokens are inlined here (values from
 * tailwind.config.ts: paper, ink, grey-600, jade; radius `btn`) and the layout mirrors StatusPage.
 */
const TOKENS = {
  paper: "#FFFFFF",
  ink: "#0E2721",
  ink2: "#44544F",
  jade: "#0C4A3E",
  radiusBtn: 8,
} as const;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: TOKENS.paper,
          color: TOKENS.ink,
          colorScheme: "light",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "6rem 1.5rem",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.25rem, 1.6rem + 2.8vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 700,
              maxWidth: "16ch",
              margin: "0 0 1rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.55,
              color: TOKENS.ink2,
              maxWidth: "52ch",
              margin: "0 0 2rem",
            }}
          >
            Fydaa couldn&apos;t load this page. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: TOKENS.jade,
              color: TOKENS.paper,
              border: 0,
              borderRadius: TOKENS.radiusBtn,
              height: 48,
              padding: "0 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
