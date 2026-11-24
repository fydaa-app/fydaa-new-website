import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionHeaderProps {
  /** Short label above the title, e.g. "FAQs". */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level. Use 1 only for the page title. */
  level?: 1 | 2;
  align?: "start" | "center";
  className?: string;
}

/**
 * Eyebrow, title and description with one type treatment site-wide. Page titles
 * (`level={1}`) use the display size; section titles the heading size.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  level = 2,
  align = "start",
  className,
}: SectionHeaderProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wider text-jade">{eyebrow}</p> : null}
      <Heading
        className={cn(
          "text-balance font-bold tracking-tight text-ink",
          level === 1 ? "text-display" : "text-heading",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "text-pretty text-lead text-grey-600",
            align === "center" ? "max-w-2xl" : "max-w-prose",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
