# Architecture Diagram - Quản Lý Sản Phẩm

## Component Tree

```
SanPhamPage (page.tsx)
│
├── State Management
│   ├── Local State (useState)
│   │   ├── searchTerm
│   │   ├── page
│   │   ├── sortField
│   │   ├── sortDirection
│   │   ├── filterStatus
│   │   ├── normalizing
│   │   └── showNormalizeModal
│   │
│   ├── Server State (useDynamicQuery)
│   │   ├── productsData
│   │   ├── queryLoading
│   │   └── refetch
│   │
│   └── Derived State (Hooks)
│       ├── useProductFilters → { filteredProducts, stats }
│       └── useProductPagination → { paginatedProducts }
│
├── UI Components
│   ├── Header (inline)
│   │   ├── Title: "Quản Lý Sản Phẩm"
│   │   └── Description
│   │
│   ├── SearchToolbar
│   │   ├── Props
│   │   │   ├── searchTerm, onSearchChange
│   │   │   ├── filterStatus, onFilterChange
│   │   │   ├── stats, loading
│   │   │   ├── onRefresh
│   │   │   └── onNormalize
│   │   │
│   │   └── UI Elements
│   │       ├── Search Input
│   │       ├── Refresh Button
│   │       ├── Normalize Button
│   │       └── Filter Buttons (All/Normalized/Pending)
│   │
│   ├── StatsCards
│   │   ├── Props: stats
│   │   └── Cards
│   │       ├── Tổng sản phẩm (blue)
│   │       ├── Đã chuẩn hóa (green)
│   │       └── Chưa chuẩn hóa (orange)
│   │
│   ├── ProductTable
│   │   ├── Props
│   │   │   ├── products
│   │   │   ├── loading
│   │   │   ├── sortField, sortDirection
│   │   │   ├── onSort
│   │   │   └── emptyMessage
│   │   │
│   │   └── Table Structure
│   │       ├── Headers (sortable)
│   │       │   ├── Mã SP
│   │       │   ├── Tên sản phẩm
│   │       │   ├── Tên chuẩn hóa
│   │       │   ├── ĐVT
│   │       │   ├── Đơn giá
│   │       │   └── Trạng thái
│   │       │
│   │       └── Body
│   │           ├── Loading State
│   │           ├── Empty State
│   │           └── Product Rows
│   │
│   ├── Pagination
│   │   ├── Props
│   │   │   ├── currentPage
│   │   │   ├── totalItems
│   │   │   ├── itemsPerPage
│   │   │   └── onPageChange
│   │   │
│   │   └── Controls
│   │       ├── Previous Button
│   │       ├── Page Info
│   │       └── Next Button
│   │
│   └── NormalizationModal
│       ├── Props
│       │   ├── isOpen
│       │   ├── onClose
│       │   ├── onNormalize
│       │   └── loading
│       │
│       └── Form
│           ├── Mode Selection (Preview/Update)
│           ├── Limit Selection (10/100/1000/All)
│           ├── Info Box
│           └── Actions (Cancel/Submit)
│
└── Event Handlers
    ├── handleRefresh() → refetch + toast
    ├── handleSort(field) → update sort config
    └── handleNormalization(dryRun, limit) → API call + refetch
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GraphQL Backend                      │
│                                                         │
│  Query: getext_sanphamhoadons(filters: JSON)          │
│  Returns: Product[]                                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│             useDynamicQuery Hook                        │
│  - Fetch data from GraphQL                             │
│  - Manage loading state                                │
│  - Provide refetch function                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│           Raw Products (getext_sanphamhoadons)         │
│  rawProducts = productsData?.getext_sanphamhoadons     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│            useProductFilters Hook                       │
│                                                         │
│  Input:                                                │
│    - products: Product[]                               │
│    - searchTerm: string                                │
│    - filterStatus: FilterStatus                        │
│    - sortField: SortField                              │
│    - sortDirection: SortDirection                      │
│                                                         │
│  Process:                                              │
│    1. Filter by search term (ten, ten2, ma, dvt)      │
│    2. Filter by status (all/normalized/pending)       │
│    3. Sort by field & direction                       │
│    4. Calculate stats (total, normalized, pending)     │
│                                                         │
│  Output:                                               │
│    - filteredProducts: Product[]                       │
│    - stats: ProductStats                               │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│         useProductPagination Hook                       │
│                                                         │
│  Input:                                                │
│    - products: Product[]                               │
│    - page: number                                      │
│    - limit: number                                     │
│    - setPage: Dispatch<SetStateAction<number>>        │
│    - dependencies: any[]                               │
│                                                         │
│  Process:                                              │
│    1. Slice products by page & limit                  │
│    2. Calculate total pages                            │
│    3. Auto-reset page on dependencies change          │
│                                                         │
│  Output:                                               │
│    - paginatedProducts: Product[]                      │
│    - totalPages: number                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                UI Components                            │
│                                                         │
│  - StatsCards (uses stats)                             │
│  - ProductTable (uses paginatedProducts)               │
│  - Pagination (uses filteredProducts.length)           │
└─────────────────────────────────────────────────────────┘
```

