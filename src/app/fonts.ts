import { Geist, Inter } from "next/font/google";
import localFont from "next/font/local";

/**
 * Self-hosted, subset fonts with automatic size-adjusted fallbacks (no layout shift).
 * Geist: app body text. Inter: marketing pages. Gilroy: display headings (only the
 * weights in use; licence for web embedding must be held by Fydaa).
 */
export const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

export const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const gilroy = localFont({
  variable: "--font-gilroy",
  display: "swap",
  // Used by a few headings only: let the browser fetch it when needed.
  preload: false,
  src: [
    { path: "../fonts/gilroy/Gilroy-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/gilroy/Gilroy-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/gilroy/Gilroy-Bold.woff2", weight: "700", style: "normal" },
  ],
  fallback: ["Inter", "system-ui", "sans-serif"],
});
