# Admin Page Builder - Code Examples & Developer Guide 👨‍💻

## 🚀 Quick Start for Developers

### Understanding the Component Structure

```tsx
export default function AdminPageBuilderPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PageBuilderContent />
    </Suspense>
  );
}

function PageBuilderContent() {
  // State Management
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<...>(null);
  
  // API Hooks
  const { pages, loading, refetch, error } = usePages(...);
  const { deletePage, updatePage } = usePageOperations();
  
  // Computed State
  const filteredPages = useMemo(() => {...}, [pages, statusFilter]);
  
  // Render UI
  return (
    <>
      <Header />
      <Controls />
      {viewMode === 'grid' ? <GridView /> : <TableView />}
      <DeleteDialog />
      <EditorDialog />
    </>
  );
}
```

---

## 📝 State Management Examples

### 1. View Mode Toggle
```tsx
// Toggle between grid and table
const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

// In UI:
<Button
  variant={viewMode === 'grid' ? 'default' : 'outline'}
  onClick={() => setViewMode('grid')}
>
  <Grid3x3 size={20} />
</Button>

<Button
  variant={viewMode === 'table' ? 'default' : 'outline'}
  onClick={() => setViewMode('table')}
>
  <LayoutList size={20} />
</Button>
```

### 2. Status Filtering
```tsx
// Filter pages by status
const [statusFilter, setStatusFilter] = useState<string>('all');

// In UI:
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Status</SelectItem>
    <SelectItem value="DRAFT">Draft</SelectItem>
    <SelectItem value="PUBLISHED">Published</SelectItem>
    <SelectItem value="ARCHIVED">Archived</SelectItem>
  </SelectContent>
</Select>
```

### 3. Delete Confirmation
```tsx
// Manage delete dialog state
const [deleteConfirm, setDeleteConfirm] = useState<{
  id: string;
  title: string;
} | null>(null);

// Trigger delete:
const handleDeletePage = (id: string, title: string) => {
  setDeleteConfirm({ id, title });
};

// Confirm delete:
const confirmDelete = async () => {
  if (!deleteConfirm) return;
  setIsDeleting(true);
  try {
    await deletePage(deleteConfirm.id);
    setDeleteConfirm(null);
    refetch();
  } finally {
    setIsDeleting(false);
  }
};
```

### 4. Status Update Loading States
```tsx
// Track loading for each page independently
const [statusUpdating, setStatusUpdating] = useState<{
  [key: string]: boolean;
}>({});

// Update status:
const handleStatusChange = async (id: string, newStatus: string) => {
  setStatusUpdating(prev => ({ ...prev, [id]: true }));
  try {
    await updatePage(id, {
      ...page,
      status: newStatus as PageStatus,
    });
    refetch();
  } catch (error) {
    console.error('Error updating page status:', error);
  } finally {
    setStatusUpdating(prev => ({ ...prev, [id]: false }));
  }
};

// In UI:
<Button disabled={statusUpdating[id]}>
  {statusUpdating[id] && <Loader2 className="animate-spin mr-2" />}
  Publish
</Button>
```

---

## 🔍 Filtering & Sorting Examples

### Memoized Filtering Logic
```tsx
const filteredPages = useMemo(() => {
  if (!pages?.items) return [];
  
  let filtered = pages.items;
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(p => p.status === statusFilter);
  }
  
  // Sort by update date (newest first)
  return filtered.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA; // Descending
  });
}, [pages, statusFilter]);

// Results:
// - Automatically recalculates when pages or statusFilter changes
// - Performance: Only recalculates what's needed
// - Always returns latest data
```

### Search Implementation
```tsx
const [searchTerm, setSearchTerm] = useState('');

// API call with search:
const { pages, loading, refetch } = usePages(
  { page: 1, limit: 100 },
  searchTerm ? { search: searchTerm } : undefined,
  { skip: pageId ? true : false }
);

// In UI:
<div className="relative flex-1 max-w-xs">
  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <Input
    type="text"
    placeholder="Search pages..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
</div>
```

