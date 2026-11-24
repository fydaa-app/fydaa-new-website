/** Error thrown for every failed API call. `message` is always safe to show to users. */
export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export const NETWORK_ERROR_STATUS = 0;
export const TIMEOUT_STATUS = 408;

const FRIENDLY_MESSAGES: Record<number, string> = {
  [NETWORK_ERROR_STATUS]: "We couldn't reach the server. Check your connection and try again.",
  [TIMEOUT_STATUS]: "The request took too long. Please try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have access to this.",
  404: "We couldn't find what you were looking for.",
  413: "That file is too large.",
  429: "Too many attempts. Please wait a moment and try again.",
};

const GENERIC_MESSAGE = "Something went wrong. Please try again.";
const SERVER_ERROR_MESSAGE = "Something went wrong on our side. Please try again shortly.";

export function friendlyMessage(status: number): string {
  if (FRIENDLY_MESSAGES[status]) return FRIENDLY_MESSAGES[status];
  return status >= 500 ? SERVER_ERROR_MESSAGE : GENERIC_MESSAGE;
}

/**
 * Extract a human-readable message from common backend error shapes:
 * `{ message }`, `{ message: [..] }` (NestJS validation), `{ error }`, `{ msg }`.
 */
export function messageFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  for (const key of ["message", "error", "msg"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const first: unknown = value[0];
      if (typeof first === "string" && first.trim()) return first.trim();
      if (
        first &&
        typeof first === "object" &&
        typeof (first as { message?: unknown }).message === "string"
      ) {
        return (first as { message: string }).message;
      }
    }
  }
  return null;
}

/** Backend validation messages (4xx) are useful to users; 5xx details are not shown. */
export function userMessageFor(status: number, body: unknown): string {
  const fromBody = messageFromBody(body);
  const isClientError = status >= 400 && status < 500;
  if (fromBody && (isClientError || status === 200) && fromBody.length <= 200) return fromBody;
  return friendlyMessage(status);
}
