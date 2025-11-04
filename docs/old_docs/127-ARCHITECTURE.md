# Xuất Nhập Tồn - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                     (Next.js 14 App)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ GraphQL Queries
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL Layer                            │
│                  (Apollo Client)                            │
│  ┌─────────────┬──────────────┬─────────────────┐          │
│  │ ext_        │ ext_         │ ext_            │          │
│  │ listhoadon  │ detailhoadon │ sanphamhoadon   │          │
│  └─────────────┴──────────────┴─────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database Queries
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│  ┌──────────────────────────────────────────────────┐      │
│  │  ext_listhoadon (Invoice Headers)               │      │
│  │  - id, nbmst, nmmst, shdon, tdlap, ...         │      │
│  └──────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │  ext_detailhoadon (Invoice Details)            │      │
│  │  - id, idhdon, ten, sluong, dgia, thtien, ...  │      │
│  └──────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │  ext_sanphamhoadon (Product Mappings)          │      │
│  │  - id, ten, ten2, ma, dvt, ...                 │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        page.tsx                            │
│                   (Main Orchestrator)                      │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  State Management                                │    │
│  │  - userConfig (MST, companyName)                 │    │
│  │  - dateRange (startDate, endDate)                │    │
│  │  - filters (search, groupBy, sort)               │    │
│  │  - pagination (currentPage, itemsPerPage)        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Custom Hooks                                    │    │
│  │  - useInventoryData (GraphQL queries)            │    │
│  │  - useInventoryFilter (filter & sort)            │    │
│  │  - usePagination (page logic)                    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Business Logic                                  │    │
│  │  - calculateInventory (main calculation)         │    │
│  │  - calculateSummary (statistics)                 │    │
│  │  - exportToExcel (file generation)               │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
           │          │           │           │
           ↓          ↓           ↓           ↓
┌──────────────┬────────────┬──────────┬──────────────┐
│ ConfigModal  │ Summary    │ Filter   │ Inventory    │
│              │ Cards      │ Toolbar  │ Table        │
└──────────────┴────────────┴──────────┴──────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   User      │
│  Actions    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│              Event Handlers                     │
│  - handleSaveConfig(config)                    │
│  - handleDateRangeChange(range)                │
│  - handleSearchChange(term)                    │
│  - handleExport()                              │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│          State Updates (useState)               │
│  - setUserConfig                               │
│  - setDateRange                                │
│  - setSearchTerm                               │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│        Data Fetching (useInventoryData)         │
│  ┌─────────────────────────────────────────┐   │
│  │  GraphQL Queries (useDynamicQuery)      │   │
│  │  - getext_listhoadons                   │   │
│  │  - getext_detailhoadons                 │   │
│  │  - getext_sanphamhoadons                │   │
│  └─────────────────────────────────────────┘   │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│    Calculation (useMemo - calculateInventory)   │
│  ┌─────────────────────────────────────────┐   │
│  │  1. Filter invoices by date range       │   │
│  │  2. Classify invoices (sale/purchase)   │   │
│  │  3. Match products (ten → ten2/ma)      │   │
│  │  4. Group by ma or ten2                 │   │
│  │  5. Calculate cumulative inventory      │   │
│  │     Tồn Đầu + Nhập - Xuất = Tồn Cuối   │   │
│  └─────────────────────────────────────────┘   │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│     Filtering (useInventoryFilter)              │
│  - Apply search term                           │
│  - Apply sorting                               │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│       Pagination (usePagination)                │
│  - Calculate page boundaries                   │
│  - Slice data for current page                 │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────┐
│           Render Components                     │
│  - SummaryCards (summary stats)                │
│  - FilterToolbar (controls)                    │
│  - InventoryTable (data rows)                  │
│  - Pagination (page controls)                  │
└─────────────────────────────────────────────────┘
```

## Inventory Calculation Flow

```
Input Data:
┌───────────────┐  ┌────────────────┐  ┌──────────────────┐
│  Invoices     │  │  Details       │  │  Products        │
│  (Header)     │  │  (Items)       │  │  (Mappings)      │
└───────┬───────┘  └────────┬───────┘  └────────┬─────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ↓
┌──────────────────────────────────────────────────────┐
│  Step 1: Filter by Date Range                       │
│  - Compare invoice.tdlap with dateRange             │
│  - Keep only invoices within range                  │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────┐
│  Step 2: Classify Invoices                          │
│  - if (invoice.nbmst === userMST) → SALE            │
│  - if (invoice.nmmst === userMST) → PURCHASE        │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────┐
│  Step 3: Match Products                             │
│  - Find detail.ten in products                      │
│  - Extract: ten2 (normalized) or ma (code)          │
│  - Get: unit (dvt)                                  │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────┐
│  Step 4: Group by Product & Date                    │
│  - Key: ${productKey}_${date}                       │
│  - Aggregate by key                                 │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────┐
│  Step 5: Calculate Movements                        │
│  - if PURCHASE: importQty += qty, importAmt += amt  │
│  - if SALE: exportQty += qty, exportAmt += amt      │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓
┌──────────────────────────────────────────────────────┐
│  Step 6: Calculate Opening & Closing                │
│  - Sort by date (ascending)                         │
│  - For each product:                                │
│    openingQty[i] = closingQty[i-1]                 │
│    closingQty[i] = openingQty + import - export    │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓
Output: InventoryRow[]
┌──────────────────────────────────────────────────────┐
│  date | product | code | unit | opening | import |  │
│                                | export  | closing  │
└──────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        page.tsx                          │
└──────────────────────────────────────────────────────────┘
    │
    │ Props
    ↓
