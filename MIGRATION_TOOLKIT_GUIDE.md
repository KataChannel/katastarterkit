# 🎯 MIGRATION TOOLKIT - Complete Guide

## 📦 What's Included

Your complete migration toolkit contains:

1. ✅ **Auto Migration Script** - `scripts/auto-migrate-to-dynamic.js`
2. ✅ **Pattern Library** - Common migration patterns
3. ✅ **Step-by-Step Guide** - For manual migrations
4. ✅ **Validation Tools** - Compilation & testing
5. ✅ **Progress Tracker** - Track your migration journey

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Analyze Your Codebase
```bash
# See which files need migration
node scripts/migrate-to-dynamic-graphql.js --analyze frontend/src
```

### Step 2: Test the Tool (Dry Run)
```bash
# Test on a simple file first (no changes made)
node scripts/auto-migrate-to-dynamic.js --dry-run frontend/src/components/DynamicPageRenderer.tsx
```

### Step 3: Migrate Your First File
```bash
# Migrate a single file
node scripts/auto-migrate-to-dynamic.js frontend/src/components/lms/QuizTaker.tsx

# Review the .MIGRATED.tsx file created
# Check compilation
# Test manually
```

### Step 4: Batch Migration (Optional)
```bash
# Migrate all files in a directory
node scripts/auto-migrate-to-dynamic.js --batch frontend/src/components/lms

# Review all .MIGRATED.tsx files
# Test compilation: npm run build
# Deploy when ready
```

---

## 📋 Migration Workflow

### For Simple Files (⭐ 1-2 queries)

**Time:** 2-3 minutes per file

```bash
# 1. Dry run first
node scripts/auto-migrate-to-dynamic.js --dry-run <file>

# 2. If looks good, migrate
node scripts/auto-migrate-to-dynamic.js <file>

# 3. Review generated .MIGRATED.tsx
code <file>.MIGRATED.tsx

# 4. If good, replace original
mv <file> <file>.backup
mv <file>.MIGRATED.tsx <file>

# 5. Test
npm run build
```

### For Medium Files (⭐⭐ 2-4 queries/mutations)

**Time:** 5-8 minutes per file

```bash
# 1. Use tool as starting point
node scripts/auto-migrate-to-dynamic.js <file>

# 2. Manual refinement needed
# - Review TODO comments
# - Fix data structure compatibility
# - Add type annotations
# - Test edge cases

# 3. Validate
npm run build
npm run test <file>
```

### For Complex Files (⭐⭐⭐ 5+ queries, custom logic)

**Time:** 10-15 minutes per file

```bash
# 1. Manual migration recommended
# - Use patterns from this guide
# - Reference completed migrations
# - Add compatibility layers

# 2. Test thoroughly
# - Unit tests
# - Integration tests
# - Manual QA
```

---

## 🎓 Migration Patterns Reference

### Pattern 1: Simple List Query

**Before:**
```tsx
import { useQuery, gql } from '@apollo/client';

const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      status
    }
  }
`;

function MyComponent() {
  const { data, loading, error } = useQuery(GET_ITEMS);
  const items = data?.items || [];
  
  return <div>{items.map(item => ...)}</div>;
}
```

**After:**
```tsx
import { useFindMany } from '@/hooks/useDynamicGraphQL';

function MyComponent() {
  const { data: items = [], loading, error } = useFindMany('item', {
    select: { id: true, name: true, status: true }
  });
  
  return <div>{items.map(item => ...)}</div>;
}
```

**Savings:** ~20 lines

---

### Pattern 2: Query by ID/Slug

**Before:**
```tsx
const GET_ITEM_BY_SLUG = gql`
  query GetItemBySlug($slug: String!) {
    getItemBySlug(slug: $slug) {
      id
      name
      description
    }
  }
`;

const { data } = useQuery(GET_ITEM_BY_SLUG, {
  variables: { slug }
});
const item = data?.getItemBySlug;
```

**After:**
```tsx
const { data: item } = useFindUnique('item', 
  { slug },
  { select: { id: true, name: true, description: true } }
);
```

**Savings:** ~15 lines

---

### Pattern 3: Query with Filters

**Before:**
```tsx
const GET_ACTIVE_ITEMS = gql`
  query GetActiveItems {
    items(where: { status: "ACTIVE" }) {
      id
      name
    }
  }
`;

const { data } = useQuery(GET_ACTIVE_ITEMS);
```

**After:**
```tsx
const { data: items = [] } = useFindMany('item', {
  where: { status: 'ACTIVE' },
  select: { id: true, name: true }
});
```

**Savings:** ~12 lines

---

### Pattern 4: Query with Pagination

**Before:**
```tsx
const GET_ITEMS_PAGINATED = gql`
  query GetItems($page: Int!, $limit: Int!) {
    items(page: $page, limit: $limit) {
      items { id, name }
      total
      hasNext
    }
  }
`;

const { data } = useQuery(GET_ITEMS_PAGINATED, {
  variables: { page, limit }
});
```

**After:**
```tsx
const { data: items = [], loading } = useFindMany('item', {
  skip: (page - 1) * limit,
  take: limit,
  select: { id: true, name: true }
});

