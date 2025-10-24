# ⚡ Root Path Configuration - Quick Reference

**Vị trí**: `frontend/src/config/site.config.ts`  
**Mục đích**: Cấu hình root path `/` redirect tới trang nào

---

## 🎯 Mục Đích

Thay vì `/` trỏ tới trang dashboard mặc định, bạn có thể cấu hình nó trỏ đến:
- `/website` - Trang website/shop
- `/admin` - Trang admin
- `/lms` - Trang học online
- `/ketoan` - Trang kế toán
- Hoặc bất kỳ trang nào bạn muốn

---

## 🚀 Sử Dụng

### Bước 1: Mở file
```
frontend/src/config/site.config.ts
```

### Bước 2: Sửa giá trị
```typescript
export const siteConfig = {
  rootRedirect: '/website',  // ← Sửa dòng này
  // ...
};
```

### Bước 3: Restart server
```bash
npm run dev
# hoặc
bun dev
```

### Bước 4: Test
- Truy cập: `http://localhost:13000/`
- Sẽ chuyển hướng tới: `http://localhost:13000/website`

---

## 📋 Các Giá Trị Khả Dụng

| Giá trị | Kết quả | Mô tả |
|---------|---------|-------|
| `'/website'` | Root → `/website` | Trang website/shop |
| `'/admin'` | Root → `/admin` | Trang quản trị |
| `'/lms'` | Root → `/lms` | Hệ thống đào tạo |
| `'/ketoan'` | Root → `/ketoan` | Trang kế toán |
| `'/'` | Giữ trang hiện tại | Không redirect |

---

## 💡 Ví Dụ

### Ví dụ 1: Để root trỏ tới Website
```typescript
rootRedirect: '/website'
```

### Ví dụ 2: Để root trỏ tới Admin
```typescript
rootRedirect: '/admin'
```

### Ví dụ 3: Để root trỏ tới LMS
```typescript
rootRedirect: '/lms'
```

---

## 🔍 Troubleshooting

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-----------|----------|
| Redirect không hoạt động | Server chưa restart | Restart dev server |
| Vòng lặp redirect | Config sai | Kiểm tra giá trị |
| 404 Not Found | Trang không tồn tại | Kiểm tra path tồn tại |

---

## 📁 File Structure

```
frontend/
└── src/
    └── config/
        └── site.config.ts ← Sửa file này
```

---

**Cập nhật**: October 24, 2025  
**Status**: ✅ Ready
