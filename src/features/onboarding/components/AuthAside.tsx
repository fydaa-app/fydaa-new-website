import { ProductWindow } from "@/components/ui/product-window";
import { siteConfig } from "@/config/site";
import { formatInr } from "@/lib/format/money";
import type { SignupPlan } from "../lib/signupIntent";

const { distributor, adviser } = siteConfig.entities;
const { contact } = siteConfig;

/** What an account is for. Wording follows the home page's product sections. */
const ACCOUNT_USES = [
  {
    title: "Invest for each goal",
    body: "Start a mutual fund SIP for a home, your child's education or retirement, from ₹1,000 a month.",
  },
  {
    title: "See all your money in one place",
    body: "Money Vault adds up your bank accounts, investments, loans and assets.",
  },
  {
    title: "Know how healthy it is",
    body: "Wealth Score rates your finances out of 100 and shows the first thing to fix.",
  },
];

function Stroke() {
  return <i aria-hidden="true" className="mt-1.5 block h-3.5 w-1.5 shrink-0 -rotate-[38deg] rounded-full bg-sprout" />;
}

/** Both registrations, from siteConfig (never typed by hand). */
function Registrations() {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <div>
        <dt className="text-sm text-grey-600">Mutual fund distributor</dt>
        <dd className="mt-1 text-sm leading-relaxed text-ink">
          <span className="block font-semibold">AMFI {distributor.arn}</span>
          {distributor.legalName}
        </dd>
      </div>
      <div>
        <dt className="text-sm text-grey-600">Investment adviser</dt>
        <dd className="mt-1 text-sm leading-relaxed text-ink">
          <span className="block font-semibold">{adviser.registration}</span>
          {adviser.legalName}
        </dd>
      </div>
    </dl>
  );
}

/** The SIP picked in the home planner, shown back as the thing this account is for. */
function PlanWindow({ plan }: { plan: SignupPlan }) {
  const per = plan.frequency === "daily" ? "a day" : "a month";
  return (
    <ProductWindow title="Your SIP plan" meta="From the goal planner">
      <p className="text-sm text-grey-600">You picked</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="text-figure text-ink">{formatInr(plan.amount)}</span>
        <span className="text-base text-grey-600">{per}</span>
      </p>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-grey-600">Fund type</dt>
          <dd className="font-semibold text-ink">{plan.categoryLabel}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-grey-600">For</dt>
          <dd className="figure font-semibold text-ink">{plan.years} years</dd>
        </div>
      </dl>
      <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-grey-600">
        Create your account and complete KYC to start this SIP.
      </p>
    </ProductWindow>
  );
}

/**
 * The quiet column beside the login and signup forms: what an account is for (signup), where the
 * money goes and who is registered for what. Every fact here is checkable.
 */
export function AuthAside({ mode, plan = null }: { mode: "login" | "signup"; plan?: SignupPlan | null }) {
  const isLogin = mode === "login";
  return (
    <aside aria-label={isLogin ? "About your account" : "About Fydaa accounts"} className="flex flex-col gap-6">
      {!isLogin && plan ? <PlanWindow plan={plan} /> : null}

      <div className="rounded-4xl bg-mist p-6 sm:p-8">
        {isLogin ? (
          <>
            <h2 className="text-title text-ink">Your investments, in your name</h2>
            <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-grey-600">
              Every SIP you start on Fydaa is paid straight to the fund house (AMC) and held in your name. Fydaa never
              holds your money. You can see each holding on{" "}
              <a href="https://www.mfcentral.com/" target="_blank" rel="noopener noreferrer" className="link">
                MF Central
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2 className="text-title text-ink">What you can do with an account</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {ACCOUNT_USES.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Stroke />
                  <p className="text-base leading-relaxed text-grey-600">
                    <span className="font-semibold text-ink">{item.title}.</span> {item.body}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line pt-6">
              <h3 className="text-base font-semibold text-ink">Your money goes straight to the fund house</h3>
              <p className="mt-1 max-w-[52ch] text-base leading-relaxed text-grey-600">
                SIPs are paid to the mutual fund (AMC) in your own name. Fydaa never holds your money.
              </p>
            </div>
          </>
        )}

        <div className="mt-6 border-t border-line pt-6">
          <Registrations />
        </div>

        {isLogin ? (
          <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-grey-600">
            Can&apos;t log in? Call{" "}
            <a href={contact.phoneHref} className="link whitespace-nowrap">
              {contact.phone}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${contact.email}`} className="link">
              {contact.email}
            </a>
            .
          </p>
        ) : null}
      </div>
    </aside>
  );
}
