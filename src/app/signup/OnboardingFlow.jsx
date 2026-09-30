"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Stepper from './components/Stepper';
import KycModal from './components/KycModal';
import {
  Overline, PageHeading, PageSub, Button, LinkText, FieldInput, FieldSelect, FieldRow,
  CodeInputs, Chip, Checkbox, QuestionCard, ScoreRing,
  RiskIcon, EnvelopeIcon, DocIcon, ShieldIcon, BackIcon, CheckIcon,
} from './components/UI';
import {
  bandFromIndicators,
  clearTokens,
  createPin as createPinApi,
  createUserRiskProfile,
  getAccessToken,
  getRiskIndicators,
  getRiskQuestionnaire,
  getUserStage,
  requestOtp,
  resolvePinSetupType,
  scoreFromIndicators,
  updatePortfoliosSoft,
  verifyOtp,
  verifyPin,
} from './lib/authApi';

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
  esign: { s: 3, p: null, h: "You're one step away" },
  bank: { s: 4, p: null, h: null },
  nominee: { s: 4, p: null, h: null },
};

const BACK_MAP = {
  otp: 'mobile',
  score: 'risk', email: 'score', emailotp: 'email',
  bank: 'esign', nominee: 'bank',
};

const RELATIONS = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Others'];

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

function isTruthyFlag(value) {
  return value === true || value === 1 || value === 'true' || value === '1';
}

