import React from 'react';

/**
 * Shared primitives for the Fydaa KYC onboarding flow.
 * Colors are written as Tailwind arbitrary values (bg-[#0C4A3E] etc.) so this
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
    <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${emerald ? 'text-emerald-700' : 'text-neutral-400'} ${className}`}>
      {children}
    </p>
  );
}

export function PageHeading({ children, size = 'text-[28px]' }) {
  return <h1 className={`${size} font-bold tracking-tight mb-1.5 leading-tight text-neutral-950`}>{children}</h1>;
}

export function PageSub({ children }) {
  return <p className="text-sm text-neutral-500 mb-8">{children}</p>;
}

export function LinkText({ children, onClick, className = '' }) {
  return (
    <span onClick={onClick} className={`text-[13px] text-emerald-700 font-semibold cursor-pointer inline-block mb-6 ${className}`}>
      {children}
    </span>
  );
}

// ── Buttons / form controls ───────────────────────────────────────
export function Button({ children, onClick, className = '', ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-[52px] rounded-xl bg-[#0C4A3E] text-white text-[15px] font-bold hover:bg-[#0A3D33] transition-colors mt-2 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children }) {
  return <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">{children}</label>;
}

export function FieldInput({ label, prefix, className = '', ...rest }) {
  return (
    <div className="mb-4">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 pointer-events-none">{prefix}</span>}
        <input
          className={`w-full h-12 border-[1.5px] border-neutral-200 rounded-[11px] px-3.5 text-sm font-medium text-neutral-950 outline-none focus:border-[#0C4A3E] transition-colors ${
            prefix ? 'pl-12' : ''
          } ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
}

export function FieldSelect({ label, children, ...rest }) {
  return (
    <div className="mb-4">
      {label && <FieldLabel>{label}</FieldLabel>}
      <select
        className="w-full h-12 border-[1.5px] border-neutral-200 rounded-[11px] px-3.5 text-sm font-medium text-neutral-950 outline-none focus:border-[#0C4A3E] bg-white"
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

export function CodeInputs({ count, value = '', onChange }) {
  const controlled = typeof onChange === 'function';
  const chars = Array.from({ length: count }, (_, i) => (controlled ? value[i] || '' : ''));

  function writeAt(index, digit, input) {
    const next = chars.slice();
    next[index] = digit;
    onChange(next.join(''));
    if (digit && input.nextElementSibling) input.nextElementSibling.focus();
  }

  return (
    <div className="flex gap-2.5 flex-wrap mb-4">
      {chars.map((char, i) => (
        <input
          key={i}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={controlled ? char : undefined}
          className="w-[46px] h-[52px] border-[1.5px] border-neutral-200 rounded-[10px] text-center text-lg font-bold text-neutral-950 outline-none focus:border-[#0C4A3E]"
          onChange={(e) => {
            if (!controlled) return;
            const digit = e.target.value.replace(/\D/g, '').slice(-1);
            writeAt(i, digit, e.target);
          }}
          onKeyDown={(e) => {
            if (!controlled) return;
            if (e.key === 'Backspace' && !chars[i] && e.target.previousElementSibling) {
              e.target.previousElementSibling.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

export function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 px-4 rounded-full text-[13px] font-semibold border-[1.5px] transition-colors ${
        selected ? 'bg-[#0C4A3E] border-[#0C4A3E] text-white' : 'bg-white border-neutral-200 text-neutral-600'
      }`}
    >
      {label}
    </button>
  );
}

export function Checkbox({ checked, onChange, children }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer mb-5">
      <span
        onClick={onChange}
        className={`w-5 h-5 rounded-[5px] border-[1.5px] flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
          checked ? 'bg-[#0C4A3E] border-[#0C4A3E]' : 'bg-white border-neutral-300'
        }`}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white" />}
      </span>
      <span className="text-[12.5px] leading-relaxed text-neutral-600">{children}</span>
    </label>
  );
}

export function QuestionCard({ icon, title, subtitle, counter, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="w-[42px] h-[42px] bg-emerald-50 rounded-[11px] flex items-center justify-center text-emerald-700">{icon}</div>
        {counter && <span className="text-[13px] font-semibold text-neutral-400">{counter}</span>}
      </div>
      <div className="text-[17px] font-bold text-neutral-950 leading-snug mb-1.5">{title}</div>
      {subtitle && <div className="text-[13px] text-neutral-400 font-medium">{subtitle}</div>}
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
        <span className="text-4xl font-extrabold text-[#0C4A3E] tracking-tight">{score}</span>
        <span className="text-xs text-neutral-400 mt-0.5">out of {max}</span>
      </div>
    </div>
  );
}
