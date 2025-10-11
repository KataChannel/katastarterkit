# Nested Block Hook Guide

## useNestedBlockOperations Hook

Hook này cung cấp các utilities để làm việc với nested blocks trong Page Builder.

## Installation

```typescript
import { useNestedBlockOperations } from '@/hooks/usePageBuilder';

function PageBuilderComponent() {
  const pageId = 'your-page-id';
  const {
    // Operations
    addChildBlock,
    moveBlockToContainer,
    duplicateBlock,
    
    // Queries
    getAllBlocks,
    getBlockTree,
    getBlockChildren,
    getBlockParent,
    getBlockAncestors,
    getBlockDescendants,
    isContainerBlock,
    
    // Data
    page,
    refetch
  } = useNestedBlockOperations(pageId);
}
```

---

## Operations

### 1. addChildBlock

Thêm một block con vào container.

**Signature:**
```typescript
addChildBlock(
  parentId: string,
  blockType: string,
  content?: any,
  style?: any
): Promise<PageBlock>
```

**Example:**
```typescript
// Thêm Grid block vào Section
const section = page.blocks.find(b => b.type === 'SECTION');
const grid = await addChildBlock(
  section.id,
  'GRID',
  { columns: 3, gap: 20 }
);

// Thêm Card vào Grid
const card = await addChildBlock(
  grid.id,
  'CARD',
  { title: 'My Card', description: 'Card content' }
);
```

**Features:**
- ✅ Tự động tính `depth` (based on parent depth)
- ✅ Tự động tính `order` (cuối cùng trong siblings)
- ✅ Validates parent existence
- ✅ Refetch page data sau khi thêm

---

### 2. moveBlockToContainer

Di chuyển block sang container khác hoặc thay đổi vị trí.

**Signature:**
```typescript
moveBlockToContainer(
  blockId: string,
  newParentId: string | null,
  newOrder?: number
): Promise<void>
```

**Example:**
```typescript
// Di chuyển block từ container A sang container B
await moveBlockToContainer(
  cardBlock.id,
  newContainerId,
  0 // Đưa lên đầu
);

// Di chuyển block lên root level (không có parent)
await moveBlockToContainer(
  block.id,
  null // null = root level
);

// Di chuyển và tự động order (cuối cùng)
await moveBlockToContainer(
  block.id,
  newParentId
  // không truyền order = auto calculate
);
```

**Features:**
- ✅ Tự động recalculate `depth`
- ✅ Auto order nếu không specify
- ✅ Support move to root (parentId = null)
- ✅ Validates both block and parent existence

---

### 3. duplicateBlock

Duplicate một block kèm tất cả children.

**Signature:**
```typescript
duplicateBlock(blockId: string): Promise<PageBlock>
```

**Example:**
```typescript
// Duplicate một section với all children
const section = page.blocks.find(b => b.type === 'SECTION');
const duplicatedSection = await duplicateBlock(section.id);

// Result: New section với same structure, placed after original
```

**Features:**
- ✅ Deep clone block content và style
- ✅ Recursively duplicate all children
- ✅ Maintains hierarchy structure
- ✅ Places duplicate after original
- ✅ Preserves config for dynamic blocks

---

## Query Helpers

### 4. getAllBlocks

Lấy tất cả blocks trong page (flatten structure).

**Signature:**
```typescript
getAllBlocks(): PageBlock[]
```

**Example:**
```typescript
const allBlocks = getAllBlocks();
console.log(`Total blocks: ${allBlocks.length}`);

// Filter by type
const textBlocks = allBlocks.filter(b => b.type === 'TEXT');

// Find specific block
const block = allBlocks.find(b => b.id === 'block-id');
```

**Use Cases:**
- Search across all blocks
- Count blocks by type
- Validate block references
- Export/import operations

---

### 5. getBlockTree

Lấy blocks dưới dạng nested tree structure.

**Signature:**
```typescript
getBlockTree(): PageBlock[]
```

**Example:**
```typescript
const tree = getBlockTree();

// Render recursive tree
function renderTree(blocks) {
  return blocks.map(block => (
    <div key={block.id}>
      <Block data={block} />
      {block.children && renderTree(block.children)}
    </div>
  ));
}
```

**Returns:**
```typescript
[
  {
    id: '1',
    type: 'SECTION',
    children: [
      {
        id: '2',
        type: 'GRID',
        children: [
          { id: '3', type: 'CARD', children: [] },
          { id: '4', type: 'CARD', children: [] }
        ]
      }
    ]
  }
]
```

