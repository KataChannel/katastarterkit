/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable stable features for Next.js 15
    optimizePackageImports: [
      '@heroicons/react', 
      '@headlessui/react',
      '@apollo/client',
      'react-hook-form',
      'react-hot-toast',
      'lucide-react',
      '@radix-ui/react-icons'
    ],
    // Enable React Server Components optimizations
    serverComponentsExternalPackages: ['graphql'],
  },
  images: {
    domains: ['localhost', 'minio'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '19001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'minio',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
    NEXT_PUBLIC_WS_ENDPOINT: process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:3001/graphql',
  },
};

module.exports = nextConfig;
