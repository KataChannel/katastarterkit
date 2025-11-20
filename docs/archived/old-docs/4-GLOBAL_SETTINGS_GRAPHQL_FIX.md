# Global Settings Fix: REST API to GraphQL Migration

## Problem Summary
The frontend was trying to call a non-existent REST API endpoint `PATCH /api/pages/{pageId}` to save global page settings. The backend uses **GraphQL only** and does not have REST endpoints for page management.

## Root Cause Analysis
- **Frontend Expectation**: REST endpoint `PATCH /api/pages/{pageId}`
- **Backend Reality**: GraphQL mutations via `updatePage(id: String!, input: UpdatePageInput!)`
- **Result**: 404 Not Found errors when saving global settings

## Solution Implemented

### Changes Made

#### 1. **FullScreenLayout.tsx** - Replaced REST with GraphQL
**File**: `/frontend/src/components/page-builder/layout/FullScreenLayout.tsx`

**Before**: Used `fetch()` with REST API
```tsx
const response = await fetch(`/api/pages/${editingPage.id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
});
```

**After**: Uses GraphQL mutation via Apollo
```tsx
import { useMutation } from '@apollo/client';
import { UPDATE_PAGE } from '@/graphql/queries/pages';
import { UpdatePageInput } from '@/types/page-builder';

const [updatePageMutation] = useMutation(UPDATE_PAGE);

const handleSettingsSave = useCallback(async (settings: any) => {
  const updateInput: UpdatePageInput = {
    title: settings.pageTitle,
    slug: settings.pageSlug,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
    seoKeywords: settings.seoKeywords ? settings.seoKeywords.split(',').map((k: string) => k.trim()) : [],
  };

  await updatePageMutation({
    variables: {
      id: editingPage.id,
      input: updateInput,
    },
  });

  toast.success('Global settings saved successfully');
}, [editingPage?.id, updatePageMutation]);
```

**Key Changes**:
- Imported `useMutation` from `@apollo/client`
- Imported `UPDATE_PAGE` GraphQL mutation
- Imported `UpdatePageInput` type from types
- Replaced REST fetch with GraphQL mutation call
- Updated field mappings to match GraphQL schema
- Removed unsupported fields (isPublished, showInNavigation, etc.) that don't exist in UpdatePageInput

#### 2. **EditorToolbar.tsx** - Replaced REST loading with GraphQL query
**File**: `/frontend/src/components/page-builder/layout/EditorToolbar.tsx`

**Before**: Used `fetch()` to load page settings
```tsx
const loadPageSettings = async () => {
  const response = await fetch(`/api/pages/${pageId}`);
  const data = await response.json();
  // ... set state from response
};

useEffect(() => {
  if (isSettingsOpen && pageId) {
    loadPageSettings();
  }
}, [isSettingsOpen, pageId]);
```

**After**: Uses GraphQL query via Apollo
```tsx
import { useQuery } from '@apollo/client';
import { GET_PAGE_BY_ID } from '@/graphql/queries/pages';

const { data: pageData } = useQuery(GET_PAGE_BY_ID, {
  variables: { id: pageId },
  skip: !pageId,
  errorPolicy: 'all'
});

