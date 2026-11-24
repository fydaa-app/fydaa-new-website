import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A piece of the Fydaa app, built as live HTML: a white window with a quiet title bar. The only
 * surface (with dialogs and menus) that carries `shadow-window`. Illustrative data inside it is
 * hidden from assistive tech by the caller when it is decoration.
 */
export function ProductWindow({
  title,
  meta,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode;
  /** Small text on the right of the title bar, e.g. "Updated today". */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-4xl border border-line bg-white shadow-window", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-mist/60 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="flex gap-1">
            <i className="block h-3 w-1.5 -rotate-[38deg] rounded-full bg-jade" />
            <i className="block h-3 w-1.5 -rotate-[38deg] rounded-full bg-jade/40" />
          </span>
          <span className="truncate text-sm font-semibold text-ink [font-stretch:104%]">{title}</span>
        </div>
        {meta ? <span className="shrink-0 text-xs font-medium text-grey-500">{meta}</span> : null}
      </div>
      <div className={cn("p-4 sm:p-6", bodyClassName)}>{children}</div>
    </div>
  );
}
