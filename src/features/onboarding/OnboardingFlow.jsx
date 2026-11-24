"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeRedirectPath } from "@/lib/auth/session";
import Stepper from "./components/Stepper";
import KycModal from "./components/KycModal";
import {
  PageHeading,
  PageSub,
  Button,
  OutlineButton,
  LinkText,
  BackButton,
  FieldInput,
  FieldSelect,
  FieldRow,
  CodeInputs,
  Checkbox,
  OptionButton,
  OrDivider,
  ScoreRing,
  ErrorNote,
  SuccessState,
  CheckIcon,
  GoogleIcon,
  AppleIcon,
} from "./components/UI";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { AuthLayout, FocusLayout } from "./components/AuthLayout";
import { AuthAside } from "./components/AuthAside";
import { AUTH_SUBS, AUTH_TITLES } from "./AuthFallback";
import { planFromParams } from "./lib/signupIntent";
import SignaturePad from "./components/SignaturePad";
import {
  bandFromIndicators,
  checkMobile,
  clearTokens,
  createPin as createPinApi,
  createUserRiskProfile,
  getAccessToken,
  getRiskIndicators,
  getRiskQuestionnaire,
  getUserStage,
  linkEmail,
  requestLinkEmail,
  requestOtp,
  resolvePinSetupType,
  scoreFromIndicators,
  storeTokens,
  updatePortfoliosSoft,
  verifyLinkEmail,
  verifyOtp,
  verifyPin,
} from "./lib/authApi";
import { captureEvent, toEventName } from "@/lib/posthog";
import { isValidEmail } from "./lib/emailValidation";
import {
  INCOME_OPTIONS,
  NOMINEE_RELATIONS,
  OCCUPATION_COMPLIANT,
  SOURCE_OF_WEALTH,
  createAndVerifyBankAccount,
  createInvestorProfileAndMfAccount,
  createModifyKycForm,
  fetchKycData,
  getCurrentKycForm,
  getIdentityDocument,
  getNsdlEsignStatus,
  getPublicIp,
  initiateKyc,
  isDigiLockerCallback,
  isNoKycRecord,
  isNsdlCallback,
  isPanMismatch,
  isSignupComplete,
  isTruthyFlag,
  isValidFullName,
  mismatchMessage,
  openPopup,
  patchKycForm,
  reissueTokens,
  saveKycExtra,
  saveNominee,
  saveNonCompliantRequest,
  startIdentityDocument,
  startNsdlEsign,
  toTitleCaseName,
  uploadModifySignatureFile,
  uploadSignatureBase64,
  waitForModifyDigiLockerUrl,
  waitForModifyEsignUrl,
  waitForModifyFormSubmitted,
  waitForPopupClose,
  isModifyEsignCallback,
  lookupIfsc,
} from "./lib/kycApi";
import { getEmailFromApple, getEmailFromGoogle } from "./lib/oauthEmail";
import { assignAdvisorAfterOtp } from "@/features/dashboard/lib/crmApi";
import { isAdultDob, isValidPan, maxDobForMinAge, normalizePan, toIsoDate } from "./lib/panValidation";

/**
 * Fydaa — auth + KYC onboarding (Web)
 * Auth: mobile → OTP → create 4-digit PIN → home
 * Risk quiz opens when KYC starts (isRiskProfileComplete false), not after create PIN.
 */

/** Which KYC step (1-4) each screen belongs to; `p` fills the active bar. */
const STEP_MAP = {
  risk: { s: 1, p: null },
  score: { s: 1, p: [1, 1] },
  email: { s: 1, p: null },
  emailotp: { s: 1, p: null },
  pan: { s: 2, p: null },
  kyc: { s: 2, p: null },
  digilocker: { s: 2, p: null },
  signature: { s: 3, p: null },
  nsdl: { s: 3, p: null },
  esign: { s: 3, p: null },
  bank: { s: 4, p: null },
  nominee: { s: 4, p: null },
};

const BACK_MAP = {
  otp: "mobile",
  email: "score",
  emailotp: "email",
  digilocker: "kyc",
  signature: "digilocker",
  nsdl: "signature",
  bank: "esign",
  nominee: "bank",
};

/** Mobile + OTP keep the marketing navbar; PIN and KYC screens hide it. */
const AUTH_ENTRY_SCREENS = new Set(["mobile", "otp"]);
const KYC_NAV_EVENT = "fydaa-onboarding-nav";

const ACCOUNT_TYPES = [
  { value: "savings", label: "Savings" },
  { value: "current", label: "Current" },
];

function AccountSwitch({ isLogin }) {
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 border-t border-line pt-3 text-sm text-grey-600">
      {isLogin ? "New to Fydaa?" : "Already have an account?"}
      <Link
        href={isLogin ? "/signup" : "/login"}
        className="link inline-flex min-h-11 items-center"
        data-ph-event={isLogin ? "Sign up" : "Log in"}
      >
        {isLogin ? "Sign up" : "Log in"}
      </Link>
    </p>
  );
}

/** "+91 98765 43210" */
function formatMobile(digits) {
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : `+91 ${digits}`;
}

/** Seconds as "0:24". */
function formatSeconds(secs) {
  return `0:${String(secs).padStart(2, "0")}`;
}

