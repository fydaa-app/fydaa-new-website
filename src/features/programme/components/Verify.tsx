"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { BackButton, ErrorText, FlowShell } from "./flow";
import { labelClass } from "./fields";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function formatMobileDisplay(digits: string | number) {
  const d = String(digits || "")
    .replace(/\D/g, "")
    .slice(0, 10);
  if (d.length <= 5) return `+91 ${d}`;
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

/** Step 1 of applying: the mobile number the application is saved against. */
export function MobileVerifyPage({
  onBack,
  onSendOtp,
  initialMobile = "",
}: {
  onBack: () => void;
  onSendOtp: (mobile: string) => Promise<void>;
  initialMobile?: string;
}) {
  const [mobile, setMobile] = useState(
    String(initialMobile || "")
      .replace(/\D/g, "")
      .slice(0, 10),
  );
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setError("");
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSending(true);
    try {
      await onSendOtp(mobile);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <FlowShell>
      <BackButton onClick={onBack} />
      <h1 className="mt-6 text-heading text-ink">Verify your mobile number</h1>
      <p className="mt-3 max-w-[44ch] text-lead text-grey-600">
        We&apos;ll save your progress so you can continue later if needed.
      </p>

      <div className="mt-8 flex flex-col gap-1.5">
        <label htmlFor="fyiaep-mobile" className={labelClass}>
          Mobile number
        </label>
        <div className="flex gap-2">
          <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-card border border-line bg-white text-base font-semibold text-ink">
            +91
          </span>
          <input
            id="fyiaep-mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="10-digit mobile number"
            aria-invalid={error ? true : undefined}
            className={cn(
              "h-12 min-w-0 flex-1 rounded-card border px-4 text-base text-ink outline-none transition-colors duration-quick",
              "placeholder:text-grey-500 focus:border-jade focus:bg-white focus:ring-2 focus:ring-jade/15",
              error ? "border-danger bg-white" : "border-line bg-mist",
            )}
          />
        </div>
      </div>

      {error && (
        <ErrorText key={error} className="mt-3">
          {error}
        </ErrorText>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={sending || mobile.length !== 10}
        aria-busy={sending || undefined}
        data-ph-event="Send OTP"
        className="btn btn-primary btn-lg mt-6 w-full"
      >
        {sending ? "Sending..." : "Send OTP"}
      </button>
    </FlowShell>
  );
}

/** Step 2 of applying: the 6-digit code. Digits can be typed, pasted or autofilled from SMS. */
export function OtpVerifyPage({
  mobile,
  onBack,
  onChangeMobile,
  onVerified,
  onResend,
}: {
  mobile: string;
  onBack: () => void;
  onChangeMobile: () => void;
  onVerified: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const t = setTimeout(() => setResendLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendLeft]);

  const otpValue = otp.join("");

  const setDigit = (index: number, digit: string) => {
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    return next;
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setDigit(index, "");
      return;
    }
    if (digits.length > 1) {
      const next = [...otp];
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i++) {
        next[index + i] = digits.charAt(i);
      }
      setOtp(next);
      setError("");
      const focusAt = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputsRef.current[focusAt]?.focus();
      return;
    }
    setDigit(index, digits);
    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setVerifying(true);
    try {
      await onVerified(otpValue);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendLeft > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await onResend();
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <FlowShell>
      <BackButton onClick={onBack} />
      <h1 className="mt-6 text-heading text-ink">Enter the OTP</h1>
      <p className="mt-3 text-lead text-grey-600">We&apos;ve sent a 6-digit code to your mobile number.</p>

      <p className="mt-4 flex flex-wrap items-center gap-x-3 text-base text-ink">
        <span className="font-semibold tabular-nums">{formatMobileDisplay(mobile)}</span>
        <button
          type="button"
          onClick={onChangeMobile}
          className="link inline-flex min-h-11 items-center text-sm"
        >
          Change
        </button>
      </p>

      <div role="group" aria-label="6-digit OTP" className="mt-6 flex w-full max-w-sm gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
            aria-invalid={error ? true : undefined}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => {
              e.preventDefault();
              handleChange(i, e.clipboardData.getData("text"));
            }}
            className={cn(
              "figure h-14 min-w-0 flex-1 rounded-card border bg-white text-center text-xl font-semibold text-ink outline-none transition-colors duration-quick",
              "focus:border-jade focus:ring-2 focus:ring-jade/15",
              error ? "border-danger" : digit ? "border-jade" : "border-line",
            )}
          />
        ))}
      </div>

      {error && (
        <ErrorText key={error} className="mt-4">
          {error}
        </ErrorText>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={verifying || otpValue.length !== OTP_LENGTH}
        aria-busy={verifying || undefined}
        data-ph-event="Verify & Continue"
        className="btn btn-primary btn-lg mt-6 w-full"
      >
        {verifying ? "Verifying..." : "Verify and continue"}
      </button>

      <p className="mt-4 flex min-h-11 flex-wrap items-center gap-x-1 text-sm text-grey-600">
        Didn&apos;t receive it?{" "}
        {resendLeft > 0 ? (
          <span className="tabular-nums">Resend OTP in {resendLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            data-ph-event="Resend OTP"
            className="link inline-flex min-h-11 items-center disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </p>
    </FlowShell>
  );
}
