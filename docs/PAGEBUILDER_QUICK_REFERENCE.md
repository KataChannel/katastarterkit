# PageBuilder Quick Reference Guide

**For developers working with the refactored PageBuilder**

---

## 🎯 Quick Start

### Using the PageBuilder

```typescript
import PageBuilder from '@/components/page-builder/PageBuilder';

// Create new page
<PageBuilder />

// Edit existing page
<PageBuilder pageId="123" />
```

That's it! The Provider handles all state management automatically.

---

## 📦 Component Overview

### 1. PageBuilder.tsx (Main Entry)
**What it does**: Wraps everything with Provider and assembles components  
**When to edit**: Adding new modals or changing layout structure  
**File**: `components/page-builder/PageBuilder.tsx` (151 lines)

```typescript
<PageBuilderProvider pageId={pageId}>
  <PageBuilderHeader />
  <div className="flex">
    <PageBuilderSidebar />
    <PageBuilderCanvas />
  </div>
  {/* Modals */}
</PageBuilderProvider>
```

---

### 2. PageBuilderProvider.tsx (State Management)
**What it does**: Manages ALL PageBuilder state and operations  
**When to edit**: Adding new state, operations, or GraphQL integrations  
**File**: `components/page-builder/PageBuilderProvider.tsx` (600 lines)

**Accessing the context:**
```typescript
import { usePageBuilderContext } from './PageBuilderProvider';

const { 
  page, blocks, editingPage,
  handlePageSave, handleAddBlock, handleBlockUpdate 
} = usePageBuilderContext();
```

**Available state (19 variables):**
```typescript
// Page
page, editingPage, isNewPageMode, loading

// Blocks
blocks, draggedBlock

// UI
showPageSettings, showPreview, showAddChildDialog, addChildParentId

// Templates
allTemplates, customTemplates, selectedTemplate,
templateSearchQuery, selectedTemplateCategory,
showPreviewModal, isApplyingTemplate,
showSaveTemplateDialog, isSavingTemplate
```

**Available operations (30+ functions):**
```typescript
// Page ops
handlePageSave(), handlePageDelete(), setEditingPage(), refetch()

// Block ops
handleAddBlock(type), handleBlockUpdate(id, content, style),
handleBlockDelete(id), handleBlocksReorder(newBlocks)

// Nested ops
handleAddChild(parentId), handleAddChildBlock(parentId, type),
handleCloseAddChildDialog()

// Drag-drop
handleDragStart(event), handleDragEnd(event)

// Template ops
handlePreviewTemplate(template), handleApplyTemplate(template),
handleSaveAsTemplate(template), handleDeleteCustomTemplate(id),
handleClosePreview()

// UI setters
setShowPageSettings(), setShowPreview(), setTemplateSearchQuery(),
setSelectedTemplateCategory(), setShowSaveTemplateDialog()
```

---

### 3. PageBuilderHeader.tsx (Top Bar)
**What it does**: Displays page title, status, and action buttons  
**When to edit**: Adding new header buttons or changing layout  
**File**: `components/page-builder/PageBuilderHeader.tsx` (120 lines)

**Buttons:**
- **Save as Template**: Opens save dialog (disabled if no blocks)
- **Preview**: Toggles preview mode
- **Settings**: Opens page settings form
- **Save/Create Page**: Primary action

```typescript
<PageBuilderHeader />
// No props needed - reads from context
```

---

### 4. PageBuilderSidebar.tsx (Left Panel)
**What it does**: Block palette and template browser  
**When to edit**: Adding new block types or template features  
**File**: `components/page-builder/PageBuilderSidebar.tsx` (240 lines)

**Blocks Tab**: 16 block type buttons
**Templates Tab**: Search, filter, template cards

**Adding a new block type:**
```typescript
// In BLOCK_TYPES array
{ 
  type: BlockType.MY_BLOCK, 
  label: 'My Block', 
  icon: MyIcon, 
  color: 'bg-blue-100 text-blue-600' 
}
```

```typescript
<PageBuilderSidebar />
// No props needed - reads from context
```

---

### 5. PageBuilderCanvas.tsx (Editing Area)
**What it does**: Drag-and-drop editing area with blocks  
**When to edit**: Changing drag-and-drop behavior or layout  
**File**: `components/page-builder/PageBuilderCanvas.tsx` (120 lines)

**Modes:**
- **Edit**: Drag-and-drop enabled, blocks editable
- **Preview**: Read-only view

```typescript
<PageBuilderCanvas />
// No props needed - reads from context
```

---

