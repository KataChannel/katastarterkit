# Quick Test Guide - Interaction Features

## 🎯 Test trong 3 phút

### Chuẩn bị
1. Navigate to: `/ketoan/listhoadon`
2. Đảm bảo có data hiển thị trong table

---

## Test 1: Text Tooltip (30 giây)

### Steps:
1. Tìm cell có text dài bị truncate với `...`
   - Ví dụ: Cột "Tên NB", "Địa chỉ NB", "Địa chỉ NM"
2. **Hover** chuột lên cell đó
3. Đợi 1-2 giây

### Expected Result:
```
Before hover:
┌──────────────────────────┐
│ Công ty TNHH ABC XY...   │
└──────────────────────────┘

After hover (tooltip appears):
┌──────────────────────────┐
│ Công ty TNHH ABC XY...   │ ← "Công ty TNHH ABC XYZ DEF GHI JKL"
└──────────────────────────┘
```

✅ **PASS:** Tooltip hiển thị full text  
❌ **FAIL:** Không có tooltip hoặc tooltip rỗng

---

## Test 2: Column Resize (45 giây)

### Steps:
1. **Hover** chuột lên **border phải** của column header
   - Ví dụ: Hover vào khoảng giữa "MST Người bán" và "Ký hiệu mẫu"
2. Quan sát cursor
3. Quan sát blue line

### Expected:
```
Normal cursor:
MST Người bán│Ký hiệu mẫu
             ↑

Hover on border:
MST Người bán│Ký hiệu mẫu  ← Cursor: ↔️ (resize)
            Blue line appears
```

### Steps (continue):
4. **Click và drag** sang trái (thu nhỏ)
5. Release mouse
6. **Click và drag** sang phải (mở rộng)
7. Release mouse

### Expected:
```
Before resize:
┌──────────┬──────────┐
│ MST NB   │ KH mẫu   │
└──────────┴──────────┘

After drag right:
┌────────────────┬──────────┐
│ MST Người bán  │ KH mẫu   │  ← Wider!
└────────────────┴──────────┘
```

✅ **PASS:** 
- Cursor changes to resize (↔️)
- Blue line visible on hover
- Column width changes when dragging
- New width persists after release

❌ **FAIL:**
- Cursor không đổi
- Không có blue line
- Drag không resize column

---

## Test 3: Pin Column Left (45 giây)

### Steps:
1. **Hover** vào column header "Số HĐ" (center column)
2. Quan sát xem có nút menu (⋮) xuất hiện không
3. **Click** vào nút menu (⋮)
4. Quan sát dropdown menu

### Expected Menu:
```
┌─────────────────────┐
│ Sort Ascending      │
│ Sort Descending     │
│ ─────────────────── │
│ Pin Left         ← Click this
│ Pin Right           │
│ ─────────────────── │
│ Auto Size Column    │
│ ─────────────────── │
│ Hide Column         │
└─────────────────────┘
```

### Steps (continue):
5. **Click** "Pin Left"
6. Quan sát column di chuyển

### Expected Result:
```
Before pin:
┌────────┬─────────┬────────┬─────────┐
│ MST NB │ KH mẫu  │ Số HĐ  │ CQT     │
└────────┴─────────┴────────┴─────────┘
         ↑ Pinned   ↑ Center

After pin left:
┌────────┬─────────┬────────┬─────────┐
│ MST NB │ KH mẫu  │ Số HĐ  │ CQT     │
└────────┴─────────┴────────┴─────────┘
         ↑ All pinned left   ↑ Center
         Blue border →│
```

✅ **PASS:**
- Menu button (⋮) appears on hover
- Menu opens on click
- "Pin Left" option visible
- Column moves to left pinned area
- Blue border appears on right side of pinned area

❌ **FAIL:**
- Menu button không xuất hiện
- Menu không mở
- Column không di chuyển

---

## Test 4: Pin Column Right (30 giây)

### Steps:
1. Hover vào column "Tiền thuế" (center column)
2. Click menu (⋮)
3. Click "Pin Right"

