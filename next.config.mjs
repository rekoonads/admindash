/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.koodos.in https://clerk.admin.koodos.in https://*.clerk.accounts.dev https://*.clerk.com https://clerk.koodos.in/npm/ https://clerk.admin.koodos.in/npm/ https://js.clerk.com https://js.clerk.dev https://cdn.jsdelivr.net; connect-src 'self' https://clerk.koodos.in https://clerk.admin.koodos.in https://*.clerk.accounts.dev https://*.clerk.com https://api.clerk.com https://api.clerk.dev; object-src 'none';"
          }
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "koodos.in",
      },
      {
        protocol: "https",
        hostname: "admin.koodos.in",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