---

### 6. getBlockChildren

Lấy children trực tiếp của một block.

**Signature:**
```typescript
getBlockChildren(blockId: string): PageBlock[]
```

**Example:**
```typescript
const children = getBlockChildren(gridBlock.id);
console.log(`Grid has ${children.length} items`);

// Check if container has children
if (getBlockChildren(containerId).length === 0) {
  console.log('Container is empty');
}
```

**Features:**
- ✅ Chỉ lấy direct children (không recursive)
- ✅ Sorted by `order` field
- ✅ Returns empty array nếu không có children

---

### 7. getBlockParent

Lấy parent block của một block.

**Signature:**
```typescript
getBlockParent(blockId: string): PageBlock | null
```

**Example:**
```typescript
const parent = getBlockParent(cardBlock.id);

if (parent) {
  console.log(`Card is inside ${parent.type}`);
  
  // Update parent
  if (parent.type === 'GRID') {
    await updateBlock(parent.id, {
      content: { ...parent.content, gap: 30 }
    });
  }
}
```

**Returns:**
- Parent block object nếu có
- `null` nếu block ở root level

---

### 8. getBlockAncestors

Lấy tất cả ancestors của block (parent, grandparent, ...).

**Signature:**
```typescript
getBlockAncestors(blockId: string): PageBlock[]
```

**Example:**
```typescript
const ancestors = getBlockAncestors(cardBlock.id);
// [Grid, Section, Page]

// Build breadcrumb
const breadcrumb = ancestors
  .reverse()
  .map(b => b.type)
  .join(' > ');
// "Section > Grid"

// Check if block is inside specific container
const isInSection = ancestors.some(b => b.type === 'SECTION');
```

**Features:**
- ✅ Array từ direct parent đến root
- ✅ Empty array nếu block ở root
- ✅ Useful for breadcrumbs và validation

---

### 9. getBlockDescendants

Lấy tất cả descendants của block (children, grandchildren, ...).

**Signature:**
```typescript
getBlockDescendants(blockId: string): PageBlock[]
```

**Example:**
```typescript
const descendants = getBlockDescendants(sectionBlock.id);
console.log(`Section contains ${descendants.length} nested blocks`);

// Bulk operations on all nested blocks
for (const block of descendants) {
  if (block.type === 'TEXT') {
    await updateBlock(block.id, {
      style: { ...block.style, fontSize: 16 }
    });
  }
}

// Calculate total depth
const maxDepth = Math.max(...descendants.map(b => b.depth || 0));
```

**Use Cases:**
- Bulk operations on nested blocks
- Calculate metrics (total blocks, max depth)
- Cascade deletions (handled automatically)
- Search within container

---

### 10. isContainerBlock

Kiểm tra xem block type có thể chứa children không.

**Signature:**
```typescript
isContainerBlock(blockType: string): boolean
```

**Example:**
```typescript
// Validate before add child
if (isContainerBlock(block.type)) {
  await addChildBlock(block.id, 'CARD', { title: 'New Card' });
} else {
  console.log('Cannot add children to this block type');
}

// Filter containers
const containers = getAllBlocks().filter(b => 
  isContainerBlock(b.type)
);

// Drag-drop validation
const canDrop = isContainerBlock(targetBlock.type);
```

**Container Types:**
- ✅ `CONTAINER`
- ✅ `SECTION`
- ✅ `GRID`
- ✅ `FLEX_ROW`
- ✅ `FLEX_COLUMN`

---

## Utility Functions

### flattenBlocks

Flatten nested blocks thành single array.

**Signature:**
```typescript
flattenBlocks(blocks: PageBlock[]): PageBlock[]
```

**Example:**
```typescript
import { flattenBlocks } from '@/hooks/usePageBuilder';

const nested = page.blocks; // Tree structure
const flat = flattenBlocks(nested);

// Now you can easily search/filter
const textBlocks = flat.filter(b => b.type === 'TEXT');
```

---

### unflattenBlocks

Convert flat array thành nested tree.

**Signature:**
```typescript
unflattenBlocks(blocks: PageBlock[]): PageBlock[]
```

