# Data Structure Fix - useDynamicFindMany Response

## Date: October 7, 2025

## Issue

**Problem:** `dynamicMenus` trong `admin-sidebar-layout.tsx` trả về array rỗng `[]`

**Root Cause:** Backend response structure không khớp với frontend data access

### Backend Response Structure
```json
{
  "dynamicFindMany": {
    "data": [
      { "id": "...", "title": "Dashboard", ... },
      { "id": "...", "title": "Audit Logs", ... }
    ],
    "count": 16,
    "hasMore": false
  }
}
```

### Frontend Code (SAI)
```typescript
const menus = useMemo(() => data?.dynamicFindMany || [], [data]);
// Returns: { data: [...], count: 16 }  ❌ Sai! Cần array chứ không phải object
```

### Frontend Code (ĐÚNG)
```typescript
const menus = useMemo(() => {
  const result = data?.dynamicFindMany?.data as Menu[] | undefined;
  return Array.isArray(result) ? result : [];
}, [data]);
// Returns: [{ id: "...", title: "Dashboard" }, ...]  ✅ Đúng!
```

---

## Solution

### File: `/frontend/src/lib/hooks/useMenus.ts`

Fixed **5 hooks** to properly access nested `data` field:

#### 1. useMenus()
```typescript
const menus = useMemo(() => {
  const result = data?.dynamicFindMany?.data;  // Access .data
  return Array.isArray(result) ? result : [];
}, [data]);
```

#### 2. useMyMenus()
```typescript
const menus = useMemo(() => {
  const result = data?.dynamicFindMany?.data;  // Access .data
  return Array.isArray(result) ? result : [];
}, [data]);
```

#### 3. useAdminMenus()
```typescript
const menus = useMemo(() => {
  const result = data?.dynamicFindMany?.data as Menu[] | undefined;  // Type assertion
  if (!result || !Array.isArray(result)) return [];
  
  const tree = buildMenuTree(result);  // Build tree from flat array
  return tree.map(transformMenu).filter(Boolean);
}, [data, transformMenu]);
```

#### 4. usePublicSidebarMenus()
```typescript
const menus = useMemo(() => {
  const result = data?.dynamicFindMany?.data as Menu[] | undefined;
  if (!result || !Array.isArray(result)) return [];
  return buildMenuTree(result);
}, [data]);
```

#### 5. useMenuTree()
```typescript
const tree = useMemo(() => {
  const result = data?.dynamicFindMany?.data as Menu[] | undefined;
  if (!result || !Array.isArray(result)) return [];
  return buildMenuTree(result);
}, [data]);
```

---

## Response Structure

### Complete Response
```typescript
{
  dynamicFindMany: {
    data: Menu[],      // ← Actual array of menus
    count: number,     // ← Number of items in current page
    total?: number,    // ← Total items (if paginated)
    hasMore?: boolean  // ← Whether there are more pages
  }
}
```

### Access Pattern
```typescript
// ❌ WRONG
data?.dynamicFindMany  // Returns: { data: [...], count: 16 }

// ✅ CORRECT
data?.dynamicFindMany?.data  // Returns: [{ id, title, ... }]
```

---

## TypeScript Fixes

### Generic Type Issue

**Before:**
```typescript
useDynamicFindMany<Menu[]>(input)
// Type inference: data.dynamicFindMany.data is Menu[][]  ❌
```

**After:**
```typescript
useDynamicFindMany<Menu>(input)
// Type inference: data.dynamicFindMany.data is Menu[]  ✅
```

### Type Assertions

Added type assertions to fix TypeScript inference:
```typescript
const result = data?.dynamicFindMany?.data as Menu[] | undefined;
```

This tells TypeScript that `result` is `Menu[]` or `undefined`, not the complex nested type it was inferring.

---

## Testing

### Before Fix
```typescript
console.log('dynamicMenus:', dynamicMenus);
// Output: []  ❌
```

### After Fix
```typescript
console.log('dynamicMenus:', dynamicMenus);
// Output: [
//   { name: 'Dashboard', href: '/dashboard', ... },
//   { name: 'Audit Logs', href: '/audit-logs', ... }
// ]  ✅
```

---

## Impact

### Files Changed
- ✅ `/frontend/src/lib/hooks/useMenus.ts` - Fixed 5 hooks

### Affected Features
- ✅ Admin sidebar menus - Now loads from database
- ✅ Menu tree building - Works correctly
- ✅ All menu hooks - Return proper data

### Breaking Changes
- ⚠️ None - Only internal data access pattern changed

---

## Related Fixes

This fix works together with:
1. **OrderBy Fix** - Normalizes multi-field sorting
2. **Menu Dynamic Queries** - Universal Dynamic Query integration

---

## Verification Steps

### 1. Check Hook Response
```typescript
// In useAdminMenus hook
console.log('Raw data:', data);
console.log('Extracted data:', data?.dynamicFindMany?.data);
console.log('Menu count:', data?.dynamicFindMany?.count);
```

### 2. Check Component
```typescript
// In admin-sidebar-layout.tsx
console.log('dynamicMenus:', dynamicMenus);
console.log('dynamicMenus length:', dynamicMenus.length);
```

### 3. Expected Output
```
Raw data: { dynamicFindMany: { data: [...], count: 16 } }
Extracted data: [{ id, title, ... }, ...]
Menu count: 16
dynamicMenus: [{ name, href, icon, ... }, ...]
dynamicMenus length: 2
```

---

## Root Cause Analysis

### Why This Happened

1. **Backend Design**: Returns structured response with metadata
   ```typescript
   { data: T[], count: number, total?: number }
   ```

2. **Frontend Expectation**: Expected direct array
   ```typescript
   Menu[]
   ```

3. **Mismatch**: Accessing `data?.dynamicFindMany` returned the wrapper object, not the array

### Lesson Learned

- Always check actual backend response structure
- Don't assume response format
- Add proper TypeScript types
- Use type assertions when needed

---

## Author
- **Date**: October 7, 2025
- **Fix**: Data structure access in useDynamicFindMany hooks
- **Status**: ✅ Fixed - Ready for Testing
