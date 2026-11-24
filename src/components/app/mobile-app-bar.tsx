"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { appLinkHref } from "@/config/app-link";
import { useScrollState } from "@/lib/hooks/use-scroll-direction";
import { cn } from "@/lib/utils/cn";

/** Pages with their own sticky action, or where the app pitch doesn't belong. */
const HIDDEN_ON = ["/login", "/signup", "/partner", "/download", "/careers/jobs", "/programme"];

/** Height the bar takes, published as --app-bar-h so the Quick answers launcher can sit above it. */
const BAR_HEIGHT = "4.5rem";

/** Phones only: from 640px the header keeps its own "Get the app" button. */
const PHONE = "(max-width: 639px)";

/**
 * True while another "Get the app" button (the hero's, the close's) is on screen, so one screen
 * never shows the action twice.
 */
function useOtherActionInView(pathname: string | null) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const targets = [...document.querySelectorAll("main .get-app, footer .get-app")];
    if (!targets.length) {
      setInView(false);
      return;
    }
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);
  return inView;
}

/**
 * Phones: once the visitor is past the first screen, "Get the app" stays in thumb reach at the
 * bottom (tasteskill's phone bar), and steps aside while another "Get the app" is on screen.
 */
export function MobileAppBar() {
  const pathname = usePathname();
  const scroll = useScrollState();
  const otherInView = useOtherActionInView(pathname);
  const hidden = HIDDEN_ON.some((path) => pathname === path || pathname?.startsWith(`${path}/`));
  const shown = !hidden && scroll !== "top" && !otherInView;

  useEffect(() => {
    const root = document.documentElement;
    if (shown && window.matchMedia(PHONE).matches) root.style.setProperty("--app-bar-h", BAR_HEIGHT);
    else root.style.removeProperty("--app-bar-h");
    return () => {
      root.style.removeProperty("--app-bar-h");
    };
  }, [shown]);

  if (hidden) return null;

  return (
    <nav
      aria-label="Get the app"
      className={cn(
        "actionbar fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-[transform,opacity] duration-fast ease-smooth-out motion-reduce:transition-none sm:hidden",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      aria-hidden={shown ? undefined : true}
      inert={shown ? undefined : true}
    >
      <a
        href={appLinkHref({ source: "web_bar" })}
        className="btn btn-primary btn-md h-12 w-full"
        data-ph-event="Download App"
      >
        Get the app
      </a>
    </nav>
  );
}
