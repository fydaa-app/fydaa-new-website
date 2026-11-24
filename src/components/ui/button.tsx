import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade " +
  "disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-jade text-white hover:bg-jade-hover",
  secondary: "border border-grey-200 bg-white text-ink hover:bg-grey-100",
  ghost: "text-jade hover:bg-jade-tint",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: { variant?: Variant; size?: Size; block?: boolean; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], block && "w-full", className);
}

interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  /** Full-width button. */
  block?: boolean;
}

export interface ButtonProps extends ComponentProps<"button">, ButtonStyleProps {
  /** Shows a busy state and blocks repeated submits. */
  loading?: boolean;
}

export function Button({
  variant,
  size,
  block,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends ComponentProps<typeof Link>, ButtonStyleProps {}

/** A link styled as a button. External URLs open in a new tab with safe `rel`. */
export function ButtonLink({ variant, size, block, className, href, ...props }: ButtonLinkProps) {
  const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, block, className })}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
