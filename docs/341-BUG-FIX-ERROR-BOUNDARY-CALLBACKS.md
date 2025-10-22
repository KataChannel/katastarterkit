# Fix: Error Boundary Callbacks TypeError - Admin Sidebar Layout

## Problem Summary

**Error**: `TypeError: Cannot read properties of undefined (reading 'call') at options.factory (runtime.js?v=...)`

**Location**: Webpack module loading during build/runtime, triggered when loading admin-sidebar-layout.tsx

**Root Cause**: Circular dependency in the graphql hooks chain:
- `admin-sidebar-layout.tsx` → imports `useAdminMenus` 
- `useAdminMenus` → imported from `useMenus.ts`
- `useMenus.ts` → imported `useDynamicFindMany` from `universal-dynamic-hooks.ts`
- `universal-dynamic-hooks.ts` → re-exported many complex hooks with potential circular references

This caused webpack to fail module factory function initialization, resulting in "Cannot read properties of undefined" when trying to `.call()` an undefined module.

## Solution Implemented

### 1. **Direct Apollo Integration** 
Instead of using the wrapper hooks from `universal-dynamic-hooks.ts`, we now import directly from `@apollo/client`:
```typescript
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { DYNAMIC_FIND_MANY, DYNAMIC_CREATE, DYNAMIC_UPDATE, DYNAMIC_DELETE } from '../graphql/universal-dynamic-queries';
```

### 2. **Simplified Hook Structure**
All menu hooks now use direct `useQuery()` and `useMutation()` calls:
```typescript
export function useAdminMenus() {
  const { data, loading, error, refetch } = useQuery(DYNAMIC_FIND_MANY, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  // ... rest of logic
}
```

### 3. **Enhanced Error Handling**
Added try-catch blocks in all transformations and data extractions:
```typescript
const menus = useMemo(() => {
  try {
    const result = data?.dynamicFindMany?.data as Menu[] | undefined;
    if (!result || !Array.isArray(result)) return [];
    const tree = buildMenuTree(result);
    return tree.map(transformMenu).filter(Boolean);
  } catch (err) {
    console.error('Error transforming menus:', err);
    return [];
  }
}, [data, transformMenu]);
```

### 4. **Removed Problematic Imports**
Removed all imports from `universal-dynamic-hooks.ts`:
- ❌ `useDynamicFindMany`
- ❌ `useDynamicFindUnique`
- ❌ `useDynamicCreate`
- ❌ `useDynamicUpdate`
- ❌ `useDynamicDelete`
- ❌ `useDynamicCount`

These were causing circular dependencies that prevented webpack from properly initializing module factories.

## Files Changed

### `/mnt/chikiet/kataoffical/fullstack/katacore/frontend/src/lib/hooks/useMenus.ts`
- **Before**: 358 lines with wrapper hooks causing circular dependencies
- **After**: 366 lines with direct Apollo integration and proper error handling
- **Changes**:
  - Removed `universal-dynamic-hooks` imports
  - Added direct Apollo imports
  - Rewrote all hooks to use `useQuery()` and `useMutation()` directly
  - Added try-catch error handling throughout
  - Enhanced console logging for debugging

## Key Improvements

1. **Eliminates Circular Dependencies**: No longer relies on the problematic `universal-dynamic-hooks` wrapper
2. **Direct Control**: Uses Apollo Client directly for more predictable behavior
3. **Better Error Handling**: Try-catch blocks prevent cascading failures
4. **Faster Load Time**: Fewer module layers to resolve at runtime
5. **Improved Debuggability**: Direct Apollo usage makes it easier to trace issues

## Testing

✅ **Compilation**: All TypeScript errors resolved
✅ **No Build Errors**: Frontend compiles without webpack errors
✅ **Admin Layout**: Components load without error-boundary-callbacks errors
✅ **Error Boundaries**: ErrorBoundary component in place for runtime fallback

## How to Verify the Fix

1. **Start the dev server**:
   ```bash
   cd frontend && npm run dev
   ```

2. **Navigate to admin area**:
   - Go to `http://localhost:3000/admin`
   - Should load without the "Cannot read properties of undefined" error

3. **Check console**:
   - Should show menu items loading normally
   - No errors in browser console about module factories

4. **Fallback verification**:
   - Even if something fails, the ErrorBoundary will catch it and show a user-friendly message

## Related Files

- ✅ `admin-sidebar-layout.tsx` - Uses `useAdminMenus()` 
- ✅ `admin/layout.tsx` - Wraps admin content with authentication
- ✅ `providers.tsx` - Wraps app with ApolloProvider and ErrorBoundary
- ✅ `ErrorBoundary.tsx` - Catches runtime errors gracefully

## Backward Compatibility

The old `universal-dynamic-hooks.ts` file still exists and can be used in other parts of the application. This fix only affects menu-related hooks.

## Recommendations for Future

1. **Audit Other Hooks**: Review other hooks that import from `universal-dynamic-hooks.ts` for similar issues
2. **Consider Consolidation**: Merge `universal-dynamic-hooks.ts` directly into component files to avoid wrapper layers
3. **Add Barrel Exports**: Use `index.ts` files properly to manage circular dependencies
4. **Type Safety**: Consider using TypeScript strict mode to catch more issues at compile time

## Production Readiness

✅ All compilation errors resolved
✅ Error boundaries in place
✅ No breaking changes to API
✅ Ready for production deployment
