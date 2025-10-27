# 🚀 Quick Deploy Guide - Backend Prisma Fix

**Fixed Issue**: Backend container error "Cannot find module '@prisma/client'"

## 🎯 What Was Fixed

✅ **package.json**: Moved `@prisma/client` from devDependencies → dependencies  
✅ **Dockerfile**: Added Prisma client generation + entrypoint script  
✅ **Backend Build**: Ready to deploy with fixed configuration

## 📋 Deploy Steps

### Option 1: Build + Deploy (Recommended)
```bash
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/95copy.sh --build
```
**Time**: ~5 minutes | **What it does**: Build frontend + backend, deploy, restart containers

### Option 2: Quick Deploy (Backend Only)
```bash
./scripts/95copy.sh --fix
```
**Time**: ~2 minutes | **What it does**: Sync critical files, restart containers

### Option 3: Standard Deploy
```bash
./scripts/95copy.sh
```
**Time**: ~1 minute | **What it does**: Sync all files, restart containers

## ✅ Verification

After deployment, check if backend is working:

```bash
# View backend logs
ssh root@116.118.49.243 docker logs rausachcore-backend -f

# Look for these messages (means it worked):
# ✅ Redis is ready!
# ✅ Database is ready!
# 🔧 Generating Prisma client...
# ✅ Backend setup complete!
```

Or test the API:
```bash
curl http://116.118.49.243:12001/health
# Should respond with 200
```

## 📊 Changes Summary

| File | Change | Status |
|------|--------|--------|
| `backend/package.json` | Moved @prisma/client to dependencies | ✅ Done |
| `backend/Dockerfile` | Added Prisma generation + entrypoint | ✅ Done |
| `backend/entrypoint.sh` | Already had Prisma generation | ✅ Ready |

## 🎯 Expected Result

Backend container will:
1. Install @prisma/client in production
2. Generate Prisma client at build time
3. Generate Prisma client again at startup
4. Run database migrations
5. Start successfully on port 4000

## 📞 Need Help?

Read full documentation:
```bash
cat BACKEND_PRISMA_FIX.md
```

---

**Status**: ✅ Ready to deploy  
**Next**: Run `./scripts/95copy.sh --build`
