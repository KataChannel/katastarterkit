# 🧪 PageBuilder Testing Checklist

**Date**: October 18, 2025  
**Tester**: _____________  
**Version**: 2.0.0  
**Environment**: Local Development

---

## 🎯 Testing Overview

This checklist covers comprehensive testing of the PageBuilder system including all blocks, features, and integrations.

**Estimated Time**: 4-6 hours  
**Priority**: HIGH  
**Status**: 🟡 In Progress

---

## ✅ Pre-Testing Setup

- [ ] Backend running on http://localhost:14000
- [ ] Frontend running on http://localhost:13000
- [ ] Database seeded with sample data
- [ ] Browser DevTools open (F12)
- [ ] Apollo DevTools extension installed
- [ ] Clear browser cache and localStorage

```bash
# Start services
./run.sh

# Verify backend
curl http://localhost:14000/health
# Expected: {"status":"ok"}

# Verify frontend
curl http://localhost:13000
# Expected: HTML response
```

---

## 📋 Test 1: PageBuilder Editor Interface

### 1.1 Initial Load
- [ ] Open http://localhost:13000/admin/pagebuilder
- [ ] Page loads without errors (check Console)
- [ ] Canvas displays correctly
- [ ] LeftPanel visible with blocks
- [ ] Header with device switcher visible
- [ ] No GraphQL errors in Network tab

**Expected**: Clean load, no errors

**Actual**: _____________

**Issues**: _____________

---

### 1.2 LeftPanel - Elements Library
- [ ] Click "Elements" tab
- [ ] All categories visible (Text, Media, Layout, E-commerce, etc.)
- [ ] Can scroll through blocks
- [ ] Block icons load correctly
- [ ] Search box functional (type "product")
- [ ] Filtered results show ProductList and ProductDetail

**Expected**: All 20+ blocks visible and searchable

**Actual**: _____________

**Issues**: _____________

---

### 1.3 LeftPanel - Templates
- [ ] Click "Templates" tab
- [ ] Custom templates section loads
- [ ] Can see saved templates (if any)
- [ ] Storage usage indicator shows percentage
- [ ] "Create Template" option available

**Expected**: Templates library accessible

**Actual**: _____________

**Issues**: _____________

---

### 1.4 Device Preview
- [ ] Click Desktop icon (default)
- [ ] Canvas shows full width
- [ ] Click Tablet icon
- [ ] Canvas resizes to tablet width (~768px)
- [ ] Click Mobile icon
- [ ] Canvas resizes to mobile width (~375px)
- [ ] Blocks responsive to viewport changes

**Expected**: Smooth viewport switching

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 2: Basic Blocks (Text, Image, etc.)

### 2.1 Text Block
- [ ] Drag TextBlock from LeftPanel to Canvas
- [ ] Block drops successfully
- [ ] Edit mode placeholder visible
- [ ] Click block to select
- [ ] RightPanel opens with Settings tab
- [ ] "Text Content" field visible in RightPanel
- [ ] Type "Hello World" in text field
- [ ] Text updates in block immediately
- [ ] Click Style tab in RightPanel
- [ ] Change text color to blue
- [ ] Text color changes on canvas
- [ ] Change font size to 24px
- [ ] Font size updates
- [ ] Delete block using Delete button
- [ ] Block removed from canvas

**Expected**: Full edit functionality working

**Actual**: _____________

**Issues**: _____________

---

### 2.2 Image Block
- [ ] Add ImageBlock to canvas
- [ ] Block shows placeholder image
- [ ] Select block
- [ ] RightPanel shows URL field
- [ ] Enter image URL: `https://picsum.photos/800/600`
- [ ] Image loads and displays
- [ ] Change alt text to "Test Image"
- [ ] Open Style tab
- [ ] Add border radius (rounded-lg)
- [ ] Border radius applies
- [ ] Test with invalid URL
- [ ] Broken image icon shows
- [ ] Fix URL and verify image loads again

**Expected**: Image upload and styling works

**Actual**: _____________

**Issues**: _____________

---

### 2.3 Button Block
- [ ] Add ButtonBlock to canvas
- [ ] Default button displays
- [ ] Select block
- [ ] Change text to "Click Me"
- [ ] Change URL to "/contact"
- [ ] Change variant to "destructive"
- [ ] Button style updates
- [ ] Change size to "lg"
- [ ] Button size increases
- [ ] Verify button not clickable in edit mode

