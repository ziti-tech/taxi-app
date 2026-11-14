import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=()" },
        { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'" },
      ],
    }];
  },
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
