# 🎨 PageBuilder - Hướng Dẫn Sử Dụng Nhanh

## 📋 Tổng Quan

PageBuilder là công cụ trực quan để tạo và chỉnh sửa trang web với drag-and-drop interface.

**Trạng thái:** ✅ Hoàn Thành & Hoạt Động  
**Version:** 2.0  
**Ngày cập nhật:** 17/10/2025

---

## 🚀 Cách Sử Dụng

### 1. Mở PageBuilder

#### Từ Danh Sách Trang
```
/admin/pagebuilder → Click "Edit" trên page card → Dialog mở fullscreen
```

#### Tạo Trang Mới
```
/admin/pagebuilder → Click "New Page" → Dialog mở fullscreen → Tạo page
```

### 2. Giao Diện

```
┌─────────────────────────────────────────────────────────────┐
│  [🔙][💾][👁️][📱][💻] EditorToolbar          [≡][⚙]     │ ← Top
├──────────┬─────────────────────────────────┬────────────────┤
│          │                                 │                │
│  📦      │        🎨 Canvas                │     ⚙️        │
│  Block   │                                 │   Properties   │
│  Library │     [Drag blocks here]          │    Panel       │
│          │                                 │                │
│  ├Text   │     ┌──────────────┐           │  Typography    │
│  ├Hero   │     │  Hero Block  │           │  Colors        │
│  ├Image  │     └──────────────┘           │  Spacing       │
│  ├Button │                                 │  Border        │
│  └...    │     ┌──────────────┐           │  Background    │
│          │     │  Text Block  │           │  Shadow        │
│          │     └──────────────┘           │                │
├──────────┴─────────────────────────────────┴────────────────┤
│  Device: Desktop | Blocks: 2 | Status: Saved        ⓘ     │ ← Bottom
└─────────────────────────────────────────────────────────────┘
```

### 3. Thêm Blocks

#### Cách 1: Drag & Drop (Khuyến khích)
```
1. Mở Left Panel (icon ≡)
2. Chọn block type từ library
3. Kéo và thả vào canvas
4. Block tự động được thêm ✅
```

#### Cách 2: Click để thêm
```
1. Click vào block type trong library
2. Block được thêm vào cuối page
```

### 4. Chỉnh Sửa Blocks

#### Chọn Block
```
Click vào block trong canvas → Block được highlight → Right panel hiển thị properties
```

#### Chỉnh Sửa Content
```
1. Chọn block
2. Right Panel → Tab "Settings"
3. Chỉnh sửa text, images, links, etc.
4. Thay đổi auto-save sau 30 giây
```

#### Chỉnh Sửa Styles
```
1. Chọn block
2. Right Panel → Tab "Style"
3. Mở accordion sections:
   - Typography (font, size, weight)
   - Colors (text, background, border)
   - Spacing (margin, padding)
   - Border (width, style, radius)
   - Background (color, image, gradient)
   - Shadow (box shadow, text shadow)
4. Thay đổi được áp dụng ngay lập tức
```

### 5. Sắp Xếp Lại Blocks

```
Drag block lên/xuống trong canvas → Thả vào vị trí mới → Order tự động update ✅
```

### 6. Xóa Blocks

```
Click vào block → Click nút Delete (🗑️) → Confirm → Block bị xóa ✅
```

### 7. Lưu Page

#### Auto-save
```
Tự động lưu sau 30 giây khi có thay đổi ⏱️
Toast notification: "Auto-saved" ✅
```

#### Manual Save
```
Click nút Save (💾) trong toolbar → GraphQL mutation → Success toast ✅
Hoặc: Ctrl/Cmd + S
```

### 8. Preview

```
Click nút Preview (👁️) trong toolbar → Page mở trong tab mới
```

### 9. Responsive Design

#### Chuyển Device
```
Click icon Device trong toolbar:
- 💻 Desktop (100% width)
- 📱 Tablet (768px width)
- 📱 Mobile (375px width)

Canvas tự động resize → Preview responsive design ✅
```

### 10. Đóng Editor

```
- Click nút Back (🔙)
- Nhấn ESC
- Click backdrop (vùng tối bên ngoài)

→ Dialog đóng → Danh sách page refresh ✅
```

---

## 🧱 Các Loại Blocks

### Basic Blocks (5)
| Icon | Name | Mô Tả |
|------|------|-------|
| 📝 | Text | Đoạn văn bản thông thường |
| 🎯 | Hero | Tiêu đề lớn, nổi bật |
| 🖼️ | Image | Hình ảnh đơn |
| 🔘 | Button | Nút bấm với link |
| ➖ | Divider | Đường phân cách |

### Layout Blocks (5)
| Icon | Name | Mô Tả |
|------|------|-------|
| 📦 | Section | Container lớn |
| ↔️ | Row | Sắp xếp theo hàng ngang |
| ↕️ | Column | Sắp xếp theo cột dọc |
| ⬆️ | Spacer | Khoảng trống |
| ⊞ | Grid | Lưới nhiều cột |

### Content Blocks (7)
| Icon | Name | Mô Tả |
|------|------|-------|
| 🎠 | Carousel | Slider hình ảnh |
| 🖼️ | Gallery | Bộ sưu tập ảnh |
| 🎥 | Video | Video player |
| 📋 | Form | Form liên hệ |
| 💬 | Testimonial | Đánh giá khách hàng |
| 👥 | Team | Giới thiệu team |
| 📊 | Stats | Thống kê số liệu |

### Advanced Blocks (1)
| Icon | Name | Mô Tả |
|------|------|-------|
| ❓ | FAQ | Accordion câu hỏi |

