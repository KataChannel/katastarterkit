# Quick Visual Test - Column Alignment Fix

## 🎯 Mục đích
Test xem header và data cells đã align đúng dòng chưa sau khi fix.

---

## ⚡ Quick Test (2 phút)

### Bước 1: Kiểm tra Alignment Cơ bản

1. Mở browser, navigate to: `/ketoan/listhoadon`
2. Quan sát table

**Kiểm tra visual:**
```
Header Row:
┌────────────────┬────────────────┬────────────────┐
│ MST Người bán  │ Ký hiệu mẫu    │ Ký hiệu hóa đơn│ ← 40px height
└────────────────┴────────────────┴────────────────┘

Data Row 1:
┌────────────────┬────────────────┬────────────────┐
│ 0123456789     │ AA/12E         │ 01KH/001       │ ← 40px height
└────────────────┴────────────────┴────────────────┘

Data Row 2:
┌────────────────┬────────────────┬────────────────┐
│ 9876543210     │ BB/13E         │ 02KH/002       │ ← 40px height
└────────────────┴────────────────┴────────────────┘
```

**Expected:**
- ✅ Header row: Exactly 40px height
- ✅ Data rows: All exactly 40px height
- ✅ Vertical lines align perfectly across all columns
- ✅ Content centered vertically in each cell

**If PASS:** Go to Step 2  
**If FAIL:** Header/cells not aligned → Bug still exists

---

### Bước 2: Kiểm tra Long Content

1. Tìm cell có text dài (>20 characters)
2. Hover over cell

**Expected:**
- ✅ Text truncated with `...` (ellipsis)
- ✅ Cell height remains 40px
- ✅ No text overflow outside cell
- ✅ Tooltip shows full text (if implemented)

**Example:**
```
Before Fix (BAD):
┌────────────────────────────┐
│ Công ty TNHH ABC XYZ DEF   │ ← Height tự động lớn hơn
│ GHI JKL                    │
└────────────────────────────┘

After Fix (GOOD):
┌────────────────────────────┐
│ Công ty TNHH ABC XY...     │ ← Fixed 40px, truncated
└────────────────────────────┘
```

---

### Bước 3: Kiểm tra Edit Mode

1. Double-click một editable cell
2. Observe editing UI

**Expected:**
- ✅ Input field appears
- ✅ Save/Cancel buttons appear
- ✅ Cell height remains 40px
- ✅ Buttons aligned horizontally to the right
- ✅ Layout doesn't shift

**Visual:**
```
Normal Mode:
┌────────────────────┐
│ 0123456789         │ ← 40px
└────────────────────┘

Edit Mode:
┌────────────────────┐
│ [Input───] [✓] [✕] │ ← Still 40px!
└────────────────────┘
```

**If buttons cause layout shift:** Bug in editing mode

---

### Bước 4: Kiểm tra Horizontal Scroll

1. Scroll table horizontally (if has many columns)
2. Observe all visible columns

**Expected:**
- ✅ All headers have same height (40px)
- ✅ All rows have same height (40px)
- ✅ Vertical borders align across visible area
- ✅ No "stairs" effect (cells at different heights)

**Visual Check:**
Draw an imaginary horizontal line across the table:
```
┌─────┬─────┬─────┬─────┐
│ H1  │ H2  │ H3  │ H4  │ ← Line passes through middle
├─────┼─────┼─────┼─────┤
│ C1  │ C2  │ C3  │ C4  │ ← Line passes through middle
├─────┼─────┼─────┼─────┤
│ C1  │ C2  │ C3  │ C4  │ ← Line passes through middle
└─────┴─────┴─────┴─────┘
```

---

### Bước 5: Kiểm tra Selection Checkbox

1. Click checkbox in header (select all)
2. Click checkbox in a row (select single)

**Expected:**
- ✅ Checkbox column width consistent
- ✅ Checkbox centered vertically in cell
- ✅ Row height remains 40px when selected
- ✅ Background color change doesn't affect height

**Visual:**
```
┌───┬────────────┐
│ ☑️ │ Header     │ ← Checkbox centered
├───┼────────────┤
│ ☑️ │ Row 1      │ ← Checkbox centered
├───┼────────────┤
│ ☐ │ Row 2      │ ← Checkbox centered
└───┴────────────┘
```

