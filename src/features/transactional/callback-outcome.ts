/**
 * Interpret the query string a payment/KYC provider appends when redirecting back.
 *
 * Only an explicit success signal counts as success; anything ambiguous is "unknown",
 * and the app must confirm the real status with the backend. Providers seen so far use
 * `status=successful|failed`, `success=true|false` and `error`/`error_code` params.
 */
export type CallbackOutcome = "success" | "failure" | "unknown";

const SUCCESS_STATUSES = new Set(["success", "successful", "completed", "complete", "captured", "approved"]);
const FAILURE_STATUSES = new Set([
  "failure",
  "failed",
  "fail",
  "error",
  "cancelled",
  "canceled",
  "rejected",
  "declined",
  "expired",
  "aborted",
]);

export function resolveCallbackOutcome(params: Pick<URLSearchParams, "get">): CallbackOutcome {
  const status = (params.get("status") ?? params.get("result") ?? "").trim().toLowerCase();
  const success = (params.get("success") ?? "").trim().toLowerCase();
  const hasError = Boolean(params.get("error") || params.get("error_code") || params.get("errorCode"));

  if (hasError || FAILURE_STATUSES.has(status) || success === "false") return "failure";
  if (SUCCESS_STATUSES.has(status) || success === "true") return "success";
  return "unknown";
}