### 6. PageSettingsForm.tsx (Settings Form)
**What it does**: Form for editing page metadata  
**When to edit**: Adding new page fields  
**File**: `components/page-builder/PageSettingsForm.tsx` (160 lines)

**Tabs:**
- **General**: Title, slug, status, description
- **SEO**: SEO title, description, keywords

```typescript
<PageSettingsForm 
  page={editingPage} 
  onUpdate={setEditingPage} 
/>
```

**Adding a new field:**
```typescript
// 1. Add to formData state
const [formData, setFormData] = useState({
  ...existingFields,
  myNewField: page.myNewField || ''
});

// 2. Add input in JSX
<Input
  value={formData.myNewField}
  onChange={(e) => handleInputChange('myNewField', e.target.value)}
/>
```

---

## 🔧 Common Tasks

### Task 1: Add a New Block Type

**Step 1**: Define in GraphQL schema
```graphql
enum BlockType {
  # ... existing types
  MY_NEW_BLOCK
}
```

**Step 2**: Add to BLOCK_TYPES in `PageBuilderSidebar.tsx`
```typescript
{ 
  type: BlockType.MY_NEW_BLOCK, 
  label: 'My New Block', 
  icon: Star, // lucide-react icon
  color: 'bg-purple-100 text-purple-600' 
}
```

**Step 3**: Add default content in `PageBuilderProvider.tsx`
```typescript
const DEFAULT_BLOCK_CONTENT = {
  // ... existing
  [BlockType.MY_NEW_BLOCK]: { 
    myField: 'default value',
    style: {} 
  }
};
```

**Step 4**: Create renderer in `blocks/` directory
```typescript
// blocks/MyNewBlockRenderer.tsx
export function MyNewBlockRenderer({ block, isEditing, onUpdate }) {
  // Render logic
}
```

Done! Block type now available in palette.

---

### Task 2: Add a Page Field

**Step 1**: Add to GraphQL schema
```graphql
type Page {
  # ... existing fields
  myNewField: String
}
```

**Step 2**: Add to PageSettingsForm state
```typescript
const [formData, setFormData] = useState({
  // ... existing
  myNewField: page.myNewField || ''
});
```

**Step 3**: Add input field
```typescript
<Label>My New Field</Label>
<Input
  value={formData.myNewField}
  onChange={(e) => handleInputChange('myNewField', e.target.value)}
/>
```

Done! Field now editable in settings form.

---

### Task 3: Add a Header Button

**Step 1**: Add state to Provider (if needed)
```typescript
const [showMyDialog, setShowMyDialog] = useState(false);
```

**Step 2**: Export in context value
```typescript
const value = {
  // ... existing
  showMyDialog,
  setShowMyDialog,
};
```

**Step 3**: Add button in Header
```typescript
<Button onClick={() => setShowMyDialog(true)}>
  <MyIcon className="h-4 w-4 mr-2" />
  My Action
</Button>
```

Done! Button now in header.

---

### Task 4: Modify Drag-and-Drop Behavior

**Edit**: `PageBuilderProvider.tsx` → `handleDragEnd` function

**Example**: Prevent dragging to top
```typescript
const handleDragEnd = useCallback((event: DragEndEvent) => {
  const { active, over } = event;
  
  if (!over || active.id === over.id) {
    setDraggedBlock(null);
    return;
  }
  
  // Custom logic
  if (over.id === 'top') {
    toast.error('Cannot move to top');
    setDraggedBlock(null);
    return;
  }
  
  // ... rest of logic
}, [blocks]);
```

---

### Task 5: Add Template Category

**Step 1**: Templates are defined in `data/blockTemplates.ts`

**Step 2**: Add template with new category
```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Description',
  category: 'my-category', // ← New category
  thumbnail: '/images/my-template.png',
  blocks: [/* ... */]
}
```

Done! Category automatically appears in filter dropdown.

---

## 🐛 Debugging Tips

### Problem: Context not available
**Error**: `usePageBuilderContext must be used within PageBuilderProvider`

**Solution**: Make sure component is inside `<PageBuilderProvider>`
```typescript
// ❌ Wrong
<MyComponent />
<PageBuilderProvider>...</PageBuilderProvider>

// ✅ Correct
<PageBuilderProvider>
  <MyComponent />
</PageBuilderProvider>
```

---

### Problem: State not updating
**Check**:
1. Are you using `usePageBuilderContext()`?
2. Are you calling the setter function?
3. Is the component re-rendering?

**Debug**:
```typescript
const { myState, setMyState } = usePageBuilderContext();

console.log('Current state:', myState); // Check value

useEffect(() => {
  console.log('State changed:', myState);
}, [myState]); // Track changes
```

---

