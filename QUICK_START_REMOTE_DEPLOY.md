# 🚀 QUICK START: Remote Deployment

## ⚡ 3 Steps để Deploy Production

### Step 1️⃣: Mở Menu
```bash
./menu.sh
```

### Step 2️⃣: Chọn Option 6
```
📌 PRODUCTION (Server):
  5) 🌐 Deploy to Production (Local Docker)
  6) 🚀 Deploy to Remote Server (116.118.49.243)  ← CHỌN ĐÂY
```

### Step 3️⃣: Chọn Domain và Deploy
```
  1) 🌟 Rausach
  2) 🏢 Tazagroup
  3) 🔥 Multi-domain
```

**DONE!** 🎉

---

## 📊 Workflow Visual

```
┌─────────────────────────────────────────────────────────┐
│                    ./menu.sh                            │
│                       ↓                                 │
│              Option 6: Remote Deploy                    │
│                       ↓                                 │
│           ┌───────────┴───────────┐                    │
│           │  Choose Domain:       │                    │
│           │  1) Rausach          │                    │
│           │  2) Tazagroup        │                    │
│           │  3) Multi-domain     │                    │
│           └───────────┬───────────┘                    │
│                       ↓                                 │
│    ┌──────────────────────────────────────┐           │
│    │  Automatic Deployment Process:       │           │
│    │                                       │           │
│    │  ✅ 1. Check SSH Connection          │           │
│    │  ✅ 2. Sync Code via Rsync           │           │
│    │  ✅ 3. Deploy on Server               │           │
│    │  ✅ 4. Show URLs & Commands           │           │
│    └──────────────────────────────────────┘           │
│                       ↓                                 │
│         🎉 DEPLOYMENT SUCCESSFUL!                       │
│                                                         │
│    📍 Access your app at:                              │
│    http://116.118.49.243:12000 (Rausach)              │
│    http://116.118.49.243:13000 (Tazagroup)            │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Deployment Locations

### Local Machine (Your Computer)
```
/mnt/chikiet/kataoffical/shoprausach/
├── backend/
├── frontend/
├── remote-deploy.sh  ← Script runs here
└── ...
```

### Remote Server (116.118.49.243)
```
/opt/shoprausach/
├── rausach/          ← Code deployed here
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.rausach.yml
│   └── .env
│
├── tazagroup/        ← Or here
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.tazagroup.yml
│   └── .env
│
└── multi-domain/     ← Or both here
    └── ...
```

---

## 🔄 Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  LOCAL MACHINE                                                │
│  /mnt/chikiet/kataoffical/shoprausach                         │
│                                                               │
│  Developer runs:                                              │
│  $ ./menu.sh → Option 6                                       │
│                                                               │
│         ↓                                                      │
│  ┌──────────────────────┐                                    │
│  │  remote-deploy.sh    │                                    │
│  │  1. Check SSH ✓      │                                    │
│  │  2. Rsync files ───────────────┐                          │
│  └──────────────────────┘         │                          │
└───────────────────────────────────┼──────────────────────────┘
                                    │
                    SSH + Rsync Transfer
                    (Code, configs, docker files)
                                    │
                                    ↓
┌───────────────────────────────────┼──────────────────────────┐
│  REMOTE SERVER                    │                           │
│  116.118.49.243                   │                           │
│                                   ↓                           │
│  /opt/shoprausach/rausach/  ← Code arrives here               │
│  ├── backend/                                                 │
│  ├── frontend/                                                │
│  ├── docker-compose.rausach.yml                               │
│  └── .env.prod.rausach → .env                                 │
│                                                               │
│  Then automatically:                                          │
│  $ docker-compose -f docker-compose.rausach.yml down          │
│  $ docker-compose -f docker-compose.rausach.yml up -d --build │
│                                                               │
│         ↓                                                      │
│  ┌─────────────────────────────────────────┐                 │
│  │  Containers Running:                    │                 │
│  │  • frontend:12000                       │                 │
│  │  • backend:12001                        │                 │
│  │  • Connected to shared services:        │                 │
│  │    - PostgreSQL:12003                   │                 │
│  │    - Redis:12004                        │                 │
│  │    - Minio:12007                        │                 │
│  └─────────────────────────────────────────┘                 │
└───────────────────────────────────────────────────────────────┘
                         ↓
            ┌────────────────────────┐
            │  PUBLIC ACCESS:        │
            │  http://116.118.49.243 │
            │  :12000, :12001, etc.  │
            └────────────────────────┘
```

---

## 💡 Example Session

