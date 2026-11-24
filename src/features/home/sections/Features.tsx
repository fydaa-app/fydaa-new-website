import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { routes } from "@/config/routes";
import { MONEY_VAULT, WEALTH_SCORE } from "../data/productPanels";

/** One open card (tasteskill features-2x2): the title and two lines on the ground, the panel under them. */
function Card({ title, children, panel }: { title: string; children: ReactNode; panel: ReactNode }) {
  return (
    <article className="card card--open span-6 m-nolift">
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{children}</p>
      <div className="panel">{panel}</div>
    </article>
  );
}

function MoneyVault() {
  return (
    <div
      data-ui
      className="frag frag--rise"
      role="img"
      aria-label="Money Vault: net worth with assets, liabilities, investments and linked bank accounts"
    >
      <p className="frag__label">Net worth</p>
      <p className="frag__figure">{MONEY_VAULT.netWorth}</p>
      <dl className="frag__rows">
        {MONEY_VAULT.rows.map((row) => (
          <div key={row.key}>
            <dt>{row.key === "Bank Accounts" ? "Bank accounts" : row.key}</dt>
            <dd className={row.tone === "error" ? "is-loss" : undefined}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function WealthScore() {
  const { score, max, pillars } = WEALTH_SCORE;
  return (
    <div
      data-ui
      className="frag frag--rise frag--score"
      role="img"
      aria-label={`Wealth Score ${score} out of ${max}, across five areas`}
    >
      <div className="frag__ring">
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r={RADIUS} className="frag__ring-track" />
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            transform="rotate(-90 40 40)"
            className="frag__ring-fill"
            strokeDasharray={CIRCUMFERENCE.toFixed(2)}
            strokeDashoffset={(CIRCUMFERENCE * (1 - score / max)).toFixed(2)}
          />
        </svg>
        <span className="frag__ring-value">{score}</span>
      </div>
      <p className="frag__tip">First to fix: leverage</p>
      <ul className="frag__bars">
        {pillars.map((pillar) => (
          <li key={pillar.key}>
            <span>{pillar.key.replace("&", "and")}</span>
            <span className="frag__bar" style={{ "--v": `${pillar.value}%` } as CSSProperties} />
            <span className="frag__num">{pillar.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoneyRoute() {
  return (
    <div
      data-ui
      className="frag frag--rise frag--route"
      role="img"
      aria-label="Your money goes from your bank to the fund house, and the units are held in your name; check them on MF Central"
    >
      <ol className="route">
        <li>
          <span className="route__dot" />
          <span className="route__name">Your bank account</span>
          <span className="route__sub">₹18,000 on the 5th</span>
        </li>
        <li>
          <span className="route__dot" />
          <span className="route__name">Fund house</span>
          <span className="route__sub">Buys units at that day’s NAV</span>
        </li>
        <li>
          <span className="route__dot" />
          <span className="route__name">Units in your name</span>
          <span className="route__sub">Held with the fund’s registrar</span>
        </li>
        <li>
          <span className="route__dot route__dot--end" />
          <span className="route__name">MF Central</span>
          <span className="route__sub">Shows every holding you own</span>
        </li>
      </ol>
    </div>
  );
}

function Withdrawal() {
  return (
    <div
      data-ui
      className="frag frag--rise frag--withdraw"
      role="img"
      aria-label="A withdrawal of ₹40,000 from the emergency fund to the linked bank account"
    >
      <p className="frag__label">Withdraw from Emergency fund</p>
      <p className="frag__figure">₹40,000</p>
      <dl className="frag__rows">
        <div>
          <dt>To</dt>
          <dd>Bank account ending 4821</dd>
        </div>
        <div>
          <dt>Lock-in</dt>
          <dd>None</dd>
        </div>
        <div>
          <dt>Reaches your bank</dt>
          <dd>In 1 to 3 business days</dd>
        </div>
      </dl>
      <span className="frag__button">Withdraw</span>
    </div>
  );
}

/** The rest of the app on two screens: Money Vault, Wealth Score, where the money goes, withdrawals. */
export function Features() {
  return (
    <section id="features" className="section g2" aria-labelledby="features-title">
      <div className="wrap">
        <div className="group">
          <h2 id="features-title" className="section-title">
            The rest of your money, next to your mutual funds.{" "}
            <span className="muted">Money Vault, Wealth Score and withdrawals.</span>
          </h2>
          <div className="cards grid">
            <Card title="Adds up your funds, loans and savings" panel={<MoneyVault />}>
              Money Vault puts bank accounts, investments, loans and assets in one net worth.
            </Card>
            <Card title="Scores your finances out of 100" panel={<WealthScore />}>
              Wealth Score rates five areas of your finances and names the first thing to fix.
            </Card>
          </div>
        </div>
        <div className="cards grid">
          <Card title="Sends each SIP to the fund house" panel={<MoneyRoute />}>
            Your money goes straight to the fund house, never to Fydaa, and the units are yours.
          </Card>
          <Card title="Pays out in 1 to 3 business days" panel={<Withdrawal />}>
            Only tax-saving ELSS funds lock your money in, for 3 years.
          </Card>
          <p className="cards__more">
            <Link href={routes.features.path} className="link">
              See every feature
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
