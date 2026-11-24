import { cn } from "@/lib/utils/cn";

/** The logo's round-capped diagonal stroke, used as the list marker on this page. */
export function Stroke({ className }: { className?: string }) {
  return (
    <i
      aria-hidden="true"
      className={cn("mt-[0.4em] block h-3.5 w-1.5 shrink-0 -rotate-[38deg] rounded-full bg-sprout", className)}
    />
  );
}
