# Next.js 15 Configuration Fixes

## ✅ Đã sửa

### 1. **next.config.js - serverComponentsExternalPackages**

**Vấn đề**: 
```
⚠ `experimental.serverComponentsExternalPackages` has been moved to `serverExternalPackages`
```

**Sửa**:
```javascript
// Trước (deprecated):
experimental: {
  serverComponentsExternalPackages: ['graphql'],
}

// Sau (Next.js 15):
serverExternalPackages: ['graphql'],
```

### 2. **postcss.config.js - Export Syntax**

**Vấn đề**:
```
SyntaxError: Unexpected token 'export'
```

**Sửa**:
```javascript
// Trước (Lỗi - ES Module):
export default config;

// Sau (Đúng - CommonJS):
module.exports = { ... };
```

### 3. **Link Components - legacyBehavior**

**Vấn đề**:
```
⚠ `legacyBehavior` is deprecated and will be removed in a future release
```

**Sửa**: Đã chạy codemod
```bash
npx @next/codemod@latest new-link . --force
```

**Kết quả**:
- ✅ 15 files đã được cập nhật
- ✅ 206 files không cần thay đổi
- ✅ 3 files bỏ qua
- ✅ 0 lỗi

## 📋 Cấu hình cuối cùng

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@heroicons/react', 
      '@headlessui/react',
      '@apollo/client',
      'react-hook-form',
      'react-hot-toast',
      'lucide-react',
      '@radix-ui/react-icons'
    ],
  },
  serverExternalPackages: ['graphql'], // ✅ Moved from experimental
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
```

### postcss.config.js
```javascript
module.exports = {
  plugins: ["@tailwindcss/postcss"],
};
```

## 🎯 Kết quả

- ✅ Không còn cảnh báo về `serverComponentsExternalPackages`
- ✅ PostCSS config hoạt động đúng
- ✅ Link components đã được cập nhật (không còn legacyBehavior)
- ✅ Sẵn sàng cho Next.js 15.5.4

## 🚀 Test

```bash
npm run dev
npm run build
npm run type-check
```

Tất cả đều hoạt động không có warning! ✅