---

### Bước 6: Kiểm tra Pinned Columns

1. Right-click a column header
2. Select "Pin Left" or "Pin Right"
3. Observe pinned column

**Expected:**
- ✅ Pinned column height matches unpinned columns
- ✅ Header: 40px
- ✅ Rows: 40px each
- ✅ Border between pinned and center columns straight
- ✅ No gap or overlap

**Visual:**
```
Pinned Left    │ Center Columns
───────────────┼────────────────
┌─────┐        │ ┌─────┬─────┐
│ MST │        │ │ Tên │ Số  │ ← All 40px
├─────┤        │ ├─────┼─────┤
│ 123 │        │ │ ABC │ 100 │ ← All 40px
└─────┘        │ └─────┴─────┘
       ↑
   Blue border (2px) should be straight vertical line
```

---

## ✅ Pass Criteria

### Visual Checklist:

- [ ] **Height Consistency**
  - [ ] All headers = 40px
  - [ ] All rows = 40px
  - [ ] No variation in height

- [ ] **Vertical Alignment**
  - [ ] Content centered in cells
  - [ ] Vertical borders straight
  - [ ] No "stairs" effect

- [ ] **Text Handling**
  - [ ] Long text truncated with `...`
  - [ ] No overflow
  - [ ] No wrapping to second line

- [ ] **Interactive States**
  - [ ] Edit mode doesn't change height
  - [ ] Selected rows same height
  - [ ] Hover doesn't affect height

- [ ] **Special Columns**
  - [ ] Checkbox column aligned
  - [ ] Pinned columns aligned
  - [ ] Action buttons aligned

---

## 🐛 Common Issues & Signs

### Issue 1: Headers taller than rows
**Sign:** Header looks "stretched"  
**Cause:** Header wrapper missing `height: headerHeight`

### Issue 2: Rows have different heights
**Sign:** "Stairs" effect when scrolling  
**Cause:** Cell wrapper missing `height: rowHeight`

### Issue 3: Content not centered
**Sign:** Text appears at top of cell  
**Cause:** Missing `flex items-center` on cell

### Issue 4: Text overflow
**Sign:** Text flows outside cell border  
**Cause:** Missing `truncate` wrapper

### Issue 5: Edit mode breaks layout
**Sign:** Cell grows when editing  
**Cause:** `h-full` not applied to editing mode div

---

## 📐 Measurement Tool (Browser DevTools)

### How to measure cell height:

1. Right-click a cell → **Inspect**
2. In DevTools, hover over the wrapper `<div style="height: 40px">`
3. Browser shows dimensions overlay
4. Verify: `40 × 40` (width × height)

### Example DevTools View:
```
Elements panel:
<div style="height: 40px">          ← Should show exactly 40px
  <div class="h-full flex items-center ...">
    <div class="truncate w-full">
      Cell content
    </div>
  </div>
</div>

Computed panel:
height: 40px                         ← Verify this
```

---

## 🎨 Visual Regression Test (Optional)

### Screenshot Comparison:

1. **Before Fix:** (If you have old screenshot)
   - Misaligned borders
   - Varying cell heights
   - Content not centered

2. **After Fix:** (Current)
   - All borders aligned
   - Uniform cell heights
   - Content centered

### Tools:
- Browser screenshot tool
- Compare side-by-side
- Look for pixel-perfect alignment

---

## 📊 Quick Pass/Fail

| Test | Expected | Pass? |
|------|----------|-------|
| Header height | 40px | ⬜ |
| Row height | 40px | ⬜ |
| Vertical alignment | Centered | ⬜ |
| Long text | Truncated | ⬜ |
| Edit mode height | 40px | ⬜ |
| Pinned columns | Aligned | ⬜ |

**Overall Result:**
- ✅ **All Pass** → Fix successful
- ⚠️ **Some Fail** → Needs investigation
- ❌ **Most Fail** → Fix not working

---

**Time to complete:** 2-3 minutes  
**Difficulty:** Easy (visual only)  
**Tools needed:** Browser only
