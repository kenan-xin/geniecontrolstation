import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16+ uses Turbopack by default)
  turbopack: {
    root: "..", // Set root to parent dir since monorepo has multiple lockfiles
  },
};

export default nextConfig;
