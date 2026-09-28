import { Headphones, ArrowUp } from "lucide-react";
import { jadeGradient } from "../lib/tokens";

export default function HeroCard() {
  return (
    <div
      className="rounded-card overflow-hidden mb-7 text-white relative"
      style={{ background: jadeGradient }}
    >
      {/* Greeting */}
      <div className="flex items-center justify-between px-7 pt-6 pb-3 relative z-10">
        <span className="text-[15px] font-medium text-white/85">
          Hi, <b className="font-bold text-white">Rahul</b>
        </span>
        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80 bg-white/10 border border-white/12 px-3 py-1.5 rounded-full hover:bg-white/18 transition-all">
          <Headphones size={14} />
          Adviser
        </button>
      </div>

      {/* Portfolio Value */}
      <div className="flex justify-between items-start px-7 relative z-10">
        <div>
          <div className="text-xs text-white/45 font-medium uppercase tracking-wider mb-1">
            Total Portfolio Value
          </div>
          <div className="text-[34px] font-bold tracking-tight leading-none">
            ₹12,47,832
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold flex items-center gap-1.5 justify-end text-emerald-300">
            <ArrowUp size={16} />
            +14.6%
          </div>
          <div className="text-xs text-white/50 mt-0.5">+₹1,58,832 returns</div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex mt-5 border-t border-white/8 relative z-10 mx-[-0px]">
        {[
          { label: "Invested", value: "₹10,89,000" },
          { label: "Active SIPs", value: "5" },
          { label: "XIRR", value: "16.2%" },
          { label: "Day Change", value: "+₹1,240", green: true },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex-1 py-4 px-5 border-r border-white/6 last:border-r-0"
          >
            <div className="text-[10px] text-white/35 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
            <div
              className={`text-[17px] font-bold tracking-tight mt-0.5 ${
                stat.green ? "text-emerald-300" : "text-white/90"
              }`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
