# Fix Animation Search Bar Khi Scroll

## Vấn Đề
Search bar trong desktop header không có animation mượt mà khi ẩn/hiện theo scroll. Component bị remove hoàn toàn khỏi DOM thay vì sử dụng CSS transitions.

## Nguyên Nhân
```tsx
// ❌ TRƯỚC: Conditional rendering với &&
{headerSettings['header.show_search'] && !isScrolled && (
  <div>...</div>
)}
```

Khi `isScrolled = true`, component bị unmount hoàn toàn → Không có transition.

## Giải Pháp

### ✅ SAU: Luôn render + CSS transitions
```tsx
{headerSettings['header.show_search'] && (
  <div className={cn(
    "transition-all duration-500 ease-in-out overflow-hidden",
    isScrolled ? "max-h-0 opacity-0 py-0" : "max-h-20 opacity-100 py-2"
  )}>
    {/* Elements với scale animations */}
  </div>
)}
```

## Các Thay Đổi Chi Tiết

### 1. Container Search Bar
```tsx
// Luôn render, điều khiển bằng CSS
className={cn(
  "flex flex-row items-center max-w-lg mx-auto px-4 space-x-4",
  "transition-all duration-500 ease-in-out overflow-hidden",
  isScrolled 
    ? "max-h-0 opacity-0 py-0"    // Ẩn: height=0, opacity=0
    : "max-h-20 opacity-100 py-2"  // Hiện: height=80px, opacity=1
)}
```

### 2. Phone Icon
```tsx
<Phone className={cn(
  "w-8 h-8 text-[#FAA61A] transition-all duration-500 ease-in-out",
  isScrolled ? "scale-0" : "scale-100"  // Scale animation
)} />
```

### 3. Phone Link
```tsx
<a className={cn(
  "text-lg text-[#FAA61A] font-bold whitespace-nowrap",
  "transition-all duration-500 ease-in-out",
  isScrolled ? "scale-0 w-0" : "scale-100"  // Scale + width animation
)}>
  {contactSettings['contact.phone_display']}
</a>
```

### 4. Search Form
```tsx
<form className={cn(
  "relative flex-1 transition-all duration-500 ease-in-out",
  isScrolled ? "scale-0 w-0" : "scale-100"  // Scale + width animation
)}>
  {/* Input và Button */}
</form>
```

### 5. Search Icon (trong Button)
```tsx
<Search className={cn(
  "w-4 h-4 transition-all duration-500 ease-in-out",
  isScrolled ? "scale-0" : "scale-100"  // Scale animation
)} />
```

## Hiệu Ứng Đạt Được

### Khi Scroll Xuống (> 180px)
1. Container thu nhỏ height từ 80px → 0px
2. Opacity giảm từ 1 → 0
3. Phone icon scale từ 100% → 0%
4. Phone link scale từ 100% → 0% + width về 0
5. Search form scale từ 100% → 0% + width về 0
6. Search icon scale từ 100% → 0%
7. **Tất cả diễn ra trong 500ms với easing smooth**

### Khi Scroll Lên (≤ 160px - hysteresis 20px)
1. Container mở rộng height từ 0px → 80px
2. Opacity tăng từ 0 → 1
3. Tất cả elements scale từ 0% → 100%
4. **Animation ngược lại mượt mà**

## Tuân Thủ rulepromt.txt

### ✅ Rule #10: Mobile First + Responsive
- Desktop only: `hidden lg:block`
- Mobile có layout riêng (không bị ảnh hưởng)
- Sử dụng Tailwind breakpoints

### ✅ Rule #10: shadcn UI Components
- `Input` từ shadcn UI
- `Button` từ shadcn UI
- `cn()` utility từ shadcn

### ✅ Performance Optimization
- CSS transitions (GPU-accelerated)
- `overflow-hidden` ngăn content tràn
- `transition-all duration-500` consistent timing
- Hysteresis (20px buffer) chống jitter

## Kết Quả

### TRƯỚC
- ❌ Search bar biến mất đột ngột
- ❌ Không có animation
- ❌ UX kém mượt

### SAU
- ✅ Animation mượt mà 500ms
- ✅ Smooth collapse/expand
- ✅ Scale transitions cho từng element
- ✅ UX professional

## File Thay Đổi
- `frontend/src/components/layout/website-header.tsx` (1 file)

## Test
1. Scroll xuống > 180px → Search bar thu nhỏ mượt
2. Scroll lên < 160px → Search bar mở rộng mượt
3. Kiểm tra không có jank/jump
4. Search icon trong menu vẫn hoạt động bình thường
