import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/require-auth";

/** Signed-in application area. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
