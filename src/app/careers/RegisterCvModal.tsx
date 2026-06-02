'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { Check, FileText, X } from 'lucide-react';
import CareersApplySuccess from './CareersApplySuccess';

const inputClass =
  'w-full border-b border-gray-400 bg-transparent py-2 text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-black';
const labelClass = 'block text-sm text-[#001E3C] mb-1';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterCvModal({ open, onClose }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCvFile(null);
    setError('');
    setSuccess(false);
  }, [open]);

  const handleBackdropKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  const validate = (): boolean => {
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return false;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!cvFile) {
      setError('Please upload your CV (PDF or DOCX, max 5MB).');
      return false;
    }
    const max = 5 * 1024 * 1024;
    if (cvFile.size > max) {
      setError('CV must be 5MB or smaller.');
      return false;
    }
    if (!/\.(pdf|docx?)$/i.test(cvFile.name)) {
      setError('CV must be a PDF or DOCX file.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('firstName', firstName.trim());
      fd.append('lastName', lastName.trim());
      fd.append('email', email.trim());
      fd.append('phone', phone.replace(/\D/g, ''));
      fd.append('resume', cvFile!);

      const res = await fetch('/api/careers/cv-register', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Submission failed. Please try again.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Failed to connect. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-cv-title"
      onKeyDown={handleBackdropKey}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {success ? (
          <div className="relative flex min-h-[min(60vh,480px)] w-full flex-col items-center justify-center overflow-y-auto px-6 py-12 sm:px-10 sm:py-16">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <CareersApplySuccess />
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-gray-100 px-5 pb-4 pt-5 sm:px-8 sm:pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="register-cv-title" className="font-gilroy text-2xl font-semibold text-black sm:text-[26px]">
                    Register your CV
                  </h2>
                  <p className="mt-1 font-inter text-sm text-gray-500 sm:text-[15px]">
                    Upload your CV and we&apos;ll match you with opportunities as they arise.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      First Name <span className="text-red-500">*</span>
                    </label>
                      <input
                        className={inputClass}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        onKeyDown={(e) => { if (!/^[a-zA-Z\s]$/.test(e.key) && !['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(e.key)) e.preventDefault(); }}
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Last Name <span className="text-red-500">*</span>
                    </label>
                      <input
                        className={inputClass}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        onKeyDown={(e) => { if (!/^[a-zA-Z\s]$/.test(e.key) && !['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(e.key)) e.preventDefault(); }}
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Phone <span className="text-red-500">*</span>
                    </label>
                      <input
                        type="tel"
                        className={inputClass}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onKeyDown={(e) => { if (!/^\d$/.test(e.key) && !['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Escape'].includes(e.key)) e.preventDefault(); if (phone.length >= 10 && /^\d$/.test(e.key)) e.preventDefault(); }}
                        placeholder="+91 XXXXX XXXXX"
                        autoComplete="tel"
                      />
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-neutral-50 px-6 py-10">
                  <FileText className="mb-3 h-10 w-10 text-gray-500" aria-hidden />
                  <p className="font-inter text-sm font-medium text-black">
                    Upload your CV <span className="text-red-500">*</span>
                  </p>
                  <p className="mt-1 font-inter text-xs text-gray-500">PDF or DOCX · Max 5MB</p>
                  <input
                    id={fileInputId}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setCvFile(f ?? null);
                      setError('');
                    }}
                  />
                  <label
                    htmlFor={fileInputId}
                    className="mt-5 inline-flex cursor-pointer rounded-full border border-black bg-black px-6 py-2 font-inter text-sm font-medium text-white transition hover:bg-neutral-900"
                  >
                    Browse file
                  </label>
                  {cvFile ? (
                    <p className="mt-3 max-w-full truncate font-inter text-xs text-black">{cvFile.name}</p>
                  ) : null}
                </div>

                {error ? <p className="mt-4 text-center text-sm text-red-600">{error}</p> : null}
              </div>

              <div className="flex shrink-0 justify-end gap-2 border-t border-gray-100 bg-white px-5 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-gray-300 bg-white px-5 py-2 font-inter text-sm font-medium text-[#001E3C] transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1 rounded-full border border-black bg-black px-5 py-2 font-inter text-sm font-medium text-white transition hover:bg-neutral-900 disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
