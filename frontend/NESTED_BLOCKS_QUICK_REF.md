# Nested Blocks - Quick Reference

## 📋 What's New

Nested containers now support drag-and-drop, adding children, editing, and full persistence.

## 🎯 Quick Start

### Add Nested Block
```
1. Click "Add Child" button on any container
2. Select block type
3. Done! Block added inside container
```

### Drag Block to Container
```
1. Drag any block over a container
2. See blue ring + "Drop here" message
3. Release to add as nested child
```

### Edit Nested Block
```
1. Click nested block to select
2. Edit via Right Panel (Properties)
3. Changes auto-save
```

### Edit Container Settings
```
1. Hover container → see action buttons
2. Click Settings ⚙️ icon
3. Change layout, gap, padding, etc.
4. Click Done
```

## 📂 Files to Know

| File | Purpose |
|------|---------|
| `lib/nestedBlockUtils.ts` | 13 utility functions for nested operations |
| `hooks/useNestedBlockRenderer.ts` | React hooks for nested management |
| `blocks/LayoutBlockWrapper.tsx` | Reusable wrapper for layout blocks |
| `blocks/ContainerBlock.tsx` | Enhanced Container with droppable |
| `blocks/FlexBlock.tsx` | Refactored Flex with droppable |
| `NESTED_BLOCKS_GUIDE.md` | Full documentation |
| `NESTED_BLOCKS_SUMMARY.md` | Implementation summary |

## 🔧 Key APIs

### Utils
```typescript
import { 
  isContainerBlockType,
  getSortedChildren,
  addChildBlock,
  removeChildBlock,
  updateChildBlock,
  reorderChildren,
  validateNestedStructure,
} from '@/lib/nestedBlockUtils';
```

### Hooks
```typescript
import {
  useNestedBlockRenderer,
  useNestedDropZone,
  useNestedDepthCheck,
} from '@/hooks/useNestedBlockRenderer';
```

### Components
```typescript
import { LayoutBlockWrapper } from '@/components/page-builder/blocks/LayoutBlockWrapper';

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
  settingsPanel={settingsUI}
/>
```

## 🎨 Supported Containers

✅ Container - Stack/Wrap/Scroll layouts
✅ FlexBlock - Flex Row/Column
✅ GridBlock - Can be refactored
✅ SectionBlock - Can be refactored

## ✨ Features

✅ Drag-and-drop nested blocks
✅ Add child via button
✅ Delete nested blocks
✅ Reorder nested blocks
✅ Edit nested properties (Right Panel)
✅ Edit container settings
✅ Visual feedback (colors, indicators)
✅ Nested block counter
✅ Depth limit (max 10)
✅ Data persistence
✅ Type-safe operations
✅ Performance optimized

## 🐛 Troubleshooting

### Nested blocks don't appear
- Check browser console for errors
- Verify parent is container type
- Check GraphQL response has children

### Drag-drop doesn't work
- Ensure dnd-kit is set up
- Check droppable ref is set
- Verify depth limit not exceeded

### Settings don't save
- Check handleBlockUpdate was called
- Verify API mutation succeeded
- Check block ID is correct

### Performance issues
- Limit nesting depth
- Use React.memo for components
- Check for unnecessary re-renders

## 📊 Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Max Depth | 10 | Configurable in hook |
| Max Blocks at Level | Unlimited | Performance depends on hardware |
| Max Total Blocks | Unlimited | Consider pagination for 1000+ |

## 🚀 Performance Tips

1. Use `useMemo` for sorted children
2. Use `useCallback` for handlers
3. Avoid re-renders with `React.memo`
4. Limit nesting to 3-4 levels for UI
5. Use virtualization for 100+ blocks

## 📚 Learn More

- Full Guide: `NESTED_BLOCKS_GUIDE.md`
- Testing: `lib/nestedBlocksTestingGuide.ts`
- Implementation: `NESTED_BLOCKS_SUMMARY.md`

## 🆘 Need Help?

1. Read `NESTED_BLOCKS_GUIDE.md` for detailed docs
2. Check `nestedBlocksTestingGuide.ts` for common issues
3. Use browser DevTools to inspect block structure
4. Check Network tab for API calls
5. Use `debugNestedBlocks` utilities

## 💡 Examples

### Check if block can have children
```typescript
import { isContainerBlockType } from '@/lib/nestedBlockUtils';

if (isContainerBlockType(block.type)) {
  // Show "Add Child" button
}
```

### Get sorted children
```typescript
import { getSortedChildren } from '@/lib/nestedBlockUtils';

const children = getSortedChildren(block);
// Use children (already sorted by order)
```

### Validate structure
```typescript
import { validateNestedStructure } from '@/lib/nestedBlockUtils';

const errors = validateNestedStructure(block);
if (errors.length > 0) {
  console.error('Structure invalid:', errors);
}
```

### Use nested renderer hook
```typescript
import { useNestedBlockRenderer } from '@/hooks/useNestedBlockRenderer';

const {
  sortedChildren,
  childrenCount,
  canAddChildren,
  handleUpdateChild,
  handleDeleteChild,
} = useNestedBlockRenderer({
  parentBlock: block,
  onUpdateChild,
  onDeleteChild,
});
```

---

**Last Updated**: 24 Oct 2025
**Status**: ✅ Ready for Production
