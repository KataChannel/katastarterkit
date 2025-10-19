# 🎨 Hệ Thống Affiliate Tiếng Việt - Khóa Đào Tạo Thẩm Mỹ

**Ngày:** 19/10/2025  
**Status:** ✅ **HOÀN TẤT**

---

## 📋 Tóm Tắt Công Việc

### ✅ Đã Hoàn Thành

1. **Chuyển toàn bộ UI sang Tiếng Việt** ✅
   - ✅ Component `CampaignBrowser.tsx`
   - ✅ Component `JoinCampaignModal.tsx`
   - ✅ Tất cả labels, buttons, messages
   - ✅ Status badges, filters, placeholders

2. **Tạo Script Seed Dữ Liệu Thẩm Mỹ** ✅
   - ✅ 12 khóa học chuyên ngành thẩm mỹ
   - ✅ Affiliates (beauty bloggers, influencers)
   - ✅ Campaigns với hoa hồng % hoặc cố định
   - ✅ Links, Clicks, Conversions, Payment Requests

---

## 🎯 Files Đã Thay Đổi

### Frontend Components (Tiếng Việt)

#### 1. `CampaignBrowser.tsx`

**Status Badges:**
```tsx
PENDING: 'Đang chờ'
APPROVED: 'Đã tham gia'
REJECTED: 'Từ chối'
```

**Header:**
```tsx
Tiêu đề: "Chiến Dịch Affiliate"
Mô tả: "Khám phá và tham gia các chiến dịch phù hợp với đối tượng của bạn"
```

**Filters:**
```tsx
Search: "Tìm kiếm chiến dịch..."
Commission Type: "Loại hoa hồng"
  - Tất cả
  - Phần trăm
  - Số tiền cố định
Status: "Trạng thái"
  - Tất cả
  - Đang hoạt động
  - Tạm dừng
  - Nháp
```

**Campaign Info:**
```tsx
Commission: "mỗi đơn"
Stats:
  - "đơn hàng" (sales)
  - "lượt click" (clicks)
  - CVR (conversion rate)
  - "d cookie" (cookie duration)
```

**Buttons:**
```tsx
"Tham gia chiến dịch"
"Đã tham gia"
"Đang chờ duyệt"
"Đơn bị từ chối"
"Không khả dụng"
```

**Empty State:**
```tsx
"Không tìm thấy chiến dịch"
"Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
```

#### 2. `JoinCampaignModal.tsx`

**Dialog Header:**
```tsx
Title: "Tham gia Chiến dịch"
Description: "Xem lại thông tin chiến dịch và gửi đơn đăng ký của bạn"
```

**Campaign Details:**
```tsx
Hoa hồng: "X% mỗi đơn" hoặc "X VND mỗi đơn"
Loại: "Công khai" hoặc "Riêng tư"
Thời gian Cookie: "X ngày"
Trạng thái: "Đang hoạt động" / "Tạm dừng" / "Nháp"
```

**Approval Notice:**
```tsx
"Chiến dịch này yêu cầu phê duyệt. Đơn đăng ký của bạn sẽ được nhà cung cấp xem xét.
Viết lời nhắn để tăng cơ hội được chấp thuận."
```

**Message Input:**
```tsx
Label: "Lời nhắn (Bắt buộc)" hoặc "(Tùy chọn)"
Placeholder: "Cho nhà cung cấp biết tại sao bạn muốn quảng bá sản phẩm của họ..."
Helper: "Bao gồm số lượng khán giả, lĩnh vực và lý do bạn phù hợp"
```

**Buttons:**
```tsx
"Hủy"
"Đang gửi..."
"Gửi đơn đăng ký" (private campaigns)
"Tham gia chiến dịch" (public campaigns)
```

---

## 🎓 Dữ Liệu Mẫu - Khóa Đào Tạo Thẩm Mỹ

### Danh Sách 12 Khóa Học

