'use client';

import { Check } from 'lucide-react';

interface Props {
  open: boolean;
  onOk: () => void;
}

export default function PartnerSuccessModal({ open, onOk }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="font-gilroy font-semibold text-2xl text-gray-800 mb-4">
          Thank You!
        </h2>
        <p className="font-inter text-gray-600 mb-6">
          We will share the login details in 24-48 hours after verification.
        </p>
        <button
          onClick={onOk}
          className="w-full h-12 bg-black text-white rounded-[12px] font-medium font-inter hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          OK
        </button>
      </div>
    </div>
  );
}
