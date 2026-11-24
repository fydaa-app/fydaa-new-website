import type { ReactNode } from "react";
import "./legal.css";

/**
 * Legal pages share one document style (`legal.css`) and one layout (`<LegalDocument>` in
 * `_components`): a readable measure, consistent headings and lists, without rewriting the
 * legal text each page carries.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return children;
}
