# 📱 HƯỚNG DẪN SỬ DỤNG FRONTEND - TỪNG BƯỚC

**Hệ Thống:** Quản Lý Dự Án v2.0.0  
**Cập nhật:** Tháng 11, 2024  
**Trình độ:** Người dùng mới  

---

## 🚀 BỚ 1: TRUY CẬP HỆ THỐNG

### Mở Trình Duyệt
```
URL: http://localhost:3000
```

### Giao Diện Đăng Nhập
```
┌─────────────────────────┐
│   QUẢN LÝ DỰ ÁN v2.0   │
│                         │
│  Email: [___________]   │
│  Password: [________]   │
│  [Đăng nhập]           │
│  [Đăng ký]  [Quên mật] │
└─────────────────────────┘
```

---

## 🔐 BƯỚC 2: ĐĂNG NHẬP / ĐĂNG KÝ

### Đăng Nhập
1. Nhập **Email** của bạn
2. Nhập **Mật khẩu**
3. Click **"Đăng nhập"**
4. ✅ Vào Dashboard

### Đăng Ký Tài Khoản Mới
1. Click **"Đăng ký"** ở dưới
2. Nhập **Tên đầy đủ**
3. Nhập **Email**
4. Nhập **Mật khẩu** (8+ ký tự)
5. Xác nhận **Mật khẩu**
6. Click **"Tạo tài khoản"**

### OAuth (Nhanh Hơn)
- Click **"Google"** hoặc **"GitHub"**
- Chấp nhận quyền
- ✅ Hoàn thành

---

## 📊 BƯỚC 3: DASHBOARD CHÍNH

### Giao Diện Chính
```
┌────────────────────────────────────┐
│ ☰ Menu  │ Tìm kiếm...  │ User ▼    │
├────────────────────────────────────┤
│                                    │
│  DASHBOARD                         │
│                                    │
│  📊 Dashboard       👥 Teams       │
│  📁 Projects        ⚙️ Settings    │
│  ✅ Tasks           📖 Help        │
│  💬 Chat                          │
│                                    │
└────────────────────────────────────┘
```

### Các Mục Menu

| Mục | Chức năng |
|-----|----------|
| **📊 Dashboard** | Xem tổng quan, thống kê |
| **📁 Projects** | Xem/tạo dự án |
| **✅ Tasks** | Xem/quản lý công việc |
| **💬 Chat** | Trò chuyện team |
| **👥 Teams** | Quản lý thành viên |
| **⚙️ Settings** | Cài đặt tài khoản |

---

## 📁 BƯỚC 4: QUẢN LÝ DỰ ÁN

### 4.1 Xem Danh Sách Dự Án
1. Click **"📁 Projects"** ở menu trái
2. Xem tất cả dự án của bạn
3. Mỗi dự án hiển thị:
   - Tên dự án
   - Tiến độ (%)
   - Thành viên
   - Trạng thái (Active/Archived)

### 4.2 Tạo Dự Án Mới
1. Click **"+ Tạo Dự Án"** (nút xanh)
2. Nhập **Tên dự án**
3. Nhập **Mô tả** (tùy chọn)
4. Chọn **Màu** cho dự án
5. Chọn **Thành viên** (bấm "+ Thêm")
6. Click **"Tạo"**
7. ✅ Dự án được tạo

### 4.3 Vào Chi Tiết Dự Án
1. Click vào tên **dự án** bạn muốn
2. Xem tất cả công việc của dự án
3. Giao diện chi tiết:

```
┌─────────────────────────────────┐
│ ◀ Dự Án  │  📊 Analytics      │
│ Tên Dự Án│  📅 Calendar       │
│ Mô tả... │  💬 Chat           │
│          │  📁 Files          │
│          │  ⚙️ Settings       │
└─────────────────────────────────┘
```

---

## ✅ BƯỚC 5: QUẢN LÝ CÔNG VIỆC

### 5.1 Xem Công Việc
1. Trong dự án, xem danh sách công việc
2. Mỗi công việc hiển thị:
   - ✓ Tiêu đề
   - 👤 Người phụ trách
   - 📅 Hạn chót
   - 🏷️ Ưu tiên (🔴 Cao, 🟡 Trung, 🟢 Thấp)
   - 📊 Trạng thái (TODO, In Progress, Review, Done)

### 5.2 Tạo Công Việc Mới
1. Click **"+ Tạo Công Việc"**
2. Nhập **Tiêu đề** công việc
3. Nhập **Mô tả** (tùy chọn)
4. Chọn **Người phụ trách**
5. Chọn **Hạn chót**
6. Chọn **Ưu tiên** (Cao/Trung/Thấp)
7. Click **"Tạo"**

### 5.3 Cập Nhật Trạng Thái Công Việc
1. Click vào công việc để mở
2. Kéo thả từ cột này sang cột khác:
   - **TODO** → Công việc mới
   - **In Progress** → Đang làm
   - **Review** → Chờ duyệt
   - **Done** → Hoàn thành
3. ✅ Trạng thái cập nhật tự động

