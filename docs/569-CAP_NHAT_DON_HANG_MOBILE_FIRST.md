# Cập Nhật Giao Diện Đơn Hàng - Mobile First

## Tổng Quan
Cập nhật giao diện trang chi tiết đơn hàng `/don-hang/[orderNumber]` theo chuẩn Mobile-First Design với shadcn UI.

## Các Thay Đổi Chính

### 1. Layout Mobile-First
- **Trước:** Desktop-first với grid 3 columns (sidebar + main content)
- **Sau:** Single-column mobile-first, responsive tất cả màn hình
- Background: `bg-gray-50` cho toàn trang
- Container: `max-w-4xl` thay vì `max-w-6xl`
- Padding: `px-3 sm:px-4` responsive
- Gap: `space-y-3 sm:space-y-4` tăng dần theo màn hình

### 2. Header Tối Ưu Mobile
```tsx
- Text responsive: text-lg sm:text-xl md:text-2xl
- Layout: flex column với gap-3
- Order number breakable với break-words
- Status badge size="sm" trên mobile
- Back button: -ml-2 để gần mép màn hình hơn
```

### 3. Cards Tối Ưu Mobile
**Order Summary (Hiển thị đầu tiên):**
- Đưa lên đầu trang cho UX tốt hơn
- Spacing nhỏ gọn: `space-y-2.5`
- Separator mỏng: `my-2`

**Product Items:**
- Image size: `w-16 h-16 sm:w-20 sm:h-20`
- Price & quantity stacked: `flex-col sm:flex-row`
- Separator giữa các items
- Text sizes: `text-sm sm:text-base`

**Payment & Shipping:**
- Grid: `grid-cols-1 sm:grid-cols-2`
- 2 cards cạnh nhau trên tablet+
- Badge font: `text-xs sm:text-sm`

**Shipping Address:**
- Icon sizes: `h-3.5 w-3.5`
- Text: `text-xs sm:text-sm`
- Address với `leading-relaxed` dễ đọc
- Email `break-all` tránh overflow

### 4. Spacing & Typography
```tsx
CardHeader: pb-3 (giảm padding bottom)
CardTitle: text-base sm:text-lg
Text sizes: text-xs sm:text-sm
Icon sizes: h-4 w-4 sm:h-5 sm:w-5
```

### 5. Loading & Error States
**Loading:**
- Min-height cho consistent layout
- Skeleton nhỏ gọn với spacing phù hợp mobile

**Error:**
- Centered layout với `flex items-center justify-center`
- Icon: `h-12 w-12 sm:h-16 sm:w-16`
- Button: `w-full sm:w-auto`
- Padding: `p-3 sm:p-4`

### 6. Quick Actions
- Full width buttons trên mobile: `w-full`
- Stack vertical: `flex-col gap-2`
- Button size: `size="sm"` phù hợp mobile
- Luôn hiển thị tracking, conditional cancel

## Kết Quả

### Mobile (< 640px)
✅ Single column layout
✅ Compact spacing
✅ Full-width buttons
✅ Stacked price info
✅ Smaller text & icons
✅ Optimized touch targets

### Tablet (≥ 640px)
✅ Slightly larger spacing
✅ Payment/Shipping grid 2 cols
✅ Horizontal price layout
✅ Larger text & icons

### Desktop (≥ 1024px)
✅ Max-width container centered
✅ Comfortable spacing
✅ All features visible
✅ Consistent with design system

## Files Modified
- `/frontend/src/app/(website)/don-hang/[orderNumber]/page.tsx`

## Testing Checklist
- [x] Mobile portrait (320px - 480px)
- [x] Mobile landscape (480px - 640px)  
- [x] Tablet (640px - 1024px)
- [x] Desktop (1024px+)
- [x] Loading states
- [x] Error states
- [x] Touch interactions
- [x] Text readability
- [x] Image loading
- [x] Button tap targets

## Performance
- Lazy loading với Suspense
- Optimized spacing giảm reflows
- Consistent card structure
- Minimal layout shifts

## Accessibility
- Semantic HTML structure
- Touch-friendly targets (min 44px)
- Readable text contrast
- Icon + text labels
- Skip navigation support
