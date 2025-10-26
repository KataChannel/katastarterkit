# Developer Reference - Carousel Slide Enhancements

## Quick Navigation

- **CarouselBlock.tsx** - Main rendering logic, lines 13-697
  - Lines 13-30: Updated CarouselSlide interface
  - Lines 332-387: Image-only mode rendering
  - Lines 421-477: Fullscreen layout logic

- **SlideEditorDialog.tsx** - UI editor, lines 1-360
  - Lines 17-31: Updated CarouselSlide interface
  - Lines 195-219: Image Position dropdown + Fullscreen option
  - Lines 221-238: Image Only Mode checkbox
  - Lines 322-342: Animation dropdown (enabled)

## Key Functions & Logic

### Image Only Mode Detection
```typescript
// In CarouselBlock.tsx, slides.map() loop
if (slide.imageOnly && slide.image) {
  // Render full-screen image only
  return <CarouselItem>...</CarouselItem>;
}
// Otherwise render normal slide
return <CarouselItem>...</CarouselItem>;
```

### Fullscreen Image Rendering
```typescript
// In normal slide rendering
{imagePos === 'fullscreen' && slide.image ? (
  /* Full background image with overlay */
  <div>Background + overlay + centered text</div>
) : (
  /* Normal layout */
  <div>Top/Bottom/Left/Right/Background layouts</div>
)}
```

### Animation Storage
```typescript
// Animation is stored as a string in slide data
animation?: 'fade' | 'slide' | 'zoom' | 'none'

// Can be used later for actual CSS animations
// Currently stored but rendering not implemented
```

## New Type Definitions

### CarouselSlide Interface Changes
```typescript
// OLD
imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background'

// NEW
imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background' | 'fullscreen'

// NEW PROPERTY
imageOnly?: boolean
```

## CSS Classes Used

### Fullscreen Layout
- `w-full h-full` - Fill container
- `absolute inset-0` - Background positioning
- `bg-cover bg-center` - Background image sizing
- `relative z-10` - Text layer above image
- `flex items-center justify-center` - Center text
- `text-6xl font-bold` - Large title
- `drop-shadow-lg` - Text shadows for readability
- `text-white` - White text color

### Image Only Mode
- `w-full h-full` - Full-screen image
- `object-cover` - Image sizing
- No text content

## Data Flow

### Creating a Fullscreen Slide
```
User opens slide editor
  ↓
Selects "Fullscreen" from Image Position dropdown
  ↓
CarouselBlock updates imagePosition to 'fullscreen'
  ↓
On render, imagePos === 'fullscreen' check triggers
  ↓
Fullscreen layout renders with background image + overlay
  ↓
onUpdate callback saves: { ...content, imagePosition: 'fullscreen' }
```

### Creating an Image-Only Slide
```
User checks "Image Only Mode" checkbox
  ↓
SlideEditorDialog updates imageOnly to true
  ↓
On render, slide.imageOnly check triggers
  ↓
Early return from slides.map()
  ↓
Image-only layout renders
  ↓
onUpdate callback saves: { ...content, imageOnly: true }
```

## Conditional Rendering Logic

### Image Position Priority
```
IF imageOnly === true
  RENDER: Full-screen image only
ELSE IF imagePosition === 'fullscreen'
  RENDER: Background image + overlay text
ELSE IF imagePosition === 'top' OR 'bottom'
  RENDER: Vertical stack (image + text)
ELSE
  RENDER: 2-column grid (image + text side-by-side)
```

## Component Props

### CarouselBlock Props
```typescript
interface CarouselBlockProps {
  block: PageBlock;
  isEditing?: boolean;
  isEditable?: boolean;
  onUpdate?: (content: any, style?: any) => void;
  onDelete?: () => void;
}
```

### SlideEditorDialog Props
```typescript
interface SlideEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: CarouselSlide;
  onSave: (slide: CarouselSlide) => void;
}
```

## State Management

### SlideEditorDialog Local State
```typescript
const [localSlide, setLocalSlide] = useState(slide);

// When user changes any property:
setLocalSlide({ 
  ...localSlide, 
  propertyName: newValue 
});

// On save:
onSave(localSlide);  // Parent updates carousel
```

