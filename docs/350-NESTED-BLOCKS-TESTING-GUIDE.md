# Nested Blocks Feature - Testing Guide

## Quick Start Testing

### Setup

1. Start the development environment:
```bash
cd /mnt/chikiet/kataoffical/fullstack/rausachcore
npm run dev  # or yarn dev
```

2. Navigate to the Page Builder:
   - Go to http://localhost:3000/page-builder (or your dev URL)
   - Create a new page or edit an existing one

### Basic Test: Add Child to Container

**Objective**: Verify that children can be added to container blocks

**Steps**:
1. Click the "Container" block from the Elements Library (left panel)
2. A container block appears on the canvas
3. Double-click the Container block OR hover and click "Add Block" button
4. A dialog appears showing all available block types
5. Click "Text" to add a text block as a child
6. ✅ **Expected Result**: Text block appears inside the container

**Validation Points**:
- [ ] Child text block is visually inside the container
- [ ] Child block has proper spacing from container edges
- [ ] "Add Block" button still visible for adding more children
- [ ] Container shows visual feedback (dashed border while editing)

### Test 2: Multiple Children

**Objective**: Verify that containers can hold multiple child blocks

**Steps**:
1. From the test above, with container + text block
2. Hover over the container (not the text block)
3. Click "Add Block" button
4. Select "Button" to add another child
5. Click "Add Block" again
6. Select "Image" to add a third child
7. ✅ **Expected Result**: Container shows Text, Button, and Image blocks with proper spacing

**Validation Points**:
- [ ] All three children display
- [ ] Gap between children is consistent (16px default)
- [ ] All blocks are the same width within container
- [ ] Order is maintained (Text, Button, Image)

### Test 3: Nested Containers

**Objective**: Verify that containers can be nested inside other containers

**Steps**:
1. Create container A with a Text child
2. Hover over the Text child
3. Click "Add Block" button on Text? No - Text blocks can't have children
4. Instead, click "Add Block" on Container A
5. Select "Container" (Container B)
6. Now Container B is a child of Container A
7. Click "Add Block" on Container B
8. Select "Text" to add a Text child to Container B
9. ✅ **Expected Result**: Nested structure: Container A > [Text, Container B > [Text]]

**Validation Points**:
- [ ] Container B appears inside Container A
- [ ] Container B has its own gap/padding
- [ ] Text child inside Container B is properly positioned
- [ ] Visual hierarchy is clear (nesting evident)

### Test 4: Edit Child Block

**Objective**: Verify that child blocks can be edited

**Steps**:
1. From Test 1, with container + text child
2. Hover over the Text block
3. Click the Settings (gear) button
4. Edit panel appears with text-specific options
5. Change text content/color/etc.
6. Click "Save"
7. ✅ **Expected Result**: Text block updates with new values

**Validation Points**:
- [ ] Settings panel appears on hover
- [ ] All edit options are available
- [ ] Changes apply immediately on save
- [ ] No console errors

### Test 5: Delete Child Block

**Objective**: Verify that child blocks can be deleted

**Steps**:
1. From Test 2, with container + 3 children
2. Hover over the "Button" child (middle block)
3. Click the Delete (trash) button
4. Button block is removed
5. ✅ **Expected Result**: Only Text and Image remain, properly spaced

**Validation Points**:
- [ ] Delete button removes the correct child
- [ ] Remaining children reorder properly
- [ ] No gaps in layout
- [ ] Order property updated in database

### Test 6: Edit Container Layout

**Objective**: Verify that container layout settings work

**Steps**:
1. Create a container with 3 child blocks
2. Hover over the container
3. Click Settings on the container
4. Change "Layout" from "Stack (Vertical)" to "Wrap (Horizontal)"
5. Click "Save"
6. ✅ **Expected Result**: Children now display horizontally

**Validation Points**:
- [ ] Children rearrange to horizontal layout
- [ ] Gap spacing maintained
- [ ] All children fit in viewport or wrap appropriately
- [ ] Can change back to vertical

### Test 7: Test Different Container Types

**Objective**: Verify that all container block types support children

**Test Cases**:

#### Container Block
1. Add Container block
2. Add child blocks
3. ✅ Verify children display with flex layout

#### Section Block
1. Add Section block
2. Add child blocks (Text, Button, etc.)
3. ✅ Verify children display with section styling

#### Grid Block
1. Add Grid block
2. Add 4 child blocks
3. ✅ Verify children arrange in grid (2x2 or responsive)

#### Flex Row Block
1. Add Flex Row block
2. Add 3 child blocks
3. ✅ Verify children display horizontally with gap

#### Flex Column Block
1. Add Flex Column block
2. Add 3 child blocks
3. ✅ Verify children display vertically with gap

### Test 8: Drag-and-Drop Reordering

