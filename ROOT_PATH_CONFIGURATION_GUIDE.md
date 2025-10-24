# 🔧 Root Path Configuration Guide

**File**: `src/config/site.config.ts`  
**Ngày tạo**: October 24, 2025  
**Mục đích**: Cấu hình tùy chỉnh root path của ứng dụng

---

## 📌 Tổng Quan

Bạn có thể cấu hình root path (`/`) để tự động chuyển hướng đến bất kỳ trang nào bạn muốn thay vì trang mặc định.

---

## 🚀 Quick Start

### Trước (Mặc định)
```
http://localhost:13000/  →  Trang Dashboard hiện tại
```

### Sau (Với cấu hình)
```
http://localhost:13000/  →  http://localhost:13000/website
```

---

## 📝 Cách Sử Dụng

### 1. Mở file cấu hình
```
frontend/src/config/site.config.ts
```

### 2. Tìm dòng `rootRedirect`
```typescript
export const siteConfig = {
  // Thay đổi giá trị này để chuyển root đến trang khác
  rootRedirect: '/website',  // ← Sửa đây
  
  // ... các cấu hình khác
};
```

### 3. Thay đổi giá trị theo nhu cầu

---

## 💡 Ví Dụ Cấu Hình

### Ví dụ 1: Root trỏ đến Website
```typescript
rootRedirect: '/website'
```
**Kết quả**: `http://localhost:13000/` → `/website`

### Ví dụ 2: Root trỏ đến Dashboard
```typescript
rootRedirect: '/admin'
```
**Kết quả**: `http://localhost:13000/` → `/admin`

### Ví dụ 3: Root trỏ đến LMS
```typescript
rootRedirect: '/lms'
```
**Kết quả**: `http://localhost:13000/` → `/lms`

### Ví dụ 4: Root trỏ đến Kế toán
```typescript
rootRedirect: '/ketoan'
```
**Kết quả**: `http://localhost:13000/` → `/ketoan`

### Ví dụ 5: Không redirect (giữ trang hiện tại)
```typescript
rootRedirect: '/'  // hoặc xóa dòng này
```
**Kết quả**: `http://localhost:13000/` → Hiển thị trang hiện tại

---

## 🔄 Cách Hoạt Động

### Flow chuyển hướng:
```
1. Người dùng truy cập: http://localhost:13000/
2. App load trang root (/)
3. Kiểm tra siteConfig.rootRedirect
4. Nếu rootRedirect !== '/', chuyển hướng tới path đó
5. Hiển thị loading screen trong khi chuyển hướng
6. Tải trang mới
```

### Code logic:
```typescript
// src/app/page.tsx
useEffect(() => {
  if (siteConfig.rootRedirect && siteConfig.rootRedirect !== '/') {
    router.push(siteConfig.rootRedirect);
  }
}, [router]);
```

---

## 🎨 Loading Screen

Khi chuyển hướng, người dùng sẽ thấy:

```
┌─────────────────────────────────┐
│                                 │
│        🔄 (Spinning)            │
│                                 │
│ Đang chuyển hướng tới /website..│
│                                 │
└─────────────────────────────────┘
```

---

## ✅ Kiểm Tra Cấu Hình

### Step 1: Cập nhật file config
```typescript
rootRedirect: '/website'
```

### Step 2: Restart dev server
```bash
npm run dev
# hoặc
bun dev
```

### Step 3: Test chuyển hướng
- Mở: `http://localhost:13000/`
- Bạn sẽ thấy loading screen
- Sau đó chuyển hướng tới `/website`

### Step 4: Kiểm tra URL
```
Trước: http://localhost:13000/
Sau:  http://localhost:13000/website
```

---

## 🎯 Các Trang Có Sẵn

```
/                  → Root (trang dashboard mặc định)
/website           → Website/Shop bán hàng
/admin             → Admin panel
/lms               → Learning Management System (Hệ thống đào tạo)
/ketoan            → Accounting (Kế toán)
/demo              → Demo page
/affiliate-access  → Affiliate system
```

