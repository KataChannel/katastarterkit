# 🔧 PageBuilderContext Bug Fix

## 🐛 Bug Description

**Error**: `usePageBuilderContext must be used within PageBuilderProvider`

**Location**: `src/components/page-builder/PageBuilderProvider.tsx:923`

**Stack Trace**:
```
  921 |   const context = useContext(PageBuilderContext);
  922 |   if (!context) {
> 923 |     throw new Error('usePageBuilderContext must be used within PageBuilderProvider');
      |           ^
  924 |   }
  925 |   return context;
  926 | }
```

**Root Cause**: 
- `BlockRenderer` component uses `usePageBuilderContext()` hook
- `BlockRenderer` is used in **two contexts**:
  1. Inside PageBuilder (editor mode) - ✅ Has Provider
  2. In frontend pages (render mode) - ❌ **No Provider**

Specifically, `website/[slug]/page.tsx` renders BlockRenderer directly without PageBuilderProvider:

```tsx
// frontend/src/app/website/[slug]/page.tsx
export default function DynamicPage({ params }: DynamicPageProps) {
  // ... load page data
  
  return (
    <div>
      {page.blocks.map((block) => (
        <BlockRenderer  // ❌ No PageBuilderProvider here!
          key={block.id}
          block={block}
          isEditing={false}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
```

## ✅ Solution Implemented

### 1. **Export PageBuilderContext**

Make the context accessible for optional usage:

```typescript
// PageBuilderProvider.tsx (line 235)

// Before
const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);

// After
export const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);
```

### 2. **Make Context Optional in BlockRenderer**

Use `useContext` directly instead of `usePageBuilderContext` hook to avoid throwing error:

```typescript
// BlockRenderer.tsx

// Before
import { usePageBuilderContext } from '../PageBuilderProvider';

export const BlockRenderer: React.FC<BlockRendererProps> = ({ ... }) => {
  const { selectedBlockId } = usePageBuilderContext(); // ❌ Throws error if no provider
  const isSelected = selectedBlockId === block.id;
  // ...
}

// After
import { useContext } from 'react';
import { PageBuilderContext } from '../PageBuilderProvider';

export const BlockRenderer: React.FC<BlockRendererProps> = ({ ... }) => {
  // Get selected block ID from context for visual highlighting (optional - for editor only)
  const context = useContext(PageBuilderContext);
  const selectedBlockId = context?.selectedBlockId; // ✅ Returns undefined if no provider
  const isSelected = selectedBlockId === block.id;
  // ...
}
```

### Key Changes:

1. **Direct `useContext` call**: Instead of custom hook
2. **Optional chaining**: `context?.selectedBlockId` handles undefined gracefully
3. **No error thrown**: Component works with or without provider

## 📊 Behavior Comparison

### Before Fix:

| Context | Has Provider? | Result |
|---------|---------------|--------|
| Page Builder (editor) | ✅ Yes | ✅ Works |
| Frontend page (render) | ❌ No | ❌ **Error: must be within Provider** |

### After Fix:

| Context | Has Provider? | Result |
|---------|---------------|--------|
| Page Builder (editor) | ✅ Yes | ✅ Works (selection highlighting enabled) |
| Frontend page (render) | ❌ No | ✅ **Works (no selection highlighting)** |

## 🎯 Use Cases

### Use Case 1: Page Builder Editor (with Provider)

```tsx
import PageBuilder from '@/components/page-builder/PageBuilder';

function PageBuilderPage() {
  return <PageBuilder pageId="123" />;
}

// PageBuilder wraps content with PageBuilderProvider
// → BlockRenderer has access to context
// → Selection highlighting works
// → Edit mode features enabled
```

### Use Case 2: Frontend Rendering (without Provider)

```tsx
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer';

function DynamicPage({ page }) {
  return (
    <div>
      {page.blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          isEditing={false}  // View mode
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}

// No PageBuilderProvider needed
// → BlockRenderer still renders correctly
// → No selection highlighting (context is undefined)
// → View-only mode
```

## 🔍 Technical Details

### Why This Works:

1. **Optional Context Access**:
   ```typescript
   const context = useContext(PageBuilderContext);
   // Returns: PageBuilderContextType | undefined
   
   const selectedBlockId = context?.selectedBlockId;
   // Returns: string | undefined (safe)
   ```

2. **Graceful Degradation**:
   ```typescript
   const isSelected = selectedBlockId === block.id;
   // When context is undefined:
   // selectedBlockId = undefined
   // isSelected = false (correct - nothing is selected)
   ```

