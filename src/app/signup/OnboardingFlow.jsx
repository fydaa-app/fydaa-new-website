"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Stepper from './components/Stepper';
import KycModal from './components/KycModal';
import {
  Overline, PageHeading, PageSub, Button, OutlineButton, LinkText, FieldInput, FieldSelect, FieldRow,
  CodeInputs, Chip, Checkbox, QuestionCard, ScoreRing,
  RiskIcon, EnvelopeIcon, DocIcon, ShieldIcon, BackIcon, CheckIcon, GoogleIcon, AppleIcon,
} from './components/UI';
import SignaturePad from './components/SignaturePad';
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
} from './lib/authApi';
import { captureEvent } from '../../lib/posthog';
import { isValidEmail } from './lib/emailValidation';
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
} from './lib/kycApi';
import { getEmailFromApple, getEmailFromGoogle } from './lib/oauthEmail';
import { assignAdvisorAfterOtp } from '../dashboard/lib/crmApi';
import {
  isAdultDob,
  isValidPan,
  maxDobForMinAge,
  normalizePan,
  toIsoDate,
} from './lib/panValidation';

/**
 * Fydaa — auth + KYC onboarding (Web)
 * Auth: mobile → OTP → create 4-digit PIN → home
 * Risk quiz opens when KYC starts (isRiskProfileComplete false), not after create PIN.
 */

const STEP_MAP = {
  risk: { s: 1, p: null, h: 'Just a few steps to tailor your financial journey' },
  score: { s: 1, p: [1, 1], h: 'Your risk profile is ready' },
  email: { s: 1, p: null, h: 'Get your risk profile report and financial insights' },
  emailotp: { s: 1, p: null, h: 'Get your risk profile report and financial insights' },
  pan: { s: 2, p: null, h: "You're one step away" },
  kyc: { s: 2, p: null, h: "You're one step away" },
  digilocker: { s: 2, p: null, h: "You're one step away" },
  signature: { s: 3, p: null, h: "You're one step away" },
  nsdl: { s: 3, p: null, h: "You're one step away" },
  esign: { s: 3, p: null, h: "You're one step away" },
  bank: { s: 4, p: null, h: null },
  nominee: { s: 4, p: null, h: null },
};

const BACK_MAP = {
  otp: 'mobile',
  email: 'score', emailotp: 'email',
  digilocker: 'kyc', signature: 'digilocker', nsdl: 'signature',
  bank: 'esign', nominee: 'bank',
};

/** Mobile + OTP keep the marketing navbar; PIN and KYC screens hide it. */
const AUTH_ENTRY_SCREENS = new Set(['mobile', 'otp']);
const KYC_NAV_EVENT = 'fydaa-onboarding-nav';

const RELATIONS = NOMINEE_RELATIONS.map((r) => r.label);

function AccountSwitch({ isLogin }) {
  return (
    <p className="text-center text-[15px] mt-6">
      <span className="text-neutral-500">
        {isLogin ? 'New to Fydaa? ' : 'Already have an account? '}
      </span>
      <Link href={isLogin ? '/signup' : '/login'} className="font-semibold text-[#0C4A3E]">
        {isLogin ? 'Sign up' : 'Log in'}
      </Link>
    </p>
  );
}

