# EditorToolbar vs PageBuilderHeader - Detailed Comparison

## 📊 Side-by-Side Comparison Table

| Aspect | EditorToolbar | PageBuilderHeader |
|--------|---------------|-------------------|
| **File Location** | `layout/EditorToolbar.tsx` | `PageBuilderHeader.tsx` |
| **UI Position** | Top toolbar (right side) | Top area (left side) |
| **Button Icon** | Settings/Gear icon | Settings/Gear icon |
| **Button Label** | None (icon only) | "Settings" text |
| **Dialog Title** | "Global Settings" | "Page Settings" |
| **Dialog Size** | max-w-2xl | max-w-2xl |
| **User Audience** | Developers/Advanced users | Content editors |
| **Primary Purpose** | Global editor configuration | Page metadata & workflow |

---

## 🔧 EditorToolbar - "Global Settings" Dialog

### Button Location in Toolbar
```
┌─────────────────────────────────────────────────────────┐
│ Kata Builder [Visual|Code] [Desktop|Tablet|Mobile]     │
│                                                          │
│                              ... [Template▼] [Save] [⚙️] [X]
│                                                          ↑
│                                                  EditorToolbar Settings
└─────────────────────────────────────────────────────────┘
```

### Settings Provided
```
Global Settings
├─ 📄 Page Settings
│  ├─ Page Title (text input)
│  ├─ Page Description (textarea)
│  └─ Page Slug (text input)
│
├─ 🔍 SEO Settings
│  ├─ SEO Title (text input, 50-60 chars)
│  ├─ Meta Description (textarea, 150-160 chars)
│  └─ Keywords (text input)
│
├─ 🎛️ Page Options
│  ├─ Published (toggle switch)
│  ├─ Show in Navigation (toggle switch)
│  ├─ Allow Indexing (toggle switch)
│  └─ Require Authentication (toggle switch)
│
└─ 💻 Custom Code
   ├─ Custom CSS (code textarea)
   ├─ Custom JavaScript (code textarea)
   └─ Head Code (code textarea)
```

### Code Implementation
```tsx
// Line 353: Settings button in toolbar
<Button 
  variant="ghost" 
  size="icon" 
  title="Global Settings"
  onClick={() => setIsSettingsOpen(true)}
>
  <Settings className="w-4 h-4" />
</Button>

// Line 378-645: Dialog content with multiple settings groups
<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
  <DialogContent className="flex flex-col max-w-2xl max-h-[90vh]">
    <DialogHeader>
      <DialogTitle>Global Settings</DialogTitle>
      <DialogDescription>
        Configure global page settings that apply to the entire page
      </DialogDescription>
    </DialogHeader>
    
    {/* 4 Settings Groups: Page, SEO, Options, Custom Code */}
    {/* Each with independent form inputs */}
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSaveSettings}>
        Save Settings
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### State Management
```tsx
// Line 94-106: Settings state with 13 fields
const [pageSettings, setPageSettings] = useState({
  pageTitle: pageTitle || '',
  pageDescription: '',
  pageSlug: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  isPublished: true,
  showInNavigation: true,
  allowIndexing: true,
  requireAuth: false,
  customCSS: '',
  customJS: '',
  headCode: '',
});
```

### Data Loading
```tsx
// Line 137-148: Loads from GraphQL GET_PAGE_BY_ID
const { data: pageData } = useQuery(GET_PAGE_BY_ID, {
  variables: { id: pageId },
  skip: !pageId,
});

// Updates state when page data arrives
useEffect(() => {
  if (pageData?.getPageById) {
    const page = pageData.getPageById;
    setPageSettings(prev => ({
      ...prev,
      pageTitle: page.title || '',
      pageDescription: page.description || '',
      pageSlug: page.slug || '',
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || '',
      seoKeywords: Array.isArray(page.seoKeywords) 
        ? page.seoKeywords.join(', ') 
        : '',
    }));
  }
}, [pageData]);
```

### Save Handler
```tsx
// Line 598-613: Calls onSettingsSave callback
<Button 
  onClick={async () => {
    try {
      if (onSettingsSave) {
        await onSettingsSave(pageSettings);
      }
      toast({
        title: 'Settings saved',
        type: 'success',
      });
      setIsSettingsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        type: 'error',
      });
    }
  }}
