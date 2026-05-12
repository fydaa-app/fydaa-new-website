import { Check } from 'lucide-react';

export default function CareersApplySuccess() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
        <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
      </div>
      <h2 className="text-2xl font-semibold text-black">Thank you!</h2>
      <p className="mt-3 text-base font-medium text-gray-800">
        Your application has been successfully submitted.
      </p>
      <p className="mt-4 text-base text-gray-600">
        Our team will review your profile and get in touch with you shortly.
      </p>
    </div>
  );
}
