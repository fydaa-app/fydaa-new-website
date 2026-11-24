"use client";

import { useCallback, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: ReactNode;
}

/**
 * A single-choice control (a radio group) whose highlight slides between options
 * (transitions.dev #16, "tabs sliding"). Options may wrap onto several rows; the pill follows in
 * both axes. Arrow keys move the choice, as in a native radio group.
 */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
  optionClassName,
}: {
  /** Accessible name of the group. */
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  optionClassName?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  const place = useCallback((animate: boolean) => {
    const bar = barRef.current;
    const pill = pillRef.current;
    const active = bar?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (!bar || !pill || !active) return;
    const apply = () => {
      pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.height = `${active.offsetHeight}px`;
    };
    if (animate) {
      apply();
      return;
    }
    const previous = pill.style.transition;
    pill.style.transition = "none";
    apply();
    void pill.offsetWidth;
    pill.style.transition = previous;
  }, []);

  useLayoutEffect(() => {
    place(placed.current);
    placed.current = true;
  }, [value, place]);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(() => place(false));
    observer.observe(bar);
    return () => observer.disconnect();
  }, [place]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const nextIndex = (index + step + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    barRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
  }

  return (
    <div ref={barRef} role="radiogroup" aria-label={label} className={cn("t-seg", className)}>
      <span ref={pillRef} className="t-seg-pill" aria-hidden="true" />
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn("t-seg-option", optionClassName)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
