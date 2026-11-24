"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NAV_OFFSET = 80;

function scrollToHash(hash: string, smooth = true) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: smooth ? "smooth" : "auto",
  });
}

/** Smooth-scroll to URL hash (e.g. #book-a-call), including after route changes. */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      if (!window.location.hash) return;
      // Wait a tick so layout/images can settle after navigation
      requestAnimationFrame(() => {
        setTimeout(() => scrollToHash(window.location.hash, true), 50);
      });
    };

    run();
    window.addEventListener("hashchange", run);
    return () => window.removeEventListener("hashchange", run);
  }, [pathname]);

  return null;
}
