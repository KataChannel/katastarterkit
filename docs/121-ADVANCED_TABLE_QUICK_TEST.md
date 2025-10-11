# AdvancedTable - Quick Test Guide

## 🧪 Quick Test (5 phút)

### Test 1: Column Settings - Show/Hide All (1 phút)

**Steps:**
1. Navigate to `/ketoan/listhoadon`
2. Click **"Columns"** button in toolbar
3. Verify dialog opens with column list

**Test Show All:**
4. Click **"Hide All"** button (all checkboxes unchecked)
5. Click **"Show All"** button
6. ✅ Verify: All checkboxes now checked
7. Click **"Done"**

**Test Hide All:**
8. Click **"Columns"** again
9. Click **"Hide All"** button
10. ✅ Verify: All checkboxes now unchecked
11. Click **"Done"**

**Expected:**
- ✅ Show All: Un-hides all columns instantly
- ✅ Hide All: Hides all columns instantly
- ✅ Buttons have Eye/EyeOff icons
- ✅ No errors in console

---

### Test 2: Desktop Responsive (1 phút)

**Device:** Desktop browser (> 1024px width)

**Steps:**
1. Open page at full screen
2. Check toolbar

**Expected:**
- ✅ Toolbar: Horizontal layout
- ✅ Buttons show full text: "Delete", "Export", "Auto Size All", "Columns"
- ✅ Icons: 16px (medium size)
- ✅ Padding: Normal (16px)

3. Click **"Columns"** button

**Expected:**
- ✅ Dialog: 400px max-width, centered
- ✅ Title: "Column Settings" (16px)
- ✅ Buttons: "Show All", "Hide All" (14px text)
- ✅ Footer: Horizontal layout (Reset | Done)

---

### Test 3: Mobile Responsive (2 phút)

**Device:** Chrome DevTools, iPhone SE (375px width)

**Setup:**
1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select "iPhone SE" or set width to 375px

**Test Toolbar:**
1. Observe toolbar layout

**Expected:**
- ✅ Toolbar: Stacks vertically
- ✅ Short labels: "Del", "CSV"
- ✅ "Auto Size All" hidden
- ✅ Buttons: Full width
- ✅ Icons: Smaller (12px)
- ✅ Gap: Smaller (8px)

**Test Column Settings:**
2. Click **"Columns"** button

**Expected:**
- ✅ Dialog: 95% viewport width (fills screen)
- ✅ Title: Smaller (14px)
- ✅ Buttons: "All", "None" (short text)
- ✅ Buttons: Full width, stacked
- ✅ Footer: Vertical layout (Reset above Done)
- ✅ Scrollable content: Works smoothly

3. Try scrolling column list
4. ✅ Verify smooth scroll with touch simulation

**Test Filter Bar:**
5. Back to main page
6. Observe filter bar

**Expected:**
- ✅ Search input: Full width
- ✅ Add Filter button: Full width
- ✅ Stacked layout (vertical)
- ✅ Smaller text (12px)

---

### Test 4: Tablet Responsive (1 phút)

**Device:** Chrome DevTools, iPad (768px width)

**Setup:**
1. Change device to "iPad" or set width to 768px

**Expected:**
- ✅ Toolbar: Horizontal layout
- ✅ "Auto Size All" still hidden
- ✅ Column Settings: Dialog fits nicely
- ✅ Mix of mobile/desktop styles

---

## 🎯 Quick Visual Checklist

### Desktop (> 1024px):
```
Toolbar:
[5 selected] [Delete] | [Export] [Auto Size All] [Columns]

Column Settings:
┌────────────────────────────┐
│ Column Settings            │
│ [Show All] [Hide All]      │
│ ☑️ MST Người bán    [Left] │
│ ☑️ Ký hiệu mẫu      [Left] │
│          [Reset]   [Done]  │
└────────────────────────────┘
```

### Mobile (< 640px):
```
Toolbar:
[5 selected] [Del]
[CSV] [Columns]

Column Settings:
┌──────────────────┐
│ Column Settings  │
│ [All]   [None]   │
│ ☑️ MST NB  [L]   │
│ ☑️ KH mẫu  [L]   │
│ [Reset]          │
│ [Done]           │
└──────────────────┘
```

---

## ✅ Pass/Fail Criteria

### Must Pass:
- ✅ Show All button works
- ✅ Hide All button works
- ✅ Mobile layout stacks vertically
- ✅ Desktop layout horizontal
- ✅ Dialog responsive (95vw mobile, 400px desktop)
- ✅ No horizontal overflow on mobile
- ✅ All text readable

### Nice to Have:
- ✅ Smooth transitions
- ✅ Icons scale properly
- ✅ Touch targets >= 44px on mobile

---

## 🐛 Common Issues

### Issue: Dialog cut off on mobile
**Check:** `w-[95vw]` class present?

### Issue: Buttons not full-width on mobile
**Check:** `w-full sm:w-auto` class present?

### Issue: Text too small
**Check:** `text-xs sm:text-sm` pattern used?

### Issue: Show/Hide All doesn't work
**Check:** Console for errors

---

## 📊 Quick Browser Test Matrix

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome  | ✅ | ✅ | Pass |
| Firefox | ⏳ | ⏳ | Test |
| Safari  | ⏳ | ⏳ | Test |
| Edge    | ⏳ | ⏳ | Test |

---

## 🚀 Next Steps After Testing

1. ✅ All tests pass → Ready for production
2. ⚠️ Some issues → Fix and retest
3. ❌ Major issues → Review implementation

---

**Total Test Time:** ~5 minutes  
**Difficulty:** Easy  
**Prerequisites:** None
