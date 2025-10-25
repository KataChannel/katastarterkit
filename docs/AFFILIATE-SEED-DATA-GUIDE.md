# 🎯 Affiliate System - Sample Data Guide

Hướng dẫn đầy đủ về dữ liệu mẫu cho hệ thống Affiliate Marketing.

## 📋 Tổng Quan

Script seed data tạo ra một hệ sinh thái Affiliate Marketing hoàn chỉnh với:

- **10 Users**: 6 Affiliates + 4 Merchants
- **8 Campaigns**: Đa dạng trạng thái (Active, Paused, Draft)
- **~16 Affiliate Links**: Với tracking codes độc nhất
- **~2000 Clicks**: Dữ liệu analytics thực tế
- **~200 Conversions**: Các giai đoạn khác nhau (Pending, Approved, Paid)
- **Payment Requests**: Lịch sử thanh toán

## 🚀 Cách Sử Dụng

### Phương Pháp 1: Script Quản Lý (Khuyến Nghị)

```bash
# Từ thư mục root của project
./manage-affiliate-data.sh [command]
```

**Available Commands:**

```bash
# Tạo dữ liệu mẫu
./manage-affiliate-data.sh seed

# Xem thống kê
./manage-affiliate-data.sh stats

# Xóa toàn bộ dữ liệu affiliate
./manage-affiliate-data.sh clear

# Xóa và tạo lại dữ liệu mới
./manage-affiliate-data.sh reseed

# Xem hướng dẫn
./manage-affiliate-data.sh help
```

### Phương Pháp 2: Chạy Trực Tiếp Script

```bash
cd backend
bun scripts/seed-affiliate-data.ts
```

## 📊 Dữ Liệu Được Tạo

### 1. Users & Affiliate Profiles

**Affiliates (6 người):**
- Email: `affiliate1@example.com` đến `affiliate6@example.com`
- Username: `affiliate_user_1` đến `affiliate_user_6`
- Password: (cần hash trong production)
- Business Types: Blog, YouTube Channel, Social Media, Website, Email Marketing
- Payment Methods: PayPal, Bank Transfer, Momo, ZaloPay
- Status: 4 Active, 2 Inactive

**Merchants (4 người):**
- Email: `affiliate7@example.com` đến `affiliate10@example.com`
- Username: `affiliate_user_7` đến `affiliate_user_10`
- Role: Merchant (Brand owner)
- Business Type: E-commerce
- All Active

### 2. Campaigns

**8 Campaigns** với các đặc điểm:

- **Commission Types:**
  - Percentage: 5% - 30%
  - Fixed: $10 - $100
  
- **Statuses:**
  - Active: 6 campaigns (có thể tham gia)
  - Paused: 1 campaign (tạm dừng)
  - Draft: 1 campaign (chưa publish)

- **Settings:**
  - Require Approval: Random
  - Max Affiliates: 50-500
  - Date Range: Sep 2025 - Dec 2025

**Example Campaign:**
```json
{
  "name": "Innovative Mouse Campaign",
  "productName": "Ergonomic Wireless Mouse",
  "commissionRate": 15.50,
  "commissionType": "percentage",
  "status": "ACTIVE",
  "requireApproval": true,
  "maxAffiliates": 250
}
```

### 3. Campaign Applications

**~15 Applications** với distribution:
- Approved: ~50% (có thể tạo links)
- Pending: ~45% (chờ duyệt)
- Rejected: ~5% (bị từ chối)

### 4. Affiliate Links

**~16 Links** cho approved affiliates:

- **Tracking Codes**: Format `AFF-XXXXXXXX`
- **Short URLs**: `https://aff.link/AFF-XXXXXXXX`
- **UTM Parameters:**
  - utm_source: facebook, twitter, instagram, email
  - utm_medium: social, email, banner, text
  - utm_campaign: campaign-name-slug

**Example Link:**
```json
{
  "trackingCode": "AFF-A1B2C3D4",
  "originalUrl": "https://merchant.com/product",
  "shortUrl": "https://aff.link/AFF-A1B2C3D4",
  "utmSource": "facebook",
  "utmMedium": "social",
  "isActive": true
}
```

