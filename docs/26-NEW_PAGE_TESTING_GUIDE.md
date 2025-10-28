# 🧪 New Page Creation - Testing Guide

**Test Suite**: New Page Save Bug Fix  
**Status**: ✅ **READY**

---

## 📋 Pre-Test Checklist

- [ ] Browser refreshed (F5)
- [ ] Browser cache cleared
- [ ] Terminal shows no TypeScript errors
- [ ] `/admin/pagebuilder` page is accessible

---

## 🎯 Test Scenario 1: Create Simple New Page

### Steps
```
1. Navigate to /admin/pagebuilder
   Expected: Page list loads with existing pages
   
2. Click "New Page" button
   Expected: Page builder opens with empty editor
   
3. Observe the page
   Expected: No console errors
   ✓ Page title shows "Untitled Page"
   ✓ Slug shows "untitled-page"
   ✓ Editor is active
```

### Verification
- [ ] No "No page to save" error appears
- [ ] Editor is usable
- [ ] Settings show default values
- [ ] Console has no errors

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 2: Save New Page Without Changes

### Steps
```
1. From Test Scenario 1, click "Save" button in toolbar
   Expected: GraphQL mutation called with default values
   
2. Observe response
   Expected: Success toast appears
   ✓ Toast message: "Page created successfully!"
   ✓ Page builder closes
   ✓ Returns to page list
```

### Verification
- [ ] No error "No page to save"
- [ ] Toast shows success
- [ ] Page builder closes
- [ ] Returned to page list

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 3: Verify Created Page in List

### Steps
```
1. On page list, observe the newly created page
   Expected: New page appears in table
   ✓ Title: "Untitled Page"
   ✓ Slug: "untitled-page"
   ✓ Status: "DRAFT"
   ✓ Has Edit button
```

### Verification
- [ ] New page is visible in table
- [ ] Title matches default
- [ ] Slug matches default
- [ ] Can click Edit button

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 4: Create Page With Custom Title & Slug

### Steps
```
1. Click "New Page" button
   Expected: Page builder opens
   
2. Click Settings icon/button
   Expected: Settings dialog opens
   ✓ Page Title field shown
   ✓ Page Slug field shown
   ✓ SEO fields shown
   
3. Clear and enter:
   - Page Title: "My Product Collection"
   - Page Slug: "product-collection"
   Expected: Fields update with new values
   
4. Click "Save Settings" button
   Expected: Toast appears: "Page settings updated"
   ✓ Dialog closes or confirms save
   ✓ Title and slug persist
```

### Verification
- [ ] Settings dialog opens
- [ ] Fields are editable
- [ ] Can enter custom title
- [ ] Can enter custom slug
- [ ] Toast shows "Page settings updated"

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 5: Save Page With Custom Values

### Steps
```
1. From Test Scenario 4, after settings saved
   Expected: Page still shows custom values
   ✓ Editor shows custom title somewhere or title bar updated
   
2. Click "Save" button in toolbar
   Expected: Page created with custom values
   ✓ Toast shows success
   ✓ Editor closes
```

### Verification
- [ ] Custom title and slug are saved
- [ ] No error appears
- [ ] Toast shows success
- [ ] Editor closes

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 6: Verify Custom Page in List

### Steps
```
1. On page list, find newly created page
   Expected: New page appears with custom values
   ✓ Title: "My Product Collection"
   ✓ Slug: "product-collection"
   ✓ Status: "DRAFT"
```

### Verification
- [ ] Page appears in list
- [ ] Title is correct
- [ ] Slug is correct
- [ ] Edit button works

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 7: Edit and Re-Save Existing Page

### Steps
```
1. Click Edit on page from Test Scenario 6
   Expected: Page builder opens with page data
   ✓ Title shows "My Product Collection"
   ✓ Slug shows "product-collection"
   
2. Make a change (e.g., change title to "Products")
   Expected: Change appears in editor
   
3. Click Settings
   Expected: Settings dialog opens
   ✓ Title shows "Products"
   
4. Click "Save Settings"
   Expected: Toast: "Global settings saved successfully"
   
5. Click "Save" button
   Expected: Page updated successfully
   ✓ Toast shows success
   ✓ No "No page to save" error
```

