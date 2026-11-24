"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ChangeEvent, type ClipboardEvent, type CSSProperties } from "react";
import { GetAppButton } from "@/components/app/get-app-button";
import { SubtleNumber } from "@/components/ui/subtle-number";
import { siteConfig } from "@/config/site";
import { formatInrShort, sipFutureValue } from "@/lib/format/money";
import { SIP_CATEGORIES, SIP_CATEGORY_ORDER, SIP_MINIMUMS, SIP_TENURE_OPTIONS } from "../data/sipCategories";

type CategoryKey = keyof typeof SIP_CATEGORIES;
type Frequency = "monthly" | "daily";

const LIMITS: Record<Frequency, { min: number; max: number; step: number }> = {
  daily: { min: SIP_MINIMUMS.daily, max: 1000, step: 50 },
  monthly: { min: SIP_MINIMUMS.monthly, max: 100000, step: 500 },
};

const clamp = (value: number, frequency: Frequency) =>
  Math.min(LIMITS[frequency].max, Math.max(LIMITS[frequency].min, value));

const inr = new Intl.NumberFormat("en-IN");

/** Invested money against the illustrated value, year by year: two round-capped lines. */
function GrowthChart({ monthly, years, rate }: { monthly: number; years: number; rate: number }) {
  const points = Array.from({ length: years + 1 }, (_, year) => ({
    put: monthly * 12 * year,
    value: sipFutureValue(monthly, year, rate),
  }));
  const top = points[points.length - 1]?.value || 1;
  const x = (i: number) => (i / years) * 100;
  const y = (v: number) => 100 - (v / top) * 92;
  const line = (key: "put" | "value") =>
    points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[key])}`).join(" ");
  return (
    <svg className="planner__chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${line("value")} L100,100 L0,100 Z`} className="planner__chart-area" />
      <path d={line("put")} className="planner__chart-put" vectorEffect="non-scaling-stroke" />
      <path d={line("value")} className="planner__chart-value" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * The SIP planner: pick a fund type, an amount and the years, and see what it could come to. The
 * figure and its assumption change together; the market-risk line is always under them.
 */
