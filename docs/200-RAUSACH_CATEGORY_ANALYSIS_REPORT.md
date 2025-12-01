# 📊 BÁO CÁO PHÂN TÍCH VÀ CẬP NHẬT CẤU TRÚC DANH MỤC - RAUSACH

**Ngày:** 01/12/2025  
**Domain:** shop.rausachtrangia.com  
**Database:** rausachcore

---

## 🔍 1. TỔNG QUAN

### Website nguồn: https://rausachtrangia.com/

Website có **12 danh mục sản phẩm chính:**

| STT | Danh mục | Slug | URL |
|-----|----------|------|-----|
| 1 | CÁC LOẠI CỦ | cac-loai-cu | /san-pham/cac-loai-cu.html |
| 2 | CÁC LOẠI QUẢ | cac-loai-qua | /san-pham/cac-loai-qua.html |
| 3 | RAU LẤY BÔNG | rau-lay-bong | /san-pham/rau-lay-bong.html |
| 4 | CÁC LOẠI XÀ LÁCH | cac-loai-xa-lach | /san-pham/cac-loai-xa-lach.html |
| 5 | RAU GIA VỊ - RAU SỐNG | rau-gia-vi-rau-song | /san-pham/rau-gia-vi-rau-song.html |
| 6 | CÁC LOẠI ỚT | cac-loai-ot | /san-pham/cac-loai-ot.html |
| 7 | CÁC LOẠI RAU CẢI | cac-loai-rau-cai | /san-pham/cac-loai-rau-cai.html |
| 8 | RAU ĂN THÂN - LÁ | rau-an-than-la | /san-pham/rau-an-than-la.html |
| 9 | CÁC LOẠI NẤM | cac-loai-nam | /san-pham/cac-loai-nam.html |
| 10 | TRÁI CÂY CÁC LOẠI | trai-cay-cac-loai | /san-pham/trai-cay-cac-loai.html |
| 11 | THỰC PHẨM CHẾ BIẾN | thuc-pham-che-bien | /san-pham/thuc-pham-che-bien.html |
| 12 | ĐẶC SẢN - RAU RỪNG | dac-san-rau-rung | /san-pham/dac-san-rau-rung.html |

---

## 📁 2. TRẠNG THÁI DATABASE SAU CẬP NHẬT

### Danh mục:

| Danh mục | Số sản phẩm | Trạng thái |
|----------|-------------|------------|
| CÁC LOẠI CỦ | 80 | ✅ Active |
| CÁC LOẠI QUẢ | 72 | ✅ Active |
| RAU LẤY BÔNG | 10 | ✅ Active |
| CÁC LOẠI XÀ LÁCH | 13 | ✅ Active |
| RAU GIA VỊ - RAU SỐNG | 29 | ✅ Active |
| CÁC LOẠI ỚT | 23 | ✅ Active |
| CÁC LOẠI RAU CẢI | 15 | ✅ Active |
| RAU ĂN THÂN - LÁ | 12 | ✅ Active |
| CÁC LOẠI NẤM | 23 | ✅ Active |
| TRÁI CÂY CÁC LOẠI | 125 | ✅ Active |
| THỰC PHẨM CHẾ BIẾN | 75 | 🆕 Created |
| ĐẶC SẢN - RAU RỪNG | 12 | ✅ Active |
| **Sản Phẩm (chưa phân loại)** | **284** | ⚠️ Cần xử lý |

### Thống kê tổng:

```
Tổng sản phẩm:        773
Đã phân loại:         489 (63.3%)
Chưa phân loại:       284 (36.7%)
```

---

## 🖼️ 3. PHÂN TÍCH HÌNH ẢNH

### Hình ảnh đã crawl:

```
Tổng số hình:         200
Khớp với sản phẩm:    181 (174 ban đầu + 7 manual mapping)
Không khớp:           19
```

### Hình ảnh không khớp (còn lại):

