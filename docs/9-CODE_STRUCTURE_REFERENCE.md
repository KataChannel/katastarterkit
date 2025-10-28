# Code Structure Reference

## File: `/frontend/src/app/admin/pagebuilder/data-table.tsx`

### Component: `DataTable`

#### Exports
```typescript
export function DataTable({
  data: Page[],
  isLoading: boolean,
  onEdit: (id: string) => void,
  onView: (slug: string) => void,
  onDelete: (id: string) => Promise<void>,
  onRefresh: () => void,
}: DataTableProps)
```

#### State Management
```typescript
const [globalFilter, setGlobalFilter] = useState('');      // Search term
const [statusFilter, setStatusFilter] = useState('all');   // Status filter
const [sortField, setSortField] = useState('updatedAt');   // Sort column
const [sortDirection, setSortDirection] = useState('desc'); // Sort direction
const [pageIndex, setPageIndex] = useState(0);              // Current page
const [pageSize, setPageSize] = useState(10);               // Rows per page
const [deleteId, setDeleteId] = useState(null);             // Delete target
const [isDeleting, setIsDeleting] = useState(false);        // Delete loading
```

#### Data Processing Pipeline
```
data (raw) 
  ↓ filteredData (filter by status + search)
  ↓ sortedData (sort by field and direction)
  ↓ paginatedData (slice for current page)
  ↓ Render table rows
```

#### Functions
```typescript
getStatusColor(status)              // Return color classes
getStatusVariant(status)            // Return badge variant
handleSort(field)                   // Toggle sort state
getSortIcon(field)                  // Return sort icon
handleDelete()                      // Execute delete operation
```

#### Return Value
```tsx
<>
  <div className="space-y-4">
    {/* Filters Section */}
    <div className="flex gap-4 flex-col sm:flex-row">
      <Input />              {/* Search */}
      <Select />             {/* Status filter */}
    </div>
    
    {/* Table Section */}
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {/* Column headers with sort buttons */}
        </TableHeader>
        <TableBody>
          {/* Table rows */}
        </TableBody>
      </Table>
    </div>
    
    {/* Pagination Section */}
    <div className="flex items-center justify-between">
      {/* Record count */}
      {/* Page size selector */}
      {/* Page info */}
      {/* Navigation buttons */}
    </div>
  </div>
  
  {/* Delete Confirmation Dialog */}
  <AlertDialog>
    {/* Confirmation UI */}
  </AlertDialog>
</>
```

---

## File: `/frontend/src/app/admin/pagebuilder/page.tsx`

### Component: `PageBuilderContent`

#### Hooks
```typescript
const searchParams = useSearchParams()    // Get URL params
const router = useRouter()                // Navigate
const { pages, loading, refetch, error } = usePages()  // Fetch pages
const { deletePage } = usePageOperations()             // Delete mutation
```

#### State
```typescript
const [renderError, setRenderError] = useState(null)   // Error message
const [isEditorOpen, setIsEditorOpen] = useState(false) // Editor modal open
```

#### Effects
```typescript
// Open editor when pageId present
useEffect(() => {
  if (pageId) setIsEditorOpen(true)
}, [pageId])

// Refetch when closing editor
useEffect(() => {
  if (!isEditorOpen && pageId) refetch()
}, [isEditorOpen, pageId, refetch])
```

#### Handlers
```typescript
handleCreateNewPage()       // Navigate to new page
handleEditPage(id)          // Navigate to edit page
handleViewPage(slug)        // Open published page
handleDeletePage(id)        // Delete and refetch
handleCloseEditor()         // Close and refetch
```

#### Return Value
```tsx
<>
  <div className="min-h-screen bg-gray-50">
    {/* Header with title and New Page button */}
    {/* DataTable component with all props */}
  </div>
  
  {/* Full-screen editor dialog */}
  <Dialog>
    <FullScreenPageBuilder />
  </Dialog>
</>
```

---

## Component Usage Example

### Basic Integration
```tsx
import { DataTable } from '@/app/admin/pagebuilder/data-table';

export function PagesList() {
  const { pages, loading } = usePages();
  const { deletePage } = usePageOperations();
  const router = useRouter();

  return (
    <DataTable
      data={pages?.items || []}
      isLoading={loading}
      onEdit={(id) => router.push(`/editor?id=${id}`)}
      onView={(slug) => window.open(`/${slug}`, '_blank')}
      onDelete={(id) => deletePage(id)}
      onRefresh={() => refetch()}
    />
  );
}
```

---

## Data Model

### Page Interface
```typescript
interface Page {
  id: string;                        // Unique ID
  title: string;                     // Page title
  slug: string;                      // URL slug
  description?: string;              // Page description
  content?: any;                     // Page content (blocks)
  blocks?: PageBlock[];              // Array of page blocks
  status: PageStatus;                // DRAFT | PUBLISHED | ARCHIVED
  seoTitle?: string;                 // SEO title
  seoDescription?: string;           // SEO description
  seoKeywords?: string[];            // SEO keywords
  createdAt: Date;                   // Created timestamp
  updatedAt: Date;                   // Updated timestamp
  publishedAt?: Date;                // Published timestamp
}

enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}
```