export default function OnboardingFlow({
  mode = 'signup',
  embedded = false,
  start = null,
  onExit = null,
  onComplete = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState(embedded ? '' : 'mobile');
  const [pep, setPep] = useState(false);
  const [esignAgree, setEsignAgree] = useState(false);
  const [esignSigned, setEsignSigned] = useState(false);
  const [nomineeOptOut, setNomineeOptOut] = useState(false);
  const [nomineeRelation, setNomineeRelation] = useState('');
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycPath, setKycPath] = useState('compliant'); // compliant | noncompliant | modify
  const [kycNotice, setKycNotice] = useState('');
  const [modifyFormId, setModifyFormId] = useState('');
  const [panName, setPanName] = useState('');
  const [incomeSlab, setIncomeSlab] = useState('');
  const [occupation, setOccupation] = useState('');
  const [sourceOfWealth, setSourceOfWealth] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [signatureB64, setSignatureB64] = useState('');
  const [signatureBlank, setSignatureBlank] = useState(true);
  const [ifsc, setIfsc] = useState('');
  const [ifscInfo, setIfscInfo] = useState(null);
  const [ifscLookupBusy, setIfscLookupBusy] = useState(false);
  const [ifscLookupError, setIfscLookupError] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeDob, setNomineeDob] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [createPinValue, setCreatePinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSetupType, setPinSetupType] = useState('NEW_USER');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [storedReferral, setStoredReferral] = useState('');
  const [resendReadyAt, setResendReadyAt] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [riskIndex, setRiskIndex] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState([]);
  const [riskSel, setRiskSel] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [riskBand, setRiskBand] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailResendReadyAt, setEmailResendReadyAt] = useState(0);
  const [emailResendSecs, setEmailResendSecs] = useState(0);
  const [panNumber, setPanNumber] = useState('');
  const [dob, setDob] = useState('');
  const maxDobIso = toIsoDate(maxDobForMinAge(18));
  const todayIso = toIsoDate(new Date());
  const nomineeIsMinor = Boolean(nomineeDob) && !isAdultDob(nomineeDob, 18);

  const go = (next) => {
    setAuthError('');
    setScreen(next);
  };

  useEffect(() => {
    if (!screen) return;
    captureEvent('webapp_onboarding_screen', {
      screen,
      mode: mode || (embedded ? 'embedded' : 'signup'),
    });
  }, [screen, mode, embedded]);

  const bankNext = () => (nomineeOptOut ? submitNominee() : go('nominee'));

  const restart = () => {
    setScreen('mobile');
    setPep(false);
    setEsignAgree(false);
    setEsignSigned(false);
    setNomineeOptOut(false);
    setNomineeRelation('father');
    setKycModalOpen(false);
    setKycPath('compliant');
    setKycNotice('');
    setModifyFormId('');
    setPanName('');
    setIncomeSlab('');
    setOccupation('');
    setSourceOfWealth('');
    setFatherName('');
    setGender('');
    setMaritalStatus('');
    setSignatureB64('');
    setSignatureBlank(true);
    setIfsc('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    setAccountType('savings');
    setNomineeName('');
    setNomineeDob('');
    setGuardianName('');
    setGuardianRelation('');
    setMobile('');
    setPin('');
    setCreatePinValue('');
    setConfirmPin('');
    setOtp('');
    setAuthError('');
    setShowReferral(false);
    setReferralInput('');
    setStoredReferral('');
    setResendReadyAt(0);
    setQuestions([]);
    setRiskIndex(0);
    setRiskAnswers([]);
    setRiskSel(null);
    setRiskScore(0);
    setRiskBand('');
    setEmail('');
    setEmailOtp('');
    setEmailResendReadyAt(0);
    setEmailResendSecs(0);
    setPanNumber('');
    setDob('');
  };

  const mobileNumber = mobile.replace(/\D/g, '').slice(0, 10);
  const goHome = () => {
    // Finished KYC steps successfully — may resume invest flow.
    if (typeof onComplete === 'function') {
      onComplete();
      return;
    }
    if (typeof onExit === 'function') {
      onExit();
      return;
    }
    router.push('/dashboard');
  };
  const exitToDashboard = () => {
    // Explicit "Back to dashboard" — always leave KYC, do not resume invest.
    if (typeof onExit === 'function') {
      onExit();
      return;
    }
    router.push('/dashboard');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const notice = sessionStorage.getItem('fydaa-auth-notice');
    const savedMobile = sessionStorage.getItem('fydaa-auth-mobile');
    if (notice) {
      sessionStorage.removeItem('fydaa-auth-notice');
      setAuthError(notice);
    }
    if (savedMobile && mode === 'login') {
      sessionStorage.removeItem('fydaa-auth-mobile');
      setMobile(savedMobile);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Keep dashboard chrome when KYC runs inside /dashboard.
    if (embedded) {
      document.body.classList.remove('fydaa-hide-site-chrome');
      window.dispatchEvent(new CustomEvent(KYC_NAV_EVENT, { detail: { hideNav: false } }));
      return undefined;
    }
    const hideNav = Boolean(screen) && !AUTH_ENTRY_SCREENS.has(screen);
    document.body.classList.toggle('fydaa-hide-site-chrome', hideNav);
    window.dispatchEvent(new CustomEvent(KYC_NAV_EVENT, { detail: { hideNav } }));
    return () => {
      document.body.classList.remove('fydaa-hide-site-chrome');
      window.dispatchEvent(new CustomEvent(KYC_NAV_EVENT, { detail: { hideNav: false } }));
    };
  }, [screen, embedded]);

  useEffect(() => {
    if (!searchParams) return;
    const keys = ['referredBy', 'referralCode', 'referral_code', 'ref_code', 'ref'];
    for (const key of keys) {
      const value = searchParams.get(key)?.trim();
      if (value) {
        setStoredReferral(value);
        break;
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (screen !== 'emailotp' || !emailResendReadyAt) {
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

  async function loadRiskResult() {
    const indicators = await getRiskIndicators();
    const score = scoreFromIndicators(indicators);
    setRiskScore(score);
    setRiskBand(bandFromIndicators(indicators));
    go('score');
  }

  async function startRiskQuestionnaire() {
    setAuthBusy('risk');
    setAuthError('');
    try {
      const list = await getRiskQuestionnaire();
      if (!list.length) throw new Error('Could not load risk questions.');
      setQuestions(list);
      setRiskIndex(0);
      setRiskAnswers([]);
      setRiskSel(null);
      go('risk');
    } catch (err) {
      setAuthError(err.message || 'Could not load risk questions.');
    } finally {
      setAuthBusy('');
    }
  }

  useEffect(() => {
    if (mode === 'login') return;
    const startKey = start || searchParams?.get('start');
    if (startKey !== 'risk') return;
    if (!getAccessToken()) return;
    // Logged-in KYC/risk always runs inside dashboard (sidebar + back).
    if (!embedded) {
      router.replace('/dashboard?start=risk');
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setAuthBusy('risk');
      setAuthError('');
      try {
        const list = await getRiskQuestionnaire();
        if (cancelled) return;
        if (!list.length) throw new Error('Could not load risk questions.');
        setQuestions(list);
        setRiskIndex(0);
        setRiskAnswers([]);
        setRiskSel(null);
        go('risk');
      } catch (err) {
        if (!cancelled) setAuthError(err.message || 'Could not load risk questions.');
      } finally {
        if (!cancelled) setAuthBusy('');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, searchParams, start, embedded]);

  async function routeAfterKycStage(stage) {
    // §2.2 resume order
    if (isTruthyFlag(stage?.ismodify)) {
      setKycPath('modify');
      if (isTruthyFlag(stage?.ismodifynsdl)) {
        if (!isTruthyFlag(stage?.isBank)) {
          go('bank');
          return;
        }
        if (!isTruthyFlag(stage?.isNominee)) {
          go('nominee');
          return;
        }
        goHome();
        return;
      }
      if (!isTruthyFlag(stage?.ismodifydigilocker)) {
        go('digilocker');
        return;
      }
      if (!isTruthyFlag(stage?.ismodifyquestions)) {
        go('kyc');
        return;
      }
      if (!isTruthyFlag(stage?.ismodifyesign) || !isTruthyFlag(stage?.ismodifynsdl)) {
        go('signature');
        return;
      }
      goHome();
      return;
    }

    if (isTruthyFlag(stage?.isKycExpired)) {
      go('pan');
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
      go('pan');
      return;
    }

    if (isTruthyFlag(stage?.isKycCompliant)) {
      setKycPath('compliant');
      if (!isTruthyFlag(stage?.kycExtraData)) {
        go('kyc');
        return;
      }
      if (!isTruthyFlag(stage?.isBank)) {
        go('bank');
        return;
      }
      if (!isTruthyFlag(stage?.isNominee)) {
        go('nominee');
        return;
      }
      goHome();
      return;
    }

    // Non-compliant (or fresh)
    setKycPath('noncompliant');
    if (!isTruthyFlag(stage?.isNonCompliantData) || !isTruthyFlag(stage?.isDigiLocker)) {
      if (!isTruthyFlag(stage?.isNonCompliantData)) {
        go('kyc');
        return;
      }
      go('digilocker');
      return;
    }
    if (!isTruthyFlag(stage?.isNSDL)) {
      go('signature');
      return;
    }
    if (!isTruthyFlag(stage?.isBank)) {
      go('bank');
      return;
    }
    if (!isTruthyFlag(stage?.isNominee)) {
      go('nominee');
      return;
    }
    goHome();
  }

  async function routeAfterAuth() {
    const stage = await getUserStage();
    const type = resolvePinSetupType(stage);
    setPinSetupType(type);
    if (type === 'NEW_USER' || type === 'LEGACY_MIGRATION') {
      setCreatePinValue('');
      setConfirmPin('');
      go('pin');
      return;
    }
    // PIN exists but signup incomplete → resume at first remaining step
    if (!isSignupComplete(stage)) {
      await routeAfterKycStage(stage);
      return;
    }
    // Fully registered → login with PIN
    clearTokens();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'fydaa-auth-notice',
        'This number is already registered. Please log in with your PIN.'
      );
      if (mobileNumber) sessionStorage.setItem('fydaa-auth-mobile', mobileNumber);
    }
    router.replace('/login');
  }

  useEffect(() => {
    const code = ifsc.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code)) {
      setIfscInfo(null);
      setIfscLookupBusy(false);
      setIfscLookupError(code.length === 11 ? 'Enter a valid IFSC (e.g. HDFC0001234).' : '');
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setIfscLookupBusy(true);
      setIfscLookupError('');
      try {
        const info = await lookupIfsc(code);
        if (!cancelled) {
          setIfscInfo(info);
          setIfscLookupError('');
        }
      } catch (err) {
        if (!cancelled) {
          setIfscInfo(null);
          setIfscLookupError(err.message || 'Could not fetch branch details.');
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
    if (mode === 'login') return;
    const startKey = start || searchParams?.get('start');
    if (startKey !== 'kyc') return;
    if (!getAccessToken()) return;
    // Logged-in KYC always runs inside dashboard (sidebar + back).
    if (!embedded) {
      router.replace('/dashboard?start=kyc');
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setAuthBusy('kyc');
      setAuthError('');
      try {
        const stage = await getUserStage();
        if (!cancelled) await routeAfterKycStage(stage);
      } catch (err) {
        if (!cancelled) setAuthError(err.message || 'Could not load your KYC stage.');
      } finally {
        if (!cancelled) setAuthBusy('');
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, searchParams, start, embedded]);

  async function submitSignupMobile() {
    if (mobileNumber.length !== 10) {
      setAuthError('Enter a 10-digit mobile number.');
      return;
    }
    setAuthBusy('otp-request');
    setAuthError('');
    const typed = referralInput.trim();
    const referredBy = storedReferral || typed || undefined;
    try {
      const check = await checkMobile(mobileNumber);
      if (check?.exists === true) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'fydaa-auth-notice',
            'This number is already registered. Please log in.'
          );
          sessionStorage.setItem('fydaa-auth-mobile', mobileNumber);
        }
        router.replace('/login');
        return;
      }
      await requestOtp({ mobileNumber, referredBy });
      if (typed) setStoredReferral(typed);
      setResendReadyAt(Date.now() + 30000);
      setOtp('');
      go('otp');
    } catch (err) {
      setAuthError(err.message || 'Something went wrong, try again after sometime.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitLoginPin() {
    if (mobileNumber.length !== 10) {
      setAuthError('Enter a 10-digit mobile number.');
      return;
    }
    if (pin.length !== 4) {
      setAuthError('Enter your 4-digit PIN.');
      return;
    }
    setAuthBusy('pin');
    setAuthError('');
    try {
      await verifyPin({ mobileNumber, pin });
      await requestOtp({
        mobileNumber,
        referredBy: storedReferral || undefined,
      });
      setOtp('');
      setResendReadyAt(Date.now() + 30000);
      go('otp');
    } catch (err) {
      setAuthError(err.message || 'Could not verify PIN.');
    } finally {
      setAuthBusy('');
    }
  }

  async function finishLoginAfterOtp() {
    // Login always lands on dashboard; KYC continues only from signup.
    goHome();
  }

  async function submitSignupOtp() {
    if (otp.length !== 6) {
      setAuthError('Enter the 6-digit OTP.');
      return;
    }
    setAuthBusy('otp');
    setAuthError('');
    try {
      const verified = await verifyOtp({ mobileNumber, otp });
      // Same token save for signup and login: data.accessToken → localStorage.
      storeTokens(verified);
      // Map advisor / RM in CRM (login + signup). Non-blocking.
      await assignAdvisorAfterOtp();
      if (mode === 'login') {
        await finishLoginAfterOtp();
        return;
      }
      await routeAfterAuth();
    } catch (err) {
      setAuthError(err.message || 'Could not verify OTP.');
    } finally {
      setAuthBusy('');
    }
  }

  async function resendSignupOtp() {
    if (authBusy) return;
    if (Date.now() < resendReadyAt) {
      const secs = Math.ceil((resendReadyAt - Date.now()) / 1000);
      setAuthError(`You can resend OTP in ${secs}s.`);
      return;
    }
    setAuthBusy('resend');
    setAuthError('');
    try {
      await requestOtp({
        mobileNumber,
        referredBy: storedReferral || undefined,
      });
      setResendReadyAt(Date.now() + 30000);
    } catch (err) {
      setAuthError(err.message || 'Something went wrong, try again after sometime.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitCreatePin() {
    if (createPinValue.length !== 4) {
      setAuthError('Enter a 4-digit PIN.');
      return;
    }
    if (createPinValue !== confirmPin) {
      setAuthError('PINs do not match.');
      return;
    }
    setAuthBusy('create-pin');
    setAuthError('');
    try {
      await createPinApi({ pin: createPinValue, confirmPin });
      goHome();
    } catch (err) {
      setAuthError(err.message || 'Could not create PIN.');
    } finally {
      setAuthBusy('');
    }
  }

  async function continueAfterEmailLinked() {
    const stage = await getUserStage();
    if (!isTruthyFlag(stage?.isEmail)) {
      throw new Error('Email verification did not complete. Please try again.');
    }
    go('pan');
  }

  async function submitRequestEmailOtp() {
    const nextEmail = email.trim();
    if (!isValidEmail(nextEmail)) {
      setAuthError('Enter a valid email address.');
      return;
    }
    setAuthBusy('email-request');
    setAuthError('');
    try {
      await requestLinkEmail({ email: nextEmail });
      setEmail(nextEmail);
      setEmailOtp('');
      setEmailResendReadyAt(Date.now() + 30000);
      go('emailotp');
    } catch (err) {
      setAuthError(err.message || 'Something went wrong, try again after sometime.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitVerifyEmailOtp() {
    if (emailOtp.length !== 6) {
      setAuthError('Enter the 6-digit verification code.');
      return;
    }
    setAuthBusy('email-verify');
    setAuthError('');
    try {
      await verifyLinkEmail({ email: email.trim(), otp: emailOtp });
      await continueAfterEmailLinked();
    } catch (err) {
      setAuthError(err.message || 'Something went wrong, try again after sometime.');
    } finally {
      setAuthBusy('');
    }
  }

  async function resendEmailOtp() {
    if (authBusy) return;
    if (Date.now() < emailResendReadyAt) return;
    setAuthBusy('email-resend');
    setAuthError('');
    try {
      await requestLinkEmail({ email: email.trim() });
      setEmailResendReadyAt(Date.now() + 30000);
    } catch (err) {
      setAuthError(err.message || 'Something went wrong, try again after sometime.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitOAuthEmail(provider) {
    setAuthBusy(provider === 'GOOGLE' ? 'google' : 'apple');
    setAuthError('');
    try {
      const oauthEmail = provider === 'GOOGLE' ? await getEmailFromGoogle() : await getEmailFromApple();
      setEmail(oauthEmail);
      await linkEmail({ email: oauthEmail, provider });
      await continueAfterEmailLinked();
    } catch (err) {
      setAuthError(err.message || 'Something went wrong, try again after sometime.');
    } finally {
      setAuthBusy('');
    }
  }

  function submitPanDetails() {
    const pan = normalizePan(panNumber);
    if (!isValidPan(pan)) {
      setAuthError('Enter a valid PAN (e.g. ABCDE1234F).');
      return;
    }
    if (!isValidFullName(panName)) {
      setAuthError('Enter your full name as on PAN (letters only).');
      return;
    }
    if (!dob) {
      setAuthError('Select your date of birth.');
      return;
    }
    if (!isAdultDob(dob, 18)) {
      setAuthError('You must be at least 18 years old.');
      return;
    }
    setPanNumber(pan);
    setAuthError('');
    void runPanLookup(pan, toTitleCaseName(panName), dob);
  }

  async function runPanLookup(pan, name, date_of_birth) {
    setAuthBusy('pan');
    setAuthError('');
    setKycNotice('');
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
      const reason = String(nested?.reason || '').toLowerCase();

      if (action === 'modify' && reason === 'legacy') {
        window.open('https://digital.camsonline.com/kycmodification', '_blank', 'noopener,noreferrer');
        setAuthError(nested?.message || 'Please update your KYC on the KRA portal.');
        return;
      }

      if (isPanMismatch(data)) {
        setAuthError(mismatchMessage(data));
        return;
      }

      if (action === 'modify') {
        setKycPath('modify');
        setKycNotice(
          nested?.message ||
            nested?.reason ||
            'Your KYC needs to be updated. Tap below to proceed.'
        );
        setKycModalOpen(true);
        return;
      }

      if (action === 'create' || isNoKycRecord(data)) {
        await initiateKyc();
        setKycPath('noncompliant');
        setKycNotice('Your KYC is not compliant. Please complete the next steps.');
        setKycModalOpen(true);
        return;
      }

      if (
        (res.status === 400 || data?.error === true || data?.status === false) &&
        !isNoKycRecord(data)
      ) {
        setAuthError(mismatchMessage(data) || 'Could not verify PAN. Please try again.');
        return;
      }

      const stage = await getUserStage();
      if (isTruthyFlag(stage?.ismodify) && !isTruthyFlag(stage?.ismodifynsdl)) {
        setKycPath('modify');
        setKycNotice(nested?.message || 'Your KYC needs to be updated.');
        setKycModalOpen(true);
        return;
      }
      if (isTruthyFlag(stage?.isKycCompliant)) {
        setKycPath('compliant');
        setKycNotice('Your KYC is compliant');
        setKycModalOpen(true);
        return;
      }

      await initiateKyc();
      setKycPath('noncompliant');
      setKycNotice('Your KYC is not compliant. Please complete the next steps.');
      setKycModalOpen(true);
    } catch (err) {
      if (err?.status === 401) {
        clearTokens();
        router.replace('/login');
        return;
      }
      setAuthError(err.message || 'Could not verify PAN. Please try again.');
    } finally {
      setAuthBusy('');
    }
  }

  async function continueAfterKycModal() {
    setKycModalOpen(false);
    if (kycPath === 'modify') {
      setAuthBusy('modify-start');
      setAuthError('');
      try {
        const form = await createModifyKycForm({
          pan: panNumber,
          name: toTitleCaseName(panName),
          date_of_birth: dob,
          proof_details_callback_url: 'https://fydaa.com/kyc-modify?proof=callback',
          esign_callback_url: 'https://fydaa.com/kyc-modify?esign=callback',
        });
        if (form?.id) setModifyFormId(form.id);
        const proofStatus = String(form?.proof_details?.status || '').toLowerCase();
        const proofDone = ['fetched', 'successful', 'success', 'completed', 'verified'].includes(proofStatus);
        const fetchUrl = form?.proof_details?.fetch_url;
        // Already fetched with no link → skip DigiLocker screen and go to questions.
        if (!fetchUrl && proofDone) {
          go('kyc');
        } else {
          go('digilocker');
        }
      } catch (err) {
        setAuthError(err.message || 'Could not start KYC update.');
        go('digilocker');
      } finally {
        setAuthBusy('');
      }
      return;
    }
    go('kyc');
  }

  async function submitKycExtra() {
    if (!incomeSlab || !occupation || !sourceOfWealth) {
      setAuthError('Please fill income, occupation, and source of wealth.');
      return;
    }
    if (!pep) {
      setAuthError('Please confirm you are not a politically exposed person.');
      return;
    }
    setAuthBusy('kyc-extra');
    setAuthError('');
    try {
      if (kycPath === 'modify') {
        if (!fatherName.trim() || !gender || !maritalStatus) {
          setAuthError('Please fill father\'s name, gender, and marital status.');
          setAuthBusy('');
          return;
        }
        let formId = modifyFormId;
        if (!formId) {
          const current = await getCurrentKycForm();
          formId = current?.id || '';
          if (formId) setModifyFormId(formId);
        }
        if (!formId) throw new Error('KYC form not ready. Restart modify KYC.');
        const occMap = {
          private_sector: 'private_sector_service',
          government_sector: 'government_service',
          public_sector: 'government_service',
        };
        await patchKycForm(formId, {
          father_name: toTitleCaseName(fatherName),
          gender,
          marital_status: maritalStatus,
          income_slab: incomeSlab,
          occupation_type: occMap[occupation] || occupation,
          source_of_wealth: sourceOfWealth,
          geolocation: { latitude: 9.354, longitude: 77.453 },
          pep_details: 'no_exposure',
          address: {
            line_1: 'As per DigiLocker',
            line_2: 'As per DigiLocker',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560001',
          },
          residential_status: 'resident',
          country_of_birth: 'in',
          place_of_birth: 'in',
          citizenship_countries: ['in'],
          nationality_country: 'in',
          tax_residency_other_than_india: false,
        });
        go('signature');
      } else if (kycPath === 'noncompliant') {
        if (!fatherName.trim() || !gender || !maritalStatus) {
          setAuthError('Please fill father\'s name, gender, and marital status.');
          setAuthBusy('');
          return;
        }
        let latitude = 0;
        let longitude = 0;
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          const coords = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              () => reject(new Error('Enable location services to continue KYC.')),
              { timeout: 15000 }
            );
          });
          latitude = Number(coords.latitude.toFixed(6));
          longitude = Number(coords.longitude.toFixed(6));
        } else {
          throw new Error('Enable location services to continue KYC.');
        }
        await saveNonCompliantRequest({
          father_name: toTitleCaseName(fatherName),
          gender,
          marital_status: maritalStatus,
          income_slab: incomeSlab,
          occupation_type: occupation,
          source_of_wealth: sourceOfWealth,
          geolocation: { latitude, longitude },
          pep_details: 'not_applicable',
        });
        go('digilocker');
      } else {
        await saveKycExtra({
          income_slab: incomeSlab,
          occupation,
          pep_details: 'not_applicable',
          source_of_wealth: sourceOfWealth,
        });
        const stage = await getUserStage();
        if (!isTruthyFlag(stage?.isBank)) {
          go('bank');
        } else if (!isTruthyFlag(stage?.isNominee)) {
          go('nominee');
        } else {
          goHome();
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Could not save details.');
    } finally {
      setAuthBusy('');
    }
  }

  async function startDigiLocker() {
    setAuthBusy('digilocker');
    setAuthError('');
    try {
      if (kycPath === 'modify') {
        let formId = modifyFormId;
        if (!formId) {
          const current = await getCurrentKycForm();
          formId = current?.id || '';
        }
        const { form, url } = await waitForModifyDigiLockerUrl(formId);
        if (form?.id) setModifyFormId(form.id);
        const proofStatus = String(form?.proof_details?.status || '').toLowerCase();
        const proofDone = ['fetched', 'successful', 'success', 'completed', 'verified'].includes(proofStatus);
        // Cybrilla often marks proof "fetched" with null fetch_url — DigiLocker already done.
        if (!url && proofDone) {
          go('kyc');
          return;
        }
        if (!url) {
          throw new Error('DigiLocker link not ready. Please try again in a moment.');
        }
        const popup = openPopup(url, 'fydaa-digilocker');
        await waitForPopupClose(popup, { isDoneUrl: isDigiLockerCallback });
        const stage = await getUserStage();
        await routeAfterKycStage(stage);
        return;
      }

      const data = await startIdentityDocument('https://fydaa.com');
      const url = data?.fetch?.redirect_url;
      if (!url) throw new Error('DigiLocker session expired. Please try again.');
      const popup = openPopup(url, 'fydaa-digilocker');
      await waitForPopupClose(popup, { isDoneUrl: isDigiLockerCallback });

      let ok = false;
      for (let i = 0; i < 4; i += 1) {
        if (i) await new Promise((r) => setTimeout(r, 400 * i));
        const status = await getIdentityDocument();
        const st = String(status?.fetch?.status || '').toLowerCase();
        if (['successful', 'success', 'completed', 'verified'].includes(st)) {
          ok = true;
          break;
        }
        if (st === 'failed' || st === 'expired') {
          throw new Error(status?.fetch?.reason || 'DigiLocker verification failed.');
        }
      }
      if (!ok) throw new Error('DigiLocker is still pending. Please try again.');
      go('signature');
    } catch (err) {
      setAuthError(err.message || 'DigiLocker failed. Please try again.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitSignatureAndNsdl() {
    setAuthBusy('signature');
    setAuthError('');
    try {
      if (kycPath === 'modify') {
        let formId = modifyFormId;
        let form = null;
        if (!formId) {
          form = await getCurrentKycForm();
          formId = form?.id || '';
        } else {
          try {
            form = await getCurrentKycForm();
            if (form?.id) formId = form.id;
          } catch {
            /* keep formId */
          }
        }
        if (!formId) throw new Error('KYC form not ready.');
        if (form?.id) setModifyFormId(form.id);

        const formStatus = () => String(form?.status || '').toLowerCase();
        const esignStatus = () => String(form?.esign_details?.status || '').toLowerCase();
        const modifyEsignDone = () =>
          ['submitted', 'awaiting_submission'].includes(formStatus()) ||
          ['successful', 'success'].includes(esignStatus());

        // Already submitted / e-sign complete — leave signature screen (URL is null after success).
        if (modifyEsignDone()) {
          const stage = await getUserStage();
          await routeAfterKycStage(stage);
          return;
        }

        // §6.7 — if signature already on form, skip re-upload and open esign_url.
        if (!form?.signature_provided) {
          if (signatureBlank || !signatureB64) {
            throw new Error('Please draw your signature.');
          }
          const bin = atob(signatureB64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
          const file = new File([bytes], 'signature.png', { type: 'image/png' });
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
          throw new Error('E-sign link not ready. Please try again later.');
        }

        const popup = openPopup(esignUrl, 'fydaa-modify-esign');
        await waitForPopupClose(popup, { isDoneUrl: isModifyEsignCallback });
        await new Promise((r) => setTimeout(r, 2000));
        await waitForModifyFormSubmitted(formId);
        const stage = await getUserStage();
        await routeAfterKycStage(stage);
        return;
      }

      if (signatureBlank || !signatureB64) {
        throw new Error('Please draw your signature.');
      }
      await uploadSignatureBase64(signatureB64);
      go('nsdl');
      await runNsdlEsign();
    } catch (err) {
      setAuthError(err.message || 'Could not save signature.');
    } finally {
      setAuthBusy('');
    }
  }

  async function runNsdlEsign() {
    setAuthBusy('nsdl');
    setAuthError('');
    try {
      const data = await startNsdlEsign('https://fydaa.com/SuccesspageNSDL');
      const url = data?.redirect_url;
      if (!url) throw new Error('E-sign link not ready.');
      const popup = openPopup(url, 'fydaa-nsdl');
      await waitForPopupClose(popup, { isDoneUrl: isNsdlCallback });
      const status = await getNsdlEsignStatus();
      const st = String(status?.status || 'successful').toLowerCase();
      if (!['successful', 'success', 'completed'].includes(st)) {
        throw new Error('E-sign was not completed. Please try again.');
      }
      const ip = await getPublicIp();
      await createInvestorProfileAndMfAccount(ip);
      let stage = await getUserStage();
      for (let i = 0; i < 4 && !isTruthyFlag(stage?.isNSDL); i += 1) {
        await new Promise((r) => setTimeout(r, 2000));
        stage = await getUserStage();
      }
      if (!isTruthyFlag(stage?.isBank)) go('bank');
      else if (!isTruthyFlag(stage?.isNominee)) go('nominee');
      else goHome();
    } catch (err) {
      setAuthError(err.message || 'Aadhaar e-sign failed.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitBank() {
    const ifscCode = ifsc.trim().toUpperCase();
    const acct = accountNumber.trim();
    const confirmAcct = confirmAccountNumber.trim();

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setAuthError('Enter a valid IFSC (e.g. HDFC0001234).');
      return;
    }
    if (!['savings', 'current'].includes(accountType)) {
      setAuthError('Select account type: Savings or Current.');
      return;
    }
    if (!/^\d{9,18}$/.test(acct)) {
      setAuthError('Enter a valid account number (9–18 digits).');
      return;
    }
    if (acct !== confirmAcct) {
      setAuthError('Account numbers do not match.');
      return;
    }
    setAuthBusy('bank');
    setAuthError('');
    try {
      try {
        const ip = await getPublicIp();
        await createInvestorProfileAndMfAccount(ip);
      } catch {
        /* may already exist */
      }
      await createAndVerifyBankAccount({
        account_number: acct,
        type: accountType || 'savings',
        ifsc_code: ifscCode,
      });
      if (nomineeOptOut) {
        await submitNominee({ forceOptOut: true });
      } else {
        go('nominee');
      }
    } catch (err) {
      setAuthError(err.message || 'Could not verify bank account.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitNominee(opts = {}) {
    const optOut = opts.forceOptOut || nomineeOptOut;
    setAuthBusy('nominee');
    setAuthError('');
    try {
      if (optOut) {
        await saveNominee({ opt_out_nomination: true });
      } else {
        if (!nomineeName.trim() || !nomineeDob || !nomineeRelation) {
          setAuthError('Enter nominee name, date of birth, and relationship.');
          setAuthBusy('');
          return;
        }
        const isMinor = !isAdultDob(nomineeDob, 18);
        if (isMinor && (!guardianName.trim() || !guardianRelation)) {
          setAuthError('Guardian name and relationship are required for a minor nominee.');
          setAuthBusy('');
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
      goHome();
    } catch (err) {
      setAuthError(err.message || 'Could not save nominee.');
    } finally {
      setAuthBusy('');
    }
  }

  async function pickRiskOption(optIdx) {
    if (authBusy || !questions[riskIndex]) return;
    const q = questions[riskIndex];
    const rawOpt = Array.isArray(q.option) ? q.option[optIdx] : null;
    const answerIdFromOpt =
      rawOpt && typeof rawOpt === 'object' && rawOpt.answerId != null
        ? Number(rawOpt.answerId)
        : NaN;
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
      setAuthBusy('risk-submit');
      setAuthError('');
      try {
        await createUserRiskProfile(nextAnswers);
        await updatePortfoliosSoft();
        await getUserStage();
        await loadRiskResult();
      } catch (err) {
        setAuthError(err.message || 'Something went wrong. Try again after sometime.');
      } finally {
        setAuthBusy('');
      }
    }, 280);
  }

  const cfg = STEP_MAP[screen];
  const isLogin = mode === 'login';
  const entryLabel = isLogin ? 'Login' : 'Sign up';
  const showRiskBack = screen === 'risk' && riskIndex > 0;
  const backTarget = isLogin
    ? screen === 'otp'
      ? 'mobile'
      : null
    : showRiskBack
      ? 'risk-prev'
      : BACK_MAP[screen];
  const currentQuestion = questions[riskIndex];
  const visibleOptions = Array.isArray(currentQuestion?.option)
    ? currentQuestion.option.slice(0, 4)
    : [];
  const riskProgress = questions.length
    ? Math.round(((riskIndex + 1) / questions.length) * 100)
    : null;
  const pinTitle = pinSetupType === 'LEGACY_MIGRATION' ? 'Update Your pin' : 'Create Your pin';
  const pinSub =
    pinSetupType === 'LEGACY_MIGRATION'
      ? 'Your old 6-digit pin no longer works. Set a new 4-digit pin.'
      : 'Create a 4-digit pin to secure your account.';

  function handleBack() {
    if (backTarget === 'risk-prev') {
      const prevIndex = riskIndex - 1;
      const prevQ = questions[prevIndex];
      const prevAnswer = riskAnswers.find((a) => a.questionId === prevQ?.id);
      setRiskIndex(prevIndex);
      setRiskSel(prevAnswer ? prevAnswer.answerId - 1 : null);
      setAuthError('');
      return;
    }
    if (backTarget) go(backTarget);
  }

  return (
    <div className={`max-w-[640px] mx-auto px-6 ${embedded ? 'pt-2 pb-16' : 'pt-10 pb-24'}`}>
      {embedded && (
        <button
          type="button"
          onClick={exitToDashboard}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C4A3E] mb-5"
        >
          <BackIcon className="w-[16px] h-[16px]" />
          Back to dashboard
        </button>
      )}

      {cfg && (
        <Stepper
          activeStep={cfg.s}
          headline={cfg.h}
          progress={screen === 'risk' ? riskProgress : cfg.p ? Math.round((cfg.p[0] / cfg.p[1]) * 100) : null}
        />
      )}

      {backTarget && (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center mb-5"
        >
          <BackIcon className="w-[18px] h-[18px] text-neutral-600" />
        </button>
      )}

      {embedded && !screen && (
        <div className="text-sm text-neutral-500 pt-6">
          {authError || (authBusy ? 'Loading your KYC steps…' : 'Preparing KYC…')}
        </div>
      )}

      {/* MOBILE NUMBER */}
      {screen === 'mobile' && (
        <>
          <Overline>{entryLabel}</Overline>
          <PageHeading>Tell us your mobile number</PageHeading>
          <PageSub>
            {isLogin ? 'Enter the mobile number linked to your account' : 'We will send you an OTP to verify'}
          </PageSub>
          <FieldInput
            label="Mobile Number"
            prefix="+91"
            type="tel"
            maxLength={10}
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => { setMobile(e.target.value); setAuthError(''); }}
          />
          {isLogin && (
            <div className="mb-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">
                4-digit PIN
              </label>
              <CodeInputs count={4} value={pin} onChange={(next) => { setPin(next); setAuthError(''); }} />
            </div>
          )}
          {!isLogin && (
            <>
              <LinkText onClick={() => setShowReferral((v) => !v)}>Have a Referral Code?</LinkText>
              {showReferral && (
                <FieldInput
                  label="Referral Code"
                  placeholder="Optional"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                />
              )}
            </>
          )}
          {authError && screen === 'mobile' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={isLogin ? submitLoginPin : submitSignupMobile} disabled={Boolean(authBusy)}>
            {authBusy === 'pin' || authBusy === 'otp-request' ? 'Please wait...' : 'Proceed'}
          </Button>
          <AccountSwitch isLogin={isLogin} />
        </>
      )}

      {/* OTP — signup first visit / login after PIN */}
      {screen === 'otp' && (
        <>
          <Overline>{entryLabel}</Overline>
          <PageHeading>Enter the OTP sent to</PageHeading>
          <PageSub>{mobileNumber ? `+91 ${mobileNumber}` : '+91'}</PageSub>
          <CodeInputs
            count={6}
            value={otp}
            onChange={(next) => { setOtp(next); setAuthError(''); }}
          />
          <LinkText onClick={resendSignupOtp}>
            {authBusy === 'resend' ? 'Sending...' : 'Resend OTP'}
          </LinkText>
          {authError && screen === 'otp' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitSignupOtp} disabled={Boolean(authBusy)}>
            {authBusy === 'otp' ? 'Verifying...' : 'Proceed'}
          </Button>
          <AccountSwitch isLogin={isLogin} />
        </>
      )}

      {/* PIN — create / legacy migrate; then home (not risk quiz) */}
      {screen === 'pin' && (
        <>
          <PageHeading>{pinTitle}</PageHeading>
          <PageSub>{pinSub}</PageSub>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-5 shadow-sm">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Enter 4-Digit PIN
            </label>
            <CodeInputs
              count={4}
              value={createPinValue}
              onChange={(next) => { setCreatePinValue(next); setAuthError(''); }}
            />
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Re-Enter PIN
            </label>
            <CodeInputs
              count={4}
              value={confirmPin}
              onChange={(next) => { setConfirmPin(next); setAuthError(''); }}
            />
          </div>
          {authError && screen === 'pin' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitCreatePin} disabled={Boolean(authBusy)}>
            {authBusy === 'create-pin' ? 'Saving...' : 'Get Started'}
          </Button>
        </>
      )}

      {/* RISK QUESTIONS — API questionnaire, one at a time */}
      {screen === 'risk' && currentQuestion && (
        <>
          <QuestionCard
            icon={<RiskIcon className="w-[21px] h-[21px]" />}
            counter={`(${riskIndex + 1} of ${questions.length})`}
            title={currentQuestion.question || currentQuestion.text || ''}
            subtitle={currentQuestion.subtitle || currentQuestion.description || ''}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleOptions.map((opt, i) => {
              const label = typeof opt === 'string' ? opt : opt?.answer || opt?.option || opt?.text || opt?.label || String(opt);
              return (
                <button
                  key={`${currentQuestion.id}-${i}`}
                  type="button"
                  disabled={Boolean(authBusy)}
                  onClick={() => pickRiskOption(i)}
                  className={`text-left rounded-2xl border-[1.5px] px-4 py-[18px] text-sm font-semibold transition-colors ${
                    riskSel === i
                      ? 'border-emerald-700 bg-emerald-50 text-[#0C4A3E]'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {authError && (
            <p className="text-sm text-red-600 mt-4">{authError}</p>
          )}
          {authBusy === 'risk-submit' && (
            <p className="text-sm text-neutral-500 mt-4">Saving your risk profile...</p>
          )}
        </>
      )}

      {/* SCORE */}
      {screen === 'score' && (
        <div className="flex flex-col items-center text-center">
          <ScoreRing score={riskScore} max={100} />
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-[18px] py-2 text-[13px] font-bold text-[#0C4A3E]">
            <ShieldIcon className="w-4 h-4" />
            {riskBand || 'Your risk profile'}
          </div>
          <p className="text-sm text-neutral-500 mt-5 leading-relaxed max-w-[400px]">
            Your personalized risk profile is ready. Continue to verify your email and finish KYC.
          </p>
          <Button onClick={() => go('email')} className="max-w-none" disabled={Boolean(authBusy)}>
            Continue
          </Button>
          <OutlineButton
            onClick={startRiskQuestionnaire}
            className="max-w-none mt-3"
            disabled={Boolean(authBusy)}
          >
            {authBusy === 'risk' ? 'Loading…' : 'Retake Quiz'}
          </OutlineButton>
        </div>
      )}

      {/* EMAIL */}
      {screen === 'email' && (
        <>
          <QuestionCard
            icon={<EnvelopeIcon className="w-[21px] h-[21px]" />}
            title="Verify Your Email address"
            subtitle="Verify your email to receive your personalized risk profile report"
          >
            <div className="mt-4">
              <FieldInput
                label="Email"
                type="email"
                placeholder="Enter your email-id"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setAuthError(''); }}
              />
            </div>
          </QuestionCard>
          {authError && screen === 'email' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitRequestEmailOtp} disabled={Boolean(authBusy)}>
            {authBusy === 'email-request' ? 'Sending...' : 'Next'}
          </Button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <OutlineButton
            onClick={() => submitOAuthEmail('GOOGLE')}
            disabled={Boolean(authBusy)}
          >
            <GoogleIcon />
            {authBusy === 'google' ? 'Connecting...' : 'Continue with Google'}
          </OutlineButton>
          <OutlineButton
            onClick={() => submitOAuthEmail('APPLE')}
            disabled={Boolean(authBusy)}
          >
            <AppleIcon />
            {authBusy === 'apple' ? 'Connecting...' : 'Continue with Apple'}
          </OutlineButton>
        </>
      )}

      {/* EMAIL OTP */}
      {screen === 'emailotp' && (
        <>
          <QuestionCard
            icon={<EnvelopeIcon className="w-[21px] h-[21px]" />}
            title="Verify Your Email address"
            subtitle={`Please enter the 6-digit verification code sent to ${email || 'your email address'}`}
          >
            <div className="mt-4">
              <CodeInputs
                count={6}
                value={emailOtp}
                onChange={(next) => { setEmailOtp(next); setAuthError(''); }}
              />
              {emailResendSecs > 0 ? (
                <p className="text-[12.5px] text-neutral-400 font-medium">
                  Resend code in{' '}
                  <b className="text-[#0C4A3E]">
                    00:{String(emailResendSecs).padStart(2, '0')}
                  </b>
                </p>
              ) : (
                <LinkText className="!mb-0" onClick={resendEmailOtp}>
                  {authBusy === 'email-resend' ? 'Sending...' : 'Resend code'}
                </LinkText>
              )}
            </div>
          </QuestionCard>
          {authError && screen === 'emailotp' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitVerifyEmailOtp} disabled={Boolean(authBusy)}>
            {authBusy === 'email-verify' ? 'Verifying...' : 'Verify'}
          </Button>
        </>
      )}

      {/* PAN + NAME + DOB */}
      {screen === 'pan' && (
        <>
          <PageHeading size="text-2xl">Complete Your KYC</PageHeading>
          <QuestionCard
            icon={<DocIcon className="w-[21px] h-[21px]" />}
            title="PAN details"
            subtitle="Please provide your PAN, name as on PAN, and date of birth."
          >
            <div className="mt-4">
              <FieldInput
                label="Full name (as on PAN)"
                placeholder="Enter full name"
                value={panName}
                onChange={(e) => { setPanName(e.target.value); setAuthError(''); }}
              />
              <FieldRow>
                <FieldInput
                  label="PAN Number"
                  placeholder="Enter your PAN number"
                  maxLength={10}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  className="uppercase"
                  value={panNumber}
                  onChange={(e) => {
                    setPanNumber(normalizePan(e.target.value));
                    setAuthError('');
                  }}
                />
                <FieldInput
                  label="Date of Birth"
                  type="date"
                  max={maxDobIso}
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    setAuthError('');
                  }}
                />
              </FieldRow>
              <p className="text-[12px] text-neutral-400 font-medium -mt-2">
                You must be 18 years or older.
              </p>
            </div>
          </QuestionCard>
          {authError && screen === 'pan' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitPanDetails} disabled={Boolean(authBusy)}>
            {authBusy === 'pan' ? 'Verifying...' : 'Verify'}
          </Button>
        </>
      )}

      {/* KYC EXTRA QUESTIONS */}
      {screen === 'kyc' && (
        <>
          <PageHeading size="text-2xl">Complete Your KYC</PageHeading>
          <QuestionCard
            icon={<DocIcon className="w-[21px] h-[21px]" />}
            title="Answer following questions"
            subtitle={
              kycPath === 'noncompliant'
                ? 'Provide personal and financial details to continue KYC.'
                : 'Please provide your income, occupation, and source of wealth.'
            }
          />
          {kycPath !== 'compliant' && (
            <>
              <FieldInput
                label="Father's name"
                placeholder="Enter father's name"
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
          <FieldSelect label="Income slab" value={incomeSlab} onChange={(e) => setIncomeSlab(e.target.value)}>
            <option value="">Select income slab</option>
            {INCOME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </FieldSelect>
          <FieldSelect label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
            <option value="">Select occupation</option>
            {OCCUPATION_COMPLIANT.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </FieldSelect>
          <FieldSelect
            label="Source of wealth"
            value={sourceOfWealth}
            onChange={(e) => setSourceOfWealth(e.target.value)}
          >
            <option value="">Select source of wealth</option>
            {SOURCE_OF_WEALTH.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </FieldSelect>
          <Checkbox checked={pep} onChange={() => setPep((v) => !v)}>
            I am not a politically exposed person
          </Checkbox>
          {authError && screen === 'kyc' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitKycExtra} disabled={Boolean(authBusy)}>
            {authBusy === 'kyc-extra' ? 'Saving...' : 'Continue'}
          </Button>
        </>
      )}

      {/* DIGILOCKER */}
      {screen === 'digilocker' && (
        <>
          <PageHeading size="text-2xl">Verify with DigiLocker</PageHeading>
          <PageSub>
            Link your Aadhaar via DigiLocker to continue KYC. A secure window will open.
          </PageSub>
          {authError && screen === 'digilocker' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={startDigiLocker} disabled={Boolean(authBusy)}>
            {authBusy === 'digilocker' ? 'Waiting for DigiLocker...' : 'Continue DigiLocker'}
          </Button>
        </>
      )}

      {/* SIGNATURE */}
      {screen === 'signature' && (
        <>
          <PageHeading size="text-2xl">Draw your signature</PageHeading>
          <PageSub>Sign inside the box. This is used for your KYC agreement.</PageSub>
          <SignaturePad
            onChange={({ base64, blank }) => {
              setSignatureB64(base64);
              setSignatureBlank(blank);
              setAuthError('');
            }}
          />
          {authError && screen === 'signature' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitSignatureAndNsdl} disabled={Boolean(authBusy)}>
            {authBusy === 'signature' || authBusy === 'nsdl' ? 'Please wait...' : 'Continue to e-sign'}
          </Button>
        </>
      )}

      {/* NSDL STATUS */}
      {screen === 'nsdl' && (
        <>
          <PageHeading size="text-2xl">Aadhaar e-sign</PageHeading>
          <PageSub>
            {authBusy === 'nsdl'
              ? 'Complete e-sign in the popup window…'
              : 'If the window closed early, tap below to try again.'}
          </PageSub>
          {authError && screen === 'nsdl' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={runNsdlEsign} disabled={Boolean(authBusy)}>
            {authBusy === 'nsdl' ? 'Waiting…' : 'Continue e-sign'}
          </Button>
        </>
      )}

      {/* E-SIGN bridge */}
      {screen === 'esign' && (
        <>
          <PageHeading size="text-[22px]">Almost done</PageHeading>
          <PageSub>Continue to add your bank account.</PageSub>
          <Button onClick={() => go('bank')}>Continue</Button>
        </>
      )}

      {/* BANK */}
      {screen === 'bank' && (
        <>
          <Overline emerald>Connected</Overline>
          <PageHeading>Add Bank Details</PageHeading>
          <FieldRow>
            <div>
              <FieldInput
                label="IFSC Code"
                placeholder="Enter code"
                className="uppercase"
                maxLength={11}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                value={ifsc}
                onChange={(e) => {
                  setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11));
                  setAuthError('');
                }}
              />
              {ifscLookupBusy && (
                <p className="-mt-2 mb-4 text-xs text-neutral-500">Looking up branch…</p>
              )}
              {!ifscLookupBusy && ifscLookupError && (
                <p className="-mt-2 mb-4 text-xs text-red-600">{ifscLookupError}</p>
              )}
              {!ifscLookupBusy && ifscInfo && (
                <div className="-mt-2 mb-4 rounded-[11px] border border-[#0C4A3E]/15 bg-[#0C4A3E]/[0.04] px-3.5 py-3 text-left">
                  <div className="text-sm font-semibold text-[#0C4A3E]">
                    {[ifscInfo.bank, ifscInfo.branch].filter(Boolean).join(' · ')}
                  </div>
                  {(ifscInfo.city || ifscInfo.state) && (
                    <div className="text-xs text-neutral-600 mt-1">
                      {[ifscInfo.city, ifscInfo.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                  {ifscInfo.address && (
                    <div className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {ifscInfo.address}
                    </div>
                  )}
                </div>
              )}
            </div>
            <FieldSelect
              label="Account type"
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value);
                setAuthError('');
              }}
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </FieldSelect>
          </FieldRow>
          <FieldRow>
            <FieldInput
              label="Account Number"
              type="tel"
              inputMode="numeric"
              placeholder="XXXX XXXX XX XXXX"
              maxLength={18}
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18));
                setAuthError('');
              }}
            />
            <FieldInput
              label="Confirm Account Number"
              type="tel"
              inputMode="numeric"
              placeholder="XXXX XXXX XX XXXX"
              maxLength={18}
              value={confirmAccountNumber}
              onChange={(e) => {
                setConfirmAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18));
                setAuthError('');
              }}
            />
          </FieldRow>
          <div className="border-t border-neutral-200 pt-4">
            <Checkbox checked={nomineeOptOut} onChange={() => setNomineeOptOut((v) => !v)}>
              I wish to opt out of adding a nominee
            </Checkbox>
          </div>
          {authError && screen === 'bank' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={submitBank} disabled={Boolean(authBusy)}>
            {authBusy === 'bank' || authBusy === 'nominee' ? 'Saving...' : 'Add Bank Details'}
          </Button>
        </>
      )}

      {/* NOMINEE */}
      {screen === 'nominee' && (
        <>
          <Overline>Add a trusted person</Overline>
          <PageHeading>Add Nominee</PageHeading>
          <div className="mb-5">
            <Checkbox
              checked={nomineeOptOut}
              onChange={() => {
                setNomineeOptOut((v) => !v);
                setAuthError('');
              }}
            >
              I do not wish to nominate anyone (opt out of nominee)
            </Checkbox>
          </div>

          {!nomineeOptOut && (
            <>
              <FieldInput
                label="Nominee Name"
                placeholder="Nominee Name"
                value={nomineeName}
                onChange={(e) => {
                  setNomineeName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
                  setAuthError('');
                }}
              />
              <FieldInput
                label="Date of Birth"
                type="date"
                max={todayIso}
                value={nomineeDob}
                onChange={(e) => {
                  const next = e.target.value;
                  setNomineeDob(next && next > todayIso ? todayIso : next);
                  setAuthError('');
                }}
              />
              <FieldSelect
                label="Relationship"
                value={nomineeRelation}
                onChange={(e) => {
                  setNomineeRelation(e.target.value);
                  setAuthError('');
                }}
              >
                <option value="">Select relationship</option>
                {NOMINEE_RELATIONS.map((rel) => (
                  <option key={rel.value} value={rel.value}>
                    {rel.label}
                  </option>
                ))}
              </FieldSelect>

              {nomineeIsMinor && (
                <>
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
                    Nominee is a minor. Guardian details are required.
                  </p>
                  <FieldInput
                    label="Guardian Name"
                    placeholder="Guardian Name"
                    value={guardianName}
                    onChange={(e) => {
                      setGuardianName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
                      setAuthError('');
                    }}
                  />
                  <FieldSelect
                    label="Guardian Relationship"
                    value={guardianRelation}
                    onChange={(e) => {
                      setGuardianRelation(e.target.value);
                      setAuthError('');
                    }}
                  >
                    <option value="">Select guardian relationship</option>
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

          {authError && screen === 'nominee' && (
            <p className="text-sm text-red-600 mb-3">{authError}</p>
          )}
          <Button onClick={() => submitNominee()} disabled={Boolean(authBusy)}>
            {authBusy === 'nominee' ? 'Saving...' : 'Submit Nominee'}
          </Button>
        </>
      )}

      <KycModal
        open={kycModalOpen}
        title={
          kycPath === 'compliant'
            ? 'Your KYC is compliant'
            : kycPath === 'modify'
              ? 'Update your KYC'
              : 'Your KYC is NOT compliant'
        }
        subtitle={kycNotice || (kycPath === 'compliant' ? 'Continue to answer a few questions.' : 'Please first complete your KYC')}
        cta={kycPath === 'modify' ? 'Update KYC' : 'Complete your KYC'}
        onComplete={continueAfterKycModal}
      />
    </div>
  );
}
