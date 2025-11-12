# 🔑 Hướng Dẫn Lấy Google Gemini API Key

## ⚠️ LƯU Ý QUAN TRỌNG

Để sử dụng tính năng **AI tạo khóa học từ tài liệu nguồn**, bạn BẮT BUỘC phải có **Google Gemini API Key thật**.

---

## 📋 Các Bước Lấy API Key

### Bước 1: Truy cập Google AI Studio
Mở trình duyệt và truy cập:
```
https://aistudio.google.com/app/apikey
```

### Bước 2: Đăng nhập
- Đăng nhập bằng tài khoản Google của bạn
- Nếu chưa có tài khoản, tạo tài khoản Google miễn phí

### Bước 3: Tạo API Key
- Click nút **"Create API Key"** hoặc **"Get API Key"**
- Chọn project (hoặc tạo project mới nếu chưa có)
- Google sẽ generate API key cho bạn

### Bước 4: Copy API Key
- API key sẽ có dạng: `AIzaSy...` (39 ký tự)
- Click **Copy** để copy key
- ⚠️ **LƯU Ý**: Giữ key này BÍ MẬT, không share công khai

---

## 🔧 Cấu Hình API Key

### Nếu đang dev cho **Tazagroup**:
Mở file `.env.dev.tazagroup` và thay thế:

```bash
# TỪ
GOOGLE_GEMINI_API_KEY=YOUR_REAL_API_KEY_HERE

# THÀNH
GOOGLE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### Nếu đang dev cho **Rausach**:
Mở file `.env.dev.rausach` và thay thế tương tự.

### Production:
- Tazagroup: Cập nhật file `.env.prod.tazagroup`
- Rausach: Cập nhật file `.env.prod.rausach`

---

## 🚀 Restart Backend

Sau khi cập nhật API key, **BẮT BUỘC** phải restart backend:

```bash
# Stop backend hiện tại (Ctrl+C)

# Restart:
bun run dev:tazagroup:backend  # Cho Tazagroup
# hoặc
bun run dev:rausach:backend    # Cho Rausach
```

---

## ✅ Kiểm Tra API Key Hoạt Động

Backend sẽ log khi khởi động:
```
✅ AI Course Generator initialized with Gemini Pro
🔑 API Key: AIzaSy...xxxx
```

Nếu thấy dòng log này → API key đã được load thành công!

---

## ❓ FAQ

### Q: API key miễn phí không?
**A:** Có! Google Gemini có free tier với quota hào phóng cho testing và development.

### Q: API key có hết hạn không?
**A:** Key không hết hạn tự động, nhưng bạn có thể revoke và tạo key mới bất cứ lúc nào.

### Q: Tôi có thể dùng chung 1 key cho nhiều project không?
**A:** Được, nhưng nên tạo key riêng cho mỗi project để dễ quản lý và tracking usage.

### Q: Nếu key bị leak thì sao?
**A:** 
1. Vào https://aistudio.google.com/app/apikey
2. Delete key cũ
3. Tạo key mới
4. Cập nhật lại file .env

---

## 🔗 Tài Liệu Tham Khảo

- Google AI Studio: https://aistudio.google.com
- Gemini API Docs: https://ai.google.dev/docs
- Pricing & Quota: https://ai.google.dev/pricing

---

## 💡 Tips

- **Không** commit API key vào git
- File `.env*` đã được add vào `.gitignore`
- Dùng environment variables trong production
- Monitor usage tại Google Cloud Console

---

**Chúc bạn code vui vẻ! 🎉**
