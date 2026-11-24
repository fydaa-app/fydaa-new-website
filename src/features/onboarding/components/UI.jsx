"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { CodeInput } from "@/components/ui/code-input";
import { captureButtonClick, labelFromChildren } from "@/lib/posthog";

/**
 * Primitives for the auth and KYC screens ("Light and precise"). Tokens only: colours,
 * radii and motion come from tailwind.config.ts and globals.css. Every control is at least
 * 44px tall, text inputs are 16px so phones don't zoom, labels are visible and errors sit
 * next to the field they belong to.
 */

// ── Icons ──────────────────────────────────────────────────────────
export function ChevronLeftIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
export function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/** Third-party marks keep their own colours. */
export function GoogleIcon({ className = "size-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AppleIcon({ className = "size-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/** The logo's motif: one short round-capped stroke at the logo's angle. */
export function Stroke({ className = "bg-sprout" }) {
  return (
    <i
      aria-hidden="true"
      className={`block h-3.5 w-1.5 shrink-0 -rotate-[38deg] rounded-full ${className}`}
    />
  );
}

// ── Text ───────────────────────────────────────────────────────────

/**
 * The screen's one h1. `page` for the login and signup entry screens; `step` for the
 * focused screens that follow (PIN, risk profile, KYC).
 */
export function PageHeading({ children, size = "page" }) {
  const sizes = {
    page: "text-heading",
    step: "text-2xl font-semibold tracking-tight stretch-semi sm:text-3xl",
  };
  return <h1 className={`${sizes[size] || sizes.page} text-ink`}>{children}</h1>;
}

export function PageSub({ children }) {
  return <p className="mt-2 max-w-[46ch] text-base leading-relaxed text-grey-600">{children}</p>;
}

/** A button that reads as a text link (emerald, underline drawn on hover). */
export function LinkText({ children, onClick, className = "", ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`link inline-flex min-h-11 items-center self-start rounded-sm text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade disabled:cursor-not-allowed disabled:font-medium disabled:text-grey-500 disabled:no-underline ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** "Back" for multi-step screens: a 44px ghost button, chevron icon, no arrow glyph. */
export function BackButton({ onClick, children = "Back", label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn btn-ghost btn-md -ml-3 self-start px-3"
    >
      <ChevronLeftIcon className="size-4" />
      {children}
    </button>
  );
}

// ── Buttons ────────────────────────────────────────────────────────

function analyticsLabel(children, phEvent, dataPhEvent) {
  return phEvent || dataPhEvent || labelFromChildren(children).replace(/\s+/g, " ").trim();
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
    />
  );
}

/**
 * Primary action, full width. `phEvent` names the PostHog event (kept stable even when the
 * visible label changes); `loading` shows a spinner and the busy label.
 */
export function Button({ children, onClick, className = "", phEvent, loading = false, ...rest }) {
  const { ["data-ph-event"]: dataPhEvent, ...buttonRest } = rest;
  const label = analyticsLabel(children, phEvent, dataPhEvent);
  return (
    <button
      type="button"
      {...buttonRest}
      aria-busy={loading || undefined}
      data-ph-event={label || undefined}
      onClick={(e) => {
        captureButtonClick(label || "Button", { button_variant: "primary" });
        onClick?.(e);
      }}
      className={`btn btn-primary btn-lg w-full ${className}`}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, className = "", phEvent, loading = false, ...rest }) {
  const { ["data-ph-event"]: dataPhEvent, ...buttonRest } = rest;
  const label = analyticsLabel(children, phEvent, dataPhEvent);
  return (
    <button
      type="button"
      {...buttonRest}
      aria-busy={loading || undefined}
      data-ph-event={label || undefined}
      onClick={(e) => {
        captureButtonClick(label || "Button", { button_variant: "outline" });
        onClick?.(e);
      }}
      className={`btn btn-secondary btn-lg w-full ${className}`}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

// ── Feedback ───────────────────────────────────────────────────────

/**
 * An error that isn't about one field (server and network errors). `tick` changes on every
 * new error, so the same message shakes again when it comes back (transitions.dev #12).
 */
export function ErrorNote({ children, tick }) {
  if (!children) return null;
  return (
    <p
      key={tick}
      role="alert"
      className="t-shake rounded-card bg-red-50 px-4 py-3 text-sm leading-relaxed text-danger"
    >
      {children}
    </p>
  );
}

/** A moment of success: the ring draws, then the tick (transitions.dev #10). */
export function SuccessState({ title, children, titleAs: Title = "p" }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4 py-2">
      <SuccessCheck />
      <div>
        <Title className="text-title text-ink">{title}</Title>
        {children ? <p className="mt-1 text-base leading-relaxed text-grey-600">{children}</p> : null}
      </div>
    </div>
  );
}

export function SuccessCheck({ className = "size-14" }) {
  return (
    <svg className={`t-check ${className}`} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="26" className="t-check-ring" />
      <path d="M17 29.5l7 7 15-16" className="t-check-path" />
    </svg>
  );
}

// ── Form controls ──────────────────────────────────────────────────

const labelClass = "text-sm font-semibold text-ink [font-stretch:104%]";
const controlClass =
  "h-12 w-full rounded-card border border-grey-300 bg-paper px-4 text-base text-ink outline-none " +
  "transition-colors duration-quick placeholder:text-grey-500 focus:border-jade focus:ring-2 focus:ring-jade/20 " +
  "aria-[invalid=true]:border-danger disabled:bg-grey-100";

export function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
    </label>
  );
}

function FieldMessages({ id, hint, error, errorKey }) {
  return (
    <>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm leading-relaxed text-grey-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          key={errorKey}
          id={`${id}-error`}
          role="alert"
          className="t-shake text-sm leading-relaxed text-danger"
        >
          {error}
        </p>
      ) : null}
    </>
  );
}

function describedBy(id, hint, error) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

/**
 * Labelled text input. `error` marks it invalid, is announced and sits right under it;
 * `errorKey` replays the shake when the same error comes back.
 */
export function FieldInput({ label, prefix, hint, error, errorKey, className = "", id, ...rest }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-grey-600">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, hint, error)}
          className={`${controlClass} ${prefix ? "pl-14" : ""} ${className}`}
          {...rest}
        />
      </div>
      <FieldMessages id={inputId} hint={hint} error={error} errorKey={errorKey} />
    </div>
  );
}

export function FieldSelect({ label, children, hint, error, errorKey, id, ...rest }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(selectId, hint, error)}
        className={`${controlClass} pr-10`}
        {...rest}
      >
        {children}
      </select>
      <FieldMessages id={selectId} hint={hint} error={error} errorKey={errorKey} />
    </div>
  );
}

export function FieldRow({ children }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

/**
 * Restyles the shared CodeInput for these screens until it changes upstream: a sentence-case
 * label, fluid boxes that fit a 320px phone (six boxes never overflow), and danger-red errors.
 */
const codeInputClass = [
  "mb-0 flex flex-col gap-1.5",
  "[&>label]:mb-0 [&>label]:text-sm [&>label]:normal-case [&>label]:tracking-normal [&>label]:text-ink [&>label]:[font-stretch:104%]",
  "[&>div]:flex [&>div]:w-full [&>div]:gap-2",
  "[&>div>div]:h-14 [&>div>div]:w-auto [&>div>div]:min-w-0 [&>div>div]:max-w-[3rem] [&>div>div]:flex-1 [&>div>div]:text-xl",
  "[&>p]:mt-0 [&>p]:text-danger",
].join(" ");

/**
 * Segmented OTP/PIN entry backed by the shared CodeInput: one real input, so paste and SMS
 * autofill (`autocomplete="one-time-code"`) fill every box and PINs are masked. A wrong code
 * shakes the boxes; `shakeKey` changes on every new error so it replays without remounting
 * the input (it keeps focus and the phone keyboard stays up).
 */
export function CodeInputs({
  count,
  value = "",
  onChange,
  label = "Code",
  labelHidden = false,
  kind = "otp",
  autoFocus = false,
  error,
  shakeKey,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!error) return;
    const row = ref.current?.querySelector(":scope > div > div");
    if (!row) return;
    row.classList.remove("t-shake");
    void row.offsetWidth;
    row.classList.add("t-shake");
  }, [error, shakeKey]);

  return (
    <div ref={ref}>
      <CodeInput
        length={count}
        value={value}
        onChange={(next) => onChange?.(next)}
        label={label}
        labelHidden={labelHidden}
        kind={kind}
        autoFocus={autoFocus}
        error={error}
        className={codeInputClass}
      />
    </div>
  );
}

/** Single choice as a large, tappable option (risk questions). */
export function OptionButton({ selected, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={Boolean(selected)}
      className={`flex min-h-14 w-full items-center gap-3 rounded-card border px-4 py-3 text-left text-base font-medium transition-colors duration-quick focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade disabled:cursor-not-allowed ${
        selected
          ? "border-jade bg-jade-tint text-jade"
          : "border-line bg-paper text-ink hover:border-grey-300 hover:bg-mist"
      }`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-quick ${
          selected ? "border-jade bg-jade text-white" : "border-grey-300 bg-paper"
        }`}
      >
        {selected ? <CheckIcon className="size-3" /> : null}
      </span>
      <span className="min-w-0">{children}</span>
    </button>
  );
}

export function Checkbox({ checked, onChange, children }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={Boolean(checked)}
        onChange={() => onChange?.()}
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-quick peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade ${
          checked ? "border-jade bg-jade text-white" : "border-grey-300 bg-paper"
        }`}
      >
        {checked && <CheckIcon className="size-3" />}
      </span>
      <span className="text-sm leading-relaxed text-grey-600">{children}</span>
    </label>
  );
}

/** "or" between two ways of doing the same thing. */
export function OrDivider() {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label="or">
      <span className="h-px flex-1 bg-line" />
      <span aria-hidden="true" className="text-sm text-grey-500">
        or
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/**
 * The risk score: a round-capped ring that draws once to the score (transitions.dev
 * "donut chart"); reduced motion shows the final ring.
 */
export function ScoreRing({ score = 75, max = 100 }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const target = c - (Math.max(0, Math.min(score, max)) / max) * c;
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className="relative size-44">
      <svg viewBox="0 0 160 160" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r={r} fill="none" strokeWidth="10" className="stroke-line" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={drawn ? target : c}
          className="stroke-sprout transition-[stroke-dashoffset] ease-smooth-out [transition-duration:calc(var(--duration-very-slow)*2)] motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-figure text-ink">{score}</span>
        <span className="mt-1 text-sm text-grey-500">out of {max}</span>
      </div>
    </div>
  );
}
