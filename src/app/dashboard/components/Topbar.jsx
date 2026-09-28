import { Search, Bell, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-xl border-b border-border px-10 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white border border-border rounded-btn px-3.5 h-10 w-[300px] focus-within:border-jade transition-colors">
          <Search size={16} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search funds, goals, orders..."
            className="bg-transparent border-none outline-none text-sm text-ink w-full"
          />
          <span className="text-[11px] text-muted bg-surface px-1.5 py-0.5 rounded border border-border font-medium shrink-0">
            /
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center relative transition-colors">
          <Bell size={18} className="text-tertiary" />
          <span className="absolute top-2 right-2.5 w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white" />
        </button>
        <button className="w-10 h-10 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center transition-colors">
          <Settings size={18} className="text-tertiary" />
        </button>
      </div>
    </header>
  );
}
