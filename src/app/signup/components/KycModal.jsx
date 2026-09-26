import React from 'react';

export default function KycModal({ open, onComplete }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-6">
      <div className="bg-white rounded-[20px] px-7 pt-9 pb-7 text-center w-full max-w-[340px] shadow-2xl">
        <div className="w-[72px] h-[72px] mx-auto mb-5 flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="12" width="48" height="40" rx="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
            <path d="M32 28v8M32 40h.01" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <rect x="22" y="6" width="20" height="12" rx="3" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
          </svg>
        </div>
        <div className="text-[17px] font-bold text-neutral-950 mb-1.5">Your KYC is NOT compliant</div>
        <div className="text-[13px] text-neutral-400 font-medium mb-6">Please first complete your KYC</div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full h-[52px] rounded-xl bg-[#0C4A3E] text-white text-[15px] font-bold hover:bg-[#0A3D33]"
        >
          Complete your KYC
        </button>
      </div>
    </div>
  );
}