---

## Styling

### Tailwind Classes Used

#### Table Styling
```
rounded-md border           → Rounded table border
hover:bg-gray-100/50        → Row hover effect
text-sm                     → Small text
```

#### Button Styling
```
variant="outline"           → Outlined button
variant="ghost"             → Ghost (no background)
size="sm"                   → Small size
disabled={condition}        → Disabled state
```

#### Input Styling
```
pl-10                       → Left padding for icon
w-full                      → Full width
sm:w-[150px]               → Fixed width on tablet+
```

#### Responsive
```
flex-col sm:flex-row        → Stack on mobile, row on tablet
w-full sm:w-[150px]        → Full on mobile, fixed on tablet
gap-4                       → Spacing between items
```

---

## GraphQL Integration

### Queries
```graphql
query GetPages($pagination: PaginationInput, $filters: PageFiltersInput) {
  getPages(pagination: $pagination, filters: $filters) {
    items { id, title, slug, status, blocks, updatedAt, ... }
    pagination { currentPage, totalPages, totalItems, ... }
  }
}
```

### Mutations
```graphql
mutation UpdatePage($id: String!, $input: UpdatePageInput!) {
  updatePage(id: $id, input: $input) { ... }
}

mutation DeletePage($id: String!) {
  deletePage(id: $id) { ... }
}
```

---

## Type Definitions

```typescript
type SortField = 'title' | 'slug' | 'status' | 'updatedAt';
type SortDirection = 'asc' | 'desc' | null;

interface DataTableProps {
  data: Page[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onView: (slug: string) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}
```

---

## Performance Optimizations

### useMemo Hooks
```typescript
// Filtered data (applied filters)
const filteredData = useMemo(() => {
  // Status filter + search
}, [data, statusFilter, globalFilter])

// Sorted data (apply sort to filtered)
const sortedData = useMemo(() => {
  // Sort algorithm
}, [filteredData, sortField, sortDirection])

// Paginated data (slice sorted data)
const paginatedData = useMemo(() => {
  // Slice for current page
}, [sortedData, pageIndex, pageSize])
```

### Dependency Tracking
```
data changed → recalculate filtered, sorted, paginated
statusFilter → recalculate filtered, sorted, paginated
globalFilter → recalculate filtered, sorted, paginated
sortField → recalculate sorted, paginated
sortDirection → recalculate sorted, paginated
pageIndex → recalculate paginated
pageSize → recalculate paginated
```

---

## Event Handlers

### Search
```
User types → globalFilter updates → filteredData recalculates → pageIndex resets to 0
```

### Sort
```
User clicks header → handleSort() cycles state → sortedData recalculates
```

### Filter
```
User selects status → statusFilter updates → filteredData recalculates → pageIndex resets to 0
```

### Pagination
```
User clicks next → pageIndex increments → paginatedData slices new rows
```

### Delete
```
User confirms → handleDelete() → deletePage() mutation → onRefresh() → list updates
```

---

## Error Boundaries

```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
} finally {
  // Cleanup
}
```

---

## Accessibility Attributes

### Semantic HTML
```tsx
<table>           {/* Semantic table */}
<thead>           {/* Table header */}
<tbody>           {/* Table body */}
<th>              {/* Table header cell */}
<td>              {/* Table data cell */}
```

### Interactive Elements
```tsx
<Button>          {/* Native button */}
<Input>           {/* Native input */}
<Select>          {/* Native select */}
<AlertDialog>     {/* Accessible dialog */}
```

---

## Testing Points

### Search
- [ ] Case-insensitive search
- [ ] Search updates in real-time
- [ ] Pagination resets
- [ ] Shows correct filtered count

### Sort
- [ ] Column headers clickable
- [ ] Sort icons update correctly
- [ ] Data actually sorted
- [ ] Multiple clicks cycle state

### Filter
- [ ] Status dropdown works
- [ ] Filter resets pagination
- [ ] Correct rows shown
- [ ] Total count updates

### Pagination
- [ ] Buttons enable/disable correctly
- [ ] Page navigation works
- [ ] Size selector works
- [ ] Page info displays correctly

### CRUD
- [ ] Edit opens modal
- [ ] View opens new tab
- [ ] Delete shows confirmation
- [ ] List refreshes after operation

---

## Browser DevTools Tips

### Check Performance
1. Open DevTools (F12)
2. Go to Performance tab
3. Sort/search/paginate
4. Check timeline (should be <100ms)

### Check Network
1. Open Network tab
2. Delete a page
3. Should see GraphQL mutation
4. Response should be successful

### Check Console
1. Open Console tab
2. Should see minimal logs
3. No error messages
4. No warnings

---

## Version History

```
v1.0 - Initial release
- Sorting (3 columns)
- Search (global)
- Filtering (status)
- Pagination (5/10/20/50 sizes)
- CRUD operations (edit/view/delete)
- Responsive design
- Accessibility features
```

---

**Documentation Complete** ✅
