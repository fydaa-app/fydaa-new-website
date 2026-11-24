import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A phone with an app screen in it. Pass `src` for a real screenshot (TODO(assets): see TODO.md,
 * section 2), or children for a live HTML screen. The screen is decoration: the same information is
 * always in the page text, so it is hidden from assistive tech.
 */
export function PhoneFrame({
  children,
  src,
  className,
  screenClassName,
}: {
  children?: ReactNode;
  src?: string;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      // A phone screen crops and truncates like the real app does.
      data-allow-clip
      className={cn(
        "relative w-[280px] rounded-[2.6rem] bg-ink p-[9px] shadow-[0_1px_2px_rgb(14_39_33/0.2),0_30px_60px_-20px_rgb(14_39_33/0.45)]",
        className,
      )}
    >
      <div
        className={cn("relative aspect-[9/19] overflow-hidden rounded-[2.05rem] bg-white", screenClassName)}
      >
        <span className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        {src ? <Image src={src} alt="" fill sizes="280px" className="object-cover" /> : children}
      </div>
    </div>
  );
}