### Expected:
```
After pin right:
┌─────────┬─────────┬─────────┬──────────┐
│ MST NB  │ CQT     │ │ Tiền thuế│ Tổng TT │
└─────────┴─────────┴─────────┴──────────┘
  ↑ Left    ↑ Center  Blue border  ↑ Right pinned
```

✅ **PASS:** Column moves to right, blue border on left  
❌ **FAIL:** Column không di chuyển

---

## Test 5: Unpin Column (30 giây)

### Steps:
1. Hover vào column vừa pin ("Số HĐ" nếu đã pin left)
2. Click menu (⋮)
3. Observe menu text

### Expected Menu:
```
┌─────────────────────┐
│ Unpin            ← Text changed!
│ Pin Right           │
│ ─────────────────── │
│ Auto Size Column    │
│ Hide Column         │
└─────────────────────┘
```

4. Click "Unpin"

### Expected:
- Column returns to center area
- Blue border disappears

✅ **PASS:** Unpin works  
❌ **FAIL:** Column vẫn ở pinned area

---

## Test 6: Auto Size Column (30 giây)

### Steps:
1. Resize column "MST Người bán" rất nhỏ (drag left nhiều)
2. Hover header → Click menu (⋮)
3. Click "Auto Size Column"

### Expected:
- Column width tự động điều chỉnh vừa với content
- Không quá rộng, không quá hẹp

✅ **PASS:** Auto size works  
❌ **FAIL:** Width không thay đổi

---

## 📊 Visual Checklist

### Hover Effects:
- [ ] Cell tooltip shows on hover (text cells)
- [ ] Resize cursor appears on column border hover
- [ ] Blue line shows on resize handle hover
- [ ] Menu button (⋮) shows on header hover

### Interactive:
- [ ] Column resize works (drag left/right)
- [ ] Pin Left works (column moves, blue border)
- [ ] Pin Right works (column moves, blue border)
- [ ] Unpin works (column returns, border gone)
- [ ] Auto Size works (column adjusts width)

### Edge Cases:
- [ ] Resize doesn't trigger sort
- [ ] Pin already-pinned shows "Unpin"
- [ ] Tooltip works for all text types (string, date, number)

---

## 🐛 Common Issues

### Issue 1: Menu button không xuất hiện
**Cause:** `group` class missing in ColumnHeader  
**Check:** Inspect element, verify class `group` exists

### Issue 2: Resize handle không clickable
**Cause:** `z-index` too low  
**Check:** Inspect resize handle, verify `z-10` class

### Issue 3: Tooltip không hiển thị
**Cause:** `title` attribute missing  
**Check:** Inspect cell, verify `title="..."` exists

### Issue 4: Resize triggers sort
**Cause:** `stopPropagation` missing  
**Expected:** Resize should not sort column

---

## ✅ Pass/Fail Criteria

| Feature | Test | Pass? |
|---------|------|-------|
| Tooltip | Hover shows full text | ⬜ |
| Resize | Cursor changes | ⬜ |
| Resize | Blue line appears | ⬜ |
| Resize | Drag works | ⬜ |
| Pin Left | Menu appears | ⬜ |
| Pin Left | Column moves | ⬜ |
| Pin Right | Column moves | ⬜ |
| Unpin | Column returns | ⬜ |
| Auto Size | Width adjusts | ⬜ |

**Result:**
- ✅ All pass → Fix successful
- ⚠️ Some fail → Needs investigation  
- ❌ Most fail → Fix not working

---

## 🎥 Video Demo Sequence

**Recommended recording for documentation:**

1. **Tooltip Test** (10 sec)
   - Hover over long text
   - Show tooltip appearing

2. **Resize Test** (15 sec)
   - Hover on border (show cursor change)
   - Drag left (shrink)
   - Drag right (expand)

3. **Pin Test** (20 sec)
   - Hover header (show menu button)
   - Open menu
   - Click "Pin Left"
   - Show column moving
   - Click "Unpin"
   - Show column returning

**Total:** ~45 seconds of core functionality

---

**Test Time:** 3 minutes  
**Difficulty:** Easy  
**Tools:** Browser only (no DevTools needed)  
**Best Browser:** Chrome (best tooltip support)
