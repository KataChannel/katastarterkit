# Page Builder Title & Slug Display - Complete Fix

## Problem
Title and Slug were not displaying in the EditorToolbar when opening a page with `?pageId=...` without needing F5 refresh.

## Root Causes Identified

### 1. **PageStateContext - Conditional Render Issue**
The initialization condition had a flaw:
```tsx
// BEFORE (problematic)
else if (isNewPageMode && !editingPage && !page)
```
This meant that if `page` hadn't loaded yet but `isNewPageMode = false`, the editingPage would never be set.

### 2. **EditorToolbar - Conditional Rendering**
The display had unnecessary conditional logic:
```tsx
// BEFORE (problematic)
{(editingPage?.title || editingPage?.slug) && (
  // ... render
)}
```
This only rendered if title OR slug existed, but for new pages with default "Untitled Page", it should still display.

### 3. **Missing useEffect Dependency**
`isNewPageMode` wasn't synced with `pageId` changes properly.

## Solutions Applied

### Fix 1: PageStateContext.tsx (Lines 40-102)

**Enhanced initialization logic:**
```tsx
// Added explicit sync of isNewPageMode with pageId
useEffect(() => {
  setIsNewPageMode(!pageId);
}, [pageId]);

// Improved initialization with better logging
useEffect(() => {
  console.log('PageStateContext effect:', { page, editingPage, isNewPageMode, pageId });
  
  if (page) {
    // EDIT mode: Load existing page
    console.log('Setting existing page:', page.title);
    setEditingPageState(page);
  } else if (isNewPageMode && !editingPage) {
    // CREATE mode: Initialize with defaults
    console.log('Initializing new page');
    const newPage: Page = {
      id: '',
      title: 'Untitled Page',
      slug: '',
      content: {},
      status: PageStatus.DRAFT,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      blocks: [],
      layoutSettings: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingPageState(newPage);
  }
}, [page, pageId, isNewPageMode]); // Fixed dependencies
```

**Key Changes:**
- Added separate `useEffect` to sync `isNewPageMode` with `pageId`
- Changed dependency from `editingPage` to `pageId` (prevents circular dependencies)
- Added console logging for debugging
- Removed problematic `&& !page` condition

### Fix 2: EditorToolbar.tsx (Lines 305-340)

**Improved display logic:**
```tsx
{/* Page Title & Slug Display - Always show if editingPage exists */}
{editingPage && (
  <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded border border-gray-200 min-w-max">
    <div className="flex flex-col gap-0.5">
      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
        {editingPage.title || 'Untitled Page'}
      </div>
      {editingPage.slug && (
        <div className="text-xs text-gray-500 truncate max-w-xs">
          /{editingPage.slug}
        </div>
      )}
    </div>
  </div>
)}
```

**Key Changes:**
- Removed complex conditional `(editingPage?.title || editingPage?.slug)`
- Changed to simple check: `{editingPage &&`
- Always display title with fallback: `{editingPage.title || 'Untitled Page'}`
- Slug only displays if it exists
- Added `min-w-max` to prevent width collapsing

## Data Flow After Fixes

```
1. User opens: /admin/pagebuilder?pageId=5be6fa86-dd04-42e3-85a0-4467b6014d25

2. FullScreenPageBuilder receives pageId
   ↓
3. PageStateProvider initializes with pageId
   ↓
4. usePage(pageId) hook loads page data from GraphQL
   ↓
5. PageStateContext useEffect detects page loaded
   ↓
6. setEditingPageState(page) called
   ↓
7. EditorToolbar receives updated editingPage from context
   ↓
8. Title & Slug display immediately without F5
```

## Testing Checklist

- [x] Create new page (no pageId) - Shows "Untitled Page"
- [x] Edit existing page (with pageId) - Shows page title and slug immediately
- [x] No need to F5 refresh
- [x] TypeScript compilation passes
- [x] Console logs show proper flow

## Files Modified

1. `/frontend/src/components/page-builder/contexts/PageStateContext.tsx`
   - Lines 40-102: Fixed initialization logic

2. `/frontend/src/components/page-builder/layout/EditorToolbar.tsx`
   - Lines 305-340: Improved display rendering

## Result

✅ Title and Slug now display immediately when opening a page with `?pageId=...`
✅ No refresh needed
✅ Works for both new pages and existing pages
✅ Console logging available for debugging
