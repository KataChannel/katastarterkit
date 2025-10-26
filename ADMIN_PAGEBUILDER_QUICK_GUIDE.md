# Admin Page Builder - Quick Reference Guide 📚

## 🎯 Main Features

### 1. View Toggle
```
Grid View (Cards)     ↔  Table View (Rows)
```
Located in top-right corner of the list

### 2. Status Management
**Three statuses available:**
- 🟢 **PUBLISHED**: Live pages
- 🟡 **DRAFT**: Work in progress
- ⚫ **ARCHIVED**: Inactive pages

**How to change status:**
1. Click ⋮ (three dots) on card/row
2. Select status from dropdown
3. Wait for loading to complete

### 3. Delete Pages
**Process:**
1. Click ⋮ (three dots) → Delete
2. Confirm in dialog
3. Page is permanently removed

### 4. Filter & Search
**Search**: Top-left input field
**Filter**: Status dropdown in top-right

**Examples:**
- Show only PUBLISHED pages
- Search for "contact"
- Combine both for specific results

### 5. Quick Actions
**Grid View:**
- Edit button (pencil)
- View button (external link) - for published pages only
- More menu (three dots)

**Table View:**
- More menu (three dots) in action column

---

## 🛠️ Technical Details

### Component Stack
```
PageBuilderContent
├── usePages() - Fetch pages
├── usePageOperations() - CRUD ops
├── View Toggles
├── Filters (Search + Status)
├── Grid/Table Render
├── Delete Confirmation Dialog
├── Editor Dialog
└── Error Handling
```

### State Variables
- `viewMode`: 'grid' | 'table'
- `statusFilter`: 'all' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
- `searchTerm`: string
- `deleteConfirm`: { id, title } | null
- `statusUpdating`: { [key: string]: boolean }
- `isDeleting`: boolean

### Event Handlers
- `handleCreateNewPage()`
- `handleEditPage(id)`
- `handleViewPage(slug)`
- `handleDeletePage(id, title)`
- `confirmDelete()`
- `handleStatusChange(id, newStatus)`

---

## 📊 Status Flow

```
NEW PAGE (Draft)
     ↓
  EDIT ← → DRAFT (saved)
     ↓
  PUBLISH
     ↓
  PUBLISHED (live)
     ↓
  ARCHIVE
     ↓
  ARCHIVED (hidden)
```

---

## 🎨 UI Components Used

```tsx
// Layout
Tabs, TabsContent, TabsList, TabsTrigger

// Input
Input (search)
Select (status filter)

// Display
Table, TableHeader, TableBody, TableHead, TableCell, TableRow
Card (grid view)
Badge (status indicator)

// Actions
Button (multiple variants)
DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger

// Feedback
Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
Alert, AlertDescription

// Icons
Plus, Search, Edit, Eye, Trash2, ExternalLink, Calendar, Globe,
AlertCircle, MoreVertical, Loader2, Check, X, Grid3x3, LayoutList
```

---

## 💻 Code Patterns

### Memoized Filtering
```tsx
const filteredPages = useMemo(() => {
  let filtered = pages.items;
  if (statusFilter !== 'all') {
    filtered = filtered.filter(p => p.status === statusFilter);
  }
  return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}, [pages, statusFilter]);
```

### Status Update with Loading
```tsx
const handleStatusChange = async (id: string, newStatus: string) => {
  setStatusUpdating(prev => ({ ...prev, [id]: true }));
  try {
    await updatePage(id, { ...page, status: newStatus });
    refetch();
  } finally {
    setStatusUpdating(prev => ({ ...prev, [id]: false }));
  }
};
```

### Safe Deletion
```tsx
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

---

## 🎯 User Flows

### Creating a Page
1. Click "New Page" button
2. Editor opens
3. Build content
4. Save (auto-save enabled)
5. Page appears in list as DRAFT

### Publishing a Page
1. Find page in list
2. Click ⋮ → Publish
3. Status changes to PUBLISHED
4. Click View Page to see it live

### Organizing Pages
1. Use Status Filter to see groups
2. Use Search to find specific pages
3. Switch between Grid/Table based on preference

### Archiving Old Content
1. Find page
2. Click ⋮ → Archive
3. Page hidden from main view
4. Can still be found if needed

### Deleting Pages
1. Click ⋮ → Delete
2. Confirm in dialog
3. Page permanently removed
4. List automatically updates

---

## 📈 Performance Notes

- **Sorting**: Automatic by update date (newest first)
- **Filtering**: Optimized with useMemo
- **Loading**: Individual indicators per page
- **Lazy**: Pages loaded on demand (pagination)
- **Caching**: Apollo Client automatic caching

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Page not appearing | Try searching or clearing filters |
| Status didn't change | Check network, try again |
| Delete failed | Refresh and retry |
| View stuck loading | Close and reopen dialog |

---

## 📱 Responsive Breakpoints

| Screen | View |
|--------|------|
| Mobile | 1-column grid, scrollable table |
| Tablet | 2-column grid, scrollable table |
| Desktop | 3-column grid, full table |

---

## 🔐 Security Notes

- Delete requires confirmation dialog
- Status changes are logged via toast
- All operations require user authentication
- GraphQL mutations validated server-side

---

## 📞 Support

For issues or questions:
1. Check error messages in alerts
2. Verify page data is valid
3. Check browser console for errors
4. Refresh page and retry
5. Contact admin support if issues persist

