# 📊 Page Builder Logging System - Quick Guide

## 🎯 Tóm tắt

Tối ưu hóa toast notifications trong Page Builder:
- **Trước**: ~20+ toast notifications mỗi phiên làm việc
- **Sau**: ~3-5 toast (chỉ cho thao tác quan trọng)
- **Giảm**: 70-85% số lượng toast!

---

## 🚀 Cho Người Dùng

### Thao Tác KHÔNG hiện Toast (làm việc im lặng):
- ➕ Thêm block
- 🗑️ Xóa block
- 🎨 Cập nhật style
- 🔄 Sắp xếp lại blocks
- 📦 Thêm child block

### Thao Tác VẪN hiện Toast (quan trọng):
- 💾 Lưu trang
- ➕ Tạo trang mới
- 🗑️ Xóa trang
- 📋 Thêm template
- ❌ Tất cả lỗi

---

## 🔧 Cho Developers

### Xem Logs (Development Mode)

1. **Mở Page Builder**
2. **Chọn block bất kỳ** (mở RightPanel)
3. **Click tab "Logs"** (bên cạnh Style và Settings)
4. **Xem logs real-time!**

### Tính Năng DevLogPanel

```
🔍 Dev Logs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Filters]  all | debug | info | success | warning | error
[Actions]  ⏸️ Pause | 📥 Download | 🗑️ Clear

Total: 45 | Filtered: 12

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUCCESS  [BLOCK_ADD]  10:30:15
Block added: TEXT
▼ View data
  { blockId: "123", blockType: "TEXT" }

ERROR    [API_CALL]   10:31:20
Failed to save page
▼ View data
  { error: "Network timeout" }
```

### Các Nút Chức Năng

- **⏸️ Pause / ▶️ Resume**: Tạm dừng/tiếp tục auto-refresh
- **📥 Download**: Export logs dạng JSON
- **🗑️ Clear**: Xóa tất cả logs
- **Filter buttons**: Lọc theo level (all, debug, info, success, warning, error)

---

## 💻 Sử Dụng trong Code

### Import

```typescript
import { pageBuilderLogger, LOG_OPERATIONS } from './utils/pageBuilderLogger';
```

### Các Log Levels

#### 1. Debug (chỉ dev, không toast)
```typescript
pageBuilderLogger.debug(
  LOG_OPERATIONS.BLOCK_STYLE_UPDATE, 
  'Style updated', 
  { blockId, style }
);
```

#### 2. Info (log only, không toast)
```typescript
pageBuilderLogger.info(
  LOG_OPERATIONS.BLOCK_ADD, 
  `Block added: ${blockType}`, 
  { blockId, blockType }
);
```

#### 3. Success (log + có thể toast nếu quan trọng)
```typescript
if (pageBuilderLogger.success(
  LOG_OPERATIONS.PAGE_CREATE, 
  'Page created successfully', 
  { pageId }
)) {
  toast.success('Page created successfully!');
}
```

#### 4. Warning (log + luôn toast)
```typescript
if (pageBuilderLogger.warning(
  LOG_OPERATIONS.VALIDATION, 
  'Missing required field', 
  { field }
)) {
  toast.warning('Please fill required field');
}
```

#### 5. Error (log + luôn toast)
```typescript
if (pageBuilderLogger.error(
  LOG_OPERATIONS.API_CALL, 
  'Failed to save', 
  { error }
)) {
  toast.error('Failed to save page');
}
```

---

## 📋 Operation Constants

```typescript
// Page operations
LOG_OPERATIONS.PAGE_CREATE
LOG_OPERATIONS.PAGE_UPDATE
LOG_OPERATIONS.PAGE_DELETE
LOG_OPERATIONS.PAGE_SAVE
LOG_OPERATIONS.PAGE_PUBLISH

// Block operations
LOG_OPERATIONS.BLOCK_ADD
LOG_OPERATIONS.BLOCK_UPDATE
LOG_OPERATIONS.BLOCK_DELETE
LOG_OPERATIONS.BLOCK_REORDER
LOG_OPERATIONS.BLOCK_STYLE_UPDATE

// Child block operations
LOG_OPERATIONS.CHILD_BLOCK_ADD

// Template operations
LOG_OPERATIONS.TEMPLATE_ADD

// Bulk operations
LOG_OPERATIONS.BULK_OPERATION
```

