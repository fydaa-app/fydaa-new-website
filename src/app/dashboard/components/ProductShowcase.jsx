import { useState } from "react";
import { products } from "../data/constants";
import { rupee, compact, sipFV, lumpFV } from "../lib/utils";

const productKeys = ["instafd", "gold", "equity", "multi", "debt", "hybrid", "global"];
const tabLabels = { instafd: "InstaFD", gold: "Digital Gold", equity: "Equity", multi: "Multi-Asset", debt: "Debt", hybrid: "Hybrid", global: "Global" };

export default function ProductShowcase() {
  const [activeKey, setActiveKey] = useState("instafd");
  const [freq, setFreq] = useState("daily");       // daily | monthly | lumpsum
  const [tenure, setTenure] = useState(3);
  const [fundMode, setFundMode] = useState("rec");  // rec | own
  const [selectedFundIdx, setSelectedFundIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const p = products[activeKey];
  const range = p[freq] || p.daily;
  const amt = range.def;

  // Calculate projection
  let corpus;
  if (freq === "lumpsum") {
    corpus = lumpFV(amt, p.rate, tenure);
  } else {
    const monthlyAmt = freq === "daily" ? amt * 30 : amt;
    corpus = sipFV(monthlyAmt, p.rate, tenure);
  }

  const switchProduct = (key) => {
    setActiveKey(key);
    setFreq("daily");
    setFundMode("rec");
    setSelectedFundIdx(0);
    setSearchQuery("");
  };

  const toggleLumpsum = () => {
    setFreq(freq === "lumpsum" ? "daily" : "lumpsum");
  };

  const filteredFunds = p.options.filter((f) =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFundName =
    fundMode === "own" ? p.options[selectedFundIdx] || p.fund : p.fund;

  return (
    <div className="mb-8">
      {/* Hero Header */}
      <div className="bg-surface rounded-t-card px-9 pt-9 pb-5">
        <h2
          className="text-[28px] font-bold text-ink leading-tight mb-1.5 [&>span]:text-emerald"
          dangerouslySetInnerHTML={{ __html: p.headline }}
        />
        <p className="text-sm text-secondary mb-5">
          {freq === "lumpsum" ? p.subLump || p.sub : p.sub}
        </p>
        <div className="flex gap-1 bg-white rounded-btn p-1 border border-border w-fit">
          {productKeys.map((key) => (
            <button
              key={key}
              onClick={() => switchProduct(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeKey === key
                  ? "bg-white text-ink shadow-sm"
                  : "text-secondary hover:text-ink"
              }`}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Config Card */}
      <div className="bg-white border border-border rounded-b-card px-9 py-8 shadow-card">
        {/* Invest Row */}
        <div className="flex items-start justify-between gap-6 mb-7">
          <div>
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
              You Invest
            </div>
            <div className="text-4xl font-bold text-ink tracking-tight leading-none">
              {rupee(amt)}
            </div>
            <div className="text-[13px] text-muted mt-0.5">
              {freq === "daily" ? "per day" : freq === "monthly" ? "per month" : "one-time, today"}
            </div>
          </div>

          {/* Arrow */}
          <div className="pt-6">
            <svg width="24" height="24" fill="none" stroke="#A3A3A3" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          <div className="text-right">
            {freq !== "lumpsum" && (
              <div className="flex gap-0 bg-surface rounded-lg p-0.5 border border-border mb-3 ml-auto w-fit">
                {["daily", "monthly"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={`px-4 py-1.5 rounded-md text-[13px] font-medium capitalize transition-all ${
                      freq === f
                        ? "bg-white text-ink shadow-sm"
                        : "text-secondary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            <div className="text-[32px] font-bold text-ink tracking-tight leading-none">
              {compact(Math.round(corpus))}
            </div>
            <div className="text-[13px] text-muted mt-1">
              In {tenure} YRS | {p.rate}% p.a.
            </div>
          </div>
        </div>

        {/* Tenure + Fund */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <div className="text-[13px] text-secondary mb-2">Tenure</div>
            <select
              value={tenure}
              onChange={(e) => setTenure(+e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-btn border border-border bg-white text-sm font-medium text-ink appearance-none cursor-pointer"
            >
              {[1, 2, 3, 5, 7, 10, 15, 20].map((y) => (
                <option key={y} value={y}>{y} {y === 1 ? "year" : "years"}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[13px] text-secondary mb-2">Fund</div>
            <div className="flex rounded-btn overflow-hidden border border-border">
              <button
                onClick={() => { setFundMode("rec"); setSearchQuery(""); }}
                className={`flex-1 py-2.5 text-[13px] font-medium transition-all ${
                  fundMode === "rec"
                    ? "bg-jade text-white"
                    : "bg-white text-secondary"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setFundMode("own")}
                className={`flex-1 py-2.5 text-[13px] font-medium transition-all ${
                  fundMode === "own"
                    ? "bg-jade text-white"
                    : "bg-white text-secondary"
                }`}
              >
                Choose my own
              </button>
            </div>
            {/* Fund Picker */}
            {fundMode === "own" && (
              <div className="mt-2.5 border border-border rounded-btn bg-white shadow-elevated overflow-hidden">
                <input
                  type="text"
                  placeholder="Search funds"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-b border-border bg-bg text-[13px] font-medium text-ink outline-none focus:bg-white transition-colors placeholder:text-muted placeholder:font-normal"
                />
                <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                  {filteredFunds.length === 0 ? (
                    <div className="px-3.5 py-3 text-[13px] text-muted text-center">
                      No funds match your search
                    </div>
                  ) : (
                    filteredFunds.map((f) => {
                      const idx = p.options.indexOf(f);
                      return (
                        <button
                          key={f}
                          onClick={() => setSelectedFundIdx(idx)}
                          className={`block w-full text-left px-3.5 py-2.5 text-[13px] font-medium transition-all border-t border-bg first:border-t-0 ${
                            idx === selectedFundIdx
                              ? "bg-jade text-white hover:bg-jade-hover"
                              : "text-tertiary hover:bg-surface hover:text-ink"
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fund Info Card — replace with <FundInfoCard /> in production */}
        <div className="flex items-center justify-between px-4 py-3.5 mb-5 bg-bg border border-border rounded-btn gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-jade text-white text-xs font-bold flex items-center justify-center shrink-0">
              {activeFundName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-ink truncate">
                {activeFundName}
              </div>
              <div className="text-[11px] text-muted">Mutual Fund</div>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="text-center">
              <div className="text-[10px] font-semibold text-muted uppercase">1Y</div>
              <div className="text-[13px] font-bold text-emerald">+{p.rate}%</div>
            </div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex items-center gap-4">
          <button className="flex-1 py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover transition-colors">
            {freq === "lumpsum" ? p.ctaLump || "Invest Lump-sum" : p.cta}
          </button>
          <button
            onClick={toggleLumpsum}
            className="text-[13px] text-secondary underline underline-offset-[3px] hover:text-jade transition-colors whitespace-nowrap"
          >
            {freq === "lumpsum"
              ? "Switch back to SIP"
              : "Want to invest One-Time / Lump-sum?"}
          </button>
        </div>
      </div>
    </div>
  );
}
