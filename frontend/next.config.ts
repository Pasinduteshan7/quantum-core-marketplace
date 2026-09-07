import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API URL is read from NEXT_PUBLIC_API_URL environment variable
  // No rewrites needed — the frontend calls the backend directly

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
