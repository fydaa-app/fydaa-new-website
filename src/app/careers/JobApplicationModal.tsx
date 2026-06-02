'use client';

import { Fragment, useCallback, useEffect, useId, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Linkedin, X } from 'lucide-react';
import type { JobOpening } from './jobsData';
import CareersApplySuccess from './CareersApplySuccess';

const STEPS = ['Personal Info', 'Experience', 'Upload'] as const;

const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '60 days', '90 days'];

const inputClass =
  'w-full border-b border-gray-400 bg-transparent py-2 text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-black';
const labelClass = 'block text-sm text-[#001E3C] mb-1';

type Props = {
  open: boolean;
  job: JobOpening | null;
  onClose: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  currentJobTitle: string;
  totalExperience: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
};

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  currentJobTitle: '',
  totalExperience: '',
  currentCtc: '',
  expectedCtc: '',
  noticePeriod: 'Immediate',
};

export default function JobApplicationModal({ open, job, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const cvInputId = useId();
  const coverLetterInputId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !job) return;
    setStep(0);
    setForm(emptyForm);
    setCvFile(null);
    setCoverLetterFile(null);
    setError('');
    setSuccess(false);
  }, [open, job?.id]);

  const update = useCallback((name: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const handleBackdropKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  const validateStep = (s: number): boolean => {
    setError('');
    const emailOk = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email);
    const phoneDigits = form.phone.replace(/\D/g, '');

    if (s === 0) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError('Please enter your first and last name.');
        return false;
      }
      if (!emailOk) {
        setError('Please enter a valid email address.');
        return false;
      }
      if (phoneDigits.length !== 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return false;
      }
      if (!form.city.trim()) {
        setError('Please enter your city.');
        return false;
      }
    }
    if (s === 1) {
      if (!form.totalExperience.trim()) {
        setError('Please enter total experience.');
        return false;
      }
      if (!form.expectedCtc.trim()) {
        setError('Please enter expected CTC.');
        return false;
      }
    }
    if (s === 2) {
      if (!cvFile) {
        setError('Please upload your CV (PDF or DOCX, max 5MB).');
        return false;
      }
      const max = 5 * 1024 * 1024;
      const extOk = (name: string) => /\.(pdf|docx?)$/i.test(name);
      if (cvFile.size > max) {
        setError('CV must be 5MB or smaller.');
        return false;
      }
      if (!extOk(cvFile.name)) {
        setError('CV must be a PDF or DOCX file.');
        return false;
      }
      if (coverLetterFile) {
        if (coverLetterFile.size > max) {
          setError('Cover letter file must be 5MB or smaller.');
          return false;
        }
        if (!extOk(coverLetterFile.name)) {
          setError('Cover letter must be a PDF or DOCX file.');
          return false;
        }
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((x) => Math.min(x + 1, STEPS.length - 1));
  };

  const back = () => {
    setError('');
    setStep((x) => Math.max(x - 1, 0));
  };

  const handleSubmit = async () => {
    if (!job || !validateStep(2)) return;
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('jobId', job.id);
      fd.append('positionTitle', job.title);
      fd.append('firstName', form.firstName.trim());
      fd.append('lastName', form.lastName.trim());
      fd.append('email', form.email.trim());
      fd.append('phone', form.phone.replace(/\D/g, ''));
      fd.append('city', form.city.trim());
      fd.append('currentJobTitle', form.currentJobTitle.trim());
      fd.append('totalExperience', form.totalExperience.trim());
      fd.append('currentCtc', form.currentCtc.trim());
      fd.append('expectedCtc', form.expectedCtc.trim());
      fd.append('noticePeriod', form.noticePeriod);
      if (cvFile) fd.append('resume', cvFile);
      if (coverLetterFile) fd.append('coverLetter', coverLetterFile);

       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}referrals/apply`, {
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

  if (!open || !job) return null;

  const subtitle = `${job.companyName} · ${job.location} · ${job.salaryCompact}`;

  const footerLeft =
    step === 0
      ? 'Step 1 of 3 — Personal Info'
      : step === 1
        ? 'Step 2 of 3 — Experience & CTC'
        : 'Step 3 of 3 — Cover letter & CV';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-apply-title"
      onKeyDown={handleBackdropKey}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl">
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
                  <h2 id="job-apply-title" className="font-gilroy text-2xl font-semibold text-black sm:text-[28px]">
                    {job.title}
                  </h2>
                  <p className="mt-1 font-inter text-sm text-gray-500 sm:text-[15px]">{subtitle}</p>
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

              <nav className="mt-8 flex w-full justify-center px-2 sm:px-0" aria-label="Application steps">
                <div className="flex w-full max-w-md items-start sm:max-w-lg">
                  {STEPS.map((label, i) => {
                    const done = i < step;
                    const active = i === step;
                    const connectorComplete = step > i;

                    return (
                      <Fragment key={label}>
                        <div className="flex w-[5.25rem] shrink-0 flex-col items-center gap-2 sm:w-24">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                              done
                                ? 'bg-black text-white'
                                : active
                                  ? 'border-2 border-black bg-white text-black shadow-sm'
                                  : 'border border-gray-300 bg-white text-gray-400'
                            }`}
                            aria-current={active ? 'step' : undefined}
                          >
                            {done ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : i + 1}
                          </span>
                          <span
                            className={`max-w-[5.25rem] text-center font-inter text-[10px] font-medium leading-tight sm:max-w-none sm:text-[11px] ${
                              active ? 'font-semibold text-black' : done ? 'text-gray-600' : 'text-gray-400'
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 ? (
                          <div
                            className={`mx-2 mt-[18px] h-0.5 min-w-[12px] flex-1 ${connectorComplete ? 'bg-black' : 'bg-gray-200'}`}
                            aria-hidden
                          />
                        ) : null}
                      </Fragment>
                    );
                  })}
                </div>
              </nav>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
              {step === 0 && (
                <div className="flex flex-col flex-1 space-y-6 pb-4">
                   {/* <button
                     type="button"
                     className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-inter text-sm font-medium text-[#001E3C] transition hover:bg-gray-50"
                     onClick={() => window.open(job.linkedinLink, '_blank', 'noopener,noreferrer')}
                   >
                     <Linkedin className="h-5 w-5 text-[#0A66C2]" aria-hidden />
                     Apply with LinkedIn
                   </button> */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    {/* <span className="relative bg-white px-3 font-inter text-xs text-gray-500">or fill manually</span> */}
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        placeholder="Akash"
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        value={form.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        placeholder="Tyagi"
                        autoComplete="family-name"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="you@email.com"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className={inputClass}
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        value={form.city}
                        onChange={(e) => update('city', e.target.value)}
                        placeholder="Mumbai"
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col flex-1 space-y-6 pb-4">
                  <div>
                    <label className={labelClass}>Current Job Title</label>
                    <input
                      className={inputClass}
                      value={form.currentJobTitle}
                      onChange={(e) => update('currentJobTitle', e.target.value)}
                      placeholder="e.g. Deputy Vice President"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Total Experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        value={form.totalExperience}
                        onChange={(e) => update('totalExperience', e.target.value)}
                        placeholder="e.g. 11 years"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Current CTC (LPA)</label>
                      <input
                        className={inputClass}
                        value={form.currentCtc}
                        onChange={(e) => update('currentCtc', e.target.value)}
                        placeholder="e.g. 24"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Expected CTC (LPA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputClass}
                      value={form.expectedCtc}
                      onChange={(e) => update('expectedCtc', e.target.value)}
                      placeholder="e.g. 32"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Notice Period</label>
                    <select
                      className={`${inputClass} cursor-pointer`}
                      value={form.noticePeriod}
                      onChange={(e) => update('noticePeriod', e.target.value)}
                    >
                      {NOTICE_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col flex-1 space-y-6 pb-4">
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white px-6 py-10">
                    <FileText className="mb-3 h-10 w-10 text-gray-500" aria-hidden />
                    <p className="font-inter text-sm font-medium text-black">Cover letter</p>
                    <p className="mt-1 font-inter text-xs text-gray-500">Optional · PDF or DOCX · Max 5MB</p>
                    <input
                      id={coverLetterInputId}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setCoverLetterFile(f ?? null);
                        setError('');
                      }}
                    />
                    <label
                      htmlFor={coverLetterInputId}
                      className="mt-5 inline-flex cursor-pointer rounded-full border border-black bg-white px-6 py-2 font-inter text-sm font-medium text-black transition hover:bg-neutral-100"
                    >
                      Browse file
                    </label>
                    {coverLetterFile ? (
                      <p className="mt-3 max-w-full truncate font-inter text-xs text-black">{coverLetterFile.name}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-neutral-50 px-6 py-10">
                    <FileText className="mb-3 h-10 w-10 text-gray-500" aria-hidden />
                    <p className="font-inter text-sm font-medium text-black">
                      CV / Resume <span className="text-red-500">*</span>
                    </p>
                    <p className="mt-1 font-inter text-xs text-gray-500">PDF or DOCX · Max 5MB</p>
                    <input
                      id={cvInputId}
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
                      htmlFor={cvInputId}
                      className="mt-5 inline-flex cursor-pointer rounded-full border border-black bg-black px-6 py-2 font-inter text-sm font-medium text-white transition hover:bg-neutral-900"
                    >
                      Browse file
                    </label>
                    {cvFile ? (
                      <p className="mt-3 max-w-full truncate font-inter text-xs text-black">{cvFile.name}</p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-neutral-50 p-5">
                    <p className="font-inter text-sm font-semibold text-black">Before you submit — quick check</p>
                    <ul className="mt-3 space-y-2 font-inter text-sm text-gray-700">
                      {[
                        'Cover letter file is included if you chose to add one',
                        'CV is updated with your latest role',
                        'Contact details are correct',
                      ].map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-black text-white">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {error ? <p className="pb-2 text-center text-sm text-red-600">{error}</p> : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-8">
              <p className="font-inter text-xs text-gray-500 sm:text-sm">{footerLeft}</p>
              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-2 font-inter text-sm font-medium text-[#001E3C] transition hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : null}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-1 rounded-full bg-black px-5 py-2 font-inter text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 rounded-full border border-black bg-black px-5 py-2 font-inter text-sm font-medium text-white transition hover:bg-neutral-900 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting…' : 'Submit Application'}
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}