| STT | Tên Khóa Học | Thời Gian | Giá | Hoa Hồng |
|-----|--------------|-----------|-----|----------|
| 1 | Khóa Học Phun Xăm Chân Mày Cao Cấp | 30 ngày | 12-18tr | 15% / 2tr |
| 2 | Chứng Chỉ Điều Trị Da Chuyên Sâu | 45 ngày | 18-25tr | 20% / 3.5tr |
| 3 | Kỹ Thuật Nối Mi Chuyên Nghiệp | 20 ngày | 8-12tr | 18% / 1.5tr |
| 4 | Thạc Sĩ Thẩm Mỹ Quốc Tế | 180 ngày | 45-65tr | 25% / 12tr |
| 5 | Massage Body & Spa Therapy | 25 ngày | 9-14tr | 16% / 1.8tr |
| 6 | Chuyên Gia Makeup Cô Dâu | 30 ngày | 10-16tr | 17% / 2.2tr |
| 7 | Nail Art & Gel Polish Cao Cấp | 15 ngày | 6-9tr | 15% / 1.2tr |
| 8 | Phun Môi Collagen Hàn Quốc | 20 ngày | 11-16tr | 18% / 2.5tr |
| 9 | Chứng Chỉ Điều Hành Thẩm Mỹ Viện | 60 ngày | 22-30tr | 22% / 5.5tr |
| 10 | Waxing & Tẩy Lông Chuyên Nghiệp | 12 ngày | 5-8tr | 14% / 900k |
| 11 | Điều Trị Sẹo Rỗ & Thâm Mụn | 35 ngày | 16-22tr | 19% / 3.2tr |
| 12 | Tắm Trắng & Skincare Body | 18 ngày | 7.5-11tr | 16% / 1.5tr |

### Danh Mục Khóa Học

- 🎨 **PHUN_XAM_CHAN_MAY**: Phun xăm chân mày
- 💆 **DIEU_TRI_DA**: Điều trị da, skincare
- 👁️ **NOI_MI**: Nối mi chuyên nghiệp
- 🏆 **TOAN_DIEN**: Đào tạo toàn diện
- 🧖 **MASSAGE_SPA**: Massage và spa therapy
- 💄 **MAKEUP**: Makeup chuyên nghiệp
- 💅 **NAIL_ART**: Nail art và làm móng
- 👄 **PHUN_MOI**: Phun môi collagen
- 📊 **QUAN_LY**: Quản lý thẩm mỹ viện
- 🪒 **TAAY_LONG**: Waxing và tẩy lông
- 🔬 **DIEU_TRI_SECO**: Điều trị sẹo
- ✨ **TAM_TRANG**: Tắm trắng

### Affiliates Mẫu

**Email Accounts:**
```
beautyblogger01@gmail.com
makeuplover.vn@gmail.com
skincareexpert.hcm@gmail.com
beautytips.hanoi@gmail.com
glamour.beauty@gmail.com
spa.professional@gmail.com
nailartist.saigon@gmail.com
beautyinfluencer.vn@gmail.com
skincarevietnam@gmail.com
beautyguru.2024@gmail.com
```

**Roles:**
- AFFILIATE: Người quảng bá thông thường
- INFLUENCER: Beauty influencer với nhiều followers

---

## 🚀 Cách Sử Dụng

### Bước 1: Xem UI Tiếng Việt

```bash
# Start frontend & backend
./run.sh

# Truy cập
http://localhost:3001/admin/affiliate/browse
```

### Bước 2: Seed Dữ Liệu (Nếu cần)

**Lưu ý:** Script seed có vấn đề với schema hiện tại. Cần điều chỉnh theo schema thực tế.

```bash
# Cách 1: Chạy script (cần fix)
chmod +x seed-beauty-data.sh
./seed-beauty-data.sh

# Cách 2: Sử dụng seed data có sẵn
cd backend
bun run scripts/seed-affiliate-data.ts
```

### Bước 3: Xem Dữ Liệu

```bash
# Option 1: Frontend
http://localhost:3001/admin/affiliate/browse

# Option 2: Prisma Studio
cd backend
npx prisma studio
```

---

## 📊 Cấu Trúc Dữ Liệu

### Campaign Structure

```typescript
interface BeautyCampaign {
  name: string;              // "Khóa Học Phun Xăm Chân Mày..."
  description: string;       // Mô tả chi tiết khóa học
  productName: string;       // Tên sản phẩm/khóa học
  productUrl: string;        // URL landing page
  commissionType: 'PERCENTAGE' | 'FIXED';
  commissionRate?: number;   // Nếu PERCENTAGE: 15-25%
  fixedAmount?: number;      // Nếu FIXED: 1-12 triệu VND
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  cookieDuration: number;    // 12-180 ngày
}
```

### Metadata Khóa Học

```json
{
  "category": "PHUN_XAM_CHAN_MAY",
  "duration": 30,
  "price": 15000000,
  "certificate": true,
  "level": "Nâng cao",
  "language": "Tiếng Việt",
  "support": "24/7",
  "guarantee": "Học lại miễn phí nếu chưa thành thạo",
  "tools_included": true
}
```

---

## 🎨 UI Examples

### Campaign Card - Tiếng Việt