**Objective**: Verify that child blocks can be reordered via drag-and-drop

**Steps**:
1. Container with 3 children: Text (1), Button (2), Image (3)
2. Drag the Button (2) and drop it after Image (3)
3. Order should now be: Text (1), Image (2), Button (3)
4. Refresh the page
5. ✅ **Expected Result**: Order persists after refresh

**Validation Points**:
- [ ] Visual drag feedback shown
- [ ] Drop targets highlighted
- [ ] Blocks reorder smoothly
- [ ] Order value updated in database
- [ ] Page refresh maintains new order

### Test 9: Deep Nesting (3+ Levels)

**Objective**: Verify that deeply nested structures work

**Steps**:
1. Container A (Level 1)
   - Add Text child
   - Add Container B child (Level 2)
     - Add Text child
     - Add Container C child (Level 3)
       - Add Text child
       - Add Button child

2. ✅ **Expected Result**: All 3 nesting levels display correctly

**Validation Points**:
- [ ] All levels render without errors
- [ ] Visual hierarchy is clear
- [ ] Each level has proper spacing/padding
- [ ] Can edit/delete at any level
- [ ] Can add siblings at any level

### Test 10: Max Constraints

**Objective**: Verify that limits are enforced

#### Max Children Per Container
1. Add Container block
2. Try to add 51 child blocks (if limit is 50)
3. ✅ **Expected Result**: Error message "Maximum 50 blocks per container"

#### Max Depth
1. Create 5 levels of nested containers
2. Try to add 6th level
3. ✅ **Expected Result**: Error message "Maximum nesting depth (5 levels) reached"

#### Max Total Blocks
1. Create many blocks to reach 500 total
2. Try to add one more
3. ✅ **Expected Result**: Error message "Maximum 500 blocks per page"

### Test 11: Error Scenarios

#### Add Child to Non-Container
1. Add a Text block
2. Try to add a child to the Text block
3. ✅ **Expected Result**: "Add Block" button doesn't appear OR error shown

#### Save and Refresh
1. Create container with children
2. Click Save/Publish
3. Refresh page (Ctrl+R)
4. ✅ **Expected Result**: All children persist

#### Dialog Actions
1. Open "Add Child Block" dialog
2. Click Cancel
3. ✅ **Expected Result**: Dialog closes, no block added

## Performance Testing

### Test with Many Children
1. Create container with 50 children
2. ✅ Expected: Renders within 2 seconds, no lag
3. ✅ Hover still responsive
4. ✅ Edit/delete still works

### Test with Deep Nesting
1. Create 5 levels of nesting with 10 children at each level
2. ✅ Expected: Page loads and renders smoothly
3. ✅ No noticeable lag or jank

## Browser Compatibility

- [ ] Chrome/Chromium - Test all features
- [ ] Firefox - Test all features  
- [ ] Safari - Test all features
- [ ] Mobile (touch) - Test if touch-friendly

## Accessibility Testing

- [ ] Can navigate using keyboard only
- [ ] Screen reader announces blocks correctly
- [ ] Focus indicators visible
- [ ] Dialog keyboard navigation works

## Regression Testing

**Verify these still work**:
- [ ] Adding root-level blocks (not children)
- [ ] Dragging root-level blocks to reorder
- [ ] Deleting root-level blocks
- [ ] Applying templates
- [ ] Double-click to add blocks
- [ ] Single-click selection highlighting
- [ ] Preview mode
- [ ] Save template

## Bug Report Template

If you find issues, use this template:

```
**Issue**: [Brief description]

**Steps to Reproduce**:
1. ...
2. ...
3. ...

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots/Video**:
[Attach if helpful]

**Browser/Environment**:
- Browser: [Chrome, Firefox, Safari, etc.]
- OS: [Windows, Mac, Linux]
- Screen Size: [Desktop, Tablet, Mobile]
- Dev Console Errors: [Any errors?]

**Severity**:
- Critical (blocks all nested block usage)
- Major (missing feature)
- Minor (cosmetic issue)
```

## Success Criteria

All tests pass when:
1. ✅ Children render visually inside containers
2. ✅ "Add Block" button appears on hover
3. ✅ Dialog shows all block types
4. ✅ Can add multiple children
5. ✅ Can edit children properties
6. ✅ Can delete children
7. ✅ Can reorder children via drag
8. ✅ Can nest containers 3+ levels deep
9. ✅ Changes persist on page refresh
10. ✅ Proper error messages for limit violations
11. ✅ No console errors
12. ✅ Performance is acceptable

## Next Steps After Testing

If all tests pass:
1. Mark feature as "Ready for Production"
2. Deploy to staging
3. Run user acceptance testing
4. Deploy to production
5. Monitor for issues in production

If tests fail:
1. Document the issue
2. Create bug report
3. Fix the issue
4. Re-run tests

