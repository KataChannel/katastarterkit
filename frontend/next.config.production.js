/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  /**
   * FORCE Webpack usage (disable Turbopack)
   * Turbopack uses more memory than Webpack on low-resource servers
   * Set empty turbopack config to explicitly disable it
   */
  turbopack: {},  // Empty config = disable Turbopack
  
  /**
   * Webpack Configuration optimized for 2GB RAM server
   */
  webpack: (config, { isServer, webpack }) => {
    // Fix for OpenTelemetry module resolution issue with Bun/Docker
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        {
          'next/dist/compiled/@opentelemetry/api': 'next/dist/compiled/@opentelemetry/api',
        },
      ];
    }
    
    // Optimize for low memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
      // Reduce memory usage during build
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        },
        maxInitialRequests: 25,
        minSize: 20000
      }
    };
    
    return config;
  },
  
  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features - minimal for stability
  experimental: {},
  
  // Image optimization - simplified
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
    NEXT_PUBLIC_WS_ENDPOINT: process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:3001/graphql',
  },
  
  // Disable some heavy features for faster build
  // Production only - no source maps to save build time and memory
  productionBrowserSourceMaps: false,
  
  // Disable type checking during build (already done in dev)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Headers for better caching
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
