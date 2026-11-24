"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { appLinkHref } from "@/config/app-link";
import { useScrollState } from "@/lib/hooks/use-scroll-direction";
import { cn } from "@/lib/utils/cn";

/** Pages with their own sticky action, or where the app pitch doesn't belong. */
const HIDDEN_ON = ["/login", "/signup", "/partner", "/download", "/careers/jobs", "/programme"];

/** Height the bar takes, published as --app-bar-h so the Quick answers launcher can sit above it. */
const BAR_HEIGHT = "4.5rem";

/**
 * Phones and tablets: once the visitor is past the first screen, "Get the app" stays in thumb reach
 * at the bottom. It slides in and out with the motion tokens; desktops use the header button.
 */
export function MobileAppBar() {
  const pathname = usePathname();
  const scroll = useScrollState();
  const hidden = HIDDEN_ON.some((path) => pathname === path || pathname?.startsWith(`${path}/`));
  const shown = !hidden && scroll !== "top";

  useEffect(() => {
    const root = document.documentElement;
    if (shown && window.matchMedia("(max-width: 1023px)").matches)
      root.style.setProperty("--app-bar-h", BAR_HEIGHT);
    else root.style.removeProperty("--app-bar-h");
    return () => {
      root.style.removeProperty("--app-bar-h");
    };
  }, [shown]);

  if (hidden) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-[transform,opacity] duration-fast ease-smooth-out motion-reduce:transition-none lg:hidden",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={shown ? undefined : true}
      inert={shown ? undefined : true}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <img src="/fydaa-logo.png" alt="" width={409} height={147} className="h-7 w-auto" />
        <p className="hidden flex-1 text-sm text-grey-600 sm:block">Plan goals and start SIPs</p>
        <span className="flex-1 sm:hidden" />
        <a
          href={appLinkHref({ source: "web_bar" })}
          className="btn btn-primary btn-md h-11 shrink-0 px-4"
          data-ph-event="Download App"
        >
          Get the app
        </a>
      </div>
    </div>
  );
}