**Expected**: Button configuration works

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 3: Container Blocks (Layout)

### 3.1 Container Block
- [ ] Add ContainerBlock to canvas
- [ ] Container shows dashed border in edit mode
- [ ] Container has "+ Add Block" button
- [ ] Click "+ Add Block" inside container
- [ ] Can add TextBlock inside container
- [ ] TextBlock appears nested
- [ ] Add ImageBlock inside same container
- [ ] Both blocks visible in container
- [ ] Select container (not child)
- [ ] RightPanel shows container settings
- [ ] Change container padding
- [ ] Padding applies to container
- [ ] Delete container
- [ ] Confirm all child blocks deleted too

**Expected**: Nested blocks work correctly

**Actual**: _____________

**Issues**: _____________

---

### 3.2 Grid Block
- [ ] Add GridBlock to canvas
- [ ] Grid shows 3 columns by default
- [ ] Select grid
- [ ] Change columns to 4 in RightPanel
- [ ] Grid layout updates to 4 columns
- [ ] Add 4 TextBlocks inside grid
- [ ] Blocks distribute in grid layout
- [ ] Change gap size
- [ ] Gap between blocks updates
- [ ] Switch to mobile view
- [ ] Grid becomes single column

**Expected**: Responsive grid layout

**Actual**: _____________

**Issues**: _____________

---

### 3.3 Nested Containers
- [ ] Add SectionBlock to canvas
- [ ] Add ContainerBlock inside Section
- [ ] Add GridBlock inside Container
- [ ] Add TextBlock inside Grid
- [ ] 4 levels of nesting works
- [ ] Can select each level independently
- [ ] Can delete from any level
- [ ] Hierarchy maintains correctly

**Expected**: Deep nesting supported

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 4: Product Blocks (E-commerce)

### 4.1 ProductListBlock - Add and Configure
- [ ] Add ProductListBlock to canvas
- [ ] Block shows edit placeholder
- [ ] Placeholder says "Product List Block"
- [ ] Shows default config (12 items, grid, 3 columns)
- [ ] Select block
- [ ] RightPanel shows Settings tab
- [ ] See "Products Limit" field
- [ ] Change limit to 6
- [ ] Placeholder updates to show "6 items"
- [ ] See "Category ID" field (optional)
- [ ] Enter category ID (if you have one)
- [ ] See layout and columns options

**Expected**: Block configurable via RightPanel

**Actual**: _____________

**Issues**: _____________

---

### 4.2 ProductListBlock - GraphQL Query
- [ ] Open Apollo DevTools
- [ ] Switch to "Queries" tab
- [ ] Should NOT see GET_PRODUCTS query (edit mode = skip)
- [ ] Confirm skip: true in query config
- [ ] Preview page (see Test 6)
- [ ] Now GET_PRODUCTS query should execute
- [ ] Check query variables (limit, filters)
- [ ] Check response data
- [ ] Products array returned

**Expected**: Query skipped in edit mode, runs in view mode

**Actual**: _____________

**Issues**: _____________

---

### 4.3 ProductDetailBlock - Add and Configure
- [ ] Add ProductDetailBlock to canvas
- [ ] Block shows edit placeholder
- [ ] See warning: "⚠️ Chưa cấu hình product slug"
- [ ] Orange warning text visible
- [ ] Instruction to use RightPanel shown
- [ ] Select block
- [ ] RightPanel opens to Settings
- [ ] See "Product Slug *" field (required indicator)
- [ ] Field is empty
- [ ] Enter product slug: "ao-thun-nam" (example)
- [ ] Placeholder updates
- [ ] Shows: "Hiển thị chi tiết sản phẩm: ao-thun-nam"
- [ ] Warning disappears

**Expected**: Slug configuration required and working

**Actual**: _____________

**Issues**: _____________

---

### 4.4 ProductDetailBlock - Invalid Slug
- [ ] Clear product slug field
- [ ] Warning reappears
- [ ] Enter invalid slug: "nonexistent-product-xyz"
- [ ] Placeholder still shows slug
- [ ] Save page
- [ ] Preview page
- [ ] Should see "Product not found" or error message
- [ ] Go back to editor
- [ ] Change to valid slug

