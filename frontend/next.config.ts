import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker production deployment
  output: "standalone",

  // Enable React strict mode for development
  reactStrictMode: true,

  // Allow images from any domain (for user avatars, etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
