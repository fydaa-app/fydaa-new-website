import { navItems } from "../data/constants";
import { Home, Target, Clock, User } from "lucide-react";

const iconMap = { home: Home, target: Target, clock: Clock, user: User };

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-[260px] h-screen fixed top-0 left-0 bg-white border-r border-border flex flex-col z-50">
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-6 pt-7 pb-6 cursor-pointer"
        onClick={() => setActivePage("home")}
      >
        <div className="w-9 h-9 bg-jade rounded-btn flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 6v8l7 4 7-4V6l-7-4z" fill="rgba(255,255,255,.15)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 10v8M3 6l7 4 7-4" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[22px] font-bold text-ink tracking-tight">Fydaa</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all w-full text-left ${
                isActive
                  ? "bg-tint text-jade"
                  : "text-secondary hover:bg-surface hover:text-ink"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-btn hover:bg-surface cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-semibold text-tertiary">
            RK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink truncate">Rahul Kapoor</div>
            <div className="text-xs text-muted">Starter Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
