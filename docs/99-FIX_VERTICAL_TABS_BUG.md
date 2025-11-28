# Fix Bug Vertical Tabs - Website Settings

## 🐛 Vấn Đề
Tabs trong Website Settings không hiển thị dọc (vertical) như mong đợi, vẫn đang render nằm ngang.

## 🔍 Nguyên Nhân
- Component `TabsList` và `TabsTrigger` từ shadcn/ui không hỗ trợ tốt cho vertical layout
- CSS classes không đủ để override default behavior của Tabs component
- Cần custom buttons thay vì dùng TabsTrigger

## ✅ Giải Pháp

### Thay đổi từ TabsList sang Custom Buttons

**Trước:**
```tsx
<TabsList className="flex flex-row md:flex-col ...">
  <TabsTrigger value={cat.value} ...>
    ...
  </TabsTrigger>
</TabsList>
```

**Sau:**
```tsx
{/* Mobile: Horizontal Scroll */}
<div className="md:hidden overflow-x-auto">
  <button onClick={() => setSelectedCategory(cat.value)}>
    {cat.label}
  </button>
</div>

{/* Desktop: Vertical List */}
<div className="hidden md:block">
  <button onClick={() => setSelectedCategory(cat.value)}>
    {cat.label}
  </button>
</div>
```

## 🎨 Cải Tiến

### 1. Mobile Layout
- ✅ Horizontal scroll với `overflow-x-auto`
- ✅ Buttons có `min-w-max` để tránh wrap
- ✅ Compact spacing (gap-1, px-4, py-2)
- ✅ Icon + text inline

### 2. Desktop Layout  
- ✅ Vertical stack với `flex-col`
- ✅ Full width buttons với `w-full`
- ✅ Text align left với `justify-start`
- ✅ Larger spacing (px-4, py-3)
- ✅ Overflow-y-auto cho nhiều items

### 3. Active State
```tsx
${isActive 
  ? 'bg-background shadow-sm text-primary font-medium' 
  : 'hover:bg-background/50 text-muted-foreground'
}
```

### 4. Responsive Behavior
- **Mobile (<768px):** Hiện horizontal scroll, ẩn vertical list
- **Desktop (≥768px):** Ẩn horizontal scroll, hiện vertical list

## 📱 Mobile First Design

```
Mobile:
┌─────────────────────────────────────┐
│ Header (Sticky)                     │
├─────────────────────────────────────┤
│ [Btn1] [Btn2] [Btn3] [Btn4] →      │ ← Scroll
├─────────────────────────────────────┤
│ Content                             │
└─────────────────────────────────────┘

Desktop:
┌─────────────────────────────────────┐
│ Header                              │
├──────────┬──────────────────────────┤
│ [Btn 1]  │                          │
│ [Btn 2]* │  Content                 │
│ [Btn 3]  │                          │
│ [Btn 4]  │                          │
│    ↓     │                          │
└──────────┴──────────────────────────┘
```

## 🛠️ Technical Details

### Key Classes Used
- `md:hidden` / `hidden md:block` - Conditional rendering
- `overflow-x-auto` / `overflow-y-auto` - Scroll direction
- `flex-row` / `flex-col` - Layout direction
- `min-w-max` - Prevent wrapping on mobile
- `shrink-0` - Fixed sidebar width (256px)

### State Management
```tsx
const [selectedCategory, setSelectedCategory] = useState('GENERAL');
onClick={() => setSelectedCategory(cat.value)}
```

### Styling Strategy
- Conditional classes based on `isActive` state
- Transition effects for smooth UX
- Shadow on active for depth
- Hover states for interactivity

## 📦 Dependencies
- React hooks: `useState`
- Lucide icons: Icon components
- Tailwind CSS: Utility classes
- shadcn/ui: `Tabs`, `TabsContent` (content only)

## ✨ Result
✅ Vertical tabs trên desktop với sidebar cố định
✅ Horizontal scroll tabs trên mobile
✅ Active state rõ ràng
✅ Smooth transitions
✅ Responsive breakpoints hoạt động đúng

## 🚀 Deployment
```bash
cd frontend
bun run build
```

---
**Status:** ✅ Fixed
**Tested:** Mobile + Desktop layouts
**Follow Rule:** Mobile First + Responsive (rulepromt.txt)