```bash
# Start deployment
$ ./menu.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎯 MULTI-DOMAIN DEVELOPMENT MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 PRODUCTION (Server):
  5) 🌐 Deploy to Production (Local Docker)
  6) 🚀 Deploy to Remote Server (116.118.49.243)  ← Select this

Lựa chọn của bạn [0-16]: 6

# ↓ Remote deploy script starts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚀 REMOTE DEPLOYMENT TO SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Server: 116.118.49.243
SSH User: root

Chọn domain để deploy:

  1) 🌟 Rausach    (deploy to: /opt/shoprausach/rausach)
  2) 🏢 Tazagroup  (deploy to: /opt/shoprausach/tazagroup)
  3) 🔥 Multi-domain (deploy to: /opt/shoprausach/multi-domain)

Lựa chọn của bạn [1-6]: 1

# ↓ Deployment plan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🎯 DEPLOYMENT PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Domain:        rausach
Local Path:    /mnt/chikiet/kataoffical/shoprausach
Remote Path:   /opt/shoprausach/rausach
Compose File:  docker-compose.rausach.yml
Env File:      .env.prod.rausach

Steps:
  1. Check SSH connection
  2. Sync code to server
  3. Deploy with docker-compose
  4. Show deployment info

Continue with deployment? (y/N): y

# ↓ Step 1: SSH Check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STEP 1: SSH CONNECTION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Checking SSH connection to 116.118.49.243...
✅ SSH connection successful

# ↓ Step 2: Sync Code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STEP 2: SYNC CODE TO SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Syncing code to server: /opt/shoprausach/rausach

sending incremental file list
backend/
backend/src/
backend/src/main.ts
... [progress bar] ...
frontend/
frontend/app/
frontend/app/page.tsx
... [progress bar] ...

✅ Code synced successfully

# ↓ Step 3: Deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STEP 3: DEPLOY ON SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Deploying rausach on server...

📂 Navigating to: /opt/shoprausach/rausach
📋 Current directory: /opt/shoprausach/rausach

⚙️  Setting up environment...
✅ Environment file configured

🐳 Docker compose command: docker-compose

🛑 Stopping existing containers...
🔨 Building and starting containers...
⏳ Waiting for containers to start...

📊 Container status:
NAME                         STATUS              PORTS
rausach-frontend-1           Up 5 seconds        0.0.0.0:12000->3000/tcp
rausach-backend-1            Up 5 seconds        0.0.0.0:12001->3001/tcp

✅ Deployment completed!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ DEPLOYMENT SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ↓ Step 4: Info

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📍 DEPLOYMENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 RAUSACH:
   Frontend:  http://116.118.49.243:12000
   Backend:   http://116.118.49.243:12001/graphql
   Database:  116.118.49.243:12003
   PgAdmin:   http://116.118.49.243:12002

📍 SHARED SERVICES:
   Redis:     116.118.49.243:12004
   Minio:     116.118.49.243:12007
   Console:   http://116.118.49.243:12008

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Useful commands:

  View logs:
    ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml logs -f'

  Restart services:
    ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml restart'

  Stop services:
    ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose -f docker-compose.rausach.yml down'

🎉 Deployment completed successfully!
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend accessible: `curl http://116.118.49.243:12000`
- [ ] Backend GraphQL: `curl http://116.118.49.243:12001/graphql`
- [ ] Database connected: Check backend logs
- [ ] Redis connected: Check backend logs
- [ ] Minio accessible: Check file uploads
- [ ] No errors in logs: Run view logs command

---

## 🆘 Quick Help

### View Logs
```bash
# From menu
./menu.sh → Option 7

# Direct SSH
ssh root@116.118.49.243 'cd /opt/shoprausach/rausach && docker-compose logs -f'
```

### Restart Deployment
```bash
# Just run again
./menu.sh → Option 6
```

### Rollback
```bash
# SSH to server and restore backup
ssh root@116.118.49.243
cd /opt/shoprausach/rausach
docker-compose down
# Restore from backup
```

---

## 📚 More Info

- Full Guide: [REMOTE_DEPLOYMENT_GUIDE.md](./REMOTE_DEPLOYMENT_GUIDE.md)
- All Locations: [DEPLOYMENT_LOCATIONS.md](./DEPLOYMENT_LOCATIONS.md)
- Menu Help: [MENU_REFERENCE.md](./MENU_REFERENCE.md)

---

**🎯 Remember:**

- **Option 5**: Local Docker (test production mode on your machine)
- **Option 6**: Remote Server (real production deployment) ⭐

Choose Option 6 when you're ready to deploy to production! 🚀
