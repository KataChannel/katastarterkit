# Carousel Slide Content - Quick Reference

## New Slide Modes

### 1️⃣ Image Only Mode
**When:** You want to show only the image without any text

**How to Enable:**
1. Edit a carousel slide
2. Go to "Media" tab
3. Check "Image Only Mode"
4. Save

**Result:** Slide displays full image, all text is hidden

**Best For:**
- Image galleries
- Photo showcases
- Clean visual presentations

---

### 2️⃣ Fullscreen Image Layout
**When:** You want background image with text overlay

**How to Enable:**
1. Edit a carousel slide
2. Go to "Media" tab
3. Image Position → Select "Fullscreen"
4. Adjust Image Overlay (optional) - darkness level
5. Add your title, subtitle, description
6. Save

**Result:** 
- Full-width background image
- Text centered and overlaid
- Dark overlay for text readability

**Best For:**
- Hero slides
- Promotional images
- Immersive experiences
- Banner slides

**Overlay Darkness:**
- 0% = No overlay (transparent)
- 50% = Medium darkness (default)
- 100% = Full black

---

### 3️⃣ Animation Effects
**When:** You want slide transitions to have effects

**How to Set:**
1. Edit a carousel slide
2. Go to "Styling" tab
3. Animation dropdown
4. Choose: None, Fade, Slide, or Zoom
5. Save

**Animation Types:**
- **None** - Instant change (no animation)
- **Fade** - Slide fades in smoothly
- **Slide** - Slide slides in from side
- **Zoom** - Slide zooms in smoothly

**Best For:**
- Smooth transitions
- Professional appearance
- User engagement

---

## Image Position Options

| Position | Description | Text Position | Use Case |
|----------|-------------|---------------|----------|
| **Left** | Image on left, text on right | Right column | Text-first content |
| **Right** | Image on right, text on left | Left column | Image-first content |
| **Top** | Image above text | Below image | Vertical layout |
| **Bottom** | Image below text | Above image | Vertical layout (text first) |
| **Background** | Image as background | Overlaid on image | Dark overlay image |
| **Fullscreen** | Image fills entire slide | Centered overlay | Hero/banner slides |

---

## Combining Features

### Example: Photo Gallery Slide
```
Image Only Mode: ✓ Checked
Image Position: Left (ignored due to image-only)
Animation: Fade
Result: Full-screen image with fade transition
```

### Example: Product Hero Slide
```
Image Only Mode: ✗ Unchecked
Image Position: Fullscreen
Image Overlay: 40%
Title: "New Product Launch"
Animation: Zoom
Result: Full-width hero with centered text and zoom effect
```

### Example: Standard Slide
```
Image Only Mode: ✗ Unchecked
Image Position: Right
Animation: Slide
Title, Description, CTA: All filled
Result: Standard slide with image on right, text on left
```

---

## Settings by Tab

### 📄 Content Tab
- Badge
- Title
- Subtitle
- Description
- Call to Action (button text & link)

### 🖼️ Media Tab (NEW FEATURES HERE)
- **Image URL** - Upload or link image
- **Image Position** - Layout option (NEW: Fullscreen)
- **Image Only Mode** - Hide all text (NEW)
- **Image Overlay** - Darkness (only for background/fullscreen)

### 🎨 Styling Tab
- Background Color
- Text Color
- **Animation** - Transition effect (NOW ENABLED)

---

## Tips & Best Practices

✅ **Do's:**
- Use image-only mode for photo galleries
- Use fullscreen for hero/promotional slides
- Test animations on different devices
- Use overlay 30-50% for text readability
- Add CTA buttons for user engagement

❌ **Don'ts:**
- Don't hide text if it's important (use image-only)
- Don't use fullscreen without an image
- Don't use 100% overlay (completely black, unreadable)
- Don't forget to add title when using fullscreen
- Don't use complex images with tiny text overlay

---

## Common Issues & Solutions

**Issue:** Text is hard to read on fullscreen
**Solution:** Increase Image Overlay (0-100) to 40-60%

**Issue:** Image not showing in image-only mode
**Solution:** Check Image URL is valid in Media tab

**Issue:** Animation not visible
**Solution:** Animation support depends on carousel settings

**Issue:** Text positions wrong on fullscreen
**Solution:** Fullscreen always centers text - use regular position if you need custom alignment

---

## Feature Compatibility Matrix

| Feature | Works With | Notes |
|---------|-----------|-------|
| Image Only | All positions | Only image shown |
| Fullscreen | No other pos | Overrides other settings |
| Animation | All modes | Independent feature |
| Overlay | Background, Fullscreen | Controls image darkness |
| Multi-item carousel | All modes | Applies per-slide |

---

## Default Values

When you create a new slide:
- Image Position: Right
- Image Only: Unchecked
- Animation: Slide
- Image Overlay: 50%
- Text Color: White
- Background: Blue-to-Purple gradient

---

## Advanced: Data Structure

```json
{
  "imagePosition": "fullscreen",  // or left, right, top, bottom, background
  "imageOnly": false,              // Show only image?
  "animation": "fade",             // or none, slide, zoom
  "imageOverlay": 40,              // 0-100% darkness
  "image": "https://...",          // Image URL
  "title": "Your Title",           // Shown in fullscreen overlay
  "description": "Your text"       // Shown in fullscreen overlay
}
```

---

## Support

For questions or issues:
1. Check image URL is accessible
2. Ensure image is appropriate size (large enough for fullscreen)
3. Test animation in preview mode
4. Verify text is visible with overlay setting
5. Check all text fields are filled if using fullscreen