useEffect(() => {
  if (pageData?.getPageById) {
    const page = pageData.getPageById;
    setPageSettings(prev => ({
      ...prev,
      pageTitle: page.title || '',
      pageDescription: page.description || '',
      pageSlug: page.slug || '',
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || '',
      seoKeywords: Array.isArray(page.seoKeywords) ? page.seoKeywords.join(', ') : '',
    }));
  }
}, [pageData]);
```

**Key Changes**:
- Imported `useQuery` from `@apollo/client`
- Imported `GET_PAGE_BY_ID` GraphQL query
- Removed `loadPageSettings()` function
- Removed manual `useEffect` that called REST API
- Added `useQuery` to automatically load page data
- Added `useEffect` to update local state when data loads
- Cleaned up field mapping to use correct GraphQL field names

### Technical Details

#### GraphQL Query (Existing)
```graphql
query GetPageById($id: String!) {
  getPageById(id: $id) {
    id
    title
    slug
    description
    status
    seoTitle
    seoDescription
    seoKeywords
    createdAt
    updatedAt
    # ... more fields
  }
}
```

#### GraphQL Mutation (Existing)
```graphql
mutation UpdatePage($id: String!, $input: UpdatePageInput!) {
  updatePage(id: $id, input: $input) {
    id
    title
    slug
    content
    status
    seoTitle
    seoDescription
    seoKeywords
    # ... more fields
  }
}
```

#### UpdatePageInput Type
```typescript
export interface UpdatePageInput {
  title?: string;
  slug?: string;
  content?: any;
  status?: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  layoutSettings?: PageLayoutSettings;
}
```

## Supported Fields for Global Settings

The updated implementation now saves/loads:
- ✅ `title` (pageTitle)
- ✅ `slug` (pageSlug)
- ✅ `seoTitle`
- ✅ `seoDescription` (previously seoDescription)
- ✅ `seoKeywords` (as array)

**Note**: The following fields mentioned in the old REST design are NOT supported by the GraphQL schema:
- ❌ `description` (use `slug` or keep elsewhere)
- ❌ `isPublished` (not in UpdatePageInput)
- ❌ `showInNavigation` (not in UpdatePageInput)
- ❌ `allowIndexing` (not in UpdatePageInput)
- ❌ `requireAuth` (not in UpdatePageInput)
- ❌ `customCSS` (not in UpdatePageInput)
- ❌ `customJS` (not in UpdatePageInput)
- ❌ `headCode` (not in UpdatePageInput)

If these fields are needed, they should be added to the GraphQL schema first.

## Testing Instructions

1. **Frontend Dev Server**:
   ```bash
   cd frontend
   bun dev --port 12000
   ```

2. **Backend GraphQL Server** (should already be running):
   ```bash
   # Should be on localhost:12001
   # GraphQL endpoint: http://localhost:12001/graphql
   ```

3. **Test Global Settings Save**:
   - Open page builder: `http://localhost:12000/page-builder/page-product-default`
   - Click Settings icon
   - Edit page title, slug, SEO fields
   - Click "Save Settings"
   - Verify toast shows "Global settings saved successfully"
   - Reload page and verify settings persisted

## Backend Architecture

The backend uses:
- **Framework**: NestJS
- **API Type**: GraphQL (exclusive)
- **ORM**: Prisma
- **Database**: PostgreSQL

**Key Files**:
- Page Resolver: `/backend/src/graphql/resolvers/page.resolver.ts`
- Page Service: `/backend/src/services/page.service.ts`
- Page Input: `/backend/src/graphql/inputs/page.input.ts`
- Page Model: `/backend/src/graphql/models/page.model.ts`

## Migration Benefits

1. ✅ **Consistency**: Frontend now uses the same API pattern as rest of the app
2. ✅ **Error Handling**: Built-in Apollo error handling and caching
3. ✅ **Reactive Updates**: Automatic cache invalidation and refetch
4. ✅ **Type Safety**: Full TypeScript support for GraphQL queries/mutations
5. ✅ **Performance**: Automatic query caching and request deduplication

## Compilation Status

✅ **All files compile without errors**
- FullScreenLayout.tsx: No errors
- EditorToolbar.tsx: No errors
- All type imports and validations: Passed

## Next Steps

1. Verify settings save works end-to-end
2. If additional fields needed, update GraphQL schema
3. Consider adding validation/error messages
4. Test with edge cases (special characters, long strings, etc.)

## Related Documentation
- Previous files:
  - `BUG_FIXES_GLOBAL_BOOKMARKS.md` (phase 2)
  - Carousel enhancements (phase 1)
