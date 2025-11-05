# Hướng Dẫn Deploy Environment Variables & Secrets

## 🔐 Vấn Đề: Secrets không được commit lên Git

Các biến môi trường nhạy cảm như API keys, passwords không nên commit lên Git vì:
- Lộ thông tin bảo mật
- Ai có access repo đều thấy được
- Không thể thay đổi dễ dàng khi bị lộ

## ✅ Giải Pháp: 3 Cách Deploy Secrets

### **Cách 1: Environment Variable trên Server (Khuyên dùng)**

Trên server production, set biến môi trường trước khi chạy docker-compose:

```bash
# SSH vào server
ssh user@116.118.49.243

# Export biến môi trường
export GOOGLE_GEMINI_API_KEY="AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E"

# Deploy với docker-compose (biến sẽ được inject vào container)
docker-compose -f docker-compose.hybrid.yml up -d

# Hoặc set vĩnh viễn trong ~/.bashrc
echo 'export GOOGLE_GEMINI_API_KEY="AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E"' >> ~/.bashrc
source ~/.bashrc
```

**Ưu điểm:**
- Không cần file .env trên server
- Dễ dàng thay đổi mà không cần rebuild
- Bảo mật cao (chỉ admin server mới thấy)

---

### **Cách 2: File .env.production trên Server**

Tạo file `.env.production` trên server (không commit vào Git):

```bash
# SSH vào server
ssh user@116.118.49.243
cd /path/to/shoprausach

# Tạo file .env.production
cat > .env.production << 'EOF'
# Production Secrets - DO NOT COMMIT
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E
OPENAI_API_KEY=sk-your-openai-key
INVOICE_BEARER_TOKEN=eyJhbGc...
EOF

# Set quyền chỉ owner đọc được
chmod 600 .env.production
```

**Cập nhật docker-compose để load file này:**

```yaml
shopbackend:
  env_file:
    - .env.rausach
    - .env.production  # ← Thêm dòng này
  environment:
    # ... các biến khác
```

**Ưu điểm:**
- Tập trung tất cả secrets vào 1 file
- Dễ quản lý và backup
- Có thể load nhiều file .env

---

### **Cách 3: Hardcode trong docker-compose.hybrid.yml (Đã áp dụng)**

File `docker-compose.hybrid.yml` đã được cập nhật:

```yaml
shopbackend:
  environment:
    GOOGLE_GEMINI_API_KEY: ${GOOGLE_GEMINI_API_KEY}
```

Khi deploy:

```bash
# Tạo file .env trong thư mục gốc (không commit)
cat > .env << 'EOF'
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E
EOF

# Deploy (docker-compose tự động load .env)
docker-compose -f docker-compose.hybrid.yml up -d
```

**Ưu điểm:**
- Syntax rõ ràng trong docker-compose
- Dễ debug và maintain

---

## 📝 Gitignore Configuration

Đảm bảo `.gitignore` có:

```gitignore
# Environment Files
.env
.env.local
.env.production
.env.*.local
.env.rausach
.env.tazagroup

# Secrets
*.key
*.pem
secrets/
```

---

## 🚀 Quy Trình Deploy Production

### **Bước 1: Chuẩn bị trên Local**
```bash
# Commit code (không có secrets)
git add .
git commit -m "Add support chat feature"
git push origin main
```

### **Bước 2: Deploy lên Server**
```bash
# SSH vào server
ssh user@116.118.49.243

# Pull code mới
cd /path/to/shoprausach
git pull origin main

# Set secrets (chọn 1 trong 3 cách trên)
export GOOGLE_GEMINI_API_KEY="AIzaSyA..."

# Rebuild và deploy
docker-compose -f docker-compose.hybrid.yml up -d --build
```

### **Bước 3: Verify**
```bash
# Kiểm tra container có nhận biến không
docker exec shopbackend env | grep GOOGLE_GEMINI_API_KEY

# Xem log
docker logs shopbackend -f
```

---

## 🔧 Troubleshooting

### Lỗi: Container không nhận được biến môi trường

**Nguyên nhân:** Biến không được export hoặc file .env không đúng vị trí

**Giải pháp:**
```bash
# Kiểm tra biến có tồn tại không
echo $GOOGLE_GEMINI_API_KEY

# Kiểm tra file .env có đúng vị trí không
ls -la .env

# Restart container
docker-compose -f docker-compose.hybrid.yml restart shopbackend
```

### Lỗi: API key vẫn bị lộ trong docker inspect

**Nguyên nhân:** Docker inspect hiển thị tất cả environment variables

**Giải pháp:** Dùng Docker Secrets (nâng cao)
```yaml
secrets:
  gemini_api_key:
    external: true

services:
  shopbackend:
    secrets:
      - gemini_api_key
```

---

## 📊 So Sánh Các Cách

| Cách | Bảo mật | Dễ dùng | Linh hoạt | Khuyên dùng |
|------|---------|---------|-----------|-------------|
| Export ENV | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Production |
| .env.production | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Team lớn |
| docker-compose | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ Hiện tại |
| Docker Secrets | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | 🔧 Swarm mode |

---

## 🎯 Khuyến Nghị

Cho dự án hiện tại (shoprausach):

1. **Development:** Dùng file `.env` local (đã có)
2. **Production:** Dùng **Cách 1** (Export ENV) hoặc **Cách 2** (.env.production)
3. **CI/CD:** Set secrets trong GitHub Actions/GitLab CI

**File cần tạo trên server:**
```bash
# /path/to/shoprausach/.env.production
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E
OPENAI_API_KEY=sk-your-key-if-needed
INVOICE_BEARER_TOKEN=eyJhbGc...
```

**Không bao giờ commit:**
- `.env.production`
- `.env.local`
- Bất kỳ file chứa API keys, tokens, passwords

---

## 📚 Tài Liệu Tham Khảo

- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [12 Factor App - Config](https://12factor.net/config)
