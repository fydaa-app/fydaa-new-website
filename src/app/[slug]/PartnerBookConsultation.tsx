'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { bookPartnerConsultation } from '../config/partnerWebsiteApi';

type PartnerBookConsultationTriggerProps = {
  slug: string;
  className?: string;
  children: React.ReactNode;
};

export default function PartnerBookConsultationTrigger({
  slug,
  className,
  children,
}: PartnerBookConsultationTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open ? (
        <PartnerBookConsultationModal slug={slug} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

type ModalProps = {
  slug: string;
  onClose: () => void;
};

type FieldKey = 'name' | 'mobileNumber' | 'email' | 'preferredTime';
type FieldErrors = Partial<Record<FieldKey, string>>;

const MANDATORY = 'This field is mandatory';

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function PartnerBookConsultationModal({ slug, onClose }: ModalProps) {
  const titleId = useId();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [minPreferredTime, setMinPreferredTime] = useState(() => toDatetimeLocalValue(new Date()));
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [busy, onClose]);

  useEffect(() => {
    const refreshMin = () => setMinPreferredTime(toDatetimeLocalValue(new Date()));
    refreshMin();
    const id = window.setInterval(refreshMin, 30_000);
    return () => window.clearInterval(id);
  }, []);

  function clearFieldError(key: FieldKey) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): { ok: true; phone: string } | { ok: false } {
    const next: FieldErrors = {};
    const trimmedName = name.trim();
    const phone = mobileNumber.replace(/\D/g, '').slice(-10);
    const trimmedEmail = email.trim();
    const time = preferredTime.trim();
    const nowMin = toDatetimeLocalValue(new Date());
    setMinPreferredTime(nowMin);

    if (!trimmedName) next.name = MANDATORY;
    if (!mobileNumber.trim()) next.mobileNumber = MANDATORY;
    else if (phone.length !== 10) next.mobileNumber = 'Enter a valid 10-digit phone number';
    if (!trimmedEmail) next.email = MANDATORY;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = 'Enter a valid email address';
    }
    if (!time) next.preferredTime = MANDATORY;
    else if (time < nowMin) {
      next.preferredTime = 'Preferred time cannot be in the past';
    }

    setFieldErrors(next);
    if (Object.keys(next).length) return { ok: false };
    return { ok: true, phone };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const result = validate();
    if (!result.ok) return;

    setBusy(true);
    try {
      await bookPartnerConsultation(slug, {
        mobileNumber: result.phone,
        email: email.trim(),
        preferredTime: preferredTime.trim(),
        name: name.trim(),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to book consultation.');
    } finally {
      setBusy(false);
    }
  }

  const modal = (
    <div className="pw-consult-overlay" role="presentation" onClick={() => !busy && onClose()}>
      <div
        className="pw-consult-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pw-consult-header">
          <h2 id={titleId}>Book a Consultation</h2>
          <button
            type="button"
            className="pw-consult-close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {done ? (
          <div className="pw-consult-success">
            <p>Thanks — your consultation request has been sent. The partner will reach out shortly.</p>
            <button type="button" className="pw-consult-btn pw-consult-btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="pw-consult-form" onSubmit={onSubmit} noValidate>
            <label className={`pw-consult-field${fieldErrors.name ? ' has-error' : ''}`}>
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError('name');
                }}
                autoComplete="name"
                maxLength={120}
                disabled={busy}
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name ? (
                <span className="pw-consult-field-error">{fieldErrors.name}</span>
              ) : null}
            </label>
            <label className={`pw-consult-field${fieldErrors.mobileNumber ? ' has-error' : ''}`}>
              <span>Phone number</span>
              <input
                type="tel"
                inputMode="numeric"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  clearFieldError('mobileNumber');
                }}
                placeholder="10-digit mobile"
                autoComplete="tel"
                disabled={busy}
                aria-invalid={Boolean(fieldErrors.mobileNumber)}
              />
              {fieldErrors.mobileNumber ? (
                <span className="pw-consult-field-error">{fieldErrors.mobileNumber}</span>
              ) : null}
            </label>
            <label className={`pw-consult-field${fieldErrors.email ? ' has-error' : ''}`}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={busy}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email ? (
                <span className="pw-consult-field-error">{fieldErrors.email}</span>
              ) : null}
            </label>
            <label className={`pw-consult-field${fieldErrors.preferredTime ? ' has-error' : ''}`}>
              <span>Preferred time</span>
              <input
                type="datetime-local"
                value={preferredTime}
                min={minPreferredTime}
                onChange={(e) => {
                  setPreferredTime(e.target.value);
                  clearFieldError('preferredTime');
                }}
                disabled={busy}
                aria-invalid={Boolean(fieldErrors.preferredTime)}
              />
              {fieldErrors.preferredTime ? (
                <span className="pw-consult-field-error">{fieldErrors.preferredTime}</span>
              ) : null}
            </label>

            {error ? <p className="pw-consult-error">{error}</p> : null}

            <div className="pw-consult-actions">
              <button
                type="button"
                className="pw-consult-btn pw-consult-btn-secondary"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>
              <button type="submit" className="pw-consult-btn pw-consult-btn-primary" disabled={busy}>
                {busy ? 'Booking…' : 'Book consultation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}
