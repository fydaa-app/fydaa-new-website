import type { NextConfig } from "next";

const appEnv = (process.env.NEXT_PUBLIC_APP_ENV || "prod").toLowerCase();
const isStage = appEnv === "stage" || appEnv === "staging" || appEnv === "dev";
const stockRemote = String(
  (isStage
    ? process.env.NEXT_PUBLIC_STOCK_BASE_URL_STAGE || process.env.NEXT_PUBLIC_STOCK_BASE_URL
    : process.env.NEXT_PUBLIC_STOCK_BASE_URL_PROD || process.env.NEXT_PUBLIC_STOCK_BASE_URL) ||
    (isStage ? "https://stocktransaction-stage.fydaa.com" : "https://stocktransaction.fydaa.com"),
).replace(/\/$/, "");

const nextConfig: NextConfig = {
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
