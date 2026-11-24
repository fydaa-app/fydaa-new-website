"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { cn } from "@/lib/utils/cn";
import CareersApplySuccess from "./CareersApplySuccess";
import {
  CareersDialog,
  DialogHeader,
  Field,
  FilePicker,
  FormError,
  MAX_FILE_BYTES,
  NAME_CHARS,
  allowOnly,
  decimalOnly,
  fieldClass,
  isDocument,
  mobileKeys,
  toMobile,
} from "./CareersDialog";
import type { JobOpening } from "./types";

/** Keep digits and one decimal point, cap decimals and clamp to `max` (replaced by `overflow`). */
function limitDecimal(raw: string, maxDecimals: number, max: number, overflow: string): string {
  const [whole = "", decimals] = raw.replace(/[^\d.]/g, "").split(".");
  const value = decimals === undefined ? whole : `${whole}.${decimals.slice(0, maxDecimals)}`;
  return parseFloat(value) > max ? overflow : value;
}

const STEPS = ["Your details", "Experience", "CV"] as const;

const NOTICE_OPTIONS = ["Immediate", "15 days", "30 days", "60 days", "90 days"];

const BEFORE_YOU_SUBMIT = [
  "Your CV shows your latest role",
  "Your email and mobile number are correct",
  "Your cover letter is attached, if you're adding one",
];

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

type FieldKey = keyof FormState | "cv" | "coverLetter";

type FormErrorState = { message: string; field: FieldKey | null; attempt: number };

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  currentJobTitle: "",
  totalExperience: "",
  currentCtc: "",
  expectedCtc: "",
  noticePeriod: "Immediate",
};

/** The three-step application for one role. Mounted fresh for each role, so it always starts empty. */
export default function JobApplicationModal({ open, job, onClose }: Props) {
  if (!open || !job) return null;
  return <ApplicationDialog key={job.id} job={job} onClose={onClose} />;
}