### Problem: TypeScript errors
**Common issues**:
1. **Module not found**: TypeScript cache issue → Restart TS server
2. **Type mismatch**: Check GraphQL generated types
3. **Missing prop**: Add to interface in Provider

**Fix TypeScript cache**:
- VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
- CLI: `rm -rf node_modules/.cache && npm run dev`

---

## 📊 Performance Tips

### Use React DevTools
```bash
# Install
npm install -D @welldone-software/why-did-you-render

# Configure
import whyDidYouRender from '@welldone-software/why-did-you-render';
whyDidYouRender(React);
```

### Optimize re-renders
```typescript
// Wrap expensive components
export default React.memo(MyComponent);

// Memoize expensive calculations
const filteredTemplates = useMemo(
  () => allTemplates.filter(/* ... */),
  [allTemplates, searchQuery, category]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

---

## 📝 Code Style

### Naming Conventions
- **Components**: PascalCase (`PageBuilderHeader`)
- **Functions**: camelCase (`handlePageSave`)
- **Constants**: UPPER_SNAKE_CASE (`BLOCK_TYPES`)
- **State**: camelCase (`showPageSettings`)

### File Structure
```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface MyComponentProps {
  // ...
}

// 3. Constants
const MY_CONSTANT = 'value';

// 4. Component
export function MyComponent({ prop }: MyComponentProps) {
  // ... logic
  return <div>...</div>;
}

// 5. Default export (if needed)
export default MyComponent;
```

---

## 🧪 Testing

### Unit Test Example
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { PageBuilderProvider, usePageBuilderContext } from './PageBuilderProvider';

test('handleAddBlock adds a block', async () => {
  const wrapper = ({ children }) => (
    <PageBuilderProvider>{children}</PageBuilderProvider>
  );
  
  const { result } = renderHook(() => usePageBuilderContext(), { wrapper });
  
  await act(async () => {
    await result.current.handleAddBlock(BlockType.TEXT);
  });
  
  expect(result.current.blocks).toHaveLength(1);
  expect(result.current.blocks[0].type).toBe(BlockType.TEXT);
});
```

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { PageBuilderHeader } from './PageBuilderHeader';

test('renders page title', () => {
  render(<PageBuilderHeader />);
  expect(screen.getByText('Page Builder')).toBeInTheDocument();
});
```

---

## 🔗 Related Files

### GraphQL
- **Queries**: `hooks/usePageBuilder.ts`
- **Types**: `lib/graphql/generated.ts`
- **Schema**: `backend/src/graphql/schema.graphql`

### Block Renderers
- **Location**: `components/page-builder/blocks/`
- **Types**: TextBlock, ImageBlock, HeroBlock, etc.

### Templates
- **Data**: `data/blockTemplates.ts`
- **Custom Storage**: `utils/customTemplates.ts`

### UI Components
- **Location**: `components/ui/`
- **Library**: shadcn/ui

---

## 🎯 Quick Reference

### Import Paths
```typescript
// Provider & Context
import { PageBuilderProvider, usePageBuilderContext } 
  from '@/components/page-builder/PageBuilderProvider';

// Components
import { PageBuilderHeader } from '@/components/page-builder/PageBuilderHeader';
import { PageBuilderSidebar } from '@/components/page-builder/PageBuilderSidebar';
import { PageBuilderCanvas } from '@/components/page-builder/PageBuilderCanvas';
import PageSettingsForm from '@/components/page-builder/PageSettingsForm';

// Main
import PageBuilder from '@/components/page-builder/PageBuilder';

// GraphQL Hooks
import { usePage, usePageOperations, useBlockOperations } 
  from '@/hooks/usePageBuilder';

// Types
import { BlockType, Page, PageBlock } from '@/types/page-builder';
```

### Key Functions
```typescript
// Page
handlePageSave() → Promise<void>
handlePageDelete() → Promise<void>

// Blocks
handleAddBlock(type: BlockType) → Promise<void>
handleBlockUpdate(id: string, content: any, style: any) → Promise<void>
handleBlockDelete(id: string) → Promise<void>

// Nested Blocks
handleAddChild(parentId: string) → void
handleAddChildBlock(parentId: string, type: BlockType) → Promise<void>

// Templates
handleApplyTemplate(template: BlockTemplate) → Promise<void>
handleSaveAsTemplate(template: CustomTemplate) → Promise<void>
handleDeleteCustomTemplate(id: string) → Promise<void>
```

---

## 📚 Learn More

- **React Context**: https://react.dev/learn/passing-data-deeply-with-context
- **dnd-kit**: https://docs.dndkit.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **GraphQL**: https://graphql.org/learn/

---

**Happy coding! 🚀**