### 5. Click Data

**~2000 Clicks** với thông tin chi tiết:

- **Geographic Data**: US, UK, CA, AU, VN, DE, FR, JP
- **Device Types**: desktop, mobile, tablet
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Tracking**: IP address, User Agent, Referer, Session ID, Visitor ID

**Click Distribution:**
- 10-200 clicks per link
- Realistic time distribution (Oct 2025)

### 6. Conversions

**~200 Conversions** với conversion rate 5-15%:

- **Sale Amounts**: $20 - $500
- **Commission Calculation**: Based on campaign settings
- **Statuses:**
  - Pending: ~25% (chờ xác nhận)
  - Approved: ~50% (đã duyệt, chưa thanh toán)
  - Paid: ~25% (đã thanh toán)

**Example Conversion:**
```json
{
  "orderId": "ORD-ABC123XYZ",
  "saleAmount": 125.50,
  "commission": 19.43,
  "status": "APPROVED",
  "conversionType": "sale",
  "customerEmail": "customer@example.com"
}
```

### 7. Payment Requests

**~4 Payment Requests** cho active affiliates:

- **Statuses:**
  - Completed: ~25%
  - Processing: ~50%
  - Pending: ~25%

- **Payment Methods**: PayPal, Bank Transfer, Momo
- **Amount Range**: $50 - $500
- **Period Tracking**: Start date to End date

## 💰 Financial Summary

Dữ liệu mẫu tạo ra metrics thực tế:

```
Total Revenue:        ~$48,566 VND
Total Commission:     ~$8,262 VND
Total Paid Out:       ~$314 VND
Pending Payout:       ~$7,948 VND
```

## 🔍 Kiểm Tra Dữ Liệu

### Xem Thống Kê

```bash
./manage-affiliate-data.sh stats
```

### Query Database Trực Tiếp

```typescript
// Get all active campaigns
const campaigns = await prisma.affCampaign.findMany({
  where: { status: 'ACTIVE' },
  include: {
    creator: true,
    affiliates: true,
    _count: {
      select: { links: true, conversions: true }
    }
  }
});

// Get affiliate performance
const affiliate = await prisma.affUser.findFirst({
  where: { role: 'AFFILIATE' },
  include: {
    links: true,
    conversions: true,
    paymentRequests: true
  }
});

// Get top performing links
const topLinks = await prisma.affLink.findMany({
  orderBy: { totalEarnings: 'desc' },
  take: 10,
  include: {
    campaign: true,
    affiliate: true
  }
});
```

## 🧹 Quản Lý Dữ Liệu

### Xóa Dữ Liệu

```bash
# Interactive confirmation
./manage-affiliate-data.sh clear
```

### Reset & Reseed

```bash
# Clear old data and create fresh data
./manage-affiliate-data.sh reseed
```

## 🎨 Use Cases

### 1. Testing UI Components

Dữ liệu đa dạng để test:
- Empty states vs populated states
- Various status badges
- Pagination với nhiều records
- Charts và analytics visualization

### 2. Testing Business Logic

- Commission calculations (percentage vs fixed)
- Conversion tracking và attribution
- Payment request workflows
- Campaign approval flows

### 3. Performance Testing

- Query optimization với ~2000 clicks
- Pagination performance
- Aggregation queries
- Real-time analytics

### 4. Demo & Presentation

- Realistic data cho stakeholders
- Complete affiliate journey showcase
- Financial reporting examples

## 📈 Dữ Liệu Analytics

### Click Analytics

```typescript
// Clicks by device
const deviceStats = await prisma.affClick.groupBy({
  by: ['device'],
  _count: true
});

// Clicks by country
const geoStats = await prisma.affClick.groupBy({
  by: ['country'],
  _count: true,
  orderBy: { _count: { country: 'desc' } }
});
```

### Conversion Analytics

