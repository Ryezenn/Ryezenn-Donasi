import type { NextConfig } from "next";
import path from "path";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Hanya gunakan custom Webpack config di komputer lokal, abaikan di Vercel agar Turbopack berjalan lancar
  ...(isVercel ? {} : {
    turbopack: {},
    webpack: (config) => {
      config.resolve.modules = [
        path.resolve(process.cwd(), "node_modules"),
        "node_modules",
      ];
      return config;
    },
  })
};

export default nextConfig;
