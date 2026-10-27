"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  PRODUCT_TABS,
  compactProjection,
  cutAtFund,
  loadHomeInvestment,
  projectLump,
  projectSip,
  searchCategoryFunds,
} from "../lib/investmentApi";
import InvestModeSheet from "./InvestModeSheet";

const DAILY_YEARS = [1, 2, 3, 4];
const ALL_YEARS = [1, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30];

function moneyFull(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function defaultAmount(freq) {
  if (freq === "daily") return 300;
  if (freq === "monthly") return 5000;
  return 10000;
}

function yearsFor(freq) {
  return freq === "daily" ? DAILY_YEARS : ALL_YEARS;
}

function productKeyFromFund(fund) {
  const text = `${fund?.subtitle || ""} ${fund?.name || ""}`.toLowerCase();
  if (/liquid|overnight|insta/.test(text)) return "instafd";
  if (/gold/.test(text)) return "gold";
  if (/multi[-\s]?asset/.test(text)) return "multi";
  if (/debt|gilt|bond|psu|fixed income/.test(text)) return "debt";
  if (/hybrid|balanced/.test(text)) return "hybrid";
  if (/nasdaq|global|s&p|international/.test(text)) return "global";
  return "equity";
}

export default function ProductShowcase({ focusKey, focusAt, onViewHolding, onStartInvest }) {
  const [activeKey, setActiveKey] = useState(focusKey || "equity");
  const [model, setModel] = useState(undefined);
  const [addingAnother, setAddingAnother] = useState(false);
  const [freq, setFreq] = useState("daily");
  const [amount, setAmount] = useState(300);
  const [tenure, setTenure] = useState(3);
  const [fundMode, setFundMode] = useState("rec");
  const [ownFunds, setOwnFunds] = useState([]);
  const [ownLoading, setOwnLoading] = useState(false);
  const [ownError, setOwnError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pickedFund, setPickedFund] = useState(null);
  const [ownMenuOpen, setOwnMenuOpen] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [actionNote, setActionNote] = useState("");
  const [modeSheet, setModeSheet] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadHomeInvestment()
      .then((payload) => {
        if (!cancelled) setModel(payload);
      })
      .catch(() => {
        if (!cancelled) {
          setModel({
            goalsById: {},
            recommended: Object.fromEntries(PRODUCT_TABS.map((tab) => [tab.key, { loading: false, fund: null }])),
            tabModels: Object.fromEntries(PRODUCT_TABS.map((tab) => [tab.key, {
              holdings: [], invested: 0, current: 0, newestId: null,
              cadence: "", sinceShort: "", since: "", fundRows: [],
            }])),
            alreadyInvesting: false,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (focusKey) {
      setActiveKey(focusKey);
      setAddingAnother(false);
      resetCalculator("daily");
    }
  }, [focusKey, focusAt]);

  function normalizePickedFund(fund) {
    const name = cutAtFund(fund.name) || fund.name;
    return {
      id: fund.localMfId || fund.id || 0,
      name,
      fullName: fund.name,
      scheme: fund.scheme,
      minSip: Number(fund.minSip),
      minInitial: Number(fund.minInitial),
    };
  }

  function applyOwnFund(fund, nextFreq) {
    const key = productKeyFromFund(fund);
    const picked = normalizePickedFund(fund);
    const product = PRODUCT_TABS.find((item) => item.key === key) || PRODUCT_TABS[2];
    setActiveKey(key);
    setAddingAnother(false);
    setFundMode("own");
    setPickedFund(picked);
    setSearchQuery(picked.name);
    setOwnMenuOpen(false);
    setFrequency(nextFreq);
    setAmountError("");
    setActionNote("");
    return { key, product, picked };
  }

  useEffect(() => {
    function onPick(event) {
      const fund = event.detail;
      if (!fund?.name) return;
      setModeSheet({ fund });
      document.getElementById("product-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.addEventListener("fydaa-fund-selected", onPick);
    return () => window.removeEventListener("fydaa-fund-selected", onPick);
  }, []);

  const tab = PRODUCT_TABS.find((item) => item.key === activeKey) || PRODUCT_TABS[2];
  const tabModel = model?.tabModels?.[activeKey];
  const recommended = model?.recommended?.[activeKey];
  const hasHolding = (tabModel?.holdings?.length || 0) > 0;
  // Digital Gold keeps its previous holding summary; other tabs stay on new-invest calculator.
  const showHolding = activeKey === "gold" && hasHolding && !addingAnother;
  const allowedYears = yearsFor(freq);

  useEffect(() => {
    if (!allowedYears.includes(tenure)) setTenure(allowedYears.includes(3) ? 3 : allowedYears[0]);
  }, [freq, allowedYears, tenure]);

  useEffect(() => {
    if (fundMode !== "own" || !tab.allowOwn) return undefined;
    let cancelled = false;
    const text = searchQuery.trim();
    if (text && text.length < 2) {
      setOwnFunds([]);
      setOwnError("");
      setOwnLoading(false);
      return undefined;
    }
    setOwnLoading(true);
    const timer = window.setTimeout(() => {
      searchCategoryFunds(tab.stockType, text).then((result) => {
        if (cancelled) return;
        setOwnLoading(false);
        setOwnFunds(result.funds);
        // Don't show backend diagnostics (goalId / risk bucket / etc.) to users.
        const msg = String(result.message || "");
        setOwnError(/goal\s*id|risk\s*bucket|direct mutual fund portfolio|no .*portfolio found/i.test(msg) ? "" : msg);
        if (!pickedFund && result.funds[0]) setPickedFund(result.funds[0]);
      });
    }, text ? 300 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [fundMode, tab.stockType, tab.allowOwn, searchQuery, activeKey]);

  function resetCalculator(nextFreq = "daily") {
    setFreq(nextFreq);
    setAmount(defaultAmount(nextFreq));
    setTenure(3);
    setFundMode("rec");
    setPickedFund(null);
    setSearchQuery("");
    setOwnMenuOpen(false);
    setOwnFunds([]);
    setOwnError("");
    setAmountError("");
    setActionNote("");
  }

  function switchProduct(key) {
    setActiveKey(key);
    setAddingAnother(false);
    resetCalculator(freq);
  }

  function setFrequency(next) {
    setFreq(next);
    setAmount(defaultAmount(next));
    setAmountError("");
    if (next === "lumpsum") setTenure(3);
  }

  const sipMin = fundMode === "own"
    ? (Number.isFinite(pickedFund?.minSip) && pickedFund.minSip > 0 ? pickedFund.minSip : null)
    : (Number.isFinite(recommended?.fund?.minSip) && recommended.fund.minSip > 0 ? recommended.fund.minSip : null);
  const lumpMin = fundMode === "own"
    ? (Number.isFinite(pickedFund?.minInitial) && pickedFund.minInitial > 0 ? pickedFund.minInitial : null)
    : (Number.isFinite(recommended?.fund?.minInitial) && recommended.fund.minInitial > 0 ? recommended.fund.minInitial : null);

  const platformMin = freq === "daily" ? 100 : freq === "monthly" ? 1000 : 5000;
  const platformMax = freq === "daily" ? 1000 : freq === "monthly" ? 100000 : 10000000;
  const minAmount = freq === "lumpsum"
    ? (lumpMin != null && lumpMin > 0 ? lumpMin : platformMin)
    : Math.max(platformMin, sipMin || 0);
  const maxAmount = platformMax;

  const corpus = freq === "lumpsum"
    ? projectLump(amount, tab.rate, tenure)
    : projectSip(amount, tab.rate, tenure, freq === "daily");

  function validateAmount() {
    if ((fundMode === "rec" && recommended?.fund && sipMin == null && freq !== "lumpsum")
      || (fundMode === "rec" && recommended?.fund && lumpMin == null && freq === "lumpsum")) {
      if (recommended?.fund && ((freq === "lumpsum" && !Number.isFinite(recommended.fund.minInitial))
        || (freq !== "lumpsum" && !Number.isFinite(recommended.fund.minSip)))) {
        // mins optional if not provided — use platform only
      }
    }
    if (amount < minAmount) {
      if (freq === "daily") return `Minimum amount is ₹${minAmount} per day`;
      if (freq === "monthly") return `Minimum amount is ₹${minAmount} per month`;
      return `Minimum lumpsum is ₹${minAmount}`;
    }
    if (amount > maxAmount) {
      if (freq === "daily") return `Maximum amount is ₹${maxAmount} per day`;
      if (freq === "monthly") return `Maximum amount is ₹${maxAmount} per month`;
      return `Maximum lumpsum is ₹${maxAmount}`;
    }
    return "";
  }

  function primaryLabel() {
    if (showHolding) return `View my ${tab.label}`;
    if (freq === "lumpsum") {
      return addingAnother ? `Add money to ${tab.label}` : `Invest one-time in ${tab.label}`;
    }
    return addingAnother ? `Add this ${tab.label} SIP` : `Start my ${tab.label}`;
  }

  function holdingSubtitle() {
    const raw = tab.holdingSub;
    if (raw.includes("{since}")) {
      return raw.replace("{since}", tabModel?.since || "you started");
    }
    return raw;
  }

  function onPrimary() {
    setActionNote("");
    if (showHolding) {
      if (tabModel?.newestId) onViewHolding?.(tabModel.newestId);
      else setActionNote("Holding detail is not available yet.");
      return;
    }
    if (recommended?.missingGoal && !model?.goalsById?.[tab.goalId]) {
      setActionNote("This product is not available yet.");
      return;
    }
    const error = validateAmount();
    if (error) {
      setAmountError(error);
      return;
    }
    if (fundMode === "own") {
      if (!pickedFund || !(pickedFund.id > 0) || !pickedFund.scheme) {
        setActionNote("Please select a fund with a valid scheme to continue.");
        return;
      }
    }
    setAmountError("");
    onStartInvest?.({
      tab: tab.key,
      goalId: tab.goalId,
      amount,
      tenureYears: tenure,
      frequency: freq,
      fundMode,
      fund: fundMode === "own" ? pickedFund : recommended?.fund || null,
      addingAnother,
    });
  }

  const subtitle = showHolding
    ? holdingSubtitle()
    : (freq === "lumpsum" ? tab.lumpSub : tab.sipSub);

  function startFromModeSheet(nextFreq) {
    const fund = modeSheet?.fund;
    if (!fund) return;
    const { product, picked } = applyOwnFund(fund, nextFreq);
    setModeSheet(null);
    const nextAmount = defaultAmount(nextFreq);
    onStartInvest?.({
      tab: product.key,
      goalId: product.goalId,
      amount: nextAmount,
      tenureYears: 3,
      frequency: nextFreq,
      fundMode: "own",
      fund: picked,
      addingAnother: false,
    });
  }

  return (
    <div id="product-showcase" className="mb-8">
      <InvestModeSheet
        open={!!modeSheet}
        title={cutAtFund(modeSheet?.fund?.name) || modeSheet?.fund?.name || "Invest"}
        subtitle="Start with a SIP or invest a one-time amount"
        onClose={() => setModeSheet(null)}
        onPickSip={() => startFromModeSheet("daily")}
        onPickLumpsum={() => startFromModeSheet("lumpsum")}
      />
      <div className="bg-surface rounded-t-card px-4 sm:px-6 lg:px-9 pt-6 sm:pt-9 pb-4 sm:pb-5">
        <h2
          className="text-[22px] sm:text-[28px] 4xl:text-[32px] font-bold text-ink leading-tight mb-1.5 [&>span]:text-emerald"
          dangerouslySetInnerHTML={{ __html: tab.headline }}
        />
        <p className="text-sm text-secondary mb-4 sm:mb-5">{subtitle}</p>
        <div className="flex gap-1 bg-white rounded-btn p-1 border border-border w-full sm:w-fit overflow-x-auto max-w-full scrollbar-thin">
          {PRODUCT_TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => switchProduct(item.key)}
              className={`px-3.5 sm:px-5 py-2 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap shrink-0 ${
                activeKey === item.key ? "bg-white text-ink shadow-sm" : "text-secondary hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-b-card px-4 sm:px-6 lg:px-9 py-6 sm:py-8 shadow-card">
        {showHolding ? (
          <>
            <div className="flex items-start justify-between gap-3 sm:gap-6 mb-6">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">You Invested</div>
                <div className="text-[28px] sm:text-4xl font-bold text-ink tracking-tight leading-none">{moneyFull(tabModel.invested)}</div>
                <div className="text-[13px] text-muted mt-1">
                  {[tabModel.cadence, tabModel.sinceShort ? `since ${tabModel.sinceShort}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
              <div className="pt-6 text-muted">→</div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Now Worth</div>
                <div className="text-[32px] font-bold text-emerald tracking-tight leading-none">{moneyFull(tabModel.current)}</div>
              </div>
            </div>

            {tabModel.fundRows.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    {tab.holdingList}
                  </div>
                </div>
                <div className="mb-5 border border-border rounded-btn overflow-hidden">
                  {tabModel.fundRows.map((row, index) => (
                    <div key={`${row.sipId}-${row.name}-${index}`} className="flex justify-between gap-3 px-4 py-3 border-t border-border first:border-t-0">
                      <div className="text-[13px] font-medium text-ink truncate">{row.name}</div>
                      <div className="text-[13px] text-muted shrink-0">{moneyFull(row.amount)}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
            <div className="text-xs text-muted mb-5">
              {tabModel.holdings.length > 1
                ? `${tabModel.holdings.length} SIPs · ${tab.rateLabel} assumed`
                : `${tabModel.cadence || "—"} · ${tab.rateLabel} assumed`}
            </div>
            <button
              type="button"
              onClick={onPrimary}
              className="w-full py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover"
            >
              {primaryLabel()}
            </button>
            <button
              type="button"
              onClick={() => { setAddingAnother(true); resetCalculator("daily"); }}
              className="mt-4 w-full flex items-center gap-3 px-4 py-3.5 rounded-btn border border-dashed border-border text-left hover:border-jade"
            >
              <span className="w-8 h-8 rounded-full bg-tint text-jade flex items-center justify-center shrink-0">
                <Plus size={16} />
              </span>
              <span className="text-sm font-semibold text-ink">Start a new investment</span>
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-6 mb-6 sm:mb-7">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">You Invest</div>
                <div className="flex items-baseline">
                  <span className="text-[28px] sm:text-4xl font-bold text-ink">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "");
                      setAmount(digits ? Number(digits) : 0);
                      setAmountError("");
                    }}
                    className={`text-[28px] sm:text-4xl font-bold tracking-tight leading-none bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 appearance-none p-0 m-0 w-[140px] sm:w-[160px] ${
                      amountError ? "text-red-600" : "text-ink"
                    }`}
                  />
                </div>
                <div className={`text-[13px] mt-0.5 ${amountError ? "text-red-600" : "text-muted"}`}>
                  {amountError || (freq === "daily" ? "per day" : freq === "monthly" ? "per month" : "one-time, today")}
                </div>
              </div>

              <div className="hidden sm:block pt-6 text-muted">→</div>

              <div className="sm:text-right">
                {freq !== "lumpsum" && (
                  <div className="flex gap-0 bg-surface rounded-lg p-0.5 border border-border mb-3 sm:ml-auto w-fit">
                    {["daily", "monthly"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFrequency(item)}
                        className={`px-4 py-1.5 rounded-md text-[13px] font-medium capitalize ${
                          freq === item ? "bg-white text-ink shadow-sm" : "text-secondary"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
                {freq === "lumpsum" && (
                  <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">You Get</div>
                )}
                <div className="text-[28px] sm:text-[32px] font-bold text-emerald tracking-tight leading-none">
                  {compactProjection(corpus)}
                </div>
                <div className="text-[13px] text-muted mt-1">
                  In {tenure} {tenure === 1 ? "YR" : "YRS"} | {tab.rateLabel}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5 mb-5">
              <div>
                <div className="text-[13px] text-secondary mb-2">
                  {freq === "lumpsum" ? "Investment Period" : "Tenure"}
                </div>
                <select
                  value={tenure}
                  onChange={(event) => setTenure(Number(event.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-btn border border-border bg-white text-sm font-medium text-ink"
                >
                  {allowedYears.map((year) => (
                    <option key={year} value={year}>{year} {year === 1 ? "year" : "years"}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-[13px] text-secondary mb-2">Fund</div>
                {tab.allowOwn ? (
                  <div className="flex rounded-btn overflow-hidden border border-border">
                    <button
                      type="button"
                      onClick={() => {
                        setFundMode("rec");
                        setPickedFund(null);
                        setSearchQuery("");
                        setOwnMenuOpen(false);
                      }}
                      className={`flex-1 py-2.5 text-[13px] font-medium ${fundMode === "rec" ? "bg-jade text-white" : "bg-white text-secondary"}`}
                    >
                      Recommended
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFundMode("own");
                        setOwnMenuOpen(true);
                      }}
                      className={`flex-1 py-2.5 text-[13px] font-medium ${fundMode === "own" ? "bg-jade text-white" : "bg-white text-secondary"}`}
                    >
                      Choose my own
                    </button>
                  </div>
                ) : (
                  <div className="px-3.5 py-2.5 rounded-btn border border-border bg-surface text-sm font-medium text-ink">
                    Recommended
                  </div>
                )}
                {fundMode === "own" && tab.allowOwn && (
                  <div className="mt-2.5 border border-border rounded-btn bg-white shadow-elevated overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search funds"
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setOwnMenuOpen(true);
                      }}
                      onFocus={() => setOwnMenuOpen(true)}
                      className={`w-full px-3.5 py-2.5 bg-bg text-[13px] outline-none ${ownMenuOpen ? "border-b border-border" : ""}`}
                    />
                    {ownMenuOpen && (
                      <div className="max-h-[200px] overflow-y-auto">
                        {ownLoading && <div className="px-3.5 py-3 text-[13px] text-muted text-center">Loading…</div>}
                        {!ownLoading && ownError && <div className="px-3.5 py-3 text-[13px] text-red-600 text-center">{ownError}</div>}
                        {!ownLoading && !ownError && ownFunds.length === 0 && (
                          <div className="px-3.5 py-3 text-[13px] text-muted text-center">
                            {searchQuery.trim().length === 1 ? "Type at least 2 characters to search" : "No funds found"}
                          </div>
                        )}
                        {!ownLoading && ownFunds.map((fund) => (
                          <button
                            key={`${fund.scheme}-${fund.id}`}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setPickedFund(fund);
                              setSearchQuery(fund.name || "");
                              setOwnMenuOpen(false);
                            }}
                            className={`block w-full text-left px-3.5 py-2.5 text-[13px] font-medium border-t border-bg first:border-t-0 ${
                              pickedFund?.scheme === fund.scheme ? "bg-jade text-white" : "text-tertiary hover:bg-surface"
                            }`}
                          >
                            {fund.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onPrimary}
                className="flex-1 py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover"
              >
                {primaryLabel()}
              </button>
              <button
                type="button"
                onClick={() => setFrequency(freq === "lumpsum" ? "daily" : "lumpsum")}
                className="text-[13px] text-secondary underline underline-offset-[3px] hover:text-jade whitespace-nowrap"
              >
                {freq === "lumpsum" ? "Prefer a daily or monthly SIP?" : "Want to invest One-Time / Lump-sum?"}
              </button>
            </div>
            {addingAnother && (
              <button
                type="button"
                onClick={() => { setAddingAnother(false); resetCalculator("daily"); }}
                className="mt-4 w-full text-center text-[13px] text-muted underline"
              >
                ← Cancel, back to my holding
              </button>
            )}
          </>
        )}
        {actionNote ? <div className="text-sm text-muted mt-3 text-center">{actionNote}</div> : null}
      </div>
    </div>
  );
}