function Planner({
  category,
  setCategory,
  frequency,
  setFrequency,
  amount,
  setAmount,
  years,
  setYears,
}: {
  category: CategoryKey;
  setCategory: (value: CategoryKey) => void;
  frequency: Frequency;
  setFrequency: (value: Frequency) => void;
  amount: number;
  setAmount: (value: number) => void;
  years: number;
  setYears: (value: number) => void;
}) {
  const ids = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const limits = LIMITS[frequency];
  const rate = SIP_CATEGORIES[category].rate;

  const { invested, growth, total } = useMemo(() => {
    const monthly = frequency === "daily" ? amount * 30 : amount;
    const value = sipFutureValue(monthly, years, rate);
    const put = monthly * years * 12;
    return { invested: put, growth: value - put, total: value };
  }, [amount, frequency, years, rate]);

  function onAmount(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/[^\d]/g, "");
    const next = digits ? Number(digits) : 0;
    if (next > limits.max) return;
    setDraft(digits ? inr.format(next) : "");
    if (next >= limits.min) setAmount(next);
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData("text").replace(/[^\d]/g, "");
    if (!digits) return;
    event.preventDefault();
    const next = clamp(Number(digits), frequency);
    setDraft(null);
    setAmount(next);
  }

  function onFrequency(next: Frequency) {
    if (next === frequency) return;
    setFrequency(next);
    setDraft(null);
    setAmount(next === "daily" ? 200 : 5000);
  }

  const share = total > 0 ? (invested / total) * 100 : 0;
  const per = frequency === "daily" ? "a day" : "a month";

  return (
    <div className="planner ui" data-ui role="group" aria-labelledby={`${ids}-title`}>
      <div className="planner__bar">
        <span className="planner__mark" aria-hidden="true">
          <i />
          <i />
        </span>
        <span id={`${ids}-title`} className="planner__title">
          SIP planner
        </span>
        <span className="planner__tag">Illustration</span>
      </div>

      <div className="planner__body">
        <div className="planner__result" aria-live="polite">
          <p className="planner__label">{`₹${inr.format(amount)} ${per} for ${years} years could grow to`}</p>
          <p className="planner__figure">
            <SubtleNumber text={formatInrShort(total)} value={total} />
          </p>
          <div
            className="planner__split"
            aria-hidden="true"
            style={{ "--share": `${share.toFixed(1)}%` } as CSSProperties}
          >
            <i />
            <i />
          </div>
          <dl className="planner__parts">
            <div>
              <dt>You put in</dt>
              <dd>{formatInrShort(invested)}</dd>
            </div>
            <div>
              <dt>Growth</dt>
              <dd>{formatInrShort(growth)}</dd>
            </div>
          </dl>
          <GrowthChart monthly={frequency === "daily" ? amount * 30 : amount} years={years} rate={rate} />
          <p className="planner__risk">
            Illustration only, at an assumed {rate}% a year for {SIP_CATEGORIES[category].label.toLowerCase()}{" "}
            funds. Returns are not guaranteed. Mutual fund investments are subject to market risks. Read all
            scheme-related documents carefully.
          </p>
        </div>

        <div className="planner__controls">
          {/* A phone gets the fund type as one native select; wider screens get the chips. */}
          <div className="planner__row planner__row--select">
            <label htmlFor={`${ids}-type`} className="planner__label">
              Fund type
            </label>
            <select
              id={`${ids}-type`}
              className="planner__select"
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryKey)}
            >
              {(SIP_CATEGORY_ORDER as CategoryKey[]).map((key) => (
                <option key={key} value={key}>
                  {SIP_CATEGORIES[key].label}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="planner__row planner__row--chips">
            <legend className="planner__label">Fund type</legend>
            <div className="planner__chips">
              {(SIP_CATEGORY_ORDER as CategoryKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="planner__chip"
                  aria-pressed={category === key}
                  onClick={() => setCategory(key)}
                >
                  {SIP_CATEGORIES[key].label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="planner__row">
            <label htmlFor={`${ids}-amount`} className="planner__label">
              {frequency === "daily" ? "Daily SIP" : "Monthly SIP"}
            </label>
            <div className="planner__amount-row">
              <div className="planner__amount">
                <span aria-hidden="true">₹</span>
                <input
                  id={`${ids}-amount`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={draft ?? inr.format(amount)}
                  onChange={onAmount}
                  onPaste={onPaste}
                  onBlur={() => setDraft(null)}
                  aria-describedby={`${ids}-limits`}
                />
              </div>
              <div className="planner__toggle" role="group" aria-label="How often">
                {(["monthly", "daily"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={frequency === option}
                    onClick={() => onFrequency(option)}
                  >
                    {option === "monthly" ? "Monthly" : "Daily"}
                  </button>
                ))}
              </div>
            </div>
            <p id={`${ids}-limits`} className="sr-only">
              {`From ₹${inr.format(limits.min)} to ₹${inr.format(limits.max)} ${per}.`}
            </p>
          </div>

          <fieldset className="planner__row">
            <legend className="planner__label">Years</legend>
            <div className="planner__chips planner__chips--years">
              {SIP_TENURE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="planner__chip"
                  aria-pressed={years === option}
                  onClick={() => setYears(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

/**
 * The home hero (tasteskill `split`): what Fydaa is, for whom, with one hard fact, two actions and
 * the live SIP planner beside it. The plan set in the planner travels with both actions.
 */
export function Hero() {
  const [category, setCategory] = useState<CategoryKey>("equity");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState(5000);
  const [years, setYears] = useState(10);

  const startSipHref = `/signup?${new URLSearchParams({
    intent: "sip",
    category,
    frequency,
    amount: String(amount),
    years: String(years),
  })}`;

  return (
    <section className="hero hero--split" data-enter aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-text hero-split">
          <div className="hero-copy">
            <h1 id="hero-title" data-enter-item style={{ "--i": 0 } as CSSProperties}>
              Mutual fund SIPs, each tied to a goal
            </h1>
            <p className="hero__lead" data-enter-item style={{ "--i": 1 } as CSSProperties}>
              Name what you are saving for, set an amount and a date, and Fydaa runs a SIP in direct mutual
              funds towards it, in your name.
            </p>
            <div className="btn-row" data-enter-item style={{ "--i": 2 } as CSSProperties}>
              <GetAppButton
                size="md"
                icon={false}
                data={{ source: "web_hero", category, amount, years }}
                className="hero__main"
              >
                Get the app
              </GetAppButton>
              <Link href={startSipHref} className="btn btn-secondary btn-md" data-ph-event="Start this SIP">
                Start a SIP on the web
              </Link>
            </div>
            <dl className="hero-facts" data-enter-item style={{ "--i": 3 } as CSSProperties}>
              <div>
                <dt>Minimum SIP</dt>
                <dd>₹1,000 a month</dd>
              </div>
              <div>
                <dt>Mutual fund distributor</dt>
                <dd className="font-mono">{siteConfig.entities.distributor.arn}</dd>
              </div>
              <div>
                <dt>Investment adviser</dt>
                <dd className="font-mono">{siteConfig.entities.adviser.sebiRegistrationNumber}</dd>
              </div>
            </dl>
          </div>
          <div className="hero-visual" data-enter-media>
            <Planner
              category={category}
              setCategory={setCategory}
              frequency={frequency}
              setFrequency={setFrequency}
              amount={amount}
              setAmount={setAmount}
              years={years}
              setYears={setYears}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
