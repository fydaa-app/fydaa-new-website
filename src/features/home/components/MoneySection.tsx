"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { ProductWindow } from "@/components/ui/product-window";
import { MONEY_VAULT, WEALTH_SCORE } from "../data/productPanels";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TONE = { good: "#1A9E6E", warn: "#B45309" } as const;

/** True once the element has been on screen; starts true without IntersectionObserver. */
function useSeenOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSeen(entry?.isIntersecting ? true : (prev) => prev ?? false);
        if (entry?.isIntersecting) observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, seen] as const;
}

function WealthScore() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { score, max, pillars } = WEALTH_SCORE;
  const to = CIRCUMFERENCE * (1 - score / max);

  return (
    <div
      ref={ref}
      // Server and no-JS render the finished ring; the client resets it once and draws it in view.
      data-inview={seen === false ? "false" : "true"}
      style={{ "--ring-c": CIRCUMFERENCE.toFixed(2), "--ring-to": to.toFixed(2) } as CSSProperties}
      className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center"
    >
      <div className="relative mx-auto size-36">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#EBF0EE" strokeWidth="10" />
          <circle
            className="score-ring-fill"
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#1A9E6E"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE.toFixed(2)}
            strokeDashoffset={to.toFixed(2)}
          />
        </svg>
        <p className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="figure text-4xl font-semibold text-ink">{score}</span>
          <span className="text-xs text-grey-500">out of {max}</span>
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {pillars.map((p, i) => (
          <li key={p.key}>
            <div className="flex justify-between text-sm">
              <span className="text-grey-600">{p.key}</span>
              <span className="figure font-semibold" style={{ color: TONE[p.tone as keyof typeof TONE] }}>
                {p.value}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mist">
              <div
                className="score-bar h-full rounded-full"
                style={
                  {
                    width: `${p.value}%`,
                    background: TONE[p.tone as keyof typeof TONE],
                    "--i": i,
                  } as CSSProperties
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoneyVault() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-grey-600">Net worth</p>
        <p className="figure mt-1 text-4xl font-semibold text-ink">{MONEY_VAULT.netWorth}</p>
        <p className="mt-2 inline-flex rounded-full bg-jade-tint px-2.5 py-1 text-xs font-semibold text-emerald">
          {MONEY_VAULT.monthChange}
        </p>
      </div>
      <dl className="divide-y divide-line border-y border-line">
        {MONEY_VAULT.rows.map((row) => (
          <div key={row.key} className="flex justify-between py-3 text-sm">
            <dt className="text-grey-600">{row.key}</dt>
            <dd
              className={
                row.tone === "green"
                  ? "figure font-semibold text-emerald"
                  : row.tone === "error"
                    ? "figure font-semibold text-danger"
                    : "figure font-semibold text-ink"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Money Vault and Wealth Score: two different windows, each with what it answers. */
export default function MoneySection() {
  return (
    <section aria-labelledby="money-title" className="section bg-mist">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 id="money-title" className="max-w-[18ch] text-heading text-ink">
            See all your money, and how healthy it is
          </h2>
          <p className="max-w-[56ch] text-lead text-grey-600">
            Link your accounts once. Fydaa adds up what you own and owe, and scores how well it&apos;s
            working.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
          <article className="flex flex-col gap-5">
            <div>
              <h3 className="text-title text-ink">Money Vault</h3>
              <p className="mt-1 max-w-[46ch] text-base leading-relaxed text-grey-600">
                Bank accounts, investments, loans and assets in one view, with your net worth kept up to date.
              </p>
            </div>
            <ProductWindow title="Money Vault" meta="Updated today" className="lg:h-full">
              <MoneyVault />
            </ProductWindow>
          </article>
          <article className="flex flex-col gap-5">
            <div>
              <h3 className="text-title text-ink">Wealth Score</h3>
              <p className="mt-1 max-w-[46ch] text-base leading-relaxed text-grey-600">
                One number out of 100 across five areas of your finances, with the first thing to fix.
              </p>
            </div>
            <ProductWindow title="Wealth Score" meta="This month" className="lg:h-full">
              <WealthScore />
            </ProductWindow>
          </article>
        </div>
      </Container>
    </section>
  );
}
