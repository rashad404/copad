/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Disable TypeScript type checking for build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
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