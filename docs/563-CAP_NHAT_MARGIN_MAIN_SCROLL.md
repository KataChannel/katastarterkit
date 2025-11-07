# Cập Nhật Margin Main Khi Header Scroll

## 🎯 Yêu cầu
Khi `scrollThreshold = 50px`, phần `<main>` sẽ có `margin-top: 100px` (gấp đôi threshold) để tránh bị che bởi sticky header.

## ✅ Giải pháp

### 1. Tạo ScrollContext để chia sẻ scroll state
**File: `frontend/src/contexts/ScrollContext.tsx`**

```tsx
// Context chia sẻ scroll state giữa header và layout
export function ScrollProvider({ children, threshold = 50 })
export function useScroll() // Hook để consume scroll state
```

**Tính năng:**
- ✅ Quản lý `isScrolled` state toàn cục
- ✅ Configurable `scrollThreshold` (default 50px)
- ✅ Hysteresis logic để tránh jitter (20px buffer)
- ✅ RequestAnimationFrame để optimize performance
- ✅ Passive event listener

### 2. Cập nhật Layout với margin động
**File: `frontend/src/app/(website)/layout.tsx`**

```tsx
// Wrap với ScrollProvider
<ScrollProvider threshold={50}>
  <WebsiteLayoutContent>
    {children}
  </WebsiteLayoutContent>
</ScrollProvider>

// Main với margin động
<main 
  style={{ 
    marginTop: isScrolled ? scrollThreshold * 2 : 0 
  }}
>
```

**Logic:**
- Khi `isScrolled = false`: `marginTop = 0px`
- Khi `isScrolled = true`: `marginTop = 50 * 2 = 100px`
- Transition smooth với `duration-500 ease-in-out`

### 3. Refactor WebsiteHeader
**File: `frontend/src/components/layout/website-header.tsx`**

```tsx
// Sử dụng useScroll thay vì quản lý state riêng
const { isScrolled } = useScroll();

// ❌ Loại bỏ code cũ
// const [isScrolled, setIsScrolled] = useState(false);
// useEffect scroll detection logic...
```

**Lợi ích:**
- ✅ Đơn giản hóa code
- ✅ Single source of truth
- ✅ Đồng bộ scroll state giữa components

## 🎨 Hiệu ứng UI

### Trước khi scroll (scrollY < 50px)
```
┌──────────────────┐
│  HEADER (sticky) │
├──────────────────┤
│  MAIN CONTENT    │ ← margin-top: 0
│                  │
└──────────────────┘
```

### Sau khi scroll (scrollY >= 50px)
```
┌──────────────────┐
│  HEADER (sticky) │ ← Header thu nhỏ
├──────────────────┤
│                  │ ← margin-top: 100px
│  MAIN CONTENT    │
│                  │
└──────────────────┘
```

## 📝 Chi tiết kỹ thuật

### ScrollContext Logic
```typescript
const threshold = 50; // Scroll threshold
const hysteresis = 20; // Buffer zone

// Scroll down: trigger at 50 + 20 = 70px
if (scrollPosition > threshold + hysteresis) {
  setIsScrolled(true);
}

// Scroll up: trigger at 50 - 20 = 30px
if (scrollPosition < threshold - hysteresis) {
  setIsScrolled(false);
}
```

### Margin Calculation
```typescript
// scrollThreshold = 50
// mainMarginTop = 50 * 2 = 100px
const mainMarginTop = isScrolled ? scrollThreshold * 2 : 0;
```

### Smooth Transition
```tsx
<main 
  className="transition-all duration-500 ease-in-out"
  style={{ marginTop: `${mainMarginTop}px` }}
>
```

## 🎯 Kết quả

### ✅ Hoàn thành
1. **ScrollContext** - Quản lý scroll state toàn cục
2. **Layout động** - Margin-top tự động theo scroll
3. **Header clean** - Không còn duplicate logic
4. **Smooth animation** - Transition mượt mà 500ms
5. **Performance** - RequestAnimationFrame + passive listener

### 📊 Performance
- ✅ No layout thrashing
- ✅ Debounced với RAF
- ✅ Passive scroll listener
- ✅ Hysteresis ngăn jitter

### 🎨 UX
- ✅ Main content không bị che
- ✅ Smooth transition animation
- ✅ No jitter khi scroll
- ✅ Responsive với mọi kích thước màn hình

## 🔧 Cấu hình

Để thay đổi threshold hoặc margin ratio:

```tsx
// Thay đổi threshold (default: 50px)
<ScrollProvider threshold={80}>

// Thay đổi margin ratio
const mainMarginTop = isScrolled ? scrollThreshold * 3 : 0; // 150px
```

## 📦 Files đã tạo/sửa

1. ✅ **Tạo mới**: `frontend/src/contexts/ScrollContext.tsx`
2. ✅ **Cập nhật**: `frontend/src/app/(website)/layout.tsx`
3. ✅ **Cập nhật**: `frontend/src/components/layout/website-header.tsx`

## 🚀 Test

1. Load trang website
2. Scroll xuống > 70px → Header thu nhỏ, main có margin 100px
3. Scroll lên < 30px → Header mở rộng, main margin về 0
4. Check animation smooth và không bị jitter

✨ **Hoàn thành theo đúng yêu cầu!**
