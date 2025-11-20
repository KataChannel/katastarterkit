# Admin Page Builder - Visual Guide

## Table Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Pages                                          │
│              Manage and edit your website pages                         │
│                                                          [+ New Page]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ FILTERS ──────────────────────────────────────────────────────────┐ │
│  │  🔍 Search title or slug...                 📋 All Status [v]      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─ TABLE ────────────────────────────────────────────────────────────┐ │
│  │ Title              │ Slug      │ Status    │ Blocks │ Updated      │ │
│  ├────────────────────┼───────────┼───────────┼────────┼──────────────┤ │
│  │ Home Page ⬇️       │ /home     │ Published │   5    │ Oct 25, 2025 │ │
│  │ About Us           │ /about    │ Draft     │   3    │ Oct 24, 2025 │ │
│  │ Services           │ /services │ Published │   7    │ Oct 23, 2025 │ │
│  │ Contact ⬆️         │ /contact  │ Archived  │   2    │ Oct 22, 2025 │ │
│  └────────────────────┴───────────┴───────────┴────────┴──────────────┘ │
│                                                                          │
│  ┌─ PAGINATION ────────────────────────────────────────────────────────┐ │
│  │ 4 pages total    Rows per page: 10 [v]  Page 1 of 1  [|< < > >|]   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Column Headers with Sort Icons

### Sortable Columns (with click to sort):
```
Title ↕️         (Click to cycle: ↓ → ↑ → ↕️)
Slug ↕️          (Click to cycle: ↓ → ↑ → ↕️)
Updated ↕️       (Click to cycle: ↓ → ↑ → ↕️)

Non-sortable:
Status           (Fixed)
Blocks           (Fixed)
Actions          (Fixed)
```

## Status Badge Colors

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Published   │  │    Draft     │  │   Archived   │
│   🟢 Green   │  │  🟡 Yellow   │  │  ⚪ Gray     │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Status Filter Dropdown

```
Status Filter ▼
├─ All Status
├─ Draft
├─ Published
└─ Archived
```

## Row Actions Dropdown (⋯)

```
┌─ Actions ─────────────┐
│ ✎ Edit                │
├───────────────────────┤
│ 👁 View Page          │  (shown only if Published)
├───────────────────────┤
│ 🗑 Delete             │  (red text)
└───────────────────────┘
```

## Delete Confirmation Dialog

```
╔═══════════════════════════════════════════════════╗
║  Delete Page                                       ║
╟───────────────────────────────────────────────────╢
║  Are you sure you want to delete this page?       ║
║  This action cannot be undone.                    ║
╟───────────────────────────────────────────────────╢
║                     [Cancel]  [Delete - Red]      ║
╚═══════════════════════════════════════════════════╝
```

## Search Behavior

```
User Input: "home"
↓
Search Logic:
├─ Check title: "home page" → MATCH (case-insensitive)
├─ Check slug: "/home" → MATCH (case-insensitive)
└─ Check other fields → NO MATCH
↓
Filtered Results: Shows only matching rows
↓
Pagination Reset: Back to page 1
```

## Sorting Behavior

```
Click Header → Sort State Cycles:

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  No Sort    │    │ Ascending   │    │ Descending  │
│   ↕️        │───→│   ↓         │───→│   ↑         │───┐
│ (disabled)  │    │  A → Z      │    │  Z → A      │   │
└─────────────┘    └─────────────┘    └─────────────┘   │
     ↑─────────────────────────────────────────────────┘
     (loop back to No Sort)
```

## Pagination Controls

```
Current State: Page 2 of 5, showing 10 rows per page

Navigation Buttons:
[|<  <  >  >|]

Button States:
- [|<] First    - ENABLED (go to page 1)
- [<] Previous  - ENABLED (go to page 1)
- [>] Next      - ENABLED (go to page 3)
- [>|] Last     - ENABLED (go to page 5)

When on Page 1 of 5:
- [|<] First    - DISABLED
- [<] Previous  - DISABLED
- [>] Next      - ENABLED
- [>|] Last     - ENABLED

When on Page 5 of 5:
- [|<] First    - ENABLED
- [<] Previous  - ENABLED
- [>] Next      - DISABLED
- [>|] Last     - DISABLED
```

