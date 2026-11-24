import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "outline-inverse";
type Size = "md" | "lg";

/**
 * Class names for a button. The styles live once in globals.css (`.btn`, `.btn-<variant>`,
 * `.btn-<size>`), so components and plain markup render identical buttons.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  block,
  className,
}: { variant?: Variant; size?: Size; block?: boolean; className?: string } = {}) {
  return cn("btn", `btn-${variant}`, `btn-${size}`, block && "w-full", className);
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