**Expected**: Graceful handling of invalid slugs

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 5: RightPanel Functionality

### 5.1 Style Tab - Typography
- [ ] Add TextBlock
- [ ] Select block
- [ ] Open RightPanel → Style tab
- [ ] Expand Typography section
- [ ] Change font family
- [ ] Text updates immediately
- [ ] Change font size with slider
- [ ] Font size updates smoothly
- [ ] Change font weight
- [ ] Weight applies
- [ ] Change text color with color picker
- [ ] Color changes in real-time
- [ ] Change line height
- [ ] Spacing updates

**Expected**: All typography controls working

**Actual**: _____________

**Issues**: _____________

---

### 5.2 Style Tab - Spacing
- [ ] Keep block selected
- [ ] Expand Spacing section
- [ ] Adjust padding (top, right, bottom, left)
- [ ] Padding applies to block
- [ ] Use "Lock" button to change all at once
- [ ] All sides update together
- [ ] Unlock and change individually
- [ ] Individual values work
- [ ] Adjust margin
- [ ] Margin creates space outside block

**Expected**: Spacing controls working

**Actual**: _____________

**Issues**: _____________

---

### 5.3 Style Tab - Background & Border
- [ ] Expand Background section
- [ ] Change background color
- [ ] Color applies to block
- [ ] Try gradient (if available)
- [ ] Gradient renders
- [ ] Expand Border section
- [ ] Add border width
- [ ] Border appears
- [ ] Change border color
- [ ] Color applies
- [ ] Add border radius
- [ ] Corners round

**Expected**: Visual styling working

**Actual**: _____________

**Issues**: _____________

---

### 5.4 Settings Tab - Block Info
- [ ] Click Settings tab
- [ ] See "Block Information" section
- [ ] Block ID displayed (UUID)
- [ ] Block Type shown (e.g., "TEXT")
- [ ] Order number shown
- [ ] Status shows "Editable"
- [ ] All info accurate

**Expected**: Block metadata visible

**Actual**: _____________

**Issues**: _____________

---

### 5.5 Settings Tab - Quick Edit
- [ ] Still in Settings tab
- [ ] See "Quick Edit Content" section
- [ ] Fields relevant to block type shown
- [ ] For TextBlock: "Text Content" field
- [ ] Type text directly
- [ ] Content updates on canvas
- [ ] For ProductDetailBlock: "Product Slug" field
- [ ] For ProductListBlock: "Limit" field
- [ ] All fields functional

**Expected**: Quick edit working per block type

**Actual**: _____________

**Issues**: _____________

---