### 5.4 Chỉnh Sửa Công Việc
1. Click vào công việc
2. Click **"✏️ Chỉnh sửa"**
3. Thay đổi thông tin cần thiết
4. Click **"💾 Lưu"**

### 5.5 Xóa Công Việc
1. Click vào công việc
2. Click **"⋮ More"** → **"🗑️ Xóa"**
3. Xác nhận xóa
4. ✅ Công việc bị xóa

---

## 📊 BƯỚC 6: XEM ANALYTICS

### 6.1 Vào Trang Analytics
1. Trong dự án, click **"📊 Analytics"**
2. Xem 4 thẻ thống kê:
   - 💚 **Health Score** (sức khỏe dự án)
   - 📈 **Completion Rate** (tỷ lệ hoàn thành)
   - 👥 **Team Performance** (hiệu suất team)
   - ⚡ **Active Tasks** (công việc đang làm)

### 6.2 Xem Biểu Đồ
1. Chọn **tab** bạn muốn xem:
   - **Overview** - Tổng quan
   - **Velocity** - Tốc độ hoàn thành
   - **Team** - Hiệu suất từng thành viên
   - **Details** - Chi tiết công việc

2. Các biểu đồ:
   - 📈 **Line Chart** - Tốc độ theo thời gian
   - 🥧 **Pie Chart** - Phân bố trạng thái
   - 📊 **Bar Chart** - So sánh ưu tiên

---

## 📅 BƯỚC 7: SỬ DỤNG CALENDAR

### 7.1 Vào Trang Calendar
1. Trong dự án, click **"📅 Calendar"**
2. Xem lịch tháng

### 7.2 Xem Công Việc Trên Calendar
1. Những ngày có công việc có **badge** màu
2. Click vào ngày để xem chi tiết
3. Xem danh sách công việc hôm đó

### 7.3 Xuất iCal
1. Click **"📥 Xuất iCal"**
2. Tệp `.ics` được tải về
3. Nhập vào Outlook/Google Calendar

### 7.4 Thống Kê Calendar
1. Xem 4 thẻ thống kê:
   - 📌 Tổng công việc
   - ✅ Hoàn thành
   - ⏳ Đang làm
   - ⏸️ Chờ xử lý
   - 🔴 Quá hạn

---

## 💬 BƯỚC 8: SỬ DỤNG CHAT TEAM

### 8.1 Vào Chat
1. Trong dự án, click **"💬 Chat"**
2. Xem tất cả tin nhắn team

### 8.2 Gửi Tin Nhắn
1. Nhập tin nhắn ở ô input dưới
2. Click **"▶️ Gửi"** hoặc bấm **Enter**
3. ✅ Tin nhắn gửi tức thì

### 8.3 Xem Người Đang Online
1. Xem danh sách **"Đang Online"** ở phía phải
2. 🟢 = Online
3. ⚫ = Offline

### 8.4 Thao Tác Tin Nhắn
- **Hover** vào tin nhắn để hiện menu
- **✏️ Chỉnh sửa** - Sửa tin nhắn
- **❌ Xóa** - Xóa tin nhắn
- **👍 Reaction** - Thêm biểu cảm

### 8.5 Typing Indicator
- Xem **"[Tên] đang gõ..."** khi ai đó đang viết

---

## 📁 BƯỚC 9: UPLOAD FILE

### 9.1 Cách Upload
1. Vào tab **"📁 Files"** trong dự án
2. Kéo thả file vào vùng upload
3. Hoặc click để chọn từ máy

### 9.2 Upload Multipale Files
1. Chọn **5 file tối đa** một lúc
2. Xem progress bar cho mỗi file
3. ✅ Hoàn thành tự động

### 9.3 Quản Lý File
1. Xem danh sách file đã upload
2. Click để tải lại
3. Click **"🗑️"** để xóa

---

## 👥 BƯỚC 10: QUẢN LÝ TEAM

### 10.1 Xem Thành Viên
1. Click **"👥 Teams"** ở menu
2. Xem tất cả thành viên team

### 10.2 Thêm Thành Viên
1. Click **"+ Thêm Thành Viên"**
2. Nhập **Email** người cần thêm
3. Chọn **Vai trò**:
   - **Admin** - Quản lý toàn bộ
   - **Manager** - Quản lý dự án
   - **Member** - Thành viên thường
4. Click **"Mời"**
5. ✅ Thành viên nhận được email mời

### 10.3 Thay Đổi Vai Trò
1. Click vào thành viên
2. Chọn **vai trò mới**
3. ✅ Vai trò cập nhật

### 10.4 Xóa Thành Viên
1. Click vào thành viên
2. Click **"🗑️ Xóa"**
3. Xác nhận
4. ✅ Thành viên bị xóa

---

## ⚙️ BƯỚC 11: CÀI ĐẶT

### 11.1 Cài Đặt Tài Khoản
1. Click **"⚙️ Settings"** ở menu
2. Nhập **Tên đầy đủ** mới
3. Nhập **Email** mới (nếu cần)
4. Click **"💾 Lưu"**

### 11.2 Đổi Mật Khẩu
1. Click **"🔒 Đổi Mật Khẩu"**
2. Nhập **Mật khẩu hiện tại**
3. Nhập **Mật khẩu mới**
4. Xác nhận **Mật khẩu mới**
5. Click **"✅ Đổi"**

