# Carousel Items Per Slide Feature - Quick Reference

## What's New
Users can now customize how many carousel items display per slide (1-6 items), enabling gallery-style carousels, product showcases, and multi-column layouts.

## User-Facing Changes

### Settings Dialog Enhancement
- **Tab:** Appearance
- **New Control:** "Items Per Slide"
- **Options:** 6 preset buttons (1, 2, 3, 4, 5, 6)
- **Visual Feedback:** Selected button highlights in blue
- **Current Value:** Displayed in header next to label

### Carousel Display
- Items display side-by-side at specified count
- Width automatically adjusts (1→100%, 2→50%, 3→33%, etc.)
- All carousel features work with multiple items:
  - Auto-play ✓
  - Navigation arrows ✓
  - Indicators (dots, lines, numbers, thumbnails) ✓
  - Loop behavior ✓

## Technical Implementation

### Modified Files

**1. CarouselSettingsDialog.tsx**
```typescript
// Added to interface
itemsPerSlide?: number;

// Added to Appearance tab
<div className="space-y-2">
  <Label>Items Per Slide</Label>
  {[1, 2, 3, 4, 5, 6].map((num) => (
    <button onClick={() => setLocalSettings({...localSettings, itemsPerSlide: num})}>
      {num}
    </button>
  ))}
</div>
```

**2. CarouselBlock.tsx**
```typescript
// Extract itemsPerSlide (default: 1)
const itemsPerSlide = content.itemsPerSlide || 1;

// New function: Map number to Tailwind basis class
const getItemBasisClass = () => {
  switch (itemsPerSlide) {
    case 2: return 'basis-1/2';
    case 3: return 'basis-1/3';
    case 4: return 'basis-1/4';
    case 5: return 'basis-1/5';
    case 6: return 'basis-1/6';
    default: return 'basis-full';
  }
};

// Apply to CarouselItem
<CarouselItem className={`h-full ${getItemBasisClass()}`}>
```

## How to Use

1. Edit a page with a carousel block
2. Click "Settings" (gear icon) on carousel
3. Go to "Appearance" tab
4. Click desired number in "Items Per Slide"
5. Click "Save Settings"
6. Carousel updates to display that many items per slide

## Default Behavior
- New carousels: 1 item per slide (traditional carousel)
- Existing carousels: Maintain 1 item per slide (backward compatible)
- Can be changed anytime via settings

## Responsive Design
- Uses Tailwind CSS basis classes (not hardcoded pixels)
- Automatically scales with container width
- Works on all breakpoints
- Maintains aspect ratios

## Storage Format
```json
{
  "slides": [...],
  "autoPlay": true,
  "itemsPerSlide": 3,  // ← New property
  "autoPlayInterval": 5000,
  "showIndicators": true,
  "showArrows": true,
  "loop": true,
  "height": "md"
}
```

## Use Cases

| Use Case | Items Per Slide | Result |
|----------|-----------------|---------|
| Hero Carousel | 1 | Full-width slides |
| Product Grid | 4 | 4-column layout |
| Testimonials | 2 | Side-by-side reviews |
| Image Gallery | 3 | 3-column gallery |
| Related Items | 5 | 5-item showcase |

## Browser Support
✓ Modern browsers supporting flexbox CSS
✓ All devices and screen sizes
✓ Mobile, tablet, desktop responsive

## Future Possibilities
- Responsive presets (different items per slide at different breakpoints)
- Gap customization between items
- Custom item widths
- Preset configuration templates

## Version Info
- **Feature Added:** Current Session
- **Files Modified:** 2
- **Breaking Changes:** None
- **Backward Compatible:** Yes
