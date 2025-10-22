# Quick Reference - Nested Blocks Feature

## TL;DR - What Changed

The Page Builder now fully supports nested blocks. You can:
1. Add child blocks inside container blocks
2. Edit, delete, and reorder child blocks
3. Nest containers multiple levels deep
4. Use all container types (Container, Section, Grid, Flex Row, Flex Column)

## How to Use

### Adding a Child Block (3 Steps)

1. **Hover** over a container block (Container, Section, Grid, Flex, etc.)
2. **Click** the "Add Block" button that appears
3. **Select** the block type from the dialog

✅ Child block appears inside the container!

### Editing a Child Block

1. **Hover** over the child block
2. **Click** the Settings (gear) icon
3. **Modify** properties and click Save

### Deleting a Child Block

1. **Hover** over the child block  
2. **Click** the Delete (trash) button
3. ✅ Block removed!

### Reordering Child Blocks

1. **Drag** one child block
2. **Drop** at new position
3. ✅ Children reorder!

## Container Types That Support Children

| Type | Layout | Use Case |
|------|--------|----------|
| **Container** | Flex (customizable) | General layout/grouping |
| **Section** | Flex column | Page sections |
| **Grid** | CSS Grid | Multi-column layouts |
| **Flex Row** | Horizontal flex | Horizontal lists |
| **Flex Column** | Vertical flex | Vertical lists |

## Keyboard Shortcuts

- ↑↓ : Reorder (with drag-and-drop)
- Delete : Delete child block
- Esc : Close dialog/cancel

## Limits & Constraints

| Constraint | Limit | What Happens |
|-----------|-------|--------------|
| **Max Depth** | 5 levels | Can't nest deeper |
| **Max Children** | 50 per container | Can't add more children |
| **Max Blocks** | 500 per page | Can't create more blocks |

## Common Issues & Solutions

### "Add Block" button doesn't appear
- ✅ Are you hovering over a container block?
- ✅ Non-containers (Text, Button, etc.) can't have children
- ✅ Try Container, Section, or Grid blocks

### Child block doesn't appear after adding
- ✅ Check browser console for errors
- ✅ Try refreshing the page
- ✅ Check if block was actually created (no errors?)

### Can't reorder child blocks
- ✅ Make sure you're dragging, not clicking
- ✅ Check if drag is enabled (should be by default)
- ✅ Try dragging to a different position

### Getting "Maximum depth" error
- ✅ You've nested too deep (max 5 levels)
- ✅ Solution: Move container to shallower level
- ✅ Or: Delete some nested containers

### Performance is slow
- ✅ Too many children in one container (50+ can slow down)
- ✅ Solution: Split children into multiple containers
- ✅ Very deep nesting (4+ levels) may also slow down

## File Changes Summary

```
Frontend Components:
├── BlockRenderer.tsx (renderChildren method added)
├── ContainerBlock.tsx (children prop, Add Block button)
├── SectionBlock.tsx (children prop, Add Block button)
├── GridBlock.tsx (children prop, Add Block button)
└── FlexBlock.tsx (children prop, Add Block button)

State Management:
├── UIStateContext.tsx (showAddChildDialog, addChildParentId)
└── PageActionsContext.tsx (handleAddChild, handleAddChildBlock)

UI:
└── PageBuilder.tsx ("Add Child Block" dialog)
```

## Architecture Overview

```
User clicks "Add Block"
      ↓
Select block type
      ↓
Backend creates child block with parentId
      ↓
GraphQL refetch includes children
      ↓
BlockRenderer renderChildren() recurses
      ↓
Container receives children prop
      ↓
Children render inside container layout
```

## Testing Checklist

- [ ] Can add child to Container
- [ ] Can add child to Section
- [ ] Can add child to Grid
- [ ] Can add multiple children
- [ ] Can edit child properties
- [ ] Can delete child
- [ ] Can reorder children
- [ ] Can nest 3 levels deep
- [ ] Changes persist on refresh
- [ ] Error messages show for violations
- [ ] No console errors

## Performance Tips

1. **Don't nest too deep** - Keep to 3 levels max if possible
2. **Don't add too many children** - 20-30 per container is comfortable
3. **Use Grid for multi-column** - More efficient than nested Containers
4. **Monitor console** - Check for performance warnings

## API Reference

### BlockRenderer Props
```typescript
interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: (parentId: string) => void;           // NEW
  onUpdateChild?: (blockId: string, content: any) => void;  // NEW
  onDeleteChild?: (blockId: string) => void;         // NEW
  onSelect?: (blockId: string | null) => void;
  depth?: number;                                    // NEW
}
```

### Container Block Props
```typescript
interface ContainerBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: () => void;                          // NEW
  children?: React.ReactNode;                        // NEW
}
```

## Resources

- **Implementation Details**: See `NESTED-BLOCKS-IMPLEMENTATION.md`
- **Testing Guide**: See `NESTED-BLOCKS-TESTING-GUIDE.md`
- **Complete Report**: See `NESTED-BLOCKS-COMPLETE-REPORT.md`

## Troubleshooting

### Feature not showing up?
1. Clear browser cache (Ctrl+Shift+Del)
2. Do a hard refresh (Ctrl+F5)
3. Restart dev server (npm run dev)

### Dialog doesn't appear?
1. Check `showAddChildDialog` state in React DevTools
2. Verify `handleAddChild` is being called
3. Check console for errors

### Children not rendering?
1. Check GraphQL query includes `children` field
2. Verify BlockRenderer has data in `block.children`
3. Check error boundary for component errors

### Performance issues?
1. Check how many children (max 50 recommended)
2. Check nesting depth (max 5 allowed)
3. Check browser DevTools performance tab

## Support

If you encounter issues:
1. Check console for error messages
2. Review test guide for expected behavior
3. Check implementation guide for technical details
4. Create issue with steps to reproduce

