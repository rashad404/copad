const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for monorepo lockfile detection
  outputFileTracingRoot: path.join(__dirname, './'),
  images: {
    domains: [
      'example.com', 
      'localhost',
      'placehold.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      } 
    ],
    unoptimized: true,
  },
  // Type errors and lint errors fail the build. They were both suppressed,
  // which let 64 type errors accumulate - including real runtime bugs.
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // No trailing slash for better compatibility
  trailingSlash: false,
  
  // Add a custom header to help debug
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-NextJS-Server',
            value: 'true',
          },
        ],
      },
    ]
  }
};

module.exports = nextConfig;