---

## 🎯 Action Handler Examples

### 1. Create New Page
```tsx
const handleCreateNewPage = () => {
  try {
    router.push('/admin/pagebuilder');
    setIsEditorOpen(true);
  } catch (error) {
    console.error('Error creating page:', error);
    setRenderError('Failed to create new page');
  }
};

// Usage:
<Button onClick={handleCreateNewPage}>
  <Plus size={20} />
  <span>New Page</span>
</Button>
```

### 2. Edit Page
```tsx
const handleEditPage = (id: string) => {
  try {
    router.push(`/admin/pagebuilder?pageId=${id}`);
    setIsEditorOpen(true);
  } catch (error) {
    console.error('Error editing page:', error);
    setRenderError('Failed to edit page');
  }
};

// Usage:
<Button onClick={() => handleEditPage(page.id)}>
  <Edit size={16} className="mr-1" />
  Edit
</Button>
```

### 3. View Published Page
```tsx
const handleViewPage = (slug: string) => {
  try {
    window.open(`/${slug}`, '_blank');
  } catch (error) {
    console.error('Error viewing page:', error);
  }
};

// Usage (only for published pages):
{page.status === PageStatus.PUBLISHED && page.slug && (
  <Button onClick={() => handleViewPage(page.slug)}>
    <ExternalLink size={16} />
  </Button>
)}
```

### 4. Update Page Status
```tsx
const handleStatusChange = async (id: string, newStatus: string) => {
  const page = pages?.items?.find(p => p.id === id);
  if (!page) return;
  
  setStatusUpdating(prev => ({ ...prev, [id]: true }));
  try {
    await updatePage(id, {
      ...page,
      status: newStatus as PageStatus,
    });
    refetch();
  } catch (error) {
    console.error('Error updating page status:', error);
    // Error handled by useToast hook
  } finally {
    setStatusUpdating(prev => ({ ...prev, [id]: false }));
  }
};

// Usage:
<DropdownMenuItem onClick={() => handleStatusChange(page.id, PageStatus.PUBLISHED)}>
  <Check size={16} className="mr-2" /> Publish
</DropdownMenuItem>
```

### 5. Delete Page
```tsx
const handleDeletePage = async (id: string, title: string) => {
  setDeleteConfirm({ id, title });
};

const confirmDelete = async () => {
  if (!deleteConfirm) return;
  
  setIsDeleting(true);
  try {
    await deletePage(deleteConfirm.id);
    setDeleteConfirm(null);
    refetch();
  } catch (error) {
    console.error('Error deleting page:', error);
  } finally {
    setIsDeleting(false);
  }
};

// Usage:
<DropdownMenuItem onClick={() => handleDeletePage(page.id, page.title)}>
  <Trash2 size={16} className="mr-2" /> Delete
</DropdownMenuItem>
```

---

## 🎨 UI Component Examples

### Grid View Card
```tsx
<Card className="p-6 hover:shadow-lg transition-all duration-200 flex flex-col">
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
        {page.title || 'Untitled Page'}
      </h3>
      <p className="text-sm text-gray-600 truncate">
        /{page.slug || 'untitled'}
      </p>
    </div>
    <DropdownMenu>
      {/* More menu */}
    </DropdownMenu>
  </div>

  <Badge className={`${getStatusColor(page.status)} w-fit mb-4 border`}>
    {String(page.status).toLowerCase()}
  </Badge>

  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 flex-1">
    <div className="flex items-center space-x-1">
      <Calendar size={14} />
      <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
    </div>
    <div className="flex items-center space-x-1">
      <Globe size={14} />
      <span>{getBlocksCount(page.blocks)} blocks</span>
    </div>
  </div>

  <div className="flex items-center gap-2 pt-4 border-t">
    <Button variant="outline" size="sm" onClick={() => handleEditPage(page.id)} className="flex-1">
      <Edit size={16} className="mr-1" /> Edit
    </Button>
    {page.status === PageStatus.PUBLISHED && (
      <Button variant="outline" size="sm" onClick={() => handleViewPage(page.slug)}>
        <ExternalLink size={16} />
      </Button>
    )}
  </div>
</Card>
```

