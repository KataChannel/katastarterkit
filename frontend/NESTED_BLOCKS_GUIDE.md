# Nested Blocks Implementation Guide

## Overview

Tính năng nested blocks cho phép tạo layout phức tạp bằng cách đặt blocks bên trong container/layout blocks. Hỗ trợ drag-and-drop, editing, deletion với visual feedback.

## Supported Container Types

Các block types sau có thể chứa nested children:

1. **Container** - Flexible stack layout
2. **Section** - Semantic section layout
3. **Grid** - CSS Grid layout
4. **Flex Row** - Horizontal flex layout
5. **Flex Column** - Vertical flex layout

## Architecture

### Core Components

```
blocks/
├── LayoutBlockWrapper.tsx          ← Reusable wrapper cho tất cả layout blocks
├── ContainerBlock.tsx              ← Enhanced with droppable support
├── FlexBlock.tsx                   ← Refactored to use wrapper
├── GridBlock.tsx                   ← Can be refactored similarly
├── SectionBlock.tsx                ← Can be refactored similarly
└── BlockRenderer.tsx               ← Handles nested rendering

hooks/
└── useNestedBlockRenderer.ts        ← Custom hooks cho nested management

lib/
└── nestedBlockUtils.ts             ← Utility functions
```

### Data Flow

```
PageBuilderCanvas
    ├─ blocks (top-level)
    │
    └─ SortableBlockWrapper
         └─ BlockRenderer
             ├─ Renders container block (e.g., FlexBlock)
             │  └─ LayoutBlockWrapper
             │     └─ Droppable zone
             │
             └─ Renders nested children via BlockRenderer recursively
                ├─ SortableBlockWrapper (child)
                │  └─ BlockRenderer (child)
                │     └─ Further nested children...
```

## Key Features

### 1. Droppable Zones

Setiap container block memiliki droppable zone yang menerima:
- Blocks yang di-drag dari palette
- Blocks yang di-drag dari canvas untuk re-ordering
- Nested blocks yang di-drag dari parent container

```tsx
// Setup droppable zone
const { droppableId, dropData } = useNestedDropZone({
  parentId: block.id,
  isContainerType: isContainerBlockType(block.type),
});

const { setNodeRef, isOver } = useDroppable({
  id: droppableId,
  data: dropData,
});
```

### 2. Visual Feedback

- **Hover State**: Ring border ketika hover di container
- **Drag Over**: Blue tint dan scale animation
- **Drop Indicator**: "Drop here" message saat dragging over
- **Nested Counter**: Menampilkan jumlah nested blocks

### 3. Nested Block Management

```tsx
// Get nested children (sorted)
const { sortedChildren, childrenCount, canAddChildren } = useNestedBlockRenderer({
  parentBlock: block,
  onUpdateChild,
  onDeleteChild,
});
```

### 4. Depth Limit

Mencegah nesting terlalu dalam (default max depth = 10):

```tsx
const { canDropDeeper, currentDepth, remainingDepth, depthError } = useNestedDepthCheck({
  currentBlock: block,
  maxDepth: 10,
});
```

## Usage Examples

### Adding Nested Block

1. Click "Add Child" button pada container
2. Select block type dari dialog
3. Block ditambahkan sebagai child
4. Re-render otomatis

### Drag-and-Drop

**Move block ke container:**
1. Drag block dari canvas
2. Hover over container (visual feedback)
3. Release untuk drop
4. Block menjadi nested child

**Reorder nested blocks:**
1. Drag nested block dalam parent
2. Drop ke posisi baru
3. Order diperbarui otomatis

### Edit Container Settings

1. Hover container untuk show action buttons
2. Click Settings icon
3. Edit properties:
   - Layout (stack/wrap/scroll untuk Container)
   - Direction (row/column untuk Flex)
   - Gap, Padding, etc.
4. Click "Done" untuk save

### Delete Nested Block

1. Hover nested block untuk show delete button
2. Click delete icon
3. Block dihapus dari parent

## Utility Functions

### `nestedBlockUtils.ts`

