# 🇻🇳 Hướng Dẫn Tùy Chỉnh Trang - Nơi Điều Chỉnh Ở Đâu?

## ❓ Câu Hỏi: "Tôi cần tùy chỉnh 1 page thì phải điều chỉnh ở đâu?"

### ✅ Câu Trả Lời Ngắn Gọn
**👉 Hãy sử dụng: PageBuilderHeader (góc trái trên)**

Đó là nơi chính để tùy chỉnh trang của bạn. Nó có tất cả những thứ bạn cần.

---

## 🎯 Hai Nơi Tùy Chỉnh (và Chúng Khác Nhau)

### 1️⃣ **PageBuilderHeader** - Tùy Chỉnh Trang (Góc Trái)
**📍 Vị trí:** Góc trái phía trên, nút "Settings" bên cạnh tiêu đề trang

**Dùng cho:** Chỉnh sửa nội dung trang (hầu hết các trường hợp)

**Bạn có thể thay đổi:**
- ✏️ Tiêu đề trang (Page Title)
- 🔗 Đường dẫn URL trang (Page Slug)
- 📊 Trạng thái trang: DRAFT → PUBLISHED → ARCHIVED
- 🏠 **Đặt làm trang chủ** (Tính năng mới)
- 🎨 Tùy chỉnh Layout (Header/Footer)
- 🔍 SEO metadata

**Ghi chú:** ✅ Hỗ trợ tiếng Việt đầy đủ

---

### 2️⃣ **EditorToolbar** - Cấu Hình Toàn Cục (Góc Phải)
**📍 Vị trí:** Góc phải phía trên, biểu tượng Settings trong thanh công cụ

**Dùng cho:** Cấu hình nâng cao, code tùy chỉnh

**Bạn có thể thay đổi:**
- 📄 Tiêu đề, Mô tả, Slug (giống PageBuilderHeader)
- 🔍 SEO nâng cao
- 🎛️ Tùy chọn nâng cao (Indexing, Authentication, Navigation)
- 💻 **Custom CSS, JavaScript, Analytics code**

**Ghi chú:** 🔤 Hiện tại là tiếng Anh (dành cho developer)

---

## 📊 So Sánh Nhanh

| Tính Năng | PageBuilderHeader (Trái) | EditorToolbar (Phải) |
|-----------|------------------------|----------------------|
| Thay đổi tiêu đề trang | ✅ | ✅ |
| Thay đổi slug/URL | ✅ | ✅ |
| Thay đổi trạng thái | ✅ **Có xác nhận** | ❌ (chỉ on/off) |
| Đặt làm trang chủ | ✅ | ❌ |
| Tùy chỉnh layout | ✅ | ❌ |
| Thêm custom CSS/JS | ❌ | ✅ |
| Tiếng Việt | ✅ | ❌ |
| Cho người dùng thường | ✅ Dễ dùng | ⚙️ Advanced |

---

## 🚀 Hướng Dẫn Từng Bước

### Bước 1: Mở Cài Đặt Trang
```
Trong PageBuilder:
┌─────────────────────────────────┐
│ [🏠 Homepage] Tiêu Đề Trang    │
│                      [⚙️ Settings]  ← Nhấn vào đây
└─────────────────────────────────┘
```

### Bước 2: Chọn Tab Phù Hợp

#### 📄 **Tab "General" - Thông Tin Cơ Bản**
```
Thay đổi:
- Tên trang (Page Title)
- Đường dẫn URL (Page Slug)
- Trạng thái: Nháp (DRAFT) → Công bố (PUBLISHED) → Lưu trữ (ARCHIVED)
- ✨ Đặt làm trang chủ (Toggle homepage)
```

