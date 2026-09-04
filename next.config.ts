import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/carrers", destination: "/careers", permanent: true },
      { source: "/fydaaFYIP", destination: "/programme", permanent: true },
      { source: "/fydaaFYIP/:path*", destination: "/programme", permanent: true },
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
