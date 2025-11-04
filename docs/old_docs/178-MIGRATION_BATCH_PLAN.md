# 🚀 Migration Batch Plan - Auto Execution

## 📊 Overview

**Total Files:** 38 detected (excluding backups: ~30 real files)  
**Strategy:** Batch migration by complexity  
**Execution:** Automated with validation  
**Duration:** ~30-45 minutes (all files)

---

## 📋 Migration Batches

### ✅ BATCH 0: Already Complete
- [x] `app/admin/callcenter/page.tsx` - **MIGRATED** ✨

---

### 🎯 BATCH 1: Simple Files (1 query, no mutations) - 8 files
**Complexity:** ⭐ Easy  
**Time:** ~2 min/file = 16 minutes total

1. [ ] `components/DynamicPageRenderer.tsx` - 1 query
2. [ ] `components/layout/website-header.tsx` - 1 query
3. [ ] `components/lms/LessonViewer.tsx` - 1 query
4. [ ] `components/lms/QuizResults.tsx` - 1 query
5. [ ] `components/lms/QuizTaker.tsx` - 1 query
6. [ ] `app/lms/courses/page.tsx` - 1 query
7. [ ] `components/affiliate/campaigns/ApplicationReviewPanel.tsx` - 1 query
8. [ ] `components/affiliate/campaigns/CampaignManagement.tsx` - 1 query (+ 2 mutations)

---

### 🎯 BATCH 2: Medium Files (2 queries, 0-1 mutations) - 10 files
**Complexity:** ⭐⭐ Medium  
**Time:** ~3 min/file = 30 minutes total

1. [ ] `app/lms/courses/[slug]/page.tsx` - 2 queries
2. [ ] `app/lms/learn/[slug]/page.tsx` - 2 queries
3. [ ] `components/affiliate/dashboard/AffiliateDashboard.tsx` - 2 queries
4. [ ] `components/affiliate/links/LinkManagement.tsx` - 2 queries + 1 mutation
5. [ ] `components/affiliate/payments/PaymentManagement.tsx` - 2 queries + 1 mutation
6. [ ] `components/lms/ReviewList.tsx` - 1 query + 1 mutation
7. [ ] `components/lms/wizard/CourseBasicsStep.tsx` - TBD
8. [ ] `components/lms/wizard/QuizzesStep.tsx` - TBD
9. [ ] `components/pagebuilder/*` - TBD (multiple files)
10. [ ] `components/products/*` - TBD (multiple files)

---

### 🎯 BATCH 3: Complex Files (3+ queries/mutations) - 5 files
**Complexity:** ⭐⭐⭐ Hard  
**Time:** ~5 min/file = 25 minutes total

1. [ ] `components/lms/wizard/LessonsStep.tsx` - 1 query + 3 mutations
2. [ ] `components/lms/wizard/ModulesStep.tsx` - 1 query + 3 mutations
3. [ ] Admin pages with complex logic
4. [ ] PageBuilder components
5. [ ] Product management components

---

### 🗑️ SKIP: Backup Files (không migrate)
- `app/admin/callcenter/page_backup.tsx`
- `app/admin/callcenter/page_backup_old.tsx`
- `components/affiliate/dashboard/AffiliateDashboard.MIGRATED.tsx` (already migrated)

---

## 🤖 Auto Migration Strategy

### Phase 1: Batch 1 (Easy Files) - AUTO
```bash
for file in batch1_files; do
  1. Create backup
  2. Migrate with patterns
  3. Check compilation
  4. If error: revert, mark for manual
  5. If success: continue
done
```

### Phase 2: Batch 2 (Medium) - SEMI-AUTO
```bash
for file in batch2_files; do
  1. Analyze patterns
  2. Apply migration
  3. Add compatibility layers if needed
  4. Test compilation
  5. Manual review if complex
done
```

### Phase 3: Batch 3 (Complex) - MANUAL + AI
```bash
for file in batch3_files; do
  1. Deep analysis
  2. Custom migration strategy
  3. Compatibility wrappers
  4. Careful testing
  5. Document special cases
done
```

---

## 📦 Migration Patterns Library

### Pattern 1: Simple Query
```tsx
// Before
const { data } = useQuery(GET_ITEMS);
const items = data?.items || [];

// After
const { data: items = [] } = useFindMany('item');
```

### Pattern 2: Query with Variables
```tsx
// Before
const { data } = useQuery(GET_ITEM, { variables: { id } });

// After
const { data: item } = useFindUnique('item', { where: { id } });
```

### Pattern 3: Query + Mutation
```tsx
// Before
const { data } = useQuery(GET_ITEMS);
const [create] = useMutation(CREATE_ITEM);

// After
const { data: items = [] } = useFindMany('item');
const [create] = useCreateOne('item');
```

### Pattern 4: Custom Mutation (Keep)
```tsx
// Before
const [customAction] = useMutation(CUSTOM_ACTION);

// After - NO CHANGE
const [customAction] = useMutation(CUSTOM_ACTION);
```

---

## ✅ Success Criteria (Per File)

- [x] TypeScript compilation passes
- [x] No new ESLint errors
- [x] File size reduced (or same)
- [x] Imports cleaned up
- [x] Query/mutation count reduced
- [x] Backup created

---

## 📊 Progress Tracking

**Files Migrated:** 1/38 (2.6%)  
**Lines Saved:** ~200 lines  
**Time Spent:** 5 minutes  
**Estimated Remaining:** 45 minutes

---

## 🎯 Execution Order

1. **BATCH 1** - Start here (easiest wins)
2. **BATCH 2** - Build momentum
3. **BATCH 3** - Tackle challenges

**Ready to execute?** Let's go! 🚀