```typescript
// Conversion rate by campaign
const campaigns = await prisma.affCampaign.findMany({
  select: {
    name: true,
    totalClicks: true,
    totalConversions: true
  }
});

const conversionRates = campaigns.map(c => ({
  campaign: c.name,
  rate: (c.totalConversions / c.totalClicks * 100).toFixed(2)
}));
```

## 🔐 Security Notes

⚠️ **IMPORTANT**: Dữ liệu này CHỈ dùng cho development/testing!

1. **Passwords**: Sử dụng hash yếu cho demo. Production cần bcrypt proper.
2. **Emails**: Dùng `@example.com` domain.
3. **Financial Data**: Số tiền giả định, không dùng cho production.
4. **Personal Info**: Tất cả data được generate bởi Faker.js.

## 🛠️ Troubleshooting

### Lỗi: "User already exists"

```bash
# Clear existing data first
./manage-affiliate-data.sh clear
# Then seed again
./manage-affiliate-data.sh seed
```

### Lỗi: "Foreign key constraint"

Đảm bảo xóa data theo đúng thứ tự:
1. Payment Requests
2. Conversions
3. Clicks
4. Links
5. Campaign Affiliates
6. Campaigns
7. Affiliate Users

### Performance Issues

Nếu seed quá lâu:
1. Giảm số clicks per link (line 279)
2. Giảm số campaigns (line 139)
3. Check database connection pool

## 📝 Customization

### Thay Đổi Số Lượng Data

Edit `backend/scripts/seed-affiliate-data.ts`:

```typescript
// Line 51: Number of users
for (let i = 0; i < 20; i++) { // Change 10 to 20

// Line 139: Number of campaigns
for (let i = 0; i < 15; i++) { // Change 8 to 15

// Line 279: Clicks per link
const numClicks = faker.number.int({ min: 50, max: 500 }); // Increase range
```

### Thay Đổi Commission Rates

```typescript
// Line 143: Commission rate range
const commissionRate = faker.number.float({ min: 10, max: 50, fractionDigits: 2 });
```

### Thay Đổi Date Ranges

```typescript
// Line 161: Campaign dates
startDate: randomDate(new Date('2025-01-01'), new Date('2025-02-01')),
endDate: randomDate(new Date('2025-12-01'), new Date('2026-03-31')),
```

## 🎯 Next Steps

Sau khi seed data thành công:

1. **Test Frontend**: 
   - Navigate to `/admin/affiliate`
   - Check all tabs: Dashboard, Campaigns, Links, Payments

2. **Test APIs**:
   ```bash
   # GraphQL Playground
   open http://localhost:3000/graphql
   ```

3. **Test Queries**:
   - `getAffiliateCampaigns`
   - `getAffiliateLinks`
   - `getAffiliateEarningsReport`
   - `getPaymentRequests`

4. **Create Test Scenarios**:
   - Affiliate tạo link mới
   - Merchant tạo campaign mới
   - Admin approve conversions
   - Process payment requests

## 📚 Related Documentation

- [AFFILIATE-SYSTEM-COMPREHENSIVE-REPORT.md](./docs/AFFILIATE-SYSTEM-COMPREHENSIVE-REPORT.md) - Báo cáo đầy đủ hệ thống
- [AFFILIATE-EXECUTIVE-SUMMARY.md](./docs/AFFILIATE-EXECUTIVE-SUMMARY.md) - Tóm tắt cho stakeholders
- [AFFILIATE-DASHBOARD-README.md](./docs/AFFILIATE-DASHBOARD-README.md) - Visual dashboard
- [AFFILIATE-DOCUMENTATION-INDEX.md](./docs/AFFILIATE-DOCUMENTATION-INDEX.md) - Index tất cả docs

## 🤝 Contributing

Để thêm data types mới:

1. Update Prisma schema
2. Run migration: `npx prisma migrate dev`
3. Update seed script
4. Update management script
5. Update this README

## 📞 Support

Nếu gặp vấn đề:
1. Check console logs
2. Verify database connection
3. Check Prisma schema matches
4. Review error messages carefully

---

**Created with ❤️ for rausachcore Affiliate System**