---

## ⌨️ Keyboard Shortcuts

| Phím | Chức Năng |
|------|-----------|
| **Ctrl/Cmd + S** | Save page |
| **ESC** | Close editor |
| **Ctrl/Cmd + Z** | Undo (coming soon) |
| **Ctrl/Cmd + Y** | Redo (coming soon) |
| **Delete** | Delete selected block |
| **Tab** | Navigate between blocks |

---

## 🎨 Templates

### Duyệt Templates

```
1. Left Panel → Tab "Templates"
2. Search/Filter templates
3. Click để preview
```

### Áp Dụng Template

```
1. Preview template
2. Click "Apply Template"
3. Blocks được thêm vào page ✅
```

### Lưu Template

```
1. Tạo layout muốn lưu
2. Toolbar → Menu → "Save as Template"
3. Nhập tên và category
4. Click "Save" → Template được lưu ✅
```

---

## 🔧 Tính Năng Nâng Cao

### Nested Blocks (Blocks lồng nhau)

```
1. Thêm Section/Row/Column block
2. Click nút "Add Child" (＋)
3. Chọn block type để thêm vào
4. Child block được thêm bên trong ✅

Giới hạn:
- Max depth: 5 levels
- Max children: 20 blocks per container
```

### Visual/Code Mode

```
Toolbar → Toggle Visual ⇄ Code

Visual Mode: Drag-and-drop editor
Code Mode: JSON view của blocks
```

### Panel Toggle

```
Left Panel: Click ≡ icon
Right Panel: Click ⚙ icon

→ Panels show/hide → Maximize canvas space
```

---

## ⚠️ Giới Hạn

| Giới Hạn | Số Lượng | Lý Do |
|----------|----------|-------|
| **Max Blocks per Page** | 100 | Performance |
| **Max Nesting Depth** | 5 levels | Complexity |
| **Max Children per Container** | 20 blocks | Usability |
| **Auto-save Interval** | 30 seconds | Server load |

---

## 🐛 Xử Lý Lỗi

### Lỗi Save
```
Nếu save thất bại:
1. Kiểm tra kết nối internet
2. Kiểm tra dữ liệu nhập (title, slug)
3. Reload page và thử lại
4. Liên hệ admin nếu vẫn lỗi
```

### Lỗi Load
```
Nếu page không load:
1. Refresh browser
2. Clear cache
3. Kiểm tra console errors
4. Liên hệ admin
```

### Blocks Không Drag Được
```
1. Kiểm tra browser (Chrome/Firefox/Safari)
2. Disable extensions
3. Clear cache
4. Reload page
```

---

## 💡 Tips & Tricks

### Tăng Tốc Workflow

1. **Dùng Templates** - Nhanh hơn build từ đầu
2. **Keyboard Shortcuts** - Ctrl+S để save nhanh
3. **Duplicate Blocks** - Copy block thay vì tạo mới
4. **Search Blocks** - Tìm nhanh block type cần

### Best Practices

1. **Save Thường Xuyên** - Dù có auto-save
2. **Use Sections** - Organize blocks tốt hơn
3. **Mobile First** - Test responsive design
4. **Meaningful Names** - Đặt tên page rõ ràng
5. **Preview Before Publish** - Kiểm tra trước khi publish

### Tối Ưu Performance

1. **Limit Images** - Compress before upload
2. **Limit Nested Blocks** - Không quá 3-4 levels
3. **Use Spacer** - Thay vì nhiều empty blocks
4. **Clean Up** - Xóa blocks không dùng

---

## 📚 Tài Liệu

### Documentation
- **PAGEBUILDER_COMPREHENSIVE_CHECK.md** - Feature checklist đầy đủ
- **DIALOG_ACCESSIBILITY_FIX.md** - Accessibility improvements
- **PAGEBUILDER_FULLSCREEN_REMOVAL.md** - Architecture changes
- **PAGEBUILDER_DIALOG_UPDATE.md** - Dialog implementation

### Code Examples
```typescript
// Use in your app
import PageBuilder from '@/components/page-builder/PageBuilder';

<PageBuilder pageId="page-id" />
```

### API Reference
```typescript
// Context API
const {
  page,              // Current page
  blocks,            // Page blocks
  editingPage,       // Editing state
  handlePageSave,    // Save function
  handleAddBlock,    // Add block function
  handleBlockUpdate, // Update block function
  handleBlockDelete, // Delete block function
} = usePageBuilderContext();
```

---

## 🆘 Hỗ Trợ

### Liên Hệ
- **Email:** support@example.com
- **Slack:** #pagebuilder-help
- **Docs:** /docs/pagebuilder

### Báo Lỗi
1. Mô tả vấn đề chi tiết
2. Steps to reproduce
3. Screenshots/Screen recording
4. Browser & OS info
5. Console errors (F12 → Console)

---

## ✅ Checklist Sử Dụng

### Lần Đầu Sử Dụng
- [ ] Đọc hướng dẫn này
- [ ] Thử tạo page đơn giản
- [ ] Test các block types
- [ ] Thử drag & drop
- [ ] Test responsive preview
- [ ] Practice keyboard shortcuts

### Mỗi Lần Tạo Page
- [ ] Đặt tên page rõ ràng
- [ ] Chọn template hoặc build từ đầu
- [ ] Add & arrange blocks
- [ ] Edit content & styles
- [ ] Preview trên nhiều devices
- [ ] Save & publish

---

**🎉 Chúc bạn tạo được những trang đẹp với PageBuilder!**

**Version:** 2.0  
**Last Updated:** October 17, 2025  
**Status:** ✅ Production Ready