### Table Row
```tsx
<TableRow className="hover:bg-gray-50">
  <TableCell className="font-medium">
    <div className="max-w-xs">
      <p className="truncate">{page.title || 'Untitled Page'}</p>
    </div>
  </TableCell>
  <TableCell className="text-gray-600">/{page.slug || 'untitled'}</TableCell>
  <TableCell>
    <Badge className={`${getStatusColor(page.status)} border`}>
      {String(page.status).toLowerCase()}
    </Badge>
  </TableCell>
  <TableCell className="text-center text-gray-600">
    {getBlocksCount(page.blocks)}
  </TableCell>
  <TableCell className="text-gray-600 text-sm">
    {new Date(page.updatedAt).toLocaleDateString()}
  </TableCell>
  <TableCell className="text-right">
    <DropdownMenu>
      {/* More menu */}
    </DropdownMenu>
  </TableCell>
</TableRow>
```

### Action Menu
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <MoreVertical size={16} />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleEditPage(page.id)}>
      <Edit size={16} className="mr-2" /> Edit
    </DropdownMenuItem>
    
    {page.status === PageStatus.PUBLISHED && page.slug && (
      <>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleViewPage(page.slug)}>
          <Eye size={16} className="mr-2" /> View Page
        </DropdownMenuItem>
      </>
    )}
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem
      onClick={() => handleStatusChange(page.id, PageStatus.PUBLISHED)}
      disabled={statusUpdating[page.id]}
    >
      {statusUpdating[page.id] ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Check size={16} className="mr-2" />
      )}
      Publish
    </DropdownMenuItem>
    
    <DropdownMenuItem
      onClick={() => handleStatusChange(page.id, PageStatus.DRAFT)}
      disabled={statusUpdating[page.id]}
    >
      {statusUpdating[page.id] ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Edit size={16} className="mr-2" />
      )}
      Save as Draft
    </DropdownMenuItem>
    
    <DropdownMenuItem
      onClick={() => handleStatusChange(page.id, PageStatus.ARCHIVED)}
      disabled={statusUpdating[page.id]}
    >
      {statusUpdating[page.id] ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <X size={16} className="mr-2" />
      )}
      Archive
    </DropdownMenuItem>
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem
      onClick={() => handleDeletePage(page.id, page.title)}
      className="text-red-600"
    >
      <Trash2 size={16} className="mr-2" /> Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Delete Confirmation Dialog