export default function OnboardingFlow({
  mode = "signup",
  embedded = false,
  start = null,
  onExit = null,
  onComplete = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState(embedded ? "" : "mobile");
  const [pep, setPep] = useState(false);
  const [esignAgree, setEsignAgree] = useState(false);
  const [esignSigned, setEsignSigned] = useState(false);
  const [nomineeOptOut, setNomineeOptOut] = useState(false);
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycPath, setKycPath] = useState("compliant"); // compliant | noncompliant | modify
  const [kycNotice, setKycNotice] = useState("");
  const [modifyFormId, setModifyFormId] = useState("");
  const [panName, setPanName] = useState("");
  const [incomeSlab, setIncomeSlab] = useState("");
  const [occupation, setOccupation] = useState("");
  const [sourceOfWealth, setSourceOfWealth] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [signatureB64, setSignatureB64] = useState("");
  const [signatureBlank, setSignatureBlank] = useState(true);
  const [ifsc, setIfsc] = useState("");
  const [ifscInfo, setIfscInfo] = useState(null);
  const [ifscLookupBusy, setIfscLookupBusy] = useState(false);
  const [ifscLookupError, setIfscLookupError] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeDob, setNomineeDob] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [createPinValue, setCreatePinValue] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinSetupType, setPinSetupType] = useState("NEW_USER");
  const [otp, setOtp] = useState("");
  const [authError, setAuthErrorText] = useState("");
  /** Which field the error is about (shown under that field), or null for a general error. */
  const [errorField, setErrorField] = useState(null);
  /** Bumped on every new error so the shake replays even when the message repeats. */
  const [errorTick, setErrorTick] = useState(0);
  /** A finished moment ({ title, body }) shown with a success check while the next page loads. */
  const [done, setDone] = useState(null);
  /** Wall clock for the OTP resend countdown, refreshed while the OTP screen is open. */
  const [now, setNow] = useState(0);
  const [authBusy, setAuthBusy] = useState("");
  const [showReferral, setShowReferral] = useState(false);
  const [referralInput, setReferralInput] = useState("");
  const [storedReferral, setStoredReferral] = useState("");
  const [resendReadyAt, setResendReadyAt] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [riskIndex, setRiskIndex] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState([]);
  const [riskSel, setRiskSel] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [riskBand, setRiskBand] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailResendReadyAt, setEmailResendReadyAt] = useState(0);
  const [emailResendSecs, setEmailResendSecs] = useState(0);
  const [panNumber, setPanNumber] = useState("");
  const [dob, setDob] = useState("");
  const maxDobIso = toIsoDate(maxDobForMinAge(18));
  const todayIso = toIsoDate(new Date());
  const nomineeIsMinor = Boolean(nomineeDob) && !isAdultDob(nomineeDob, 18);

  /** Show (or clear) the screen's error; `field` places it under one input. */
  const setAuthError = (message, field = null) => {
    setAuthErrorText(message);
    setErrorField(message ? field : null);
    if (message) setErrorTick((tick) => tick + 1);
  };
  const errorFor = (field) => (authError && errorField === field ? authError : "");
  const generalError = authError && !errorField ? authError : "";

  const go = (next) => {
    setAuthError("");
    setScreen(next);
  };

  useEffect(() => {
    if (!screen) return;
    captureEvent(toEventName(`onboarding_${screen}`, "viewed"), {
      screen,
      mode: mode || (embedded ? "embedded" : "signup"),
    });
  }, [screen, mode, embedded]);

  const bankNext = () => (nomineeOptOut ? submitNominee() : go("nominee"));

  const restart = () => {
    setScreen("mobile");
    setPep(false);
    setEsignAgree(false);
    setEsignSigned(false);
    setNomineeOptOut(false);
    setNomineeRelation("father");
    setKycModalOpen(false);
    setKycPath("compliant");
    setKycNotice("");
    setModifyFormId("");
    setPanName("");
    setIncomeSlab("");
    setOccupation("");
    setSourceOfWealth("");
    setFatherName("");
    setGender("");
    setMaritalStatus("");
    setSignatureB64("");
    setSignatureBlank(true);
    setIfsc("");
    setAccountNumber("");
    setConfirmAccountNumber("");
    setAccountType("savings");
    setNomineeName("");
    setNomineeDob("");
    setGuardianName("");
    setGuardianRelation("");
    setMobile("");
    setPin("");
    setCreatePinValue("");
    setConfirmPin("");
    setOtp("");
    setAuthError("");
    setShowReferral(false);
    setReferralInput("");
    setStoredReferral("");
    setResendReadyAt(0);
    setQuestions([]);
    setRiskIndex(0);
    setRiskAnswers([]);
    setRiskSel(null);
    setRiskScore(0);
    setRiskBand("");
    setEmail("");
    setEmailOtp("");
    setEmailResendReadyAt(0);
    setEmailResendSecs(0);
    setPanNumber("");
    setDob("");
  };

  const mobileNumber = mobile.replace(/\D/g, "").slice(0, 10);
  const goHome = () => {
    // Finished KYC steps successfully — may resume invest flow.
    if (typeof onComplete === "function") {
      onComplete();
      return;
    }
    if (typeof onExit === "function") {
      onExit();
      return;
    }
    // Return to the page that sent the user to log in (same-origin paths only).
    router.push(safeRedirectPath(searchParams?.get("next")));
  };
  const exitToDashboard = () => {
    // Explicit "Back to dashboard" — always leave KYC, do not resume invest.
    if (typeof onExit === "function") {
      onExit();
      return;
    }
    router.push("/dashboard");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const notice = sessionStorage.getItem("fydaa-auth-notice");
    const savedMobile = sessionStorage.getItem("fydaa-auth-mobile");
    if (notice) {
      sessionStorage.removeItem("fydaa-auth-notice");
      setAuthError(notice);
    }
    if (savedMobile && mode === "login") {
      sessionStorage.removeItem("fydaa-auth-mobile");
      setMobile(savedMobile);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Keep dashboard chrome when KYC runs inside /dashboard.
    if (embedded) {
      document.body.classList.remove("fydaa-hide-site-chrome");
      window.dispatchEvent(new CustomEvent(KYC_NAV_EVENT, { detail: { hideNav: false } }));
      return undefined;
    }
    const hideNav = Boolean(screen) && !AUTH_ENTRY_SCREENS.has(screen);
    document.body.classList.toggle("fydaa-hide-site-chrome", hideNav);
    window.dispatchEvent(new CustomEvent(KYC_NAV_EVENT, { detail: { hideNav } }));
    return () => {
      document.body.classList.remove("fydaa-hide-site-chrome");
      window.dispatchEvent(new CustomEvent(KYC_NAV_EVENT, { detail: { hideNav: false } }));
    };
  }, [screen, embedded]);

  useEffect(() => {
    if (!searchParams) return;
    const keys = ["referredBy", "referralCode", "referral_code", "ref_code", "ref"];
    for (const key of keys) {
      const value = searchParams.get(key)?.trim();
      if (value) {
        setStoredReferral(value);
        break;
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (screen !== "emailotp" || !emailResendReadyAt) {
      setEmailResendSecs(0);
      return undefined;
    }
    const tick = () => {
      const left = Math.max(0, Math.ceil((emailResendReadyAt - Date.now()) / 1000));
      setEmailResendSecs(left);
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [screen, emailResendReadyAt]);

  useEffect(() => {
    if (screen !== "otp") return undefined;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 500);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [screen, resendReadyAt]);
  // Clamped to the 30s cooldown so a stale clock never shows a longer wait.
  const resendSecs = now ? Math.min(30, Math.max(0, Math.ceil((resendReadyAt - now) / 1000))) : 30;

  async function loadRiskResult() {
    const indicators = await getRiskIndicators();
    const score = scoreFromIndicators(indicators);
    setRiskScore(score);
    setRiskBand(bandFromIndicators(indicators));
    go("score");
  }

  async function startRiskQuestionnaire() {
    setAuthBusy("risk");
    setAuthError("");
    try {
      const list = await getRiskQuestionnaire();
      if (!list.length) throw new Error("Could not load risk questions.");
      setQuestions(list);
      setRiskIndex(0);
      setRiskAnswers([]);
      setRiskSel(null);
      go("risk");
    } catch (err) {
      setAuthError(err.message || "Could not load risk questions.");
    } finally {
      setAuthBusy("");
    }
  }

  useEffect(() => {
    if (mode === "login") return;
    const startKey = start || searchParams?.get("start");
    if (startKey !== "risk") return;
    if (!getAccessToken()) return;
    // Logged-in KYC/risk always runs inside dashboard (sidebar + back).
    if (!embedded) {
      router.replace("/dashboard?start=risk");
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setAuthBusy("risk");
      setAuthError("");
      try {
        const list = await getRiskQuestionnaire();
        if (cancelled) return;
        if (!list.length) throw new Error("Could not load risk questions.");
        setQuestions(list);
        setRiskIndex(0);
        setRiskAnswers([]);
        setRiskSel(null);
        go("risk");
      } catch (err) {
        if (!cancelled) setAuthError(err.message || "Could not load risk questions.");
      } finally {
        if (!cancelled) setAuthBusy("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, searchParams, start, embedded]);

  async function routeAfterKycStage(stage) {
    // §2.2 resume order
    if (isTruthyFlag(stage?.ismodify)) {
      setKycPath("modify");
      if (isTruthyFlag(stage?.ismodifynsdl)) {
        if (!isTruthyFlag(stage?.isBank)) {
          go("bank");
          return;
        }
        if (!isTruthyFlag(stage?.isNominee)) {
          go("nominee");
          return;
        }
        goHome();
        return;
      }
      if (!isTruthyFlag(stage?.ismodifydigilocker)) {
        go("digilocker");
        return;
      }
      if (!isTruthyFlag(stage?.ismodifyquestions)) {
        go("kyc");
        return;
      }
      if (!isTruthyFlag(stage?.ismodifyesign) || !isTruthyFlag(stage?.ismodifynsdl)) {
        go("signature");
        return;
      }
      goHome();
      return;
    }

    if (isTruthyFlag(stage?.isKycExpired)) {
      go("pan");
      return;
    }
    if (!isTruthyFlag(stage?.isRiskProfileComplete)) {
      await startRiskQuestionnaire();
      return;
    }
    if (!isTruthyFlag(stage?.isEmail)) {
      await loadRiskResult();
      return;
    }
    if (!isTruthyFlag(stage?.isPan) || !isTruthyFlag(stage?.isDob)) {
      go("pan");
      return;
    }

    if (isTruthyFlag(stage?.isKycCompliant)) {
      setKycPath("compliant");
      if (!isTruthyFlag(stage?.kycExtraData)) {
        go("kyc");
        return;
      }
      if (!isTruthyFlag(stage?.isBank)) {
        go("bank");
        return;
      }
      if (!isTruthyFlag(stage?.isNominee)) {
        go("nominee");
        return;
      }
      goHome();
      return;
    }

    // Non-compliant (or fresh)
    setKycPath("noncompliant");
    if (!isTruthyFlag(stage?.isNonCompliantData) || !isTruthyFlag(stage?.isDigiLocker)) {
      if (!isTruthyFlag(stage?.isNonCompliantData)) {
        go("kyc");
        return;
      }
      go("digilocker");
      return;
    }
    if (!isTruthyFlag(stage?.isNSDL)) {
      go("signature");
      return;
    }
    if (!isTruthyFlag(stage?.isBank)) {
      go("bank");
      return;
    }
    if (!isTruthyFlag(stage?.isNominee)) {
      go("nominee");
      return;
    }
    goHome();
  }

  async function routeAfterAuth() {
    const stage = await getUserStage();
    const type = resolvePinSetupType(stage);
    setPinSetupType(type);
    if (type === "NEW_USER" || type === "LEGACY_MIGRATION") {
      setCreatePinValue("");
      setConfirmPin("");
      go("pin");
      return;
    }
    // PIN exists but signup incomplete → resume at first remaining step
    if (!isSignupComplete(stage)) {
      await routeAfterKycStage(stage);
      return;
    }
    // Fully registered → login with PIN
    clearTokens();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "fydaa-auth-notice",
        "This number is already registered. Please log in with your PIN.",
      );
      if (mobileNumber) sessionStorage.setItem("fydaa-auth-mobile", mobileNumber);
    }
    router.replace("/login");
  }

  useEffect(() => {
    const code = ifsc.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)) {
      setIfscInfo(null);
      setIfscLookupBusy(false);
      setIfscLookupError(code.length === 11 ? "Enter a valid IFSC (e.g. HDFC0001234)." : "");
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setIfscLookupBusy(true);
      setIfscLookupError("");
      try {
        const info = await lookupIfsc(code);
        if (!cancelled) {
          setIfscInfo(info);
          setIfscLookupError("");
        }
      } catch (err) {
        if (!cancelled) {
          setIfscInfo(null);
          setIfscLookupError(err.message || "Could not fetch branch details.");
        }
      } finally {
        if (!cancelled) setIfscLookupBusy(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ifsc]);

  useEffect(() => {
    if (mode === "login") return;
    const startKey = start || searchParams?.get("start");
    if (startKey !== "kyc") return;
    if (!getAccessToken()) return;
    // Logged-in KYC always runs inside dashboard (sidebar + back).
    if (!embedded) {
      router.replace("/dashboard?start=kyc");
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setAuthBusy("kyc");
      setAuthError("");
      try {
        const stage = await getUserStage();
        if (!cancelled) await routeAfterKycStage(stage);
      } catch (err) {
        if (!cancelled) setAuthError(err.message || "Could not load your KYC stage.");
      } finally {
        if (!cancelled) setAuthBusy("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, searchParams, start, embedded]);

  async function submitSignupMobile() {
    if (mobileNumber.length !== 10) {
      setAuthError("Enter a 10-digit mobile number.", "mobile");
      return;
    }
    setAuthBusy("otp-request");
    setAuthError("");
    const typed = referralInput.trim();
    const referredBy = storedReferral || typed || undefined;
    try {
      const check = await checkMobile(mobileNumber);
      if (check?.exists === true) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("fydaa-auth-notice", "This number is already registered. Please log in.");
          sessionStorage.setItem("fydaa-auth-mobile", mobileNumber);
        }
        router.replace("/login");
        return;
      }
      await requestOtp({ mobileNumber, referredBy });
      if (typed) setStoredReferral(typed);
      setResendReadyAt(Date.now() + 30000);
      setOtp("");
      go("otp");
    } catch (err) {
      setAuthError(err.message || "Something went wrong, try again after sometime.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitLoginPin() {
    if (mobileNumber.length !== 10) {
      setAuthError("Enter a 10-digit mobile number.", "mobile");
      return;
    }
    if (pin.length !== 4) {
      setAuthError("Enter your 4-digit PIN.", "pin");
      return;
    }
    setAuthBusy("pin");
    setAuthError("");
    let failedField = "pin";
    try {
      await verifyPin({ mobileNumber, pin });
      failedField = null;
      await requestOtp({
        mobileNumber,
        referredBy: storedReferral || undefined,
      });
      setOtp("");
      setResendReadyAt(Date.now() + 30000);
      go("otp");
    } catch (err) {
      setAuthError(err.message || "Could not verify PIN.", failedField);
    } finally {
      setAuthBusy("");
    }
  }

  async function finishLoginAfterOtp() {
    // Login always lands on dashboard; KYC continues only from signup.
    setDone({ title: "You're logged in", body: "Opening your account…" });
    goHome();
  }

  async function submitSignupOtp() {
    if (otp.length !== 6) {
      setAuthError("Enter the 6-digit OTP.", "otp");
      return;
    }
    setAuthBusy("otp");
    setAuthError("");
    let failedField = "otp";
    try {
      const verified = await verifyOtp({ mobileNumber, otp });
      failedField = null;
      // Same token save for signup and login: data.accessToken → localStorage.
      storeTokens(verified);
      // Map advisor / RM in CRM (login + signup). Non-blocking.
      await assignAdvisorAfterOtp();
      if (mode === "login") {
        await finishLoginAfterOtp();
        return;
      }
      await routeAfterAuth();
    } catch (err) {
      setAuthError(err.message || "Could not verify OTP.", failedField);
    } finally {
      setAuthBusy("");
    }
  }

  async function resendSignupOtp() {
    if (authBusy) return;
    if (Date.now() < resendReadyAt) {
      const secs = Math.ceil((resendReadyAt - Date.now()) / 1000);
      setAuthError(`You can resend OTP in ${secs}s.`);
      return;
    }
    setAuthBusy("resend");
    setAuthError("");
    try {
      await requestOtp({
        mobileNumber,
        referredBy: storedReferral || undefined,
      });
      setResendReadyAt(Date.now() + 30000);
    } catch (err) {
      setAuthError(err.message || "Something went wrong, try again after sometime.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitCreatePin() {
    if (createPinValue.length !== 4) {
      setAuthError("Enter a 4-digit PIN.", "createPin");
      return;
    }
    if (createPinValue !== confirmPin) {
      setAuthError("PINs do not match.", "confirmPin");
      return;
    }
    setAuthBusy("create-pin");
    setAuthError("");
    try {
      await createPinApi({ pin: createPinValue, confirmPin });
      setDone({ title: "Your PIN is set", body: "Opening your account…" });
      goHome();
    } catch (err) {
      setAuthError(err.message || "Could not create PIN.");
    } finally {
      setAuthBusy("");
    }
  }

  async function continueAfterEmailLinked() {
    const stage = await getUserStage();
    if (!isTruthyFlag(stage?.isEmail)) {
      throw new Error("Email verification did not complete. Please try again.");
    }
    go("pan");
  }

  async function submitRequestEmailOtp() {
    const nextEmail = email.trim();
    if (!isValidEmail(nextEmail)) {
      setAuthError("Enter a valid email address.", "email");
      return;
    }
    setAuthBusy("email-request");
    setAuthError("");
    try {
      await requestLinkEmail({ email: nextEmail });
      setEmail(nextEmail);
      setEmailOtp("");
      setEmailResendReadyAt(Date.now() + 30000);
      go("emailotp");
    } catch (err) {
      setAuthError(err.message || "Something went wrong, try again after sometime.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitVerifyEmailOtp() {
    if (emailOtp.length !== 6) {
      setAuthError("Enter the 6-digit verification code.", "emailOtp");
      return;
    }
    setAuthBusy("email-verify");
    setAuthError("");
    let failedField = "emailOtp";
    try {
      await verifyLinkEmail({ email: email.trim(), otp: emailOtp });
      failedField = null;
      await continueAfterEmailLinked();
    } catch (err) {
      setAuthError(err.message || "Something went wrong, try again after sometime.", failedField);
    } finally {
      setAuthBusy("");
    }
  }

  async function resendEmailOtp() {
    if (authBusy) return;
    if (Date.now() < emailResendReadyAt) return;
    setAuthBusy("email-resend");
    setAuthError("");
    try {
      await requestLinkEmail({ email: email.trim() });
      setEmailResendReadyAt(Date.now() + 30000);
    } catch (err) {
      setAuthError(err.message || "Something went wrong, try again after sometime.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitOAuthEmail(provider) {
    setAuthBusy(provider === "GOOGLE" ? "google" : "apple");
    setAuthError("");
    try {
      const oauthEmail = provider === "GOOGLE" ? await getEmailFromGoogle() : await getEmailFromApple();
      setEmail(oauthEmail);
      await linkEmail({ email: oauthEmail, provider });
      await continueAfterEmailLinked();
    } catch (err) {
      setAuthError(err.message || "Something went wrong, try again after sometime.");
    } finally {
      setAuthBusy("");
    }
  }

  function submitPanDetails() {
    const pan = normalizePan(panNumber);
    if (!isValidPan(pan)) {
      setAuthError("Enter a valid PAN (e.g. ABCDE1234F).", "pan");
      return;
    }
    if (!isValidFullName(panName)) {
      setAuthError("Enter your full name as on PAN (letters only).", "panName");
      return;
    }
    if (!dob) {
      setAuthError("Select your date of birth.", "dob");
      return;
    }
    if (!isAdultDob(dob, 18)) {
      setAuthError("You must be at least 18 years old.", "dob");
      return;
    }
    setPanNumber(pan);
    setAuthError("");
    void runPanLookup(pan, toTitleCaseName(panName), dob);
  }

  async function runPanLookup(pan, name, date_of_birth) {
    setAuthBusy("pan");
    setAuthError("");
    setKycNotice("");
    try {
      const { res, data, nested } = await fetchKycData({ pan, name, date_of_birth });

      if (isTruthyFlag(nested?.isMigratedUser) || isTruthyFlag(data?.isMigratedUser)) {
        try {
          await reissueTokens();
        } catch {
          /* continue even if reissue fails */
        }
      }

      const action = nested?.action;
      const reason = String(nested?.reason || "").toLowerCase();

      if (action === "modify" && reason === "legacy") {
        window.open("https://digital.camsonline.com/kycmodification", "_blank", "noopener,noreferrer");
        setAuthError(nested?.message || "Please update your KYC on the KRA portal.");
        return;
      }

      if (isPanMismatch(data)) {
        setAuthError(mismatchMessage(data));
        return;
      }

      if (action === "modify") {
        setKycPath("modify");
        setKycNotice(
          nested?.message || nested?.reason || "Your KYC needs to be updated. Tap below to proceed.",
        );
        setKycModalOpen(true);
        return;
      }

      if (action === "create" || isNoKycRecord(data)) {
        await initiateKyc();
        setKycPath("noncompliant");
        setKycNotice("Your KYC is not compliant. Please complete the next steps.");
        setKycModalOpen(true);
        return;
      }

      if ((res.status === 400 || data?.error === true || data?.status === false) && !isNoKycRecord(data)) {
        setAuthError(mismatchMessage(data) || "Could not verify PAN. Please try again.");
        return;
      }

      const stage = await getUserStage();
      if (isTruthyFlag(stage?.ismodify) && !isTruthyFlag(stage?.ismodifynsdl)) {
        setKycPath("modify");
        setKycNotice(nested?.message || "Your KYC needs to be updated.");
        setKycModalOpen(true);
        return;
      }
      if (isTruthyFlag(stage?.isKycCompliant)) {
        setKycPath("compliant");
        setKycNotice("Your KYC is compliant");
        setKycModalOpen(true);
        return;
      }

      await initiateKyc();
      setKycPath("noncompliant");
      setKycNotice("Your KYC is not compliant. Please complete the next steps.");
      setKycModalOpen(true);
    } catch (err) {
      if (err?.status === 401) {
        clearTokens();
        router.replace("/login");
        return;
      }
      setAuthError(err.message || "Could not verify PAN. Please try again.");
    } finally {
      setAuthBusy("");
    }
  }

  async function continueAfterKycModal() {
    setKycModalOpen(false);
    if (kycPath === "modify") {
      setAuthBusy("modify-start");
      setAuthError("");
      try {
        const form = await createModifyKycForm({
          pan: panNumber,
          name: toTitleCaseName(panName),
          date_of_birth: dob,
          proof_details_callback_url: "https://fydaa.com/kyc-modify?proof=callback",
          esign_callback_url: "https://fydaa.com/kyc-modify?esign=callback",
        });
        if (form?.id) setModifyFormId(form.id);
        const proofStatus = String(form?.proof_details?.status || "").toLowerCase();
        const proofDone = ["fetched", "successful", "success", "completed", "verified"].includes(proofStatus);
        const fetchUrl = form?.proof_details?.fetch_url;
        // Already fetched with no link → skip DigiLocker screen and go to questions.
        if (!fetchUrl && proofDone) {
          go("kyc");
        } else {
          go("digilocker");
        }
      } catch (err) {
        setAuthError(err.message || "Could not start KYC update.");
        go("digilocker");
      } finally {
        setAuthBusy("");
      }
      return;
    }
    go("kyc");
  }

  async function submitKycExtra() {
    if (!incomeSlab || !occupation || !sourceOfWealth) {
      setAuthError("Please fill income, occupation, and source of wealth.");
      return;
    }
    if (!pep) {
      setAuthError("Please confirm you are not a politically exposed person.");
      return;
    }
    setAuthBusy("kyc-extra");
    setAuthError("");
    try {
      if (kycPath === "modify") {
        if (!fatherName.trim() || !gender || !maritalStatus) {
          setAuthError("Please fill father's name, gender, and marital status.");
          setAuthBusy("");
          return;
        }
        let formId = modifyFormId;
        if (!formId) {
          const current = await getCurrentKycForm();
          formId = current?.id || "";
          if (formId) setModifyFormId(formId);
        }
        if (!formId) throw new Error("KYC form not ready. Restart modify KYC.");
        const occMap = {
          private_sector: "private_sector_service",
          government_sector: "government_service",
          public_sector: "government_service",
        };
        await patchKycForm(formId, {
          father_name: toTitleCaseName(fatherName),
          gender,
          marital_status: maritalStatus,
          income_slab: incomeSlab,
          occupation_type: occMap[occupation] || occupation,
          source_of_wealth: sourceOfWealth,
          geolocation: { latitude: 9.354, longitude: 77.453 },
          pep_details: "no_exposure",
          address: {
            line_1: "As per DigiLocker",
            line_2: "As per DigiLocker",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560001",
          },
          residential_status: "resident",
          country_of_birth: "in",
          place_of_birth: "in",
          citizenship_countries: ["in"],
          nationality_country: "in",
          tax_residency_other_than_india: false,
        });
        go("signature");
      } else if (kycPath === "noncompliant") {
        if (!fatherName.trim() || !gender || !maritalStatus) {
          setAuthError("Please fill father's name, gender, and marital status.");
          setAuthBusy("");
          return;
        }
        let latitude = 0;
        let longitude = 0;
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          const coords = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              () => reject(new Error("Enable location services to continue KYC.")),
              { timeout: 15000 },
            );
          });
          latitude = Number(coords.latitude.toFixed(6));
          longitude = Number(coords.longitude.toFixed(6));
        } else {
          throw new Error("Enable location services to continue KYC.");
        }
        await saveNonCompliantRequest({
          father_name: toTitleCaseName(fatherName),
          gender,
          marital_status: maritalStatus,
          income_slab: incomeSlab,
          occupation_type: occupation,
          source_of_wealth: sourceOfWealth,
          geolocation: { latitude, longitude },
          pep_details: "not_applicable",
        });
        go("digilocker");
      } else {
        await saveKycExtra({
          income_slab: incomeSlab,
          occupation,
          pep_details: "not_applicable",
          source_of_wealth: sourceOfWealth,
        });
        const stage = await getUserStage();
        if (!isTruthyFlag(stage?.isBank)) {
          go("bank");
        } else if (!isTruthyFlag(stage?.isNominee)) {
          go("nominee");
        } else {
          goHome();
        }
      }
    } catch (err) {
      setAuthError(err.message || "Could not save details.");
    } finally {
      setAuthBusy("");
    }
  }

  async function startDigiLocker() {
    setAuthBusy("digilocker");
    setAuthError("");
    try {
      if (kycPath === "modify") {
        let formId = modifyFormId;
        if (!formId) {
          const current = await getCurrentKycForm();
          formId = current?.id || "";
        }
        const { form, url } = await waitForModifyDigiLockerUrl(formId);
        if (form?.id) setModifyFormId(form.id);
        const proofStatus = String(form?.proof_details?.status || "").toLowerCase();
        const proofDone = ["fetched", "successful", "success", "completed", "verified"].includes(proofStatus);
        // Cybrilla often marks proof "fetched" with null fetch_url — DigiLocker already done.
        if (!url && proofDone) {
          go("kyc");
          return;
        }
        if (!url) {
          throw new Error("DigiLocker link not ready. Please try again in a moment.");
        }
        const popup = openPopup(url, "fydaa-digilocker");
        await waitForPopupClose(popup, { isDoneUrl: isDigiLockerCallback });
        const stage = await getUserStage();
        await routeAfterKycStage(stage);
        return;
      }

      const data = await startIdentityDocument("https://fydaa.com");
      const url = data?.fetch?.redirect_url;
      if (!url) throw new Error("DigiLocker session expired. Please try again.");
      const popup = openPopup(url, "fydaa-digilocker");
      await waitForPopupClose(popup, { isDoneUrl: isDigiLockerCallback });

      let ok = false;
      for (let i = 0; i < 4; i += 1) {
        if (i) await new Promise((r) => setTimeout(r, 400 * i));
        const status = await getIdentityDocument();
        const st = String(status?.fetch?.status || "").toLowerCase();
        if (["successful", "success", "completed", "verified"].includes(st)) {
          ok = true;
          break;
        }
        if (st === "failed" || st === "expired") {
          throw new Error(status?.fetch?.reason || "DigiLocker verification failed.");
        }
      }
      if (!ok) throw new Error("DigiLocker is still pending. Please try again.");
      go("signature");
    } catch (err) {
      setAuthError(err.message || "DigiLocker failed. Please try again.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitSignatureAndNsdl() {
    setAuthBusy("signature");
    setAuthError("");
    try {
      if (kycPath === "modify") {
        let formId = modifyFormId;
        let form = null;
        if (!formId) {
          form = await getCurrentKycForm();
          formId = form?.id || "";
        } else {
          try {
            form = await getCurrentKycForm();
            if (form?.id) formId = form.id;
          } catch {
            /* keep formId */
          }
        }
        if (!formId) throw new Error("KYC form not ready.");
        if (form?.id) setModifyFormId(form.id);

        const formStatus = () => String(form?.status || "").toLowerCase();
        const esignStatus = () => String(form?.esign_details?.status || "").toLowerCase();
        const modifyEsignDone = () =>
          ["submitted", "awaiting_submission"].includes(formStatus()) ||
          ["successful", "success"].includes(esignStatus());

        // Already submitted / e-sign complete — leave signature screen (URL is null after success).
        if (modifyEsignDone()) {
          const stage = await getUserStage();
          await routeAfterKycStage(stage);
          return;
        }

        // §6.7 — if signature already on form, skip re-upload and open esign_url.
        if (!form?.signature_provided) {
          if (signatureBlank || !signatureB64) {
            throw new Error("Please draw your signature.");
          }
          const bin = atob(signatureB64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
          const file = new File([bytes], "signature.png", { type: "image/png" });
          form = await uploadModifySignatureFile(formId, file);
          if (form?.id) {
            formId = form.id;
            setModifyFormId(form.id);
          }
          if (modifyEsignDone()) {
            const stage = await getUserStage();
            await routeAfterKycStage(stage);
            return;
          }
        }

        let esignUrl = form?.esign_details?.esign_url || null;
        if (!esignUrl) {
          const waited = await waitForModifyEsignUrl(formId);
          form = waited.form || form;
          esignUrl = waited.url;
          if (form?.id) setModifyFormId(form.id);
        }

        if (modifyEsignDone()) {
          const stage = await getUserStage();
          await routeAfterKycStage(stage);
          return;
        }

        if (!esignUrl) {
          throw new Error("E-sign link not ready. Please try again later.");
        }

        const popup = openPopup(esignUrl, "fydaa-modify-esign");
        await waitForPopupClose(popup, { isDoneUrl: isModifyEsignCallback });
        await new Promise((r) => setTimeout(r, 2000));
        await waitForModifyFormSubmitted(formId);
        const stage = await getUserStage();
        await routeAfterKycStage(stage);
        return;
      }

      if (signatureBlank || !signatureB64) {
        throw new Error("Please draw your signature.");
      }
      await uploadSignatureBase64(signatureB64);
      go("nsdl");
      await runNsdlEsign();
    } catch (err) {
      setAuthError(err.message || "Could not save signature.");
    } finally {
      setAuthBusy("");
    }
  }

  async function runNsdlEsign() {
    setAuthBusy("nsdl");
    setAuthError("");
    try {
      const data = await startNsdlEsign("https://fydaa.com/SuccesspageNSDL");
      const url = data?.redirect_url;
      if (!url) throw new Error("E-sign link not ready.");
      const popup = openPopup(url, "fydaa-nsdl");
      await waitForPopupClose(popup, { isDoneUrl: isNsdlCallback });
      const status = await getNsdlEsignStatus();
      // A missing status is not a success: only an explicit completed state counts.
      const st = String(status?.status || "").toLowerCase();
      if (!["successful", "success", "completed"].includes(st)) {
        throw new Error("E-sign was not completed. Please try again.");
      }
      const ip = await getPublicIp();
      await createInvestorProfileAndMfAccount(ip);
      let stage = await getUserStage();
      for (let i = 0; i < 4 && !isTruthyFlag(stage?.isNSDL); i += 1) {
        await new Promise((r) => setTimeout(r, 2000));
        stage = await getUserStage();
      }
      if (!isTruthyFlag(stage?.isBank)) go("bank");
      else if (!isTruthyFlag(stage?.isNominee)) go("nominee");
      else goHome();
    } catch (err) {
      setAuthError(err.message || "Aadhaar e-sign failed.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitBank() {
    const ifscCode = ifsc.trim().toUpperCase();
    const acct = accountNumber.trim();
    const confirmAcct = confirmAccountNumber.trim();

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setAuthError("Enter a valid IFSC (e.g. HDFC0001234).", "ifsc");
      return;
    }
    if (!["savings", "current"].includes(accountType)) {
      setAuthError("Select account type: Savings or Current.");
      return;
    }
    if (!/^\d{9,18}$/.test(acct)) {
      setAuthError("Enter a valid account number (9–18 digits).", "accountNumber");
      return;
    }
    if (acct !== confirmAcct) {
      setAuthError("Account numbers do not match.", "confirmAccountNumber");
      return;
    }
    setAuthBusy("bank");
    setAuthError("");
    try {
      try {
        const ip = await getPublicIp();
        await createInvestorProfileAndMfAccount(ip);
      } catch {
        /* may already exist */
      }
      await createAndVerifyBankAccount({
        account_number: acct,
        type: accountType || "savings",
        ifsc_code: ifscCode,
      });
      if (nomineeOptOut) {
        await submitNominee({ forceOptOut: true });
      } else {
        go("nominee");
      }
    } catch (err) {
      setAuthError(err.message || "Could not verify bank account.");
    } finally {
      setAuthBusy("");
    }
  }

  async function submitNominee(opts = {}) {
    const optOut = opts.forceOptOut || nomineeOptOut;
    setAuthBusy("nominee");
    setAuthError("");
    try {
      if (optOut) {
        await saveNominee({ opt_out_nomination: true });
      } else {
        if (!nomineeName.trim() || !nomineeDob || !nomineeRelation) {
          setAuthError("Enter nominee name, date of birth, and relationship.");
          setAuthBusy("");
          return;
        }
        const isMinor = !isAdultDob(nomineeDob, 18);
        if (isMinor && (!guardianName.trim() || !guardianRelation)) {
          setAuthError("Guardian name and relationship are required for a minor nominee.");
          setAuthBusy("");
          return;
        }
        const nominee = {
          nominee_name: toTitleCaseName(nomineeName),
          nominee_dob: nomineeDob,
          allocation_percentage: 100,
          nominee_relationship: nomineeRelation,
          nominee_order: 1,
          is_minor: isMinor,
        };
        if (isMinor) {
          nominee.guardian_name = toTitleCaseName(guardianName);
          nominee.guardian_relationship = guardianRelation;
        }
        await saveNominee({
          opt_out_nomination: false,
          nominees: [nominee],
        });
      }
      setDone({ title: "Your details are saved", body: "Opening your account…" });
      goHome();
    } catch (err) {
      setAuthError(err.message || "Could not save nominee.");
    } finally {
      setAuthBusy("");
    }
  }

  async function pickRiskOption(optIdx) {
    if (authBusy || !questions[riskIndex]) return;
    const q = questions[riskIndex];
    const rawOpt = Array.isArray(q.option) ? q.option[optIdx] : null;
    const answerIdFromOpt =
      rawOpt && typeof rawOpt === "object" && rawOpt.answerId != null ? Number(rawOpt.answerId) : NaN;
    const answer = {
      answerId: Number.isFinite(answerIdFromOpt) ? answerIdFromOpt : optIdx + 1,
      questionId: q.id,
      secondaryQuestionId: q.secondaryQuestionId,
    };
    const nextAnswers = [...riskAnswers.filter((a) => a.questionId !== q.id), answer];
    setRiskAnswers(nextAnswers);
    setRiskSel(optIdx);

    const isLast = riskIndex >= questions.length - 1;
    setTimeout(async () => {
      if (!isLast) {
        setRiskIndex((i) => i + 1);
        setRiskSel(null);
        return;
      }
      setAuthBusy("risk-submit");
      setAuthError("");
      try {
        await createUserRiskProfile(nextAnswers);
        await updatePortfoliosSoft();
        await getUserStage();
        await loadRiskResult();
      } catch (err) {
        setAuthError(err.message || "Something went wrong. Try again after sometime.");
      } finally {
        setAuthBusy("");
      }
    }, 280);
  }

  const cfg = STEP_MAP[screen];
  const isLogin = mode === "login";
  const busy = Boolean(authBusy);
  /** Real <form> submit: Enter / the phone keyboard's "Go" key run the screen's action. */
  const submitWith = (handler) => (event) => {
    event.preventDefault();
    if (!authBusy) handler();
  };

  const showRiskBack = screen === "risk" && riskIndex > 0;
  const backTarget = isLogin
    ? screen === "otp"
      ? "mobile"
      : null
    : showRiskBack
      ? "risk-prev"
      : BACK_MAP[screen];
  const currentQuestion = questions[riskIndex];
  const visibleOptions = Array.isArray(currentQuestion?.option) ? currentQuestion.option.slice(0, 4) : [];
  const riskProgress = questions.length ? Math.round(((riskIndex + 1) / questions.length) * 100) : null;
  const isLegacyPin = pinSetupType === "LEGACY_MIGRATION";
  const pinTitle = isLegacyPin ? "Set a new PIN" : "Create your PIN";
  const pinSub = isLegacyPin
    ? "Your old 6-digit PIN no longer works. Set a new 4-digit PIN to log in with."
    : "You'll use this 4-digit PIN with your mobile number to log in.";
  /** The SIP picked in the home planner (?intent=sip&…), shown beside the signup form. */
  const plan = useMemo(() => (isLogin ? null : planFromParams(searchParams)), [isLogin, searchParams]);
  const authKey = isLogin ? "login" : "signup";

  function handleBack() {
    if (backTarget === "risk-prev") {
      const prevIndex = riskIndex - 1;
      const prevQ = questions[prevIndex];
      const prevAnswer = riskAnswers.find((a) => a.questionId === prevQ?.id);
      setRiskIndex(prevIndex);
      setRiskSel(prevAnswer ? prevAnswer.answerId - 1 : null);
      setAuthError("");
      return;
    }
    if (backTarget) go(backTarget);
  }

  const kycModalCopy =
    {
      compliant: {
        title: "Your KYC is already done",
        subtitle: "Answer a few questions, then add your bank account and a nominee.",
        cta: "Continue",
      },
      modify: {
        title: "Update your KYC",
        subtitle: kycNotice || "Your KYC details need an update before you can invest.",
        cta: "Update KYC",
      },
      noncompliant: {
        title: "Complete your KYC",
        subtitle:
          "Your KYC isn't complete yet. Next: a few details, a DigiLocker check, your signature and an Aadhaar e-sign.",
        cta: "Complete your KYC",
      },
    }[kycPath] || {};

  /* ── Entry screens: mobile number and OTP ───────────────────────── */

  const entryHeading = done ? (
    <PageHeading>{AUTH_TITLES[authKey]}</PageHeading>
  ) : screen === "otp" ? (
    <>
      <PageHeading>Verify your mobile number</PageHeading>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 text-base leading-relaxed text-grey-600">
        <span>
          We sent a 6-digit code to{" "}
          <span className="whitespace-nowrap font-semibold tabular-nums text-ink">
            {formatMobile(mobileNumber)}
          </span>
          .
        </span>
        <LinkText onClick={handleBack}>Change number</LinkText>
      </p>
    </>
  ) : (
    <>
      <PageHeading>{AUTH_TITLES[authKey]}</PageHeading>
      <PageSub>{AUTH_SUBS[authKey]}</PageSub>
    </>
  );

  const entryForm = done ? (
    <SuccessState title={done.title}>{done.body}</SuccessState>
  ) : screen === "mobile" ? (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={submitWith(isLogin ? submitLoginPin : submitSignupMobile)}
    >
      <FieldInput
        label="Mobile number"
        prefix="+91"
        type="tel"
        name="mobile"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        placeholder="10-digit number"
        value={mobileNumber}
        error={errorFor("mobile")}
        errorKey={errorTick}
        onChange={(e) => {
          setMobile(e.target.value);
          setAuthError("");
        }}
      />
      {isLogin && (
        <CodeInputs
          count={4}
          kind="pin"
          label="4-digit PIN"
          value={pin}
          error={errorFor("pin")}
          shakeKey={errorTick}
          onChange={(next) => {
            setPin(next);
            setAuthError("");
          }}
        />
      )}
      {!isLogin && (
        <div className="-my-2 flex flex-col gap-2">
          <LinkText
            aria-expanded={showReferral}
            aria-controls="signup-referral"
            onClick={() => setShowReferral((v) => !v)}
          >
            Have a referral code?
          </LinkText>
          {showReferral && (
            <div id="signup-referral" className="pb-2">
              <FieldInput
                label="Referral code (optional)"
                name="referral"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
      <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
      <Button
        phEvent={isLogin ? "Login Proceed" : "Sign up Proceed"}
        type="submit"
        disabled={busy}
        loading={authBusy === "pin" || authBusy === "otp-request"}
      >
        {isLogin
          ? authBusy === "pin"
            ? "Checking your PIN"
            : "Log in"
          : authBusy === "otp-request"
            ? "Sending OTP"
            : "Send OTP"}
      </Button>
      <AccountSwitch isLogin={isLogin} />
    </form>
  ) : screen === "otp" ? (
    <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitSignupOtp)}>
      <CodeInputs
        count={6}
        label="6-digit OTP"
        autoFocus
        value={otp}
        error={errorFor("otp")}
        shakeKey={errorTick}
        onChange={(next) => {
          setOtp(next);
          setAuthError("");
        }}
      />
      <LinkText className="-my-3" onClick={resendSignupOtp} disabled={busy || resendSecs > 0}>
        {authBusy === "resend"
          ? "Sending a new OTP…"
          : resendSecs > 0
            ? `Resend OTP in ${formatSeconds(resendSecs)}`
            : "Resend OTP"}
      </LinkText>
      <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
      <Button phEvent="Verify OTP" type="submit" disabled={busy} loading={authBusy === "otp"}>
        {authBusy === "otp" ? "Verifying" : isLogin ? "Log in" : "Verify"}
      </Button>
    </form>
  ) : null;

  /* ── Focused screens: PIN, risk profile, KYC ───────────────────── */

  const stepHeader = (
    <>
      {backTarget && screen !== "otp" && !done && (
        <div className="-mt-2 mb-4">
          <BackButton onClick={handleBack}>
            {backTarget === "risk-prev" ? "Previous question" : "Back"}
          </BackButton>
        </div>
      )}
      {cfg && !done && (
        <Stepper
          activeStep={cfg.s}
          progress={screen === "risk" ? riskProgress : cfg.p ? Math.round((cfg.p[0] / cfg.p[1]) * 100) : null}
        />
      )}
    </>
  );

  const heading = (title, sub) => (
    <div className="mb-1">
      <PageHeading size="step">{title}</PageHeading>
      {sub ? <PageSub>{sub}</PageSub> : null}
    </div>
  );

  const stepScreens = done ? (
    <SuccessState title={done.title} titleAs="h1">
      {done.body}
    </SuccessState>
  ) : (
    <>
      {/* PIN — create / legacy migrate; then home (not risk quiz) */}
      {screen === "pin" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitCreatePin)}>
          {heading(pinTitle, pinSub)}
          <CodeInputs
            count={4}
            kind="pin"
            label="New 4-digit PIN"
            autoFocus
            value={createPinValue}
            error={errorFor("createPin")}
            shakeKey={errorTick}
            onChange={(next) => {
              setCreatePinValue(next);
              setAuthError("");
            }}
          />
          <CodeInputs
            count={4}
            kind="pin"
            label="Enter the PIN again"
            value={confirmPin}
            error={errorFor("confirmPin")}
            shakeKey={errorTick}
            onChange={(next) => {
              setConfirmPin(next);
              setAuthError("");
            }}
          />
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button phEvent="Create PIN" type="submit" disabled={busy} loading={authBusy === "create-pin"}>
            {authBusy === "create-pin" ? "Saving your PIN" : isLegacyPin ? "Save PIN" : "Create PIN"}
          </Button>
        </form>
      )}

      {/* RISK QUESTIONS — API questionnaire, one at a time */}
      {screen === "risk" && currentQuestion && (
        <div className="flex flex-col gap-5">
          <div className="mb-1">
            <p className="mb-2 text-sm font-medium text-grey-600">
              Question {riskIndex + 1} of {questions.length}
            </p>
            <PageHeading size="step">{currentQuestion.question || currentQuestion.text || ""}</PageHeading>
            {(currentQuestion.subtitle || currentQuestion.description) && (
              <PageSub>{currentQuestion.subtitle || currentQuestion.description}</PageSub>
            )}
          </div>
          <div role="group" aria-label="Answers" className="grid gap-3 sm:grid-cols-2">
            {visibleOptions.map((opt, i) => {
              const label =
                typeof opt === "string"
                  ? opt
                  : opt?.answer || opt?.option || opt?.text || opt?.label || String(opt);
              return (
                <OptionButton
                  key={`${currentQuestion.id}-${i}`}
                  selected={riskSel === i}
                  disabled={busy}
                  onClick={() => pickRiskOption(i)}
                >
                  {label}
                </OptionButton>
              );
            })}
          </div>
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          {authBusy === "risk-submit" && (
            <p role="status" className="text-sm text-grey-600">
              Saving your risk profile…
            </p>
          )}
        </div>
      )}

      {/* SCORE */}
      {screen === "score" && (
        <div className="flex flex-col gap-6">
          {heading("Your risk profile is ready")}
          <div className="flex flex-wrap items-center gap-6 rounded-card bg-mist p-5 sm:p-6">
            <ScoreRing score={riskScore} max={100} />
            <div className="flex min-w-0 flex-1 basis-40 flex-col items-start gap-2">
              <p className="text-sm text-grey-600">Your profile</p>
              <p className="rounded-full bg-jade-tint px-3.5 py-1.5 text-sm font-semibold text-jade">
                {riskBand || "Your risk profile"}
              </p>
            </div>
          </div>
          <p className="text-base leading-relaxed text-grey-600">
            Next, verify your email to get your risk profile report. Then finish KYC with your PAN and bank
            details.
          </p>
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <div className="flex flex-col gap-3">
            <Button phEvent="Continue" onClick={() => go("email")} disabled={busy}>
              Continue
            </Button>
            <OutlineButton
              phEvent="Retake Quiz"
              onClick={startRiskQuestionnaire}
              disabled={busy}
              loading={authBusy === "risk"}
            >
              {authBusy === "risk" ? "Loading the questions" : "Retake the quiz"}
            </OutlineButton>
          </div>
        </div>
      )}

      {/* EMAIL */}
      {screen === "email" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitRequestEmailOtp)}>
          {heading("Verify your email", "We'll send your risk profile report to this address.")}
          <FieldInput
            label="Email"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            error={errorFor("email")}
            errorKey={errorTick}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError("");
            }}
          />
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button
            phEvent="Send Email OTP"
            type="submit"
            disabled={busy}
            loading={authBusy === "email-request"}
          >
            {authBusy === "email-request" ? "Sending code" : "Send code"}
          </Button>
          <OrDivider />
          <div className="flex flex-col gap-3">
            <OutlineButton
              phEvent="Continue with Google"
              onClick={() => submitOAuthEmail("GOOGLE")}
              disabled={busy}
            >
              <GoogleIcon />
              {authBusy === "google" ? "Connecting to Google…" : "Continue with Google"}
            </OutlineButton>
            <OutlineButton
              phEvent="Continue with Apple"
              onClick={() => submitOAuthEmail("APPLE")}
              disabled={busy}
            >
              <AppleIcon />
              {authBusy === "apple" ? "Connecting to Apple…" : "Continue with Apple"}
            </OutlineButton>
          </div>
        </form>
      )}

      {/* EMAIL OTP */}
      {screen === "emailotp" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitVerifyEmailOtp)}>
          {heading(
            "Enter the code from your email",
            <>
              We sent a 6-digit code to{" "}
              <span className="break-words font-semibold text-ink">{email || "your email address"}</span>.
            </>,
          )}
          <CodeInputs
            count={6}
            label="6-digit email code"
            autoFocus
            value={emailOtp}
            error={errorFor("emailOtp")}
            shakeKey={errorTick}
            onChange={(next) => {
              setEmailOtp(next);
              setAuthError("");
            }}
          />
          {emailResendSecs > 0 ? (
            <p className="-my-3 flex min-h-11 items-center text-sm text-grey-600">
              Resend code in <span className="ml-1 tabular-nums">{formatSeconds(emailResendSecs)}</span>
            </p>
          ) : (
            <LinkText className="-my-3" onClick={resendEmailOtp}>
              {authBusy === "email-resend" ? "Sending a new code…" : "Resend code"}
            </LinkText>
          )}
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button
            phEvent="Verify Email OTP"
            type="submit"
            disabled={busy}
            loading={authBusy === "email-verify"}
          >
            {authBusy === "email-verify" ? "Verifying" : "Verify email"}
          </Button>
        </form>
      )}

      {/* PAN + NAME + DOB */}
      {screen === "pan" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitPanDetails)}>
          {heading("Add your PAN details", "Enter your name exactly as it appears on your PAN card.")}
          <FieldInput
            label="Full name (as on PAN)"
            autoComplete="name"
            value={panName}
            error={errorFor("panName")}
            errorKey={errorTick}
            onChange={(e) => {
              setPanName(e.target.value);
              setAuthError("");
            }}
          />
          <FieldRow>
            <FieldInput
              label="PAN"
              placeholder="ABCDE1234F"
              maxLength={10}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="uppercase"
              value={panNumber}
              error={errorFor("pan")}
              errorKey={errorTick}
              onChange={(e) => {
                setPanNumber(normalizePan(e.target.value));
                setAuthError("");
              }}
            />
            <FieldInput
              label="Date of birth"
              type="date"
              max={maxDobIso}
              hint="You must be 18 or older."
              value={dob}
              error={errorFor("dob")}
              errorKey={errorTick}
              onChange={(e) => {
                setDob(e.target.value);
                setAuthError("");
              }}
            />
          </FieldRow>
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button phEvent="Submit PAN" type="submit" disabled={busy} loading={authBusy === "pan"}>
            {authBusy === "pan" ? "Checking your PAN" : "Verify PAN"}
          </Button>
        </form>
      )}

      {/* KYC EXTRA QUESTIONS */}
      {screen === "kyc" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitKycExtra)}>
          {heading("A few details for KYC", "We need these to complete your KYC.")}
          {kycPath !== "compliant" && (
            <>
              <FieldInput
                label="Father's name"
                autoComplete="off"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
              />
              <FieldRow>
                <FieldSelect label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </FieldSelect>
                <FieldSelect
                  label="Marital status"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="unmarried">Unmarried</option>
                  <option value="married">Married</option>
                </FieldSelect>
              </FieldRow>
            </>
          )}
          <FieldSelect label="Income" value={incomeSlab} onChange={(e) => setIncomeSlab(e.target.value)}>
            <option value="">Select your income</option>
            {INCOME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
            <option value="">Select occupation</option>
            {OCCUPATION_COMPLIANT.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect
            label="Source of wealth"
            value={sourceOfWealth}
            onChange={(e) => setSourceOfWealth(e.target.value)}
          >
            <option value="">Select source of wealth</option>
            {SOURCE_OF_WEALTH.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </FieldSelect>
          <Checkbox checked={pep} onChange={() => setPep((v) => !v)}>
            I am not a politically exposed person
          </Checkbox>
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button phEvent="Continue KYC" type="submit" disabled={busy} loading={authBusy === "kyc-extra"}>
            {authBusy === "kyc-extra" ? "Saving" : "Continue"}
          </Button>
        </form>
      )}

      {/* DIGILOCKER */}
      {screen === "digilocker" && (
        <div className="flex flex-col gap-5">
          {heading(
            "Verify with DigiLocker",
            "Link your Aadhaar through DigiLocker to continue KYC. It opens in a new window; come back here when you're done.",
          )}
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button
            phEvent="Start DigiLocker"
            onClick={startDigiLocker}
            disabled={busy}
            loading={authBusy === "digilocker" || authBusy === "modify-start"}
          >
            {authBusy === "digilocker" ? "Waiting for DigiLocker" : "Open DigiLocker"}
          </Button>
        </div>
      )}

      {/* SIGNATURE */}
      {screen === "signature" && (
        <div className="flex flex-col gap-5">
          {heading(
            "Draw your signature",
            "Sign inside the box with your finger or mouse. It goes on your KYC form.",
          )}
          <SignaturePad
            onChange={({ base64, blank }) => {
              setSignatureB64(base64);
              setSignatureBlank(blank);
              setAuthError("");
            }}
          />
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button
            phEvent="Submit Signature"
            onClick={submitSignatureAndNsdl}
            disabled={busy}
            loading={authBusy === "signature" || authBusy === "nsdl"}
          >
            {authBusy === "signature" || authBusy === "nsdl" ? "Preparing e-sign" : "Continue to e-sign"}
          </Button>
        </div>
      )}

      {/* NSDL STATUS */}
      {screen === "nsdl" && (
        <div className="flex flex-col gap-5">
          {heading(
            "Aadhaar e-sign",
            authBusy === "nsdl"
              ? "Finish the e-sign in the window that opened."
              : "If the e-sign window closed early, open it again.",
          )}
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button phEvent="NSDL eSign" onClick={runNsdlEsign} disabled={busy} loading={authBusy === "nsdl"}>
            {authBusy === "nsdl" ? "Waiting for e-sign" : "Open e-sign"}
          </Button>
        </div>
      )}

      {/* E-SIGN bridge */}
      {screen === "esign" && (
        <div className="flex flex-col gap-5">
          {heading("Almost done", "Add your bank account to finish.")}
          <Button phEvent="Continue" onClick={() => go("bank")}>
            Add bank account
          </Button>
        </div>
      )}

      {/* BANK */}
      {screen === "bank" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(submitBank)}>
          {heading("Add your bank account")}
          <div className="flex flex-col gap-2">
            <FieldInput
              label="IFSC"
              hint="It's on your cheque book or bank passbook."
              className="uppercase"
              maxLength={11}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              value={ifsc}
              error={errorFor("ifsc") || (!ifscLookupBusy ? ifscLookupError : "")}
              errorKey={errorTick}
              onChange={(e) => {
                setIfsc(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 11),
                );
                setAuthError("");
              }}
            />
            {ifscLookupBusy && (
              <p role="status" className="text-sm text-grey-600">
                Looking up the branch…
              </p>
            )}
            {!ifscLookupBusy && ifscInfo && (
              <div className="flex gap-3 rounded-card bg-mist px-4 py-3">
                <CheckIcon className="mt-1 size-4 shrink-0 text-emerald" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {[ifscInfo.bank, ifscInfo.branch].filter(Boolean).join(", ")}
                  </p>
                  {(ifscInfo.city || ifscInfo.state) && (
                    <p className="mt-0.5 text-sm text-grey-600">
                      {[ifscInfo.city, ifscInfo.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {ifscInfo.address && (
                    <p className="mt-0.5 break-words text-sm leading-relaxed text-grey-600">
                      {ifscInfo.address}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <span aria-hidden="true" className="text-sm font-semibold text-ink [font-stretch:104%]">
              Account type
            </span>
            <SegmentedControl
              label="Account type"
              options={ACCOUNT_TYPES}
              value={accountType}
              onChange={(next) => {
                setAccountType(next);
                setAuthError("");
              }}
              className="grid max-w-xs grid-cols-2"
            />
          </div>
          <FieldRow>
            <FieldInput
              label="Account number"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              maxLength={18}
              value={accountNumber}
              error={errorFor("accountNumber")}
              errorKey={errorTick}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18));
                setAuthError("");
              }}
            />
            <FieldInput
              label="Confirm account number"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              maxLength={18}
              value={confirmAccountNumber}
              error={errorFor("confirmAccountNumber")}
              errorKey={errorTick}
              onChange={(e) => {
                setConfirmAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 18));
                setAuthError("");
              }}
            />
          </FieldRow>
          <div className="border-t border-line pt-3">
            <Checkbox checked={nomineeOptOut} onChange={() => setNomineeOptOut((v) => !v)}>
              I don&apos;t want to add a nominee
            </Checkbox>
          </div>
          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button
            phEvent="Submit Bank"
            type="submit"
            disabled={busy}
            loading={authBusy === "bank" || authBusy === "nominee"}
          >
            {authBusy === "bank"
              ? "Verifying your account"
              : authBusy === "nominee"
                ? "Saving"
                : "Add bank account"}
          </Button>
        </form>
      )}

      {/* NOMINEE */}
      {screen === "nominee" && (
        <form noValidate className="flex flex-col gap-5" onSubmit={submitWith(() => submitNominee())}>
          {heading("Add a nominee", "The person your investments go to if something happens to you.")}
          <Checkbox
            checked={nomineeOptOut}
            onChange={() => {
              setNomineeOptOut((v) => !v);
              setAuthError("");
            }}
          >
            I don&apos;t want to add a nominee
          </Checkbox>

          {!nomineeOptOut && (
            <>
              <FieldInput
                label="Nominee's full name"
                autoComplete="off"
                value={nomineeName}
                onChange={(e) => {
                  setNomineeName(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
                  setAuthError("");
                }}
              />
              <FieldRow>
                <FieldInput
                  label="Date of birth"
                  type="date"
                  max={todayIso}
                  value={nomineeDob}
                  onChange={(e) => {
                    const next = e.target.value;
                    setNomineeDob(next && next > todayIso ? todayIso : next);
                    setAuthError("");
                  }}
                />
                <FieldSelect
                  label="Relationship"
                  value={nomineeRelation}
                  onChange={(e) => {
                    setNomineeRelation(e.target.value);
                    setAuthError("");
                  }}
                >
                  <option value="">Select relationship</option>
                  {NOMINEE_RELATIONS.map((rel) => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </FieldSelect>
              </FieldRow>

              {nomineeIsMinor && (
                <>
                  <p className="flex gap-3 rounded-card bg-marigold-tint px-4 py-3 text-sm leading-relaxed text-ink">
                    <i
                      aria-hidden="true"
                      className="mt-0.5 block h-3.5 w-1.5 shrink-0 -rotate-[38deg] rounded-full bg-marigold"
                    />
                    Your nominee is under 18, so add a guardian.
                  </p>
                  <FieldInput
                    label="Guardian's full name"
                    autoComplete="off"
                    value={guardianName}
                    onChange={(e) => {
                      setGuardianName(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
                      setAuthError("");
                    }}
                  />
                  <FieldSelect
                    label="Guardian's relationship to the nominee"
                    value={guardianRelation}
                    onChange={(e) => {
                      setGuardianRelation(e.target.value);
                      setAuthError("");
                    }}
                  >
                    <option value="">Select relationship</option>
                    {NOMINEE_RELATIONS.map((rel) => (
                      <option key={rel.value} value={rel.value}>
                        {rel.label}
                      </option>
                    ))}
                  </FieldSelect>
                </>
              )}
            </>
          )}

          <ErrorNote tick={errorTick}>{generalError}</ErrorNote>
          <Button phEvent="Submit Nominee" type="submit" disabled={busy} loading={authBusy === "nominee"}>
            {authBusy === "nominee"
              ? "Saving"
              : nomineeOptOut
                ? "Continue without a nominee"
                : "Save nominee"}
          </Button>
        </form>
      )}
    </>
  );

  const modal = (
    <KycModal
      open={kycModalOpen}
      status={kycPath}
      title={kycModalCopy.title}
      subtitle={kycModalCopy.subtitle}
      cta={kycModalCopy.cta}
      onComplete={continueAfterKycModal}
    />
  );

  // Inside /dashboard: the dashboard is the frame, so no layout of our own.
  if (embedded) {
    return (
      <div className="pb-16 pt-2">
        <div className="mb-5">
          <BackButton onClick={exitToDashboard}>Back to dashboard</BackButton>
        </div>
        {!screen && (
          <p role="status" className="flex items-center gap-3 pt-2 text-sm text-grey-600">
            {!authError && (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-jade border-r-transparent motion-reduce:animate-none"
              />
            )}
            {authError || (authBusy ? "Loading your KYC steps…" : "Preparing KYC…")}
          </p>
        )}
        {AUTH_ENTRY_SCREENS.has(screen) && (
          <div className="flex flex-col gap-8">
            <div>{entryHeading}</div>
            {entryForm}
          </div>
        )}
        {stepHeader}
        {stepScreens}
        {modal}
      </div>
    );
  }

  if (AUTH_ENTRY_SCREENS.has(screen)) {
    return (
      <AuthLayout heading={entryHeading} aside={<AuthAside mode={authKey} plan={plan} />}>
        {entryForm}
      </AuthLayout>
    );
  }

  return (
    <>
      <FocusLayout>
        {stepHeader}
        {stepScreens}
      </FocusLayout>
      {modal}
    </>
  );
}