---

## 🔍 Troubleshooting

### Vấn đề 1: Redirect không hoạt động
**Nguyên nhân**: Dev server chưa restart  
**Giải pháp**: Restart dev server
```bash
npm run dev
```

### Vấn đề 2: Vòng lặp chuyển hướng
**Nguyên nhân**: Cấu hình rootRedirect sai  
**Giải pháp**: Kiểm tra giá trị của rootRedirect, phải là một đường dẫn hợp lệ

### Vấn đề 3: Trang không tải
**Nguyên nhân**: Trang chỉ định không tồn tại  
**Giải pháp**: Kiểm tra đường dẫn có chính xác không

---

## 📊 Configuration Hierarchy

```
siteConfig (site.config.ts)
├── rootRedirect ..................... Root path redirect
├── name ........................... Tên ứng dụng
├── description ..................... Mô tả ứng dụng
├── navigation
│   └── main ....................... Menu chính
└── features
    ├── enableWebsite ............... Bật/tắt website
    ├── enableAdmin ................. Bật/tắt admin
    ├── enableLMS ................... Bật/tắt LMS
    └── enableKeToan ............... Bật/tắt kế toán
```

---

## 💾 File Configuration

**File**: `/frontend/src/config/site.config.ts`

```typescript
export const siteConfig = {
  // Root redirect path
  rootRedirect: '/website',
  
  // App info
  name: 'Kata Office',
  description: 'E-commerce & Business Platform',
  
  // Navigation
  navigation: {
    main: [
      { label: 'Website', href: '/website' },
      { label: 'Admin', href: '/admin' },
      { label: 'LMS', href: '/lms' },
      { label: 'Kế toán', href: '/ketoan' },
    ],
  },

  // Features
  features: {
    enableWebsite: true,
    enableAdmin: true,
    enableLMS: true,
    enableKeToan: true,
  },
};
```

---

## 🚀 Deployment

### Trước deploy, kiểm tra:
- [ ] Cập nhật `rootRedirect` với giá trị mong muốn
- [ ] Test local: `npm run dev`
- [ ] Kiểm tra chuyển hướng hoạt động
- [ ] Build: `npm run build`
- [ ] Test build: `npm run start`
- [ ] Deploy lên production

---

## 📝 Ví Dụ Đầy Đủ

### Cấu hình cho Website Shop
```typescript
// src/config/site.config.ts
export const siteConfig = {
  rootRedirect: '/website',  // Root → /website
  name: 'Kata Shop',
  description: 'E-commerce Platform',
  features: {
    enableWebsite: true,
    enableAdmin: true,
    enableLMS: false,
    enableKeToan: false,
  },
};
```

### Cấu hình cho Admin System
```typescript
export const siteConfig = {
  rootRedirect: '/admin',  // Root → /admin
  name: 'Kata Admin',
  description: 'Management System',
  features: {
    enableWebsite: false,
    enableAdmin: true,
    enableLMS: false,
    enableKeToan: false,
  },
};
```

### Cấu hình cho Learning System
```typescript
export const siteConfig = {
  rootRedirect: '/lms',  // Root → /lms
  name: 'Kata Learning',
  description: 'Learning Management System',
  features: {
    enableWebsite: false,
    enableAdmin: false,
    enableLMS: true,
    enableKeToan: false,
  },
};
```

---

## ✨ Tổng Kết

✅ **Cách cấu hình root path**:
1. Mở `src/config/site.config.ts`
2. Sửa giá trị `rootRedirect`
3. Restart dev server
4. Test chuyển hướng

✅ **Tùy chỉnh được**:
- Root redirect path
- App name & description
- Navigation menu
- Enable/disable features

✅ **Hoạt động khi**:
- Người dùng truy cập `/`
- Tự động chuyển hướng tới trang được cấu hình
- Loading screen hiển thị trong khi chuyển

---

**Hướng dẫn tạo**: October 24, 2025  
**Status**: ✅ Ready to use  
**Version**: 1.0
