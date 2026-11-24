"use client";

import { ErrorView, type ErrorViewProps } from "@/components/feedback/error-view";

/** Fallback for routes outside the (site) group: dashboard, partner sites, callbacks. */
export default function RootError(props: ErrorViewProps) {
  return <ErrorView {...props} />;
}
