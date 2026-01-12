import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['local-origin.dev', '*.local-origin.dev'],
    },
  },
};

export default nextConfig;