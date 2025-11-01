# 🐛 Page Builder - Debug Guide

## 📍 Cách Truy Cập Page Builder

### 1. URL Truy Cập
```
http://localhost:12000/admin/pagebuilder
```

### 2. Các Bước Thao Tác

#### A. Tạo Page Mới
1. Truy cập `/admin/pagebuilder`
2. Click button **"New Page"** (góc phải trên)
3. Dialog fullscreen sẽ mở với Page Builder

#### B. Edit Page Hiện Tại
1. Truy cập `/admin/pagebuilder`
2. Click button **"Edit"** trên bất kỳ page nào trong table
3. Dialog fullscreen sẽ mở với page đã chọn

#### C. Thao Tác Với Nested Blocks
1. Trong Page Builder, thêm một **Grid**, **Section**, hoặc **Container** block
2. Click vào button **"Add Block"** trong container
3. Dialog "Add Child Block to Container" sẽ xuất hiện
4. Chọn block type muốn thêm vào container

---

## 🏗️ Kiến Trúc Component

### Flow Sử Dụng THỰC TẾ:

```
/admin/pagebuilder (page.tsx)
  ↓
PageBuilderContent (component trong page.tsx)
  ↓
Dialog (fullscreen modal)
  ↓
FullScreenPageBuilder
  ↓
PageBuilderProvider (wrapper)
  ↓
FullScreenPageBuilderInternal
  ↓
FullScreenLayout ← **COMPONENT CHÍNH**
  ├─ PageBuilderTopBar
  ├─ LeftPanel (Component Library)
  ├─ EditorCanvas
  │   └─ PageBuilderCanvas ← **Render blocks**
  ├─ RightPanel (Style & Settings)
  ├─ EditorFooter
  └─ Dialog (Add Child Block) ← **DIALOG MỚI THÊM**
```

### ⚠️ Component KHÔNG Được Sử Dụng:

- `PageBuilder.tsx` - **KHÔNG được import ở đâu cả!**
- Đây là component cũ, không được dùng trong flow hiện tại

---

## 🔍 Debug Add Child Dialog

### Console Logs Sequence (Khi Click "Add Block"):

```javascript
1. [GridBlock xxx] Add Block clicked
2. [BlockRenderer xxx] onAddChild wrapper called
3. [PageActionsContext] handleAddChild called with parentId: xxx
4. [UIStateContext] openAddChildDialog called with parentId: xxx
5. [UIStateContext] Dialog should open for parent: xxx
6. [UIStateContext] State changed: { showAddChildDialog: true, ... }
7. [UIStateContext] Context value updated (vX): { showAddChildDialog: true, ... }
8. [FullScreenLayout] Dialog onOpenChange: (nếu dialog render)
```

### Kiểm Tra Dialog Có Render:

1. **Mở Browser DevTools** (F12)
2. **Elements Tab** → Search for `DialogContent`
3. Nếu tìm thấy → Dialog đã render
4. Nếu không → Vấn đề ở component rendering

### Kiểm Tra State Context:

1. **Console Tab** → Quan sát logs
2. Xác nhận:
   - ✅ `showAddChildDialog: true`
   - ✅ `addChildParentId: 'xxx-xxx-xxx'`
3. Nếu state đúng nhưng không hiện → Check CSS/z-index

---

## 🧪 Debug Checklist

### Level 1: State Management
- [ ] Context state được update? (check console logs)
- [ ] `showAddChildDialog: true`?
- [ ] `addChildParentId` có giá trị?

### Level 2: Component Rendering
- [ ] FullScreenLayout có re-render?
- [ ] Dialog component có trong DOM? (DevTools Elements)
- [ ] DialogContent có class `data-state="open"`?

### Level 3: UI/CSS Issues
- [ ] Dialog có bị che bởi overlay khác?
- [ ] z-index của Dialog đủ cao?
- [ ] Portal container tồn tại?

---

## 🎯 Files Đã Sửa

### 1. UIStateContext.tsx
- ✅ Added `openAddChildDialog()` - atomic state update
- ✅ Added `closeAddChildDialog()`
- ✅ Removed useMemo to force re-renders
- ✅ Added version counter
- ✅ Enhanced debug logging

### 2. PageActionsContext.tsx
- ✅ Use `openAddChildDialog()` thay vì set state riêng lẻ
- ✅ Use `closeAddChildDialog()`

### 3. FullScreenLayout.tsx ← **CRITICAL FIX**
- ✅ Import Dialog components
- ✅ Import `useUIState`, `BLOCK_TYPES`
- ✅ Added `showAddChildDialog`, `addChildParentId` from context
- ✅ Added Dialog render at bottom of component
- ✅ Added handlers: `handleAddChildBlock`, `handleCloseAddChildDialog`

### 4. BlockRenderer.tsx
- ✅ Return `undefined` instead of `null` for empty children
- ✅ Enhanced debug logging

### 5. GridBlock.tsx, ContainerBlock.tsx, SectionBlock.tsx
- ✅ Improved empty state UI
- ✅ Better debug messages
- ✅ Visual feedback for onAddChild availability

---

## 🚀 Testing Steps

### Test 1: Basic Dialog Open
1. Truy cập `/admin/pagebuilder?pageId=<existing-page-id>`
2. Add một Grid block
3. Click "Add Block" button trong Grid
4. **Expected**: Dialog xuất hiện với danh sách block types
5. **Check logs**: Sequence như trên

### Test 2: Add Child Block
1. Mở dialog (test 1)
2. Click vào một block type (VD: Text)
3. **Expected**: 
   - Dialog đóng
   - Child block được thêm vào Grid
   - Toast success message
4. **Check logs**: Child block creation logs

### Test 3: Multiple Containers
1. Add Grid, Section, Container blocks
2. Test "Add Block" trong từng container
3. **Expected**: Dialog hoạt động với mọi container type

---

## 📊 Debug Commands

### Check Context Value:
```javascript
// In Browser Console
window.__REACT_DEVTOOLS_GLOBAL_HOOK__
// Use React DevTools to inspect PageBuilderProvider contexts
```

### Force Dialog Open (Manual Test):
```javascript
// In browser console (if you can access context)
// This would require exposing context for debugging
```

---

## ✅ Solution Summary

**Root Cause**: Dialog component chỉ tồn tại trong `PageBuilder.tsx` nhưng file này **KHÔNG được sử dụng**. App thực tế dùng `FullScreenLayout.tsx`.

**Fix**: Moved Dialog to `FullScreenLayout.tsx` - component thực sự được render.

**Result**: Dialog bây giờ sẽ xuất hiện khi click "Add Block" trong containers!
