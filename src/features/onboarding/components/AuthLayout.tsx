import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/**
 * Login and signup entry screens (mobile number, OTP). Desktop: the title on the shared left
 * edge, the form in a panel under it and a quiet reassurance column beside the panel. Phones: one
 * column, the form first, the reassurance after it.
 */
export function AuthLayout({
  heading,
  children,
  aside,
}: {
  /** The h1 and its supporting line. */
  heading: ReactNode;
  /** The form. */
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-8 xl:gap-x-24">
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">{heading}</div>
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        <FormPanel>{children}</FormPanel>
      </div>
      {aside ? <div className="min-w-0 lg:col-start-2 lg:row-start-2">{aside}</div> : null}
    </Container>
  );
}

/**
 * The form's surface. On phones the screen is the panel, so it sits flat; from `sm` up it is a
 * white panel with the one floating shadow.
 */
export function FormPanel({ children }: { children: ReactNode }) {
  return (
    <div className="sm:rounded-4xl sm:border sm:border-line sm:bg-paper sm:p-8 sm:shadow-window">{children}</div>
  );
}

/**
 * The focused screens after the OTP (PIN, risk profile, KYC), when the site header steps aside:
 * the logo, then one centred column.
 */
export function FocusLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
      <div className="flex h-12 items-center">
        <img src="/fydaa-logo.png" alt={siteConfig.name} width={409} height={147} className="h-8 w-auto" />
      </div>
      <div className="mt-4 sm:mt-6">
        <FormPanel>{children}</FormPanel>
      </div>
    </div>
  );
}
