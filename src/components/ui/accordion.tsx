"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Heading level wrapping each trigger, so the outline stays correct (WAI-ARIA APG). */
  headingLevel?: 2 | 3 | 4;
  /** Allow several panels open at once. */
  multiple?: boolean;
  /** Custom indicator inside the trigger (defaults to a chevron). */
  icon?: (open: boolean) => ReactNode;
  /**
   * "hidden" (default): closed panels use the `hidden` attribute.
   * "css": panels stay rendered so CSS can animate them; closed ones are `inert`
   * (skipped by keyboard and assistive tech). Style with the `openItem` class.
   */
  collapse?: "hidden" | "css";
  classNames?: {
    root?: string;
    item?: string;
    openItem?: string;
    heading?: string;
    trigger?: string;
    icon?: string;
    panel?: string;
  };
}

/**
 * Disclosure accordion following the WAI-ARIA pattern: each trigger is a real button
 * with aria-expanded/aria-controls, panels are labelled regions. Collapsed content stays
 * in the server-rendered HTML (hidden), so it remains indexable.
 */
export function Accordion({
  items,
  headingLevel = 3,
  multiple = false,
  icon,
  collapse = "hidden",
  classNames = {},
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set());
  const Heading = `h${headingLevel}` as const;

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(multiple ? current : []);
      if (current.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={classNames.root}>
      {items.map((item, index) => {
        const open = openIds.has(item.id);
        // DOM ids from the index: item ids may contain spaces, which would break the
        // space-separated aria-controls / aria-labelledby references.
        const triggerId = `${baseId}-${index}-trigger`;
        const panelId = `${baseId}-${index}-panel`;
        return (
          <div key={item.id} className={cn(classNames.item, open && classNames.openItem)}>
            <Heading className={cn("m-0", classNames.heading)}>
              <button
                type="button"
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade",
                  classNames.trigger,
                )}
              >
                <span>{item.title}</span>
                {icon ? (
                  icon(open)
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={cn(
                      "size-4 shrink-0 transition-transform",
                      open && "rotate-180",
                      classNames.icon,
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={collapse === "hidden" ? !open : undefined}
              inert={collapse === "css" && !open ? true : undefined}
              className={classNames.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
