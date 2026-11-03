'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../layout/site-nav.css';

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

type PartnerNavbarProps = {
  slug: string;
  referralCode?: string | null;
};

export default function PartnerNavbar({ slug, referralCode }: PartnerNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const ids = NAV_LINKS.map((l) => l.href.slice(1));
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const referralParam = String(referralCode || '').trim() || slug;
  const loginHref = `/login?referredBy=${encodeURIComponent(referralParam)}`;

  return (
    <div className="site-nav">
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <Link
            href={`/${slug}`}
            className="nav-logo"
            onClick={() => setOpen(false)}
            aria-label="Partner home"
          >
            <img src="/fydaa-logo.png" alt="Fydaa" />
          </Link>

          <div className={`nav-center${open ? ' open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={active === link.href.slice(1) ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-right">
            <a href={loginHref} className="nav-download" style={{ borderRadius: 999 }}>
              Log In
            </a>
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
