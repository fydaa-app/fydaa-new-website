import React from 'react';

export default function KycModal({
  open,
  onComplete,
  title = 'Your KYC is NOT compliant',
  subtitle = 'Please first complete your KYC',
  cta = 'Complete your KYC',
}) {
  if (!open) return null;
  const ok = /compliant/i.test(title) && !/not compliant/i.test(title);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-6">
      <div className="bg-white rounded-[20px] px-7 pt-9 pb-7 text-center w-full max-w-[340px] shadow-2xl">
        <div className="w-[72px] h-[72px] mx-auto mb-5 flex items-center justify-center">
          {ok ? (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
              <circle cx="32" cy="32" r="28" fill="#ECFDF5" stroke="#047857" strokeWidth="2" />
              <path d="M20 33l8 8 16-16" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
              <rect x="8" y="12" width="48" height="40" rx="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
              <path d="M32 28v8M32 40h.01" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
              <rect x="22" y="6" width="20" height="12" rx="3" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
            </svg>
          )}
        </div>
        <div className="text-[17px] font-bold text-neutral-950 mb-1.5">{title}</div>
        <div className="text-[13px] text-neutral-400 font-medium mb-6">{subtitle}</div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full h-[52px] rounded-xl bg-[#0C4A3E] text-white text-[15px] font-bold hover:bg-[#0A3D33]"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
