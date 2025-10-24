# Add Child Feature - Debugging Guide

## Problem
"Add Child" button not working in nested blocks feature.

## Debugging Steps Already Completed

### 1. Code Tracing (Props Flow)
✅ Verified props are being passed correctly through the entire component tree:
- PageBuilderCanvas.tsx → passes `onAddChild={handleAddChild}`
- SortableBlockWrapper.tsx → receives and passes `onAddChild` to BlockRenderer
- BlockRenderer.tsx → wraps onAddChild and passes to container blocks
- ContainerBlock.tsx → receives wrapped onAddChild

### 2. Console Logging Added
Added debug logging at multiple levels:

**BlockRenderer.tsx (lines 86-98):**
```tsx
onAddChild: isContainerBlock ? () => {
  console.log(`[BlockRenderer ${block.id}] onAddChild wrapper called...`);
  onAddChild?.(block.id);
} : undefined,
```

**ContainerBlock.tsx (lines 62-72):**
```tsx
React.useEffect(() => {
  console.log(`[ContainerBlock ${block.id}] Debug:`, {
    canAddChildren,
    onAddChildDefined: !!onAddChild,
    childrenCount,
    blockType: block.type,
  });
}, [canAddChildren, onAddChild, childrenCount, block.id, block.type]);
```

**PageActionsContext.tsx (lines 389-393):**
```tsx
const handleAddChild = useCallback((parentId: string) => {
  console.log(`[PageActionsContext] handleAddChild called with parentId:`, parentId);
  uiState.setAddChildParentId(parentId);
  uiState.setShowAddChildDialog(true);
}, [uiState]);
```

### 3. Visual Debug Indicators Added
**ContainerBlock.tsx now shows:**
- Status badges showing: `canAdd=true/false | onAddChild=true/false`
- Warning badge if `onAddChild` is undefined
- Warning badge if `canAddChildren` is false  
- **Add Child button ALWAYS shows in development** (red/destructive if conditions not met)

## How to Test

### Step 1: Open Page Builder
1. Navigate to http://localhost:13000/admin/pagebuilder
2. Create or open a page

### Step 2: Look for Container Block
3. Hover over any CONTAINER, SECTION, GRID, FLEX_ROW, or FLEX_COLUMN block
4. You should see several buttons appear on top-right:
   - Settings icon button
   - Trash icon button (delete)
   - **NEW: "Add Child" or "Add - canAdd=false" button (in red in dev mode)**

### Step 3: Check Debug Information
5. Below the buttons, look for debug text:
   - Shows `canAdd=true/false` and `onAddChild=true/false`
   - If either is false, see the warning badges

### Step 4: Open Browser Console
6. Press F12 to open developer tools → Console tab
7. Filter logs to see:
   - `[ContainerBlock xxx]` logs
   - `[BlockRenderer xxx]` logs
   - `[PageActionsContext]` logs

### Step 5: Click Add Child Button
8. Click the "Add Child" button
9. Expected behavior:
   - Console should log: `[ContainerBlock xxx] Add Child clicked`
   - Dialog should appear with block type selection
   - After selecting a block type, child should be added

## Possible Issues & Solutions

### Issue 1: Button shows with RED "canAdd=false"
**Cause:** `canAddChildren` hook is returning false
**Fix:** Check in nestedBlockUtils.ts - `isContainerBlockType()` might not include the block type you're testing with

**Check:**
```tsx
export const isContainerBlockType = (type: BlockType): boolean => {
  const containerTypes = [
    BlockType.CONTAINER,
    BlockType.SECTION,
    BlockType.GRID,
    BlockType.FLEX_ROW,
    BlockType.FLEX_COLUMN,
  ];
  return containerTypes.includes(type);
};
```

### Issue 2: Button shows with RED "onAddChild=false"
**Cause:** `onAddChild` prop is undefined
**Fix:** Check the prop-passing chain above. One of these is broken:
1. PageBuilderCanvas not passing `onAddChild={handleAddChild}`
2. SortableBlockWrapper not receiving/passing it
3. BlockRenderer not wrapping it properly
4. BlockLoader not spreading it onto the component

**Debug:**
- Add console.log in SortableBlockWrapper line 97: `console.log('SortableBlockWrapper onAddChild:', onAddChild);`
- Add console.log in BlockRenderer line 50 before containerProps: `console.log('BlockRenderer onAddChild:', onAddChild);`

### Issue 3: Button shows correctly but dialog doesn't appear
**Cause:** PageActionsContext `handleAddChild` not setting state properly, or dialog not visible
**Fix:** Check browser console for `[PageActionsContext] handleAddChild called` log
- If logged: UI state is being set, check if Dialog component is working
- If not logged: handler not being called, check prop chain again

### Issue 4: All buttons look OK but nothing happens when clicked
**Cause:** Dialog might be rendering but hidden behind other elements, or handleAddChildBlock not working
**Fix:** Check if dialog is in DOM using DevTools Element Inspector
- Look for `<Dialog open={showAddChildDialog}>` in PageBuilder.tsx
- Check if CSS is hiding it (z-index issue)

## Code Locations for Further Investigation

| File | Purpose | Relevant Lines |
|------|---------|-----------------|
| BlockRenderer.tsx | Wraps onAddChild, creates container props | 50-100 |
| ContainerBlock.tsx | Receives onAddChild, renders button | 55-145 |
| PageActionsContext.tsx | Main handler for add child action | 389-430 |
| UIStateContext.tsx | Manages dialog open/close state | 31-55 |
| PageBuilder.tsx | Renders the dialog itself | 85-115 |
| nestedBlockUtils.ts | Determines what block types can have children | 16-30 |
| useNestedBlockRenderer.ts | Hook that calculates canAddChildren | 50-60 |

## Quick Checklist

- [ ] Button shows up on hover over container block
- [ ] Debug text shows `canAdd=true`
- [ ] Debug text shows `onAddChild=true`  
- [ ] Console logs `[ContainerBlock xxx] Add Child clicked`
- [ ] Console logs `[PageActionsContext] handleAddChild called`
- [ ] Dialog appears with block type selection
- [ ] Can select a block type
- [ ] Child block gets added to page

## Next Steps

1. **Run the app and hover over a container block**
2. **Report what debug info you see**
3. **Check browser console for any errors**
4. **If still not working, follow the prop-chain debugging above**

---

**Last Updated:** 2025-10-24  
**Debug Features:** Console logs + Visual indicators in development mode
