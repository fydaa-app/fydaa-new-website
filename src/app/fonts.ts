import { Inter } from "next/font/google";

/**
 * The site's single typeface: Inter (variable, self-hosted and subset by next/font, with a
 * size-adjusted fallback so there is no layout shift). Weights 400–700 are used.
 */
export const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