3. **No Breaking Changes**:
   - Editor mode: Still works exactly the same
   - Frontend mode: Now works instead of crashing
   - API unchanged: All props still work

### Why Not Just Remove the Error?

We **could** make `usePageBuilderContext` not throw:

```typescript
export function usePageBuilderContext() {
  const context = useContext(PageBuilderContext);
  // Just return context (even if undefined)
  return context;
}
```

But this would:
- ❌ Break type safety (consumers expect non-nullable)
- ❌ Hide bugs in editor components that actually need the context
- ❌ Make debugging harder

**Better solution**: Use context directly in components that can work without it (like BlockRenderer).

## 🧪 Testing

### Test Case 1: Editor Mode ✅

```tsx
// Should work with selection highlighting
<PageBuilderProvider pageId="123">
  <BlockRenderer block={block} isEditing={true} ... />
</PageBuilderProvider>

// Expected:
// - context defined
// - selectedBlockId available
// - Selection highlighting works
```

### Test Case 2: Frontend Mode ✅

```tsx
// Should work without provider
<BlockRenderer block={block} isEditing={false} ... />

// Expected:
// - context undefined
// - selectedBlockId undefined
// - No selection highlighting (acceptable)
// - Block renders correctly
```

### Test Case 3: Other Components ✅

```tsx
// Components that REQUIRE context should still throw
<PageBuilderCanvas />  // ❌ Must be within provider

// Expected error:
// "usePageBuilderContext must be used within PageBuilderProvider"
```

## 📝 Files Modified

1. **`/frontend/src/components/page-builder/PageBuilderProvider.tsx`**
   - Line 235: Export `PageBuilderContext`
   - Change: `const` → `export const`

2. **`/frontend/src/components/page-builder/blocks/BlockRenderer.tsx`**
   - Line 3: Import `PageBuilderContext` and `useContext`
   - Line 46-48: Use optional context access
   - Before: `usePageBuilderContext()` (throws if no provider)
   - After: `useContext(PageBuilderContext)` (returns undefined if no provider)

## 🎉 Benefits

1. **Flexibility**: BlockRenderer can be used anywhere
2. **No Breaking Changes**: All existing code still works
3. **Better UX**: Frontend pages don't crash
4. **Type Safety**: Still type-safe with optional chaining
5. **Minimal Changes**: Only 2 files modified, 3 lines changed

## 🔗 Related Components

### Components That Work Without Provider ✅

- `BlockRenderer` - Now works in both contexts
- All block components (TextBlock, ImageBlock, etc.) - Don't use context

### Components That Require Provider ❌

- `PageBuilderCanvas` - Uses `usePageBuilderContext`
- `PageBuilderHeader` - Uses `usePageBuilderContext`
- `PageBuilderSidebar` - Uses `usePageBuilderContext`
- `RightPanel` - Uses `usePageBuilderContext`
- `LeftPanel` components - Use `usePageBuilderContext`

These components **should** throw error if used without provider because they're editor-only.

## 💡 Best Practices

### DO ✅

```typescript
// Use context directly for optional features
const context = useContext(PageBuilderContext);
const someValue = context?.someProperty;

// Use custom hook when context is required
const { blocks, handleAddBlock } = usePageBuilderContext();
```

### DON'T ❌

```typescript
// Don't remove error check from usePageBuilderContext
export function usePageBuilderContext() {
  const context = useContext(PageBuilderContext);
  return context; // ❌ Bad: breaks type safety
}

// Don't access context properties without checking
const context = useContext(PageBuilderContext);
const value = context.someProperty; // ❌ Might crash if undefined
```

## 📚 Future Enhancements

Potential improvements:

1. **Separate Contexts**:
   ```typescript
   // Editor features only
   const EditorContext = createContext(...);
   
   // Rendering features only
   const RenderContext = createContext(...);
   ```

2. **Mode Detection**:
   ```typescript
   const { isEditorMode } = useRenderMode();
   
   if (isEditorMode) {
     const { selectedBlockId } = usePageBuilderContext();
   }
   ```

3. **HOC Wrapper**:
   ```typescript
   export const withEditor = (Component) => (props) => (
     <PageBuilderProvider>
       <Component {...props} />
     </PageBuilderProvider>
   );
   ```

---

**Status**: ✅ **FIXED** - BlockRenderer now works with or without PageBuilderProvider  
**Impact**: High - Enables frontend page rendering  
**Breaking Changes**: None - Fully backward compatible

**Author**: AI Assistant  
**Date**: October 18, 2025  
**Version**: 1.0.0
