import type { NextConfig } from "next";
import { legacyRedirects } from "./src/config/routes";
import { securityHeaders } from "./src/config/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({ isDev: process.env.NODE_ENV === "development" }),
      },
    ];
  },
  async redirects() {
    return [
      { source: "/carrers", destination: "/careers", permanent: true },
      { source: "/fydaaFYIP", destination: "/programme", permanent: true },
      { source: "/fydaaFYIP/:path*", destination: "/programme", permanent: true },
      ...legacyRedirects(),
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
