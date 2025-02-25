import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  // Ensure API routes are properly handled
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
    externalResolver: false,
  },
};

export default nextConfig;
