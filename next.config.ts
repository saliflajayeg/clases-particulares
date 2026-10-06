import type { NextConfig } from "next";

// NEXT_PUBLIC_DEMO=1 → web estática de demostración para GitHub Pages (ver demo/prepare.sh).
const demo = process.env.NEXT_PUBLIC_DEMO === "1";

const nextConfig: NextConfig = demo
  ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
  : { experimental: { serverActions: { bodySizeLimit: "25mb" } } };

export default nextConfig;
