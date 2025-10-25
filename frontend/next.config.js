/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  /**
   * Webpack Configuration for Code Splitting & Tree Shaking
   * Optimizes bundle size by:
   * - Splitting large chunks
   * - Removing unused code
   * - Optimizing CSS
   * - Lazy loading heavy modules
   */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.optimization = {
        ...config.optimization,
        
        // Advanced code splitting strategy
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Split React ecosystem into separate chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'react-vendors',
              priority: 50,
              reuseExistingChunk: true,
            },
            
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|lucide-react|@heroicons)[\\/]/,
              name: 'ui-vendors',
              priority: 40,
              reuseExistingChunk: true,
            },
            
            // Apollo/GraphQL
            apollo: {
              test: /[\\/]node_modules[\\/](@apollo|graphql)[\\/]/,
              name: 'apollo-vendors',
              priority: 30,
              reuseExistingChunk: true,
            },
            
            // Page Builder specific blocks
            blocks: {
              test: /[\\/]frontend[\\/]src[\\/]components[\\/]page-builder[\\/]blocks[\\/]/,
              name: 'page-builder-blocks',
              priority: 20,
              reuseExistingChunk: true,
              minSize: 0,
            },
            
            // Common vendors
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            
            // Common shared across pages
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              name: 'common',
            },
          },
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          minSize: 20000,
          maxSize: 244000,
        },
        
        // Runtime chunk for better caching
        runtimeChunk: {
          name: 'runtime',
        },
      };
    }
    
    return config;
  },
  
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
    
    // Dynamic CSS optimization
    optimizeCss: true,
    
    // Disable telemetry to avoid OpenTelemetry issues with Bun
    disableInstrumentation: true,
  },
  
  // Moved from experimental.serverComponentsExternalPackages
  serverExternalPackages: ['graphql'],
  
  // Image optimization
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
    // Optimize image loading
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
    NEXT_PUBLIC_WS_ENDPOINT: process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:3001/graphql',
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
  
  // Redirects and rewrites
  rewrites: async () => ({
    beforeFiles: [],
    afterFiles: [],
    fallback: [],
  }),
  
  // Performance hints
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
