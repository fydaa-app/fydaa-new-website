"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

interface Snapshot {
  text: string;
  value: number;
  prevText: string | null;
  dir: 1 | -1;
  run: number;
}

/**
 * A figure whose changed digits cross-fade in place, rising when the value goes up and falling
 * when it goes down (transitions.dev #36, "number subtle change"). Digits that didn't change stay
 * still. Screen readers get the whole value once; the animated glyphs are hidden from them.
 */
export function SubtleNumber({
  text,
  value,
  className,
}: {
  /** The formatted figure, e.g. "₹11.60 L". */
  text: string;
  /** The raw number, used only to pick the direction. */
  value: number;
  className?: string;
}) {
  const [snap, setSnap] = useState<Snapshot>({ text, value, prevText: null, dir: 1, run: 0 });

  // Derive the transition from the previous render (React's "store previous props" pattern).
  if (snap.text !== text) {
    setSnap({ text, value, prevText: snap.text, dir: value >= snap.value ? 1 : -1, run: snap.run + 1 });
  }

  const { prevText } = snap;
  const sameLength = prevText !== null && prevText.length === text.length;

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span
        key={snap.run}
        aria-hidden="true"
        className={cn("t-subtle-number", snap.run > 0 && "is-animating")}
        style={{ "--subtle-dir": snap.dir } as CSSProperties}
      >
        {[...text.replace(/ /g, "\u00a0")].map((ch, i) => {
          const was = prevText?.replace(/ /g, "\u00a0");
          if (was === undefined || (sameLength && was[i] === ch)) return <span key={i}>{ch}</span>;
          return (
            <span className="t-subtle-slot" key={i}>
              {sameLength ? <span className="t-subtle-old">{was[i]}</span> : null}
              <span className="t-subtle-new">{ch}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