```typescript
// Check if block type can have children
isContainerBlockType(type: BlockType): boolean

// Get nested children (sorted by order)
getSortedChildren(block: PageBlock): PageBlock[]

// Find nested block by ID
findNestedBlockById(block: PageBlock, targetId: string): { block, parent, depth }

// Add child block to parent
addChildBlock(parent: PageBlock, newChild: PageBlock): PageBlock

// Remove child block
removeChildBlock(parent: PageBlock, childId: string): PageBlock

// Update child block
updateChildBlock(parent: PageBlock, childId: string, updated: Partial<PageBlock>): PageBlock

// Reorder children
reorderChildren(parent: PageBlock, orderedIds: string[]): PageBlock

// Get max depth of tree
getMaxDepth(block: PageBlock): number

// Flatten nested blocks
flattenBlocks(block: PageBlock): PageBlock[]

// Validate nested structure
validateNestedStructure(block: PageBlock, maxDepth?: number): string[]

// Clone block with children
cloneBlockWithChildren(block: PageBlock): PageBlock
```

## Custom Hooks

### `useNestedBlockRenderer`

```typescript
interface UseNestedBlockRendererProps {
  parentBlock: PageBlock | null;
  onUpdateChild?: (childId: string, content: any, style?: any) => void;
  onDeleteChild?: (childId: string) => void;
  onReorderChildren?: (parentId: string, orderedIds: string[]) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
}

// Usage
const { 
  sortedChildren,
  childrenCount,
  canAddChildren,
  childrenIds,
  handleUpdateChild,
  handleDeleteChild,
  handleReorderChildren,
} = useNestedBlockRenderer(props);
```

### `useNestedDropZone`

```typescript
// Setup droppable zone
const { 
  canDrop,
  droppableId,
  dropData,
} = useNestedDropZone({
  parentId: block.id,
  isContainerType: true,
  isDraggedBlockId: 'dragged-id',
});
```

### `useNestedDepthCheck`

```typescript
// Check nesting depth
const {
  canDropDeeper,
  currentDepth,
  remainingDepth,
  depthError,
} = useNestedDepthCheck({
  currentBlock: block,
  maxDepth: 10,
});
```

## LayoutBlockWrapper Component

Reusable component untuk semua layout blocks dengan built-in support untuk:
- Droppable zones
- Settings panel management
- Visual feedback
- Nested block counter

```tsx
<LayoutBlockWrapper
  block={block}
  isEditable={isEditable}
  children={children}
  onDelete={onDelete}
  onAddChild={onAddChild}
  onUpdate={onUpdate}
  onUpdateChild={onUpdateChild}
  onDeleteChild={onDeleteChild}
  containerStyles={styles}
  settingsPanel={<YourSettingsUI />}
  title="Block Settings"
/>
```

## Implementation Checklist

- ✅ Utility functions (nestedBlockUtils.ts)
- ✅ Custom hooks (useNestedBlockRenderer.ts)
- ✅ LayoutBlockWrapper component
- ✅ ContainerBlock enhanced
- ✅ FlexBlock refactored
- ⏳ GridBlock (dapat direfactor sama)
- ⏳ SectionBlock (dapat direfactor sama)
- ⏳ BlockRenderer droppable zone untuk nested drops
- ⏳ Test nested drag-drop functionality
- ⏳ Test save/load dengan nested blocks

## Next Steps

1. **GridBlock & SectionBlock**: Refactor menggunakan LayoutBlockWrapper
2. **Nested Drag-Drop**: Perbaiki BlockRenderer untuk handle nested drops
3. **API Integration**: Ensure nested blocks save/load correctly dari backend
4. **Depth Limit**: Implement max depth validation di UI
5. **Performance**: Optimize rendering untuk deeply nested structures
6. **Testing**: Unit & integration tests untuk nested operations

## Troubleshooting

### Nested blocks tidak muncul
- Check apakah parent block memiliki `children` array
- Verify block type adalah container type
- Check browser console untuk errors

### Drag-drop tidak bekerja
- Verify droppable zone ref diset dengan benar
- Check data.type matches accepted types
- Verify parent block dapat menerima drops

### Settings tidak tersimpan
- Check `onUpdate` callback dipanggil
- Verify block id ada dalam parent children
- Check GraphQL mutation berhasil

## Performance Tips

1. **Memoization**: Gunakan `useMemo` untuk sorted children
2. **Callbacks**: Gunakan `useCallback` untuk update handlers
3. **Depth Limit**: Batasi nesting depth untuk prevent deep recursion
4. **Lazy Load**: Consider lazy loading deeply nested blocks
5. **Virtualization**: Untuk banyak nested blocks, gunakan virtualization

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (dengan dnd-kit)
- Mobile: ⚠️ Limited (touch support via dnd-kit)
