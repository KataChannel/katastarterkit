# 📋 MENU REFERENCE - QUICK GUIDE

## 🎯 Main Menu Options

### 📌 DEVELOPMENT (Localhost)
```
1) 🚀 Start Development (Interactive)
   → Calls dev-start.sh
   → Choose: Rausach | Tazagroup | Both
   → Auto service check included

2) 🛑 Stop All Development Services
   → Calls dev-stop.sh
   → Kills all running dev processes

3) 🔄 Switch Environment
   → Calls switch-env.sh
   → Switch between .env files

4) 📊 Check Status
   → Calls status.sh
   → Show running services
```

### 📌 PRODUCTION (Server)
```
5) 🌐 Deploy to Production (Interactive)
   → Calls prod-deploy.sh
   → Choose: Rausach | Tazagroup | Multi-domain
   → Auto service check included

6) 📋 View Production Logs
   → View logs from docker containers
   → Choose domain to view

7) ⏹️  Stop Production Services
   → Stop docker containers
   → Choose domain to stop
```

### 📌 QUICK ACTIONS
```
8) 🌟 Quick Start - Rausach Dev
   → Start localhost:12000-12001
   → Service check included ✅
   → Background processes
   → Log files created

9) 🏢 Quick Start - Tazagroup Dev
   → Start localhost:13000-13001
   → Service check included ✅
   → Background processes
   → Log files created

10) 🔥 Quick Start - Both Domains
    → Start both Rausach + Tazagroup
    → Service check included ✅
    → Calls dev-start.sh with option 3
```

### 📌 UTILITIES
```
11) 🧪 Test Remote Connections
    → Calls test-connection.sh
    → Check PostgreSQL, Redis, Minio
    → Show which services are down

12) 🚀 Start Server Services
    → Calls start-server-services.sh
    → SSH to server
    → Start services remotely

13) 🔧 Install Dependencies
    → Run bun install
    → Install in backend/
    → Install in frontend/

14) 🗄️  Database Studio
    → Open Prisma Studio
    → Choose: Rausach DB | Tazagroup DB

15) 📦 Clean Project
    → Remove node_modules
    → Remove lock files
    → Confirmation required

0) ❌ Exit
```

---

## 🆕 NEW FEATURES

### ✅ Auto Service Check (Options 8, 9, 10)

Quick Actions now check remote services BEFORE starting:

```
🔍 Quick check: Remote services...
✅ All services OK
```

If services are down:
```
🔍 Quick check: Remote services...
⚠️  Some services are not available!
Run './test-connection.sh' for details

Continue anyway? (y/N):
```

### ✅ Better Process Management

Quick Actions now:
- Create log files: `dev-{domain}-{backend|frontend}.log`
- Show PIDs for tracking
- Run in background properly
- Display log commands

Example output:
```
✅ Started!
Backend PID: 12345
Frontend PID: 12346

Logs:
  tail -f dev-rausach-backend.log
  tail -f dev-rausach-frontend.log
```

---

## 🔥 RECOMMENDED WORKFLOWS

### For Daily Development:

**Method 1 - Quick (No choices):**
```
./menu.sh
→ Choose 8 or 9 (Quick Start)
→ Auto check + start
```

**Method 2 - Interactive (More control):**
```
./menu.sh
→ Choose 1 (Start Development)
→ Choose domain
→ Auto check + start
```

**Method 3 - Both domains:**
```
./menu.sh
→ Choose 10 (Quick Start Both)
→ Work on both simultaneously
```

### For Production Deploy:

**Recommended:**
```
./menu.sh
→ Choose 11 (Test connections first)
→ If OK, choose 5 (Deploy)
→ Choose domain
```

**Quick (with auto-check):**
```
./menu.sh
→ Choose 5 (Deploy)
→ Auto check happens
→ Choose domain
```

### For Troubleshooting:

```
./menu.sh
→ Choose 11 (Test connections)
→ If failed, choose 12 (Start server services)
→ Test again with 11
→ Then proceed with development
```

---

## 💡 TIPS

### Stop Running Services:
```
# Option 1: Use menu
./menu.sh → Choose 2

# Option 2: Direct script
./dev-stop.sh

# Option 3: Manual kill
lsof -ti:12000 | xargs kill -9
lsof -ti:12001 | xargs kill -9
```

### View Logs in Real-time:
```
# After starting with Quick Actions (8, 9):
tail -f dev-rausach-backend.log
tail -f dev-rausach-frontend.log
tail -f dev-tazagroup-backend.log
tail -f dev-tazagroup-frontend.log

# Or both at once:
tail -f dev-*-backend.log
tail -f dev-*-frontend.log
```

### Check What's Running:
```
./menu.sh → Choose 4 (Check Status)

# Or direct:
./status.sh

# Or manual:
lsof -ti:12000,12001,13000,13001
```

---

## 🐛 TROUBLESHOOTING

### Menu exits with error:
- Check all scripts are executable: `chmod +x *.sh`
- Check no syntax errors: `bash -n menu.sh`

### Quick Actions don't start:
- Check remote services: Menu option 11
- Start server services: Menu option 12
- Check logs in `dev-*.log` files

### Services check fails:
- Server might be down
- Firewall blocking ports
- Services not running on server
- Use option 12 to start services

### Ports already in use:
- Stop existing processes: Menu option 2
- Or manual: `./dev-stop.sh`
- Or kill specific: `lsof -ti:12000 | xargs kill -9`

---

## 🎓 KEYBOARD SHORTCUTS

While in menu:
- Just type number + Enter
- No need to type full option
- `0` to exit anytime
- Ctrl+C to abort current operation

---

## 📚 RELATED DOCUMENTATION

- Full development guide: `DEV_GUIDE.md`
- Quick start: `QUICK_START_DEV.md`
- Service checks: `UPDATE_SERVICE_CHECKS.md`
- Vietnamese guide: `BẮT_ĐẦU_ĐÂY.txt`

---

**Updated: November 4, 2025**
**Version: 2.0 with Auto Service Check**
