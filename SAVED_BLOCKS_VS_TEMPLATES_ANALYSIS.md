# SavedBlocksLibrary vs TemplatesLibrary - Detailed Analysis

## 📊 Comparison Overview

| Aspect | SavedBlocksLibrary | TemplatesLibrary |
|--------|-------------------|------------------|
| **Purpose** | User-saved block combinations | Pre-built templates |
| **Data Source** | localStorage | Hardcoded in component |
| **Create/Edit** | Users can create new | Static/Read-only |
| **Edit Capability** | Can duplicate & delete | Can duplicate & preview |
| **Size** | 527 lines | 665 lines |
| **Card Component** | SavedBlockCard | TemplateCard |
| **Export/Import** | ✅ Yes (JSON) | ❌ No |
| **Bookmark Feature** | ✅ Yes | ❌ No |

---

## 🔍 Structure Comparison

### SavedBlocksLibrary
```
SavedBlocksLibrary (main component)
├── SavedBlockCard (sub-component)
├── Header (with Save/Export/Import buttons)
├── Search Input
├── Content Area
│   ├── Empty State
│   ├── No Results
│   └── Category Groups
│       └── SavedBlockCard (rendered per block)
├── Footer Info
└── localStorage Integration
```

### TemplatesLibrary
```
TemplatesLibrary (main component)
├── TemplateCard (sub-component)
├── Header (with Search)
├── Search/Filter Input
├── Content Area
│   ├── Empty State
│   ├── No Results
│   └── Category Groups
│       └── TemplateCard (rendered per template)
├── Preview Modal (Dialog)
├── Hardcoded templates array
└── No persistence
```

---

## ✅ Similarities (Trùng lắp)

### 1. **Same UI Structure** (90% identical)
Both components use the same layout pattern:
- Header with actions
- Search input
- Category-grouped cards with expand/collapse
- Empty/no-results states
- Footer info

### 2. **Same Card Pattern**
Both use similar card design:
- Preview bar/icon
- Title + Badge (New/Hot)
- Description
- Metadata (date, count, etc.)
- Action buttons

### 3. **Same Filtering Logic**
```typescript
// Both use identical filtering:
const filteredItems = useMemo(() => {
  return items.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
}, [items, query]);

// Both use identical grouping:
const groupedItems = useMemo(() => {
  const grouped: Record<string, Item[]> = {};
  filtered.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  return grouped;
}, [filtered]);

// Both use identical toggle logic:
const toggleCategory = (categoryId: string) => {
  const newExpanded = new Set(expandedCategories);
  if (newExpanded.has(categoryId)) {
    newExpanded.delete(categoryId);
  } else {
    newExpanded.add(categoryId);
  }
  setExpandedCategories(newExpanded);
};
```

### 4. **Same State Management Pattern**
Both manage:
- Items array (savedBlocks / templates)
- searchQuery
- expandedCategories (Set<string>)

### 5. **Same Logger Integration**
Both use pageBuilderLogger for errors

---

## ❌ Key Differences

### 1. **Data Source**
- **SavedBlocks**: localStorage (persistent, user-created)
- **Templates**: Hardcoded array (static, system-provided)

### 2. **User Actions**
- **SavedBlocks**: Save, Duplicate, Delete, Bookmark, Export, Import
- **Templates**: Insert, Preview, Duplicate

### 3. **Data Mutations**
- **SavedBlocks**: Create, Update, Delete via saveSavedBlocks()
- **Templates**: Read-only (no mutations)

### 4. **Preview Capability**
- **SavedBlocks**: No preview (direct apply)
- **Templates**: Full preview modal available

---

## 🎯 Optimization Opportunities

### 1. **Extract Common Generic Library Component** ⭐ HIGH PRIORITY
Create a reusable `GenericLibrary` component that handles:
- Filtering
- Grouping
- Category toggle
- Card rendering with custom renderer

**Result**: Both files would be 70% smaller

**Example Structure**:
```typescript
interface GenericLibraryProps<T> {
  items: T[];
  itemRenderer: (item: T, actions: LibraryActions<T>) => React.ReactNode;
  searchFields: (keyof T)[];
  groupByField: keyof T;
  headerTitle: string;
  headerActions?: React.ReactNode;
  emptyStateMessage: string;
}

export function GenericLibrary<T extends { id: string; category: string }>({
  items,
  itemRenderer,
  searchFields,
  groupByField,
  // ... props
}: GenericLibraryProps<T>) {
  // Common filtering, grouping, toggle logic
}
```

### 2. **Extract Common Card Component Logic** ⭐ MEDIUM PRIORITY
Both cards have:
- Hover state management
- Dropdown menu with same structure
- Double-click handler
- Badge display
- Metadata display

**Extract to**: CardWithDropdown component

### 3. **Consolidate Search/Filter Logic** ⭐ MEDIUM PRIORITY
Current: Duplicated in both files (~50 lines each)

**Extract to**: useFilteredAndGrouped hook
```typescript
export function useFilteredAndGrouped<T extends { category: string }>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[]
) {
  const filteredItems = useMemo(() => { ... }, [items, searchQuery]);
  const groupedItems = useMemo(() => { ... }, [filteredItems]);
  return { filteredItems, groupedItems };
}
```

