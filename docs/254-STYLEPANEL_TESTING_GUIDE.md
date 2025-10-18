# StylePanel Testing Guide - Complete & Accurate

## 🎯 Mục đích Test

Verify rằng khi edit một style property, các properties khác **KHÔNG BỊ MẤT**.

---

## �️ BƯỚC ĐẦU TIÊN: Select Block để Mở StylePanel

### ⚠️ QUAN TRỌNG: StylePanel chỉ hiện khi bạn đã chọn block!

**Cách chọn block**:
1. **Click vào bất kỳ block nào** trong canvas
2. Block được chọn sẽ có **blue ring** (viền xanh) bao quanh
3. StylePanel sẽ **tự động xuất hiện** bên phải (RightPanel)
4. Nếu không thấy StylePanel → Kiểm tra xem block có viền xanh chưa

**Visual Feedback**:
- **Hover** (di chuột qua): Viền xanh nhạt xuất hiện
- **Selected** (đã chọn): Viền xanh đậm + shadow
- **Unselected**: Không có viền

**Keyboard Support**:
- Tab: Focus blocks
- Enter/Space: Select focused block

---

## 📍 Hiểu Rõ Structure

StylePanel có **7 sections** (accordions):

1. **🎨 Layout** → display, flexDirection, justifyContent, alignItems, gap, grid
2. **📐 Spacing** → padding, margin  
3. **✍️ Typography** → fontSize, fontWeight, lineHeight, textAlign
4. **🎨 Colors** → color (text color), backgroundColor
5. **🔲 Border** → borderWidth, borderStyle, borderColor, borderRadius
6. **✨ Effects** → opacity, boxShadow, transform
7. **📏 Size** → width, height, minWidth, maxWidth, minHeight, maxHeight

### ⚠️ Common Confusion

**KHÔNG TÌM THẤY font size trong Layout?** → ĐÚNG! 

- ❌ Font size **KHÔNG** nằm trong Layout section
- ✅ Font size nằm trong **Typography section** ✍️

**KHÔNG TÌM THẤY color trong Layout?** → ĐÚNG!

- ❌ Color **KHÔNG** nằm trong Layout section  
- ✅ Color nằm trong **Colors section** 🎨

**Layout section** chỉ có:
- Display mode (block, flex, grid, inline-block)
- Flex properties (direction, justify, align, wrap, gap)
- Grid properties (columns, rows, gap)

---

## 🧪 Test Scenarios - CHÍNH XÁC

### Test 1: Typography + Colors + Layout ✅

**Mục đích**: Verify editing Layout không làm mất Typography và Colors

**Steps** (Follow EXACTLY):

1. **Navigate** to http://localhost:13000/admin/pagebuilder

2. **Add Text Block**:
   - Click "Add Block" button
   - Select "Text" block
   - Block appears on canvas

3. **Select Block**:
   - Click on the Text block you just added
   - RightPanel opens on the right side
   - Make sure you're on **Style** tab (not Settings)

4. **Set Typography** (✍️ Typography section):
   - Click "Typography" accordion to expand it
   - Find "Font Size" field
   - Change value from 16px to **24px**
   - Block text becomes larger ✅

