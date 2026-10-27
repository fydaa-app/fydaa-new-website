"use client";

import { Home, Target, Clock, User, Shield, X } from "lucide-react";

const iconMap = { home: Home, target: Target, clock: Clock, user: User, shield: Shield };

export default function Sidebar({ activePage, setActivePage, showKyc, user, open, onClose }) {
  const items = [
    { id: "home", label: "Home", icon: "home" },
    ...(showKyc ? [{ id: "kyc", label: "Complete Your KYC", icon: "shield" }] : []),
    { id: "dreams", label: "Dreams", icon: "target" },
    { id: "history", label: "History", icon: "clock" },
    { id: "profile", label: "Profile", icon: "user" },
  ];

  function go(page) {
    setActivePage(page);
    onClose?.();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 lg:hidden transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`w-[min(260px,85vw)] h-dvh fixed top-0 left-0 bg-white border-r border-border flex flex-col z-[70] transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 pt-6 sm:pt-7 pb-5 sm:pb-6">
          <button
            type="button"
            className="flex items-center cursor-pointer"
            onClick={() => go("home")}
            aria-label="Fydaa home"
          >
            <img src="/fydaa-logo.png" alt="Fydaa" className="h-8 sm:h-9 w-auto object-contain" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden w-9 h-9 rounded-btn border border-border flex items-center justify-center hover:bg-surface"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
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

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={() => go("profile")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-btn hover:bg-surface cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-semibold text-tertiary">
              {user === undefined ? "…" : user?.initials || "—"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink truncate">
                {user === undefined ? "…" : user?.name || "—"}
              </div>
              {user?.plan ? <div className="text-xs text-muted">{user.plan}</div> : null}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
