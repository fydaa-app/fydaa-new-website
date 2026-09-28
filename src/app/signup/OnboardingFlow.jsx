"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from './components/Stepper';
import KycModal from './components/KycModal';
import {
  Overline, PageHeading, PageSub, Button, LinkText, FieldInput, FieldSelect, FieldRow,
  CodeInputs, Chip, Checkbox, QuestionCard, ScoreRing,
  RiskIcon, EnvelopeIcon, DocIcon, ShieldIcon, BackIcon, CheckIcon,
} from './components/UI';

/**
 * Fydaa — KYC Onboarding (Web)
 *
 * Drop this into the app's router/content area — it renders only the
 * wizard content; the dashboard's sidebar and topbar wrap it as usual.
 *
 * Same steps and copy as the mobile KYC flow:
 *   mobile → otp → pin → rq1..rq7 → score → email → emailotp
 *   → pan → kyc → esign → bank → (nominee | done)
 *
 * Two simplifications vs the mobile app, called out inline below:
 *   - the signature pad is a tap-to-sign toggle, not freehand drawing
 *   - OTP/PIN boxes don't auto-advance focus between digits
 */

const RQ_DATA = [
  { text: 'What is your current age?', subtitle: 'Helps assess investment time horizon and risk appetite', options: ['Below 35 years', '35 – 50 years', '51 – 60 years', 'Above 60 years'] },
  { text: 'What is your current annual income?', subtitle: 'Assesses financial capacity', options: ['Less than ₹5 lakh', '₹5 lakh – ₹10 lakh', '₹10 lakh – ₹25 lakh', 'More than ₹25 lakh'] },
  { text: 'How would you describe your saving habits?', subtitle: 'Assesses saving behavior and capacity', options: ['I rarely save', 'I save occasionally', 'I save regularly', 'I save aggressively'] },
  { text: 'How would you describe your knowledge of financial products & markets?', subtitle: 'Assesses financial literacy', options: ['Very Limited', 'Basic understanding', 'Moderate understanding', 'Extensive knowledge & experience'] },
  { text: 'What is your primary investment objective?', subtitle: 'Helps identify goal and risk appetite', options: ['Capital Preservation', 'Regular Income', 'Moderate Growth', 'High Growth'] },
  { text: 'How would you react if your investment dropped 20% in value in a short time?', subtitle: 'Assesses risk tolerance', options: ['Sell everything immediately', 'Sell some to reduce loss', 'Stay invested and wait', 'Invest more to take advantage'] },
  { text: 'What is your planned investment time horizon?', subtitle: 'Time to goal impacts portfolio risk level', options: ['Less than 1 year', '1 – 3 years', '3 – 5 years', 'More than 5 years'] },
];

const STEP_MAP = {
  rq1: { s: 1, p: [1, 7], h: 'Just a few steps to tailor your financial journey' },
  rq2: { s: 1, p: [2, 7], h: 'Just a few steps to tailor your financial journey' },
  rq3: { s: 1, p: [3, 7], h: 'Just a few steps to tailor your financial journey' },
  rq4: { s: 1, p: [4, 7], h: 'Just a few steps to tailor your financial journey' },
  rq5: { s: 1, p: [5, 7], h: 'Just a few steps to tailor your financial journey' },
  rq6: { s: 1, p: [6, 7], h: 'Just a few steps to tailor your financial journey' },
  rq7: { s: 1, p: [7, 7], h: 'Just a few steps to tailor your financial journey' },
  score: { s: 1, p: [7, 7], h: 'Your risk profile is ready' },
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
  rq1: 'pin', rq2: 'rq1', rq3: 'rq2', rq4: 'rq3', rq5: 'rq4', rq6: 'rq5', rq7: 'rq6',
  score: 'rq7', email: 'score', emailotp: 'email',
  bank: 'esign', nominee: 'bank',
};

const RELATIONS = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Others'];

