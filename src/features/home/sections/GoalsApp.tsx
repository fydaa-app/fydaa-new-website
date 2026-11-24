import type { CSSProperties } from "react";

/**
 * Sample goals for the app window. Illustrative only: amounts invested, never returns, so the window
 * makes no projection. Swap for real screens when the app's design files are available.
 */
const GOALS = [
  { name: "Home down payment", target: "₹25 L by 2032", sip: "₹18,000", done: 30, state: "On track" },
  { name: "Child’s education", target: "₹40 L by 2038", sip: "₹12,500", done: 18, state: "On track" },
  { name: "Retirement", target: "₹3 Cr by 2054", sip: "₹20,000", done: 6, state: "On track" },
  { name: "Emergency fund", target: "₹3 L, any time", sip: "₹5,000", done: 82, state: "On track" },
  { name: "Wedding", target: "₹12 L by 2028", sip: "₹30,000", done: 41, state: "Behind" },
  { name: "Car", target: "₹8 L by 2029", sip: "₹15,000", done: 26, state: "On track" },
  { name: "Trip to Japan", target: "₹4 L by 2027", sip: "₹20,000", done: 55, state: "On track" },
  { name: "Parents’ health cover", target: "₹2 L, yearly", sip: "₹4,000", done: 100, state: "Done" },
  { name: "Sabbatical", target: "₹6 L by 2030", sip: "₹8,000", done: 12, state: "On track" },
  { name: "New laptop", target: "₹1.5 L by 2027", sip: "₹6,000", done: 64, state: "On track" },
] as const;

const FUNDS = [
  { name: "Flexi cap fund", kind: "Equity", share: 60 },
  { name: "Large and mid cap fund", kind: "Equity", share: 25 },
  { name: "Short duration fund", kind: "Debt", share: 15 },
] as const;

const INSTALMENTS = [
  { date: "5 Nov 2026", amount: "₹18,000" },
  { date: "5 Oct 2026", amount: "₹18,000" },
  { date: "5 Sep 2026", amount: "₹18,000" },
  { date: "5 Aug 2026", amount: "₹18,000" },
  { date: "5 Jul 2026", amount: "₹18,000" },
  { date: "5 Jun 2026", amount: "₹18,000" },
] as const;

const stateClass = { "On track": "is-on", Behind: "is-behind", Done: "is-done" } as const;

function Progress({ value }: { value: number }) {
  return <span className="ga-progress" style={{ "--v": `${value}%` } as CSSProperties} />;
}

/** The Goals screen as one app window across the content box (tasteskill app-frame). */
export function GoalsApp() {
  const open = GOALS[0];

  return (
    <section id="goals" className="section" aria-labelledby="goals-title">
      <div className="wrap">
        <div className="section-split grid">
          <h2 id="goals-title" className="span-5">
            Goals, each with its own SIP
          </h2>
          <p className="span-6 section-split__text start-7">
            Each goal in the Fydaa app shows its target, the SIP that pays into it, the funds it holds and how
            much is left to invest.
          </p>
        </div>

        <div
          className="ui app fill frame"
          role="img"
          aria-label="The Goals screen in the Fydaa app: ten goals listed beside the open goal, a home down payment with its target, monthly SIP, funds and instalments."
        >
          <div className="app__pane app__pane--list">
            <div className="ga-head">
              <span>Goals</span>
              <span className="ga-muted">10</span>
            </div>
            <ul className="ga-list" data-ui>
              {GOALS.map((goal, index) => (
                <li key={goal.name} className={index === 0 ? "is-open" : undefined}>
                  <span className="ga-name">{goal.name}</span>
                  <span className={`ga-chip ${stateClass[goal.state]}`}>{goal.state}</span>
                  <span className="ga-sub">{goal.target}</span>
                  <span className="ga-sub ga-right">{goal.sip} a month</span>
                  <Progress value={goal.done} />
                </li>
              ))}
            </ul>
          </div>

          <div className="app__pane app__pane--open">
            <div className="ga-head">
              <span>{open.name}</span>
              <span className="ga-chip is-on">{open.state}</span>
            </div>
            <div className="ga-open" data-ui>
              <div className="ga-figure-row">
                <div>
                  <p className="ga-label">Invested so far</p>
                  <p className="ga-figure">₹7,38,000</p>
                </div>
                <div className="ga-right">
                  <p className="ga-label">Target</p>
                  <p className="ga-figure ga-figure--small">₹25,00,000</p>
                </div>
              </div>
              <Progress value={open.done} />
              <dl className="ga-facts">
                <div>
                  <dt>Monthly SIP</dt>
                  <dd>₹18,000 on the 5th</dd>
                </div>
                <div>
                  <dt>Instalments paid</dt>
                  <dd>41</dd>
                </div>
                <div>
                  <dt>Target date</dt>
                  <dd>March 2032</dd>
                </div>
              </dl>

              <p className="ga-label ga-section">Funds in this goal</p>
              <ul className="ga-funds">
                {FUNDS.map((fund) => (
                  <li key={fund.name}>
                    <span className="ga-name">{fund.name}</span>
                    <span className="ga-sub">{fund.kind}</span>
                    <span className="ga-share">{fund.share}%</span>
                  </li>
                ))}
              </ul>

              <p className="ga-label ga-section">Instalments</p>
              <ul className="ga-rows">
                {INSTALMENTS.map((row) => (
                  <li key={row.date}>
                    <span>{row.date}</span>
                    <span>{row.amount}</span>
                    <span className="ga-chip is-done">Paid</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
