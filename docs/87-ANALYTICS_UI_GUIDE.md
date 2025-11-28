# Hướng Dẫn Nhập Analytics Settings trên UI

## 📍 Vị Trí

**URL Admin:** `/admin/settings/website`

**Đường dẫn đầy đủ:** `https://rausachtrangia.com/admin/settings/website`

## 🎯 Cách Truy Cập

### Bước 1: Đăng nhập Admin
1. Truy cập: `https://rausachtrangia.com/login`
2. Đăng nhập với tài khoản Admin

### Bước 2: Vào trang Website Settings
1. Click vào menu **Admin** (sidebar hoặc top menu)
2. Chọn **Settings** → **Website Settings**
3. Hoặc truy cập trực tiếp: `/admin/settings/website`

### Bước 3: Chọn Tab Analytics
1. Tìm tab **Analytics** (icon BarChart 📊)
2. Click vào tab **Analytics**

## 📝 Các Settings Analytics Có Thể Nhập

Tab Analytics được chia thành **3 nhóm chính**:

### 1️⃣ Google Analytics & Tag Manager

**Settings:**
- ✏️ **Google Analytics ID**
  - Key: `analytics.google_analytics_id`
  - Format: `G-XXXXXXXXXX` hoặc `UA-XXXXXXXXX-X`
  - Ví dụ: `G-1234567890`
  
- 🔘 **Bật Google Analytics**
  - Key: `analytics.google_analytics_enabled`
  - Type: Toggle (ON/OFF)
  - Bật để kích hoạt tracking

- ✏️ **Google Tag Manager ID**
  - Key: `analytics.google_tag_manager_id`
  - Format: `GTM-XXXXXXX`
  - Ví dụ: `GTM-ABC1234`

- 🔘 **Bật Google Tag Manager**
  - Key: `analytics.google_tag_manager_enabled`
  - Type: Toggle (ON/OFF)

### 2️⃣ Facebook Pixel

**Settings:**
- ✏️ **Facebook Pixel ID**
  - Key: `analytics.facebook_pixel_id`
  - Format: 16 số
  - Ví dụ: `1234567890123456`

- 🔘 **Bật Facebook Pixel**
  - Key: `analytics.facebook_pixel_enabled`
  - Type: Toggle (ON/OFF)

- 🛠️ **Facebook Pixel Events** (JSON)
  - Key: `analytics.facebook_pixel_events`
  - Type: JSON
  - Cấu hình các events cần track:
  ```json
  {
    "pageView": true,
    "viewContent": true,
    "search": true,
    "addToCart": true,
    "initiateCheckout": true,
    "purchase": true,
    "lead": false,
    "completeRegistration": true
  }
  ```

### 3️⃣ TikTok Pixel

**Settings:**
- ✏️ **TikTok Pixel ID**
  - Key: `analytics.tiktok_pixel_id`
  - Format: 13 ký tự alphanumeric
  - Ví dụ: `C12ABC3DEFG4H`

- 🔘 **Bật TikTok Pixel**
  - Key: `analytics.tiktok_pixel_enabled`
  - Type: Toggle (ON/OFF)

## ⚙️ Cách Thao Tác

### Nhập Text Field
1. Click vào ô input
2. Nhập hoặc paste ID
3. Tracking code sẽ tự động validate format

### Bật/Tắt Tracking
1. Toggle switch bên cạnh mỗi platform
2. **ON** = Bật tracking (màu xanh)
3. **OFF** = Tắt tracking (màu xám)

### Lưu Thay Đổi
1. Sau khi chỉnh sửa, nút **"Lưu thay đổi"** sẽ hiện ở góc trên phải
2. Click **"Lưu thay đổi"** để apply
3. Hoặc click **"Hủy"** để reset về giá trị cũ

## 🔍 Kiểm Tra Settings

### Xem trạng thái hiện tại:
```bash
# Backend: Check database
cd backend
bun run check-analytics-settings.ts
```

