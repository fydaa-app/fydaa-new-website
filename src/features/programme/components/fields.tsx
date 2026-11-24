"use client";

import { useId, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import {
  asStr,
  type CheckSetter,
  type ChipPicker,
  type FieldSetter,
  type FileAdder,
  type FileRemover,
} from "../validation";
import { Stroke } from "./stroke";

/*
 * Form controls for the FYIAEP application. Same treatment as the site's other forms: sentence-case
 * labels above 48px mist fields with 16px text (no zoom on iOS), jade focus ring, danger border
 * when invalid.
 */

export const labelClass = "text-sm font-semibold text-ink";

const controlClass =
  "w-full rounded-card border px-4 text-base text-ink outline-none transition-colors duration-quick " +
  "placeholder:text-grey-500 focus:border-jade focus:bg-white focus:ring-2 focus:ring-jade/15";

function controlState(error: boolean) {
  return error ? "border-danger bg-white" : "border-line bg-mist";
}

export function RequiredMark() {
  return (
    <span className="ml-0.5 text-danger" aria-hidden="true">
      *
    </span>
  );
}

export function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error = false,
  maxLength,
  inputMode,
  transform,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: unknown;
  onChange: FieldSetter;
  required?: boolean;
  error?: boolean;
  maxLength?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  transform?: (raw: string) => string;
}) {
  const id = useId();
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <RequiredMark />}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={asStr(value)}
        maxLength={maxLength}
        inputMode={inputMode}
        autoCapitalize={transform ? "characters" : undefined}
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(name, transform ? transform(raw) : raw);
        }}
        className={cn(controlClass, "h-12 min-w-0", controlState(error))}
      />
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  options: string[];
  value: unknown;
  onChange: FieldSetter;
  required?: boolean;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <RequiredMark />}
      </label>
      <select
        id={id}
        name={name}
        value={asStr(value)}
        onChange={(e) => onChange(name, e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        className={cn(controlClass, "h-12 cursor-pointer", controlState(error))}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/** A single choice from a few short options, as toggle buttons. */
export function Chips({
  label,
  name,
  options,
  value,
  onPick,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  options: string[];
  value: unknown;
  onPick: ChipPicker;
  required?: boolean;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-2">
      <p id={id} className={labelClass}>
        {label}
        {required && <RequiredMark />}
        {error && <span className="sr-only"> (required)</span>}
      </p>
      <div
        role="group"
        aria-labelledby={id}
        className={cn("flex flex-wrap gap-2", error && "rounded-card p-1.5 ring-1 ring-danger")}
      >
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(name, o)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-left text-sm font-semibold transition-colors duration-quick",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade",
                on
                  ? "border-jade bg-jade text-white"
                  : "border-line bg-white text-grey-600 hover:border-grey-300 hover:text-ink",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TextArea({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  value: unknown;
  onChange: FieldSetter;
  required?: boolean;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <RequiredMark />}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={asStr(value)}
        onChange={(e) => onChange(name, e.target.value)}
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        className={cn(controlClass, "min-h-24 resize-y py-3 leading-relaxed", controlState(error))}
      />
    </div>
  );
}

export function Upload({
  label,
  name,
  files,
  onAdd,
  onRemove,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  files: File[] | undefined;
  onAdd: FileAdder;
  onRemove: FileRemover;
  required?: boolean;
  error?: boolean;
}) {
  const labelId = useId();
  const hintId = useId();
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-1.5">
      <p id={labelId} className={labelClass}>
        {label}
        {required && <RequiredMark />}
      </p>
      <label
        htmlFor={`upload-${name}`}
        className={cn(
          "flex min-h-16 cursor-pointer flex-col justify-center gap-0.5 rounded-card border border-dashed px-4 py-3 transition-colors duration-quick",
          "focus-within:border-jade focus-within:ring-2 focus-within:ring-jade/20",
          error ? "border-danger bg-white" : "border-grey-300 bg-mist hover:border-jade hover:bg-jade-tint",
        )}
      >
        <input
          id={`upload-${name}`}
          type="file"
          multiple
          className="sr-only"
          aria-labelledby={labelId}
          aria-describedby={hintId}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) onAdd(name, e.target.files);
          }}
        />
        <span className="text-sm font-semibold text-emerald">Choose files</span>
        <span id={hintId} className="text-sm text-grey-500">
          PDF, JPG, PNG up to 5 MB
        </span>
      </label>
      {(files || []).length > 0 && (
        <ul className="mt-1 flex flex-col gap-1.5">
          {(files || []).map((f, i) => (
            <li
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-btn bg-mist py-1 pl-3 pr-1 text-sm text-grey-600"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-grey-500">
                <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => onRemove(name, i)}
                aria-label={`Remove ${f.name}`}
                data-ph-event="Remove file"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-btn text-grey-500 transition-colors duration-quick hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-jade"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Checkbox({
  name,
  label,
  checked,
  onCheck,
}: {
  name: string;
  label: string;
  checked: unknown;
  onCheck: CheckSetter;
}) {
  return (
    <label className="mb-3 flex min-h-11 cursor-pointer items-start gap-3 py-2">
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        onChange={(e) => onCheck(name, e.target.checked)}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-jade"
      />
      <span className="text-base leading-relaxed text-grey-600">{label}</span>
    </label>
  );
}

/** The typed e-signature: the candidate's full name, set in jade like ink on a form. */
export function SignatureField({
  name,
  value,
  onChange,
  error = false,
}: {
  name: string;
  value: unknown;
  onChange: FieldSetter;
  error?: boolean;
}) {
  const id = useId();
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        Signature (type your full name)
        <RequiredMark />
      </label>
      <input
        id={id}
        name={name}
        type="text"
        value={asStr(value)}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder="Type full name as signature"
        aria-required
        aria-invalid={error || undefined}
        className={cn(controlClass, "h-14 min-w-0 text-center font-semibold text-jade", controlState(error))}
      />
    </div>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 mt-10 border-b border-line pb-2 text-base font-semibold text-ink [font-stretch:104%] first:mt-0">
      {children}
    </h3>
  );
}

/** One declaration or annexure: its text verbatim, then what the candidate agrees to. */
export function AnnexureBlock({ title, body, items }: { title: string; body: ReactNode; items: string[] }) {
  return (
    <div className="mb-4 rounded-card bg-mist p-5 sm:p-6">
      <h3 className="text-base font-semibold text-ink [font-stretch:104%]">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-grey-600">{body}</div>
      {items.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-grey-600">
              <Stroke className="h-3 w-1" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
