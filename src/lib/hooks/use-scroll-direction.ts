import { useSyncExternalStore } from "react";

/**
 * - "top": still within the first ~60% of the screen
 * - "down": scrolling down further into the page
 * - "up": scrolling back up
 */
export type ScrollState = "top" | "up" | "down";

/** Ignore jitter smaller than this many pixels. */
const THRESHOLD = 8;

let state: ScrollState = "top";
let lastY = 0;
const listeners = new Set<() => void>();

function compute(y: number): ScrollState | null {
  if (y < window.innerHeight * 0.6) return "top";
  if (Math.abs(y - lastY) < THRESHOLD) return null;
  return y > lastY ? "down" : "up";
}

function onScroll() {
  const y = Math.max(0, window.scrollY);
  const next = compute(y);
  if (next === null) return;
  lastY = y;
  if (next !== state) {
    state = next;
    listeners.forEach((listener) => listener());
  }
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    lastY = window.scrollY;
    state = compute(lastY) ?? state;
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("scroll", onScroll);
  };
}

/** Where the reader is and which way they are scrolling, from one shared passive listener. */
export function useScrollState(): ScrollState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => "top",
  );
}
