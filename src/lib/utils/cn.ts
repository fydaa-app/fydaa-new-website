import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * Teach tailwind-merge the design tokens: without this it reads `text-display | heading | title |
 * lead | figure` as colours and drops `text-ink` (or the size) when both are passed to cn().
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "heading", "title", "lead", "figure"] }],
      rounded: [{ rounded: ["btn", "card", "section"] }],
      shadow: [{ shadow: ["window", "card", "card-hover", "elevated", "modal"] }],
    },
  },
});

/** Compose class names and let later Tailwind utilities win over earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
