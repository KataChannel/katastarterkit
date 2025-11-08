# PageBuilder: Apollo → Server Actions Migration

## ✅ FINAL FIX: Infinite Loop Resolved

### 🎯 Root Cause
The project has **fully migrated from Apollo Client to Next.js Server Actions**, but `PageStateContext` was still using the deprecated Apollo `usePage` hook.

**Problem:**
- Apollo's `usePage` hook returns unstable `refetch` function
- This function changes reference on every render
- When included in dependency arrays, it causes infinite loops
- Project architecture has moved away from GraphQL to Server Actions

### ✅ Complete Solution

**Migrated `PageStateContext.tsx` from Apollo to Server Actions:**

#### Before (Apollo Client):
```typescript
import { usePage } from '@/hooks/usePageBuilder'; // ❌ Apollo hook

const { page, loading, refetch } = usePage(pageId);
// ❌ refetch is unstable, causes infinite loops
```

#### After (Server Actions):
```typescript
import { getPageById } from '@/actions/page.actions'; // ✅ Server Action

// State management
const [page, setPage] = useState<Page | null>(null);
const [loading, setLoading] = useState(false);

// Store pageId in ref for stable refetch
const pageIdRef = React.useRef(pageId);
React.useEffect(() => {
  pageIdRef.current = pageId;
}, [pageId]);

// Fetch page when pageId changes
useEffect(() => {
  if (pageId) {
    setIsNewPageMode(false);
    setLoading(true);
    
    getPageById(pageId)
      .then((fetchedPage) => {
        setPage(fetchedPage as Page | null);
      })
      .catch((error) => {
        console.error('[PageStateContext] Error fetching page:', error);
        setPage(null);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    setIsNewPageMode(true);
    setPage(null);
    setLoading(false);
  }
}, [pageId]); // ✅ Only primitive dependency - stable!

// Stable refetch function
const stableRefetch = useCallback(async () => {
  const currentPageId = pageIdRef.current;
  if (!currentPageId) return;
  
  try {
    setLoading(true);
    const fetchedPage = await getPageById(currentPageId);
    setPage(fetchedPage as Page | null);
  } catch (error) {
    console.error('[PageStateContext] Error refetching page:', error);
  } finally {
    setLoading(false);
  }
}, []); // ✅ Empty deps - NEVER changes!
```

### 🎯 Why This Works

1. **No Apollo Complexity**
   - Server Actions are simple async functions
   - No GraphQL cache management
   - No unstable function references

2. **Stable Dependencies**
   - `pageId` is a primitive string → stable reference
   - `useRef` stores values without triggering re-renders
   - `useCallback` with empty deps → function never recreated

3. **Clean Data Flow**
   - `pageId` changes → useEffect runs
   - Fetch data with Server Action
   - Update local state
   - No side effects, no loops

### 📊 Benefits

✅ **No more infinite loops** - All dependencies are stable
✅ **Simpler code** - No Apollo boilerplate
✅ **Better performance** - Direct database queries via Prisma
✅ **Type safety** - Full TypeScript support with Server Actions
✅ **Modern architecture** - Aligned with Next.js 14+ best practices

### 📝 Files Modified

1. **`/frontend/src/components/page-builder/contexts/PageStateContext.tsx`**
   - ❌ Removed: `import { usePage } from '@/hooks/usePageBuilder'`
   - ✅ Added: `import { getPageById } from '@/actions/page.actions'`
   - Replaced Apollo hook with direct Server Action calls
   - Implemented stable refetch using useRef pattern

### 🧪 Testing

1. Navigate to: `http://localhost:14000/admin/pagebuilder`
2. Click "New Page" button
3. Verify in browser console:
   - ✅ No repeated render logs
   - ✅ Editor loads instantly
   - ✅ Can add blocks and edit
   - ✅ Save functionality works

### 🎓 Key Learnings

**Avoid unstable dependencies in React hooks:**
- Apollo/GraphQL hooks return new function references
- Always check if functions in deps can change
- Use `useRef` to store values without re-renders
- Server Actions > Apollo Client for Next.js projects

**Migration best practices:**
- Replace deprecated hooks systematically
- Test each context/component after migration
- Keep documentation updated
- Remove old dependencies from package.json

## 🚀 Next Steps

Consider removing Apollo Client completely if no longer needed:
```bash
npm uninstall @apollo/client graphql
```

Update all remaining components using Apollo hooks to Server Actions.