## Styling System

### Tailwind Classes Used
- **Layout**: `flex`, `grid`, `absolute`, `relative`, `w-full`, `h-full`
- **Sizing**: `text-6xl`, `text-3xl`, `text-xl`, `h-48`, `h-64`
- **Colors**: `text-white`, `bg-black`, `bg-gradient-to-r`
- **Effects**: `drop-shadow-lg`, `hover:scale-105`, `transition-transform`
- **Spacing**: `mb-4`, `px-4`, `py-12`, `space-y-4`, `gap-8`

## Edit Controls

### Available in All Modes
- Pencil icon: Edit slide
- Up/Down arrows: Reorder slides (when multiple)
- Trash icon: Delete slide (when multiple)

### Positioning
- Absolute positioned top-left
- Z-index 20 (above content)
- White background with shadow
- Always visible in edit mode

## Configuration Options

### Image Overlay Darkness
- Range: 0-100%
- Default: 40% (fullscreen), 50% (background)
- Controls black overlay opacity
- Only shown for background/fullscreen

### Animation Options
- `none` - No animation
- `fade` - Fade in effect
- `slide` - Slide in effect
- `zoom` - Zoom in effect
- Default: `slide`

### Image Positions
- `left` - Image left, text right
- `right` - Image right, text left (default)
- `top` - Image top, text bottom
- `bottom` - Image bottom, text top
- `background` - Image as background
- `fullscreen` - Full-screen image with overlay

## Error Handling

### Missing Image
- Image-only: Shows empty placeholder
- Fullscreen: Falls back to regular layout
- Other modes: Text shows without image

### Missing Text
- Any mode: Text conditionally renders if exists
- No error thrown
- Layout adapts gracefully

## Performance Considerations

- Image-only mode returns early (no layout computation)
- Fullscreen uses CSS background (efficient)
- No heavy JavaScript animations
- CSS-based rendering (GPU accelerated)

## Backward Compatibility

### Default Values
- `imageOnly`: undefined → treats as false
- `animation`: undefined → treats as 'slide'
- `imagePosition`: undefined → treats as 'right'

### Migration Path
Old carousel data:
```json
{
  "imagePosition": "right",
  "title": "My Slide"
}
```

New carousel data (auto-compatible):
```json
{
  "imagePosition": "right",
  "imageOnly": false,
  "animation": "slide",
  "title": "My Slide"
}
```

## Testing Checklist

### Functionality Tests
- [ ] Image-only mode hides text
- [ ] Fullscreen positions background correctly
- [ ] Text centers on fullscreen image
- [ ] Overlay darkness adjusts 0-100%
- [ ] Animation dropdown selects correctly
- [ ] Edit controls show in all modes
- [ ] All positions render correctly

### Edge Cases
- [ ] Missing image URL
- [ ] Empty text fields
- [ ] Very long titles
- [ ] Small images
- [ ] Very dark images
- [ ] Multiple items per slide

### UI/UX Tests
- [ ] Controls are clickable
- [ ] Changes save correctly
- [ ] Preview updates on change
- [ ] Mobile responsiveness
- [ ] Tab navigation works

## Future Enhancements

1. **Animation Implementation**
   - Add CSS keyframe animations
   - Or use animation library
   - Control animation duration

2. **Image Optimization**
   - Lazy load images
   - Responsive image sizes
   - Image blur/filter effects

3. **Text Controls**
   - Custom text positioning
   - Text alignment options
   - Background text panels

4. **Advanced Features**
   - Video backgrounds
   - Gradient overlays
   - Pattern overlays
   - Custom animations

## Quick Fixes

### Animation not showing?
- Check CarouselBlock passes animation value
- Check SlideEditorDialog saves animation
- Animation rendering not yet implemented

### Fullscreen text not readable?
- Increase Image Overlay (0-100%)
- Recommended: 30-60%
- Or adjust text color to black

### Image not showing in image-only?
- Verify Image URL is valid
- Check image accessibility
- Ensure URL returns actual image

### Edit controls not visible?
- Check isEditable/isEditing prop
- Check z-index (should be 20)
- Check editMode variable

