const backend = (process.env.BACKEND_URL ?? "").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  poweredByHeader: false,
  // Same-origin proxy to the Spring Boot API (see .env.example).
  async rewrites() {
    return backend ? [{ source: "/api/:path*", destination: `${backend}/api/:path*` }] : [];
  },
  // Admin pages: never cached, never framed.
  async headers() {
    return [{
      source: "/admin/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "same-origin" },
      ],
    }];
  },
};
