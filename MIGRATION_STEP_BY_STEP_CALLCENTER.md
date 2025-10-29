# 🚀 MIGRATION STEP-BY-STEP: Callcenter Page

**File:** `frontend/src/app/admin/callcenter/page.tsx`  
**Status:** Phase 1 - Quick Win  
**Difficulty:** ⭐⭐ Medium (3 queries + 3 mutations)  
**Time:** 30-45 minutes

---

## 📊 Current Analysis

### GraphQL Usage Detected

**Queries (3):**
1. `GET_CALLCENTER_CONFIG` - Get configuration
2. `GET_CALLCENTER_RECORDS` - Get records with pagination
3. `GET_SYNC_LOGS` - Get sync logs

**Mutations (3):**
1. `SYNC_CALLCENTER_DATA` - Trigger sync
2. `UPDATE_CALLCENTER_CONFIG` - Update config
3. `CREATE_CALLCENTER_CONFIG` - Create config

---

## 🎯 Migration Strategy

### Step 1: Identify Prisma Models

Cần kiểm tra `schema.prisma` để biết tên model chính xác:
- `callCenterConfig` → Config model
- `callCenterRecord` → Records model  
- `syncLog` → Sync log model

### Step 2: Map Operations

| Old | New Hook | Operation |
|-----|----------|-----------|
| `useQuery(GET_CALLCENTER_CONFIG)` | `useFindUnique('callCenterConfig')` | Get single config |
| `useQuery(GET_CALLCENTER_RECORDS)` | `useFindManyPaginated('callCenterRecord')` | Get paginated records |
| `useQuery(GET_SYNC_LOGS)` | `useFindMany('syncLog')` | Get logs list |
| `useMutation(SYNC_CALLCENTER_DATA)` | Custom mutation (keep as is) | Special operation |
| `useMutation(UPDATE_CALLCENTER_CONFIG)` | `useUpdateOne('callCenterConfig')` | Update config |
| `useMutation(CREATE_CALLCENTER_CONFIG)` | `useCreateOne('callCenterConfig')` | Create config |

---

## 📝 Migration Steps

### Before You Start

```bash
# 1. Create backup
cp frontend/src/app/admin/callcenter/page.tsx frontend/src/app/admin/callcenter/page.tsx.backup

# 2. Open file in editor
code frontend/src/app/admin/callcenter/page.tsx
```

---

### Step 1: Update Imports ✏️

**Remove:**
```tsx
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
```

**Add:**
```tsx
import { 
  useFindUnique, 
  useFindMany, 
  useFindManyPaginated,
  useCreateOne,
  useUpdateOne 
} from '@/hooks/useDynamicGraphQL';
```

