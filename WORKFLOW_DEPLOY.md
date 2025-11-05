# 🚀 Workflow Deploy với Secrets

## 📋 Quy Trình Hiện Tại (Đã Cập Nhật)

### **Cách Cũ (Không có secrets)**
```bash
./build-frontend.sh    # Build frontend cho 2 domains
./deploy.sh            # Deploy lên server
```

### **Cách Mới (Có secrets) - KHUYÊN DÙNG**
```bash
# Lần đầu tiên hoặc khi thay đổi secrets
./create-env-production.sh    # Tạo file .env.production (1 lần duy nhất)

# Workflow bình thường
./build-frontend.sh           # Build frontend cho 2 domains
./deploy.sh                   # Deploy lên server (TỰ ĐỘNG sync secrets)
```

---

## 🔄 Chi Tiết Quy Trình

### **Bước 1: Tạo Secrets (Chỉ lần đầu)**

```bash
./create-env-production.sh
```

Script sẽ hỏi:
- `GOOGLE_GEMINI_API_KEY` (Bắt buộc)
- `OPENAI_API_KEY` (Tùy chọn)
- `ZALO_APP_ID`, `ZALO_APP_SECRET` (Tùy chọn)
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` (Tùy chọn)

Kết quả: File `.env.production` được tạo (chmod 600)

### **Bước 2: Build Frontend**

```bash
./build-frontend.sh
```

Script sẽ:
1. Clean previous builds
2. Build cho Rausach domain → `.next-rausach/`
3. Build cho Tazagroup domain → `.next-tazagroup/`

Kết quả:
```
frontend/
├── .next-rausach/      # Build cho port 12000
├── .next-tazagroup/    # Build cho port 13000
└── .env.production     # Secrets (nếu có)
```

### **Bước 3: Deploy**

```bash
./deploy.sh
```

Script **ĐÃ ĐƯỢC CẬP NHẬT** để:
1. ✅ Kiểm tra `.env.production` có tồn tại không
2. ✅ Sync `.env.production` lên server (nếu có)
3. ✅ Set quyền 600 cho file secrets trên server
4. ✅ Load secrets vào environment trước khi start container
5. ✅ Verify secrets đã được load vào container

**Output mới:**
```bash
🔐 Found .env.production (secrets will be synced)
...
🔐 Syncing secrets (.env.production)...
  ✅ Secrets synced and secured (chmod 600)
...
🔍 Verifying secrets in containers...
  ✅ GOOGLE_GEMINI_API_KEY loaded in shopbackend
```

---

## 📊 So Sánh Workflow

### **Trước (Không có secrets)**
```bash
./build-frontend.sh
./deploy.sh
```
❌ API keys hardcoded hoặc thiếu
❌ Không bảo mật
❌ Khó quản lý nhiều môi trường

### **Sau (Có secrets)**
```bash
# Lần đầu
./create-env-production.sh    # Tạo secrets 1 lần

# Mỗi lần deploy
./build-frontend.sh           # Build (không đổi)
./deploy.sh                   # Deploy (TỰ ĐỘNG sync secrets)
```
✅ Secrets tách riêng, không commit Git
✅ Bảo mật với chmod 600
✅ Tự động sync và verify
✅ Dễ quản lý nhiều môi trường

---

## 🎯 Use Cases

### **Case 1: Deploy bình thường (không thay đổi secrets)**

```bash
# Sửa code → commit → deploy
git add .
git commit -m "Update feature X"
./build-frontend.sh
./deploy.sh    # Dùng secrets cũ trên server
```

### **Case 2: Deploy với secrets mới**

```bash
# Cập nhật secrets
./create-env-production.sh    # Nhập key mới
./build-frontend.sh
./deploy.sh                   # Sync secrets mới lên server
```

### **Case 3: Thay đổi 1 secret cụ thể**

```bash
# Edit file trực tiếp
nano .env.production
# Sửa: GOOGLE_GEMINI_API_KEY=new-key-here

./deploy.sh    # Deploy với key mới
```

### **Case 4: Deploy không có secrets (fallback)**

```bash
# Xóa .env.production local
rm .env.production

./build-frontend.sh
./deploy.sh    # ⚠️ Warning: Dùng secrets cũ trên server
```

Output:
```
⚠️  No .env.production found (will use server's existing secrets)
   To deploy with new secrets, run: ./create-env-production.sh
```

---

## 🔐 File Structure

```
shoprausach/
├── .env.production              # ❌ Secrets (local) - KHÔNG commit
├── .env.rausach                 # ✅ Config domain (commit được)
├── .env.tazagroup               # ✅ Config domain (commit được)
├── create-env-production.sh     # ✅ Script tạo secrets
├── build-frontend.sh            # ✅ Build frontend
├── deploy.sh                    # ✅ Deploy (ĐÃ CẬP NHẬT)
└── frontend/
    ├── .next-rausach/
    ├── .next-tazagroup/
    └── .env.production          # ❌ KHÔNG commit

# Trên server (116.118.49.243)
/root/shoprausach/
├── .env.production              # 🔒 Secrets (chmod 600)
├── .env.rausach
├── .env.tazagroup
└── docker-compose.hybrid.yml
```

---

## 🆘 Troubleshooting

### **Lỗi: "No .env.production found"**

```bash
# Tạo file secrets
./create-env-production.sh

# Hoặc copy từ backup
cp .env.production.backup .env.production
```

### **Lỗi: "Secrets not loaded in container"**

```bash
# SSH vào server
ssh root@116.118.49.243

# Kiểm tra file có đúng không
cat /root/shoprausach/.env.production

# Kiểm tra quyền file
ls -la /root/shoprausach/.env.production    # Phải là 600

# Restart container
cd /root/shoprausach
docker compose -f docker-compose.hybrid.yml restart shopbackend

# Verify
docker exec shopbackend env | grep GOOGLE_GEMINI_API_KEY
```

### **Lỗi: "Permission denied when syncing"**

```bash
# Kiểm tra quyền file local
ls -la .env.production

# Set quyền đúng
chmod 600 .env.production

# Deploy lại
./deploy.sh
```

---

## ✅ Checklist Trước Khi Deploy

- [ ] Code đã commit (không bao gồm .env.production)
- [ ] File `.env.production` tồn tại (hoặc server đã có)
- [ ] API keys trong `.env.production` còn hợp lệ
- [ ] Chạy `./build-frontend.sh` thành công
- [ ] Test local trước khi deploy
- [ ] Backup database trước khi deploy lớn

---

## 📝 Summary

| Bước | Lệnh | Mô tả | Tần suất |
|------|------|-------|----------|
| 1 | `./create-env-production.sh` | Tạo secrets | 1 lần hoặc khi đổi key |
| 2 | `./build-frontend.sh` | Build 2 domains | Mỗi lần deploy |
| 3 | `./deploy.sh` | Deploy + sync secrets | Mỗi lần deploy |

**Workflow ngắn gọn:**
```bash
./build-frontend.sh && ./deploy.sh
```

**Với secrets mới:**
```bash
./create-env-production.sh
./build-frontend.sh && ./deploy.sh
```

Đơn giản vậy thôi! 🚀
