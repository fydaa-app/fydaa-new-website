"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Search, X, History, Loader2 } from "lucide-react";
import {
  CHIPS,
  clearRecentSearches,
  loadRecentSearches,
  loadSearchTypes,
  saveRecentSearch,
  searchFunds,
} from "../lib/fundSearchApi";

export default function FundSearchOverlay({ open, onClose, prefill = "", onSelect }) {
  const inputRef = useRef(null);
  const requestId = useRef(0);
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("All");
  const [recent, setRecent] = useState([]);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    setQuery(prefill || "");
    setChip("All");
    setFunds([]);
    setError("");
    setHint("");
    setRecent(loadRecentSearches());
    loadSearchTypes();
    const text = String(prefill || "").trim();
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      if (text.length >= 2) runSearch(text, "All");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const text = query.trim();
    if (!text) {
      requestId.current += 1;
      setFunds([]);
      setError("");
      setHint("");
      setLoading(false);
      return undefined;
    }
    if (text.length < 2) {
      requestId.current += 1;
      setFunds([]);
      setError("");
      setHint("Type at least 2 characters to search");
      setLoading(false);
      return undefined;
    }
    setHint("");
    const id = ++requestId.current;
    setLoading(true);
    const timer = window.setTimeout(() => {
      searchFunds(text, chip).then((result) => {
        if (id !== requestId.current) return;
        setLoading(false);
        setFunds(result.funds);
        setError(/goal\s*id|risk\s*bucket|direct mutual fund portfolio|no .*portfolio found/i.test(String(result.message || "")) ? "" : (result.message || ""));
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, open, chip]);

  function runSearch(text, nextChip = chip) {
    const value = text.trim();
    if (value.length < 2) {
      setHint(value ? "Type at least 2 characters to search" : "");
      setFunds([]);
      setError("");
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setHint("");
    searchFunds(value, nextChip).then((result) => {
      if (id !== requestId.current) return;
      setLoading(false);
      setFunds(result.funds);
      setError(/goal\s*id|risk\s*bucket|direct mutual fund portfolio|no .*portfolio found/i.test(String(result.message || "")) ? "" : (result.message || ""));
    });
  }

  function pickFund(fund) {
    const next = saveRecentSearch(fund.name);
    setRecent(next);
    onSelect?.(fund);
    onClose?.();
  }

  function pickRecent(name) {
    setQuery(name);
    runSearch(name, chip);
  }

  if (!open) return null;

  const emptyQuery = !query.trim();
  const showRecent = emptyQuery && recent.length > 0 && funds.length === 0 && !loading;

  return (
    <div className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-sm">
      <div className="max-w-[720px] 4xl:max-w-[900px] mx-auto px-4 sm:px-6 py-4 sm:py-6 h-full flex flex-col w-full">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white border border-border rounded-btn px-3.5 h-11 focus-within:border-jade">
            <Search size={16} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder="Search mutual funds"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runSearch(query, chip);
                }
              }}
              className="bg-transparent border-none outline-none text-sm text-ink w-full"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted hover:text-ink"
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex gap-1.5 mb-5 flex-wrap">
          {CHIPS.map((item) => {
            const selected = chip === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setChip(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                  selected ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border"
                }`}
              >
                {item.id}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {showRecent && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-ink">Recent searches</div>
                <button
                  type="button"
                  onClick={() => setRecent(clearRecentSearches())}
                  className="text-xs font-medium text-muted hover:text-ink"
                >
                  Clear history
                </button>
              </div>
              <div className="space-y-1">
                {recent.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pickRecent(name)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-btn hover:bg-white border border-transparent hover:border-border text-left"
                  >
                    <History size={16} className="text-muted shrink-0" />
                    <span className="text-sm text-ink truncate">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-16 text-jade">
              <Loader2 size={28} className="animate-spin" />
            </div>
          )}

          {!loading && error && (
            <div className="text-sm text-red-600 py-10 text-center">{error}</div>
          )}

          {!loading && !error && hint && (
            <div className="text-sm text-muted py-10 text-center">{hint}</div>
          )}

          {!loading && !error && !hint && query.trim().length >= 2 && funds.length === 0 && (
            <div className="text-sm text-muted py-10 text-center">No funds found</div>
          )}

          {!loading && !error && funds.length > 0 && (
            <div className="space-y-1">
              {funds.map((fund) => (
                <button
                  key={`${fund.scheme}-${fund.name}`}
                  type="button"
                  onClick={() => pickFund(fund)}
                  className="w-full text-left px-4 py-3.5 rounded-card bg-white border border-border hover:border-jade shadow-card"
                >
                  <div className="text-sm font-semibold text-ink">{fund.name}</div>
                  {fund.subtitle ? <div className="text-xs text-muted mt-0.5">{fund.subtitle}</div> : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