### Verify tracking đã hoạt động:
1. Bật setting và lưu
2. Mở trang chủ website
3. Mở Browser DevTools → Console
4. Xem có tracking scripts được load không:
   - Google Analytics: `gtag()` function
   - Facebook Pixel: `fbq()` function
   - TikTok Pixel: `ttq()` function

## 📊 UI Features

**Mỗi setting hiển thị:**
- ✅ **Label:** Tên tiếng Việt dễ hiểu
- 📝 **Description:** Hướng dẫn và ví dụ format
- 🏷️ **Badge:** Type của setting (TEXT, BOOLEAN, JSON)
- 👁️ **Icon:** Public (Eye) hoặc Private (EyeOff)
- 💻 **Key:** Technical key (để debug)

**Visual Layout:**
```
┌─────────────────────────────────────────────┐
│ Google Analytics & Tag Manager             │
├─────────────────────────────────────────────┤
│ Google Analytics ID              [TEXT] 👁  │
│ Google Analytics Measurement ID...          │
│ [G-XXXXXXXXXX__________________]            │
│ Key: analytics.google_analytics_id          │
├─────────────────────────────────────────────┤
│ Bật Google Analytics          [BOOLEAN] 🔒  │
│ Bật/tắt Google Analytics tracking           │
│ [○──────] Tắt                              │
│ Key: analytics.google_analytics_enabled     │
└─────────────────────────────────────────────┘
```

## 🔐 Quyền Truy Cập

**Yêu cầu:**
- ✅ Đã đăng nhập
- ✅ Role: **Admin** hoặc **Super Admin**
- ❌ Analytics settings có `isPublic: false` (không public ra ngoài)

## 🚀 Workflow Hoàn Chỉnh

### Setup Google Analytics
1. Lấy Measurement ID từ Google Analytics 4
2. Vào `/admin/settings/website` → Tab **Analytics**
3. Nhập vào field **"Google Analytics ID"**
4. Bật toggle **"Bật Google Analytics"**
5. Click **"Lưu thay đổi"**
6. Refresh website để load tracking script

### Setup Facebook Pixel
1. Lấy Pixel ID từ Facebook Events Manager
2. Vào `/admin/settings/website` → Tab **Analytics**
3. Nhập vào field **"Facebook Pixel ID"**
4. Bật toggle **"Bật Facebook Pixel"**
5. (Optional) Chỉnh sửa events JSON nếu cần
6. Click **"Lưu thay đổi"**

### Setup TikTok Pixel
1. Lấy Pixel ID từ TikTok Events Manager
2. Vào `/admin/settings/website` → Tab **Analytics**
3. Nhập vào field **"TikTok Pixel ID"**
4. Bật toggle **"Bật TikTok Pixel"**
5. Click **"Lưu thay đổi"**

## 📱 Responsive Design

UI tương thích:
- ✅ Desktop (full layout)
- ✅ Tablet (optimized tabs)
- ✅ Mobile (stacked layout)

## 🎨 UI Components Used

- **Tabs:** Category navigation
- **Card:** Group containers
- **Input:** Text fields
- **Switch:** Boolean toggles
- **Button:** Save/Cancel actions
- **Badge:** Type indicators
- **Icons:** Visual cues (lucide-react)

## ⚡ Real-time Updates

- Thay đổi được lưu ngay vào database
- Frontend sẽ load settings mới khi refresh
- Analytics scripts được inject vào `<head>` tự động

## 🔗 Related Files

**Frontend:**
- `/admin/settings/website` - UI page
- `/components/analytics/AnalyticsWrapper.tsx` - Fetches settings
- `/components/analytics/AnalyticsScripts.tsx` - Renders tracking scripts

**Backend:**
- `/graphql/resolvers/website-setting.resolver.ts` - API
- `/seed/seed-website-settings.ts` - Default values

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console for errors
2. Verify settings saved: `bun run check-analytics-settings.ts`
3. Check GraphQL endpoint: `/graphql/graphql`
4. Verify admin permissions
