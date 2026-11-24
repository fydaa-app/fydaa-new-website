import { DM_Mono, Mona_Sans } from "next/font/google";

/**
 * The site's typeface: Mona Sans, variable in weight (200–900) and width (75–125), self-hosted
 * and subset by next/font with a size-adjusted fallback (no layout shift). latin-ext carries the
 * rupee sign (U+20B9). Width is the expressive axis: display type and money figures run wide
 * (see `stretch-*` utilities and the type tokens in globals.css).
 */
export const monaSans = Mona_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

/**
 * The one monospace: registration numbers, UPI IDs, codes and small badges. Never for running text
 * or money figures (those stay in Mona Sans with tabular figures).
 */
export const dmMono = DM_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
