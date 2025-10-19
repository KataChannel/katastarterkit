# 📘 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG AFFILIATE

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: 19 Tháng 10, 2025  
**Dành cho**: Affiliates, Merchants, Administrators

---

## 📑 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Luồng Sử Dụng Cho Affiliate](#2-luồng-sử-dụng-cho-affiliate)
3. [Luồng Sử Dụng Cho Merchant](#3-luồng-sử-dụng-cho-merchant)
4. [Luồng Sử Dụng Cho Admin](#4-luồng-sử-dụng-cho-admin)
5. [Các Tính Năng Chi Tiết](#5-các-tính-năng-chi-tiết)
6. [FAQ - Câu Hỏi Thường Gặp](#6-faq---câu-hỏi-thường-gặp)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Hệ Thống Affiliate Là Gì?

Hệ thống Affiliate Marketing là nền tảng cho phép:
- **Affiliates** (Đối tác) kiếm tiền bằng cách giới thiệu sản phẩm/dịch vụ
- **Merchants** (Nhà cung cấp) mở rộng mạng lưới bán hàng qua affiliates
- **Admins** quản lý và giám sát toàn bộ hệ thống

### 1.2. Vai Trò Trong Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    HỆ THỐNG AFFILIATE                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  AFFILIATE                MERCHANT              ADMIN   │
│  (Đối tác)                (Nhà cung cấp)       (Quản trị)│
│     │                         │                    │     │
│     ├─ Tham gia chiến dịch   ├─ Tạo chiến dịch    ├─ Duyệt│
│     ├─ Tạo link tracking     ├─ Quản lý sản phẩm  ├─ Theo dõi│
│     ├─ Chia sẻ link          ├─ Xem báo cáo       ├─ Xử lý thanh toán│
│     ├─ Theo dõi clicks       ├─ Duyệt đơn        │     │
│     └─ Nhận hoa hồng         └─ Thanh toán       └─────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 1.3. Quy Trình Hoạt Động Tổng Thể

```
BƯỚC 1: ĐĂNG KÝ & THIẾT LẬP
┌──────────────────────────────────────┐
│ User đăng ký → Tạo Affiliate Profile │
│ Điền thông tin → Chọn phương thức TT  │
└──────────────────────────────────────┘
              ↓
BƯỚC 2: TÌM KIẾM CHIẾN DỊCH
┌──────────────────────────────────────┐
│ Browse Campaigns → Chọn campaign phù hợp│
│ Xem chi tiết → Gửi đơn tham gia       │
└──────────────────────────────────────┘
              ↓
BƯỚC 3: ĐƯỢC DUYỆT
┌──────────────────────────────────────┐
│ Admin/Merchant duyệt đơn              │
│ Nhận thông báo → Được phép tạo link   │
└──────────────────────────────────────┘
              ↓
BƯỚC 4: TẠO LINK & CHIA SẺ
┌──────────────────────────────────────┐
│ Tạo affiliate link → Copy link        │
│ Chia sẻ trên mạng xã hội/website      │
└──────────────────────────────────────┘
              ↓
BƯỚC 5: TRACKING & CONVERSION
┌──────────────────────────────────────┐
│ Người dùng click link                 │
│ Mua hàng → Hệ thống ghi nhận conversion│
└──────────────────────────────────────┘
              ↓
BƯỚC 6: NHẬN HOA HỒNG
┌──────────────────────────────────────┐
│ Conversion được duyệt                 │
│ Yêu cầu thanh toán → Nhận tiền        │
└──────────────────────────────────────┘
```

---

## 2. LUỒNG SỬ DỤNG CHO AFFILIATE

### 2.1. Đăng Ký Tài Khoản Affiliate

**Bước 1: Truy cập trang đăng ký**
```
URL: /admin/affiliate
```

**Bước 2: Điền thông tin**
- Tên doanh nghiệp (nếu có)
- Email nhận thanh toán
- Website (nếu có)
- Mã số thuế (nếu có)

**Bước 3: Chọn phương thức thanh toán**

```typescript
Phương thức thanh toán:
├─ PayPal
│  └─ Cần: Email PayPal
├─ Chuyển khoản ngân hàng
│  └─ Cần: Số tài khoản, Tên ngân hàng, Routing number
└─ Crypto
   └─ Cần: Loại crypto (BTC/ETH/USDT), Địa chỉ ví
```

**Kết quả**: Profile affiliate được tạo, trạng thái PENDING

---

### 2.2. Tìm Kiếm & Tham Gia Chiến Dịch

**Bước 1: Truy cập trang Browse Campaigns**
```
URL: /admin/affiliate/browse
```

**Bước 2: Tìm kiếm campaign phù hợp**

Filters có sẵn:
- Tìm theo từ khóa
- Lọc theo danh mục
- Lọc theo commission rate
- Lọc theo trạng thái

**Bước 3: Xem chi tiết campaign**

Thông tin quan trọng:
```
✓ Tên chiến dịch
✓ Mô tả sản phẩm/dịch vụ
✓ Commission type (%, Fixed, Tiered)
✓ Commission rate (ví dụ: 10%, $50)
✓ Cookie duration (ví dụ: 30 ngày)
✓ Điều khoản & điều kiện
```

**Bước 4: Gửi đơn tham gia**

Click nút **"Tham Gia Campaign"** → Điền lý do tham gia → Gửi

**Trạng thái đơn:**
```
PENDING → Chờ duyệt
APPROVED → Đã duyệt (có thể tạo link)
REJECTED → Bị từ chối (xem lý do)
```

---

### 2.3. Tạo Affiliate Link

**Bước 1: Truy cập Link Management**
```
URL: /admin/affiliate/links
```

**Bước 2: Click "Tạo Link Mới"**

**Bước 3: Cấu hình link**

Form tạo link:
```typescript
{
  campaign: "Chọn campaign đã được duyệt",
  title: "Tên link (tùy chọn)",
  description: "Mô tả (tùy chọn)",
  customAlias: "my-custom-link (tùy chọn)",
  
  // UTM Parameters (tùy chọn)
  utmSource: "facebook",
  utmMedium: "social",
  utmCampaign: "summer-sale"
}
```

**Bước 4: Nhận link tracking**

Hệ thống tạo:
```
✓ Tracking Code: abc123def456 (unique)
✓ Short URL: https://kata.vn/go/abc123def456
✓ Full URL với UTM: https://kata.vn/go/abc123def456?utm_source=facebook&...
```

**Bước 5: Copy & chia sẻ link**

Click icon **Copy** → Paste vào:
- Facebook post
- Instagram bio
- Blog article
- Email newsletter
- YouTube description

---

### 2.4. Theo Dõi Hiệu Suất

**Dashboard Overview** (`/admin/affiliate/dashboard`)

Stats Cards hiển thị:
```
┌─────────────────────────────────────────────────┐
│  Tổng Thu Nhập    │  Tổng Clicks  │  Conversions│
│    $1,234.56      │      5,678    │      123    │
└─────────────────────────────────────────────────┘
│  Conversion Rate  │  Avg Order    │  Pending    │
│      2.17%        │    $89.45     │    $456.78  │
└─────────────────────────────────────────────────┘
```

**Link Performance** (`/admin/affiliate/links`)

Mỗi link hiển thị:
```
┌──────────────────────────────────────────┐
│ Link: https://kata.vn/go/abc123          │
├──────────────────────────────────────────┤
│ Clicks: 234                              │
│ Conversions: 12                          │
│ Revenue: $1,080.00                       │
│ Commission: $108.00 (10%)                │
│ Conversion Rate: 5.13%                   │
└──────────────────────────────────────────┘
```

**Earnings Report** (`/admin/affiliate/payments`)

```
Tổng Thu Nhập:           $5,432.10
├─ Pending:             $1,234.56  (chờ duyệt)
├─ Approved:            $3,197.54  (đã duyệt)
└─ Paid:                $1,000.00  (đã thanh toán)

Có thể rút:             $3,197.54
```

---

### 2.5. Yêu Cầu Thanh Toán

**Bước 1: Kiểm tra số dư có thể rút**
```
URL: /admin/affiliate/payments
Xem: "Có thể rút" (Available for Withdrawal)
```

**Bước 2: Click "Yêu cầu Thanh Toán"**

**Bước 3: Chọn phương thức thanh toán**

```typescript
// PayPal
{
  paymentMethod: "PAYPAL",
  accountDetails: { email: "myemail@paypal.com" }
}

// Bank Transfer
{
  paymentMethod: "BANK_TRANSFER",
  accountDetails: {
    accountName: "Nguyễn Văn A",
    accountNumber: "123456789",
    bankName: "Vietcombank",
    routingNumber: "970436"
  }
}

// Crypto
{
  paymentMethod: "CRYPTO",
  accountDetails: {
    cryptoType: "USDT",
    walletAddress: "0x1234567890abcdef..."
  }
}
```

**Bước 4: Xác nhận**

Hệ thống tự động:
- Tính số tiền dựa trên period (30 ngày gần nhất)
- Tạo payment request với status PENDING
- Gửi thông báo cho admin

**Bước 5: Theo dõi trạng thái**

```
PENDING     → Chờ xử lý
PROCESSING  → Đang xử lý
COMPLETED   → Đã thanh toán ✓
REJECTED    → Bị từ chối (xem lý do)
```

---

### 2.6. Best Practices Cho Affiliates

#### ✅ Tạo Link Hiệu Quả

```
1. Sử dụng UTM parameters để track nguồn
   utm_source=facebook, utm_medium=post
   
2. Tạo custom alias dễ nhớ
   /go/summer-sale thay vì /go/abc123def
   
3. Thêm title & description để dễ quản lý
   
4. Test link trước khi chia sẻ
```

#### ✅ Tăng Conversion Rate

```
1. Chọn campaign phù hợp với audience
2. Viết content hấp dẫn
3. Thêm call-to-action rõ ràng
4. Chia sẻ đúng thời điểm
5. A/B test các cách tiếp cận
```

#### ✅ Quản Lý Hiệu Quả

```
1. Kiểm tra dashboard hàng ngày
2. Phân tích link nào perform tốt
3. Tắt link không hiệu quả
4. Tập trung vào top performers
5. Yêu cầu thanh toán đều đặn
```

---

## 3. LUỒNG SỬ DỤNG CHO MERCHANT

### 3.1. Tạo Chiến Dịch Mới

**Bước 1: Truy cập Campaign Management**
```
URL: /admin/affiliate/campaigns
```

**Bước 2: Click "Tạo Campaign Mới"**

**Bước 3: Điền thông tin campaign**

```typescript
{
  // Thông tin cơ bản
  name: "Summer Sale 2025",
  description: "Khuyến mãi mùa hè với giảm giá lên đến 50%",
  productName: "Khóa Học Thẩm Mỹ Professional",
  productUrl: "https://shop.kata.vn/courses/tham-my-pro",
  productImage: "https://cdn.kata.vn/images/course.jpg",
  
  // Commission settings
  commissionType: "PERCENTAGE", // hoặc "FIXED", "TIERED"
  commissionRate: 15, // 15%
  // Hoặc nếu FIXED:
  fixedAmount: 500000, // 500,000 VND
  
  // Campaign settings
  status: "DRAFT", // DRAFT → ACTIVE khi sẵn sàng
  cookieDuration: 30, // 30 ngày
  requireApproval: true, // Cần duyệt affiliate
  
  // Giới hạn (tùy chọn)
  minPayoutAmount: 100000, // 100k VND
  maxPayoutAmount: 5000000, // 5M VND
  maxAffiliates: 100, // Tối đa 100 affiliates
  
  // Thời gian (tùy chọn)
  startDate: "2025-06-01",
  endDate: "2025-08-31",
  
  // Targeting
  categories: ["Đào Tạo", "Thẩm Mỹ"],
  targetCountries: ["VN", "US"],
}
```

**Bước 4: Lưu draft hoặc Publish**

```
Save as Draft → Chỉnh sửa sau
Publish → Campaign ACTIVE ngay
```

---

### 3.2. Quản Lý Campaign

**Chỉnh sửa campaign**
```
Dashboard → Campaigns → Click Edit
→ Cập nhật thông tin → Save
```

**Thay đổi trạng thái**
```
DRAFT   → Đang soạn, chưa public
ACTIVE  → Đang chạy, affiliates có thể join
PAUSED  → Tạm dừng, không nhận đơn mới
COMPLETED → Đã kết thúc
```

**Xem analytics**
```
┌──────────────────────────────────────┐
│ Campaign: Summer Sale 2025           │
├──────────────────────────────────────┤
│ Total Affiliates: 45                 │
│ Total Clicks: 12,345                 │
│ Total Conversions: 234               │
│ Conversion Rate: 1.9%                │
│ Total Revenue: $20,930.00            │
│ Total Commission: $3,139.50          │
└──────────────────────────────────────┘
```

---

### 3.3. Duyệt Đơn Tham Gia

**Bước 1: Xem danh sách đơn**
```
URL: /admin/affiliate/campaigns/[id]/applications
```

**Bước 2: Review thông tin affiliate**

Xem:
- Tên affiliate / Doanh nghiệp
- Website
- Lý do tham gia
- Thống kê (nếu có)

**Bước 3: Approve hoặc Reject**

```typescript
// Approve
→ Click "Duyệt"
→ Affiliate nhận thông báo
→ Có thể tạo link ngay

// Reject
→ Click "Từ chối"
→ Nhập lý do: "Không phù hợp với target audience"
→ Affiliate nhận thông báo với lý do
```

---

### 3.4. Theo Dõi Performance

**Campaign Performance**

```
┌─────────────────────────────────────────────┐
│ Top Performing Affiliates                    │
├─────────────────────────────────────────────┤
│ 1. Affiliate A - 45 conversions - $4,050    │
│ 2. Affiliate B - 38 conversions - $3,420    │
│ 3. Affiliate C - 29 conversions - $2,610    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Traffic Sources (UTM)                        │
├─────────────────────────────────────────────┤
│ Facebook:  45%   (5,555 clicks)             │
│ Instagram: 30%   (3,704 clicks)             │
│ YouTube:   15%   (1,852 clicks)             │
│ Blog:      10%   (1,234 clicks)             │
└─────────────────────────────────────────────┘
```

---

## 4. LUỒNG SỬ DỤNG CHO ADMIN

### 4.1. Dashboard Tổng Quan

```
URL: /admin/affiliate/dashboard
```

**System-wide Metrics**
```
┌──────────────────────────────────────────┐
│ Total Affiliates:        1,234           │
│ Active Campaigns:        45              │
│ Total Clicks (Month):    123,456         │
│ Total Conversions:       2,345           │
│ Total Revenue:           $234,567.89     │
│ Total Commission Paid:   $23,456.78      │
│ Pending Payments:        $5,678.90       │
└──────────────────────────────────────────┘
```

---

### 4.2. Duyệt Conversions

**Bước 1: Xem danh sách conversions**
```
Filter: Status = PENDING
```

**Bước 2: Verify conversion**

Kiểm tra:
- Order ID có tồn tại?
- Order amount đúng?
- Affiliate link hợp lệ?
- Không có fraud?

**Bước 3: Approve hoặc Reject**

```typescript
// Approve
→ Commission được tính vào earnings
→ Affiliate nhận thông báo

// Reject
→ Nhập lý do: "Order đã refund"
→ Commission không tính
```

---

### 4.3. Xử Lý Thanh Toán

**Bước 1: Xem payment requests**
```
URL: /admin/affiliate/payments
Filter: Status = PENDING
```

**Bước 2: Verify request**

Kiểm tra:
- Số tiền đúng?
- Account details đúng?
- Đủ điều kiện rút?

**Bước 3: Process payment**

```typescript
// Thực hiện thanh toán qua:
- PayPal API
- Bank transfer
- Crypto wallet

// Sau khi chuyển tiền:
→ Update status = COMPLETED
→ Nhập transaction ID
→ Affiliate nhận thông báo
```

---

### 4.4. Quản Lý Hệ Thống

**Monitor Health**
```
- Check error logs
- Review performance metrics
- Monitor fraud attempts
- Verify data integrity
```

**Generate Reports**
```
- Monthly commission reports
- Top affiliates report
- Campaign performance
- Revenue by category
```

---

## 5. CÁC TÍNH NĂNG CHI TIẾT

### 5.1. Commission Types

#### 5.1.1. Percentage Commission
```
Order Amount: $100
Commission Rate: 15%
→ Commission = $100 × 15% = $15
```

#### 5.1.2. Fixed Commission
```
Order Amount: $50 hoặc $500
Fixed Amount: $10
→ Commission = $10 (cố định)
```

#### 5.1.3. Tiered Commission
```
Tier 1: 0-10 sales   → 10%
Tier 2: 11-50 sales  → 15%
Tier 3: 51+ sales    → 20%

Example: Affiliate có 25 sales
→ 10 sales đầu: 10%
→ 15 sales tiếp: 15%
```

---

### 5.2. Tracking Mechanism

#### 5.2.1. Click Tracking

**Khi user click affiliate link:**

```typescript
1. Extract tracking code từ URL
2. Lookup affiliate link trong DB
3. Record click với metadata:
   {
     linkId: "link_123",
     ipAddress: "123.45.67.89",
     userAgent: "Mozilla/5.0...",
     browser: "Chrome",
     device: "Desktop",
     os: "Windows",
     country: "VN",
     city: "Ho Chi Minh",
     referrer: "facebook.com",
     clickedAt: "2025-10-19T10:30:00Z"
   }
4. Set cookie với tracking code (30 days)
5. Redirect user đến product URL
```

#### 5.2.2. Conversion Tracking

**Khi user mua hàng:**

```typescript
1. Order service call affiliate webhook
2. Read tracking cookie từ browser
3. Lookup affiliate link
4. Calculate commission:
   amount = order.total
   rate = campaign.commissionRate
   commission = amount × rate
5. Create conversion record:
   {
     linkId,
     orderId,
     orderAmount,
     commissionAmount,
     status: "PENDING"
   }
6. Update affiliate earnings
```

---

### 5.3. Payment Methods

#### 5.3.1. PayPal
```json
{
  "paymentMethod": "PAYPAL",
  "accountDetails": {
    "email": "affiliate@paypal.com"
  }
}
```

#### 5.3.2. Bank Transfer
```json
{
  "paymentMethod": "BANK_TRANSFER",
  "accountDetails": {
    "accountName": "Nguyễn Văn A",
    "accountNumber": "123456789",
    "bankName": "Vietcombank",
    "routingNumber": "970436",
    "swiftCode": "BFTVVNVX"
  }
}
```

#### 5.3.3. Cryptocurrency
```json
{
  "paymentMethod": "CRYPTO",
  "accountDetails": {
    "cryptoType": "USDT",
    "network": "TRC20",
    "walletAddress": "TXyz123..."
  }
}
```

---

### 5.4. UTM Parameters

**Purpose**: Track marketing sources

```
?utm_source=facebook
&utm_medium=social
&utm_campaign=summer-sale
&utm_content=video-ad
&utm_term=beauty-course
```

**Analytics cho phép:**
- Biết traffic từ đâu?
- Channel nào hiệu quả nhất?
- Content nào convert tốt?

---

## 6. FAQ - CÂU HỎI THƯỜNG GẶP

### 6.1. Cho Affiliates

**Q: Tôi cần gì để bắt đầu?**
```
A: 
1. Tài khoản đã đăng ký
2. Tạo affiliate profile
3. Tham gia campaign được duyệt
4. Tạo link và chia sẻ
```

**Q: Khi nào tôi nhận được tiền?**
```
A:
- Conversions cần được approve (2-7 ngày)
- Bạn tạo payment request
- Admin xử lý (1-3 ngày làm việc)
- Tiền về tài khoản (1-5 ngày tùy phương thức)
```

**Q: Tại sao conversion của tôi bị reject?**
```
A: Lý do phổ biến:
- Order bị refund/cancel
- Fraud detection
- Không đủ điều kiện campaign
- Click tracking không hợp lệ
```

**Q: Cookie duration là gì?**
```
A: Thời gian hệ thống nhớ click của user
- Cookie 30 ngày → User mua trong 30 ngày vẫn tính conversion
- Sau 30 ngày → Không còn liên kết với affiliate
```

**Q: Làm sao tăng conversion rate?**
```
A:
1. Chọn campaign phù hợp audience
2. Viết review chất lượng
3. Thêm call-to-action rõ ràng
4. Chia sẻ đúng thời điểm
5. Build trust với audience
6. A/B test các approach
```

---

### 6.2. Cho Merchants

**Q: Chi phí tạo campaign là bao nhiêu?**
```
A: Miễn phí tạo campaign
   Chỉ trả commission khi có conversion thực tế
```

**Q: Làm sao kiểm soát chất lượng affiliates?**
```
A:
1. Bật requireApproval = true
2. Review từng đơn tham gia
3. Check website/social của affiliate
4. Monitor performance và fraud
5. Pause/remove affiliates kém
```

**Q: Có thể thay đổi commission rate sau khi publish?**
```
A: Có, nhưng khuyến nghị:
- Thông báo trước cho affiliates
- Chỉ áp dụng cho conversion mới
- Cân nhắc tác động đến campaign
```

---

### 6.3. Technical

**Q: Hệ thống track conversion như thế nào?**
```
A: 
1. Cookie-based tracking (30-90 days)
2. Order webhook integration
3. Attribution logic (last-click)
4. Commission calculation
5. Multi-stage approval
```

**Q: Có hỗ trợ multiple currency?**
```
A: Hiện tại hỗ trợ VND và USD
   Có thể config thêm currency khác
```

**Q: Có API để integrate?**
```
A: Có GraphQL API với 19 operations
   Docs: /graphql
```

---

## 📞 HỖ TRỢ

### Liên Hệ
- **Email**: support@kata.vn
- **Hotline**: 1900-xxxx
- **Live Chat**: Trên website

### Tài Liệu
- **API Docs**: `/docs/AFFILIATE-*.md`
- **GraphQL Schema**: `/backend/src/schema.gql`
- **Video Tutorials**: Coming soon

### Cộng Đồng
- **Facebook Group**: Kata Affiliates
- **Telegram**: @kata_affiliates
- **Discord**: Coming soon

---

**Cập nhật lần cuối**: 19 Tháng 10, 2025  
**Phiên bản**: 1.0.0  
**Copyright**: © 2025 KataCore. All rights reserved.