## Page Size Selector

```
Rows per page: [10▼]
              ├─ 5
              ├─ 10 ✓ (current)
              ├─ 20
              └─ 50

Changing size:
1. User selects 20
2. pageSize becomes 20
3. pageIndex resets to 0
4. Table shows rows 1-20
```

## Responsive Layouts

### Desktop (>= 1024px)
```
[ Search bar (flex-1) ] [ Status filter (150px) ]
```

### Tablet (768px - 1023px)
```
[ Search bar (flex-1) ] [ Status filter (150px) ]
```

### Mobile (< 768px)
```
[ Search bar (full width) ]
[ Status filter (full width) ]
```

## Loading State

```
┌─────────────────────────────────────┐
│                                     │
│         ⟳ Loading...                │
│                                     │
│     (spinning loader)               │
│                                     │
└─────────────────────────────────────┘
```

## Empty State

```
┌─────────────────────────────────────┐
│                                     │
│         No pages found              │
│                                     │
│  (centered in table body)           │
│                                     │
└─────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────┐
│  Raw Data Array  │
│  (all pages)     │
└────────┬─────────┘
         │
    ┌────▼─────────────────────────────────┐
    │  Filter by Status & Search Term      │
    │  (globalFilter + statusFilter)       │
    └────┬────────────────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │  Sort by Column               │
    │  (sortField + sortDirection)  │
    └────┬──────────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │  Paginate Results             │
    │  (pageIndex * pageSize)       │
    └────┬──────────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │  Render Table Rows            │
    │  (paginatedData)              │
    └───────────────────────────────┘
```

## Action Flow - Edit

```
User clicks "Edit" → 
  ↓
onEdit(pageId) called →
  ↓
Navigate to ?pageId=xxx →
  ↓
FullScreenPageBuilder opens →
  ↓
User saves changes →
  ↓
onExit() called →
  ↓
Dialog closes →
  ↓
Page list refetches →
  ↓
Table updates with new data
```

## Action Flow - Delete

```
User clicks "Delete" →
  ↓
setDeleteId(pageId) →
  ↓
AlertDialog opens →
  ↓
User confirms? NO → Dialog closes, deleteId = null
User confirms? YES ↓
  ↓
setIsDeleting(true) →
  ↓
onDelete(pageId) executes →
  ↓
GraphQL mutation sent →
  ↓
If success:
  ├─ setDeleteId(null)
  ├─ onRefresh() - refetch list
  └─ Table updates
  
If error:
  └─ console.error() logged
  
Finally:
  └─ setIsDeleting(false)
```

## Performance Characteristics

### Initial Load
1. Query API for pages (max 100)
2. Render DataTable with data
3. Display first page (10 rows default)
⏱️ Time: ~500-1000ms (depends on API)

### Search
1. Filter in real-time (client-side)
2. Reset pagination
⏱️ Time: Instant (< 100ms)

### Sort
1. Recalculate sort on current filtered data
2. Reset pagination
⏱️ Time: Instant (< 100ms)

### Pagination
1. Slice paginatedData array
2. Render new rows
⏱️ Time: Instant (< 50ms)

### Delete
1. Send GraphQL mutation
2. Wait for API response
3. Refetch entire list
⏱️ Time: ~1-2 seconds (API dependent)

## Accessibility Features

✅ Semantic HTML table
✅ Keyboard navigation support
✅ ARIA labels on buttons
✅ Color + text for status badges
✅ Focus indicators on buttons
✅ Delete confirmation prevents accidents
✅ Form labels for search/filter inputs
✅ Alert dialogs properly labeled

## Browser Compatibility

✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari
✅ Mobile Safari (iOS)
✅ Chrome Mobile (Android)
