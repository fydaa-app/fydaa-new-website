'use client';

import { Check } from 'lucide-react';

interface Props {
  open: boolean;
  message?: string;
  onOk: () => void;
}

export default function PartnerSuccessModal({
  open,
  message = 'We will share the login details in 24-48 hours after verification.',
  onOk,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-heading font-bold text-gray-800 mb-4">
          Thank You!
        </h2>
        <p className="font-inter text-gray-600 mb-6">{message}</p>
        <button
          onClick={onOk}
          className="btn btn-primary btn-lg w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}