**Example:**
```typescript
import { unflattenBlocks } from '@/hooks/usePageBuilder';

// Get all blocks as flat array
const flatBlocks = getAllBlocks();

// Convert to tree
const tree = unflattenBlocks(flatBlocks);

// Now tree has nested children
tree.forEach(block => {
  console.log(block.type);
  if (block.children) {
    block.children.forEach(child => {
      console.log(`  - ${child.type}`);
    });
  }
});
```

---

## Complete Examples

### Example 1: Create Landing Page Structure

```typescript
const { addChildBlock, getBlockTree } = useNestedBlockOperations(pageId);

// Create Hero Section
const heroSection = await addChildBlock(
  null, // Root level
  'SECTION',
  {
    backgroundImage: '/hero.jpg',
    padding: { top: 100, bottom: 100 }
  }
);

// Add Container inside Section
const heroContainer = await addChildBlock(
  heroSection.id,
  'CONTAINER',
  { alignment: 'center' }
);

// Add Hero Block
await addChildBlock(
  heroContainer.id,
  'HERO',
  {
    title: 'Welcome',
    subtitle: 'Build amazing pages'
  }
);

// Add CTA Button
await addChildBlock(
  heroContainer.id,
  'BUTTON',
  {
    text: 'Get Started',
    href: '/signup'
  }
);

// Features Section
const featuresSection = await addChildBlock(
  null,
  'SECTION',
  { backgroundColor: '#f5f5f5' }
);

const featuresGrid = await addChildBlock(
  featuresSection.id,
  'GRID',
  { columns: 3, gap: 24 }
);

// Add 3 feature cards
for (let i = 1; i <= 3; i++) {
  await addChildBlock(
    featuresGrid.id,
    'CARD',
    {
      title: `Feature ${i}`,
      description: `Description ${i}`
    }
  );
}

// Get final tree structure
const pageStructure = getBlockTree();
console.log(pageStructure);
```

---

### Example 2: Drag-and-Drop Handler

```typescript
const {
  moveBlockToContainer,
  isContainerBlock,
  getBlockChildren
} = useNestedBlockOperations(pageId);

const handleDrop = async (draggedBlockId, targetBlockId, position) => {
  const targetBlock = getAllBlocks().find(b => b.id === targetBlockId);
  
  if (!targetBlock) return;

  // Check if target can accept children
  if (position === 'inside') {
    if (!isContainerBlock(targetBlock.type)) {
      toast.error('This block cannot contain children');
      return;
    }
    
    // Move inside target
    await moveBlockToContainer(
      draggedBlockId,
      targetBlockId,
      0 // First child
    );
  } else {
    // Move before/after target (same parent)
    const siblings = getBlockChildren(targetBlock.parentId || null);
    const targetIndex = siblings.findIndex(b => b.id === targetBlockId);
    const newOrder = position === 'before' ? targetIndex : targetIndex + 1;
    
    await moveBlockToContainer(
      draggedBlockId,
      targetBlock.parentId,
      newOrder
    );
  }
  
  toast.success('Block moved successfully');
};
```

---

### Example 3: Block Inspector

```typescript
const {
  getBlockParent,
  getBlockChildren,
  getBlockAncestors,
  getBlockDescendants
} = useNestedBlockOperations(pageId);

function BlockInspector({ blockId }) {
  const parent = getBlockParent(blockId);
  const children = getBlockChildren(blockId);
  const ancestors = getBlockAncestors(blockId);
  const descendants = getBlockDescendants(blockId);
  
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Block Info</h3>
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-2">
        {ancestors.length > 0 && (
          <span>
            {ancestors.reverse().map(a => a.type).join(' > ')} > 
          </span>
        )}
        <span className="font-semibold"> Current Block</span>
      </div>
      
      {/* Parent */}
      {parent && (
        <div className="mb-2">
          <strong>Parent:</strong> {parent.type} (#{parent.id})
        </div>
      )}
      
      {/* Children */}
      <div className="mb-2">
        <strong>Children:</strong> {children.length} blocks
        {children.length > 0 && (
          <ul className="ml-4 list-disc">
            {children.map(child => (
              <li key={child.id}>{child.type}</li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Total Descendants */}
      <div>
        <strong>Total Nested:</strong> {descendants.length} blocks
      </div>
    </div>
  );
}
```

---

### Example 4: Bulk Operations

