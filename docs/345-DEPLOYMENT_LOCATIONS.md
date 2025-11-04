# 🎯 DEPLOYMENT QUICK REFERENCE

## TL;DR - Cách deploy nhanh

### Development (Local)
```bash
./menu.sh
# Chọn 9: Quick Start - Rausach (localhost:12000)
# Chọn 10: Quick Start - Tazagroup (localhost:13000)
```

### Production (Local Docker + Remote Services)
```bash
./menu.sh
# Chọn 5: Deploy to Production (Local Docker)
```

### Production (Remote Server)
```bash
./menu.sh
# Chọn 6: Deploy to Remote Server (116.118.49.243)
```

---

## Scripts Deployment

### 📁 Cấu trúc thư mục deployment

| Deployment Type | Script | Deploy Location | Services Location |
|----------------|--------|-----------------|-------------------|
| **Development** | `dev-start.sh` | `localhost` | `116.118.49.243` |
| **Production Local** | `prod-deploy.sh` | `localhost` (Docker) | `116.118.49.243` |
| **Production Remote** | `remote-deploy.sh` | `116.118.49.243` | `116.118.49.243` |

---

## 🗂️ Thư mục trên Server 116.118.49.243

### Khi dùng `remote-deploy.sh`:

```
/opt/shoprausach/
│
├── rausach/              ← Option 1: Deploy Rausach
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.rausach.yml
│   └── .env
│
├── tazagroup/            ← Option 2: Deploy Tazagroup
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.tazagroup.yml
│   └── .env
│
└── multi-domain/         ← Option 3: Deploy Both
    ├── backend/
    ├── frontend/
    ├── docker-compose.multi-domain.yml
    └── .env (optional)
```

### Remote Services (Shared)

```
/opt/services/           ← Database, Redis, Minio
├── postgres/
├── redis/
└── minio/
```

---

## ⚡ Quick Commands

### Deploy to Remote Server

```bash
# Full interactive
./remote-deploy.sh

# Hoặc qua menu
./menu.sh
# → Option 6
```

### Check Deployment Status

```bash
# View logs on server - Rausach
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml logs -f'

# View logs on server - Tazagroup
ssh root@116.118.49.243 'cd /opt/shoprausach/tazagroup && docker-compose -f docker-compose.tazagroup.yml logs -f'

# Check running containers
ssh root@116.118.49.243 'docker ps'
```

### Restart Services on Server

```bash
# Restart Rausach
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml restart'

# Restart Tazagroup
ssh root@116.118.49.243 'cd /opt/shoprausach/tazagroup && docker-compose -f docker-compose.tazagroup.yml restart'
```

### Stop Services on Server

```bash
# Stop Rausach
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml down'

# Stop Tazagroup
ssh root@116.118.49.243 'cd /opt/shoprausach/tazagroup && docker-compose -f docker-compose.tazagroup.yml down'
```

---

## 🔍 URLs sau khi Deploy

### Rausach
- Frontend: http://116.118.49.243:12000
- Backend API: http://116.118.49.243:12001/graphql
- Database: 116.118.49.243:12003
- PgAdmin: http://116.118.49.243:12002

### Tazagroup
- Frontend: http://116.118.49.243:13000
- Backend API: http://116.118.49.243:13001/graphql
- Database: 116.118.49.243:13003
- PgAdmin: http://116.118.49.243:13002

### Shared Services
- Redis: 116.118.49.243:12004
- Minio API: 116.118.49.243:12007
- Minio Console: http://116.118.49.243:12008

---

## 📋 Workflow Deploy Production

### Step 1: Test Local
```bash
./menu.sh → Option 9/10  # Dev mode test
```

### Step 2: Test Local Production
```bash
./menu.sh → Option 5     # Local docker + remote services
```

### Step 3: Deploy to Server
```bash
./menu.sh → Option 6     # Remote deployment
```

### Step 4: Verify
```bash
./menu.sh → Option 12    # Test connections
curl http://116.118.49.243:12000
curl http://116.118.49.243:13000
```

---

## ❗ Troubleshooting

### Cannot SSH to server
```bash
# Test SSH
ssh root@116.118.49.243

# Setup SSH key
ssh-copy-id root@116.118.49.243
```

### Services not available
```bash
# Start remote services
./start-server-services.sh

# Test connections
./test-connection.sh
```

### Deployment failed
```bash
# View remote logs
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose logs'

# Check container status
ssh root@116.118.49.243 'docker ps -a'
```

---

## 📚 Documentation

- **Full Guide**: [REMOTE_DEPLOYMENT_GUIDE.md](./REMOTE_DEPLOYMENT_GUIDE.md)
- **Menu Reference**: [MENU_REFERENCE.md](./MENU_REFERENCE.md)
- **Service Checks**: [UPDATE_SERVICE_CHECKS.md](./UPDATE_SERVICE_CHECKS.md)

---

**Lưu ý quan trọng:**

1. ✅ `prod-deploy.sh` → Deploy LOCAL docker (dùng remote services)
2. ✅ `remote-deploy.sh` → Deploy lên SERVER 116.118.49.243
3. ✅ Cả 2 đều kết nối tới remote services (PostgreSQL, Redis, Minio)
4. ✅ Chỉ khác nhau ở **nơi chạy docker containers**

---

Made with ❤️ for easy deployment
