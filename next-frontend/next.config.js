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
  // Disable static export for server-side deployment
  // output: 'export',
  
  // Disable TypeScript type checking for build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;