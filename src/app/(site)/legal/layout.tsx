import type { ReactNode } from "react";

/**
 * Shared document styling for the legal pages (see `.legal-doc` in globals.css): a
 * readable measure, consistent spacing and heading sizes, without rewriting the legal
 * text each page carries.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div className="legal-doc">{children}</div>;
}
