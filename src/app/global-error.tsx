"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for failures in the root layout itself. It replaces the whole
 * document, so it cannot rely on app styles or fonts.
 */
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
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#fafafa",
          color: "#0a0a0a",
          textAlign: "center",
          padding: 24,
        }}
      >
        <main>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ color: "#525252", margin: "0 0 24px" }}>Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#0c4a3e",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 600,
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
