# 🚀 Multi-Domain Development & Deployment System

## ⚡ Quick Start

### 🎯 Menu Chính (Khuyến nghị)

```bash
chmod +x *.sh
./menu.sh
```

Menu sẽ cung cấp tất cả các tùy chọn cần thiết!

---

## 📋 Chế độ làm việc

### 1️⃣ Development (Localhost)

**Rausach:**
- Frontend: http://localhost:12000
- Backend: http://localhost:12001

**Innerv2:**
- Frontend: http://localhost:13000
- Backend: http://localhost:13001

**Remote Services:** 116.118.48.208 (Database, Redis, Minio)

### 2️⃣ Production (Server)

**Rausach:**
- Frontend: http://116.118.48.208:12000
- Backend: http://116.118.48.208:12001

**Innerv2:**
- Frontend: http://116.118.48.208:13000
- Backend: http://116.118.48.208:13001

---

## 🎯 Script Commands

| Script | Mô tả |
|--------|-------|
| `./menu.sh` | 🎯 Menu chính - Tất cả các lựa chọn |
| `./dev-start.sh` | 🚀 Khởi động development |
| `./dev-stop.sh` | 🛑 Dừng development |
| `./prod-deploy.sh` | 🌐 Deploy production |
| `./status.sh` | 📊 Kiểm tra trạng thái |
| `./switch-env.sh` | 🔄 Chuyển môi trường |

---

## 🔥 Quick Commands

### Development
```bash
# Menu chính
./menu.sh

# Hoặc start trực tiếp
./dev-start.sh    # Chọn domain
./dev-stop.sh     # Dừng tất cả

# NPM scripts
bun run dev:rausach    # Rausach dev
bun run dev:innerv2  # Innerv2 dev
```

### Production
```bash
# Deploy với menu
./prod-deploy.sh

# Hoặc NPM scripts
bun run docker:prod:rausach    # Deploy Rausach
bun run docker:prod:innerv2  # Deploy Innerv2
bun run docker:prod:multi      # Deploy cả 2
```

### Status & Logs
```bash
# Kiểm tra status
./status.sh

# Logs development
tail -f dev-rausach-backend.log
tail -f dev-innerv2-frontend.log

# Logs production
docker-compose -f docker-compose.rausach.yml logs -f
```

---

## 📂 File Structure

```
.env.dev.rausach       # Dev - Rausach
.env.dev.innerv2     # Dev - Innerv2
.env.prod.rausach      # Prod - Rausach
.env.prod.innerv2    # Prod - Innerv2

dev-start.sh           # Start dev
dev-stop.sh            # Stop dev
prod-deploy.sh         # Deploy prod
status.sh              # Check status
switch-env.sh          # Switch env
menu.sh                # Main menu

docker-compose.rausach.yml
docker-compose.innerv2.yml
docker-compose.multi-domain.yml
```

---

## 🔧 Setup

```bash
# Install dependencies
bun install
cd backend && bun install
cd ../frontend && bun install

# Make scripts executable
chmod +x *.sh

# Start development
./menu.sh
```

---

## 📖 Documentation

Xem chi tiết trong: **[DEV_GUIDE.md](./DEV_GUIDE.md)**

---

## 💡 Tips

1. ✅ Luôn dùng `./menu.sh` để dễ dàng nhất
2. ✅ Kiểm tra `./status.sh` khi gặp vấn đề
3. ✅ Dùng `./switch-env.sh` để chuyển môi trường nhanh
4. ✅ Check logs thường xuyên

---

**Made with ❤️ for Multi-Domain Development**