**Ví dụ:**
- Title: "Trang Chủ Cửa Hàng"
- Slug: "/trang-chu"
- Status: PUBLISHED
- Homepage: ✅ BẬT (để truy cập từ http://localhost:12000)

#### 🎨 **Tab "Layout" - Thiết Kế Trang**
```
Tùy chỉnh:
- Header (phần trên)
- Footer (phần dưới)
```

#### 🔍 **Tab "SEO" - SEO Metadata**
```
Nhập:
- SEO Title (tiêu đề cho Google)
- Meta Description (mô tả cho Google)
- Keywords (từ khóa)
```

### Bước 3: Lưu Cài Đặt
Nhấn nút **"Save"** để lưu

---

## 💡 Các Tình Huống Thường Gặp

### Tình Huống 1: "Tôi muốn đặt trang này làm trang chủ"
**Giải pháp:**
1. Mở Settings (PageBuilderHeader - góc trái)
2. Vào Tab **General**
3. Bật toggle **"Homepage"** (sẽ thấy badge 🏠 cam)
4. Nhấn Save
5. ✅ Trang này sẽ truy cập được từ `http://localhost:12000`

### Tình Huống 2: "Tôi muốn thay đổi URL của trang"
**Giải pháp:**
1. Mở Settings (PageBuilderHeader - góc trái)
2. Vào Tab **General**
3. Thay đổi trường **"Page Slug"** (ví dụ: `/san-pham`)
4. Nhấn Save
5. ✅ URL trang sẽ thay đổi thành `http://localhost:12000/san-pham`

### Tình Huống 3: "Tôi muốn công bố trang này"
**Giải pháp:**
1. Mở Settings (PageBuilderHeader - góc trái)
2. Vào Tab **General**
3. Thay đổi **"Status"** từ **DRAFT** sang **PUBLISHED**
4. Sẽ có dialog xác nhận - nhấn OK
5. ✅ Trang sẽ công bố và người khác có thể nhìn thấy

### Tình Huống 4: "Tôi muốn thêm Google Analytics code"
**Giải pháp:**
1. Mở Settings (EditorToolbar - góc phải) 
2. Kéo xuống phần **"Custom Code"**
3. Dán code vào mục **"Head Code"**
4. Nhấn **"Save Settings"**
5. ✅ Analytics code sẽ được thêm vào trang

### Tình Huống 5: "Tôi muốn thêm custom CSS cho trang"
**Giải pháp:**
1. Mở Settings (EditorToolbar - góc phải)
2. Kéo xuống phần **"Custom Code"**
3. Dán CSS vào mục **"Custom CSS"** (ví dụ: `.my-class { color: red; }`)
4. Nhấn **"Save Settings"**
5. ✅ CSS tùy chỉnh sẽ được áp dụng

---

## 🎓 Bảng Chuỗi Tính Năng

### Các Tính Năng Có Sẵn Ở Đâu?

| Tính Năng | Nơi | Hướng Dẫn |
|-----------|-----|----------|
| 📝 Thay đổi tiêu đề | PageBuilderHeader > General Tab | Nhập tên mới |
| 🔗 Thay đổi URL | PageBuilderHeader > General Tab | Nhập slug mới (ví dụ: /page-name) |
| 📊 Thay đổi trạng thái | PageBuilderHeader > General Tab | Chọn DRAFT/PUBLISHED/ARCHIVED |
| 🏠 Đặt làm trang chủ | PageBuilderHeader > General Tab | Bật toggle, lưu |
| 🎨 Tùy chỉnh Header/Footer | PageBuilderHeader > Layout Tab | Cấu hình trong tab này |
| 🔍 SEO Meta Tags | PageBuilderHeader > SEO Tab | Nhập thông tin cho Google |
| 💻 Thêm CSS/JS | EditorToolbar > Custom Code | Dán code vào textarea |
| 📊 Analytics code | EditorToolbar > Custom Code > Head Code | Dán tracking code |
| ⚙️ Require Auth | EditorToolbar > Page Options | Bật toggle |
| 🔍 Allow Indexing | EditorToolbar > Page Options | Bật/tắt indexing |

---

## ❌ Có Xung Đột Không?

### Câu Trả Lời: **KHÔNG**

Hai nơi cài đặt này **KHÔNG xung đột** vì:

1. ✅ **Chúng ở hai vị trí khác nhau**
   - PageBuilderHeader (trái) - Cơ bản
   - EditorToolbar (phải) - Nâng cao

2. ✅ **Chúng cho những người khác nhau**
   - PageBuilderHeader - Người viết nội dung
   - EditorToolbar - Nhà phát triển

3. ✅ **Chúng lưu cùng dữ liệu**
   - Cả hai đều cập nhật cùng một trang
   - Dữ liệu được đồng bộ qua GraphQL

### Ví Dụ Không Xung Đột:
- Bạn thay đổi title trong PageBuilderHeader ✅
- Sau đó mở EditorToolbar, bạn sẽ thấy title mới đó ✅
- Cả hai cùng cập nhật dữ liệu của trang ✅

---

## 🎯 Kết Luận - Nên Dùng Cái Nào?

### Nếu Bạn Là:
**👤 Người viết nội dung / Content Editor**
→ **Dùng PageBuilderHeader (góc trái)**
- Dễ dùng
- Tiếng Việt
- Có tất cả những gì bạn cần

**👨‍💻 Developer / Người kỹ thuật**
→ **Có thể dùng cả hai**
- PageBuilderHeader cho cơ bản
- EditorToolbar cho advanced features (CSS, JS, code)

---

## 📚 Tài Liệu Chi Tiết

Để xem chi tiết kỹ thuật hơn, xem:
- `SETTINGS_DIALOG_CLARIFICATION.md` - Giải thích kiến trúc
- `EDITOR_TOOLBAR_VS_PAGEBUILDER_COMPARISON.md` - So sánh chi tiết

---

## 💬 TL;DR (Tóm Tắt Ngắn)

**Q: Tôi cần tùy chỉnh 1 page thì phải điều chỉnh ở đâu?**

**A: PageBuilderHeader (góc trái) - Tab "General"**

- ✏️ Tiêu đề → Nhập tên mới
- 🔗 URL → Nhập slug mới
- 📊 Trạng thái → Chọn DRAFT/PUBLISHED/ARCHIVED
- 🏠 Homepage → Bật để đặt làm trang chủ
- 🎨 Layout → Tab "Layout" để tùy chỉnh
- 🔍 SEO → Tab "SEO" cho Google

Xong! 🎉