### Verification
- [ ] Can edit existing page
- [ ] Settings dialog works
- [ ] Can update values
- [ ] No "No page to save" error
- [ ] Save successful

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 8: SEO Fields in Settings

### Steps
```
1. Create new page and open Settings
   Expected: Settings dialog shows:
   ✓ Page Title input
   ✓ Page Slug input
   ✓ SEO Title input
   ✓ SEO Description input
   ✓ SEO Keywords input
   
2. Fill in SEO fields:
   - SEO Title: "Buy Premium Products"
   - SEO Description: "Shop our collection"
   - SEO Keywords: "products, shop, buy"
   
3. Click "Save Settings"
   Expected: Toast confirms save
   
4. Click "Save" to create page
   Expected: Page created with SEO data
```

### Verification
- [ ] All SEO fields visible
- [ ] Can enter SEO values
- [ ] Settings save confirms
- [ ] Page created with SEO data

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 9: Cancel Settings Dialog

### Steps
```
1. Create new page, open Settings
   Expected: Settings dialog opens
   
2. Enter some values
   Expected: Fields show values
   
3. Click "Cancel" button
   Expected: Dialog closes WITHOUT saving
   ✓ Values are NOT applied
   
4. Click "Save" button
   Expected: Page created with ORIGINAL values
   ✓ Title: "Untitled Page"
   ✓ Slug: "untitled-page"
```

### Verification
- [ ] Cancel button closes dialog
- [ ] Changes are NOT applied
- [ ] Original values used for save

### Result
✅ **PASS** / ❌ **FAIL**

---

## 🎯 Test Scenario 10: Multiple Page Creations

### Steps
```
1. Create page #1: "Page One"
   Expected: Page created successfully
   
2. Create page #2: "Page Two"
   Expected: Page created successfully
   
3. Create page #3: "Page Three"
   Expected: Page created successfully
   
4. On page list, observe all three
   Expected: All three pages visible
   ✓ Each has correct title
   ✓ Each has correct slug (auto-generated)
```

### Verification
- [ ] Can create multiple pages
- [ ] Each creation succeeds
- [ ] All pages appear in list
- [ ] Each page unique

### Result
✅ **PASS** / ❌ **FAIL**

---

## ❌ Error Scenarios (Should NOT Happen)

### Error 1: "No page to save" when clicking Save
```
If you see this:
- Page builder should have initialized editingPage
- Check browser console for errors
- Status: ❌ **FIX FAILED**
```

### Error 2: Settings dialog doesn't open
```
If this happens:
- Check browser console for errors
- Try refreshing page
- Status: ⚠️ **Need Investigation**
```

### Error 3: Settings save doesn't work
```
If settings don't save:
- Check browser console for errors
- Verify GraphQL connection
- Status: ⚠️ **Need Investigation**
```

### Error 4: Page doesn't appear in list after create
```
If page missing from list:
- Refresh page list
- Check backend for errors
- Status: ⚠️ **Need Investigation**
```

---

## 📊 Test Summary Template

```
Test Date: ___________
Tester: ___________
Browser: ___________

Scenario 1: ___________
Scenario 2: ___________
Scenario 3: ___________
Scenario 4: ___________
Scenario 5: ___________
Scenario 6: ___________
Scenario 7: ___________
Scenario 8: ___________
Scenario 9: ___________
Scenario 10: ___________

Overall: ✅ PASS / ❌ FAIL

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
___________
```

---

## 🚀 What Should Happen

✅ New pages can be created  
✅ Settings dialog works for title/slug/SEO  
✅ Pages save with custom values  
✅ No "No page to save" error  
✅ Created pages appear in list  
✅ Can edit created pages  
✅ Multiple pages can be created  

---

## 📞 If Tests Fail

1. **Check console** for JavaScript errors
2. **Refresh browser** (F5) and try again
3. **Clear cache** (Ctrl+Shift+Delete)
4. **Check backend** for GraphQL errors
5. **Report in issue** with:
   - Browser name and version
   - Steps to reproduce
   - Console error message
   - Screenshot

---

**Testing Status**: ✅ **READY TO TEST**

Let's make sure new page creation works perfectly! 🚀
