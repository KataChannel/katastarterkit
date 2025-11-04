# Admin Page Builder - Table View Implementation

## Overview

Updated the admin page builder from a card/grid layout to a professional **table-based interface** with advanced features like sorting, filtering, search, pagination, and CRUD operations - all built with pure shadcn UI components.

## Features Implemented

### 1. **Data Table Component** (`data-table.tsx`)
- **Pure React implementation** - No external table libraries needed
- **Responsive design** - Works on desktop and mobile
- Built entirely with shadcn UI components

#### Sorting
- Click column headers to toggle sort direction: `None → Ascending → Descending`
- Visual indicators show current sort state:
  - ⬆️ Ascending
  - ⬇️ Descending
  - ↕️ No sort (faded)
- Sort by: Title, Slug, Updated Date

#### Search & Filtering
- **Global search**: Search across title and slug simultaneously
- **Status filter**: Filter by Draft, Published, or Archived
- Filters reset pagination to page 1 when applied

#### Pagination
- Configurable page size: 5, 10, 20, 50 rows
- Navigation: First, Previous, Next, Last page buttons
- Shows current page and total page count
- Total records count displayed

#### CRUD Actions
- **Edit**: Open page in full-screen editor
- **View Page**: Open published page in new tab
- **Delete**: Confirmation dialog before deletion
- Dropdown menu for each row with icon-based actions

### 2. **Page Admin Interface** (`pagebuilder/page.tsx`)
- Clean header with title and "New Page" button
- Full-page integration with DataTable component
- Modal editor for page creation/editing
- Error handling and loading states

## Architecture

```
/admin/pagebuilder/
├── page.tsx           (Main page component)
├── data-table.tsx     (Reusable table component)
└── (Full-screen editor opens in dialog)
```

### Component Structure

**DataTable Component Props:**
```typescript
interface DataTableProps {
  data: Page[];                    // Array of pages to display
  isLoading: boolean;              // Loading state
  onEdit: (id: string) => void;    // Edit handler
  onView: (slug: string) => void;  // View published page
  onDelete: (id: string) => Promise<void>;  // Delete with confirmation
  onRefresh: () => void;           // Refetch data
}
```

## UI Components Used

### shadcn/ui Components
1. **Table** - Base table component
   - TableHeader, TableBody, TableRow, TableHead, TableCell
2. **Button** - All interactive elements
3. **Input** - Search field
4. **Select** - Status filter, page size selector
5. **Badge** - Status indicator
6. **DropdownMenu** - Row actions
7. **AlertDialog** - Delete confirmation
8. **Dialog** - Full-screen editor (in parent)

### Icons (lucide-react)
- ArrowUp, ArrowDown, ArrowUpDown - Sort indicators
- Search - Search icon
- MoreHorizontal - Action menu
- Edit, Eye, Trash2 - Action buttons
- ChevronLeft/Right, ChevronsLeft/Right - Pagination

## Features in Detail

### Column Headers
```
| Title | Slug | Status | Blocks | Updated | Actions |
```

- **Title**: Sortable, text searchable, shows page name
- **Slug**: Sortable, text searchable, prefixed with `/`
- **Status**: Filter dropdown, color-coded badge
  - 🟢 Published (green)
  - 🟡 Draft (yellow)
  - ⚪ Archived (gray)
- **Blocks**: Count of page blocks
- **Updated**: Sortable, formatted date
- **Actions**: Edit, View (if published), Delete

### Status Badges
```typescript
PUBLISHED -> Badge variant "default" (blue/green)
DRAFT     -> Badge variant "secondary" (yellow)
ARCHIVED  -> Badge variant "outline" (gray)
```

### Search Logic
- Case-insensitive
- Searches title and slug fields
- Resets to page 1 on new search
- Shows filter count in pagination

### Sort Logic
- Supports string comparison (title, slug)
- Date comparison (updatedAt)
- Three-state toggle: Ascending → Descending → No sort
- Sorted before filtering/pagination

### Pagination Logic
- Configurable: 5, 10, 20, 50 rows per page
- Button states disable automatically
- Shows "Page X of Y" format
- Displays total filtered records

## Usage

### Basic Implementation
```tsx
import { DataTable } from '@/app/admin/pagebuilder/data-table';

export function AdminPages() {
  const { pages, loading } = usePages();
  
  return (
    <DataTable
      data={pages?.items || []}
      isLoading={loading}
      onEdit={(id) => navigateToEditor(id)}
      onView={(slug) => openPageInNewTab(slug)}
      onDelete={(id) => deletePage(id)}
      onRefresh={() => refetchPages()}
    />
  );
}
```

