# Hướng dẫn cấu hình Google Analytics Data API

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật "Google Analytics Data API":
   - Vào **APIs & Services** > **Library**
   - Tìm "Google Analytics Data API"
   - Nhấn **Enable**

## Bước 2: Tạo Service Account

1. Vào **APIs & Services** > **Credentials**
2. Nhấn **Create Credentials** > **Service Account**
3. Điền thông tin:
   - Service account name: `analytics-reader`
   - Service account ID: sẽ tự động tạo
4. Nhấn **Create and Continue**
5. Bỏ qua các bước còn lại, nhấn **Done**

## Bước 3: Tạo và tải JSON Key

1. Click vào service account vừa tạo
2. Chuyển tab **Keys**
3. Nhấn **Add Key** > **Create new key**
4. Chọn **JSON** > **Create**
5. File JSON sẽ được tải về

## Bước 4: Cấp quyền truy cập Google Analytics

1. Truy cập [Google Analytics](https://analytics.google.com/)
2. Vào **Admin** (biểu tượng bánh răng)
3. Trong cột **Property**, chọn **Property Access Management**
4. Nhấn **+** > **Add users**
5. Nhập email của service account (có dạng: `xxx@project-id.iam.gserviceaccount.com`)
6. Chọn role: **Viewer** (chỉ cần đọc)
7. Nhấn **Add**

## Bước 5: Lấy GA4 Property ID

1. Trong Google Analytics, vào **Admin**
2. Trong cột **Property**, xem **Property Settings**
3. Copy **Property ID** (dạng số: `123456789`)

## Bước 6: Cấu hình Environment Variables

Thêm vào file `.env`:

```env
# Google Analytics Data API
# Property ID của GA4 (lấy từ Admin > Property Settings)
GA4_PROPERTY_ID=123456789

# Cách 1: Sử dụng file credentials (cho development)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Cách 2: Sử dụng JSON string (cho production/Docker)
# Copy toàn bộ nội dung file JSON, escape và đặt trong dấu ngoặc
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

## Ví dụ Environment Variables

```env
# Google Analytics cho rausach
GA4_PROPERTY_ID=427529687
# Nếu dùng file:
GOOGLE_APPLICATION_CREDENTIALS=/opt/rausach/ga-credentials.json
# Hoặc nếu dùng JSON string (escape đúng format):
# GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
```

## Kiểm tra cấu hình

Sau khi cấu hình xong, có thể test bằng GraphQL query:

```graphql
query {
  visitorStats {
    realtime
    today
    thisMonth
    total
  }
  isAnalyticsConfigured
}
```

## Lưu ý

1. **Nếu chưa cấu hình**: Hệ thống sẽ trả về dữ liệu mẫu (mock data)
2. **Cache**: 
   - Realtime: cache 30 giây
   - Hôm nay: cache 5 phút
   - Tháng này: cache 1 giờ
   - Tổng: cache 24 giờ
3. **Quota**: Google Analytics Data API có giới hạn quota miễn phí, nhưng với cache thì không bị vượt