---

## 🎨 Console Output (Development)

Khi log, console sẽ hiển thị đẹp mắt:

```
🔍 [BLOCK_STYLE_UPDATE] Style updated
  DEBUG
  Data: { blockId: "abc123", style: {...} }
  Time: 10:30:15

✅ [PAGE_CREATE] Page created successfully
  SUCCESS
  Data: { pageId: "xyz789", title: "New Page" }
  Time: 10:31:20

❌ [API_CALL] Failed to save page
  ERROR
  Data: { error: "Network timeout" }
  Time: 10:32:45
```

---

## 🧪 Testing Checklist

### ✅ User Experience
- [ ] Thêm block → **Không có toast**
- [ ] Xóa block → **Không có toast**
- [ ] Update style → **Không có toast**
- [ ] Reorder blocks → **Không có toast**
- [ ] Save page → **Có toast: "Page updated successfully!"**
- [ ] Error xảy ra → **Có toast với error message**

### ✅ Developer Tools
- [ ] Mở DevLogPanel → **Tab "Logs" hiện ra**
- [ ] Perform operations → **Logs xuất hiện real-time**
- [ ] Filter logs → **Filtering hoạt động đúng**
- [ ] Export logs → **Download file JSON thành công**
- [ ] Clear logs → **Logs bị xóa**
- [ ] Pause/Resume → **Auto-refresh hoạt động đúng**

### ✅ Production Safety
- [ ] Build production → **Tab "Logs" KHÔNG hiện**
- [ ] Console → **Không có dev logs**
- [ ] Operations → **Hoạt động bình thường**

---

## 🐛 Debug Commands (Browser Console)

```javascript
// Xem tất cả logs
pageBuilderLogger.getLogs()

// Export logs
pageBuilderLogger.exportLogs()

// Clear logs
pageBuilderLogger.clearLogs()

// Check số lượng logs
pageBuilderLogger.getLogs().length
```

---

## 📁 Files Modified/Created

### Created:
- ✅ `frontend/src/components/page-builder/utils/pageBuilderLogger.ts`
- ✅ `frontend/src/components/page-builder/panels/DevLogPanel.tsx`
- ✅ `PAGEBUILDER_TOAST_OPTIMIZATION_COMPLETE.md`
- ✅ `PAGEBUILDER_LOGGING_QUICK_GUIDE.md` (file này)

### Modified:
- ✅ `PageBuilderProvider.tsx` (10 functions updated)
- ✅ `RightPanel.tsx` (added Logs tab)

---

## 💡 Tips

### Khi Nào Dùng Từng Level?

| Level | Use Case | Toast? | Production? |
|-------|----------|--------|-------------|
| `debug` | Detailed tracing | ❌ | ❌ |
| `info` | Normal operations | ❌ | ✅ |
| `success` | Important success | ⚡ (smart) | ✅ |
| `warning` | Non-critical issues | ✅ Always | ✅ |
| `error` | Failures | ✅ Always | ✅ |

### Best Practices

1. **Debug**: Dùng cho chi tiết implementation, chỉ dev
2. **Info**: Dùng cho thao tác thông thường (add block, update style)
3. **Success**: Dùng cho thao tác quan trọng (create page, save page)
4. **Warning**: Dùng khi có vấn đề nhỏ nhưng vẫn chạy được
5. **Error**: Dùng khi thao tác thất bại hoàn toàn

---

## 🎉 Results

### Before
```
User workflow:
Add text → Toast!
Add image → Toast!
Update padding → Toast!
Update color → Toast!
Delete block → Toast!
Reorder → Toast!
... (annoying!) 😩
```

### After
```
User workflow:
Add text → ✓ (silent)
Add image → ✓ (silent)
Update padding → ✓ (silent)
Update color → ✓ (silent)
Delete block → ✓ (silent)
Reorder → ✓ (silent)
Save page → Toast: "Page updated!" ✅
... (smooth!) 😊
```

---

## 📞 Support

Nếu có vấn đề:
1. Mở DevLogPanel (dev mode)
2. Filter để tìm log liên quan
3. Export logs và share với team
4. Check console để xem detailed output

---

**Happy Coding!** 🚀✨