```
- hoa-decor-hoa-an-duoc.jpg (không phải sản phẩm)
- rau-sach-baby-carrot.jpg
- rau-sach-bap-non-baby.jpg
- rau-sach-bong-atiso.jpg
- rau-sach-la-ca-ri-curry-leaf.jpg
- rau-sach-tia-to.jpg
- rau-sach-xa-lach-cai-beo.jpg
- rau-sach-ot-batri.jpg
- rau-sach-ot-do-da-lat.jpg
- rau-sach-ot-vang-da-lat.jpg
- rau-sach-cai-ngong.jpg
- rau-sach-rau-lang.jpg
- rau-sach-rau-om.jpg
- rau-sach-xa-lach-frisse.jpg
- rau-sach-xa-lach-lo-lo-tim.jpg
- rau-sach-xa-lach-lo-lo-xanh.png
- rau-sach-xa-lach-mo.jpg
- rau-sach-xa-lach-xoong-dalat.jpg
- chuoi-gia-chin.jpg
```

### Thống kê thumbnail:

```
Sản phẩm có hình:     207 (26.8%)
Sản phẩm thiếu hình:  566 (73.2%)
```

---

## 🔧 4. MAPPING HÌNH ẢNH

### Cấu trúc URL hình ảnh:

```
Base URL:    https://storage.rausachtrangia.com
Bucket:      rausach-uploads
Folder:      products/
Full URL:    https://storage.rausachtrangia.com/rausach-uploads/products/{filename}.jpg
```

### Quy tắc đặt tên file hình:

1. **Tên file** = `slugify(product_name)` + `.jpg`
2. **Slugify**: Chuyển tiếng Việt có dấu → không dấu, lowercase, replace space → `-`

**Ví dụ:**
- "RAU SẠCH - CÀ RỐT ĐÀ LẠT" → `rau-sach-ca-rot-da-lat.jpg`
- "KIM CHI CẢI THẢO" → `kim-chi-cai-thao.jpg`

### Manual mapping đặc biệt:

| Image Slug | Product Keyword |
|------------|-----------------|
| chuoi-gia-chin | chuối già |
| rau-sach-khoai-tay-dalat | khoai tây |
| rau-sach-kinh-gioi | kinh giới |
| rau-sach-cu-nghe | nghệ |
| rau-sach-ot-xanh-da-lat | ớt xanh |
| rau-sach-qua-khe | khế |
| rau-sach-radish-cu-cai-do | củ cải đỏ |
| rau-sach-hat-sen-hue | hạt sen |

---

## 📋 5. SẢN PHẨM CHƯA PHÂN LOẠI

Có **284 sản phẩm** chưa được phân loại tự động do:

1. **Tên không rõ ràng** - Không chứa từ khóa danh mục
2. **Sản phẩm đặc biệt** - Dịch vụ, phí, phụ kiện
3. **Tên tiếng Anh** - Không match từ khóa tiếng Việt

### Một số ví dụ cần xử lý thủ công:

```
- Phí tuyển dụng → KHÔNG PHẢI SẢN PHẨM
- Cá hường → CẦN TẠO DANH MỤC MỚI (Hải sản?)
- Đậu đỏ tươi → CÁC LOẠI QUẢ
- Đậu trắng → CÁC LOẠI QUẢ
- Hoa đồng tiền → CẦN TẠO DANH MỤC MỚI (Hoa?)
- Giá tươi → RAU ĂN THÂN - LÁ
- Tàu hủ ky lá tươi → THỰC PHẨM CHẾ BIẾN
- Đọt bí → RAU ĂN THÂN - LÁ
- Ngó sen → RAU ĂN THÂN - LÁ
```

---

## ⚡ 6. SCRIPTS ĐÃ TẠO

### Scripts phân tích và cập nhật:

| Script | Mục đích |
|--------|----------|
| `scripts/analyze-rausach-category-mapping.ts` | Phân tích so sánh cấu trúc website vs database |
| `scripts/update-rausach-categories.ts` | Tạo danh mục mới, phân bổ sản phẩm, cải thiện mapping |
| `scripts/upload-crawled-images-to-minio.ts` | Upload hình ảnh lên MinIO |

### Cách chạy:

```bash
cd backend

# Phân tích cấu trúc
bun run scripts/analyze-rausach-category-mapping.ts

# Cập nhật danh mục và phân bổ sản phẩm
bun run scripts/update-rausach-categories.ts

# Upload hình ảnh
bun run scripts/upload-crawled-images-to-minio.ts
```

---

## 📌 7. ĐỀ XUẤT TIẾP THEO

