"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { FileText, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for the careers dialogs: focus moves into the panel, Tab stays inside it, Escape
 * closes, the page behind stops scrolling, and focus returns to the control that opened it.
 */
function useModal(panelRef: RefObject<HTMLDivElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      const panel = panelRef.current;
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [panelRef]);
}

/** A bottom sheet on phones and a centred dialog from `sm` up (transitions.dev modal open). */
export function CareersDialog({
  labelledBy,
  onClose,
  children,
}: {
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModal(panelRef, onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog"
        onClick={onClose}
        className="t-scrim absolute inset-0 cursor-default bg-ink/50"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="t-dialog relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-4xl bg-white text-ink shadow-window outline-none sm:max-h-[min(90dvh,54rem)] sm:max-w-2xl sm:rounded-4xl"
      >
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-btn text-grey-600 transition-colors duration-quick hover:bg-mist hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade",
        className,
      )}
    >
      <X className="size-5" aria-hidden="true" />
    </button>
  );
}

/** Title block of a dialog: an optional context line, the title, a short description and the close button. */
export function DialogHeader({
  titleId,
  context,
  title,
  description,
  onClose,
  children,
}: {
  titleId: string;
  context?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="shrink-0 border-b border-line px-5 pb-5 pt-5 sm:px-8 sm:pt-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {context ? <p className="text-sm font-semibold text-emerald">{context}</p> : null}
          {/* Plain class string: tailwind-merge would read text-title as a colour and drop it. */}
          <h2 id={titleId} className={context ? "mt-1 text-title text-ink" : "text-title text-ink"}>
            {title}
          </h2>
          {description ? <p className="mt-1.5 text-sm leading-relaxed text-grey-600">{description}</p> : null}
        </div>
        <CloseButton onClick={onClose} className="-mr-2 -mt-2" />
      </div>
      {children}
    </div>
  );
}

/** Inputs match the site's forms: 48px tall, 16px text (no zoom on iOS), mist fill that turns white on focus. */
export const fieldClass =
  "h-12 w-full rounded-card border border-line bg-mist px-4 text-base text-ink outline-none transition-colors duration-quick placeholder:text-grey-500 focus:border-jade focus:bg-white focus:ring-2 focus:ring-jade/15 aria-[invalid=true]:border-danger aria-[invalid=true]:bg-white disabled:opacity-60";

export function Field({
  id,
  label,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="font-normal text-grey-500"> (optional)</span> : null}
      </label>
      {children}
    </div>
  );
}

/** Blocks typed characters that `pattern` does not allow; shortcuts, navigation and paste still work. */
export function allowOnly(pattern: RegExp) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
    if (!pattern.test(event.key)) event.preventDefault();
  };
}

/** Digits and a single decimal point. */
export function decimalOnly(value: string) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
    if (!/[\d.]/.test(event.key) || (event.key === "." && value.includes("."))) event.preventDefault();
  };
}

/** Ten-digit mobile number; pasted or autofilled "+91 98765 43210" keeps its last ten digits. */
export function toMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Digits only, and no more than ten unless the typed digit replaces a selection. */
export function mobileKeys(value: string) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
    const input = event.currentTarget;
    const replacesSelection = input.selectionStart !== input.selectionEnd;
    if (!/\d/.test(event.key) || (value.length >= 10 && !replacesSelection)) event.preventDefault();
  };
}

export const NAME_CHARS = /[a-zA-Z\s]/;

export const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function isDocument(name: string): boolean {
  return /\.(pdf|docx?)$/i.test(name);
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** A file field: what's needed, the chosen file once picked, and a button-styled label that opens the picker. */
export function FilePicker({
  id,
  label,
  optional,
  file,
  invalid,
  errorId,
  onChange,
}: {
  id: string;
  label: string;
  optional?: boolean;
  file: File | null;
  invalid?: boolean;
  errorId?: string;
  onChange: (file: File | null) => void;
}) {
  const hintId = `${id}-hint`;
  return (
    <div
      className={cn(
        "rounded-card border border-dashed bg-mist p-4 sm:p-5",
        invalid ? "border-danger" : "border-grey-300",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-btn border border-line bg-white text-jade"
        >
          <FileText className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-ink">
            {label}
            {optional ? <span className="font-normal text-grey-500"> (optional)</span> : null}
          </p>
          <p id={hintId} className="mt-0.5 truncate text-sm text-grey-600">
            {file ? `${file.name}, ${formatSize(file.size)}` : "PDF or DOCX, up to 5MB"}
          </p>
        </div>
      </div>
      <input
        id={id}
        type="file"
        accept={CV_ACCEPT}
        aria-label={label}
        aria-describedby={[hintId, invalid ? errorId : null].filter(Boolean).join(" ")}
        aria-invalid={invalid || undefined}
        className="peer sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <label
        htmlFor={id}
        className="btn btn-secondary btn-md mt-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade"
      >
        {file ? "Choose another file" : "Choose file"}
      </label>
    </div>
  );
}

/** The form error: says what to fix, shakes once each time it appears (give it a new `key`). */
export function FormError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="t-shake rounded-card bg-danger/5 px-3 py-2.5 text-sm text-danger">
      {message}
    </p>
  );
}
