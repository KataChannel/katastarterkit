# 🔐 Quick Guide: Deploy Secrets to Production

## ❓ Vấn Đề

Bạn có `GOOGLE_GEMINI_API_KEY` trong file `.env` local, nhưng không muốn commit lên Git. Làm sao để production nhận được key này?

## ✅ Giải Pháp Nhanh (3 bước)

### **Bước 1: Tạo file .env.production trên server**

```bash
# SSH vào server production
ssh user@116.118.49.243

# Di chuyển vào thư mục project
cd /path/to/shoprausach

# Chạy script tạo file tự động (cách 1 - khuyên dùng)
./create-env-production.sh

# Hoặc tạo thủ công (cách 2)
cat > .env.production << 'EOF'
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E
EOF

# Set quyền bảo mật (chỉ owner đọc được)
chmod 600 .env.production
```

### **Bước 2: Deploy lên production**

```bash
# Sử dụng script tự động
./deploy-with-secrets.sh

# Hoặc deploy thủ công
docker-compose -f docker-compose.hybrid.yml down
docker-compose -f docker-compose.hybrid.yml up -d --build
```

### **Bước 3: Verify**

```bash
# Kiểm tra container có nhận được key không
docker exec shopbackend env | grep GOOGLE_GEMINI_API_KEY

# Xem log
docker logs shopbackend -f
```

---

## 📝 Chi Tiết

### **File Structure**

```
shoprausach/
├── .env                        # ❌ Có trong .gitignore (local dev)
├── .env.production             # ❌ Có trong .gitignore (server only)
├── backend/.env.example        # ✅ Template (commit được)
├── docker-compose.hybrid.yml   # ✅ Đã config sẵn (commit được)
├── create-env-production.sh    # ✅ Script tạo .env.production
└── deploy-with-secrets.sh      # ✅ Script deploy tự động
```

### **Scripts Có Sẵn**

1. **`create-env-production.sh`** - Tạo file .env.production interactive
   ```bash
   ./create-env-production.sh
   ```

2. **`deploy-with-secrets.sh`** - Deploy tự động với secrets
   ```bash
   ./deploy-with-secrets.sh
   ```

### **Docker Compose Config**

File `docker-compose.hybrid.yml` đã được config sẵn để đọc từ environment:

```yaml
shopbackend:
  env_file:
    - .env.rausach
  environment:
    # ... các biến khác
    GOOGLE_GEMINI_API_KEY: ${GOOGLE_GEMINI_API_KEY}  # ← Đọc từ .env.production
```

---

## 🔒 Security Best Practices

### ✅ **DO:**
- Tạo `.env.production` trên server (không commit)
- Set quyền `chmod 600` cho file secrets
- Dùng script `create-env-production.sh` để tạo file
- Backup `.env.production` an toàn
- Rotate API keys định kỳ

### ❌ **DON'T:**
- Commit `.env.production` vào Git
- Share file secrets qua email/chat
- Hardcode API keys trong code
- Push secrets lên GitHub/GitLab
- Để file secrets có quyền 777

---

## 🆘 Troubleshooting

### **Lỗi: File .env.production not found**

```bash
# Kiểm tra file có tồn tại không
ls -la .env.production

# Tạo lại nếu bị mất
./create-env-production.sh
```

### **Lỗi: Container không nhận được key**

```bash
# Kiểm tra biến môi trường trong container
docker exec shopbackend env | grep GOOGLE_GEMINI_API_KEY

# Nếu không có, restart container
docker-compose -f docker-compose.hybrid.yml restart shopbackend

# Xem log để debug
docker logs shopbackend -f
```

### **Lỗi: Permission denied khi tạo file**

```bash
# Kiểm tra quyền thư mục
ls -la

# Set quyền cho user hiện tại
sudo chown -R $USER:$USER .
```

---

## 📚 Tài Liệu Đầy Đủ

Xem file `DEPLOYMENT_ENV_SECRETS.md` để biết thêm chi tiết về:
- So sánh các phương pháp deploy secrets
- Cấu hình cho CI/CD
- Docker Secrets (nâng cao)
- Best practices chi tiết

---

## 🎯 Tóm Tắt

```bash
# Trên server production:
cd /path/to/shoprausach
./create-env-production.sh      # Tạo .env.production
./deploy-with-secrets.sh         # Deploy với secrets

# Verify:
docker exec shopbackend env | grep GOOGLE_GEMINI_API_KEY
```

**Chỉ cần 2 lệnh và xong! 🚀**
