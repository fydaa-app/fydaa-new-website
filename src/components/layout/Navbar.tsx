"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { mainNavigation, professionalNavigation, routes } from "@/config/routes";
import { GetAppButton } from "@/components/app/get-app-button";
import { siteConfig } from "@/config/site";
import { useAuthStatus } from "@/lib/auth/use-auth-status";
import { cn } from "@/lib/utils/cn";
import "./site-nav.css";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname || href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** How long a pointer rests on "Professionals" before its panel opens (motion.md: 150ms of intent). */
const HOVER_INTENT_MS = 150;

/**
 * "Professionals": partners, the programme and careers. On a desktop a full-width flat panel under
 * the bar (opens on a click, or after a short hover); in the phone sheet its links open in place.
 */
function ProfessionalsMenu({ pathname, inSheet }: { pathname: string | null; inSheet?: boolean }) {
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor !== null && openFor === pathname;
  const active = professionalNavigation.some((link) => isActive(pathname, link.path));

  useEffect(() => {
    if (!open || inSheet) return;
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
  }, [open, inSheet]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const hover = inSheet
    ? {}
    : {
        onPointerEnter: (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setOpenFor(pathname), HOVER_INTENT_MS);
        },
        onPointerLeave: (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setOpenFor(null), HOVER_INTENT_MS);
        },
      };

  return (
    <div ref={ref} className={cn("nav-menu", open && "is-open")} {...hover}>
      <button
        type="button"
        className={cn("nav-word", active && "is-current")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpenFor(open ? null : pathname)}
      >
        Professionals
        <svg viewBox="0 0 16 16" aria-hidden="true" className="nav-chev">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div id={panelId} className="nav-panel" hidden={!open}>
        <div className="wrap nav-panel__grid">
          <p className="nav-panel__label">Work with Fydaa</p>
          <ul className="nav-panel__links">
            {professionalNavigation.map((link) => {
              const current = isActive(pathname, link.path);
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpenFor(null)}
                  >
                    <span className="nav-panel__title">{link.label}</span>
                    <span className="nav-panel__desc">{link.description}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * The site header (tasteskill nav-mega): fixed, opaque and the same at every scroll depth. The logo
 * on the left line; four plain words; "Log in" as a word; "Get the app" the one button, ending on
 * the right line. Under 1024px a menu button opens a full-screen sheet with 56px rows.
 */
export default function Navbar() {
  const pathname = usePathname();
  const auth = useAuthStatus();
  const sheetId = useId();
  // The sheet is "open for" one pathname, so navigating anywhere closes it.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor !== null && openFor === pathname;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenFor(null);
    };
    // The page behind an open sheet must not scroll.
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
  const account = authenticated
    ? { path: routes.dashboard.path, label: routes.dashboard.label }
    : { path: routes.login.path, label: "Log in" };

  return (
    <header className="site-header nav">
      <div className="wrap nav-bar">
        <a
          className="skip-link"
          href="#top"
          onClick={(event) => {
            const main = document.querySelector("main");
            if (!main || main.id === "top") return;
            event.preventDefault();
            main.setAttribute("tabindex", "-1");
            main.focus();
          }}
        >
          Skip to content
        </a>
        <Link href="/" className="nav-logo" aria-label={`${siteConfig.name} home`}>
          <img src="/fydaa-logo.png" alt={siteConfig.name} width={409} height={147} />
        </Link>

        <nav aria-label="Main" className="nav-words">
          {mainNavigation.map((link) => {
            const active = isActive(pathname, link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn("nav-word", active && "is-current")}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <ProfessionalsMenu pathname={pathname} />
        </nav>

        <div className="nav-actions">
          <Link href={account.path} className="nav-word nav-account" data-ph-event={account.label}>
            {account.label}
          </Link>
          <GetAppButton size="md" align="end" className="nav-get-app" icon={false}>
            Get the app
          </GetAppButton>
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpenFor(open ? null : pathname)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={sheetId}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id={sheetId} className="nav-sheet" hidden={!open}>
        <nav aria-label="Menu" className="wrap nav-sheet__rows">
          {mainNavigation.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="nav-sheet__row"
              aria-current={isActive(pathname, link.path) ? "page" : undefined}
              onClick={() => setOpenFor(null)}
            >
              {link.label}
            </Link>
          ))}
          <p className="nav-sheet__group">Professionals</p>
          {professionalNavigation.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="nav-sheet__row nav-sheet__row--sub"
              aria-current={isActive(pathname, link.path) ? "page" : undefined}
              onClick={() => setOpenFor(null)}
            >
              {link.label}
            </Link>
          ))}
          <div className="nav-sheet__actions">
            <Link
              href={account.path}
              className="btn btn-secondary btn-md"
              data-ph-event={account.label}
              onClick={() => setOpenFor(null)}
            >
              {account.label}
            </Link>
            {authenticated ? null : (
              <Link
                href={routes.signup.path}
                className="btn btn-secondary btn-md"
                data-ph-event="Sign up"
                onClick={() => setOpenFor(null)}
              >
                {routes.signup.label}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
