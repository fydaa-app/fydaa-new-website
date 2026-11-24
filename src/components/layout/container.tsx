import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The one horizontal layout box for the public site. Every section, the header and the
 * footer use it so their edges line up at every width.
 *
 * - `content` (default): page sections, header, footer.
 * - `prose`: long-form reading (legal pages, notices) capped at a comfortable measure.
 * - `narrow`: focused tasks such as forms.
 */
const sizes = {
  narrow: "max-w-xl",
  prose: "max-w-3xl",
  content: "max-w-6xl",
} as const;

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: keyof typeof sizes;
} & Omit<ComponentProps<T>, "as">;

export function Container<T extends ElementType = "div">({
  as,
  size = "content",
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...props} />
  );
}