### 11.3 Avatar / Hình Đại Diện
1. Click vào ảnh avatar hiện tại
2. Chọn hình mới từ máy
3. ✅ Avatar cập nhật tức thì

### 11.4 Thông Báo
1. Bật/tắt **Thông báo Email**
2. Bật/tắt **Thông báo Desktop**
3. Chọn **Loại thông báo** cần nhận

---

## 🔍 BƯỚC 12: TÌM KIẾM & LỌC

### 12.1 Tìm Kiếm
1. Dùng ô **"Tìm kiếm..."** ở trên cùng
2. Gõ tên công việc/dự án
3. ✅ Kết quả hiện tức thì

### 12.2 Lọc Công Việc
1. Click **"🔽 Lọc"** trên danh sách
2. Chọn tiêu chí:
   - Trạng thái (TODO, In Progress, Done)
   - Ưu tiên (Cao, Trung, Thấp)
   - Người phụ trách
   - Hạn chót
3. ✅ Danh sách cập nhật

### 12.3 Sắp Xếp
1. Click **"↕️ Sắp xếp"**
2. Chọn:
   - Ngày tạo (cũ/mới)
   - Hạn chót (sắp/lâu)
   - Tên (A-Z/Z-A)
3. ✅ Danh sách sắp xếp lại

---

## 📱 BƯỚC 13: SỬ DỤNG TRÊN MOBILE

### Giao Diện Mobile
```
┌──────────────┐
│ ☰  Tìm  👤  │  ← Header
├──────────────┤
│              │
│ Dashboard    │  ← Nội dung
│ - Projects   │
│ - Tasks      │
│ - Chat       │
│              │
├──────────────┤
│ Bottom Nav   │  ← Menu dưới
│ 📊 📁 ✅ 💬 │
└──────────────┘
```

### Thao Tác Mobile
- **Swipe trái/phải** - Chuyển tabs
- **Tap** - Click đơn
- **Long press** - Bấm giữ (delete)
- **Pinch** - Phóng to/thu nhỏ

---

## 🚨 BƯỚC 14: TROUBLESHOOTING

### Không Thể Đăng Nhập
1. Kiểm tra **Email** chính xác
2. Kiểm tra **Mật khẩu**
3. Click **"Quên mật khẩu"** để reset
4. Kiểm tra email để lấy link reset

### Chat Không Hoạt Động
1. Refresh trang: **F5** hoặc **Ctrl+R**
2. Xóa cache: **Ctrl+Shift+Delete**
3. Logout rồi login lại
4. Kiểm tra kết nối internet

### File Upload Thất Bại
1. Kiểm tra **kích thước file** < 10MB
2. Kiểm tra **định dạng file** hỗ trợ
3. Kiểm tra **kết nối internet**
4. Refresh và upload lại

### Analytics Không Hiện Dữ Liệu
1. Chắc chắn có **công việc** trong dự án
2. Chắc chắn công việc có **trạng thái**
3. Refresh trang (F5)
4. Chờ 1-2 phút dữ liệu cập nhật

---

## 💡 TIPS & TRICKS

### Phím Tắt
| Phím | Chức Năng |
|------|----------|
| **Ctrl+K** | Tìm kiếm toàn cục |
| **Ctrl+//** | Xem phím tắt |
| **Escape** | Đóng dialog |
| **Enter** | Gửi tin nhắn |
| **Ctrl+Enter** | Gửi nhanh |

### Mẹo Sử Dụng
1. **Drag-Drop công việc** - Thay đổi trạng thái nhanh
2. **Double-click** - Chỉnh sửa inline
3. **Right-click** - Xem menu context
4. **Bookmark** - Lưu dự án yêu thích

### Performance
- Mở **nhiều dự án cùng lúc** → Load chậm
- **Clear cache** nếu lag (Ctrl+Shift+Delete)
- **Disable extension** nếu còn lag
- Dùng **Chrome/Edge** để tốt nhất

---

## 📞 CẦN GIÚP ĐỠ?

### Liên Hệ
- 📧 Email: support@company.com
- 💬 Chat: Dùng chat trong app
- 📖 Docs: Xem tài liệu đầy đủ

### FAQ
**Q: Có cách nào để backup dữ liệu?**
- A: Xuất iCal hoặc contact admin

**Q: Có thể chia sẻ dự án công khai không?**
- A: Hiện chỉ chia sẻ nội bộ team

**Q: Dữ liệu được lưu ở đâu?**
- A: Lưu trên server, tự động backup

---

## ✅ BƯỚC TIẾP THEO

1. ✅ Đã hiểu cách sử dụng
2. 📁 Tạo dự án đầu tiên
3. ✅ Tạo vài công việc
4. 💬 Mời thành viên vào chat
5. 📊 Xem analytics dự án
6. 🚀 Bắt đầu cộng tác!

---

**Chúc bạn sử dụng hệ thống vui vẻ! 🎉**

**Hệ Thống Quản Lý Dự Án v2.0.0**  
**Frontend User Guide - Tháng 11, 2024**
