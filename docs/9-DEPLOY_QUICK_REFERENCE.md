# 🚀 Quick Reference - Unified Deploy Script

## One-Line Cheat Sheet

```bash
./95copy.sh              # Deploy (no build)
./95copy.sh --build      # Build + Deploy ⭐ RECOMMENDED
./95copy.sh --verify     # Verify without deploying
./95copy.sh --fix        # Fix 404 errors fast
./95copy.sh --help       # Show help
```

## When to Use Each Mode

```
┌─────────────────────────────────────────────────────────────┐
│ SCENARIO                                                     │
├─────────────────────────────────────────────────────────────┤
│ 1. Backend code changes → ./95copy.sh                        │
│    (30-60s, frontend already built)                          │
├─────────────────────────────────────────────────────────────┤
│ 2. Frontend/React changes → ./95copy.sh --build ⭐          │
│    (2-5m, rebuilds frontend)                                 │
├─────────────────────────────────────────────────────────────┤
│ 3. Before deploying → ./95copy.sh --verify                  │
│    (5s, quick check)                                         │
├─────────────────────────────────────────────────────────────┤
│ 4. Production 404 errors → ./95copy.sh --fix                │
│    (1-2m, emergency fix)                                     │
└─────────────────────────────────────────────────────────────┘
```

## Output Examples

### ✅ Verify Mode
```
[INFO] DEPLOYMENT MODE: VERIFY BUILD ONLY
[SUCCESS] ✅ Found: frontend/.next/standalone (3,336 files)
[SUCCESS] ✅ Found: frontend/.next/static (3 CSS, 190 JS files)
[SUCCESS] ✅ Found: frontend/public (11 files)
[SUCCESS] ✅ Build verification passed - ready for deployment
```

### ✅ Build + Deploy Mode
```
[INFO] DEPLOYMENT MODE: BUILD + DEPLOY
[INFO] 🏗️  Building frontend locally...
[SUCCESS] ✅ Frontend build completed
[INFO] ✅ Verifying build output...
[SUCCESS] ✅ Build verification passed
[INFO] 📤 Uploading to server...
[SUCCESS] ✅ Upload completed
[INFO] 🐳 Restarting Docker containers...
[SUCCESS] ✅ Docker containers restarted successfully

[SUCCESS] DEPLOYMENT COMPLETED SUCCESSFULLY
[SUCCESS] Frontend: http://116.118.49.243:12000
[SUCCESS] Backend: http://116.118.49.243:12001
```

## Common Tasks

### Task: Deploy React component changes
```bash
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/95copy.sh --build
# Wait 2-5 minutes
# Check: http://116.118.49.243:12000
```

### Task: Deploy API changes only
```bash
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/95copy.sh
# Wait 30-60 seconds
# Check: http://116.118.49.243:12001/graphql
```

### Task: Check if ready to deploy
```bash
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/95copy.sh --verify
# Shows: ✅ or ❌
# If ✅: ./95copy.sh to deploy
# If ❌: Fix and rebuild
```

### Task: Fix production 404s
```bash
cd /mnt/chikiet/kataoffical/shoprausach
./scripts/95copy.sh --fix
# Wait 1-2 minutes
# Check: http://116.118.49.243:12000
```

### Task: Full rebuild everything
```bash
cd /mnt/chikiet/kataoffical/shoprausach
rm -rf frontend/.next frontend/node_modules
./scripts/95copy.sh --build
# Wait 3-5 minutes
```

## Error Troubleshooting

| Error | Solution |
|-------|----------|
| `Missing frontend/.next/standalone` | Run `./95copy.sh --build` |
| `Build verification failed` | Run `./95copy.sh --verify` to see what's missing |
| `Rsync failed` | Check SSH: `ssh root@116.118.49.243 "echo OK"` |
| `Frontend 404s` | Run `./95copy.sh --fix` |
| `Docker failed to restart` | Check server: `ssh root@116.118.49.243 docker ps` |

## What Each Mode Does

### Mode: Standard (`./95copy.sh`)
```
1. ✓ Verify local build exists
2. ✓ Create rsync exclude list  
3. ✓ Sync entire project to server
4. ✓ Rebuild Docker containers
5. ✓ Show summary
Time: ~30-60 seconds
```

### Mode: Build (`./95copy.sh --build`)
```
1. ✓ Build frontend (bun/npm)
2. ✓ Verify build output
3. ✓ Sync entire project to server
4. ✓ Rebuild Docker containers
5. ✓ Show summary
Time: ~2-5 minutes
```

### Mode: Verify (`./95copy.sh --verify`)
```
1. ✓ Verify build output exists
2. ✓ Count CSS/JS/image files
3. ✓ Report status
4. ✓ STOP (no deployment)
Time: ~5 seconds
```

### Mode: Fix (`./95copy.sh --fix`)
```
1. ✓ Verify build output
2. ✓ Stop containers on server
3. ✓ Sync critical files only (.next, public)
4. ✓ Restart containers
5. ✓ Show container logs & summary
Time: ~1-2 minutes
```

## Configuration

Edit in `scripts/95copy.sh`:
```bash
SERVER_IP="116.118.49.243"        # Production server
SERVER_USER="root"                 # SSH user
REMOTE_DIR="/root/shoprausach"    # Remote path
LOCAL_DIR="$(pwd)"                 # Local path (stays as-is)
```

## Performance Tips

```
Fastest: ./95copy.sh (backend only) → 30-60s
Better: ./95copy.sh --build → 2-5m
Quick check: ./95copy.sh --verify → 5s
Emergency: ./95copy.sh --fix → 1-2m
```

## Migration from Old Scripts

Old way → New way:
- `./96deploy-with-build.sh` → `./95copy.sh --build`
- `./98deploy-fix.sh` → `./95copy.sh --fix`
- `./95copy.sh` (old) → `./95copy.sh` (new)

## File Structure

```
shoprausach/
├── scripts/
│   ├── 95copy.sh              ⭐ UNIFIED (use this)
│   ├── 96deploy-with-build.sh (old, can delete)
│   ├── 97fix-frontend-on-server.sh (old, can delete)
│   └── 98deploy-fix.sh        (old, can delete)
├── frontend/
│   ├── .next/
│   │   ├── standalone/        (app binary)
│   │   ├── static/            (CSS/JS chunks)
│   │   └── cache/             (excluded from rsync)
│   └── public/                (images, etc)
├── backend/
│   ├── dist/                  (compiled)
│   └── src/                   (source)
└── docker-compose.yml
```

## What Gets Deployed

### Standard/Build Modes
```
Everything EXCEPT:
- node_modules/.cache/
- .next/cache/
- .git/
- .vscode/
- .env* files
- Previous deploy scripts
```

### Fix Mode
```
Only these critical files:
- frontend/.next/standalone/
- frontend/.next/static/
- frontend/public/
```

## Server Verification

After deployment, verify:

```bash
# Frontend loaded?
curl http://116.118.49.243:12000

# Backend running?
curl http://116.118.49.243:12001/graphql

# Containers healthy?
ssh root@116.118.49.243 docker ps

# Check logs?
ssh root@116.118.49.243 docker logs -f tazagroupcore-frontend
```

## Documentation

- **Full Guide**: `DEPLOY_SCRIPT_GUIDE.md`
- **Consolidation Details**: `UNIFIED_DEPLOYMENT_CONSOLIDATION.md`
- **404 Fix Reference**: `PRODUCTION_404_FIX.md`
- **Script Help**: `./95copy.sh --help`

---

**Status**: ✅ Production Ready  
**Version**: 1.0 (Unified)  
**Last Updated**: October 27, 2025
