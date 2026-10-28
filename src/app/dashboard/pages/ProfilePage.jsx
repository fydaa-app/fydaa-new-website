"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Activity, Building, Info, ChevronRight, LogOut, Check, Landmark } from "lucide-react";
import { bandFromIndicators, clearTokens, getRiskIndicators, scoreFromIndicators } from "../../signup/lib/authApi";
import { PAGE_SHELL } from "../lib/layoutClasses";

const sections = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "risk",     label: "Investment Style", icon: Activity },
  { id: "bank",     label: "Bank & Autopay",   icon: Building },
  { id: "about",    label: "About Fydaa",      icon: Info },
];

const sectionContent = {
  about: {
    title: "About Fydaa",
    description: "Fydaa is an automated personalised money management platform. We use low-cost, efficient investment vehicles — mainly ETFs and index funds — to help you grow wealth steadily. As a SEBI-registered entity (INA000015969), we adhere to strict guidelines to safeguard your interests.",
    groups: [
      { label: "Details", rows: [
        ["Entity", "Fydaa Analytics Private Limited"],
        ["AMFI registered ARN", "358522"],
      ]},
    ],
  },
};

function show(value, user) {
  if (user === undefined) return "…";
  return value || "—";
}

function moneyInr(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function BankAutopaySection({ user }) {
  const loading = user === undefined;
  const bank = user?.bank;
  const connected = !!bank?.name || !!bank?.account || !!bank?.ifsc;
  const mandateActive = user?.isMfMandate === true;
  const limit = moneyInr(user?.mandateAmount);
  const accountLine = [
    bank?.accountMasked || (bank?.account ? `A/C ${bank.account}` : ""),
    bank?.branch ? bank.branch.toUpperCase() : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border">
        <h3 className="text-[17px] font-bold text-ink">Bank &amp; Autopay</h3>
      </div>

      <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-5">
        {connected ? (
          <>
            <div
              className="rounded-card overflow-hidden text-center"
              style={{ background: "linear-gradient(180deg,#0C4A3E 0%,#0A3D34 100%)" }}
            >
              <div className="px-6 pt-8 pb-7 flex flex-col items-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 m-auto w-24 h-24 rounded-full opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(110,231,183,0.55) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative w-16 h-16 rounded-full bg-[#047857] border-[3px] border-emerald-300/80 flex items-center justify-center shadow-lg">
                    <Check size={32} strokeWidth={3} className="text-emerald-200" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-jade mb-1.5">
                Connected
              </div>
              <h4 className="text-xl sm:text-[22px] font-bold text-ink leading-snug">
                Bank Account Connected Successfully!
              </h4>
            </div>
          </>
        ) : (
          <div className="text-center py-2">
            {loading ? (
              <p className="text-sm text-muted">Loading bank details…</p>
            ) : (
              <>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                  Not connected
                </div>
                <h4 className="text-xl sm:text-[22px] font-bold text-ink leading-snug">
                  No bank account linked yet
                </h4>
              </>
            )}
          </div>
        )}

        {/* Bank card */}
        {connected ? (
          <div className="bg-white border border-border rounded-card px-4 py-4 flex items-start gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-tint text-jade flex items-center justify-center shrink-0">
              <Landmark size={22} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-ink uppercase tracking-wide">
                {bank.name || "Bank"}
              </div>
              {accountLine ? (
                <div className="text-[12px] text-muted mt-1 leading-snug">{accountLine}</div>
              ) : null}
              {bank.ifsc ? (
                <div className="text-[12px] text-muted mt-0.5">IFSC: {bank.ifsc}</div>
              ) : null}
              <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tint text-jade text-[11px] font-semibold">
                <Check size={12} strokeWidth={2.5} />
                Verified
              </div>
            </div>
          </div>
        ) : !loading ? (
          <div className="bg-surface border border-border rounded-card px-4 py-5 text-sm text-muted text-center">
            Complete KYC to link your bank account for SIPs and payouts.
          </div>
        ) : null}

        {/* Auto-pay */}
        <div>
          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2.5">
            Auto-pay
          </div>
          <div className="bg-white border border-border rounded-card px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-[15px] font-bold text-ink">UPI Auto-pay</div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md ${
                  mandateActive
                    ? "bg-tint text-jade"
                    : "bg-surface text-muted"
                }`}
              >
                {loading ? "…" : mandateActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-muted">Limit per order</span>
                <span className="font-semibold text-ink">
                  {loading ? "…" : limit || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-muted">Method</span>
                <span className="font-semibold text-ink">UPI AutoPay</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 rounded-btn bg-tint/80 border border-jade/10 px-3.5 py-3 text-[13px] text-secondary leading-snug">
          <span className="w-5 h-5 rounded-full bg-jade text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            i
          </span>
          <p>
            Auto-pay keeps SIPs on time. You can raise the limit by re-authorising your UPI
            mandate.
          </p>
        </div>
      </div>
    </div>
  );
}

function InvestmentStyleSection() {
  const router = useRouter();
  const [score, setScore] = useState(null);
  const [band, setBand] = useState("");
  const [assessed, setAssessed] = useState("");

  useEffect(() => {
    let cancelled = false;
    getRiskIndicators()
      .then((indicators) => {
        if (cancelled) return;
        const root = indicators?.riskProfile ? indicators : indicators?.data;
        setScore(scoreFromIndicators(indicators));
        setBand(bandFromIndicators(indicators));
        const when = root?.riskProfile?.updatedAt || root?.riskProfile?.createdAt;
        const date = when ? new Date(when) : null;
        setAssessed(
          date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "—"
        );
      })
      .catch(() => {
        if (!cancelled) {
          setScore(null);
          setBand("");
          setAssessed("—");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const gaugeColors = {
    stops: [
      { offset: "0%", color: "#86DFBC" },
      { offset: "25%", color: "#B5D9A0" },
      { offset: "50%", color: "#E8D5A0" },
      { offset: "75%", color: "#E0A87A" },
      { offset: "100%", color: "#D4817A" },
    ],
    spectrum: ["#86DFBC", "#B5D9A0", "#E8D5A0", "#E0A87A", "#D4817A"],
  };
  const shownScore = score == null ? "…" : score;
  const arc = 251;
  const ratio = score == null ? 0 : Math.max(0, Math.min(100, score)) / 100;
  const angle = Math.PI * (1 - ratio);
  const dotX = 100 + 80 * Math.cos(angle);
  const dotY = 100 - 80 * Math.sin(angle);
  const dotColor = gaugeColors.spectrum[Math.min(4, Math.floor((score || 0) / 20))] || gaugeColors.spectrum[0];
  const volatility = score == null ? "…" : score >= 81 ? "High" : score >= 61 ? "Medium" : "Low";

  return (
    <div className="bg-white border border-border rounded-card shadow-card">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-[17px] font-bold text-ink">Investment Style</h3>
      </div>
      <div className="px-6 py-5">
        <div className="text-center py-5 pb-4">
          <div className="relative w-[200px] h-[110px] mx-auto">
            <svg width="200" height="110" viewBox="0 0 200 110">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  {gaugeColors.stops.map((stop) => (
                    <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
              </defs>
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={String(arc)}
                strokeDashoffset={String(arc * (1 - ratio))}
              />
              <circle cx={dotX} cy={dotY} r="6" fill={dotColor} stroke="#fff" strokeWidth="2.5" />
            </svg>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <div className="text-5xl font-extrabold text-ink tracking-tighter leading-none">{shownScore}</div>
              <div className="text-xs text-muted mt-0.5">out of 100</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-surface rounded-full px-[18px] py-2 mt-4">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            </svg>
            <span className="text-sm font-semibold text-ink">{band || "—"}</span>
          </div>
          <p className="text-[13px] text-secondary mt-3 leading-relaxed max-w-[340px] mx-auto">
            Tough and fearless, you face challenges head-on and embrace volatility.
          </p>
        </div>

        <div className="border border-border rounded-card px-5 py-[18px] my-5">
          <div className="text-sm font-semibold text-ink mb-3.5">Where you sit</div>
          <div className="flex gap-[3px] h-2 rounded-full overflow-hidden mb-2">
            {gaugeColors.spectrum.map((color) => (
              <div key={color} className="flex-1 rounded-full" style={{ background: color }} />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted font-medium mb-3.5">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dotColor }} />
            <span className="text-sm font-semibold text-ink">Risk Score: {shownScore}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface rounded-card p-4 text-center">
            <div className="w-9 h-9 rounded-btn bg-violet-100 flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" fill="none" stroke="#7C3AED" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              </svg>
            </div>
            <div className="text-lg font-bold text-ink">{volatility}</div>
            <div className="text-[11px] text-muted mt-0.5">Volatility OK</div>
          </div>
          <div className="bg-surface rounded-card p-4 text-center">
            <div className="w-9 h-9 rounded-btn bg-amber-100 flex items-center justify-center mx-auto mb-2">
              <svg width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 8h10M7 12h6" />
              </svg>
            </div>
            <div className="text-lg font-bold text-ink">{assessed || "…"}</div>
            <div className="text-[11px] text-muted mt-0.5">Assessed</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/signup?start=risk")}
          className="w-full py-3.5 rounded-btn border border-border bg-white text-[15px] font-semibold text-jade hover:bg-surface transition-colors"
        >
          Retake Risk Assessment
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage({ user }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("personal");
  const content = activeSection === "personal"
    ? {
        title: "Personal Details",
        groups: [
          { label: "Basic Information", rows: [
            ["Full Name", show(user?.name, user)],
            ["Email", show(user?.email, user)],
            ["Phone", show(user?.phone, user)],
            ["Date of Birth", show(user?.dob, user)],
            ["PAN", show(user?.pan, user)],
          ]},
          // Section title only — don't repeat "Address" as a row label.
          { label: "Address", rows: [
            ["", show(user?.address, user)],
          ]},
        ],
      }
    : sectionContent[activeSection];

  function signOut() {
    clearTokens();
    router.replace("/login");
  }

  return (
    <div className={PAGE_SHELL}>
      <h2 className="text-lg font-semibold text-ink mb-5">Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,280px)_1fr] 4xl:grid-cols-[300px_1fr] gap-5">
        {/* Menu */}
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <div className="px-6 py-6 text-center border-b border-border">
            <div className="w-[72px] h-[72px] rounded-full bg-jade text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3">
              {user === undefined ? "…" : user?.initials || "—"}
            </div>
            <div className="text-lg font-bold text-ink">{show(user?.name, user)}</div>
            {user?.email ? <div className="text-xs text-muted mt-0.5">{user.email}</div> : null}
          </div>
          <div className="py-1.5">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm font-medium transition-all text-left ${
                  activeSection === id
                    ? "bg-tint text-jade"
                    : "text-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                {label}
                <ChevronRight size={14} className="ml-auto opacity-30" />
              </button>
            ))}
          </div>
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={signOut}
              className="w-full py-3 rounded-btn border border-red-100 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Detail */}
        {activeSection === "risk" ? (
          <InvestmentStyleSection />
        ) : activeSection === "bank" ? (
          <BankAutopaySection user={user} />
        ) : (
        <div className="bg-white border border-border rounded-card shadow-card">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[17px] font-bold text-ink">{content.title}</h3>
          </div>
          <div className="px-6 py-5">
            {content.description && (
              <p className="text-sm text-secondary leading-relaxed mb-5">
                {content.description}
              </p>
            )}

            <div className="space-y-6">
              {content.groups.map((group, gi) => (
                <div key={gi}>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                    {group.label}
                  </div>
                  {group.rows.map(([label, val], ri) => {
                    const isObj = typeof val === "object";
                    const display = isObj ? val.value : val;
                    const isGreen = isObj && val.green;
                    const hasLabel = String(label || "").trim().length > 0;
                    return (
                      <div
                        key={ri}
                        className={`flex gap-4 py-3 border-b border-bg last:border-b-0 ${
                          hasLabel ? "justify-between items-start" : "justify-start items-start"
                        }`}
                      >
                        {hasLabel ? (
                          <span className="text-[13px] text-muted font-medium shrink-0">{label}</span>
                        ) : null}
                        <span
                          className={`text-[13px] font-semibold whitespace-pre-line min-w-0 ${
                            hasLabel ? "text-right" : "text-left"
                          } ${isGreen ? "text-emerald" : "text-ink"}`}
                        >
                          {display}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
