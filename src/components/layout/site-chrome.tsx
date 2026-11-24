"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

/**
 * Full-screen onboarding steps (KYC, e-sign, …) ask the site chrome to step aside by
 * dispatching this event with `{ hideNav: boolean }`.
 */
export const HIDE_SITE_CHROME_EVENT = "fydaa-onboarding-nav";

let chromeHidden = false;

function subscribe(onChange: () => void) {
  const listener = (event: Event) => {
    chromeHidden = Boolean((event as CustomEvent<{ hideNav?: boolean }>).detail?.hideNav);
    onChange();
  };
  window.addEventListener(HIDE_SITE_CHROME_EVENT, listener);
  return () => window.removeEventListener(HIDE_SITE_CHROME_EVENT, listener);
}

const getSnapshot = () => chromeHidden;
const getServerSnapshot = () => false;

/** Navbar + page + footer for marketing and auth pages (the `(site)` route group). */
export function SiteChrome({ children }: { children: ReactNode }) {
  const hidden = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <>
      {hidden ? null : <Navbar />}
      {children}
      {hidden ? null : <Footer />}
    </>
  );
}