function ApplicationDialog({ job, onClose }: { job: JobOpening; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [error, setError] = useState<FormErrorState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const attempts = useRef(0);
  const uid = useId();
  const id = (name: FieldKey) => `${uid}-${name}`;
  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;

  const update = (name: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  /** Props that tie a field to the error message when it's the one to fix. */
  const invalid = (name: FieldKey) =>
    error?.field === name ? { "aria-invalid": true as const, "aria-describedby": errorId } : {};

  const fail = (message: string, field: FieldKey | null = null) => {
    attempts.current += 1;
    setError({ message, field, attempt: attempts.current });
    if (field) document.getElementById(id(field))?.focus();
    return false;
  };

  const validateStep = (s: number): boolean => {
    setError(null);
    if (s === 0) {
      if (!form.firstName.trim()) return fail("Please enter your first and last name.", "firstName");
      if (!form.lastName.trim()) return fail("Please enter your first and last name.", "lastName");
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
        return fail("Please enter a valid email address.", "email");
      }
      if (form.phone.replace(/\D/g, "").length !== 10) {
        return fail("Please enter a valid 10-digit mobile number.", "phone");
      }
      if (!form.city.trim()) return fail("Please enter your city.", "city");
    }
    if (s === 1) {
      if (!form.totalExperience.trim()) return fail("Please enter total experience.", "totalExperience");
      if (!form.expectedCtc.trim()) return fail("Please enter expected CTC.", "expectedCtc");
    }
    if (s === 2) {
      if (!cvFile) return fail("Please upload your CV (PDF or DOCX, max 5MB).", "cv");
      if (cvFile.size > MAX_FILE_BYTES) return fail("CV must be 5MB or smaller.", "cv");
      if (!isDocument(cvFile.name)) return fail("CV must be a PDF or DOCX file.", "cv");
      if (coverLetterFile) {
        if (coverLetterFile.size > MAX_FILE_BYTES) {
          return fail("Cover letter file must be 5MB or smaller.", "coverLetter");
        }
        if (!isDocument(coverLetterFile.name))
          return fail("Cover letter must be a PDF or DOCX file.", "coverLetter");
      }
    }
    return true;
  };

  const goTo = (next: number) => {
    setStep(next);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const back = () => {
    setError(null);
    goTo(Math.max(step - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("jobId", job.id);
      fd.append("positionTitle", job.title);
      fd.append("firstName", form.firstName.trim());
      fd.append("lastName", form.lastName.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.replace(/\D/g, ""));
      fd.append("city", form.city.trim());
      fd.append("currentJobTitle", form.currentJobTitle.trim());
      fd.append("totalExperience", form.totalExperience.trim());
      fd.append("currentCtc", form.currentCtc.trim());
      fd.append("expectedCtc", form.expectedCtc.trim());
      fd.append("noticePeriod", form.noticePeriod);
      if (cvFile) fd.append("resume", cvFile);
      if (coverLetterFile) fd.append("coverLetter", coverLetterFile);

      const res = await fetch(`${env.api.crm}referrals/apply`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        fail(typeof data.message === "string" ? data.message : "Submission failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      fail("Failed to connect. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step < STEPS.length - 1) next();
    else void handleSubmit();
  };

  const subtitle = [job.companyName, job.location, job.salaryCompact].filter(Boolean).join(", ");

  return (
    <CareersDialog labelledBy={titleId} onClose={onClose}>
      {success ? (
        <CareersApplySuccess titleId={titleId} title="Thanks, we've got your application" onDone={onClose}>
          Our team will review your profile and get in touch with you shortly.
        </CareersApplySuccess>
      ) : (
        <>
          <DialogHeader
            titleId={titleId}
            context="Apply for"
            title={job.title}
            description={subtitle}
            onClose={onClose}
          >
            <ol aria-label="Application steps" className="mt-5 grid grid-cols-3 gap-2">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  aria-current={i === step ? "step" : undefined}
                  className="flex flex-col gap-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-fast",
                      i <= step ? "bg-jade" : "bg-line",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-semibold sm:text-sm",
                      i === step ? "text-ink" : "text-grey-500",
                    )}
                  >
                    {label}
                    {i < step ? <span className="sr-only"> (done)</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </DialogHeader>

          <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              {step === 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id={id("firstName")} label="First name">
                    <input
                      id={id("firstName")}
                      className={fieldClass}
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                      onKeyDown={allowOnly(NAME_CHARS)}
                      autoComplete="given-name"
                      aria-required="true"
                      {...invalid("firstName")}
                    />
                  </Field>
                  <Field id={id("lastName")} label="Last name">
                    <input
                      id={id("lastName")}
                      className={fieldClass}
                      value={form.lastName}
                      onChange={(e) => update("lastName", e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                      onKeyDown={allowOnly(NAME_CHARS)}
                      autoComplete="family-name"
                      aria-required="true"
                      {...invalid("lastName")}
                    />
                  </Field>
                  <Field id={id("email")} label="Email" className="sm:col-span-2">
                    <input
                      id={id("email")}
                      type="email"
                      className={fieldClass}
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      aria-required="true"
                      {...invalid("email")}
                    />
                  </Field>
                  <Field id={id("phone")} label="Mobile number">
                    <input
                      id={id("phone")}
                      type="tel"
                      inputMode="numeric"
                      className={fieldClass}
                      value={form.phone}
                      onChange={(e) => update("phone", toMobile(e.target.value))}
                      onKeyDown={mobileKeys(form.phone)}
                      placeholder="10-digit number"
                      autoComplete="tel"
                      aria-required="true"
                      {...invalid("phone")}
                    />
                  </Field>
                  <Field id={id("city")} label="City">
                    <input
                      id={id("city")}
                      className={fieldClass}
                      value={form.city}
                      onChange={(e) => update("city", e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                      onKeyDown={allowOnly(NAME_CHARS)}
                      placeholder="e.g. Mumbai"
                      autoComplete="address-level2"
                      aria-required="true"
                      {...invalid("city")}
                    />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    id={id("currentJobTitle")}
                    label="Current job title"
                    optional
                    className="sm:col-span-2"
                  >
                    <input
                      id={id("currentJobTitle")}
                      className={fieldClass}
                      value={form.currentJobTitle}
                      onChange={(e) =>
                        update("currentJobTitle", e.target.value.replace(/[^a-zA-Z\s.,/&-]/g, ""))
                      }
                      onKeyDown={allowOnly(/[a-zA-Z\s.,/&-]/)}
                      placeholder="e.g. Relationship manager"
                      autoComplete="organization-title"
                    />
                  </Field>
                  <Field id={id("totalExperience")} label="Total experience, in years">
                    <input
                      id={id("totalExperience")}
                      inputMode="decimal"
                      className={fieldClass}
                      value={form.totalExperience}
                      onChange={(e) => update("totalExperience", limitDecimal(e.target.value, 1, 99.9, "99"))}
                      onKeyDown={decimalOnly(form.totalExperience)}
                      placeholder="e.g. 6"
                      aria-required="true"
                      {...invalid("totalExperience")}
                    />
                  </Field>
                  <Field id={id("noticePeriod")} label="Notice period">
                    <div className="relative">
                      <select
                        id={id("noticePeriod")}
                        className={cn(fieldClass, "cursor-pointer appearance-none !bg-none pr-11")}
                        value={form.noticePeriod}
                        onChange={(e) => update("noticePeriod", e.target.value)}
                      >
                        {NOTICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-grey-500"
                      />
                    </div>
                  </Field>
                  <Field id={id("currentCtc")} label="Current CTC, in lakh a year" optional>
                    <input
                      id={id("currentCtc")}
                      inputMode="decimal"
                      className={fieldClass}
                      value={form.currentCtc}
                      onChange={(e) => update("currentCtc", limitDecimal(e.target.value, 2, 99.99, "99.99"))}
                      onKeyDown={decimalOnly(form.currentCtc)}
                      placeholder="e.g. 8.5"
                    />
                  </Field>
                  <Field id={id("expectedCtc")} label="Expected CTC, in lakh a year">
                    <input
                      id={id("expectedCtc")}
                      inputMode="decimal"
                      className={fieldClass}
                      value={form.expectedCtc}
                      onChange={(e) => update("expectedCtc", limitDecimal(e.target.value, 2, 99.99, "99.99"))}
                      onKeyDown={decimalOnly(form.expectedCtc)}
                      placeholder="e.g. 10"
                      aria-required="true"
                      {...invalid("expectedCtc")}
                    />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <FilePicker
                    id={id("cv")}
                    label="CV"
                    file={cvFile}
                    invalid={error?.field === "cv"}
                    errorId={errorId}
                    onChange={(file) => {
                      setCvFile(file);
                      setError(null);
                    }}
                  />
                  <FilePicker
                    id={id("coverLetter")}
                    label="Cover letter"
                    optional
                    file={coverLetterFile}
                    invalid={error?.field === "coverLetter"}
                    errorId={errorId}
                    onChange={(file) => {
                      setCoverLetterFile(file);
                      setError(null);
                    }}
                  />
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold text-ink">Before you submit</h3>
                    <ul className="mt-3 flex flex-col gap-2">
                      {BEFORE_YOU_SUBMIT.map((line) => (
                        <li key={line} className="flex items-center gap-3 text-sm text-grey-600">
                          <i
                            aria-hidden="true"
                            className="block h-3 w-1.5 shrink-0 -rotate-[38deg] rounded-full bg-sprout"
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
              {error ? <FormError key={error.attempt} id={errorId} message={error.message} /> : null}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-grey-500">
                  Step {step + 1} of {STEPS.length}
                </p>
                <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      data-ph-event="Back"
                      className="btn btn-secondary btn-md"
                    >
                      Back
                    </button>
                  ) : null}
                  {step < STEPS.length - 1 ? (
                    <button type="submit" data-ph-event="Next" className="btn btn-primary btn-md">
                      Next
                    </button>
                  ) : (
                    <Button type="submit" loading={submitting} data-ph-event="Submit Application">
                      {submitting ? "Submitting…" : "Submit application"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </CareersDialog>
  );
}
