# Carousel Items Per Slide Customization - Implementation Complete

## Overview
Successfully added the ability to customize how many carousel items display per slide (1-6 items). Users can now configure carousel blocks to show multiple items side-by-side.

## Files Modified

### 1. CarouselSettingsDialog.tsx
**Location:** `/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/blocks/CarouselSettingsDialog.tsx`

**Changes:**
- Updated `CarouselSettingsDialogProps` interface to include `itemsPerSlide?: number` in settings
- Added new "Items Per Slide" control in the "Appearance" tab
- Created 6 preset buttons (1-6 items) with visual feedback
  - Selected button: Blue border, blue background, bold text
  - Unselected: Gray border, white background
  - Current value displayed in header
- Added helper text: "Number of items to display in one slide. Use more items for gallery-style carousels."

**UI Features:**
- Quick selection with 6 preset buttons
- Live value display (shows currently selected number)
- Color-coded visual feedback for active selection
- Smooth transitions on button hover

### 2. CarouselBlock.tsx
**Location:** `/chikiet/kataoffical/shoprausach/frontend/src/components/page-builder/blocks/CarouselBlock.tsx`

**Changes:**
- Extracted `itemsPerSlide` from content with default value of 1
- Added `getItemBasisClass()` function that maps itemsPerSlide to Tailwind basis classes:
  - 1 item: `basis-full` (100% width)
  - 2 items: `basis-1/2` (50% width)
  - 3 items: `basis-1/3` (33.3% width)
  - 4 items: `basis-1/4` (25% width)
  - 5 items: `basis-1/5` (20% width)
  - 6 items: `basis-1/6` (16.67% width)
- Applied `getItemBasisClass()` to each CarouselItem element
- Updated CarouselSettingsDialog props to include `itemsPerSlide` in settings object

**How It Works:**
1. User clicks "Settings" button on carousel
2. Opens CarouselSettingsDialog
3. User selects items per slide (1-6) in "Appearance" tab
4. Selected value is saved to carousel content
5. CarouselBlock extracts the value and calculates appropriate basis class
6. Each CarouselItem is rendered with correct width based on itemsPerSlide
7. Embla Carousel handles proper scrolling and layout

## How to Use

### For End Users:
1. Add a Carousel block to a page
2. Click the "Settings" button (gear icon)
3. Go to the "Appearance" tab
4. Click the desired number in "Items Per Slide" (1-6)
5. Click "Save Settings"
6. Carousel will now display that many items side-by-side

### For Developers:
The feature stores `itemsPerSlide` as a number in the carousel content:
```typescript
{
  slides: [...],
  autoPlay: true,
  itemsPerSlide: 3,  // New property
  // ... other settings
}
```

## Technical Details

### Responsive Width Calculation
- Uses Tailwind CSS basis classes for responsive sizing
- No hardcoded pixels - scales with container
- Works seamlessly with existing carousel styling

### Default Behavior
- If `itemsPerSlide` is not set, defaults to 1 (full-width slides)
- Backward compatible with existing carousels
- Existing carousel blocks continue to work without changes

### Browser Compatibility
- Uses standard CSS flexbox layout
- Works in all modern browsers supporting flexbox
- Embla Carousel handles all scrolling logic

## Testing Checklist

✅ **Implemented Features:**
- [x] Added itemsPerSlide control to settings dialog
- [x] Created preset buttons (1-6 items)
- [x] Visual feedback for selected value
- [x] Extracted itemsPerSlide from content in CarouselBlock
- [x] Created basis class mapper function
- [x] Applied basis classes to CarouselItem elements
- [x] Passed itemsPerSlide through settings dialog

✅ **Tested Scenarios:**
- [x] Single item per slide (1) - shows full width
- [x] Multiple items per slide (2-6) - shows correct widths
- [x] Navigation arrows still work with multiple items
- [x] Indicators display correctly
- [x] Auto-play functionality preserved
- [x] Existing carousels maintain backward compatibility

## Example Use Cases

### Gallery View
- Set to 4 items per slide to create a 4-column gallery
- Great for product showcases or portfolio displays

### Related Items
- Set to 3 items per slide
- Display 3 related products or articles at once

### Testimonials/Reviews
- Set to 2 items per slide
- Show multiple testimonials side-by-side

### Full Width Hero
- Keep default (1 item per slide)
- Traditional carousel experience

## Code Architecture

```
CarouselBlock.tsx
├── Extract itemsPerSlide from content (default: 1)
├── getItemBasisClass() → Maps number to Tailwind class
├── Carousel component
│   └── CarouselItem[] (each with appropriate basis class)
└── CarouselSettingsDialog
    └── Items Per Slide control in Appearance tab
        └── 6 preset buttons (1-6)
```

## Future Enhancement Opportunities

1. **Responsive Presets**: Different items per slide at different breakpoints
2. **Gap Control**: Customize spacing between items
3. **Item Sizing**: Individual item width control instead of equal distribution
4. **Auto-scroll Speed**: Adjust speed based on number of items
5. **Preset Templates**: Save and reuse common configurations

## Related Components

- **Carousel UI Component** (`carousel.tsx`): Embla-based carousel wrapper
- **CarouselItem**: Flex-basis controlled individual slide element
- **SlideEditorDialog**: Edits individual slide content
- **CarouselSettingsDialog**: Edits carousel behavior and appearance

## Notes

- The feature integrates seamlessly with existing carousel functionality
- No breaking changes to existing carousel blocks
- All carousel settings (auto-play, indicators, arrows) work with multiple items per slide
- Responsive design adapts to container size, not fixed pixel widths
