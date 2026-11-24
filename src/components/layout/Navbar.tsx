"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { mainNavigation, professionalNavigation, routes } from "@/config/routes";
import { GetAppButton } from "@/components/app/get-app-button";
import { siteConfig } from "@/config/site";
import { useAuthStatus } from "@/lib/auth/use-auth-status";
import { buttonClasses } from "@/components/ui/button";
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

/**
 * "For professionals": partners, the programme and careers. A dropdown on desktop (transitions.dev
 * menu dropdown); a labelled group inside the phone menu.
 */
function ProfessionalsMenu({ pathname }: { pathname: string | null }) {
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor !== null && openFor === pathname;
  const active = professionalNavigation.some((link) => isActive(pathname, link.path));

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (
        event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)
      )
        setOpenFor(null);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", close);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("nav-group", open && "open")}>
      <button
        type="button"
        className={cn("nav-group-toggle", active && "active")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpenFor(open ? null : pathname)}
      >
        For professionals
        <svg viewBox="0 0 16 16" aria-hidden="true" className="nav-group-chevron">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
      <div id={panelId} className="nav-group-panel">
        <p className="nav-group-label">For professionals</p>
        {professionalNavigation.map((link) => {
          const current = isActive(pathname, link.path);
          return (
            <Link
              key={link.path}
              href={link.path}
              className={current ? "active" : undefined}
              aria-current={current ? "page" : undefined}
              onClick={() => setOpenFor(null)}
            >
              <span className="nav-group-title">{link.label}</span>
              <span className="nav-group-desc">{link.description}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

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
    // The page behind an open menu must not scroll.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const authenticated = auth === "authenticated";
  const account = authenticated ? routes.dashboard : routes.login;

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
            <ProfessionalsMenu pathname={pathname} />
            <div className="nav-menu-actions">
              <Link
                href={account.path}
                className={buttonClasses({ variant: authenticated ? "primary" : "secondary", size: "lg" })}
                data-ph-event={account.label}
              >
                {account.label}
              </Link>
              {authenticated ? null : (
                <Link
                  href={routes.signup.path}
                  className={buttonClasses({ size: "lg" })}
                  data-ph-event="Sign up"
                >
                  {routes.signup.label}
                </Link>
              )}
            </div>
          </div>

          <div className="nav-right">
            <Link href={account.path} className="nav-login" data-ph-event={account.label}>
              {account.label}
            </Link>
            <GetAppButton size="md" align="end" className="nav-get-app">
              Get the app
            </GetAppButton>
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
      {open ? <div className="nav-backdrop" aria-hidden="true" onClick={() => setOpenFor(null)} /> : null}
    </div>
  );
}
