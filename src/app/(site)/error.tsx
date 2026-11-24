"use client";

import { ErrorView, type ErrorViewProps } from "@/components/feedback/error-view";

/** Errors in marketing/auth pages render inside the site chrome. */
export default function SiteError(props: ErrorViewProps) {
  return <ErrorView {...props} />;
}
