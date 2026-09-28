import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const transactions = [
  { date: "6 Jul", items: [
    { fund: "Zerodha Nifty LargeMidcap 250 Index Fund", type: "SIP · Direct Plan", amt: 3181, kind: "buy", units: "12.845", nav: "247.65", completed: "6 Jul 2026" },
    { fund: "HDFC Gold ETF Fund of Fund", type: "SIP · Direct Plan", amt: 865, kind: "buy", units: "6.203", nav: "139.45", completed: "6 Jul 2026" },
    { fund: "HDFC Gilt Fund — Direct Plan", type: "SIP · Direct Plan", amt: 499, kind: "buy", units: "14.223", nav: "35.08", completed: "6 Jul 2026" },
    { fund: "ICICI Pru Multi-Asset Fund", type: "Dividend reinvested · Direct", amt: 0.27, kind: "dividend", units: "0.005", nav: "59.87", completed: "6 Jul 2026" },
  ]},
  { date: "30 Jun", items: [
    { fund: "Zerodha Nifty LargeMidcap 250 Index Fund", type: "Top-up · Direct Plan", amt: 3181, kind: "buy", units: "12.845", nav: "247.65", completed: "1 Jul 2026" },
    { fund: "HDFC Gilt Fund — Direct Plan", type: "Top-up · Direct Plan", amt: 499, kind: "buy", units: "14.223", nav: "35.08", completed: "1 Jul 2026" },
  ]},
];

export default function HistoryPage() {
  const [openTx, setOpenTx] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Buy / SIP", "Sell / Withdraw", "Dividend"];

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-ink">Transaction History</h2>
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center">
            <ChevronLeft size={16} className="text-tertiary" />
          </button>
          <span className="text-lg font-bold text-ink tracking-tight">July 2026</span>
          <button className="w-9 h-9 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center">
            <ChevronRight size={16} className="text-tertiary" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-4">
        {[
          { v: "12", k: "Transactions" },
          { v: "₹9,500", k: "Invested" },
          { v: "₹0.54", k: "Dividends", green: true },
          { v: "₹0", k: "Withdrawn" },
        ].map((s) => (
          <div key={s.k} className="flex-1 bg-white border border-border rounded-card px-4 py-3.5 text-center shadow-card">
            <div className={`text-xl font-bold tracking-tight ${s.green ? "text-emerald" : "text-ink"}`}>{s.v}</div>
            <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-0.5">{s.k}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeFilter === f
                ? "bg-jade text-white border-jade"
                : "bg-white text-secondary border-border hover:border-border-mid"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {transactions.map((group) => (
        <div key={group.date}>
          <div className="text-xs font-medium text-muted mt-4 mb-2">{group.date}</div>
          {group.items.map((tx, i) => {
            const txKey = group.date + i;
            const isOpen = openTx === txKey;
            return (
              <div key={txKey} className="bg-white border border-border rounded-card mb-2 shadow-card overflow-hidden transition-all">
                <div
                  className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-bg transition-colors"
                  onClick={() => setOpenTx(isOpen ? null : txKey)}
                >
                  <div className={`w-[38px] h-[38px] rounded-btn flex items-center justify-center shrink-0 ${
                    tx.kind === "buy" ? "bg-tint text-emerald" : tx.kind === "dividend" ? "bg-indigo-50 text-indigo-500" : "bg-red-50 text-red-600"
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      {tx.kind === "buy" ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" /></>
                      ) : (
                        <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
                      )}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{tx.fund}</div>
                    <div className="text-xs text-muted mt-0.5">{tx.type}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-ink">₹{tx.amt.toLocaleString("en-IN")}</div>
                    <div className="text-[10px] text-emerald font-medium mt-0.5 flex items-center justify-end gap-1">
                      <span className="w-[5px] h-[5px] rounded-full bg-emerald" />
                      Completed
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-3.5 border-t border-bg">
                    {[
                      ["Amount", `₹${tx.amt.toLocaleString("en-IN")}`],
                      ["Units added", tx.units],
                      ["NAV", `₹${tx.nav}`],
                      ["Completed", tx.completed],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-bg last:border-b-0 text-[13px]">
                        <span className="text-muted">{k}</span>
                        <span className="text-ink font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
