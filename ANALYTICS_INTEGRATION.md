# Analytics Integration - Google Analytics & Facebook Pixel

## 📊 Tổng Quan

Hệ thống đã được tích hợp đầy đủ các công cụ analytics:
- ✅ **Google Analytics 4 (GA4)**
- ✅ **Google Tag Manager (GTM)**
- ✅ **Facebook Pixel**
- ✅ **TikTok Pixel**

## 🎯 Tính Năng

### 1. Google Analytics 4 (GA4)
- Page view tracking tự động
- E-commerce event tracking
- Custom event tracking
- Support GA4 và Universal Analytics (UA)

### 2. Google Tag Manager
- Container loading
- DataLayer integration
- Custom tag management

### 3. Facebook Pixel
- Standard events tracking
- Custom events
- E-commerce conversion tracking
- Configurable events:
  - PageView
  - ViewContent
  - Search
  - AddToCart
  - InitiateCheckout
  - Purchase
  - Lead
  - CompleteRegistration

### 4. TikTok Pixel
- Page view tracking
- E-commerce events
- Custom conversion tracking

## 🔧 Cấu Hình

### Backend Settings (Database)

Tất cả settings được lưu trong bảng `website_settings` với category `ANALYTICS`:

```typescript
// Google Analytics
analytics.google_analytics_id          // GA4 Measurement ID: G-XXXXXXXXXX
analytics.google_analytics_enabled     // true/false

// Google Tag Manager
analytics.google_tag_manager_id        // GTM Container ID: GTM-XXXXXXX
analytics.google_tag_manager_enabled   // true/false

// Facebook Pixel
analytics.facebook_pixel_id            // Pixel ID: 1234567890123456
analytics.facebook_pixel_enabled       // true/false
analytics.facebook_pixel_events        // JSON config cho events

// TikTok Pixel
analytics.tiktok_pixel_id              // Pixel ID
analytics.tiktok_pixel_enabled         // true/false
```

### Frontend Integration

**1. Layout Integration** (`frontend/src/app/layout.tsx`):
```tsx
import { AnalyticsWrapper } from '@/components/analytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <AnalyticsWrapper /> {/* Analytics scripts loaded here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

**2. Components**:
- `AnalyticsWrapper.tsx` - Fetch settings và render scripts
- `AnalyticsScripts.tsx` - Render tracking scripts
- `lib/analytics.ts` - Helper functions để track events

## 📝 Cách Sử Dụng

### A. Cấu Hình Qua Admin Panel

1. **Truy cập Admin Settings**:
   ```
   /admin/settings/website
   ```

2. **Chọn Category**: `ANALYTICS`

3. **Nhập thông tin**:
   - Google Analytics ID
   - Facebook Pixel ID
   - TikTok Pixel ID
   - Bật/tắt từng service

4. **Lưu settings**

### B. Track Events trong Code

#### 1. Universal Tracker (Track tất cả platforms)

```tsx
import { trackEvent } from '@/lib/analytics';

// Page View
trackEvent.pageView('/products');

// View Product
trackEvent.viewContent(
  'product-123',      // Product ID
  'Rau sạch hữu cơ', // Product Name
  50000,              // Value
  'VND'               // Currency
);

// Add to Cart
trackEvent.addToCart(
  'product-123',
  'Rau sạch hữu cơ',
  50000,
  'VND',
  2 // quantity
);

// Initiate Checkout
trackEvent.initiateCheckout(
  150000, // total value
  'VND',
  [
    { id: 'product-123', name: 'Rau sạch', quantity: 2, price: 50000 },
    { id: 'product-456', name: 'Củ quả', quantity: 1, price: 50000 }
  ]
);

// Purchase
trackEvent.purchase(
  'ORDER-12345',
  150000,
  'VND',
  [
    { id: 'product-123', name: 'Rau sạch', quantity: 2, price: 50000 },
    { id: 'product-456', name: 'Củ quả', quantity: 1, price: 50000 }
  ]
);

// Search
trackEvent.search('rau sạch hữu cơ');

// Registration
trackEvent.completeRegistration('email');

// Contact
trackEvent.contact();
```

#### 2. Platform-Specific Tracking

**Facebook Pixel**:
```tsx
import { fbPixel } from '@/lib/analytics';

// Standard event
fbPixel.addToCart({
  content_ids: ['product-123'],
  content_name: 'Rau sạch',
  value: 50000,
  currency: 'VND'
});

// Custom event
fbPixel.trackCustom('ProductReview', {
  product_id: 'product-123',
  rating: 5
});
```

**Google Analytics**:
```tsx
import { gtag } from '@/lib/analytics';

// Custom event
gtag.event('button_click', {
  button_name: 'Add to Cart',
  page_location: '/products/123'
});

// E-commerce event
gtag.purchase('ORDER-123', 150000, 'VND', [
  { item_id: '123', item_name: 'Product', quantity: 1, price: 150000 }
]);
```

**TikTok Pixel**:
```tsx
import { ttqPixel } from '@/lib/analytics';

