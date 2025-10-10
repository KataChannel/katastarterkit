# Quick Test - Text Truncate Fix

## 🎯 Test trong 2 phút

### Setup
1. Navigate to: `/ketoan/listhoadon`
2. Ensure table has data loaded

---

## Test 1: Basic Truncation (30 giây)

### Steps:
1. Tìm column có text dài:
   - "Tên NB" (Tên Người bán)
   - "Địa chỉ NB" (Địa chỉ Người bán)
   - "Địa chỉ NM" (Địa chỉ Người mua)

2. Quan sát text trong cell

### Expected:

**Short text (fits in column):**
```
┌────────────────────┐
│ ABC Company        │  ← No truncation needed
└────────────────────┘
```

**Long text (doesn't fit):**
```
┌────────────────────┐
│ Công ty TNHH AB... │  ← Truncated with ...
└────────────────────┘
```

### Pass Criteria:
- ✅ Long text shows `...` at the end
- ✅ Text doesn't overflow cell boundary
- ✅ `...` appears right before right border
- ❌ Text flows outside cell → FAIL

---

## Test 2: Tooltip on Hover (30 giây)

### Steps:
1. Find truncated cell (has `...`)
2. **Hover** mouse over the cell
3. Wait 1-2 seconds

### Expected:
```
Before hover:
┌────────────────────┐
│ Công ty TNHH AB... │
└────────────────────┘

After hover:
┌────────────────────┐
│ Công ty TNHH AB... │ ← Tooltip: "Công ty TNHH ABC XYZ DEF GHI"
└────────────────────┘
```

### Pass Criteria:
- ✅ Browser tooltip appears
- ✅ Tooltip shows complete text
- ✅ Tooltip readable (not cut off)
- ❌ No tooltip → FAIL
- ❌ Tooltip shows "N/A" for real data → FAIL

---

## Test 3: Column Resize Truncation (45 giây)

### Steps:
1. Select column "Tên NB" (or any text column)
2. **Resize column wider** (drag border right)
3. Observe text

### Expected:
```
Narrow column (120px):
┌──────────┐
│ Công t...│  ← Truncated early
└──────────┘

Medium column (200px):
┌──────────────────┐
│ Công ty TNHH ... │  ← Less truncated
└──────────────────┘

Wide column (400px):
┌──────────────────────────────────┐
│ Công ty TNHH ABC XYZ DEF GHI     │  ← Full text (no truncation)
└──────────────────────────────────┘
```

### Steps (continue):
4. **Resize column narrower** (drag border left)
5. Observe text adjusts

### Pass Criteria:
- ✅ Text adjusts to column width dynamically
- ✅ `...` appears/disappears based on available space
- ✅ Tooltip still works after resize
- ❌ Text doesn't adjust → FAIL
- ❌ Text overflows when narrow → FAIL

---

## Test 4: Different Data Types (30 giây)

### Test string columns:
- "Tên NB", "Địa chỉ NB" → Should truncate

### Test number columns:
- "Tiền chưa thuế", "Tiền thuế" → Should show full (formatted numbers)

### Test status column:
- "Trạng thái" → Should show badge (no truncation)

### Expected:
```
String column (long):
│ Công ty TNHH AB... │  ← Truncated

Number column:
│     1.234.567 ₫    │  ← Formatted, no truncation (fits)

Status column:
│ [Hợp lệ] │  ← Badge, no truncation
```

### Pass Criteria:
- ✅ Strings truncate when too long
- ✅ Numbers display fully (usually fit)
- ✅ Badges/complex elements render properly
- ❌ Numbers truncated → Not expected (but OK if very long)

---

## 🔍 Visual Inspection Checklist

### Look for these signs:

**✅ GOOD (Truncate working):**
- Text ends with `...` when too long
- No horizontal scrollbar in cell
- Text aligned properly (not cut off abruptly)
- Tooltip shows on hover

**❌ BAD (Truncate broken):**
- Text flows outside cell border
- Text cuts off without `...`
- Double `...` (e.g., "Text... ...")
- Empty cells when data exists

---

## 🐛 Common Issues

### Issue 1: No truncation at all
**Sign:** Long text overflows cell  
**Cause:** Missing `overflow-hidden` or `min-w-0`  
**Check:** Inspect cell → verify CSS classes

### Issue 2: Double ellipsis "... ..."
**Sign:** Text shows two sets of dots  
**Cause:** Nested truncate divs  
**Check:** Inspect DOM → should be single truncate wrapper

### Issue 3: Tooltip shows wrong text
**Sign:** Hover shows "N/A" or empty  
**Cause:** `getDisplayText()` not working  
**Check:** Verify data is actually present

### Issue 4: Truncation doesn't adjust on resize
**Sign:** Resize column but `...` position doesn't change  
**Cause:** Fixed width somewhere in chain  
**Check:** Inspect column width → should be dynamic

---

## 📊 Quick Visual Test Matrix

| Column | Long Text? | Should Truncate? | Tooltip? |
|--------|------------|------------------|----------|
| MST NB | Usually short | Rarely | ⬜ |
| Tên NB | Often long | Yes ✅ | ✅ |
| Địa chỉ NB | Very long | Yes ✅ | ✅ |
| Số HĐ | Short | No | ⬜ |
| Tiền thuế | Numbers | Rarely | ⬜ |
| Trạng thái | Badge | No | ⬜ |

Test at least 3 columns marked ✅ for truncation.

---

## ✅ Pass/Fail Decision

### All Tests Pass If:
- [ ] Long text shows `...` at end
- [ ] No text overflows cell boundary
- [ ] Hover shows full text tooltip
- [ ] Truncation adjusts when resizing column
- [ ] Different data types render correctly

**Result:**
- ✅ 5/5 pass → Fix successful
- ⚠️ 3-4/5 pass → Partial success, investigate
- ❌ 0-2/5 pass → Fix not working

---

## 🎥 Screenshot Checklist

**Good screenshots to capture for documentation:**

1. **Before/After comparison** (if you have old screenshots)
2. **Truncated cell** - showing `...`
3. **Tooltip on hover** - showing full text
4. **Narrow column** - aggressive truncation
5. **Wide column** - full text visible
6. **Complex cell** - badge/icon not truncated

---

## 🚀 Quick Browser Test

### Desktop Browsers (pick one):
- Chrome ✅ (Recommended)
- Firefox
- Edge
- Safari (macOS)

### Mobile (optional):
- Chrome mobile
- Safari mobile

**Note:** Truncation is CSS-based, should work identically across browsers.

---

**Test Time:** 2-3 minutes  
**Difficulty:** Very Easy  
**Tools:** Just browser, no DevTools needed  
**Best for:** Quick validation after deployment
