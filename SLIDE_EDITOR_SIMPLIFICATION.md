# Slide Editor Simplification - Media Only

## Thay đổi đã thực hiện

### SlideEditorDialog.tsx - Đơn giản hóa hoàn toàn

#### ✅ Bỏ Content Tab
- Xóa tab "Content" hoàn toàn
- Bỏ tất cả text fields: Title, Subtitle, Description
- Bỏ Badge field
- Bỏ CTA (Call to Action) fields
- Bỏ import Textarea component (không còn dùng)

#### ✅ Simplified Interface
**Trước** (10 fields):
```typescript
interface CarouselSlide {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'embed';
  cta?: { text: string; link: string; };
  badge?: string;
  bgColor?: string;
  textColor?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background';
  imageOverlay?: number;
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
}
```

**Sau** (6 fields - chỉ media):
```typescript
interface CarouselSlide {
  id: string;
  image?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video' | 'embed';
  bgColor?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background';
  imageOverlay?: number;
}
```

#### ✅ Reduced Tabs
- **Trước**: 3 tabs (Content, Media, Styling)
- **Sau**: 2 tabs (Media, Styling)
- Default tab: Media

#### ✅ Bỏ Styling Options không cần thiết
- Bỏ Text Color selector
- Bỏ Animation selector
- Chỉ giữ Background Color (cho slide không có background image)

## Cấu trúc mới - Media Focused

### Tab 1: Media ⭐ (Default)
**Media Type Selection**
- 📷 Image
- 🎬 Video URL
- 📺 Video Embed (YouTube/Vimeo)

**Dynamic Fields theo Media Type:**

**Nếu Image:**
- Image URL input + preview
- Image Position (Left/Right/Top/Bottom/Background)
- Image Overlay slider (khi position = background)

**Nếu Video/Embed:**
- Video URL input
- Auto-detection cho embeds

**Sections:**
- 📚 Media Type Guide với icons
- ✓ Current Configuration summary
- 💡 Tips & Recommendations

### Tab 2: Styling
- Background Color selector với preview
- Note về khi nào background color hiển thị

## Lợi ích

### 1. Đơn giản hóa UX
- ✅ Focus vào media only - đúng với mục đích carousel
- ✅ Ít field hơn → dễ sử dụng hơn
- ✅ Không còn confusion về content vs media
- ✅ Faster workflow

### 2. Clean Interface
- 3 tabs → 2 tabs
- 10 fields → 6 fields
- Removed unused components (Textarea, textColor, animation)

### 3. Performance
- Lighter interface với ít fields hơn
- Ít state management
- Smaller bundle size (removed Textarea import)

## UI/UX Improvements

### Visual Feedback
- 📷 🎬 📺 Icons cho media types
- ✓ Status indicators
- Color-coded sections
- Real-time preview cho images
- Configuration summary

### Smart Forms
- Conditional rendering dựa vào media type
- Chỉ show relevant fields
- Helpful guides & tips
- Clear descriptions

## Kết quả

✅ **Simplified**: 10 fields → 6 fields (40% reduction)
✅ **Focused**: Media only - no text content
✅ **Clean**: 3 tabs → 2 tabs
✅ **Fast**: Quicker editing workflow
✅ **Clear**: Rõ ràng mục đích - config media cho carousel
✅ **Modern**: Better visual design với icons & colors

## Note

Slide editor giờ chỉ cho phép config:
1. **Media** (hình hoặc video)
2. **Background color** (khi không dùng background image)
3. **Image position** (khi dùng image)
4. **Image overlay** (khi dùng background image)

Tất cả content text (title, subtitle, description, CTA, badge) đã được bỏ - carousel giờ là pure media carousel.