```tsx
<Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-red-600">
        <AlertCircle size={24} />
        Delete Page
      </DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4">
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="ml-2 text-red-800">
          This action cannot be undone. The page "{deleteConfirm?.title}" will be permanently deleted.
        </AlertDescription>
      </Alert>
      
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this page? All associated content and blocks will be removed.
      </p>
    </div>

    <DialogFooter className="gap-2">
      <Button
        variant="outline"
        onClick={() => setDeleteConfirm(null)}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={confirmDelete}
        disabled={isDeleting}
        className="gap-2"
      >
        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
        Delete Page
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🛠️ Utility Functions

### Get Status Color
```tsx
const getStatusColor = (status: PageStatus) => {
  try {
    switch (status) {
      case PageStatus.PUBLISHED:
        return 'bg-green-100 text-green-800 border-green-200';
      case PageStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PageStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  } catch (error) {
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
```

### Get Blocks Count
```tsx
const getBlocksCount = (blocks: any): number => {
  try {
    if (!blocks) return 0;
    if (Array.isArray(blocks)) return blocks.length;
    if (typeof blocks === 'object' && 'blocks' in blocks && Array.isArray(blocks.blocks)) {
      return blocks.blocks.length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting blocks count:', error);
    return 0;
  }
};
```

---

## 🔗 Hook Usage

### usePages Hook
```tsx
const { pages, loading, error, refetch } = usePages(
  { page: 1, limit: 100 },        // Pagination
  searchTerm ? { search: searchTerm } : undefined,  // Filters
  { skip: pageId ? true : false }  // Options
);

// pages.items: Array<Page>
// pages.pagination: { currentPage, totalPages, ... }
// loading: boolean
// error: Error | null
// refetch: () => Promise<void>
```

### usePageOperations Hook
```tsx
const { createPage, updatePage, deletePage } = usePageOperations();

// Create
await createPage({
  title: 'New Page',
  slug: 'new-page',
  status: PageStatus.DRAFT,
  // ...
});

// Update
await updatePage(pageId, {
  title: 'Updated Title',
  status: PageStatus.PUBLISHED,
  // ...
});

// Delete
await deletePage(pageId);
```

---

## 📊 TypeScript Types

```tsx
interface Page {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  content?: any;
  blocks?: PageBlock[];
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isPublished?: boolean;
  showInNavigation?: boolean;
  allowIndexing?: boolean;
  requireAuth?: boolean;
  customCSS?: string;
  customJS?: string;
  headCode?: string;
}

enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

interface PaginatedPages {
  items: Page[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    totalItems: number;
  };
}
```

---

## 🎓 Common Patterns

### Async Operation with Loading
```tsx
const [isLoading, setIsLoading] = useState(false);

const performAction = async () => {
  setIsLoading(true);
  try {
    await someAsyncOperation();
    // Handle success
  } catch (error) {
    // Handle error
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Conditional Rendering
```tsx
{loading ? (
  <LoadingSpinner />
) : filteredPages.length === 0 ? (
  <EmptyState />
) : viewMode === 'grid' ? (
  <GridView />
) : (
  <TableView />
)}
```

### Memoized Computation
```tsx
const computedValue = useMemo(() => {
  return expensiveComputation(dependency1, dependency2);
}, [dependency1, dependency2]);
```

---

## 💡 Tips & Tricks

### 1. Debug State Changes
```tsx
useEffect(() => {
  console.log('View mode changed:', viewMode);
}, [viewMode]);
```

### 2. Safe Async Operations
```tsx
const isMounted = useRef(true);

useEffect(() => {
  return () => {
    isMounted.current = false;
  };
}, []);

const asyncFunction = async () => {
  if (isMounted.current) {
    // Safe to update state
    setState(value);
  }
};
```

### 3. Performance Monitoring
```tsx
console.time('filter-operation');
const result = filteredPages;
console.timeEnd('filter-operation');
```

---

## 🚀 Extending the Component

### Add a New Status
```tsx
// 1. Add to backend PageStatus enum
enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',  // New
  ARCHIVED = 'ARCHIVED'
}

// 2. Add color mapping
case PageStatus.SCHEDULED:
  return 'bg-blue-100 text-blue-800 border-blue-200';

// 3. Add to filter
<SelectItem value="SCHEDULED">Scheduled</SelectItem>

// 4. Add to status menu
<DropdownMenuItem onClick={() => handleStatusChange(page.id, PageStatus.SCHEDULED)}>
  Schedule
</DropdownMenuItem>
```

### Add Bulk Operations
```tsx
// Add state
const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());

// Add checkboxes to cards/rows
<Checkbox
  checked={selectedPages.has(page.id)}
  onChange={(checked) => {
    const newSet = new Set(selectedPages);
    if (checked) newSet.add(page.id);
    else newSet.delete(page.id);
    setSelectedPages(newSet);
  }}
/>

// Add bulk operations
const bulkDelete = async () => {
  for (const id of selectedPages) {
    await deletePage(id);
  }
};
```

---

This guide provides comprehensive code examples for understanding, maintaining, and extending the Admin Page Builder component.

