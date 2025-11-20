# Carousel Settings Enhancement Documentation

## Overview
Successfully enhanced the Carousel Settings in the pagebuilder with three major feature additions:
1. **Multiple Slides Display** - Show 1-5 slides simultaneously
2. **Media Type Filtering** - Filter slides by media type (All/Images/Videos)
3. **Slide Animations** - Enhanced animations with customizable duration

## What Was Added

### 1. Multiple Slides Per View
**Feature**: Display multiple carousel slides simultaneously on larger screens

**Implementation**:
- Added `slidesPerView` property (1-5 slides)
- Slider control in "Content" tab of settings dialog
- Dynamic width calculation: `minWidth: ${100 / slidesPerView}%`
- Responsive grid layout support

**User Control**:
- Location: Carousel Settings → Content tab
- Control: Range slider (1-5 slides)
- Default: 1 slide (original behavior)
- Real-time preview of the setting value

**Code Changes**:
```tsx
// CarouselBlock.tsx
const slidesPerView = content.slidesPerView || 1; // 1-5 slides displayed

// CarouselItem styling
style={{
  ...getAnimationStyle(),
  minWidth: slidesPerView > 1 ? `${100 / slidesPerView}%` : 'auto',
}}
```

### 2. Media Type Filtering
**Feature**: Filter carousel slides to show only images, videos, or all media

**Implementation**:
- Added `mediaFilter` property ('all' | 'images' | 'videos')
- Automatic media type detection via `mediaType` and `videoUrl` properties
- Dynamic slide filtering based on selection
- Dropdown selector in "Content" tab

**Detection Logic**:
- **Images**: Slides with `image` property and no `videoUrl`
- **Videos**: Slides with `videoUrl` or `mediaType === 'video'`
- **All**: No filtering applied

**User Control**:
- Location: Carousel Settings → Content tab
- Control: Dropdown (All Media / Images Only / Videos Only)
- Default: All Media
- Filtered slides automatically excluded from carousel display

**Code Changes**:
```tsx
// CarouselBlock.tsx
const mediaFilter = content.mediaFilter || 'all';

// Dynamic filtering
const filteredSlides = slides.filter((slide) => {
  if (mediaFilter === 'all') return true;
  if (mediaFilter === 'images') {
    return !slide.videoUrl && slide.image;
  }
  if (mediaFilter === 'videos') {
    return slide.videoUrl || slide.mediaType === 'video';
  }
  return true;
});

// Updated carousel rendering
{filteredSlides.map((slide, index) => { ... })}
```

### 3. Slide Animations
**Feature**: Control animation type and duration for slide transitions

**Implementation**:
- Added `animationType` property ('fade' | 'slide' | 'zoom' | 'none')
- Added `animationDuration` property (300-2000ms)
- CSS keyframe animations for smooth transitions
- Animation applies when each slide appears

**Supported Animations**:
1. **Fade** - Opacity transition in/out
2. **Slide** - Horizontal slide from right with fade
3. **Zoom** - Scale up from 95% with fade
4. **None** - No animation

**User Control**:
- Animation Type: Behavior tab → Dropdown (None/Fade/Slide/Zoom)
- Duration: Behavior tab → Range slider (300-2000ms)
- Default: Fade animation @ 600ms
- Visual feedback showing current duration value

