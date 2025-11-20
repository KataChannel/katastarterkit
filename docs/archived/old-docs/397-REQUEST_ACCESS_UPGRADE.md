# YÊU CẦU QUYỀN TRUY CẬP - TÍCH HỢP CONTACT SETTINGS

## 📋 Tóm tắt

Trang `/request-access` đã được tích hợp với **CONTACT category** từ `/admin/settings/website` để lấy thông tin liên hệ động.

## 🎯 Thay đổi chính

### Thông tin từ CONTACT Settings

```typescript
// Keys sử dụng từ category CONTACT
contact.email              → Email liên hệ
contact.phone              → Số điện thoại (raw)
contact.phone_display      → Số điện thoại hiển thị (format đẹp)
contact.company_name       → Tên công ty
contact.address            → Địa chỉ công ty
```

### UI Components Updated

**1. Email Option**
- Hiển thị: `contact.email`
- Email subject tự động: "Yêu cầu quyền truy cập quản trị - [site_name]"
- Body template với user info

**2. Phone Option**
- Hiển thị: `contact.phone_display` (0865.77.0009)
- Click to call: `contact.phone` (0865770009)
- Auto remove dots & spaces

**3. Footer Info Card (MỚI)**
- Tên công ty: `contact.company_name`
- Địa chỉ: `contact.address`
- Phone & Email clickable
- Responsive layout
- Glass effect background

## 📊 Dữ liệu thực tế từ Database

```
Công ty: CTY TNHH NÔNG SẢN THỰC PHẨM TRẦN GIA
Địa chỉ: Tầng 3, An Phú Plaza, 117-119 Lý Chính Thắng P. Võ Thị Sáu, Q.3, TPHCM
Phone: 0865770009
Display: 0865.77.0009
Email: mart.rausachtrangia@gmail.com
```

## 🎨 UI Enhancements

### Footer Card
```tsx
- White background với backdrop-blur
- Border & shadow nhẹ
- Company name bold
- Address text nhỏ
- Phone & Email với icons
- Responsive: vertical mobile, horizontal desktop
- Hover effects trên links
```

## ✅ Fallback Logic

```typescript
contactEmail = settings['contact.email'] || 
               settings['contact_email'] || 
               'admin@example.com'

contactPhone = settings['contact.phone'] || 
               settings['contact_phone'] || 
               '+84 123 456 789'

companyName = settings['contact.company_name'] || 
              settings['site_name'] || 
              'Công ty'
```

## 📁 File đã cập nhật

```
frontend/src/components/admin/request-access/
  RequestAccessNotification.tsx    ✅ Tích hợp CONTACT settings
```

## 🧪 Test

### Admin có thể thay đổi

1. Vào `/admin/settings/website`
2. Tab **"Liên hệ"** (CONTACT)
3. Sửa email, phone, tên công ty, địa chỉ
4. Lưu
5. Reload `/request-access` → Thông tin cập nhật ✅

### Responsive

- Mobile: Card full width, info stack vertical
- Desktop: Info horizontal với separator

---

**Rule Applied**: Dynamic GraphQL ✅, Shadcn UI ✅, Mobile-first ✅, Tiếng Việt ✅  
**Status**: ✅ HOÀN TẤT