```
┌────────────────────────────────────────┐
│ Khóa Học Phun Xăm Chân Mày Cao Cấp   │
│ [Đang hoạt động] [PUBLIC] [Đã tham gia]│
│                                        │
│ Khóa học chuyên sâu về kỹ thuật...    │
│                                        │
│ 💰 15% mỗi đơn                         │
│                                        │
│ 📅 30d cookie    📈 3.50% CVR         │
│ 👥 150 đơn hàng  👁️ 4280 lượt click   │
│                                        │
│ [✓ Đã tham gia]                        │
└────────────────────────────────────────┘
```

### Join Modal - Tiếng Việt

```
┌────────────────────────────────────────┐
│   Tham gia Chiến dịch                  │
│   Xem lại thông tin...                 │
├────────────────────────────────────────┤
│                                        │
│ Khóa Học Phun Xăm Chân Mày Cao Cấp   │
│ Khóa học chuyên sâu về kỹ thuật...    │
│                                        │
│ 💰 Hoa hồng: 15% mỗi đơn              │
│ 👥 Loại: Công khai                     │
│ 📅 Thời gian Cookie: 30 ngày          │
│ ✓ Trạng thái: Đang hoạt động         │
│                                        │
│ ⚠️ Chiến dịch này yêu cầu phê duyệt   │
│                                        │
│ Lời nhắn (Bắt buộc)                    │
│ ┌────────────────────────────────┐    │
│ │ Cho nhà cung cấp biết...       │    │
│ └────────────────────────────────┘    │
│                                        │
│        [Hủy]  [Gửi đơn đăng ký]      │
└────────────────────────────────────────┘
```

---

## 🔧 Schema Fixes Needed

**Lưu ý:** Script seed cần điều chỉnh vì:

1. ❌ Schema không có `name` field trong `User`
2. ❌ Schema không có `totalClicks`, `totalEarnings` trong `AffUser`
3. ❌ Schema không có `merchantId` trong `AffCampaign` (có `creatorId`)
4. ❌ Schema không có `message` trong `AffCampaignAffiliate` (có `reason`)
5. ❌ Schema không có `uniqueCode` trong `AffLink` (có `trackingCode`)
6. ❌ Schema không có `orderValue` trong `AffConversion` (có `saleAmount`)

### Cần làm:

1. **Update seed script** để khớp với schema thực tế
2. Hoặc **update schema** để thêm các fields cần thiết
3. Chạy `prisma migrate dev` nếu có thay đổi schema

---

## ✅ Checklist Hoàn Thành

### Frontend UI
- [x] Chuyển CampaignBrowser sang tiếng Việt
- [x] Chuyển JoinCampaignModal sang tiếng Việt
- [x] Chuyển tất cả labels, buttons, messages
- [x] Chuyển status badges
- [x] Chuyển filters và placeholders
- [x] Chuyển empty states
- [x] Fix null reference errors (từ fix trước)

### Dữ Liệu Mẫu
- [x] Tạo danh sách 12 khóa học thẩm mỹ
- [x] Tạo script seed với nội dung tiếng Việt
- [x] Tạo 10 affiliate accounts (beauty bloggers)
- [ ] Fix schema compatibility issues (cần làm)
- [ ] Test script seed (cần fix schema trước)

### Documentation
- [x] Tạo tài liệu tổng hợp
- [x] Liệt kê tất cả changes
- [x] Hướng dẫn sử dụng
- [x] Danh sách khóa học và giá

---

## 🎯 Next Steps

1. **Fix Schema Issues**
   ```bash
   # Option 1: Update seed script to match current schema
   # Option 2: Update schema and migrate
   cd backend
   # Edit prisma/schema.prisma
   npx prisma migrate dev --name add_affiliate_fields
   ```

2. **Test UI**
   ```bash
   # Chạy ứng dụng
   ./run.sh
   
   # Truy cập và kiểm tra
   http://localhost:3001/admin/affiliate/browse
   ```

3. **Seed Data**
   ```bash
   # Sau khi fix schema
   cd backend
   bun run scripts/seed-beauty-training-data.ts
   ```

---

## 📞 Troubleshooting

### UI không hiện tiếng Việt?

```bash
# Clear cache và rebuild
cd frontend
rm -rf .next
npm run dev
```

### Seed script lỗi?

```bash
# Kiểm tra schema
cd backend
npx prisma validate
npx prisma format

# Fix compatibility
# Edit scripts/seed-beauty-training-data.ts
# Match với schema fields
```

### Database lỗi?

```bash
# Reset database (⚠️ CHỈ DÙNG TRÊN DEV)
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

---

**Hoàn thành bởi:** GitHub Copilot  
**Ngày:** 19/10/2025  
**Status:** 🎨 **UI TIẾNG VIỆT HOÀN TẤT - DATA SEED CẦN FIX**
