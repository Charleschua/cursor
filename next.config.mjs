/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled React Compiler - may cause CSP eval issues in production
  // reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://*.googleusercontent.com https://*.google.com",
              "font-src 'self' data:",
              "connect-src 'self' https://accounts.google.com https://*.supabase.co",
              "frame-src 'self' https://accounts.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
