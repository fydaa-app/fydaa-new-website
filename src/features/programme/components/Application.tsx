"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  saveFyiaepStep,
  getFyiaepToken,
  getFyiaepApplication,
  mapApplicationToForm,
  inferResumeStepFromStatus,
  isFyiaepSessionExpiredError,
  isFyiaepPaymentCompleted,
  isFyiaepCancelled,
  isFyiaepPaymentFailed,
  isFyiaepAwaitingPayment,
  isFyiaepAlreadyPaidError,
  isCoursePaymentCaptureSuccess,
  shouldSkipFyiaepSubmit,
  submitFyiaepApplication,
  createCoursePayment,
  openFyiaepCourseCheckout,
  FYIAEP_SESSION_EXPIRED,
  FYIAEP_PAYMENT_DISMISSED,
} from "../api";
import { getProgrammeOption } from "../data";
import {
  asStr,
  clearPersistedProgramme,
  firstNameFromForm,
  isNismCertifiedForOnField,
  validateStep,
  type CheckSetter,
  type ChipPicker,
  type ErrorsState,
  type FieldSetter,
  type FileAdder,
  type FileRemover,
  type FormState,
  type UploadsState,
} from "../validation";
import { BackButton, FlowShell, Toast } from "./flow";
import { getSteps } from "./steps";

function PaymentScreen({
  name,
  applicationNo,
  feeLabel = "₹35,000",
  failed,
  paying,
  toast,
  onPay,
  onBack,
}: {
  name: string;
  applicationNo: string;
  feeLabel?: string;
  failed: boolean;
  paying: boolean;
  toast: string;
  onPay: () => void;
  onBack: () => void;
}) {
  return (
    <FlowShell>
      <h1 className="text-heading text-ink">{failed ? "Payment unsuccessful" : "Complete your payment"}</h1>
      <p className="mt-3 max-w-[48ch] text-lead text-grey-600">
        {failed
          ? `The previous payment attempt did not go through${name ? `, ${name}` : ""}. You can try again to complete the FYIAEP programme fee.`
          : `Your application has been submitted${name ? `, ${name}` : ""}. Pay the programme fee to confirm your seat.`}
      </p>

      <div className="mt-8 border-t border-line pt-6">
        {applicationNo && <p className="text-sm font-medium text-grey-500">Application {applicationNo}</p>}
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="figure text-figure text-ink">{feeLabel}</span>
          <span className="text-base text-grey-500">+ applicable taxes</span>
        </p>
        <p className="mt-3 text-sm text-grey-500">Please keep this page open until payment is confirmed.</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onPay}
          disabled={paying}
          aria-busy={paying || undefined}
          data-ph-event={failed ? "Retry Payment" : "Pay Programme Fee"}
          className="btn btn-primary btn-lg"
        >
          {paying ? "Opening payment…" : failed ? "Retry payment" : "Pay programme fee"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          data-ph-event="Back to programme page"
          className="btn btn-secondary btn-lg"
        >
          Back to programme page
        </button>
      </div>
      <Toast message={toast} />
    </FlowShell>
  );
}

function CancelledScreen({ onBack }: { onBack: () => void }) {
  return (
    <FlowShell>
      <h1 className="text-heading text-ink">Application cancelled</h1>
      <p className="mt-3 max-w-[48ch] text-lead text-grey-600">
        This application cannot be paid. Please contact admissions if you need help.
      </p>
      <button type="button" onClick={onBack} className="btn btn-primary btn-lg mt-8 self-start">
        Back to programme page
      </button>
    </FlowShell>
  );
}

function PaymentSuccess({ name, applicationNo, onBack }: { name: string; applicationNo: string; onBack: () => void }) {
  return (
    <FlowShell>
      <div role="status" className="flex flex-col items-start">
        <svg className="t-check size-14" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="26" className="t-check-ring" />
          <path d="M17 29.5l7 7 15-16" className="t-check-path" />
        </svg>
        <h1 className="mt-6 text-heading text-ink">Payment successful</h1>
        <p className="mt-3 max-w-[52ch] text-lead text-grey-600">
          Thank you{name ? `, ${name}` : ""}. Your FYIAEP programme fee payment has been received
          {applicationNo ? ` for ${applicationNo}` : ""}.
          Our admissions team will review your application and reach out within 3 working days.
        </p>
      </div>
      <button type="button" onClick={onBack} className="btn btn-primary btn-lg mt-8 self-start">
        Back to programme page
      </button>
    </FlowShell>
  );
}

