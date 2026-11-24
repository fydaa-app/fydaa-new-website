"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
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
  fieldClass,
  isDocument,
  mobileKeys,
  toMobile,
} from "./CareersDialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FieldKey = "firstName" | "lastName" | "email" | "phone" | "cv";

/** Register a CV for future roles. Mounted fresh each time it opens, so it always starts empty. */
export default function RegisterCvModal({ open, onClose }: Props) {
  if (!open) return null;
  return <RegisterCvDialog onClose={onClose} />;
}

function RegisterCvDialog({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState<{ message: string; field: FieldKey | null; attempt: number } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const attempts = useRef(0);
  const uid = useId();
  const id = (name: FieldKey) => `${uid}-${name}`;
  const titleId = `${uid}-title`;
  const errorId = `${uid}-error`;

  const invalid = (name: FieldKey) =>
    error?.field === name ? { "aria-invalid": true as const, "aria-describedby": errorId } : {};

  const fail = (message: string, field: FieldKey | null = null) => {
    attempts.current += 1;
    setError({ message, field, attempt: attempts.current });
    if (field) document.getElementById(id(field))?.focus();
    return false;
  };

  const validate = (): boolean => {
    setError(null);
    if (!firstName.trim()) return fail("Please enter your first and last name.", "firstName");
    if (!lastName.trim()) return fail("Please enter your first and last name.", "lastName");
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return fail("Please enter a valid email address.", "email");
    }
    if (phone.replace(/\D/g, "").length !== 10)
      return fail("Please enter a valid 10-digit mobile number.", "phone");
    if (!cvFile) return fail("Please upload your CV (PDF or DOCX, max 5MB).", "cv");
    if (cvFile.size > MAX_FILE_BYTES) return fail("CV must be 5MB or smaller.", "cv");
    if (!isDocument(cvFile.name)) return fail("CV must be a PDF or DOCX file.", "cv");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("firstName", firstName.trim());
      fd.append("lastName", lastName.trim());
      fd.append("email", email.trim());
      fd.append("phone", phone.replace(/\D/g, ""));
      fd.append("resume", cvFile!);

      const res = await fetch("/api/careers/cv-register", {
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

  return (
    <CareersDialog labelledBy={titleId} onClose={onClose}>
      {success ? (
        <CareersApplySuccess titleId={titleId} title="Thanks, we've got your CV" onDone={onClose}>
          When a role that matches your profile opens, our team will get in touch.
        </CareersApplySuccess>
      ) : (
        <>
          <DialogHeader
            titleId={titleId}
            title="Register your CV"
            description="Leave your details and CV. When a role that matches your profile opens, we'll get in touch."
            onClose={onClose}
          />
          <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field id={id("firstName")} label="First name">
                  <input
                    id={id("firstName")}
                    className={fieldClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    onKeyDown={allowOnly(NAME_CHARS)}
                    autoComplete="family-name"
                    aria-required="true"
                    {...invalid("lastName")}
                  />
                </Field>
                <Field id={id("email")} label="Email">
                  <input
                    id={id("email")}
                    type="email"
                    className={fieldClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(toMobile(e.target.value))}
                    onKeyDown={mobileKeys(phone)}
                    placeholder="10-digit number"
                    autoComplete="tel"
                    aria-required="true"
                    {...invalid("phone")}
                  />
                </Field>
                <div className="sm:col-span-2">
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
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
              {error ? <FormError key={error.attempt} id={errorId} message={error.message} /> : null}
              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  data-ph-event="Cancel"
                  className="btn btn-secondary btn-md"
                >
                  Cancel
                </button>
                <Button type="submit" loading={submitting} data-ph-event="Submit">
                  {submitting ? "Submitting…" : "Register CV"}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </CareersDialog>
  );
}