5. **Set Colors** (🎨 Colors section):
   - Scroll down, click "Colors" accordion
   - Find "Text Color" color picker
   - Click the color square
   - Select **blue** color (#0000FF or similar)
   - Click outside to close picker
   - Block text becomes blue ✅

6. **Change Layout** (🎨 Layout section):
   - Scroll back up, click "Layout" accordion
   - Find "Display" tabs (Block / Flex / Grid / Inline)
   - Click **Grid** tab
   - Display mode changes to grid ✅

7. **VERIFY Typography Preserved**:
   - Go back to "Typography" section
   - Check "Font Size" field → Should STILL show **24px** ✅
   - Look at the block → Text should STILL be large (24px) ✅

8. **VERIFY Colors Preserved**:
   - Go back to "Colors" section
   - Check "Text Color" → Should STILL show **blue** ✅
   - Look at the block → Text should STILL be blue ✅

9. **Check Console** (F12):
   - Open DevTools Console tab
   - Should see logs like:
   ```javascript
   StylePanel - handleStyleUpdate called with: { fontSize: "24px" }
   StylePanel - handleStyleUpdate called with: { color: "#0000FF" }
   StylePanel - handleStyleUpdate called with: { display: "grid" }
   // ✅ Each update shows ONLY changed property!
   ```

**✅ PASS Criteria**:
- ✅ Font size STILL 24px after changing layout
- ✅ Color STILL blue after changing layout  
- ✅ Display successfully changed to grid
- ✅ Console shows minimal updates (only changed properties)
- ✅ NO toast notifications appeared

**❌ FAIL Signs**:
- Font size resets to 16px → BUG!
- Color resets to black → BUG!
- Console shows `{ display: "grid", fontSize: "16px", color: "#000" }` → BUG! (extra props)

---

### Test 2: Border + Spacing ✅

**Mục đích**: Verify editing Border không làm mất Spacing

**Steps**:

1. Continue from Test 1 (or create new block)

2. **Set Spacing** (📐 Spacing section):
   - Click "Spacing" accordion
   - Find "Padding" visual editor (box model)
   - Drag "Top" slider or type **40** in top input
   - Block padding increases ✅

3. **Set Border** (🔲 Border section):
   - Click "Border" accordion
   - Find "Width" field
   - Change to **2px**
   - Border appears around block ✅

4. **Change Border Style**:
   - In same Border section
   - Find "Style" dropdown
   - Select **dashed**
   - Border becomes dashed ✅

5. **VERIFY Spacing Preserved**:
   - Go back to "Spacing" section
   - Check Padding Top value → Should STILL be **40px** ✅
   - Look at block → Should STILL have top padding ✅

6. **Check Console**:
   ```javascript
   StylePanel - handleStyleUpdate called with: { paddingTop: "40px", ... }
   StylePanel - handleStyleUpdate called with: { borderWidth: "2px" }
   StylePanel - handleStyleUpdate called with: { borderStyle: "dashed" }
   // ✅ Each shows only what changed!
   ```

**✅ PASS**: Padding preserved, border works, console clean  
**❌ FAIL**: Padding resets, console shows extra props

---

### Test 3: Sequential Multi-Section Edits ✅

**Mục đích**: All edits accumulate correctly

**Steps**:

1. Add new Text block
2. Make edits in THIS ORDER:

**A. Spacing**:
- Padding Top: **20px**

**B. Typography**:
- Font Size: **32px**
- Font Weight: **bold**

**C. Colors**:
- Text Color: **red** (#FF0000)
- Background Color: **yellow** (#FFFF00)

**D. Layout**:
- Display: **flex**
- Flex Direction: **column**
- Align Items: **center**

**E. Border**:
- Width: **3px**
- Style: **solid**
- Color: **black**
- Radius: **10px** (all corners)

**F. Effects**:
- Opacity: **0.9**

3. **Final Verification** - Go back through ALL sections:
   - ✅ Spacing: Padding Top = 20px
   - ✅ Typography: Font Size = 32px, Font Weight = bold
   - ✅ Colors: Text = red, Background = yellow
   - ✅ Layout: Display = flex, Direction = column, Align = center
   - ✅ Border: 3px solid black, radius = 10px
   - ✅ Effects: Opacity = 0.9

**✅ PASS**: ALL 11+ properties visible and correct  
**❌ FAIL**: Any property missing or reset

---

### Test 4: No Toast Spam ✅

**Steps**:

1. Select any block
2. Open **Spacing** section
3. **Rapidly drag** Padding Top slider 10 times:
   - 10px → 20px → 30px → 40px → 50px → 40px → 30px → 20px → 10px → 0px

**Expected**:
- ✅ Block updates smoothly each time
- ✅ **ZERO toasts** appear (no spam!)
- ✅ Console shows 10 update logs
- ✅ Final padding = 0px

4. Switch to **Settings** tab
5. Edit "Text Content" → Type "Hello World"

**Expected**:
- ✅ **ONE toast** appears: "Block updated successfully!"
- ✅ Content changes

**✅ PASS**: Style changes = 0 toasts, Content change = 1 toast  
**❌ FAIL**: Toasts appear for style changes

---

### Test 5: Console Verification ✅

**Steps**:

1. Open DevTools (F12) → Console tab
2. Clear console (Ctrl+L)
3. Select a block
4. Change Display: flex → grid

**Expected Console**:
```javascript
StylePanel - selectedBlock: { id: "...", type: "TEXT", ... }
StylePanel - currentStyles: { fontSize: "16px", ... }
StylePanel - handleStyleUpdate called with: { display: "grid" }
StylePanel - merged styles: { fontSize: "16px", ..., display: "grid" }
RightPanel - handleStyleChange called with: { ... }
PageBuilderProvider - handleUpdateBlockStyle called
PageBuilderProvider - updateBlock result: { ... }
PageBuilderProvider - refetch completed
```

**✅ PASS**: Complete flow logged, minimal updates, no errors  
**❌ FAIL**: Missing logs, errors, or extra props in updates

---

## 🎨 Section Locations - Quick Reference

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