>
  Save Settings
</Button>
```

---

## 📝 PageBuilderHeader - "Page Settings" Dialog

### Button Location in Header
```
┌───────────────────────────────────────────────────────────┐
│ [Homepage 🏠] Page Title                [⚙️ Settings] [•••]
│                                             ↑
│                              PageBuilderHeader Settings
└───────────────────────────────────────────────────────────┘
```

### Settings Provided (Via PageSettingsForm Component)
```
Page Settings (Dialog)
└─ Tabs:
   ├─ General Tab
   │  ├─ Page Title (text input)
   │  ├─ Page Slug (text input)
   │  ├─ Page Status (dropdown with confirmation)
   │  │  ├─ DRAFT (status selection)
   │  │  ├─ PUBLISHED (status selection)
   │  │  └─ ARCHIVED (status selection)
   │  ├─ Homepage Toggle (with info box) ✨ NEW FEATURE
   │  └─ [Vietnamese descriptions for all]
   │
   ├─ Layout Tab
   │  ├─ Header settings
   │  └─ Footer settings
   │
   └─ SEO Tab
      ├─ SEO Title
      ├─ SEO Description
      └─ SEO Keywords
```

### Code Implementation
```tsx
// PageBuilderHeader.tsx - Settings button and dialog

<Button 
  variant="outline" 
  size="sm" 
  className="flex items-center space-x-2"
  onClick={handleOpenSettings}
>
  <Settings size={16} />
  <span>Settings</span>
</Button>

<Dialog open={true} onOpenChange={handleCloseSettings}>
  <DialogTrigger asChild>
    {/* Button above */}
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Page Settings</DialogTitle>
    </DialogHeader>
    {editingPage && (
      <PageSettingsForm page={editingPage} onUpdate={setEditingPage} />
    )}
  </DialogContent>
</Dialog>
```

### Component Usage
```tsx
// Imports
import { PageSettingsForm } from '@/components/page-builder/forms/PageSettingsForm';
import { Home } from 'lucide-react';

// Homepage Badge - NEW FEATURE
{editingPage.isHomepage && (
  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 
                     flex items-center space-x-1">
    <Home size={14} />
    <span>Homepage</span>
  </Badge>
)}
```

### PageSettingsForm Features
```tsx
// PageSettingsForm.tsx handles:
- Tabbed interface (General, Layout, SEO)
- Status change confirmation dialog
- Vietnamese labels
- Homepage toggle with info message
- Auto-save on changes
- GraphQL mutation integration
```

---

## 🔄 Data Synchronization

### EditorToolbar Data Flow
```
GET_PAGE_BY_ID Query (Apollo)
        ↓
pageData state update
        ↓
handleSettingChange() for each field
        ↓
pageSettings state
        ↓
onSettingsSave callback to parent
        ↓
PageBuilder component handles mutation
```

### PageBuilderHeader Data Flow
```
editingPage prop from PageBuilder
        ↓
PageSettingsForm component
        ↓
Form submission
        ↓
GraphQL mutation (via PageSettingsForm)
        ↓
onUpdate callback (setEditingPage)
        ↓
