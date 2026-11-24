import { endSession } from "@/lib/auth/session";
import { getAccessToken } from "@/lib/auth/token-store";
import { ApiError, NETWORK_ERROR_STATUS, TIMEOUT_STATUS, userMessageFor } from "./api-error";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions {
  method?: HttpMethod;
  query?: QueryParams;
  /** Serialised as JSON. Mutually exclusive with `form`. */
  json?: unknown;
  /** Sent as-is (multipart or urlencoded). Mutually exclusive with `json`. */
  form?: FormData | URLSearchParams;
  headers?: HeadersInit;
  /** Attach the user's bearer token; fails fast when there is none. Ends the session on 401. */
  auth?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  /**
   * Many backends answer HTTP 200 with `{ success: false }` / `{ error: true }`.
   * When true (default) such bodies are treated as failures.
   */
  rejectFailureFlags?: boolean;
  /** Passed through to fetch (e.g. `{ revalidate: 600 }` for server components). */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

export const DEFAULT_TIMEOUT_MS = 20_000;

export function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const url = new URL(path.replace(/^\/+/, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("json") || /^[[{]/.test(text.trim())) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return null;
    }
  }
  // Non-JSON bodies (HTML error pages from proxies, etc.) are never surfaced to users.
  return null;
}

function hasFailureFlag(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const record = body as Record<string, unknown>;
  return record.success === false || record.error === true;
}

export async function request<T = unknown>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = options.json !== undefined || options.form ? "POST" : "GET",
    query,
    json,
    form,
    auth = false,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
    rejectFailureFlags = true,
    next,
    cache,
  } = options;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (auth) {
    const token = getAccessToken();
    if (!token) throw new ApiError(userMessageFor(401, null), 401);
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body: BodyInit | undefined;
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  } else if (form) {
    body = form; // fetch sets the multipart/urlencoded content type itself
  }

  const timeout = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(buildUrl(baseUrl, path, query), {
      method,
      headers,
      body,
      signal: combinedSignal,
      cache,
      ...(next ? { next } : {}),
    } as RequestInit);
  } catch (error) {
    if (signal?.aborted) throw error; // caller cancelled: propagate the AbortError untouched
    const status = timeout.aborted ? TIMEOUT_STATUS : NETWORK_ERROR_STATUS;
    throw new ApiError(userMessageFor(status, null), status);
  }

  const data = await readBody(response);

  if (!response.ok) {
    if (auth && response.status === 401) endSession();
    throw new ApiError(userMessageFor(response.status, data), response.status, data);
  }

  if (rejectFailureFlags && hasFailureFlag(data)) {
    throw new ApiError(userMessageFor(response.status, data), response.status, data);
  }

  return data as T;
}

/** Bind `request` to a base URL: `const crm = createApiClient(env.api.crm); crm.get("x")`. */
export function createApiClient(baseUrl: string) {
  return {
    request: <T = unknown>(path: string, options?: RequestOptions) => request<T>(baseUrl, path, options),
    get: <T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "json" | "form">) =>
      request<T>(baseUrl, path, { ...options, method: "GET" }),
    post: <T = unknown>(path: string, options?: Omit<RequestOptions, "method">) =>
      request<T>(baseUrl, path, { ...options, method: "POST" }),
    put: <T = unknown>(path: string, options?: Omit<RequestOptions, "method">) =>
      request<T>(baseUrl, path, { ...options, method: "PUT" }),
    patch: <T = unknown>(path: string, options?: Omit<RequestOptions, "method">) =>
      request<T>(baseUrl, path, { ...options, method: "PATCH" }),
    delete: <T = unknown>(path: string, options?: Omit<RequestOptions, "method">) =>
      request<T>(baseUrl, path, { ...options, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