### Integration with Page Builder
The DataTable is integrated into `/admin/pagebuilder` with:
1. Full-screen modal for page editing
2. GraphQL mutations for CRUD operations
3. Automatic refetch after modifications
4. Error handling and loading states

## Styling Highlights

### Responsive Design
```css
/* Desktop: Full width table */
@media (min-width: 1024px) { /* Full table */ }

/* Tablet: Adjusted spacing */
@media (min-width: 768px) { /* Flex layout */ }

/* Mobile: Stack filters vertically */
@media (max-width: 640px) { 
  Filters stack vertically
  Full width inputs
}
```

### Hover Effects
- Table rows: `hover:bg-gray-100/50`
- Buttons: `hover:bg-gray-50`
- Dropdowns: Standard radix behavior

### Dark/Light Mode Support
- All components use Tailwind/shadcn utilities
- Works with your existing theme configuration

## TypeScript Types

```typescript
type SortField = 'title' | 'slug' | 'status' | 'updatedAt';
type SortDirection = 'asc' | 'desc' | null;

interface DataTableState {
  globalFilter: string;           // Search term
  statusFilter: string;           // Status filter value
  sortField: SortField;           // Current sort field
  sortDirection: SortDirection;   // Current sort direction
  pageIndex: number;              // Current page (0-indexed)
  pageSize: number;               // Rows per page
  deleteId: string | null;        // Pending delete confirmation
  isDeleting: boolean;            // Delete operation loading
}
```

## Performance Optimizations

### useMemo Hooks
1. **filteredData** - Filtered by status and search
2. **sortedData** - Sorted filtered data
3. **paginatedData** - Paginated sorted data

Each layer depends on previous, minimizing recalculations.

### Event Handlers
- Search resets pagination automatically
- Status filter resets pagination automatically
- Sort doesn't change pagination position
- Delete shows confirmation before action

## Accessibility

### Keyboard Navigation
- All buttons support keyboard navigation
- Input fields are accessible
- Select dropdowns keyboard compatible
- Delete dialog accessible via keyboard

### ARIA Labels
- Sort buttons include visual and semantic indicators
- Status badges clearly marked
- Action buttons have clear descriptions
- Delete confirmation dialog properly labeled

## Code Quality

### No External Dependencies
- ✅ Pure React state management
- ✅ Built-in shadcn UI only
- ✅ No react-table or TanStack Table needed
- ✅ Minimal, maintainable code

### Error Handling
- Try-catch blocks for operations
- User-friendly error messages
- Graceful fallbacks for missing data
- Delete confirmation prevents accidents

## File Changes Summary

### New Files
- `/frontend/src/app/admin/pagebuilder/data-table.tsx` (380+ lines)

### Modified Files  
- `/frontend/src/app/admin/pagebuilder/page.tsx` (simplified, refactored)

## Testing Checklist

- [ ] ✅ Sort by title (A-Z and Z-A)
- [ ] ✅ Sort by slug
- [ ] ✅ Sort by updated date
- [ ] ✅ Search by page title
- [ ] ✅ Search by page slug
- [ ] ✅ Filter by status (Draft/Published/Archived)
- [ ] ✅ Pagination: next, prev, first, last
- [ ] ✅ Change page size (5, 10, 20, 50)
- [ ] ✅ Edit page (opens in modal)
- [ ] ✅ View published page (opens in new tab)
- [ ] ✅ Delete page with confirmation
- [ ] ✅ Responsive on mobile
- [ ] ✅ Responsive on tablet
- [ ] ✅ Responsive on desktop

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## Next Steps

### Future Enhancements
1. **Bulk actions**: Select multiple pages, bulk delete/publish
2. **Column visibility**: Toggle columns on/off
3. **Export**: Export table as CSV/Excel
4. **Advanced filters**: By date range, author, etc.
5. **Keyboard shortcuts**: Edit (E), Delete (D), etc.
6. **Row selection**: Checkbox selection for bulk ops
7. **Drag-to-reorder**: Reorder pages via table UI
8. **Inline editing**: Quick edit status inline

## Related Documentation

- Previous version: Card-based grid layout
- Global Settings Fix: GraphQL migration
- Carousel Enhancements: Phase 1 work
- Bookmark Feature: Phase 2 work

## Deployment

No additional dependencies to install. All components use existing shadcn UI setup.

```bash
# No new packages needed
# Just restart dev server
bun dev --port 12000
```

## Summary

The new admin page builder provides a **professional, feature-rich table interface** using only shadcn UI components, with sorting, filtering, search, pagination, and CRUD operations - everything a senior developer would expect from a modern admin panel.
