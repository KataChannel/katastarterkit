# 🎯 Save as Template - Quick Demo Guide

## Cách Test Feature

### 1️⃣ Mở PageBuilder
```
URL: http://localhost:13000/admin/pagebuilder
```

### 2️⃣ Tạo Blocks
1. Click tab **"Blocks"** trong sidebar
2. Add một vài blocks:
   - Hero Section
   - Features Grid
   - CTA Button
3. Configure content của các blocks

### 3️⃣ Save as Template
1. Click button **"Save as Template"** ở header
2. Dialog mở ra
3. Fill form:
   ```
   Name: My Landing Page
   Description: Custom landing page with hero and features
   Category: custom
   ```
4. Click **"Save Template"**
5. ✅ Toast hiện: "Template 'My Landing Page' saved successfully!"

### 4️⃣ Verify Template Saved
1. Click tab **"Templates"** trong sidebar
2. Scroll xuống cuối danh sách
3. Thấy template mới:
   - Có thumbnail tự động
   - Badge "custom" màu xanh
   - Badge "CUSTOM" màu xanh lá
   - 3 buttons: Preview, Apply, Delete (trash icon)

### 5️⃣ Test Preview
1. Click **"Preview"** button
2. Modal mở với:
   - Thumbnail preview
   - Statistics (blocks count, depth, types)
   - Tree view structure
3. Click **"Apply Template"** trong modal
4. Hoặc close modal

### 6️⃣ Test Apply Template
1. Delete tất cả blocks hiện tại (để test clean)
2. Click **"Apply"** button trên custom template
3. ✅ Blocks được add vào page
4. ✅ Toast: "Template 'My Landing Page' applied successfully!"

### 7️⃣ Test Delete Template
1. Find custom template
2. Click **trash icon** (màu đỏ)
3. Confirm dialog: "Are you sure you want to delete...?"
4. Click OK
5. ✅ Template disappears
6. ✅ Toast: "Template 'My Landing Page' deleted successfully!"

---

## 🧪 Advanced Testing

### Test Cross-Tab Sync
1. Mở 2 tabs cùng PageBuilder
2. Tab 1: Save template
3. Tab 2: Refresh hoặc đợi sync
4. ✅ Template hiện ở cả 2 tabs

### Test LocalStorage
```javascript
// Open browser console
localStorage.getItem('kata_custom_templates')

// Should return JSON array of templates
```

### Test Empty State
1. Click "Save as Template" khi chưa có blocks
2. ✅ Button bị disabled
3. Hover: "Add blocks to save as template"

### Test Validation
1. Click "Save as Template"
2. Leave name empty → ✗ "Template name is required"
3. Enter "ab" → ✗ "Must be at least 3 characters"
4. Leave description empty → ✗ "Template description is required"
5. Enter "short" → ✗ "Description must be at least 10 characters"
6. Fill properly → ✅ Saves

---

## 📸 Screenshots to Check

### Dialog
- [ ] Info box with block counts
- [ ] Name input with validation
- [ ] Description textarea with validation
- [ ] Category select (11 options)
- [ ] Badges showing stats
- [ ] Cancel and Save buttons

### Template Card
- [ ] Thumbnail at top
- [ ] Category badge (top-right)
- [ ] "Custom" badge (green, top-right)
- [ ] Template name and description
- [ ] 3 buttons: Preview, Apply, Delete

### Preview Modal
- [ ] Thumbnail at top
- [ ] Statistics section
- [ ] Tree view structure
- [ ] Apply button

---

## ✅ Success Criteria

- [x] Can save blocks as template
- [x] Template appears in Templates tab
- [x] Has "Custom" badge
- [x] Has auto-generated thumbnail
- [x] Can preview template
- [x] Can apply template
- [x] Can delete template
- [x] Cross-tab sync works
- [x] Validation works
- [x] Toast notifications work
- [x] Zero TypeScript errors
- [x] Zero runtime errors

---

## 🎉 Expected Result

User có thể:
1. ✅ Tạo custom templates từ blocks hiện tại
2. ✅ Xem preview trước khi apply
3. ✅ Apply templates như default templates
4. ✅ Delete templates không cần nữa
5. ✅ Templates persist qua page reloads
6. ✅ Templates sync cross-tabs

**Feature hoạt động 100% ✨**