Re-render with new data
```

---

## ⚡ Key Differences

### 1. **Dialog Structure**
- **EditorToolbar:** Flat form with 4 sections (Page, SEO, Options, Code)
- **PageBuilderHeader:** Tabbed form with 3 tabs (General, Layout, SEO)

### 2. **Status Handling**
- **EditorToolbar:** `isPublished` boolean toggle (simple on/off)
- **PageBuilderHeader:** `status` enum with confirmation (DRAFT/PUBLISHED/ARCHIVED)

### 3. **Homepage Support**
- **EditorToolbar:** ❌ No homepage flag
- **PageBuilderHeader:** ✅ Homepage toggle + orange badge

### 4. **Custom Code**
- **EditorToolbar:** ✅ Custom CSS, JS, Head code support
- **PageBuilderHeader:** ❌ No custom code fields

### 5. **Layout Customization**
- **EditorToolbar:** ❌ Not available
- **PageBuilderHeader:** ✅ Header/Footer customization via Layout tab

### 6. **Language Support**
- **EditorToolbar:** 🔤 English only
- **PageBuilderHeader:** 🇻🇳 Vietnamese labels (via PageSettingsForm)

### 7. **Advanced Options**
- **EditorToolbar:** Indexing, Authentication, Show in Navigation toggles
- **PageBuilderHeader:** ❌ Not available (basic workflow only)

---

## 🎯 When to Use Which?

### Use EditorToolbar Settings For:
- ✅ Adding custom CSS/JavaScript to a page
- ✅ Adding analytics code to head
- ✅ Advanced SEO configuration
- ✅ Enabling/disabling search indexing
- ✅ Requiring authentication
- ✅ Controlling navigation visibility
- ✅ Detailed page descriptions
- ✅ Advanced developer workflows

### Use PageBuilderHeader Settings For:
- ✅ Changing page title (quick)
- ✅ Changing page slug/URL (quick)
- ✅ Publishing/unpublishing pages
- ✅ Archiving pages
- ✅ Setting as homepage
- ✅ Layout customization (header/footer)
- ✅ Basic SEO metadata
- ✅ Standard content editor workflow
- ✅ Working in Vietnamese interface

---

## 📱 Component Hierarchy

```
PageBuilder (Main Container)
├── EditorToolbar (Top toolbar)
│   ├── Mode switcher (Visual/Code)
│   ├── Device previewer (Desktop/Tablet/Mobile)
│   ├── Template menu
│   ├── Save button
│   └── Settings button ←── DIALOG 1: Global Settings
│       └── Dialog
│           ├── Page Settings
│           ├── SEO Settings
│           ├── Page Options
│           └── Custom Code
│
├── PageBuilderHeader (Page info header)
│   ├── Homepage badge (conditional)
│   ├── Page title display
│   ├── Status indicator
│   └── Settings button ←── DIALOG 2: Page Settings (via PageSettingsForm)
│       └── Dialog
│           └── PageSettingsForm
│               ├── General Tab (Title, Slug, Status, Homepage)
│               ├── Layout Tab (Header/Footer)
│               └── SEO Tab (Meta tags)
│
└── Canvas (Page editing area)
    └── Page content
```

---

## ✅ No Conflict - By Design

These two settings dialogs are **intentionally separate** to serve different workflows:

1. **EditorToolbar Settings** = Developer/Advanced workflow
2. **PageBuilderHeader Settings** = Content Editor/Standard workflow

Both can coexist without conflict because they:
- ✅ Appear in different UI locations (top-left vs top-right)
- ✅ Serve different user types (editors vs developers)
- ✅ Handle different feature sets (no field overlaps except basic page metadata)
- ✅ Load data from same GraphQL source (GET_PAGE_BY_ID)
- ✅ Update same database records via mutations

---

## 🚀 Future Enhancement Opportunities

### For EditorToolbar:
- Add Vietnamese language support
- Add status selector (currently just isPublished toggle)
- Add homepage flag integration
- Add visual status indicator

### For PageBuilderHeader:
- Could add custom code fields (optional)
- Could add advanced options (optional)
- Could unify into single dialog (breaking change, not recommended)

### Recommendation:
**Keep them separate** - they serve different purposes and user types. The current architecture is clean and maintainable.
