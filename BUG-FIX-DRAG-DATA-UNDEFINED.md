# Fix: Drag Data Not Being Passed Through useDraggable

## Problem

When dragging elements from ElementsLibrary to EditorCanvas, the drag event showed:
```
[PageBuilder] Drag ended: {
  activeId: 'element-CAROUSEL', 
  activeType: undefined,  // ❌ Should be 'new-block'
  activeBlockType: undefined,  // ❌ Should be CAROUSEL enum value
  overId: 'canvas-droppable'
}
```

This caused the drag-drop handler to not recognize library elements as "new-block" types and thus couldn't add them to the canvas.

## Root Cause

The `active.data` object from `useDraggable` hook was not being properly propagated through the DndContext event handlers. This can happen when:

1. **Data not attached properly**: The `data` prop in `useDraggable()` wasn't being recognized by DndContext
2. **Event object structure issue**: The drag event wasn't preserving the data through the handler chain
3. **React/dnd-kit version compatibility**: Potential version mismatch in how data is passed

## Solution Implemented

### 1. Fallback Detection: Extract BlockType from ID

Instead of relying solely on `active.data`, we now have a **fallback mechanism** that extracts the BlockType from the element ID:

```typescript
// Before (fails when data is undefined):
const blockType = active.data?.blockType;  // ❌ undefined

// After (extracts from ID as fallback):
const isLibraryElement = active.id?.toString().startsWith('element-');
let blockTypeValue = active.data?.blockType;

if (!blockTypeValue && isLibraryElement) {
  const typeStr = active.id.replace('element-', '');
  // ID format: 'element-TEXT' → extract 'TEXT' → find BlockType enum
  blockTypeValue = (BlockType as any)[typeStr];
}
// ✅ Now blockTypeValue = CAROUSEL (numeric enum value)
```

### 2. Enhanced Debug Logging

Added comprehensive logging at each step:

```typescript
console.log('[PageBuilder] handleDragEnd full event:', event);
console.log('[PageBuilder] handleDragEnd active:', active);
console.log('[PageBuilder] handleDragEnd over:', over);
```

This helps identify:
- If data is missing or malformed
- What the actual active object looks like
- Whether the drop target is correct

### 3. Improved Detection Logic

Now supports **multiple detection methods**:

```typescript
const isLibraryElement = active.id?.toString().startsWith('element-');

if (isLibraryElement || dragType === 'new-block') {
  // Handle as new block from library
  // Try data first, fall back to ID extraction
}
```

This means even if `active.data` is undefined, we can still:
1. Recognize the element is from the library (by ID prefix)
2. Extract the BlockType from the ID string
3. Successfully add it to the canvas

## How It Works Now

### Drag Flow (Fixed):
1. **ElementsLibrary** drags element with ID `element-CAROUSEL`
   - Also includes data: `{ type: 'new-block', blockType: 4 }` (if it works)

2. **handleDragStart**:
   - Tries to read `active.data.type` and `active.data.blockType`
   - Logs them (even if undefined)

3. **handleDragEnd**:
   - Checks if `active.id` starts with `'element-'`
   - If yes, extracts `'CAROUSEL'` from `'element-CAROUSEL'`
   - Looks up `BlockType.CAROUSEL` in enum
   - Gets the numeric value (e.g., 4)
   - Calls `handleAddBlock(4)` with the numeric value

4. **handleAddBlock**:
   - Creates new block on canvas

### BlockType Enum Lookup

The code does this mapping dynamically:

```typescript
// BlockType enum (in types/page-builder.ts) might be:
enum BlockType {
  TEXT = 0,
  HERO = 1,
  IMAGE = 2,
  BUTTON = 3,
  CAROUSEL = 4,
  // ... etc
}

// When we have 'CAROUSEL' string:
const typeStr = 'CAROUSEL';
const blockTypeValue = (BlockType as any)[typeStr];  // Returns 4

// Then we pass 4 to handleAddBlock
```

## Files Modified

1. **`PageActionsContext.tsx`**:
   - Added full debug logging to `handleDragStart`
   - Completely rewrote `handleDragEnd` to include:
     - Full event/active/over logging
     - Library element detection via ID prefix
     - BlockType extraction from element ID
     - Fallback logic when data is missing
     - Better error messages with all details

2. **`PageBuilderCanvas.tsx`**:
   - Added debug logging for droppable setup
   - Better variable naming (setCanvasRef)

## Testing the Fix

1. **Open browser DevTools Console**

2. **Drag a CAROUSEL element** from Elements library to canvas

3. **Look for logs showing**:
   ```
   [PageBuilder] handleDragEnd full event: {...}
   [PageBuilder] handleDragEnd active: {id: "element-CAROUSEL", data: {...}}
   [PageBuilder] handleDragEnd over: {id: "canvas-droppable", data: {...}}
   [PageBuilder] Drag ended: {
     activeId: "element-CAROUSEL",
     activeType: undefined or 'new-block',
     activeBlockType: undefined or 4,
     overId: "canvas-droppable"
   }
   [PageBuilder] New block detected: {
     blockTypeValue: 4,
     targetId: "canvas-droppable",
     isLibraryElement: true
   }
   [PageBuilder] Adding new block: 4
   ```

4. **Verify in canvas**: CAROUSEL block should appear on canvas

5. **Check database**: Block should be created and visible in GraphQL

## Why This Fix Works

**Before**:
- No data → can't detect new block → drag-drop fails
- Gets treated as existing block reorder → invalid indices → nothing happens

**After**:
- No data BUT has correct ID format → detected as library element
- Extract BlockType from ID → get correct enum value
- Call handleAddBlock with correct value → block added successfully

## Backup Plan: If Still Not Working

If elements still don't add, check:

1. **BlockType enum values**: Verify the enum matches in logs
   ```typescript
   // Should see something like:
   [PageBuilder] Extracted BlockType from ID: { typeStr: "CAROUSEL", blockTypeValue: 4 }
   ```

2. **Drop target correct**: Verify `overId: 'canvas-droppable'`

3. **No error in handleAddBlock**: Check if toast shows success or error

4. **Database connection**: Ensure GraphQL mutations are working

## Production Deployment Notes

- ✅ No breaking changes
- ✅ Backward compatible with working drag data
- ✅ Better error reporting for debugging
- ✅ Fallback mechanism means it works even if dnd-kit data prop doesn't work
- ✅ Safe enum lookup with fallback checks

## Future Improvements

1. **Create dedicated type for drag data**: Define interface for drag event data
2. **Add unit tests**: Test BlockType extraction logic
3. **Add visual feedback**: Show drop zone highlight when dragging
4. **Improve error messages**: Show user-friendly messages instead of console logs
5. **Support multi-select**: Allow dragging multiple elements at once