### 4. **Separate Data Handling** ⭐ LOW PRIORITY
- SavedBlocks localStorage logic → custom hook (useSavedBlocks)
- Templates static data → separate constant file (blockTemplates.ts)

---

## 📋 Recommended Refactoring Plan

### Phase 1: Extract Hooks & Utils (Fast)
```
frontend/src/components/page-builder/hooks/
├── useFilteredAndGrouped.ts      [NEW] - Shared filtering logic
├── useCategoryToggle.ts           [NEW] - Shared category toggle
└── useCardHoverState.ts           [NEW] - Shared hover state

frontend/src/components/page-builder/utils/
├── librarySearch.ts               [NEW] - Search helpers
└── libraryGrouping.ts             [NEW] - Grouping helpers
```

### Phase 2: Extract Components (Medium)
```
frontend/src/components/page-builder/components/
├── LibraryCard/               [NEW] - Generic card with dropdown
│   ├── LibraryCard.tsx
│   └── LibraryCardDropdown.tsx
└── LibraryHeader/             [NEW] - Generic header
    └── LibraryHeader.tsx
```

### Phase 3: Create Generic Library (Harder)
```
frontend/src/components/page-builder/components/
└── GenericLibrary/            [NEW] - Reusable library container
    ├── GenericLibrary.tsx
    ├── GenericLibrary.types.ts
    └── GenericLibrary.utils.ts
```

### Phase 4: Refactor Components (Integration)
```
- SavedBlocksLibrary.tsx      - Simplified (200 lines → 120 lines)
- TemplatesLibrary.tsx        - Simplified (665 lines → 180 lines)
```

---

## 📊 Estimated Impact

### Code Reduction
| Item | Current | After | Saved |
|------|---------|-------|-------|
| SavedBlocksLibrary.tsx | 527 lines | ~180 lines | **347 lines** |
| TemplatesLibrary.tsx | 665 lines | ~200 lines | **465 lines** |
| Total Removed | - | - | **812 lines** |
| New Shared Code | - | ~300 lines | -260 lines |
| **Net Savings** | **1192 lines** | **~480 lines** | **~712 lines** ✅ |

### Bundle Size Impact
- **Removed duplication**: ~45KB → ~25KB (**~44% reduction in library code**)
- **Added shared utils**: ~5KB
- **Net savings**: ~20KB

### Maintainability
- Single source for: filtering, grouping, card UI, header
- Easier to add new library types (StylesLibrary, ComponentLibrary, etc.)
- Bug fixes apply to all libraries automatically

---

## 🚀 Quick Win: Immediate Refactoring

### Create useFilteredAndGrouped Hook
```typescript
// frontend/src/components/page-builder/hooks/useFilteredAndGrouped.ts
export function useFilteredAndGrouped<T extends { category: string }>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
  expandedCategories: Set<string>
) {
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return searchFields.some(field => 
        String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [items, searchQuery, searchFields]);

  const groupedItems = useMemo(() => {
    const grouped: Record<string, T[]> = {};
    filteredItems.forEach(item => {
      const cat = String(item.category);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    return grouped;
  }, [filteredItems]);

  return { filteredItems, groupedItems };
}
```

### Update SavedBlocksLibrary.tsx
```typescript
// Remove ~40 lines of filtering/grouping code
// Replace with:
const { groupedItems } = useFilteredAndGrouped(
  filteredBlocks,
  searchQuery,
  ['name', 'description'],
  expandedCategories
);
```

**Immediate Savings**: ~80 lines, cleaner code

---

## ⚠️ Risks & Considerations

### Risk Level: LOW
- Changes are additive (new utilities, not destructive)
- Both components can be incrementally refactored
- Test coverage minimal (mostly UI)

### Recommendation
1. ✅ Start with Phase 1 (extract hooks) - No breaking changes
2. ✅ Then Phase 2 (extract components) - Modular & safe
3. ⏭️ Skip Phase 3 (generic) for now - Wait for 3rd library type

---

## 💡 Conclusion

**No direct redundancy** in functionality - they serve different purposes (user-saved vs. system-provided).

**BUT significant code duplication** in UI patterns (filtering, grouping, display).

**Recommendation**: Extract shared logic (~200 lines) to reduce duplication by 60% without changing functionality.

**Best Approach**: 
1. Extract `useFilteredAndGrouped` hook (**Quick win - 30 mins**)
2. Extract card/header components (**Medium - 1 hour**)
3. Evaluate generic library approach (**Optional - after 3rd library added**)

---

## 📝 Decision Matrix

| Approach | Effort | Benefit | Priority |
|----------|--------|---------|----------|
| Extract hooks | ⭐ 30min | ⭐⭐⭐ High | **1** |
| Extract components | ⭐⭐ 1hr | ⭐⭐ Medium | **2** |
| Generic library | ⭐⭐⭐ 2-3hrs | ⭐ Low (for now) | **3** |

**Recommended**: Do 1 & 2, defer 3 until needed.