### 5.6 Action Buttons
- [ ] Select any block
- [ ] See action buttons: Lock, Duplicate, Delete
- [ ] Click "Lock" button
- [ ] Block locked (can't edit)
- [ ] Status changes to "Locked"
- [ ] Style and Settings tabs disabled
- [ ] Click "Unlock"
- [ ] Block editable again
- [ ] Click "Duplicate" button
- [ ] New copy of block appears below
- [ ] Both blocks identical
- [ ] Click "Delete" button
- [ ] Button text changes to "Confirm?"
- [ ] Click again
- [ ] Block deleted
- [ ] RightPanel closes

**Expected**: All actions working

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 6: Save and Preview

### 6.1 Save Page
- [ ] Add 3-4 different blocks to canvas
- [ ] Configure each block
- [ ] Click "Save" button in header
- [ ] Loading indicator shows
- [ ] Success toast notification appears
- [ ] "Saved successfully" message
- [ ] No errors in console
- [ ] Check Network tab
- [ ] GraphQL mutation successful
- [ ] Response returns page ID

**Expected**: Page saves successfully

**Actual**: _____________

**Issues**: _____________

---

### 6.2 Preview Mode
- [ ] Click "Preview" button in header
- [ ] New tab/window opens
- [ ] URL: /website/[slug] or similar
- [ ] Page renders WITHOUT edit mode UI
- [ ] No dashed borders
- [ ] No "+ Add Block" buttons
- [ ] No selection highlights
- [ ] Blocks render with actual data
- [ ] ProductListBlock shows real products
- [ ] ProductDetailBlock shows product details
- [ ] All styling preserved
- [ ] Responsive design works

**Expected**: Clean preview without editor UI

**Actual**: _____________

**Issues**: _____________

---

### 6.3 Reload Editor
- [ ] Go back to PageBuilder editor
- [ ] Refresh page (F5)
- [ ] Page loads
- [ ] All previously saved blocks appear
- [ ] Block configurations preserved
- [ ] Order maintained
- [ ] Styles intact
- [ ] Everything as saved

**Expected**: Data persists after reload

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 7: Storage Management

### 7.1 Storage Warning Component
- [ ] Open TemplateLibrary
- [ ] Check for StorageWarning component at top
- [ ] If storage < 80%, component hidden
- [ ] Open browser DevTools → Console
- [ ] Run: `localStorage.setItem('test-fill', 'x'.repeat(1000000))`
- [ ] Refresh page
- [ ] StorageWarning now visible (if > 80%)
- [ ] Shows usage percentage
- [ ] Shows progress bar
- [ ] Color coded (yellow/orange/red based on usage)
- [ ] "Show Details" button available
- [ ] Click "Show Details"
- [ ] Detailed stats shown
- [ ] Click "Auto Cleanup"
- [ ] Oldest items removed
- [ ] Usage percentage decreases
- [ ] Clean test data: `localStorage.removeItem('test-fill')`

**Expected**: Storage warning system working

**Actual**: _____________

**Issues**: _____________

---

### 7.2 Template Storage
- [ ] Create a complex page with 10 blocks
- [ ] Configure all blocks
- [ ] Click "Save as Template" (if available)
- [ ] Template saved to localStorage
- [ ] Check DevTools → Application → Local Storage
- [ ] See 'kata_custom_templates' key
- [ ] Value is compressed (Base64)
- [ ] Size is reasonable (< 50KB for 10 blocks)
- [ ] Add another template
- [ ] Both templates stored
- [ ] Verify compression working

**Expected**: Templates stored efficiently

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 8: GraphQL Integration

### 8.1 Product Queries
- [ ] Open http://localhost:14000/graphql
- [ ] GraphQL Playground loads
- [ ] Run query:
```graphql
query GetProducts {
  products(input: { limit: 5 }) {
    items {
      id
      name
      slug
      price
      thumbnail
    }
    total
  }
}
```
- [ ] Query executes successfully
- [ ] Returns array of products
- [ ] All fields present
- [ ] Run detail query:
```graphql
query GetProductBySlug {
  productBySlug(slug: "ao-thun-nam") {
    id
    name
    slug
    price
    description
    images {
      id
      url
      order
    }
    variants {
      id
      name
      price
      stock
    }
  }
}
```
- [ ] Query returns single product
- [ ] Images array populated
- [ ] Variants array populated
- [ ] No field errors

**Expected**: All GraphQL queries working

**Actual**: _____________

**Issues**: _____________

---

### 8.2 Query Performance
- [ ] Open Apollo DevTools → Queries
- [ ] Observe query execution times
- [ ] GET_PRODUCTS < 200ms
- [ ] GET_PRODUCT_BY_SLUG < 150ms
- [ ] Check cache hits
- [ ] Second query uses cache (0ms)
- [ ] Verify fetchPolicy: 'cache-first'

**Expected**: Fast queries with caching

**Actual**: _____________

**Issues**: _____________

---

### 8.3 Error Handling
- [ ] Run invalid query:
```graphql
query {
  productBySlug(slug: "doesnotexist") {
    id
    name
  }
}
```
- [ ] Returns null (not error)
- [ ] Run query with wrong field:
```graphql
query {
  products {
    items {
      nonExistentField
    }
  }
}
```
- [ ] GraphQL error returned
- [ ] Error message clear
- [ ] Doesn't crash server

**Expected**: Graceful error handling

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 9: Edge Cases & Stress Testing

### 9.1 Empty States
- [ ] Create page with ProductListBlock
- [ ] Configure with filters that return no products
- [ ] Preview page
- [ ] "No products found" message shows
- [ ] Message is user-friendly
- [ ] Suggestions to change filters (if any)

**Expected**: Proper empty state handling

**Actual**: _____________

**Issues**: _____________

---

### 9.2 Large Page (50+ blocks)
- [ ] Create page with 50+ blocks
- [ ] Mix of different block types
- [ ] Editor still responsive
- [ ] Can scroll smoothly
- [ ] Can select any block
- [ ] Save works
- [ ] Preview renders all blocks
- [ ] No performance degradation
- [ ] Check memory usage (< 500MB)

**Expected**: Handles large pages well

**Actual**: _____________

**Issues**: _____________

---

### 9.3 Network Errors
- [ ] Open DevTools → Network tab
- [ ] Enable "Offline" mode
- [ ] Try to load products in preview
- [ ] Network error shown
- [ ] Error message: "Network error" or similar
- [ ] "Retry" button available
- [ ] Disable offline mode
- [ ] Click retry
- [ ] Data loads successfully

**Expected**: Network error recovery

**Actual**: _____________

**Issues**: _____________

---

### 9.4 Browser Compatibility
- [ ] Test in Chrome (latest)
- [ ] All features work
- [ ] Test in Firefox (latest)
- [ ] All features work
- [ ] Test in Safari (if available)
- [ ] All features work
- [ ] Test in Edge (latest)
- [ ] All features work
- [ ] Note any browser-specific issues

**Expected**: Cross-browser compatibility

**Actual**: _____________

**Issues**: _____________

---

## 📋 Test 10: Performance Metrics

### 10.1 Load Time
- [ ] Open PageBuilder in Incognito mode
- [ ] Clear cache
- [ ] Open DevTools → Network tab
- [ ] Record page load
- [ ] Check "Finish" time
- [ ] Target: < 3 seconds
- [ ] Check "DOMContentLoaded"
- [ ] Target: < 1.5 seconds

**Expected**: Fast initial load

**Actual**: _____________

**Issues**: _____________

---

### 10.2 Bundle Size
- [ ] Run: `cd frontend && bun run build`
- [ ] Check build output
- [ ] Note main bundle size
- [ ] Target: < 500KB gzipped
- [ ] Note lazy-loaded chunks
- [ ] Verify code splitting

**Expected**: Optimized bundle

**Actual**: _____________

**Issues**: _____________

---

### 10.3 Runtime Performance
- [ ] Open DevTools → Performance
- [ ] Start recording
- [ ] Add 10 blocks
- [ ] Edit 10 blocks
- [ ] Delete 5 blocks
- [ ] Stop recording
- [ ] Check FPS (target: 60 FPS)
- [ ] Check for long tasks (target: < 50ms)
- [ ] No memory leaks

**Expected**: Smooth 60 FPS operation

**Actual**: _____________

**Issues**: _____________

---

## 📊 Test Summary

### Overall Results

**Total Tests**: 100+  
**Passed**: ___ / ___  
**Failed**: ___ / ___  
**Skipped**: ___ / ___  
**Pass Rate**: ___%

### Critical Issues (P0)
1. _____________
2. _____________
3. _____________

### High Priority Issues (P1)
1. _____________
2. _____________
3. _____________

### Medium Priority Issues (P2)
1. _____________
2. _____________

### Low Priority Issues (P3)
1. _____________

### Performance Metrics
- **Page Load Time**: _____ seconds
- **Bundle Size**: _____ KB
- **Average FPS**: _____ fps
- **Memory Usage**: _____ MB

### Browser Compatibility
- **Chrome**: ✅ / ❌
- **Firefox**: ✅ / ❌
- **Safari**: ✅ / ❌
- **Edge**: ✅ / ❌

---

## ✅ Sign Off

**Tester**: _____________  
**Date**: _____________  
**Status**: ⬜ Passed / ⬜ Failed / ⬜ Needs Rework  

**Comments**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## 📝 Next Steps

Based on testing results:

1. **If Pass Rate > 95%**:
   - ✅ Move to production deployment
   - ✅ Start implementing new features (blog blocks)
   - ✅ Optimize performance further

2. **If Pass Rate 85-95%**:
   - ⚠️ Fix high priority bugs first
   - ⚠️ Retest failed areas
   - ⚠️ Then proceed to new features

3. **If Pass Rate < 85%**:
   - ❌ Focus on bug fixes only
   - ❌ Full regression testing after fixes
   - ❌ Hold new feature development

---

**Version**: 1.0.0  
**Last Updated**: October 18, 2025  
**Document Status**: Ready for Use
