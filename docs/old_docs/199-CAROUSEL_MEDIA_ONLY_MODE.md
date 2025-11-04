# Carousel Media Only Mode - Show Media Type

## Thay đổi đã thực hiện

### 1. **SlideEditorDialog.tsx** - Thêm "Show Media Only" Toggle

#### ✅ Thêm Switch Component Import
```typescript
import { Switch } from '@/components/ui/switch';
```

#### ✅ Thêm thuộc tính `mediaOnly` vào Interface
```typescript
interface CarouselSlide {
  // ... existing fields
  mediaOnly?: boolean; // Show only media, hide all text content
}
```

#### ✅ Thêm Toggle Control trong Media Tab
**Position**: Đầu tiên trong Media tab (trước Media Type Selection)

**Features**:
- 🎯 Toggle switch "Show Media Only"
- Purple gradient background để nổi bật
- Description rõ ràng về chức năng
- Active state indicator khi được bật
- Visual feedback với color-coded UI

#### ✅ Warning trong Content Tab
Khi `mediaOnly = true`, hiển thị warning ở Content tab:
- ⚠️ Amber alert box
- Thông báo content sẽ bị ẩn
- Hướng dẫn cách disable mode

### 2. **CarouselBlock.tsx** - Áp dụng Media Only Logic

#### ✅ Thêm `mediaOnly` vào Interface
```typescript
interface CarouselSlide {
  // ... existing fields
  mediaOnly?: boolean;
}
```

#### ✅ Conditional Rendering cho Text Content
**Top/Bottom Layout**:
```typescript
{!slide.mediaOnly && (
  <div className={`${slideTextColor} space-y-4 text-center`}>
    {/* All text content: badge, title, subtitle, description, CTA */}
  </div>
)}
```

**Left/Right Layout**:
```typescript
{!slide.mediaOnly && (
  <div className={`${slideTextColor} space-y-4 ${imagePos === 'left' ? 'md:order-2' : ''}`}>
    {/* All text content */}
  </div>
)}
```

#### ✅ Enhanced Image Display khi Media Only
```typescript
<div className={`${slide.mediaOnly ? 'w-full' : 'hidden md:block'} ...`}>
  <div className={`w-full ${slide.mediaOnly ? 'h-96 md:h-[500px]' : 'h-64 md:h-80 lg:h-96'} ...`}>
    <img ... />
  </div>
</div>
```

**Khi mediaOnly = true**:
- Image width: `w-full` (full width)
- Image height: `h-96 md:h-[500px]` (larger)
- No text content displayed
- Pure media showcase

**Khi mediaOnly = false** (default):
- Normal layout với text & image
- Responsive grid layout
- All content visible

## Cấu trúc UI mới

### Edit Slide - Media Tab

```
┌─────────────────────────────────────────┐
│ 🎯 Show Media Only              [Toggle]│
│ Display only media - hide all text      │
│ ✓ Media Only Mode Active (khi bật)     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Media Type                               │
│ 📷 Image / 🎬 Video / 📺 Embed          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📚 Media Type Guide                     │
│ - Image: Static images...               │
│ - Video URL: Direct video...            │
│ - Embed: YouTube/Vimeo...               │
└─────────────────────────────────────────┘

[Dynamic Media Fields based on type]
```

### Edit Slide - Content Tab

```
┌─────────────────────────────────────────┐
│ ⚠️ Media Only Mode Active               │
│ Content below will be hidden.           │
│ Go to Media tab to disable.             │
└─────────────────────────────────────────┘

[Badge, Title, Subtitle, Description, CTA]
(Grayed out/disabled appearance when mediaOnly)
```

## Chức năng Media Only Mode

### Khi mediaOnly = false (Default)
✅ Hiển thị đầy đủ:
- Badge
- Title
- Subtitle
- Description
- Call to Action button
- Image/Video với layout options

### Khi mediaOnly = true
✅ Chỉ hiển thị:
- Media (Image/Video/Embed)
- Background color (nếu có)

❌ Ẩn hoàn toàn:
- Badge
- Title
- Subtitle  
- Description
- Call to Action

🎨 Enhanced display:
- Full width media
- Larger image height (500px vs 384px)
- No grid layout, pure media

## Use Cases

### 1. **Gallery/Portfolio Carousel**
```typescript
slide = {
  mediaOnly: true,
  image: 'portfolio-image.jpg',
  imagePosition: 'background'
}
```
→ Pure image showcase, no text distraction

### 2. **Video Showcase**
```typescript
slide = {
  mediaOnly: true,
  mediaType: 'embed',
  videoUrl: 'youtube.com/...'
}
```
→ Full-screen video presentation

### 3. **Product Images Only**
```typescript
slide = {
  mediaOnly: true,
  image: 'product.jpg'
}
```
→ Clean product photography without text overlay

### 4. **Regular Slide with Content** (Default)
```typescript
slide = {
  mediaOnly: false, // or undefined
  title: 'Product Name',
  description: '...',
  image: 'product.jpg',
  cta: { text: 'Buy Now', link: '/product' }
}
```
→ Full marketing slide with text & media

## Benefits

### 1. **Flexibility** 🎯
- Mỗi slide có thể chọn riêng mediaOnly mode
- Mix & match: có slide có text, có slide chỉ media
- Perfect cho different content types

### 2. **Clean UI** ✨
- Media-only slides có presentation tốt hơn
- No text clutter cho gallery/portfolio
- Professional appearance

### 3. **User Control** 👤
- Toggle đơn giản trong Edit Slide
- Visual feedback rõ ràng
- Warning khi content bị ẩn

### 4. **Responsive** 📱
- Media-only slides scale tốt hơn
- Full width/height trên mobile
- Better performance (less DOM elements)

## Technical Implementation

### State Management
```typescript
const [localSlide, setLocalSlide] = useState(slide);

// Toggle mediaOnly
<Switch
  checked={localSlide.mediaOnly || false}
  onCheckedChange={(checked) =>
    setLocalSlide({ ...localSlide, mediaOnly: checked })
  }
/>
```

### Conditional Rendering
```typescript
// Hide all text content
{!slide.mediaOnly && (
  <div>
    {/* Text content */}
  </div>
)}

// Enhanced media display
<div className={slide.mediaOnly ? 'w-full' : 'hidden md:block'}>
  <img ... />
</div>
```

## Kết quả

✅ **Feature Complete**: Show Media Only mode hoàn chỉnh
✅ **UI/UX**: Clear toggle với visual feedback
✅ **Flexible**: Per-slide control
✅ **Clean**: Pure media presentation khi enabled
✅ **Warning**: User awareness trong Content tab
✅ **Responsive**: Enhanced display cho media-only mode
✅ **Professional**: Gallery-quality presentation option

## Note

- Media Only mode là **optional** - default là `false`
- Mỗi slide độc lập - có thể có slide có text, slide không có text
- Content vẫn được lưu - chỉ ẩn khi render
- User có thể toggle on/off bất cứ lúc nào
- Perfect cho portfolio, gallery, product showcase carousels
