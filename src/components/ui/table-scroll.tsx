import type { ReactNode } from "react";

/**
 * Wraps a wide data table: scrolls sideways inside its own labelled, keyboard-focusable
 * region (so it never widens the page) and tells phone users the table scrolls.
 */
export function TableScroll({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="mb-10">
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="overflow-x-auto rounded-card border border-grey-200 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade"
      >
        {children}
      </div>
      <figcaption className="mt-2 text-xs text-grey-600 md:hidden" aria-hidden="true">
        Swipe sideways to see all columns
      </figcaption>
    </figure>
  );
}
