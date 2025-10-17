# 🚀 Quick Reference: PageBuilder Fullscreen Dialog

## Cách sử dụng (How to Use)

### 1. Tạo trang mới (Create New Page)
```
/admin/pagebuilder → Click "New Page" → Dialog mở fullscreen → Tạo page
```

### 2. Sửa trang có sẵn (Edit Existing Page)
```
/admin/pagebuilder → Click "Edit" trên page card → Dialog mở → Chỉnh sửa
```

### 3. Đóng editor (Close Editor)
- **ESC key** - Đóng dialog
- **Click backdrop** - Click vùng tối bên ngoài
- **Close button** - Nút trong toolbar

## Code Changes Summary

### Before (Trước đây)
```typescript
// Chuyển toàn bộ trang
if (showPageList) return <PageList />
return <Editor />
```

### After (Bây giờ)
```typescript
// Hiện cả hai, editor trong dialog
return (
  <>
    <PageList />
    <Dialog open={isEditorOpen}>
      <Editor />
    </Dialog>
  </>
)
```

## Key Features

✅ **Page list luôn hiển thị** - Background vẫn thấy danh sách trang  
✅ **Smooth transitions** - Hiệu ứng mở/đóng mượt mà  
✅ **URL deep linking** - Link `/admin/pagebuilder?pageId=xxx` vẫn hoạt động  
✅ **Auto refresh** - Danh sách tự động cập nhật sau khi đóng  
✅ **Multiple close methods** - Nhiều cách đóng (ESC, backdrop, button)

## Dialog Styling

```typescript
<DialogContent 
  className="max-w-full w-screen h-screen p-0 m-0 bg-white border-0 rounded-none"
  style={{ 
    maxWidth: '100vw', 
    maxHeight: '100vh',
    width: '100vw',
    height: '100vh'
  }}
/>
```

## Component Flow

```
User clicks "Edit"
  ↓
URL: /admin/pagebuilder?pageId=xxx
  ↓
useEffect detects pageId
  ↓
setIsEditorOpen(true)
  ↓
Dialog opens fullscreen
  ↓
User edits page
  ↓
User closes (ESC/backdrop/button)
  ↓
handleCloseEditor()
  ↓
Dialog closes + refetch list
```

## Files Modified

- ✅ `/frontend/src/app/admin/pagebuilder/page.tsx` - Main component

## Documentation

- 📚 Full Guide: `docs/PAGEBUILDER_DIALOG_UPDATE.md`
- 📚 Fullscreen Feature: `docs/PAGEBUILDER_FULLSCREEN_GUIDE.md`
- 📚 Demo Pages: `DEMO_PAGES_README.md`

---

**Hoàn thành (Completed):** ✅  
**Date:** October 17, 2025
