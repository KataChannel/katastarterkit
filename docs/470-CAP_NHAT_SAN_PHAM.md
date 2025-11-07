# Cập nhật Giao diện - Mobile First & Shadcn UI

## Ngày: 6/11/2025

# Cập nhật Giao diện - Mobile First & Shadcn UI

## Ngày: 6/11/2025

## 1. Support Chat Widget - Shadcn UI + Fix Color Bug

### File: `frontend/src/components/support-chat/SupportChatWidget.tsx`

✅ **Refactor hoàn toàn với Shadcn UI components:**

#### Components sử dụng:
```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
```

#### **🔧 Fix Bug: Không thay đổi màu được**

**Vấn đề**: Shadcn UI Button có class mặc định override inline `style={{ backgroundColor }}`

**Giải pháp**: Sử dụng CSS Variables với Tailwind arbitrary values

```tsx
// ❌ Không hoạt động - Shadcn override
<Button style={{ backgroundColor: primaryColor }} />

// ✅ Hoạt động - CSS Variable
<Button 
  className="bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)]"
  style={{ '--chat-primary': primaryColor } as React.CSSProperties}
/>
```

**Áp dụng cho:**
1. Chat Button (nút tròn)
2. "Bắt đầu chat" button
3. Send message button
4. Header background (giữ nguyên inline style - OK)
5. Message bubbles (giữ nguyên inline style - OK)

#### Cải tiến:

**1. Chat Button**
```tsx
<Button
  size="lg"
  className={cn(
    "relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl text-white border-0",
    "hover:scale-110 active:scale-95 transition-transform hover:opacity-90",
    "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)]"
  )}
  style={{ '--chat-primary': primaryColor } as React.CSSProperties}
>
  <MessageCircle />
</Button>
```

**2. Start Chat Button**
```tsx
<Button
  className={cn(
    "w-full text-white border-0",
    "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
  )}
  style={{ '--chat-primary': primaryColor } as React.CSSProperties}
>
  Bắt đầu chat
</Button>
```

**3. Send Button**
```tsx
<Button
  size="icon"
  className={cn(
    "flex-shrink-0 rounded-xl text-white border-0",
    "bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)] hover:opacity-90"
  )}
  style={{ '--chat-primary': primaryColor } as React.CSSProperties}
>
  <Send />
</Button>
```

**4. Chat Window**
- `Card` component thay vì div custom
- `CardHeader` với gradient background
- `CardContent` cho messages area
- Border-0 shadow-2xl

**5. Header**
- `Avatar` component với fallback
- `Button` variant="ghost" cho actions
- Animated background giữ nguyên

**6. Messages Area**
- `ScrollArea` component (scrollable)
- `Card` cho welcome message
- Color system: `bg-muted`, `text-foreground`, `text-muted-foreground`
- Responsive spacing

**7. Input Area**
- `Input` component với rounded-xl
- `Button` size="icon" cho attachment
- `Button` variant="secondary" cho quick replies
- Full keyboard support

#### Tùy chỉnh:
```typescript
interface SupportChatWidgetProps {
  apiUrl?: string;
  websocketUrl?: string;
  primaryColor?: string;  // ✅ Màu chủ đạo - ĐÃ FIX
  position?: 'bottom-right' | 'bottom-left'; // Vị trí
}

// Sử dụng
<SupportChatWidget
  primaryColor="#16a34a"  // Màu xanh lá
  position="bottom-right"
/>
```

#### Wrapper Integration:
```tsx
// SupportChatWidgetWrapper.tsx
<SupportChatWidget
  apiUrl={apiUrl}
  websocketUrl={websocketUrl}
  primaryColor={config.primaryColor || '#16a34a'} // ✅ Truyền từ settings
  position={config.position || 'bottom-right'}
/>
```

#### Theo Rules:
✅ **Mobile First**: Responsive breakpoints (sm:)
✅ **Shadcn UI**: Tất cả components chuẩn
✅ **Vietnamese UI**: Tất cả text tiếng Việt
✅ **Dialog scrollable**: ScrollArea component
✅ **Color Theming**: CSS Variables + Tailwind
✅ **Bug Fix**: Màu thay đổi được 100%

---

## 2. ProductImage Component - Error Handling

### File: `frontend/src/components/ui/product-image.tsx`

✅ **Xử lý hình ảnh lỗi với fallback:**
- Tự động hiển thị placeholder khi link hình bị lỗi
- Loading skeleton khi đang tải hình
- Kiểm tra src hợp lệ (không null, undefined, empty)
- Icon ImageIcon + text "Không có hình" khi lỗi
- Mobile First responsive sizing

