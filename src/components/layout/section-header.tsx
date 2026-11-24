import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionHeaderProps {
  /**
   * Optional short context line above the title, sentence case (no all-caps labels). Only use it
   * when it adds information the title doesn't, e.g. a product name above a benefit headline.
   */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level. Use 1 only for the page title. */
  level?: 1 | 2;
  align?: "start" | "center";
  className?: string;
}

/**
 * Title and description with one type treatment site-wide, left-aligned by default. Page titles
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
      {eyebrow ? <p className="text-sm font-semibold text-emerald">{eyebrow}</p> : null}
      <Heading className={cn("text-ink", level === 1 ? "text-display" : "text-heading")}>
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "text-pretty text-lead text-grey-600",
            align === "center" ? "max-w-2xl" : "max-w-[60ch]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
