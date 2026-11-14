import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/book", destination: "/#book", permanent: true },
      { source: "/tariff", destination: "/#fleet", permanent: true },
      { source: "/services/:path*", destination: "/#book", permanent: true },
      { source: "/routes/:path*", destination: "/#routes", permanent: true },
      { source: "/about", destination: "/#home", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
