"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { mainNavigation, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { useAuthStatus } from "@/lib/auth/use-auth-status";
import { cn } from "@/lib/utils/cn";
import "./site-nav.css";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function useScrolled(threshold = 10): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

const DownloadIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const auth = useAuthStatus();
  const menuId = useId();
  // The menu is "open for" one pathname, so navigating anywhere closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor !== null && openFor === pathname;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenFor(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const account = auth === "authenticated" ? routes.dashboard : routes.login;

  return (
    <div className="site-nav">
      <nav id="nav" aria-label="Main" className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label={`${siteConfig.name} home`}>
            <img src="/fydaa-logo.png" alt={siteConfig.name} width={409} height={147} />
          </Link>

          <div id={menuId} className={cn("nav-center", open && "open")}>
            {mainNavigation.map((link) => {
              const active = isActive(pathname, link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={active ? "active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href={account.path} className="nav-menu-account" data-ph-event={account.label}>
              {account.label}
            </Link>
          </div>

          <div className="nav-right">
            <Link href={account.path} className="nav-login" data-ph-event={account.label}>
              {account.label}
            </Link>
            <Link
              href={routes.download.path}
              prefetch={false}
              className="nav-download"
              data-ph-event="Download App"
            >
              {DownloadIcon}
              Download App
            </Link>
          </div>

          <button
            type="button"
            className="nav-hamburger"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