// Or use useFindManyPaginated for built-in pagination
const { data, meta, nextPage, prevPage } = useFindManyPaginated('item', {
  page,
  limit
});
```

**Savings:** ~18 lines

---

### Pattern 5: Create Mutation

**Before:**
```tsx
const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
    }
  }
`;

const [createItem] = useMutation(CREATE_ITEM);

await createItem({
  variables: {
    input: { name: 'New Item' }
  }
});
```

**After:**
```tsx
const [createItem] = useCreateOne('item');

await createItem({
  data: { name: 'New Item' }
});
```

**Savings:** ~12 lines

---

### Pattern 6: Update Mutation

**Before:**
```tsx
const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      name
    }
  }
`;

const [updateItem] = useMutation(UPDATE_ITEM);

await updateItem({
  variables: {
    id: '123',
    input: { name: 'Updated' }
  }
});
```

**After:**
```tsx
const [updateItem] = useUpdateOne('item');

await updateItem({
  where: { id: '123' },
  data: { name: 'Updated' }
});
```

**Savings:** ~12 lines

---

### Pattern 7: Delete Mutation

**Before:**
```tsx
const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

const [deleteItem] = useMutation(DELETE_ITEM);
await deleteItem({ variables: { id: '123' } });
```

**After:**
```tsx
const [deleteItem] = useDeleteOne('item');
await deleteItem({ where: { id: '123' } });
```

**Savings:** ~8 lines

---

### Pattern 8: Query with Relations (include)

**Before:**
```tsx
const GET_POST_WITH_AUTHOR = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      author {
        id
        name
      }
    }
  }
`;
```

**After:**
```tsx
const { data: post } = useFindUnique('post',
  { id },
  {
    select: {
      id: true,
      title: true,
      author: {
        select: { id: true, name: true }
      }
    }
  }
);
```

---

### Pattern 9: Keep Custom Mutations

**⚠️ Important:** Some mutations should NOT be migrated!

**Keep these as-is:**
```tsx
// Custom business logic mutations
const SYNC_DATA = gql`...`;
const BULK_IMPORT = gql`...`;
const GENERATE_REPORT = gql`...`;
const CUSTOM_ACTION = gql`...`;

// These are NOT CRUD operations - keep using useMutation
const [syncData] = useMutation(SYNC_DATA);
```

**Rule:** If mutation name contains: SYNC, BULK, BATCH, CUSTOM, EXPORT, IMPORT, GENERATE → Keep it!

---

## 🧪 Testing Checklist

After migrating a file:

### Compilation Test
```bash
# Check TypeScript compilation
npx tsc --noEmit <file>

# Or full build
npm run build
```

### Runtime Test
```bash
# Start dev server
npm run dev

# Test the page/component
# Check console for errors
# Verify data loads correctly
# Test all features
```

### Automated Tests
```bash
# Run unit tests
npm run test <file>

# Run integration tests
npm run test:e2e
```

---

## 📊 Progress Tracking

Use this template to track your migration:

```markdown
# Migration Progress

## Completed (X/38)
- [x] File 1 - Saved Y lines
- [x] File 2 - Saved Z lines
...

## In Progress
- [ ] File N - Currently migrating

## Pending
- [ ] Remaining files...

## Metrics
- Total files: 38
- Migrated: X (Y%)
- Lines saved: ~N lines
- Time spent: M hours
- Est. remaining: P hours
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Compilation Error - "Cannot find name"
**Solution:** Check import statements, ensure Dynamic GraphQL hooks are imported

### Issue 2: Data Structure Different
**Solution:** Add compatibility layer:
```tsx
// Wrap data to match old structure
const records = recordsResponse ? {
  items: Array.isArray(recordsResponse) ? recordsResponse : [],
  pagination: { ... }
} : null;
```

### Issue 3: Polling Not Working
**Solution:** Use Apollo query directly with FIND_UNIQUE operation:
```tsx
import { FIND_UNIQUE } from '@/graphql/dynamic/operations';

const { data, startPolling, stopPolling } = useQuery(FIND_UNIQUE, {
  variables: { model: 'item', where: { id } },
  fetchPolicy: 'network-only'
});
```

### Issue 4: Model Name Wrong
**Solution:** Check Prisma schema for exact model name (case-sensitive, singular)

---

## 📚 Additional Resources

- **Examples:** See `frontend/src/app/admin/callcenter/page.MIGRATED.tsx`
- **Hooks API:** See `frontend/src/hooks/useDynamicGraphQL.ts`
- **Full Guide:** Read `DYNAMIC_GRAPHQL_GUIDE.md`
- **Quick Reference:** See `DYNAMIC_GRAPHQL_QUICKSTART.md`

---

## 🎯 Next Steps

1. **Start with simple files** - Build confidence
2. **Use dry-run first** - Preview changes
3. **Test thoroughly** - Compilation + Runtime
4. **Deploy gradually** - One batch at a time
5. **Monitor** - Watch for errors in production

---

**Ready to migrate?** Pick your first file and go! 🚀

**Need help?** Check the examples and patterns above.

**Questions?** Review the documentation or test files.

Good luck! 💪
