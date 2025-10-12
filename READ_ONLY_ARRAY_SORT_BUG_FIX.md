# 🐛 Bug Fix: Read-only Array Sort Error in BlockRenderer

**Date**: 12 tháng 10, 2025  
**Status**: ✅ FIXED  
**Error**: `TypeError: Cannot assign to read only property '0' of object '[object Array]'`

---

## 🔴 Error Message

```
Console TypeError
Cannot assign to read only property '0' of object '[object Array]'

src/components/page-builder/blocks/BlockRenderer.tsx (59:8) @ renderChildren

  57 |
  58 |     return block.children
> 59 |       .sort((a, b) => a.order - b.order)
     |        ^
  60 |       .map((childBlock) => (
```

---

## 🔍 Root Cause

### Vấn đề
GraphQL (Apollo Client) trả về **read-only/frozen arrays** để tránh mutations không mong muốn. Method `.sort()` mutates array in-place, nên gây lỗi khi gọi trên read-only array.

### Why GraphQL Returns Read-Only Arrays?
Apollo Client freezes objects/arrays từ cache để:
- ✅ Prevent accidental mutations
- ✅ Maintain cache integrity
- ✅ Enable change detection
- ✅ Improve performance

---

## ✅ Solution

### Trước (Lỗi):
```typescript
const renderChildren = () => {
  if (!block.children || block.children.length === 0) return null;

  return block.children
    .sort((a, b) => a.order - b.order)  // ❌ Error: Mutates read-only array
    .map((childBlock) => (
      <BlockRenderer ... />
    ));
};
```

### Sau (Fixed):
```typescript
const renderChildren = () => {
  if (!block.children || block.children.length === 0) return null;

  // Create a copy of children array before sorting (GraphQL returns read-only array)
  return [...block.children]  // ✅ Create mutable copy with spread operator
    .sort((a, b) => a.order - b.order)  // ✅ Now safe to sort
    .map((childBlock) => (
      <BlockRenderer ... />
    ));
};
```

---

## 🔧 Technical Details

### Spread Operator (`...`)
```typescript
// Creates shallow copy of array
const copy = [...originalArray];

// Equivalent to:
const copy = originalArray.slice();
// Or:
const copy = Array.from(originalArray);
```

### Why This Works?
1. Spread operator creates **new array** (mutable)
2. `.sort()` mutates the **copy**, not original
3. Original GraphQL data remains unchanged
4. Apollo cache stays intact

---

## 📊 Impact

### Files Changed
- ✅ `frontend/src/components/page-builder/blocks/BlockRenderer.tsx`
  - Line 58-59: Added spread operator
  - Added comment explaining why

### Lines Changed
- **1 line changed** (added `...`)
- **1 comment added**

### Breaking Changes
- ❌ None - purely internal fix

---

## ✅ Verification

### Test Cases
1. ✅ Render block with children
2. ✅ Children sorted by order
3. ✅ No console errors
4. ✅ Apollo cache unchanged
5. ✅ Re-renders work correctly

### Before Fix
```
❌ Console Error: Cannot assign to read only property '0'
❌ Children may not render
❌ App may crash
```

### After Fix
```
✅ No console errors
✅ Children render correctly
✅ Sorted by order field
✅ Apollo cache intact
```

---

## 📚 Related Issues

### Similar Bugs to Watch For
Any operation that **mutates arrays** from GraphQL:
- ❌ `.sort()` - Mutates in-place
- ❌ `.reverse()` - Mutates in-place
- ❌ `.splice()` - Mutates in-place
- ❌ `array[index] = value` - Direct mutation

### Safe Alternatives
- ✅ `[...array].sort()` - Copy then sort
- ✅ `[...array].reverse()` - Copy then reverse
- ✅ `array.map()` - Returns new array
- ✅ `array.filter()` - Returns new array
- ✅ `array.slice()` - Returns new array

---

## 💡 Best Practices

### Always Copy Before Mutating
```typescript
// ✅ Good: Copy first
const sorted = [...items].sort((a, b) => a.order - b.order);

// ❌ Bad: Direct mutation
items.sort((a, b) => a.order - b.order);
```

### Or Use Non-Mutating Methods
```typescript
// ✅ Good: toSorted() (ES2023+)
const sorted = items.toSorted((a, b) => a.order - b.order);

// Note: toSorted() may not be available in all browsers yet
```

---

## 🎯 Conclusion

**Status**: ✅ **FIXED**

Simple 1-line fix với spread operator để tạo mutable copy trước khi sort:
```typescript
[...block.children].sort(...)
```

**No more console errors!** ✅

---

**Fixed by**: GitHub Copilot  
**Date**: 12 tháng 10, 2025  
**Time to fix**: ~2 minutes  
**Complexity**: Low  
**Risk**: None
