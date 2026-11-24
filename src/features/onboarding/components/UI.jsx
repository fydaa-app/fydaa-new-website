import React, { useId } from 'react';
import { CodeInput } from '@/components/ui/code-input';
import { captureButtonClick, labelFromChildren } from '@/lib/posthog';

/**
 * Shared primitives for the Fydaa KYC onboarding flow.
 * Colors are written as Tailwind arbitrary values (bg-jade etc.) so this
 * drops into any Tailwind config with no theme changes required. If you'd
 * rather use semantic tokens, add this to tailwind.config.js and swap the
 * arbitrary values for e.g. bg-jade / text-jade:
 *
 *   theme: { extend: { colors: {
 *     jade: '#0C4A3E', jadeHover: '#0A3D33', emerald: '#047857', tint: '#ECFDF5',
 *   } } }
 */

// ── Icons ──────────────────────────────────────────────────────────
export function RiskIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
    </svg>
  );
}
export function PersonalIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    </svg>
  );
}
export function DocIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8m8 4H8" />
    </svg>
  );
}
export const EsignIcon = DocIcon;
export function BankIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 10h20" />
    </svg>
  );
}
export function EnvelopeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  );
}
export function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}
export function BackIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
export function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ── Text ───────────────────────────────────────────────────────────
export function Overline({ children, emerald = false, className = '' }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${emerald ? 'text-emerald-700' : 'text-neutral-600'} ${className}`}>
      {children}
    </p>
  );
}

export function PageHeading({ children, size = 'text-heading' }) {
  return <h1 className={`${size} font-bold mb-1.5 text-ink`}>{children}</h1>;
}

export function PageSub({ children }) {
  return <p className="text-sm text-neutral-500 mb-8">{children}</p>;
}

export function LinkText({ children, onClick, className = '', ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm text-emerald-700 font-semibold cursor-pointer inline-block mb-6 bg-transparent border-0 p-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// ── Buttons / form controls ───────────────────────────────────────
export function Button({ children, onClick, className = '', phEvent, ...rest }) {
  const { ['data-ph-event']: dataPhEvent, ...buttonRest } = rest;
  const label =
    phEvent ||
    dataPhEvent ||
    labelFromChildren(children).replace(/[→←↑↓➜➝➞➡︎▶️]/g, '').replace(/\s+/g, ' ').trim();
  return (
    <button
      type="button"
      {...buttonRest}
      data-ph-event={label || undefined}
      onClick={(e) => {
        captureButtonClick(label || 'Button', { button_variant: 'primary' });
        onClick?.(e);
      }}
      className={`btn btn-primary btn-lg mt-2 w-full ${className}`}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, className = '', phEvent, ...rest }) {
  const { ['data-ph-event']: dataPhEvent, ...buttonRest } = rest;
  const label =
    phEvent ||
    dataPhEvent ||
    labelFromChildren(children).replace(/[→←↑↓➜➝➞➡︎▶️]/g, '').replace(/\s+/g, ' ').trim();
  return (
    <button
      type="button"
      {...buttonRest}
      data-ph-event={label || undefined}
      onClick={(e) => {
        captureButtonClick(label || 'Button', { button_variant: 'outline' });
        onClick?.(e);
      }}
      className={`btn btn-secondary btn-lg mt-2 w-full ${className}`}
    >
      {children}
    </button>
  );
}

export function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AppleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function FieldLabel({ children, htmlFor }) {
  return <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 mb-1.5">{children}</label>;
}

export function FieldInput({ label, prefix, className = '', id, ...rest }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className="mb-4">
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none">{prefix}</span>}
        <input
          className={`w-full h-12 border-[1.5px] border-neutral-200 rounded-xl px-3.5 text-sm font-medium text-neutral-950 outline-none focus:border-jade transition-colors ${
            prefix ? 'pl-12' : ''
          } ${className}`}
          id={inputId}
          {...rest}
        />
      </div>
    </div>
  );
}

export function FieldSelect({ label, children, id, ...rest }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div className="mb-4">
      {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}
      <select
        id={selectId}
        className="w-full h-12 border-[1.5px] border-neutral-200 rounded-xl px-3.5 text-sm font-medium text-neutral-950 outline-none focus:border-jade bg-white"
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

export function FieldRow({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

/**
 * Segmented OTP/PIN entry (keeps the legacy API). Backed by the shared CodeInput: one
 * real input, so paste and SMS autofill fill every box, PINs are masked and assistive
 * tech gets a single labelled field.
 */
export function CodeInputs({ count, value = '', onChange, label = 'Code', labelHidden = false, kind = 'otp', autoFocus = false, error }) {
  return (
    <CodeInput
      length={count}
      value={value}
      onChange={(next) => onChange?.(next)}
      label={label}
      labelHidden={labelHidden}
      kind={kind}
      autoFocus={autoFocus}
      error={error}
    />
  );
}

export function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={Boolean(selected)}
      className={`h-9 px-4 rounded-full text-sm font-semibold border-[1.5px] transition-colors ${
        selected ? 'bg-jade border-jade text-white' : 'bg-white border-neutral-200 text-neutral-600'
      }`}
    >
      {label}
    </button>
  );
}

export function Checkbox({ checked, onChange, children }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer mb-5">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={Boolean(checked)}
        onChange={() => onChange?.()}
      />
      <span
        aria-hidden="true"
        className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade ${
          checked ? 'bg-jade border-jade' : 'bg-white border-neutral-300'
        }`}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white" />}
      </span>
      <span className="text-xs leading-relaxed text-neutral-600">{children}</span>
    </label>
  );
}

export function QuestionCard({ icon, title, subtitle, counter, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="w-[42px] h-[42px] bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">{icon}</div>
        {counter && <span className="text-sm font-semibold text-neutral-500">{counter}</span>}
      </div>
      <div className="text-lg font-bold text-neutral-950 leading-snug mb-1.5">{title}</div>
      {subtitle && <div className="text-sm text-neutral-500 font-medium">{subtitle}</div>}
      {children}
    </div>
  );
}

export function ScoreRing({ score = 75, max = 100 }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / max) * c;
  return (
    <div className="relative w-[180px] h-[180px] mx-auto mb-4">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#E5E5E5" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r} fill="none" stroke="#047857" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-jade tracking-tight">{score}</span>
        <span className="text-xs text-neutral-500 mt-0.5">out of {max}</span>
      </div>
    </div>
  );
}
