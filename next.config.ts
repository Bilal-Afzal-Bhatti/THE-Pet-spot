import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows images from any HTTPS domain
      },
      // {
      //   protocol: "http",
      //   hostname: "**", // optional: allows HTTP too (not recommended)
      // },
    ],
  },
};

export default nextConfig;
