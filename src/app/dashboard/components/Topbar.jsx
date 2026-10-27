"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Settings, LogOut, Menu } from "lucide-react";
import { clearTokens } from "../../signup/lib/authApi";
import FundSearchOverlay from "./FundSearchOverlay";

export default function Topbar({ onMenuOpen }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    function onPointerDown(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    function onKey(event) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable) return;
      event.preventDefault();
      setPrefill("");
      setSearchOpen(true);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function logout() {
    clearTokens();
    setOpen(false);
    router.replace("/login");
  }

  function openSearch(value = "") {
    setPrefill(value);
    setSearchOpen(true);
  }

  function handleSelect(fund) {
    window.dispatchEvent(new CustomEvent("fydaa-fund-selected", { detail: fund }));
    document.getElementById("product-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-xl border-b border-border px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 h-14 sm:h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            type="button"
            onClick={onMenuOpen}
            className="lg:hidden w-10 h-10 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center shrink-0"
            aria-label="Open menu"
          >
            <Menu size={18} className="text-tertiary" />
          </button>
          <div
            role="button"
            tabIndex={0}
            onClick={() => openSearch("")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openSearch("");
              }
            }}
            className="flex items-center gap-2 bg-white border border-border rounded-btn px-3 sm:px-3.5 h-10 w-full max-w-[min(100%,420px)] xl:max-w-[480px] 4xl:max-w-[560px] hover:border-jade transition-colors cursor-pointer"
          >
            <Search size={16} className="text-muted shrink-0" />
            <span className="text-sm text-muted w-full truncate">Search funds, goals…</span>
            <span className="hidden sm:inline text-[11px] text-muted bg-surface px-1.5 py-0.5 rounded border border-border font-medium shrink-0">
              /
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="w-10 h-10 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center relative transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-tertiary" />
            <span className="absolute top-2 right-2.5 w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-expanded={open}
              aria-label="Account menu"
              onClick={() => setOpen((value) => !value)}
              className="w-10 h-10 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center transition-colors"
            >
              <Settings size={18} className="text-tertiary" />
            </button>
            {open && (
              <div className="absolute right-0 top-12 w-40 bg-white border border-border rounded-card shadow-card py-1">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <FundSearchOverlay
        open={searchOpen}
        prefill={prefill}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
