import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";

/** The frame for each step of applying: one left-aligned column under the header. */
export function FlowShell({ size = "narrow", children }: { size?: "narrow" | "prose"; children: ReactNode }) {
  return (
    <section className="pb-16 pt-24 sm:pb-20 sm:pt-28">
      <Container size={size} className="flex flex-col">
        {children}
      </Container>
    </section>
  );
}

/** A quiet text button that leads back a step; its text lines up with the content edge. */
export function BackButton({
  onClick,
  children = "Back",
  ...rest
}: {
  onClick: () => void;
  children?: ReactNode;
  disabled?: boolean;
  "data-ph-event"?: string;
}) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost btn-md -ml-3 self-start px-3" {...rest}>
      {children}
    </button>
  );
}

/** An error under a field or action; give it a new `key` to replay the shake. */
export function ErrorText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={`t-shake rounded-card bg-red-50 px-3 py-2.5 text-sm text-danger ${className}`}>
      {children}
    </p>
  );
}

/** Short confirmations and errors after an action. The live region stays mounted so it is announced. */
export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {message ? (
        <p
          key={message}
          className="t-dialog max-w-md rounded-btn bg-ink px-5 py-3 text-center text-sm font-semibold text-white shadow-window"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