## User Interaction Flow

```
User Action                 →  State Change           →  UI Update
─────────────────────────────────────────────────────────────────────
Type in Search Box          →  searchTerm             →  Filter → Paginate → Render
Click Filter Button         →  filterStatus           →  Filter → Paginate → Render
Click Column Header         →  sortField/Direction    →  Sort → Paginate → Render
Click Next/Prev Page        →  page                   →  Paginate → Render
Click Refresh Button        →  refetch()              →  Reload → Render
Click Normalize Button      →  showNormalizeModal     →  Modal appears
Submit Normalization        →  API call → refetch()   →  Reload → Render
```

## State Dependencies

```
searchTerm ─────┐
filterStatus ───┼──→ useProductFilters ──→ filteredProducts ──┐
sortField ──────┤                                              │
sortDirection ──┘                            stats ────────────┼──→ UI Render
                                                               │
page ──────────┬──→ useProductPagination ──→ paginatedProducts ┘
limit ─────────┘
```

## File Structure Visualization

```
sanpham/
│
├── 📄 page.tsx (166 lines)
│   └── Main orchestrator component
│
├── 📄 types.ts
│   └── All TypeScript interfaces & types
│
├── 📄 utils.ts
│   └── Helper functions (formatPrice, formatDate)
│
├── 📄 README.md
│   └── Documentation
│
├── 📄 ARCHITECTURE.md (this file)
│   └── Architecture diagrams
│
├── 📁 components/
│   ├── 📄 index.ts (exports)
│   ├── 📄 StatsCards.tsx (~40 lines)
│   ├── 📄 SearchToolbar.tsx (~90 lines)
│   ├── 📄 ProductTable.tsx (~120 lines)
│   ├── 📄 Pagination.tsx (~50 lines)
│   └── 📄 NormalizationModal.tsx (~100 lines)
│
└── 📁 hooks/
    ├── 📄 index.ts (exports)
    ├── 📄 useProductFilters.ts (~70 lines)
    └── 📄 useProductPagination.ts (~40 lines)
```

## Performance Optimization Points

```
1. useMemo in useProductFilters
   ├── Prevents re-filtering on unrelated re-renders
   └── Dependencies: [products, searchTerm, filterStatus, sortField, sortDirection]

2. useMemo in useProductPagination
   ├── Prevents re-slicing on unrelated re-renders
   └── Dependencies: [products, page, limit]

3. Component Memoization (potential)
   ├── React.memo(StatsCards) - rarely changes
   ├── React.memo(SearchToolbar) - frequent user interaction
   └── React.memo(ProductTable) - expensive render

4. Lazy Loading (potential)
   ├── Virtualized list for large datasets
   └── Infinite scroll instead of pagination
```

## Testing Points

```
Unit Tests:
├── useProductFilters
│   ├── Search filtering
│   ├── Status filtering
│   ├── Sorting logic
│   └── Stats calculation
│
├── useProductPagination
│   ├── Page slicing
│   ├── Auto-reset behavior
│   └── Edge cases (empty array, page > totalPages)
│
└── Utils
    ├── formatPrice
    └── formatDate

Integration Tests:
├── SearchToolbar + useProductFilters
├── ProductTable + sorting
├── Pagination + useProductPagination
└── NormalizationModal + API

E2E Tests:
├── Full search → filter → sort → paginate flow
├── Normalization workflow
└── Data refresh workflow
```

## Extension Points

```
Easy to Add:
├── New filter criteria
│   └── Add to useProductFilters hook
│
├── New sort column
│   └── Add to SortField type + ProductTable + useProductFilters
│
├── New stats card
│   └── Add to StatsCards component + stats calculation
│
├── Export functionality
│   └── Add button to SearchToolbar + export handler
│
└── Bulk operations
    └── Add checkboxes to ProductTable + bulk action buttons
```
