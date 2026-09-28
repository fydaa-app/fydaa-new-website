"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./site-nav.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Programme", href: "/programme" },
  { label: "Career", href: "/careers" },
  { label: "Partner", href: "/partner" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <div className="site-nav">
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <Link
            href="/"
            className="nav-logo"
            onClick={() => setOpen(false)}
            aria-label="Fydaa home"
          >
            <img src="/fydaa-logo.png" alt="Fydaa" />
          </Link>

          <div className={`nav-center${open ? " open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={isActive(link.href) ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            {/* <Link href="/login" className="nav-login" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link href="/signup" className="nav-signup" onClick={() => setOpen(false)}>
              Sign up
            </Link> */}
          </div>

          <button
            type="button"
            className="nav-hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
