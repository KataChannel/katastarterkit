# Carousel Media Only Mode Fix

## 🐛 Vấn đề
- **Media Only Mode** vẫn hiển thị text elements (badge, title, subtitle, description, CTA)
- Image không full-width, bị giới hạn bởi grid layout `md:grid-cols-2`
- Image bị `hidden` trên mobile device
- Layout container có padding/margin làm giảm diện tích hiển thị

## ✅ Solution (Senior Level)

### 1. **Tách logic Media Only Mode ra riêng**
```tsx
// Trước: Dùng conditional !slide.mediaOnly nhiều chỗ
{!slide.mediaOnly && (<div>Text content</div>)}

// Sau: Early return với dedicated layout
{slide.mediaOnly ? (
  // Full-width image layout
) : imagePos === 'top' || imagePos === 'bottom' ? (
  // Centered layout
) : (
  // Side-by-side layout
)}
```

### 2. **Full-width Container khi Media Only**
```tsx
<div className={`${slide.mediaOnly ? 'w-full h-full p-0' : 'container mx-auto px-4 md:px-8 py-12 md:py-16'}`}>
```

### 3. **Media Only Layout - 100% Image**
```tsx
{slide.mediaOnly ? (
  <div className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
    {slide.image && (
      <img 
        src={slide.image} 
        alt={slide.title || 'Carousel slide'}
        className="w-full h-full object-cover"
      />
    )}
  </div>
) : ...}
```

## 📋 Changes

### File: `frontend/src/components/page-builder/blocks/CarouselBlock.tsx`

**Line 415-420:** Container conditional
- Media Only: `w-full h-full p-0` (no padding, full size)
- Normal: `container mx-auto px-4 md:px-8 py-12 md:py-16`

**Line 417-428:** Media Only layout check (FIRST)
- Full-width image container
- `min-h-[400px] md:min-h-[500px] lg:min-h-[600px]`
- `object-cover` cho image fill container

**Line 429-471:** Centered layout (imagePos top/bottom)
- Removed `!slide.mediaOnly` conditionals
- Clean text content rendering

**Line 472-530:** Side-by-side layout
- Added `slide.mediaOnly` check BEFORE grid layout
- Removed nested conditionals
- Clean separation of concerns

## 🎯 Result

### Media Only Mode (mediaOnly: true)
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│          FULL IMAGE             │
│         (100% width)            │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Normal Mode (mediaOnly: false)
```
┌────────────┬────────────┐
│            │            │
│   Text     │   Image    │
│  Content   │            │
│            │            │
└────────────┴────────────┘
```

## ⚡ Technical Highlights (Senior Code)

1. **Early Return Pattern**: Check `slide.mediaOnly` FIRST để tránh nested conditionals
2. **Dynamic Classes**: Conditional classes cho container/image sizing
3. **Responsive Heights**: `min-h-[400px] md:min-h-[500px] lg:min-h-[600px]`
4. **Object-fit**: `object-cover` giữ aspect ratio khi fill container
5. **Zero Padding**: `p-0` trong Media Only mode cho edge-to-edge image

## 🚀 Testing

1. Navigate: http://localhost:12000/admin/pagebuilder
2. Add Carousel Block
3. Enable "Media Only Mode" toggle
4. ✅ Verify: 
   - Only image visible (no text)
   - Image full-width (100% viewport)
   - Responsive trên mobile/tablet/desktop
   - No padding/margin around image

## 📊 Status

- ✅ Frontend: http://localhost:12000 (Running)
- ✅ TypeScript: 0 errors
- ✅ HMR: Working (Next.js 16 + React 19)
- ✅ Media Only Mode: Fixed
