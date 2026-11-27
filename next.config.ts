import type { NextConfig } from "next";

const appEnv = (process.env.NEXT_PUBLIC_APP_ENV || "prod").toLowerCase();
const isStage = appEnv === "stage" || appEnv === "staging" || appEnv === "dev";
const stockRemote = String(
  (isStage
    ? process.env.NEXT_PUBLIC_STOCK_BASE_URL_STAGE || process.env.NEXT_PUBLIC_STOCK_BASE_URL
    : process.env.NEXT_PUBLIC_STOCK_BASE_URL_PROD || process.env.NEXT_PUBLIC_STOCK_BASE_URL) ||
    (isStage ? "https://stocktransaction-stage.fydaa.com" : "https://stocktransaction.fydaa.com"),
).replace(/\/$/, "");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Enforce clickjacking + baseline; full CSP ships Report-Only via netlify.toml first
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' https://*.fydaa.com",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/carrers", destination: "/careers", permanent: true },
      { source: "/fydaaFYIP", destination: "/programme", permanent: true },
      { source: "/fydaaFYIP/:path*", destination: "/programme", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/stock/:path*",
        destination: `${stockRemote}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fydaa-v2.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