export default function OnboardingFlow({ mode = 'signup' }) {
  const router = useRouter();
  const [screen, setScreen] = useState('mobile');
  const [rqSel, setRqSel] = useState({});
  const [pep, setPep] = useState(false);
  const [esignAgree, setEsignAgree] = useState(false);
  const [esignSigned, setEsignSigned] = useState(false);
  const [nomineeOptOut, setNomineeOptOut] = useState(false);
  const [nomineeRelation, setNomineeRelation] = useState('Father');
  const [kycModalOpen, setKycModalOpen] = useState(false);

  const go = (next) => setScreen(next);

  const pickOption = (qIdx, optIdx, next) => {
    setRqSel((prev) => ({ ...prev, [qIdx]: optIdx }));
    setTimeout(() => setScreen(next), 280);
  };

  const bankNext = () => go(nomineeOptOut ? 'done' : 'nominee');

  const restart = () => {
    setScreen('mobile');
    setRqSel({});
    setPep(false);
    setEsignAgree(false);
    setEsignSigned(false);
    setNomineeOptOut(false);
    setNomineeRelation('Father');
    setKycModalOpen(false);
  };

  const cfg = STEP_MAP[screen];
  const isLogin = mode === 'login';
  const entryLabel = isLogin ? 'Login' : 'Sign up';
  const backTarget = screen === 'otp' ? null : isLogin ? null : BACK_MAP[screen];

  return (
    <div className="max-w-[640px] mx-auto px-6 pt-10 pb-24">
      {cfg && (
        <Stepper
          activeStep={cfg.s}
          headline={cfg.h}
          progress={cfg.p ? Math.round((cfg.p[0] / cfg.p[1]) * 100) : null}
        />
      )}

      {backTarget && (
        <button
          type="button"
          onClick={() => go(backTarget)}
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
          <FieldInput label="Mobile Number" prefix="+91" type="tel" maxLength={10} placeholder="Enter mobile number" />
          {isLogin && (
            <div className="mb-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">
                4-digit PIN
              </label>
              <CodeInputs count={4} />
            </div>
          )}
          {!isLogin && <LinkText>Have a Referral Code?</LinkText>}
          <Button onClick={() => go('otp')}>Proceed</Button>
        </>
      )}

      {/* OTP */}
      {screen === 'otp' && (
        <>
          <Overline>{entryLabel}</Overline>
          <PageHeading>Enter the OTP sent to</PageHeading>
          <PageSub>+91 75875 86959</PageSub>
          <CodeInputs count={6} />
          <LinkText>Resend OTP</LinkText>
          <Button onClick={() => (isLogin ? router.push('/dashboard') : go('pin'))}>Proceed</Button>
        </>
      )}

      {/* PIN */}
      {screen === 'pin' && (
        <>
          <PageHeading>Set Your PIN</PageHeading>
          <PageSub>Kindly set up your 6-digit PIN</PageSub>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-5 shadow-sm">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Enter 6-Digit PIN
            </label>
            <CodeInputs count={6} />
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Re-Enter PIN
            </label>
            <CodeInputs count={6} />
          </div>
          <Button onClick={() => go('rq1')}>Get Started</Button>
        </>
      )}

      {/* RISK QUESTIONS — one generic screen driven by RQ_DATA */}
      {screen.startsWith('rq') &&
        screen.length === 3 &&
        (() => {
          const idx = parseInt(screen.slice(2), 10);
          const d = RQ_DATA[idx - 1];
          const nextScreen = idx < 7 ? `rq${idx + 1}` : 'score';
          return (
            <>
              <QuestionCard
                icon={<RiskIcon className="w-[21px] h-[21px]" />}
                counter={`(${idx} of 7)`}
                title={d.text}
                subtitle={d.subtitle}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {d.options.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => pickOption(idx, i, nextScreen)}
                    className={`text-left rounded-2xl border-[1.5px] px-4 py-[18px] text-sm font-semibold transition-colors ${
                      rqSel[idx] === i
                        ? 'border-emerald-700 bg-emerald-50 text-[#0C4A3E]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          );
        })()}

      {/* SCORE */}
      {screen === 'score' && (
        <div className="flex flex-col items-center text-center">
          <ScoreRing score={75} max={100} />
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-[18px] py-2 text-[13px] font-bold text-[#0C4A3E]">
            <ShieldIcon className="w-4 h-4" />
            Moderately Aggressive
          </div>
          <p className="text-sm text-neutral-500 mt-5 leading-relaxed max-w-[400px]">
            You are comfortable with moderate risk for potentially higher returns over the long term.
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
          <Button onClick={() => go('done')}>Continue</Button>
        </>
      )}

      {/* DONE */}
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
          <Button className="max-w-[280px]">Go to Dashboard</Button>
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
