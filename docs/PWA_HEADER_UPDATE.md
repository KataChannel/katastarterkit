# Cập Nhật Website Header - PWA Install

## Ngày cập nhật: 2024

## Tổng quan

Website header (`website-header.tsx`) đã được cập nhật để tích hợp tính năng cài đặt PWA (Progressive Web App).

## Các thay đổi

### 1. Import mới

```tsx
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { HeaderActions, DEFAULT_APP_MODULES } from '@/components/layout/HeaderActions';
```

### 2. Hook usePWA

Sử dụng hook `usePWA` để lấy thông tin về khả năng cài đặt PWA:

```tsx
const { capabilities, install } = usePWA();
```

### 3. Nút cài đặt PWA

#### Mobile (trong top bar)
```tsx
{capabilities.canInstall && !capabilities.isStandalone && (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 relative"
          onClick={() => install()}
        >
          <div className="relative">
            <Smartphone className="w-5 h-5" />
            <Download className="w-2.5 h-2.5 text-yellow-300 absolute -bottom-0.5 -right-0.5" />
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Cài đặt ứng dụng</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)}
```

#### Desktop (trong User Actions)
```tsx
{capabilities.canInstall && !capabilities.isStandalone && (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="relative p-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all group"
          onClick={() => install()}
        >
          <div className="relative">
            <Smartphone className="w-5 h-5" />
            <Download className="w-2.5 h-2.5 text-yellow-300 absolute -bottom-0.5 -right-0.5 group-hover:animate-bounce" />
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Cài đặt ứng dụng</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)}
```

## Điều kiện hiển thị nút PWA

Nút cài đặt PWA chỉ hiển thị khi:

1. `capabilities.canInstall === true`: Trình duyệt hỗ trợ cài đặt PWA
2. `capabilities.isStandalone === false`: App chưa được cài đặt (không chạy ở standalone mode)

## Mối quan hệ với HeaderActions

`website-header.tsx` **không sử dụng trực tiếp** `HeaderActions` component vì:

1. Website header có design đặc biệt với:
   - Background màu xanh lá (`#57A345`)
   - Layout 12 cột grid
   - Responsive riêng cho mobile/desktop
   - Các tính năng e-commerce (giỏ hàng, đơn hàng)

2. `HeaderActions` được thiết kế cho admin/LMS với:
   - Background light/dark variants
   - User dropdown với quick actions
   - Permission-based access control

### Khi nào dùng HeaderActions?

- Admin panels (`/admin/*`)
- LMS pages (`/lms/*`)
- Các layout đơn giản cần header actions

### Khi nào dùng custom implementation (như website-header)?

- Storefront với design đặc biệt
- Pages cần cart/orders icons
- Responsive layout phức tạp

## PWA Capabilities từ usePWA hook

```typescript
interface PWACapabilities {
  isStandalone: boolean;      // App đang chạy standalone mode?
  canInstall: boolean;        // Có thể cài đặt?
  hasNotificationSupport: boolean;
  hasBackgroundSync: boolean;
  hasPushSupport: boolean;
  isOnline: boolean;
  serviceWorkerReady: boolean;
}

interface PWAHookReturn {
  capabilities: PWACapabilities;
  install: () => Promise<void>;  // Trigger install prompt
  // ... other methods
}
```

## Testing

### Test trên Desktop Chrome:

1. Mở DevTools → Application → Manifest
2. Click "Add to Home screen" để test
3. Hoặc sử dụng Chrome flag: `chrome://flags/#bypass-app-banner-engagement-checks`

### Test trên Mobile:

1. Deploy lên HTTPS server
2. Mở trình duyệt Chrome/Safari
3. Nút cài đặt sẽ xuất hiện khi đủ điều kiện

## Troubleshooting

### Nút không xuất hiện?

1. Kiểm tra console: `beforeinstallprompt` event có được fire không?
2. Kiểm tra `capabilities.canInstall` trong React DevTools
3. Đảm bảo manifest.json valid
4. Đảm bảo Service Worker registered

### Install prompt không hiện?

1. Trang phải chạy trên HTTPS (hoặc localhost)
2. Service worker phải được register
3. Manifest phải có đủ các trường required
4. User phải có interaction với trang (scroll, click, etc.)

## Files liên quan

- `/frontend/src/components/layout/website-header.tsx` - Main component
- `/frontend/src/hooks/usePWA.ts` - PWA hook
- `/frontend/src/components/layout/HeaderActions.tsx` - Reference component
- `/frontend/public/manifest.json` - PWA manifest
- `/frontend/public/sw.js` - Service Worker
