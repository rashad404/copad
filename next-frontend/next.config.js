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
  output: 'export', // Add this for static export
};

module.exports = nextConfig;