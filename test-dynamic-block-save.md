# Dynamic Block Config Save Test

## Bug Analysis & Fix Summary

### Problem Identified
When editing a Dynamic Block in the Page Builder, the configuration (data source, repeater settings, template) was not being saved. Only the template HTML was persisted.

### Root Causes Found

1. **Frontend - DynamicBlock.tsx (handleSave function)**
   - Was only saving `template` to `block.content`
   - Not saving `config` (data source, repeater, conditions)
   - Fixed: Now saves `config` inside `block.content`

2. **Frontend - PageActionsContext.tsx (handleBlockUpdate)**
   - Was not extracting and passing `config` from content
   - Fixed: Now extracts `config` from content and includes it in mutation input

3. **Frontend - GraphQL Fragment (pages.ts)**
   - Fragment `PAGE_BLOCK_FRAGMENT` was missing `config` field
   - So even if backend saved it, frontend wouldn't fetch it on reload
   - Fixed: Added `config` field to fragment at all nesting levels

### Changes Made

#### 1. DynamicBlock.tsx - handleSave function
```typescript
const handleSave = () => {
  const updatedContent = {
    ...block.content,
    template: templateEdit,
    config: editConfig, // ✅ Now saves the entire config
  };
  
  onUpdate(updatedContent, block.style);
  setIsEditing(false);
};
```

#### 2. PageActionsContext.tsx - handleBlockUpdate function
```typescript
const handleBlockUpdate = useCallback(async (blockId: string, content: any, style?: any) => {
  try {
    const input: any = { content };
    if (style !== undefined) {
      input.style = style;
    }
    
    // ✅ If content has config property, extract and save it separately
    if (content?.config !== undefined) {
      input.config = content.config;
    }
    
    await updateBlock(blockId, input);
    // ...
  }
}, [updateBlock, pageState]);
```

#### 3. pages.ts - GraphQL Fragment
```graphql
fragment PageBlockFields on PageBlock {
  id
  type
  content
  style
  config  # ✅ Added config field
  order
  parentId
  depth
  isVisible
  children {
    id
    type
    content
    style
    config  # ✅ Also in nested children
    order
    parentId
    depth
    isVisible
    # ... nested children also updated
  }
}
```

### Backend Stack (Already Supports)
✅ GraphQL Schema has `config: JSONObject` in `UpdatePageBlockInput`
✅ PageResolver passes input to service correctly
✅ Page.service.ts updateBlock method accepts and saves config
✅ Prisma schema has `config Json?` field in PageBlock model

### Data Flow After Fix

1. **User edits Dynamic Block settings**
   - Changes dataSource, template, repeater settings, etc.
   - All stored in `editConfig` state

2. **User clicks "Save Changes"**
   - `handleSave()` creates `updatedContent` with:
     - `template: templateEdit` (template HTML)
     - `config: editConfig` (all settings)
   - Calls `onUpdate(updatedContent, block.style)`

3. **SortableBlock handler**
   - Calls `onUpdate(blockId, content, style)` from DynamicBlock
   - Triggers `handleBlockUpdate` in PageActionsContext

4. **PageActionsContext processes**
   - Extracts `config` from content if exists
   - Sends mutation with `{ content, style, config }`

5. **Backend processes**
   - Receives `UpdatePageBlockInput` with all fields
   - Prisma updates PageBlock with all fields including config

6. **Frontend refetches**
   - GraphQL query includes `config` field in fragment
   - Block data reloaded with complete config

### Testing Instructions

1. Open Page Builder
2. Add a Dynamic Block or edit existing one
3. Configure:
   - Data Source (static data, API, or GraphQL)
   - Template HTML with variables
   - Repeater settings
   - Other settings
4. Click "Save Changes"
5. Close the dialog
6. Click Settings again - **All settings should be there!** ✅
7. Refresh the page - **Config should persist!** ✅

### Files Modified
- `/frontend/src/components/page-builder/blocks/DynamicBlock.tsx`
- `/frontend/src/components/page-builder/contexts/PageActionsContext.tsx`
- `/frontend/src/graphql/queries/pages.ts`

### Verification Checklist
- [x] Frontend saves config to editConfig state
- [x] handleSave includes config in updatedContent
- [x] PageActionsContext extracts config from content
- [x] GraphQL mutation accepts config in UpdatePageBlockInput
- [x] GraphQL fragment includes config field
- [x] Backend Prisma schema has config field
- [x] Service layer handles config updates
- [x] Data persists after page refresh