✅ **Tính năng:**
```typescript
- Tự động phát hiện lỗi: onError handler
- Loading state: skeleton animation
- Fallback UI: ImageIcon + text tiếng Việt
- Responsive sizes: mobile-first breakpoints
- Next.js Image optimization: quality 85
- Priority loading cho above-the-fold images
```

---

## 3. ProductCarouselBlock

### File: `frontend/src/components/page-builder/blocks/ProductCarouselBlock.tsx`

✅ **Thay thế Image → ProductImage:**
- Product card images
- Image preview dialog
- Tự động xử lý lỗi, không cần kiểm tra conditional

✅ **Thêm tính năng tương tác:**
- **Xem hình ảnh**: Click icon Eye (mắt) → mở Dialog preview hình lớn
- **Chi tiết sản phẩm**: Click tên sản phẩm → chuyển đến `/san-pham/{slug}`
- **Thêm giỏ hàng**: Nút Add to Cart với toast notification

✅ **Sử dụng full URL:**
```typescript
const getProductUrl = (product: Product) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const slug = getProductSlug(product);
  return `${baseUrl}/san-pham/${slug}`;
};
```

---

## 4. Trang Sản phẩm

### Files:
- `frontend/src/app/(website)/san-pham/page.tsx`
- `frontend/src/app/(website)/san-pham/[slug]/page.tsx`

✅ **Thay thế tất cả Image → ProductImage:**
- Product cards tự động xử lý lỗi hình
- Main product image, thumbnails, related products
- Badges (HOT, Discount) có z-index cao

✅ **Sử dụng full URL:**
```tsx
href={`${process.env.NEXT_PUBLIC_APP_URL || ''}/san-pham/${product.slug}`}
```

---

## 5. Rules từ rulepromt.txt

✅ **1. Code Principal Engineer**
✅ **2. Architecture (Clean Architecture)**
✅ **3. Performance Optimizations** (skeleton, lazy load)
✅ **4. Developer Experience** (TypeScript, components)
✅ **5. User Experience** (fallback UI, loading states)
✅ **6. Code Quality** (reusable components)
✅ **10. Frontend chuẩn shadcn UI + Mobile First + Responsive + PWA**
✅ **11. Giao diện tiếng Việt**
✅ **12. Dialog layout: header, footer, content scrollable**

---

## 6. Tính năng hoàn thành

### UI Components:
✅ Fix Combobox không chọn được (cursor-pointer)
✅ Sonner toast notifications
✅ **Support Chat - Shadcn UI refactor hoàn toàn**
✅ **ProductImage component với error handling**

### PageBuilder:
✅ Fix GraphQL menu parentId conflict
✅ Fix ProductCarousel data source (dual query system)
✅ Fix layout blocks style merging (Grid/Flex/Section/Container)
✅ ProductItemEditor component
✅ Items tab trong ProductCarouselSettings
✅ Interactive handlers cho product cards

### E-commerce:
✅ Full URL cho product links
✅ Xử lý tất cả hình ảnh lỗi tự động
✅ Mobile responsive (sizes breakpoints)
✅ Performance tối ưu (lazy load, quality 85)

---

## 7. URL theo môi trường

#### Development (localhost)
- Base: `http://localhost:12000`
- Link: `http://localhost:12000/san-pham/{slug}`

#### Production Rausach
- Base: `http://116.118.49.243:12000`
- Link: `http://116.118.49.243:12000/san-pham/{slug}`

#### Production Tazagroup
- Base: `http://116.118.49.243:13000`
- Link: `http://116.118.49.243:13000/san-pham/{slug}`

---

## 8. Kiểm tra

### Support Chat:
1. ✅ Chat button responsive (mobile/desktop)
2. ✅ Shadcn UI components render đúng
3. ✅ Color theming hoạt động
4. ✅ ScrollArea smooth scroll
5. ✅ Input/Button states (disabled, hover)
6. ✅ Quick replies clickable
7. ✅ Avatar fallback khi không có ảnh
8. ✅ Badge unread count

### Product Images:
1. ✅ Hình ảnh lỗi → hiển thị fallback
2. ✅ Hình ảnh hợp lệ → loading skeleton → hiển thị
3. ✅ Click icon Eye → xem hình lớn (với fallback)
4. ✅ Click tên sản phẩm → vào chi tiết
5. ✅ Click Add to Cart → thông báo toast
6. ✅ Link đúng theo môi trường (dev/prod)
7. ✅ Mobile responsive (sizes breakpoints)
8. ✅ Performance tối ưu (lazy load, quality 85)