export default function OnboardingFlow({ mode = 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState('mobile');
  const [pep, setPep] = useState(false);
  const [esignAgree, setEsignAgree] = useState(false);
  const [esignSigned, setEsignSigned] = useState(false);
  const [nomineeOptOut, setNomineeOptOut] = useState(false);
  const [nomineeRelation, setNomineeRelation] = useState('Father');
  const [kycModalOpen, setKycModalOpen] = useState(false);
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

  const go = (next) => {
    setAuthError('');
    setScreen(next);
  };

  const bankNext = () => (nomineeOptOut ? goHome() : go('nominee'));

  const restart = () => {
    setScreen('mobile');
    setPep(false);
    setEsignAgree(false);
    setEsignSigned(false);
    setNomineeOptOut(false);
    setNomineeRelation('Father');
    setKycModalOpen(false);
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
  };

  const mobileNumber = mobile.replace(/\D/g, '').slice(0, 10);
  const goHome = () => router.push('/dashboard');

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
    if (mode === 'login' || !searchParams) return;
    const keys = ['ref_code', 'referredBy', 'referralCode', 'referral_code'];
    for (const key of keys) {
      const value = searchParams.get(key)?.trim();
      if (value) {
        setStoredReferral(value);
        break;
      }
    }
  }, [mode, searchParams]);

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

  async function routeAfterKycStage(stage) {
    if (isTruthyFlag(stage?.ismodify)) {
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
    go('kyc');
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
    // Number already has a PIN — send them to login instead of signing them in
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
    if (mode === 'login') return;
    if (searchParams?.get('start') !== 'kyc') return;
    if (!getAccessToken()) return;
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
  }, [mode, searchParams]);

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
      goHome();
    } catch (err) {
      setAuthError(err.message || 'Could not verify PIN.');
    } finally {
      setAuthBusy('');
    }
  }

  async function submitSignupOtp() {
    if (otp.length !== 6) {
      setAuthError('Enter the 6-digit OTP.');
      return;
    }
    setAuthBusy('otp');
    setAuthError('');
    try {
      await verifyOtp({ mobileNumber, otp });
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
      const stage = await getUserStage();
      await routeAfterKycStage(stage);
    } catch (err) {
      setAuthError(err.message || 'Could not create PIN.');
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
  const backTarget = isLogin ? null : showRiskBack ? 'risk-prev' : BACK_MAP[screen];
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
    <div className="max-w-[640px] mx-auto px-6 pt-10 pb-24">
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

      {/* OTP — signup / first visit */}
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
          <Button onClick={() => go('email')} className="max-w-none">Continue</Button>
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
              <FieldInput label="Email" type="email" placeholder="Enter your email-id" />
            </div>
          </QuestionCard>
          <Button onClick={() => go('emailotp')}>Next</Button>
        </>
      )}

      {/* EMAIL OTP */}
      {screen === 'emailotp' && (
        <>
          <QuestionCard
            icon={<EnvelopeIcon className="w-[21px] h-[21px]" />}
            title="Verify Your Email address"
            subtitle="Please enter the 6-digit verification code sent to your email address"
          >
            <div className="mt-4">
              <CodeInputs count={6} />
              <p className="text-[12.5px] text-neutral-400 font-medium">
                Resend code in <b className="text-[#0C4A3E]">00:30</b>
              </p>
            </div>
          </QuestionCard>
          <Button onClick={() => go('pan')}>Verify</Button>
        </>
      )}

      {/* PAN + DOB */}
      {screen === 'pan' && (
        <>
          <PageHeading size="text-2xl">Complete Your KYC</PageHeading>
          <QuestionCard
            icon={<DocIcon className="w-[21px] h-[21px]" />}
            title="Complete Your PAN address"
            subtitle="Please provide your PAN number and Date of Birth to complete your profile."
          >
            <div className="mt-4">
              <FieldRow>
                <FieldInput label="PAN Number" placeholder="Enter your PAN number" maxLength={10} className="uppercase" />
                <FieldInput label="Date of Birth" placeholder="DD / MM / YYYY" />
              </FieldRow>
            </div>
          </QuestionCard>
          <Button onClick={() => setKycModalOpen(true)}>Verify</Button>
        </>
      )}

      {/* KYC QUESTIONS */}
      {screen === 'kyc' && (
        <>
          <PageHeading size="text-2xl">Complete Your KYC</PageHeading>
          <QuestionCard
            icon={<DocIcon className="w-[21px] h-[21px]" />}
            title="Answer following questions"
            subtitle="Please provide your Income Slab and Occupation to complete your profile."
          />
          <FieldSelect label="Select your correct income slab range" defaultValue="₹5 lakh – ₹10 lakh">
            <option value="">Select income slab</option>
            <option>Less than ₹1 lakh</option>
            <option>₹1 lakh – ₹5 lakh</option>
            <option>₹5 lakh – ₹10 lakh</option>
            <option>₹10 lakh – ₹25 lakh</option>
            <option>₹25 lakh – ₹1 crore</option>
            <option>Above ₹1 crore</option>
          </FieldSelect>
          <FieldSelect label="Select your correct occupation">
            <option value="">Select your occupation</option>
            <option>Business</option>
            <option>Professional</option>
            <option>Retired</option>
            <option>Housewife</option>
            <option>Student</option>
            <option>Public sector</option>
            <option>Private sector</option>
            <option>Government sector</option>
            <option>Other</option>
          </FieldSelect>
          <Checkbox checked={pep} onChange={() => setPep((v) => !v)}>
            Please confirm if you are a politically exposed person (PEP), such as a government official, politician,
            or close associate. This is for regulatory and compliance purposes.
          </Checkbox>
          <Button onClick={() => go('esign')}>Verify</Button>
        </>
      )}

      {/* E-SIGN */}
      {screen === 'esign' && (
        <>
          <PageHeading size="text-[22px]">E-Sign Agreement</PageHeading>
          <PageSub>Review the agreement and sign to officially appoint Fydaa as your investment advisor.</PageSub>
          <div className="border-[1.5px] border-neutral-200 rounded-2xl p-[18px] mb-5 bg-white shadow-sm">
            <div className="text-sm font-semibold text-neutral-950 mb-3">Your E-Signature</div>
            {/* Simplified for handoff: tap-to-sign toggle rather than a freehand
                <canvas> signature pad — swap in your actual signature-capture
                component here if you have one. */}
            <button
              type="button"
              onClick={() => setEsignSigned(true)}
              className="w-full h-[150px] bg-neutral-50 rounded-[10px] border-[1.5px] border-dashed border-neutral-300 flex items-center justify-center"
            >
              {esignSigned ? (
                <span className="flex items-center gap-2 text-[15px] font-bold text-[#0C4A3E]">
                  <CheckIcon className="w-5 h-5 text-emerald-700" /> Signed
                </span>
              ) : (
                <span className="text-[13px] text-neutral-400 font-semibold">Tap here to sign</span>
              )}
            </button>
            {esignSigned && (
              <div className="flex justify-end mt-2">
                <LinkText className="!mb-0" onClick={() => setEsignSigned(false)}>Clear</LinkText>
              </div>
            )}
            <p className="text-[11px] text-neutral-400 mt-2.5 font-medium">
              Ensure your signature matches your official ID for a smooth process.
            </p>
          </div>
          <Checkbox checked={esignAgree} onChange={() => setEsignAgree((v) => !v)}>
            I consent to enter into the Investment Advisory agreement with Fydaa and get access to information about
            all products and services, including the risk-return profiles of investment strategies estimated through
            simulations using historical prices of securities under advice. By continuing you also agree to the terms
            &amp; conditions and declaration.
          </Checkbox>
          <Button onClick={() => go('bank')}>Continue to confirm</Button>
        </>
      )}

      {/* BANK */}
      {screen === 'bank' && (
        <>
          <Overline emerald>Connected</Overline>
          <PageHeading>Add Bank Details</PageHeading>
          <FieldRow>
            <FieldInput label="IFSC Code" placeholder="Enter code" className="uppercase" />
            <FieldInput label="Account Holder Name" placeholder="As per bank records" />
          </FieldRow>
          <FieldRow>
            <FieldInput label="Account Number" type="tel" placeholder="XXXX XXXX XX XXXX" />
            <FieldInput label="Confirm Account Number" type="tel" placeholder="XXXX XXXX XX XXXX" />
          </FieldRow>
          <div className="border-t border-neutral-200 pt-4">
            <Checkbox checked={nomineeOptOut} onChange={() => setNomineeOptOut((v) => !v)}>
              I wish to opt out of adding a nominee
            </Checkbox>
          </div>
          <Button onClick={bankNext}>Add Bank Details</Button>
        </>
      )}

      {/* NOMINEE */}
      {screen === 'nominee' && (
        <>
          <Overline>Add a trusted person</Overline>
          <PageHeading>Add Nominee</PageHeading>
          <FieldRow>
            <FieldInput label="First Name" placeholder="Enter name as per Govt ID" />
            <FieldInput label="Last Name" placeholder="Enter name as per Govt ID" />
          </FieldRow>
          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">
              Nominee is my
            </label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {RELATIONS.map((label) => (
                <Chip key={label} label={label} selected={nomineeRelation === label} onClick={() => setNomineeRelation(label)} />
              ))}
            </div>
          </div>
          <FieldInput label="Email" type="email" placeholder="Enter email" />
          <FieldRow>
            <FieldInput label="Nominee's Date of Birth" placeholder="DD / MM / YYYY" />
            <FieldInput label="Nominee's Mobile" type="tel" placeholder="Enter mobile number" />
          </FieldRow>
          <Button onClick={goHome}>Continue</Button>
        </>
      )}

      {/* DONE (fallback — full onboarding routes to dashboard) */}
      {screen === 'done' && (
        <div className="flex flex-col items-center text-center pt-10">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <CheckIcon className="w-9 h-9 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold mb-2">
            {isLogin ? 'You are logged in' : 'Onboarding complete!'}
          </div>
          <p className="text-sm text-neutral-500 mb-8 max-w-[380px] leading-relaxed">
            {isLogin
              ? 'Welcome back. Your Fydaa account is ready.'
              : "Your Fydaa account is fully set up. You're ready to start investing."}
          </p>
          <Button className="max-w-[280px]" onClick={goHome}>Go to Dashboard</Button>
          <LinkText className="mt-4" onClick={restart}>Restart demo</LinkText>
        </div>
      )}

      <KycModal
        open={kycModalOpen}
        onComplete={() => {
          setKycModalOpen(false);
          go('kyc');
        }}
      />
    </div>
  );
}
