import { NextRequest, NextResponse } from "next/server";

const appEnv = (process.env.NEXT_PUBLIC_APP_ENV || "prod").toLowerCase();
const isStage = appEnv === "stage" || appEnv === "staging" || appEnv === "dev";
const stockRemote = String(
  (isStage
    ? process.env.NEXT_PUBLIC_STOCK_BASE_URL_STAGE || process.env.NEXT_PUBLIC_STOCK_BASE_URL
    : process.env.NEXT_PUBLIC_STOCK_BASE_URL_PROD || process.env.NEXT_PUBLIC_STOCK_BASE_URL) ||
    (isStage ? "https://stocktransaction-stage.fydaa.com" : "https://stocktransaction.fydaa.com"),
).replace(/\/$/, "");

type Ctx = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, context: Ctx) {
  const { path } = await context.params;
  const target = `${stockRemote}/${path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  const accept = req.headers.get("accept");
  const authorization = req.headers.get("authorization");
  const contentType = req.headers.get("content-type");
  if (accept) headers.set("accept", accept);
  if (authorization) headers.set("authorization", authorization);
  if (contentType) headers.set("content-type", contentType);

  const init: RequestInit = { method: req.method, headers, redirect: "manual" };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
    // Required by Node fetch when streaming a request body
    (init as RequestInit & { duplex?: string }).duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return NextResponse.json(
      { error: true, message: "Unable to reach stock service" },
      { status: 502 },
    );
  }

  const out = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) out.set("content-type", upstreamType);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