┌─────────────────┐
│  ConfigModal    │ ← isOpen, currentConfig, onSave, onClose
├─────────────────┤
│ - Form inputs   │
│ - Save to LS    │
└─────────────────┘

    │ Props
    ↓
┌─────────────────┐
│  SummaryCards   │ ← summary (stats), loading
├─────────────────┤
│ - 4 stat cards  │
│ - Formatted #s  │
└─────────────────┘

    │ Props
    ↓
┌─────────────────┐
│  FilterToolbar  │ ← all filter props + callbacks
├─────────────────┤
│ - Search input  │
│ - Date pickers  │
│ - Group select  │
│ - Sort controls │
│ - Action btns   │
└─────────────────┘

    │ Props
    ↓
┌─────────────────┐
│ InventoryTable  │ ← rows, currentPage, itemsPerPage, loading
├─────────────────┤
│ - Table header  │
│ - Data rows     │
│ - Color coding  │
└─────────────────┘

    │ Props
    ↓
┌─────────────────┐
│   Pagination    │ ← currentPage, totalPages, onPageChange, ...
├─────────────────┤
│ - Page numbers  │
│ - Prev/Next     │
│ - Item count    │
└─────────────────┘
```

## State Management Flow

```
┌────────────────────────────────────────────────────┐
│              Component State (useState)            │
├────────────────────────────────────────────────────┤
│  userConfig      → MST configuration               │
│  dateRange       → Start/end dates                 │
│  searchTerm      → Search query                    │
│  groupBy         → 'ma' | 'ten2'                   │
│  sortField       → Sort column                     │
│  sortDirection   → 'asc' | 'desc'                  │
│  itemsPerPage    → Pagination size (50)            │
└────────────────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────────────────┐
│           Custom Hook State (useState)             │
├────────────────────────────────────────────────────┤
│  useInventoryData:                                 │
│    - invoices, details, products (from GraphQL)    │
│    - loading, error states                         │
│                                                    │
│  usePagination:                                    │
│    - currentPage, totalPages                       │
│    - startIndex, endIndex                          │
└────────────────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────────────────┐
│          Derived State (useMemo)                   │
├────────────────────────────────────────────────────┤
│  inventoryRows = calculateInventory(...)           │
│  filteredRows = useInventoryFilter(...)            │
│  summary = calculateSummary(...)                   │
└────────────────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────────────────┐
│               Component Props                      │
├────────────────────────────────────────────────────┤
│  Pass down to child components                     │
└────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────┐
│               Frontend Layer                    │
├─────────────────────────────────────────────────┤
│  React 18         → UI components               │
│  Next.js 14       → App Router, SSR            │
│  TypeScript       → Type safety                │
│  Tailwind CSS     → Styling                    │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│              Data Layer                         │
├─────────────────────────────────────────────────┤
│  Apollo Client    → GraphQL client             │
│  GraphQL          → Query language             │
│  Dynamic Queries  → Universal query system     │
└─────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────┐
│             Utility Layer                       │
├─────────────────────────────────────────────────┤
│  XLSX             → Excel export               │
│  Sonner           → Toast notifications        │
│  localStorage     → Client-side storage        │
└─────────────────────────────────────────────────┘
```

## Performance Considerations

1. **Memoization**
   - `useMemo` for expensive calculations
   - Recalculate only when dependencies change

2. **Pagination**
   - Render only 50 items at a time
   - Reduce DOM nodes

3. **GraphQL Optimization**
   - Fetch all data once
   - Cache with Apollo Client
   - `network-only` for fresh data

4. **Set-based Operations**
   - O(1) lookups for product matching
   - Faster than nested loops

5. **Lazy Computation**
   - Calculate summary only for filtered data
   - Skip hidden rows

## Security Considerations

1. **Input Validation**
   - Validate MST format
   - Sanitize date inputs
   - Validate search terms

2. **Data Privacy**
   - MST stored in localStorage (client-side only)
   - No sensitive data in URLs
   - GraphQL authentication (JWT)

3. **XSS Protection**
   - React auto-escapes values
   - No dangerouslySetInnerHTML

## Accessibility

1. **Keyboard Navigation**
   - Tab through form fields
   - Enter to submit

2. **Screen Readers**
   - Semantic HTML
   - ARIA labels on buttons

3. **Color Contrast**
   - WCAG AA compliant
   - Not relying on color alone

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

1. **Real-time Updates**
   - WebSocket subscriptions
   - Auto-refresh data

2. **Advanced Filters**
   - Multi-select products
   - Custom date presets
   - Saved filter configurations

3. **Charts & Visualizations**
   - Line chart for inventory trends
   - Bar chart for top products
   - Pie chart for categories

4. **Export Options**
   - PDF export
   - CSV export
   - Print-friendly view

5. **Batch Operations**
   - Bulk edit
   - Mass import/export

6. **Mobile Optimization**
   - Responsive table
   - Touch gestures
   - Mobile-first design
