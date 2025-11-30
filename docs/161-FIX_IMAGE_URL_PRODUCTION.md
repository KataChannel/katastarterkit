# Fix Bug URL Ảnh Không Hiển Thị Trên Production

## Ngày: 2024-11-30

## Vấn đề

Ảnh đại diện bài viết (ví dụ: `https://rausachtrangia.com/upload/sanpham/klt02011452.jpg`) hiển thị được trên localhost nhưng không hiển thị khi deploy lên server production (`https://shop.rausachtrangia.com/`).

## Nguyên nhân

1. **URL trong database lưu HTTP**: Một số URL ảnh trong database được lưu với protocol HTTP (ví dụ: `http://rausachtrangia.com/...`)
2. **Server redirect HTTP → HTTPS**: Server `rausachtrangia.com` redirect tất cả request HTTP sang HTTPS (301 redirect)
3. **Next.js Image Optimization không follow redirects**: Next.js Image component không tự động follow redirect, dẫn đến lỗi 400 Bad Request khi optimize ảnh

## Giải pháp

### 1. Utility Function `normalizeImageUrl`

Đã có sẵn utility function trong `/frontend/src/utils/image-url.ts`:

```typescript
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Already a data URL or blob
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Convert HTTP to HTTPS for rausachtrangia.com
  if (url.startsWith('http://rausachtrangia.com')) {
    return url.replace('http://', 'https://');
  }
  
  // Convert HTTP to HTTPS for www subdomain
  if (url.startsWith('http://www.rausachtrangia.com')) {
    return url.replace('http://', 'https://');
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return `https://rausachtrangia.com${url}`;
  }
  
  return url;
}
```

### 2. Cập nhật các Components

Các components sau đã được cập nhật để sử dụng `normalizeImageUrl`:

#### Website Pages
- ✅ `/app/(website)/bai-viet/page.tsx` - Trang danh sách bài viết
- ✅ `/app/(website)/bai-viet/[slug]/page.tsx` - Trang chi tiết bài viết
- ✅ `/app/(website)/khuyen-mai/page.tsx` - Trang khuyến mãi

#### Blog Components
- ✅ `/components/blog/BlogCard.tsx`
- ✅ `/components/blog/BlogDetail.tsx`
- ✅ `/components/blog/BlogListByCategory.tsx`

#### Admin Components
- ✅ `/app/admin/blog/page.tsx`
- ✅ `/components/admin/blog-tree/BlogTreeView.tsx`
- ✅ `/components/admin/product-tree/ProductTreeView.tsx`

#### Đã sử dụng OptimizedImage (tự động normalize)
- ✅ `/components/page-builder/blocks/BlogCarouselBlock.tsx` - Sử dụng `ProductImage` đã wrap `OptimizedImage`

### 3. Cách sử dụng

```tsx
import { normalizeImageUrl } from '@/utils/image-url';

// Trong component
<Image
  src={normalizeImageUrl(blog.thumbnailUrl)}
  alt={blog.title}
  fill
  className="object-cover"
/>
```

Hoặc sử dụng `OptimizedImage` component:

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src={blog.thumbnailUrl}
  alt={blog.title}
  fill
  className="object-cover"
/>
```

## Lưu ý

1. **Production build**: Cần build lại và deploy frontend sau khi thay đổi
2. **Database migration**: Cân nhắc migrate tất cả URL HTTP sang HTTPS trong database để giải quyết triệt để
3. **Next.js config**: `next.config.js` đã có cấu hình remotePatterns cho cả HTTP và HTTPS của rausachtrangia.com

## Files Changed

- `/frontend/src/app/(website)/bai-viet/page.tsx`
- `/frontend/src/app/(website)/bai-viet/[slug]/page.tsx`
- `/frontend/src/app/(website)/khuyen-mai/page.tsx`
- `/frontend/src/app/admin/blog/page.tsx`
- `/frontend/src/components/blog/BlogCard.tsx`
- `/frontend/src/components/blog/BlogDetail.tsx`
- `/frontend/src/components/blog/BlogListByCategory.tsx`
- `/frontend/src/components/admin/blog-tree/BlogTreeView.tsx`
- `/frontend/src/components/admin/product-tree/ProductTreeView.tsx`