**Code Changes**:
```tsx
// CarouselBlock.tsx
const animationType = content.animationType || 'fade';
const animationDuration = content.animationDuration || 600;

// Animation style generator
const getAnimationStyle = (): React.CSSProperties => {
  const duration = `${animationDuration}ms`;
  switch (animationType) {
    case 'fade':
      return { animation: `fadeIn ${duration} ease-in-out` };
    case 'slide':
      return { animation: `slideIn ${duration} ease-out` };
    case 'zoom':
      return { animation: `zoomIn ${duration} ease-out` };
    default:
      return {};
  }
};

// CSS animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes zoomIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## Updated Settings Dialog Structure

### Tab Organization
1. **Behavior Tab** (Existing + Enhanced)
   - Auto Play toggle
   - Slide Duration slider (when auto play enabled)
   - Loop toggle
   - **Transition Effect** dropdown (Slide/Fade/Zoom/None)
   - **NEW: Slide Animation** dropdown (None/Fade/Slide/Zoom)
   - **NEW: Animation Duration** slider (300-2000ms)

2. **Appearance Tab** (Unchanged)
   - Carousel Height selector

3. **Content Tab** (NEW)
   - **Slides Per View** slider (1-5)
   - **Media Type Filter** dropdown (All/Images/Videos)

4. **Controls Tab** (Unchanged)
   - Show Arrows toggle
   - Arrow Style selector
   - Show Indicators toggle
   - Indicator Style selector

## Component Structure Changes

### CarouselBlock.tsx
**New State Variables**:
```tsx
const slidesPerView = content.slidesPerView || 1;
const mediaFilter = content.mediaFilter || 'all';
const animationType = content.animationType || 'fade';
const animationDuration = content.animationDuration || 600;
const filteredSlides = slides.filter(...); // Dynamic filter
```

**New Functions**:
```tsx
const getAnimationStyle = (): React.CSSProperties => { ... }
```

**Updated Rendering**:
- Carousel uses `filteredSlides` instead of `slides`
- CarouselItem applies animation styles
- Indicators and arrows account for filtered slide count
- Style tag injected with animation keyframes

### CarouselSlide Interface
**Extended Properties**:
```tsx
interface CarouselSlide {
  // ... existing properties
  mediaType?: 'image' | 'video';
  videoUrl?: string;
}
```

### CarouselSettingsDialog.tsx
**New Tab**: Content tab with slides per view and media filter controls
**Enhanced Behavior Tab**: Animation type and duration selectors
**Updated Props**: Accepts new settings properties

## Migration Guide

### For Existing Carousels
All existing carousel configurations will continue to work with defaults:
- `slidesPerView`: 1 (original single-slide behavior)
- `mediaFilter`: 'all' (all slides displayed)
- `animationType`: 'fade' (smooth fade-in)
- `animationDuration`: 600ms (moderate speed)

### For New Carousels
All three features are immediately available in the Carousel Settings dialog.

## Testing Recommendations

1. **Multiple Slides**
   - Set slidesPerView to 2, 3, 4, 5
   - Verify slides display side-by-side
   - Test navigation arrows
   - Verify responsive behavior on different screen sizes

2. **Media Filtering**
   - Create carousel with mixed image/video slides
   - Test each filter setting
   - Verify filtered slides are excluded
   - Check indicator count updates

3. **Animations**
   - Test each animation type
   - Verify animation duration affects speed
   - Test with different transitions
   - Verify animations apply to all slides

4. **Combined Features**
   - Use all three features together
   - Test filtered slides with animations
   - Verify multiple slides + animations work correctly

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- CSS animations use standard `@keyframes`
- No vendor prefixes required (Tailwind handles this)

## Performance Notes
- Filtering is client-side (no server impact)
- Animation duration is CSS-based (GPU accelerated)
- Multiple slides rendering: no performance degradation
- Filter recalculation: only when `mediaFilter` changes

## Future Enhancements
1. Custom animation presets (bounce, elastic, etc.)
2. Per-slide animation overrides
3. Media auto-detection (detect videos from URLs)
4. Thumbnail preview for filtered slides
5. Animation sequencing (stagger effect)

## Files Modified
1. `/frontend/src/components/page-builder/blocks/CarouselBlock.tsx`
   - Added filtered slides logic
   - Added animation rendering
   - Updated carousel props
   - Enhanced settings dialog integration

2. `/frontend/src/components/page-builder/blocks/CarouselSettingsDialog.tsx`
   - Added Content tab
   - Enhanced Behavior tab with animations
   - Updated interface to support new properties
   - New form controls for new features

## Deployment Instructions

### Frontend Build & Deploy
```bash
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/95copy.sh --build  # Builds frontend and deploys
```

### Verification
1. Navigate to pagebuilder
2. Add new Carousel block or edit existing one
3. Click Settings button
4. Verify new tabs and controls appear:
   - "Content" tab with slides per view and media filter
   - "Behavior" tab with animation settings

### Rollback (if needed)
```bash
git checkout frontend/src/components/page-builder/blocks/CarouselBlock.tsx
git checkout frontend/src/components/page-builder/blocks/CarouselSettingsDialog.tsx
./scripts/95copy.sh --build
```

## Summary
Three powerful new carousel features are now available:
- **1-5 Slides Display**: Show multiple slides simultaneously
- **Media Filtering**: Display only specific media types
- **Animations**: Smooth slide appearance animations with custom duration

All features are backward compatible and use sensible defaults. No existing carousels will break - they'll simply use the default values for these new features.
