import { Accordion, type AccordionItem } from "./accordion";
import { cn } from "@/lib/utils/cn";

export interface FaqListProps {
  items: AccordionItem[];
  /** Heading level of each question, so the page outline stays correct. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/**
 * The one FAQ presentation for the site: bordered rows, full-width 56px+ triggers and a
 * chevron that turns when open. Built on the WAI-ARIA `Accordion`.
 */
export function FaqList({ items, headingLevel = 3, className }: FaqListProps) {
  return (
    <Accordion
      items={items}
      headingLevel={headingLevel}
      classNames={{
        root: cn(
          "divide-y divide-grey-200 overflow-hidden rounded-card border border-grey-200 bg-white",
          className,
        ),
        trigger:
          "min-h-14 px-5 py-4 text-base font-semibold text-ink transition-colors hover:bg-grey-50 focus-visible:-outline-offset-2",
        icon: "size-5 text-grey-500",
        panel: "px-5 pb-5 text-base leading-relaxed text-grey-600",
      }}
    />
  );
}
