import { Accordion, type AccordionItem } from "./accordion";
import { cn } from "@/lib/utils/cn";

export interface FaqListProps {
  items: AccordionItem[];
  /** Heading level of each question, so the page outline stays correct. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/**
 * The one FAQ presentation for the site: hairline rows, full-width 56px+ triggers, answers that
 * open on the transitions.dev accordion and a chevron that flips. Built on the WAI-ARIA `Accordion`.
 */
export function FaqList({ items, headingLevel = 3, className }: FaqListProps) {
  return (
    <Accordion
      items={items}
      headingLevel={headingLevel}
      collapse="css"
      classNames={{
        root: cn("border-t border-line", className),
        item: "border-b border-line",
        trigger:
          "min-h-16 py-5 text-base font-semibold text-ink transition-colors duration-quick hover:text-jade sm:text-lg [font-stretch:104%] focus-visible:outline-offset-4",
        icon: "size-5 text-grey-500",
        panel: "max-w-[64ch] pb-6 pr-8 text-base leading-relaxed text-grey-600",
      }}
    />
  );
}