### Cần làm ngay:

1. **Xử lý 284 sản phẩm chưa phân loại:**
   - Tạo thêm danh mục nếu cần (Hải sản, Hoa, Dịch vụ...)
   - Bổ sung từ khóa vào script
   - Hoặc xử lý thủ công qua Admin UI

2. **Crawl thêm hình ảnh:**
   - 566 sản phẩm chưa có hình
   - Crawl từ các trang chi tiết sản phẩm

3. **Kiểm tra lại 19 hình không khớp:**
   - Tìm sản phẩm tương ứng trong DB
   - Điều chỉnh tên file hoặc tên sản phẩm

### Cải thiện dài hạn:

1. **Frontend Menu:**
   - ✅ Cập nhật hiển thị danh mục mới
   - ✅ Tạo mega menu theo cấu trúc

2. **SEO:**
   - Thêm meta title/description cho danh mục
   - Tối ưu slug sản phẩm

3. **Đồng bộ hình ảnh:**
   - Tạo cron job để sync hình từ website nguồn
   - Xử lý hình ảnh responsive/webp

---

## 📝 8. CẤU HÌNH DOMAIN

Theo file `promt/cautrucdomain.txt`:

```
Domain: shop.rausachtrangia.com
API: api.rausachtrangia.com
Storage: storage.rausachtrangia.com

MinIO Bucket: rausach-uploads
Database: rausachcore (port 12003)
Frontend Port: 12000
Backend Port: 12001
```

---

## 🎨 9. CẬP NHẬT FRONTEND MENU (ĐÃ HOÀN THÀNH)

### Components đã tạo:

#### A. CategoryDropdownMenu.tsx

**Đường dẫn:** `frontend/src/components/layout/CategoryDropdownMenu.tsx`

**Tính năng:**
- Mega menu dropdown hiển thị tất cả danh mục
- Hỗ trợ cả Desktop và Mobile variants
- Icon tự động theo tên danh mục (Leaf, Apple, Carrot...)
- Hiển thị số lượng sản phẩm mỗi danh mục
- Hover effect và animation

**Cách sử dụng:**
```tsx
// Desktop variant (trong header)
<CategoryDropdownMenu 
  variant="desktop" 
  showProductCount={true}
/>

// Mobile variant (trong sidebar menu)
<CategoryDropdownMenu 
  variant="mobile" 
  showProductCount={true}
/>

// Simple dropdown variant
<CategorySimpleDropdown />
```

#### B. Trang Danh Mục

**Đường dẫn:** `frontend/src/app/(website)/danh-muc/[slug]/page.tsx`

**URL Pattern:** `/danh-muc/{category-slug}`

**Tính năng:**
- ✅ SEO-friendly URL với slug
- ✅ Breadcrumb navigation
- ✅ Responsive design (mobile first)
- ✅ Category header với info
- ✅ Sidebar danh mục (desktop)
- ✅ Toolbar: sort, filter, view mode
- ✅ Product grid/list view
- ✅ Pagination
- ✅ Empty state khi không có sản phẩm
- ✅ Error state khi danh mục không tồn tại

**Ví dụ URLs:**
- `/danh-muc/cac-loai-cu`
- `/danh-muc/trai-cay-cac-loai`
- `/danh-muc/rau-gia-vi-rau-song`

### Tích hợp vào WebsiteHeader:

**File:** `frontend/src/components/layout/website-header.tsx`

**Thay đổi:**
1. Import `CategoryDropdownMenu` component
2. Thêm dropdown menu danh mục vào desktop navigation (vị trí đầu tiên)
3. Thêm danh sách danh mục vào mobile menu sidebar

### Cấu trúc file mới:

```
frontend/src/
├── app/(website)/
│   └── danh-muc/
│       └── [slug]/
│           └── page.tsx              # 🆕 Trang hiển thị SP theo danh mục
├── components/layout/
│   ├── CategoryDropdownMenu.tsx      # 🆕 Component dropdown menu
│   └── website-header.tsx            # ✏️ Đã tích hợp CategoryDropdownMenu
└── graphql/
    └── category.queries.ts           # GraphQL queries cho danh mục
```

---

*Report generated: 01/12/2025*
*Frontend menu integration completed*
