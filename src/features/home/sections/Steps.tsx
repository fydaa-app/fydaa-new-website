import type { ReactNode } from "react";

function Step({ n, title, text, panel }: { n: number; title: string; text: string; panel: ReactNode }) {
  return (
    <li className="card card--open span-4 m-nolift">
      <h3 className="card__title">
        <span className="step-num font-mono">{String(n).padStart(2, "0")}</span>
        {title}
      </h3>
      <p className="card__text">{text}</p>
      <div className="panel">{panel}</div>
    </li>
  );
}

function OtpFragment() {
  return (
    <div
      data-ui
      className="frag frag--rise"
      role="img"
      aria-label="Sign-up screen: a six-digit code sent to a mobile number"
    >
      <p className="frag__label">Code sent to +91 98xxx xx210</p>
      <div className="otp">
        {["4", "8", "2", "9", "1", "6"].map((digit, index) => (
          <span key={index}>{digit}</span>
        ))}
      </div>
      <span className="frag__button">Verify</span>
    </div>
  );
}

function KycFragment() {
  return (
    <div
      data-ui
      className="frag frag--rise"
      role="img"
      aria-label="KYC checklist: PAN, Aadhaar, signature and bank account, all done"
    >
      <p className="frag__label">KYC</p>
      <ul className="checks">
        {["PAN", "Aadhaar", "Signature", "Bank account"].map((item) => (
          <li key={item}>
            <span>{item}</span>
            <span className="ga-chip is-done">Done</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SipFragment() {
  return (
    <div
      data-ui
      className="frag frag--rise"
      role="img"
      aria-label="Start a SIP for a home down payment: ₹18,000 a month on the 5th"
    >
      <p className="frag__label">Home down payment</p>
      <p className="frag__figure">₹18,000</p>
      <dl className="frag__rows">
        <div>
          <dt>Every month on the</dt>
          <dd>5th</dd>
        </div>
        <div>
          <dt>First instalment</dt>
          <dd>5 Dec 2026</dd>
        </div>
      </dl>
      <span className="frag__button">Start SIP</span>
    </div>
  );
}

/** How to start, in the order it happens (tasteskill steps). */
export function Steps() {
  return (
    <section id="how-it-works" className="section" aria-labelledby="steps-title">
      <div className="wrap">
        <h2 id="steps-title" className="section-title">
          Start a goal SIP in 3 steps
        </h2>
        <ol className="cards grid">
          <Step
            n={1}
            title="Sign up with your mobile"
            text="A one-time code confirms the number. No paperwork at this point."
            panel={<OtpFragment />}
          />
          <Step
            n={2}
            title="Finish KYC with PAN and Aadhaar"
            text="You do it once, on the web or in the app, and it covers every fund house."
            panel={<KycFragment />}
          />
          <Step
            n={3}
            title="Pick a goal and start its SIP"
            text="Choose the amount and the day of the month it is taken from your bank."
            panel={<SipFragment />}
          />
        </ol>
      </div>
    </section>
  );
}
