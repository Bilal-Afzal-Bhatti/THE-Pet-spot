// Extract hostname safely from environment variable or fallback to localhost
const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const url = new URL(backendUrl);

const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        // 1. Placeholder domain for development fallbacks
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        // 2. Your backend server / uploads domain
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port || "",
        pathname: "/uploads/**",
      },
      {
        // 3. Unsplash images
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;