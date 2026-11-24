import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";

/**
 * DEVELOPMENT-ONLY same-origin proxy to the stock transaction API.
 *
 * The stock API's CORS allowlist does not include localhost, so `npm run dev` routes
 * browser calls through here (see getStockBase in signup/lib/apiHosts.js). Production
 * builds never call it and it answers 404, so the site cannot be used as an open relay
 * that hides client IPs from the backend's rate limiting.
 */

const isEnabled = process.env.NODE_ENV === "development";

type Context = { params: Promise<{ path: string[] }> };

function notFound() {
  return NextResponse.json({ error: true, message: "Not found" }, { status: 404 });
}

async function proxy(request: NextRequest, context: Context) {
  if (!isEnabled) return notFound();

  const { path } = await context.params;
  if (path.some((segment) => segment === ".." || segment === "." || segment.includes("\\"))) {
    return notFound();
  }

  const target = new URL(path.map(encodeURIComponent).join("/"), env.api.stock);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["accept", "authorization", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const init: RequestInit & { duplex?: "half" } = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half"; // required by Node fetch when streaming a request body
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return NextResponse.json({ error: true, message: "Unable to reach stock service" }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
