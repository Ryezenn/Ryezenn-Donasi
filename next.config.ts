import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(process.cwd(), "node_modules"),
      "node_modules",
    ];
    return config;
  },
};

export default nextConfig;
