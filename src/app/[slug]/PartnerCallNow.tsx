'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

type PartnerCallNowProps = {
  phone: string;
  partnerName?: string;
  className?: string;
};

function formatDisplayPhone(digits: string) {
  const ten = digits.replace(/\D/g, '').slice(-10);
  if (ten.length !== 10) return digits;
  return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;
}

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

export default function PartnerCallNow({ phone, partnerName, className }: PartnerCallNowProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const digits = String(phone || '').replace(/\D/g, '').slice(-10);
  const telHref = digits.length === 10 ? `tel:+91${digits}` : undefined;
  const display = formatDisplayPhone(digits);

  useEffect(() => {
    setMounted(true);
    // Fine pointer + hover = desktop (show number card).
    // Phones/iPads/touch tablets dial via tel: instead.
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function onClick() {
    if (!telHref) return;
    if (isDesktop) {
      setOpen(true);
      return;
    }
    window.location.href = telHref;
  }

  const card =
    open && mounted && typeof document !== 'undefined'
      ? createPortal(
          <div className="pw-call-overlay" role="presentation" onClick={() => setOpen(false)}>
            <div
              className="pw-call-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pw-call-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="pw-call-icon" aria-hidden="true">
                <PhoneIcon />
              </div>
              <h2 id={titleId} className="pw-call-sr-only">
                Phone number{partnerName ? ` for ${partnerName}` : ''}
              </h2>
              <p className="pw-call-number">{display}</p>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button type="button" className={className} onClick={onClick} disabled={!telHref}>
        Call Now
        <PhoneIcon />
      </button>
      {card}
    </>
  );
}