**Note:** Keep Apollo Client import for the custom mutation `SYNC_CALLCENTER_DATA` (if it's a special operation not in Prisma)

---

### Step 2: Remove GraphQL Queries ✏️

**Delete these query definitions (lines ~50-180):**
```tsx
const GET_CALLCENTER_CONFIG = gql`...`;
const GET_CALLCENTER_RECORDS = gql`...`;
const GET_SYNC_LOGS = gql`...`;
// Keep custom mutations if they're special operations
```

---

### Step 3: Replace useQuery Hooks ✏️

#### Query 1: Get Config

**Before:**
```tsx
const { data: configData, loading: configLoading, refetch: refetchConfig } = useQuery(GET_CALLCENTER_CONFIG);
```

**After:**
```tsx
const { 
  data: configData, 
  loading: configLoading, 
  refetch: refetchConfig 
} = useFindUnique('callCenterConfig', {
  where: { id: 'default' } // Adjust based on your logic
});
```

#### Query 2: Get Records (Paginated)

**Before:**
```tsx
const { data: recordsData, loading: recordsLoading, refetch: refetchRecords } = useQuery(GET_CALLCENTER_RECORDS, {
  variables: {
    pagination: { page: currentPage, limit: pageSize },
    filters: filters
  }
});
```

**After:**
```tsx
const { 
  data: records, 
  meta,
  loading: recordsLoading, 
  refetch: refetchRecords,
  nextPage,
  prevPage
} = useFindManyPaginated('callCenterRecord', {
  page: currentPage,
  limit: pageSize,
  where: filters, // Convert filters to Prisma where syntax
  orderBy: { startEpoch: 'desc' }
});

// Access data
const recordsData = {
  getCallCenterRecords: {
    items: records,
    pagination: meta
  }
};
```

#### Query 3: Get Sync Logs

**Before:**
```tsx
const { data: logsData, loading: logsLoading, refetch: refetchLogs } = useQuery(GET_SYNC_LOGS, {
  variables: { limit: 20 }
});
```

**After:**
```tsx
const { 
  data: logs = [], 
  loading: logsLoading, 
  refetch: refetchLogs 
} = useFindMany('syncLog', {
  take: 20,
  orderBy: { createdAt: 'desc' }
});

// Adjust data structure if needed
const logsData = {
  getSyncLogs: logs
};
```

---

### Step 4: Replace useMutation Hooks ✏️

#### Mutation 1: Create Config

**Before:**
```tsx
const [createConfig, { loading: creating }] = useMutation(CREATE_CALLCENTER_CONFIG);

await createConfig({
  variables: {
    input: {
      apiUrl: 'https://...',
      domain: 'example.com',
      // ...
    }
  }
});
```

**After:**
```tsx
const [createConfig, { loading: creating }] = useCreateOne('callCenterConfig');

await createConfig({
  data: {
    apiUrl: 'https://...',
    domain: 'example.com',
    // ... (no input wrapper needed)
  }
});
```

#### Mutation 2: Update Config

**Before:**
```tsx
const [updateConfig, { loading: updating }] = useMutation(UPDATE_CALLCENTER_CONFIG);

await updateConfig({
  variables: {
    id: config.id,
    input: {
      syncMode: newMode,
      cronExpression: newCron,
      // ...
    }
  }
});
```

**After:**
```tsx
const [updateConfig, { loading: updating }] = useUpdateOne('callCenterConfig');

await updateConfig({
  where: { id: config.id },
  data: {
    syncMode: newMode,
    cronExpression: newCron,
    // ...
  }
});
```

#### Mutation 3: Sync Data (Custom - Keep as is)

**If this is a custom operation not in Prisma:**
```tsx
// Keep the original Apollo mutation
const [syncData, { loading: syncing }] = useMutation(SYNC_CALLCENTER_DATA);
```

**OR if it's a simple update:**
```tsx
const [syncData, { loading: syncing }] = useUpdateOne('callCenterConfig');

await syncData({
  where: { id: configId },
  data: { lastSyncAt: new Date() }
});
```

---

### Step 5: Update Data Access ✏️

**Before:**
```tsx
const config = configData?.getCallCenterConfig;
const records = recordsData?.getCallCenterRecords?.items || [];
const logs = logsData?.getSyncLogs || [];
```

**After:**
```tsx
const config = configData; // Direct access
const records = records || []; // Already unwrapped
const logs = logs || []; // Already unwrapped
```

---

## 🧪 Testing Checklist

After migration, test these:

### Functional Tests
- [ ] Page loads without errors
- [ ] Config displays correctly
- [ ] Records table shows data
- [ ] Pagination works (next/prev buttons)
- [ ] Sync logs display
- [ ] Create config form works
- [ ] Update config form works
- [ ] Sync button triggers sync
- [ ] Filters work correctly
- [ ] Refetch buttons work

### Technical Tests
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No GraphQL errors
- [ ] Data loads correctly
- [ ] Loading states show
- [ ] Error states work

### Browser Tests
- [ ] Chrome: Works
- [ ] Firefox: Works
- [ ] Safari: Works

---

## 🐛 Common Issues & Solutions

### Issue 1: "Model not found"
**Error:** `Model 'callCenterConfig' not found`

**Solution:** Check exact model name in `schema.prisma`
```bash
# Check Prisma schema
cat backend/prisma/schema.prisma | grep -A 5 "model Call"
```

### Issue 2: Data structure mismatch
**Error:** `Cannot read property 'items' of undefined`

**Solution:** Update data access
```tsx
// Before
const records = recordsData?.getCallCenterRecords?.items || [];

// After
const records = recordsData || [];
```

### Issue 3: Pagination not working
**Error:** Pagination controls don't work

**Solution:** Use `useFindManyPaginated` and its built-in controls
```tsx
const { data, meta, nextPage, prevPage, goToPage } = useFindManyPaginated('callCenterRecord', {
  page: 1,
  limit: 10
});

// Use built-in functions
<Button onClick={nextPage}>Next</Button>
<Button onClick={prevPage}>Previous</Button>
```

### Issue 4: Where clause syntax error
**Error:** Invalid where clause

**Solution:** Convert GraphQL filters to Prisma syntax
```tsx
// GraphQL style (wrong)
where: { status: 'ACTIVE' }

// Prisma style (correct)
where: { callStatus: { equals: 'ACTIVE' } }
// Or simple
where: { callStatus: 'ACTIVE' }
```

---

## 📊 Expected Results

### Before Migration
```tsx
// 3 files
├── page.tsx (1200 lines)
├── queries.ts (150 lines) ❌ DELETE
└── types.ts (80 lines) ❌ DELETE

Total: 3 files, 1430 lines
```

### After Migration
```tsx
// 1 file
└── page.tsx (1050 lines)

Total: 1 file, 1050 lines
Savings: -2 files, -380 lines (27%)
```

---

## 🎯 Next Steps

After completing this migration:

1. **Test thoroughly** (30 min)
2. **Delete old query files** (if exist)
3. **Move to next file:** Affiliate Dashboard
4. **Document any issues**

---

## 📞 Need Help?

**Reference Files:**
- Example: `AffiliateDashboard.MIGRATED.tsx`
- Guide: `MIGRATION_EXECUTION_PLAN.md`
- Patterns: `MIGRATION_COMPARISON.md`

**Commands:**
```bash
# Restore backup if needed
mv frontend/src/app/admin/callcenter/page.tsx.backup frontend/src/app/admin/callcenter/page.tsx

# Check TypeScript
cd frontend && npm run type-check

# Test
npm run dev
```

---

## ✅ Completion Checklist

- [ ] Backup created
- [ ] Imports updated
- [ ] Queries removed
- [ ] useQuery replaced
- [ ] useMutation replaced
- [ ] Data access updated
- [ ] TypeScript compiles
- [ ] Page loads
- [ ] All features work
- [ ] No console errors
- [ ] Tested in browser
- [ ] Old files deleted (if any)

---

**Ready to migrate?** Follow the steps above one by one! 🚀

**Estimated time:** 30-45 minutes  
**Difficulty:** ⭐⭐ Medium