```typescript
const { getBlockDescendants, updateBlock } = useNestedBlockOperations(pageId);

// Update font size for all text blocks in a section
async function updateSectionTextSize(sectionId, fontSize) {
  const descendants = getBlockDescendants(sectionId);
  const textBlocks = descendants.filter(b => b.type === 'TEXT');
  
  for (const block of textBlocks) {
    await updateBlock(block.id, {
      style: {
        ...block.style,
        fontSize
      }
    });
  }
  
  toast.success(`Updated ${textBlocks.length} text blocks`);
}

// Hide all blocks in a container
async function hideContainer(containerId) {
  const descendants = getBlockDescendants(containerId);
  
  for (const block of descendants) {
    await updateBlock(block.id, {
      isVisible: false
    });
  }
}
```

---

## Best Practices

### 1. Performance

```typescript
// ❌ Bad - Multiple refetches
for (const item of items) {
  await addChildBlock(containerId, 'CARD', item);
  // Refetch happens after each add
}

// ✅ Good - Batch operations
const promises = items.map(item =>
  addChildBlock(containerId, 'CARD', item)
);
await Promise.all(promises);
await refetch(); // Single refetch at end
```

### 2. Validation

```typescript
// ✅ Always validate before operations
const handleAddChild = async (parentId, type) => {
  const parent = getAllBlocks().find(b => b.id === parentId);
  
  if (!parent) {
    toast.error('Parent block not found');
    return;
  }
  
  if (!isContainerBlock(parent.type)) {
    toast.error('Cannot add children to this block');
    return;
  }
  
  await addChildBlock(parentId, type);
};
```

### 3. Depth Limiting

```typescript
// ✅ Prevent too deep nesting
const MAX_DEPTH = 4;

const handleAddChild = async (parentId, type) => {
  const parent = getAllBlocks().find(b => b.id === parentId);
  
  if ((parent?.depth || 0) >= MAX_DEPTH - 1) {
    toast.error('Maximum nesting depth reached');
    return;
  }
  
  await addChildBlock(parentId, type);
};
```

### 4. Error Handling

```typescript
// ✅ Proper error handling
const handleMoveBlock = async (blockId, newParentId) => {
  try {
    await moveBlockToContainer(blockId, newParentId);
    toast.success('Block moved');
  } catch (error) {
    console.error('Move failed:', error);
    toast.error(error.message || 'Failed to move block');
  }
};
```

---

## TypeScript Types

```typescript
interface PageBlock {
  id: string;
  type: BlockType;
  content: any;
  style?: any;
  order: number;
  isVisible: boolean;
  pageId: string;
  
  // Nested support
  children?: PageBlock[];
  parentId?: string | null;
  depth?: number;
  config?: DynamicBlockConfig;
  
  createdAt: string;
  updatedAt: string;
}

type BlockType = 
  | 'TEXT'
  | 'IMAGE'
  | 'HERO'
  | 'BUTTON'
  | 'CONTAINER'
  | 'SECTION'
  | 'GRID'
  | 'FLEX_ROW'
  | 'FLEX_COLUMN'
  | 'DYNAMIC'
  // ... more types
```

---

## Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useNestedBlockOperations } from '@/hooks/usePageBuilder';

describe('useNestedBlockOperations', () => {
  it('should add child block correctly', async () => {
    const { result } = renderHook(() => 
      useNestedBlockOperations('page-id')
    );
    
    await act(async () => {
      const child = await result.current.addChildBlock(
        'parent-id',
        'CARD',
        { title: 'Test' }
      );
      
      expect(child).toBeDefined();
      expect(child.parentId).toBe('parent-id');
      expect(child.depth).toBe(1);
    });
  });
  
  it('should get block tree', () => {
    const { result } = renderHook(() => 
      useNestedBlockOperations('page-id')
    );
    
    const tree = result.current.getBlockTree();
    expect(Array.isArray(tree)).toBe(true);
  });
});
```

---

## Summary

Hook `useNestedBlockOperations` cung cấp:

✅ **10 Operations & Queries**:
- 3 Operations: addChildBlock, moveBlockToContainer, duplicateBlock
- 7 Query Helpers: getAllBlocks, getBlockTree, getBlockChildren, getBlockParent, getBlockAncestors, getBlockDescendants, isContainerBlock

✅ **2 Utility Functions**:
- flattenBlocks, unflattenBlocks

✅ **Features**:
- Auto depth calculation
- Auto order management
- Parent/child validation
- Deep cloning for duplication
- Recursive operations
- Type safety

✅ **Use Cases**:
- Drag-and-drop
- Nested CRUD operations
- Block inspector
- Bulk operations
- Tree navigation

**Happy building with nested blocks! 🚀**
