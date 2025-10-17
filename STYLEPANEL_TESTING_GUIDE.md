# StylePanel Testing Guide - Quick Reference

## ✅ Testing Checklist

### Access the PageBuilder
1. Navigate to: `http://localhost:13000/admin/pagebuilder`
2. Login if required
3. Select an existing page or create a new one

### Test 1: Visual Spacing Editor ⭐
**Location**: StylePanel → 📐 Spacing section

- [ ] **Padding Controls**:
  - Click "Link" button (should toggle to unlinked mode)
  - Adjust top padding - verify all sides change (linked mode)
  - Click "Unlink" button
  - Adjust individual sides (top, right, bottom, left)
  - Click preset buttons: 0, 4, 8, 16, 24, 32
  - Verify box model updates in real-time (blue background)

- [ ] **Margin Controls**:
  - Repeat same tests with margin editor
  - Verify orange background color-coding
  - Check that margin and padding are independent

### Test 2: Advanced Color Picker ⭐
**Location**: StylePanel → 🎨 Colors section

- [ ] **Text Color**:
  - Click color preview box → opens popover
  - Drag on gradient square to select color
  - Adjust hue slider
  - Adjust opacity slider (0-100%)
  - Click preset color swatches
  - Type hex value manually (#FF0000)
  - Verify color updates on selected block

- [ ] **Background Color**:
  - Repeat all color picker tests
  - Test with opacity < 100%
  - Verify rgba output format

### Test 3: Border Editor ⭐
**Location**: StylePanel → 🔲 Border section

- [ ] **Border Properties**:
  - Adjust width (0-20px)
  - Change style: solid, dashed, dotted, double
  - Change border color using color picker

- [ ] **Border Radius**:
  - Verify live preview box shows current radius
  - Click "Link" mode - adjust one corner, all should change
  - Click "Unlink" mode - adjust corners independently
  - Click preset: 0, 4, 8, 12, 16, 24, 32, ∞ (pill shape)
  - Verify preview box updates with rounded corners

### Test 4: Layout Editor ⭐
**Location**: StylePanel → 🎨 Layout section

- [ ] **Display Modes**:
  - Switch between: Block, Flex, Grid, Inline-block
  - Verify UI changes for each mode

- [ ] **Flexbox Controls** (when display=flex):
  - Direction: row, column, row-reverse, column-reverse
  - Justify: flex-start, center, flex-end, space-between
  - Align: flex-start, center, flex-end, stretch
  - Wrap: nowrap, wrap, wrap-reverse
  - Gap: adjust number

- [ ] **Grid Controls** (when display=grid):
  - Click column presets: 1, 2, 3, 4, 6
  - Manually edit template string
  - Adjust gap

### Test 5: Typography ⭐
**Location**: StylePanel → ✍️ Typography section

- [ ] **Font Properties**:
  - Font size: 8-72px
  - Font weight: Thin, Light, Normal, Medium, Semibold, Bold, Extra Bold
  - Line height: 1-3 (decimal)
  - Text align: left, center, right, justify

### Test 6: Effects ⭐
**Location**: StylePanel → ✨ Effects section

- [ ] **Opacity**:
  - Slide 0-100%
  - Verify percentage label updates

- [ ] **Box Shadow**:
  - Select: None, Small, Medium, Large, Extra Large, 2XL
  - Verify shadow appears on block

### Test 7: Size Controls ⭐
**Location**: StylePanel → 📏 Size section

- [ ] **Dimensions**:
  - Width: auto, 100%, 300px
  - Height: auto, 100%, 300px
  - Min/Max width
  - Min/Max height

### Test 8: Breakpoint Selector ⭐
**Location**: Top of StylePanel

- [ ] **Responsive Modes**:
  - Click Mobile (📱 375px)
  - Click Tablet (📱 768px)
  - Click Desktop (🖥️ 1200px)
  - Verify active state highlights

### Test 9: Persistence ⭐⭐
**Critical Test**

- [ ] Make style changes across all sections
- [ ] Click "Save" or "Publish" button
- [ ] Refresh the page
- [ ] Verify all styles persist
- [ ] Check database (optional)

### Test 10: Integration ⭐⭐
**Critical Test**

- [ ] Select different blocks sequentially
- [ ] Verify StylePanel updates for each block
- [ ] Test with text blocks, image blocks, dynamic blocks
- [ ] Verify no conflicts with template system

## 🐛 Known Issues to Watch For

1. **Color Picker Popover**:
   - Should close when clicking outside
   - Should not cause layout shift

2. **Border Radius Preview**:
   - Should show live preview with gradient
   - All 4 corner inputs should be visible

3. **Spacing Box Model**:
   - Should have clear visual distinction (padding=blue, margin=orange)
   - Link/Unlink toggle should work smoothly

4. **Layout Editor**:
   - Flexbox/Grid controls should only show when relevant
   - Icons should be clear and intuitive

## 📊 Success Criteria

✅ **All components render without errors**  
✅ **All interactive controls are functional**  
✅ **Styles apply to blocks in real-time**  
✅ **Styles persist after page save/reload**  
✅ **No TypeScript/console errors**  
✅ **Smooth UX - no lag or jank**  
✅ **Visual feedback is clear and immediate**  
✅ **Compatible with existing template system**

## 🚀 Quick Test Path (5 minutes)

1. Navigate to PageBuilder
2. Select any block
3. Open "📐 Spacing" → adjust padding → click preset "16"
4. Open "🎨 Colors" → change background color
5. Open "🔲 Border" → set radius to "16" → change border color
6. Open "🎨 Layout" → switch to "Flex" → change justify to "center"
7. Save page
8. Refresh
9. Verify all changes persisted

**If all 9 steps pass → StylePanel is working! ✅**

---

**Report Issues**: Document any bugs with:
- Component affected
- Steps to reproduce
- Expected vs actual behavior
- Browser console errors (if any)