/** The application: seven saved steps, then payment. */
export function FormPage({
  onBack,
  verifiedMobile = "",
  onSessionExpired,
}: {
  onBack: () => void;
  verifiedMobile?: string;
  onSessionExpired?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [form, setForm] = useState<FormState>(() =>
    verifiedMobile ? { whatsapp: verifiedMobile, mobile: verifiedMobile } : {}
  );
  const [uploads, setUploads] = useState<UploadsState>({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [applicationCancelled, setApplicationCancelled] = useState(false);
  const [applicationNo, setApplicationNo] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState<ErrorsState>({});
  const [saving, setSaving] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const app = await getFyiaepApplication();
        if (cancelled) return;
        const mapped = mapApplicationToForm(app, verifiedMobile);
        // On OTP re-login: never restore a prior programme choice — user must select again
        clearPersistedProgramme();
        mapped.selectedProgramme = "";
        setForm((prev) => ({ ...prev, ...mapped }));
        const status = asStr(app?.applicationStatus);
        setApplicationStatus(status);
        if (app?.applicationNo) setApplicationNo(asStr(app.applicationNo));
        if (isFyiaepPaymentCompleted(status)) {
          setPaymentCompleted(true);
          return;
        }
        if (isFyiaepCancelled(status)) {
          setApplicationCancelled(true);
          return;
        }

        const resume = inferResumeStepFromStatus(app?.applicationStatus, mapped);
        const declarationsDone = !!(mapped.allAnnex_agree || mapped.esign_name);
        // Unpaid users who finished declarations (or already submitted/pending pay)
        // land on Choose Programme so they can pick 2 or 4 months again
        const landOnProgramme =
          isFyiaepAwaitingPayment(status) ||
          resume >= 6 ||
          (declarationsDone && resume >= 5);

        if (landOnProgramme) {
          setAwaitingPayment(false);
          setStep(6);
          setMaxReachedStep(6);
          return;
        }

        setStep(resume);
        setMaxReachedStep(resume);
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) setLoadingApp(false);
      }
    })();
    return () => {
      cancelled = true;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [verifiedMobile]);

  const set: FieldSetter = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };
  const pick: ChipPicker = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };
  const chk: CheckSetter = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };

  const addFile: FileAdder = (name, fileList) => {
    setUploads((p) => ({ ...p, [name]: [...(p[name] || []), ...Array.from(fileList)] }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };
  const rmFile: FileRemover = (name, i) => {
    setUploads((p) => {
      const arr = [...(p[name] || [])];
      arr.splice(i, 1);
      return { ...p, [name]: arr };
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 2800);
  };

  const steps = getSteps(form, set, pick, uploads, addFile, rmFile, chk, errors);
  const s = steps[Math.min(step, steps.length - 1)];
  if (!s) return null;
  const isLast = step === steps.length - 1;
  const proceedDisabled =
    saving ||
    (isLast &&
      asStr(form.selectedProgramme) === "onfield" &&
      !isNismCertifiedForOnField(form, uploads));

  const handleApiError = (e: unknown) => {
    if (isFyiaepSessionExpiredError(e) || (e instanceof Error && e.message === FYIAEP_SESSION_EXPIRED)) {
      showToast("Session expired. Please verify your mobile again.");
      setTimeout(() => onSessionExpired?.(), 600);
      return;
    }
    showToast(e instanceof Error ? e.message : "Failed to save. Please try again.");
  };

  const persistStep = async (stepIndex: number) => {
    if (!getFyiaepToken()) {
      throw new Error(FYIAEP_SESSION_EXPIRED);
    }
    await saveFyiaepStep(stepIndex, form, uploads);
  };

  const applyServerStatus = (app: Record<string, unknown> | null) => {
    const status = asStr(app?.applicationStatus);
    const appNo = asStr(app?.applicationNo);
    if (status) setApplicationStatus(status);
    if (appNo) setApplicationNo(appNo);

    if (isFyiaepPaymentCompleted(status)) {
      setPaymentCompleted(true);
      setAwaitingPayment(false);
      setApplicationCancelled(false);
      return "paid" as const;
    }
    if (isFyiaepCancelled(status)) {
      setApplicationCancelled(true);
      setAwaitingPayment(false);
      setPaymentCompleted(false);
      return "cancelled" as const;
    }
    if (isFyiaepAwaitingPayment(status)) {
      setAwaitingPayment(true);
      setPaymentCompleted(false);
      setApplicationCancelled(false);
      return "pay" as const;
    }
    return "form" as const;
  };

  const syncFromServer = async () => {
    const app = await getFyiaepApplication();
    return applyServerStatus(app);
  };

  const markPaymentComplete = (status?: string, appNo?: string) => {
    if (status) setApplicationStatus(status);
    if (appNo) setApplicationNo(appNo);
    setPaymentCompleted(true);
    setAwaitingPayment(false);
    setApplicationCancelled(false);
    window.scrollTo(0, 0);
  };

  const submitApplication = async () => {
    await persistStep(step);
    if (!shouldSkipFyiaepSubmit(applicationStatus)) {
      const submitResult = await submitFyiaepApplication();
      const submitData =
        submitResult.data && typeof submitResult.data === "object"
          ? (submitResult.data as Record<string, unknown>)
          : submitResult;
      const nextStatus = asStr(submitData.applicationStatus) || "payment_pending";
      const appNo = asStr(submitData.applicationNo);
      setApplicationStatus(nextStatus);
      if (appNo) setApplicationNo(appNo);
    }
    setAwaitingPayment(true);
    window.scrollTo(0, 0);
  };

  const startCheckout = async () => {
    const synced = await syncFromServer();
    if (synced === "paid" || synced === "cancelled") return;

    // 4-month: unchanged create payload; 2-month: courseType ON_FIELD_TRAINING
    const order = await createCoursePayment(
      asStr(form.selectedProgramme) === "onfield"
        ? { courseType: "ON_FIELD_TRAINING" }
        : undefined,
    );
    if (order.applicationNo) setApplicationNo(order.applicationNo);
    if (order.applicationStatus) setApplicationStatus(order.applicationStatus);

    const captureResult = await openFyiaepCourseCheckout(order);
    const captureStatus = asStr(captureResult.applicationStatus);
    const captureAppNo = asStr(captureResult.applicationNo);

    try {
      const afterCapture = await syncFromServer();
      if (afterCapture === "paid") return;
    } catch {
      // GET is best-effort; capture success is enough to show paid
    }
    if (isCoursePaymentCaptureSuccess(captureResult) || isFyiaepPaymentCompleted(captureStatus)) {
      markPaymentComplete(captureStatus || "payment_completed", captureAppNo);
    }
  };

  const goNext = async () => {
    const result = validateStep(step, form, uploads);
    if (result) {
      const map: ErrorsState = {};
      result.fields.forEach((f) => { map[f] = true; });
      setErrors(map);
      showToast(result.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (!isLast) {
        await persistStep(step);
        showToast("Saved successfully");
        const next = step + 1;
        setStep(next);
        setMaxReachedStep((m) => Math.max(m, next));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        await submitApplication();
      }
    } catch (e: unknown) {
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  const saveProgress = async () => {
    // Allow draft save without completing required fields
    setErrors({});
    setSaving(true);
    try {
      await persistStep(step);
      setMaxReachedStep((m) => Math.max(m, step));
      showToast("Progress saved");
    } catch (e: unknown) {
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  const goToStep = (i: number) => {
    if (i < 0 || i >= steps.length) return;
    if (i > maxReachedStep) {
      showToast("Please complete the current section before continuing.");
      return;
    }
    setErrors({});
    setStep(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = async () => {
    setSaving(true);
    try {
      await startCheckout();
    } catch (e: unknown) {
      if (isFyiaepAlreadyPaidError(e)) {
        try {
          const synced = await syncFromServer();
          if (synced !== "paid") markPaymentComplete("payment_completed");
        } catch {
          markPaymentComplete("payment_completed");
        }
        return;
      }
      if (e instanceof Error && e.message === FYIAEP_PAYMENT_DISMISSED) {
        try {
          const synced = await syncFromServer();
          if (synced === "paid") return;
        } catch (syncErr) {
          handleApiError(syncErr);
          return;
        }
        showToast("Payment cancelled. You can try again when ready.");
        return;
      }
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  if (paymentCompleted) {
    return <PaymentSuccess name={firstNameFromForm(form)} applicationNo={applicationNo} onBack={onBack} />;
  }

  if (applicationCancelled) {
    return <CancelledScreen onBack={onBack} />;
  }

  if (awaitingPayment) {
    const programme = getProgrammeOption(form.selectedProgramme);
    return (
      <PaymentScreen
        name={firstNameFromForm(form)}
        applicationNo={applicationNo}
        feeLabel={programme?.feeLabel || "₹35,000"}
        failed={isFyiaepPaymentFailed(applicationStatus)}
        paying={saving}
        toast={toast}
        onPay={handlePay}
        onBack={onBack}
      />
    );
  }

  if (loadingApp) {
    return (
      <FlowShell size="prose">
        <p role="status" className="text-base text-grey-500">
          Loading your application…
        </p>
      </FlowShell>
    );
  }

  return (
    <FlowShell size="prose">
      <BackButton onClick={onBack}>Back to programme page</BackButton>
      <h1 className="mt-4 text-heading text-ink">FYIAEP application</h1>

      {/* Step bar: every step you've reached can be revisited */}
      <nav aria-label="Application steps" className="mt-8">
        <p className="mb-3 text-sm text-grey-500">
          Step {step + 1} of {steps.length}
        </p>
        <ol className="grid grid-cols-7 gap-1.5">
          {steps.map((st, i) => {
            const reachable = i <= maxReachedStep;
            return (
              <li key={i} className="min-w-0">
                <button
                  type="button"
                  onClick={() => goToStep(i)}
                  aria-current={i === step ? "step" : undefined}
                  aria-disabled={!reachable || undefined}
                  className={cn(
                    "flex min-h-11 w-full flex-col justify-start gap-1.5 rounded-sm pt-1 text-left",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade",
                    reachable ? "cursor-pointer" : "cursor-not-allowed",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-1.5 w-full rounded-full transition-colors duration-fast",
                      i <= step ? "bg-jade" : "bg-line",
                    )}
                  />
                  <span
                    className={cn(
                      "block truncate text-xs",
                      i === step ? "font-semibold text-ink" : i < step ? "font-medium text-grey-600" : "font-medium text-grey-500",
                    )}
                  >
                    {st.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Section header */}
      <div className="mb-8 mt-10">
        <h2 className="text-title text-ink">{s.title}</h2>
        <p className="mt-1 text-sm text-grey-500">{s.sub}</p>
      </div>

      {/* Fields */}
      {s.render()}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={step === 0 || saving}
          onClick={() => goToStep(step - 1)}
          data-ph-event="Back"
          className="btn btn-ghost btn-md -ml-3 self-start px-3 sm:self-auto"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveProgress}
            disabled={saving}
            data-ph-event="Save progress"
            className="btn btn-secondary btn-md flex-1 sm:flex-none"
          >
            {saving ? "Saving..." : "Save progress"}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={proceedDisabled}
            aria-busy={saving || undefined}
            data-ph-event={isLast ? "Proceed to Pay" : "Save & Continue"}
            className="btn btn-primary btn-md flex-1 sm:flex-none"
          >
            {saving ? (isLast ? "Processing..." : "Saving...") : isLast ? "Proceed to pay" : "Save and continue"}
          </button>
        </div>
      </div>

      <Toast message={toast} />
    </FlowShell>
  );
}