// Track event
ttqPixel.addToCart({
  content_id: 'product-123',
  content_name: 'Rau sạch',
  value: 50000,
  currency: 'VND'
});
```

### C. Tự Động Track Page Views

Page views được tự động track khi:
- User navigate giữa các pages
- Scripts được load (initial page load)

Để track manual page view:
```tsx
'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent.pageView(pathname);
  }, [pathname]);

  return null;
}
```

### D. Track E-commerce Flow

**Product Page**:
```tsx
'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function ProductPage({ product }) {
  useEffect(() => {
    trackEvent.viewContent(
      product.id,
      product.name,
      product.price,
      'VND'
    );
  }, [product]);

  return (
    <div>
      <h1>{product.name}</h1>
      <button onClick={() => handleAddToCart()}>Add to Cart</button>
    </div>
  );
}
```

**Add to Cart**:
```tsx
const handleAddToCart = () => {
  // Add to cart logic
  addToCart(product);

  // Track event
  trackEvent.addToCart(
    product.id,
    product.name,
    product.price,
    'VND',
    quantity
  );
};
```

**Checkout**:
```tsx
const handleCheckout = () => {
  const items = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price
  }));

  trackEvent.initiateCheckout(
    totalAmount,
    'VND',
    items
  );

  // Navigate to checkout
  router.push('/checkout');
};
```

**Order Success**:
```tsx
useEffect(() => {
  if (order) {
    trackEvent.purchase(
      order.id,
      order.total,
      'VND',
      order.items.map(item => ({
        id: item.productId,
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    );
  }
}, [order]);
```

## 🔍 Debug & Testing

### 1. Check Scripts Loaded

Mở Console:
```javascript
// Facebook Pixel
typeof window.fbq !== 'undefined'

// Google Analytics
typeof window.gtag !== 'undefined'

// TikTok Pixel
typeof window.ttq !== 'undefined'
```

### 2. Test Events

**Facebook Pixel Helper Extension**:
- Install: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)
- Xem events được fire real-time

**Google Analytics Debugger**:
- Install: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/)
- Check console logs

**TikTok Pixel Helper**:
- Install: [TikTok Pixel Helper](https://chrome.google.com/webstore/detail/tiktok-pixel-helper/)

### 3. Manual Test

```javascript
// Test Facebook Pixel
window.fbq('track', 'PageView');

// Test Google Analytics
window.gtag('event', 'test_event', { test: true });

// Test TikTok Pixel
window.ttq.track('PageView');
```

## 📦 Files Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── layout.tsx              # Import AnalyticsWrapper
│   ├── components/
│   │   └── analytics/
│   │       ├── index.ts
│   │       ├── AnalyticsWrapper.tsx    # Fetch settings & render
│   │       └── AnalyticsScripts.tsx    # Script tags
│   └── lib/
│       └── analytics.ts            # Tracking helpers

backend/
└── src/
    └── seed/
        └── seed-website-settings.ts    # Analytics settings seed
```

## 🚀 Deployment

### 1. Seed Settings
```bash
cd backend
bun run ts-node src/seed/seed-website-settings.ts
```

### 2. Configure IDs
Update trong Admin Panel hoặc database:
```sql
UPDATE website_settings 
SET value = 'G-XXXXXXXXXX' 
WHERE key = 'analytics.google_analytics_id';

UPDATE website_settings 
SET value = 'true' 
WHERE key = 'analytics.google_analytics_enabled';
```

### 3. Deploy
```bash
bun run dev  # Option 5: Deploy App
```

## ⚠️ Lưu Ý

### 1. Privacy & GDPR
- Analytics chỉ load sau khi user accept cookies (nếu có cookie consent)
- Cân nhắc implement cookie consent banner
- Data anonymization options trong GA4

### 2. Performance
- Scripts load với `strategy="afterInteractive"`
- Không block initial page render
- Minimal impact on Core Web Vitals

### 3. Security
- Pixel IDs không public (isPublic: false)
- Chỉ admin mới xem/edit analytics settings
- Validate IDs format trước khi save

### 4. Testing
- Test trên production domain (pixels chỉ work trên domain đã config)
- Use test events trước khi go live
- Setup conversion tracking trước khi chạy ads

## 📊 Metrics to Track

### E-commerce
- ✅ Product Views
- ✅ Add to Cart
- ✅ Initiate Checkout
- ✅ Purchase
- ✅ Cart Abandonment (custom)

### Engagement
- ✅ Page Views
- ✅ Search Queries
- ✅ Time on Page
- ✅ Bounce Rate

### Conversions
- ✅ Registration
- ✅ Newsletter Signup (custom)
- ✅ Contact Form Submit
- ✅ Phone Click (custom)

## 🎓 Resources

- [Google Analytics 4 Docs](https://developers.google.com/analytics/devguides/collection/ga4)
- [Facebook Pixel Docs](https://developers.facebook.com/docs/facebook-pixel)
- [TikTok Pixel Docs](https://ads.tiktok.com/help/article?aid=10000357)
- [Google Tag Manager Guide](https://developers.google.com/tag-platform/tag-manager)

## ✅ Checklist Go-Live

- [ ] Seed analytics settings vào database
- [ ] Configure Google Analytics ID trong admin
- [ ] Configure Facebook Pixel ID trong admin
- [ ] Test với browser extensions
- [ ] Verify events fire correctly
- [ ] Test conversion tracking
- [ ] Setup goals/conversions trong platforms
- [ ] Enable privacy compliance (if needed)
- [ ] Train team về analytics dashboard
- [ ] Document custom events for team

---

**Last Updated**: November 27, 2025
**Version**: 1.0.0
