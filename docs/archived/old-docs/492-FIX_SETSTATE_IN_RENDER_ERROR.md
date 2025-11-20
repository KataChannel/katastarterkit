# 🐛 FIX: React setState-in-render Error - Menu Redirect

## ✅ Vấn Đề Đã Fix

**Error:**
```
Cannot update a component (`Router`) while rendering a different component (`DynamicPage`). 
To locate the bad setState() call inside `DynamicPage`, follow the stack trace.
```

**Location:** `src/app/(website)/[slug]/page.tsx:194`

## 🔍 Root Cause

Gọi `router.push()` **trực tiếp trong render phase** của React component → Vi phạm React rules.

### Code Cũ (WRONG ❌)
```typescript
// Trong component body (render phase)
if (menuData?.menuBySlug) {
  const menu = menuData.menuBySlug;
  
  // ❌ BAD: setState (router.push) during render!
  if (menu.linkType === 'BLOG_DETAIL' && menu.customData?.blogPostSlug) {
    const blogUrl = `/bai-viet/${menu.customData.blogPostSlug}`;
    router.push(blogUrl);  // ❌ Causing error!
    
    return <LoadingSpinner />;
  }
}
```

**Vấn đề:**
- `router.push()` trigger state update trong Next.js Router
- Gọi trong render phase → React warning/error
- Violates React one-way data flow

## ✅ Solution

Dùng `useEffect` để thực hiện redirect **sau khi render**:

### Code Mới (CORRECT ✅)
```typescript
// 1. useEffect hook - runs AFTER render
useEffect(() => {
  if (menuData?.menuBySlug) {
    const menu = menuData.menuBySlug;

    // ✅ GOOD: setState in useEffect (side effect)
    if (menu.linkType === 'BLOG_DETAIL' && menu.customData?.blogPostSlug) {
      const blogUrl = `/bai-viet/${menu.customData.blogPostSlug}`;
      router.push(blogUrl);
      return;
    }

    if (menu.linkType === 'PRODUCT_DETAIL' && menu.customData?.productSlug) {
      const productUrl = `/san-pham/${menu.customData.productSlug}`;
      router.push(productUrl);
      return;
    }
  }
}, [menuData, router]);

// 2. Render loading state while redirect is happening
if (menuData?.menuBySlug) {
  const menu = menuData.menuBySlug;
  
  if (!menu.isActive) {
    return notFound();
  }

  // Show loading during redirect
  if (
    (menu.linkType === 'BLOG_DETAIL' && menu.customData?.blogPostSlug) ||
    (menu.linkType === 'PRODUCT_DETAIL' && menu.customData?.productSlug)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {menu.linkType === 'BLOG_DETAIL' 
              ? 'Đang chuyển hướng tới bài viết...' 
              : 'Đang chuyển hướng tới sản phẩm...'}
          </p>
        </div>
      </div>
    );
  }
}
```

## 📝 Changes Made

### File: `/frontend/src/app/(website)/[slug]/page.tsx`

**Lines ~180-220:** Refactored redirect logic

**Before:**
- Direct `router.push()` call in component body
- Conditional rendering based on linkType
- Two separate redirect blocks (BLOG_DETAIL, PRODUCT_DETAIL)

**After:**
- `useEffect` hook handles all redirects
- Single check for loading state
- Cleaner separation: logic vs render
- Dependencies: `[menuData, router]`

## 🎯 Benefits

1. **No React Warnings** - Follows React rules for state updates
2. **Better UX** - Loading state shows before redirect happens
3. **Cleaner Code** - Separation of concerns (effect vs render)
4. **Type Safety** - No conditional `window` checks needed

## 🔄 Flow Explanation

### Old Flow (Problematic)
```
1. Component renders
2. Check menuData → found redirect
3. Call router.push() ← ❌ setState during render!
4. Return loading UI
5. React throws warning
```

### New Flow (Correct)
```
1. Component renders
2. Check menuData → show loading UI
3. Render completes
4. useEffect runs after render
5. Call router.push() ← ✅ Safe in effect!
6. Router navigates to new page
```

## ✅ Testing

### Test Cases
```bash
# 1. Menu redirect to blog
http://localhost:12000/ve-chung-toi
Expected: Loading → Redirect to /bai-viet/cung-cap-rau-cho-nha-hang

# 2. Menu redirect to product (if configured)
http://localhost:12000/[menu-slug-with-product]
Expected: Loading → Redirect to /san-pham/[product-slug]

# 3. Normal page (no redirect)
http://localhost:12000/[page-slug]
Expected: Render page content normally
```

### Verification Checklist
- [x] No React warnings in console
- [x] Redirects work correctly
- [x] Loading state shows briefly
- [x] No TypeScript errors
- [x] Build successful

## 📊 Impact

**Before:**
- ⚠️ React warning in console
- ⚠️ Potential future React strict mode errors
- ⚠️ Violates React patterns

**After:**
- ✅ Clean console (no warnings)
- ✅ Follows React best practices
- ✅ Safe for React 18+ strict mode
- ✅ Better code maintainability

## 📌 Related Documentation

- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [Next.js: useRouter Hook](https://nextjs.org/docs/app/api-reference/functions/use-router)

## 🛠️ Related Fixes

This is part of the menu system improvements session:

1. ✅ Routes Standardization
2. ✅ GraphQL customData Error
3. ✅ GraphQL Schema Missing Fields
4. ✅ Menu Selector Bug
5. ✅ Blog Detail 404 Error (data field name)
6. ✅ **setState-in-render Error** (THIS FIX)

---

**Fix Date:** November 6, 2025  
**Fixed By:** GitHub Copilot  
**Severity:** Medium (Warning but can cause issues in production)  
**Status:** ✅ Fixed & Verified
