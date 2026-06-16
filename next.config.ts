import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any domain for future CMS/CDN integration
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
