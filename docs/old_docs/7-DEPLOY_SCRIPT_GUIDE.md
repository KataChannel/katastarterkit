# 📦 Unified Deployment Script Guide

**File**: `scripts/95copy.sh` (Unified - 424 lines)

## Overview

The `95copy.sh` script is now a **unified deployment tool** that combines all previous deployment scripts into one flexible, intelligent script with multiple modes.

**Previous scripts merged**:
- ✅ `95copy.sh` (deploy only)
- ✅ `96deploy-with-build.sh` (deploy with build)
- ✅ `97fix-frontend-on-server.sh` (fix mode)
- ✅ `98deploy-fix.sh` (critical files only)

## Quick Start

```bash
cd /mnt/chikiet/kataoffical/shoprausach

# Standard deployment (no build) - use pre-built files
./scripts/95copy.sh

# Deployment with build (recommended for development)
./scripts/95copy.sh --build

# Verify build without deploying
./scripts/95copy.sh --verify

# Fix mode (for production 404 errors)
./scripts/95copy.sh --fix

# Show help
./scripts/95copy.sh --help
```

## Deployment Modes

### 1. **Standard Deployment** (No Build)
```bash
./scripts/95copy.sh
```

**When to use**:
- You already have a built `.next` folder locally
- Quick deployment of code changes (backend only)
- CI/CD pipeline that pre-builds

**Flow**:
1. ✅ Verify local build exists
2. ✅ Create rsync exclude list
3. ✅ Sync entire project to server
4. ✅ Rebuild Docker containers
5. ✅ Show deployment summary

**Speed**: ~30-60 seconds (depends on file size changes)

---

### 2. **Build + Deploy** (Recommended)
```bash
./scripts/95copy.sh --build
```

**When to use**:
- Deploying with frontend changes
- Development/staging deployment
- After modifying React components, styles, or config
- Most common use case

**Flow**:
1. ✅ Build frontend (bun/npm)
2. ✅ Verify build output
3. ✅ Sync entire project to server
4. ✅ Rebuild Docker containers
5. ✅ Show deployment summary

**Speed**: ~2-5 minutes (depends on build time)

**Build tools**:
- Uses `bun` if available (faster)
- Falls back to `npm` if bun not found

---

### 3. **Verify Build Only** (No Deployment)
```bash
./scripts/95copy.sh --verify
```

**When to use**:
- Check if local build is ready
- Diagnose "404 error" issues locally
- Before deploying, verify nothing is missing
- Debugging build issues

**Flow**:
1. ✅ Verify local build exists
2. ✅ Check all critical directories:
   - `frontend/.next/standalone/`
   - `frontend/.next/static/`
   - `frontend/public/`
3. ✅ Count CSS/JS files
4. ✅ Report status (no deployment)

**Output example**:
```
[INFO] ✅ Found: frontend/.next/standalone
[INFO]   Files: 12 files
[INFO] ✅ Found: frontend/.next/static
[INFO]   CSS: 2 files, JS: 45 files
[INFO] ✅ Found: frontend/public
[INFO]   Files: 8 files
[SUCCESS] ✅ Build verification passed - ready for deployment
```

---

### 4. **Fix Mode** (Production 404 Errors)
```bash
./scripts/95copy.sh --fix
```

**When to use**:
- Frontend showing 404 errors after deployment
- Missing CSS/JavaScript on production
- Need to quickly sync only critical frontend files
- Emergency fix for static asset issues

**Flow**:
1. ✅ Verify local build exists
2. ✅ Stop Docker containers on server
3. ✅ Sync only critical files:
   - `frontend/.next/standalone/`
   - `frontend/.next/static/`
   - `frontend/public/`
4. ✅ Restart Docker containers
5. ✅ Show container logs
6. ✅ Show deployment summary

**Speed**: ~1-2 minutes (only syncs critical files, faster than standard deployment)

**Difference from standard**:
- Standard: syncs entire project
- Fix: syncs only frontend critical files
- Fix mode: stops containers before sync (prevents file conflicts)

---

## Usage Examples

### Example 1: Deploy Frontend Changes
```bash
# You modified src/components/Button.tsx
./scripts/95copy.sh --build
```

### Example 2: Deploy Backend Changes Only
```bash
# You modified backend/src/graphql/models/
# .next build already exists locally
./scripts/95copy.sh
```

### Example 3: Fix 404 Errors on Production
```bash
# Production showing 404s for CSS/JS
# Run this to quickly sync and rebuild
./scripts/95copy.sh --fix
```

### Example 4: Verify Local Build
```bash
# Before deploying, check if everything is built
./scripts/95copy.sh --verify
```

### Example 5: Full Rebuild
```bash
# Clean rebuild everything
rm -rf frontend/.next
./scripts/95copy.sh --build
```

---

## Output Examples

### Successful Build + Deploy
```
[INFO] ═══════════════════════════════════════════════════════
[INFO] DEPLOYMENT MODE: BUILD + DEPLOY
[INFO] ═══════════════════════════════════════════════════════

[INFO] Step 1: Building frontend...
[INFO] 🏗️  Building frontend locally...
[INFO] Using Bun for build
[SUCCESS] ✅ Frontend build completed

[INFO] Step 2: Verifying build output...
[SUCCESS] ✅ Found: frontend/.next/standalone
[INFO]   Files: 12 files
[SUCCESS] ✅ Found: frontend/.next/static
[INFO]   CSS: 2 files, JS: 45 files
[INFO] ✅ Build verification passed - ready for deployment

[INFO] Step 3: Deploying to server (standard mode)...
[INFO] 📤 Uploading to server (116.118.48.208)...
[INFO] Total project size: 1.2G
[SUCCESS] ✅ Upload completed

[INFO] Step 4: Restarting Docker containers...
[INFO] 🐳 Restarting Docker containers...
[SUCCESS] ✅ Docker containers restarted successfully

=== Container Status ===
NAME                   IMAGE                      STATUS
rausachcore-frontend   shoprausach-frontend       Up 5s
rausachcore-backend    shoprausach-backend        Up 3s

[SUCCESS] ═══════════════════════════════════════════════════════
[SUCCESS] DEPLOYMENT COMPLETED SUCCESSFULLY
[SUCCESS] ═══════════════════════════════════════════════════════
[SUCCESS] Server: 116.118.48.208
[SUCCESS] Frontend: http://116.118.48.208:12000
[SUCCESS] Backend: http://116.118.48.208:12001
```

---

## Troubleshooting

### Issue: "Missing frontend/.next/standalone"
```bash
# Solution: Build first
./scripts/95copy.sh --build
```

### Issue: "Build verification failed"
```bash
# Check what's missing
./scripts/95copy.sh --verify

# Rebuild from scratch
rm -rf frontend/.next frontend/node_modules
./scripts/95copy.sh --build
```

### Issue: "Rsync failed"
```bash
# Check SSH connection
ssh root@116.118.48.208 "echo 'SSH OK'"

# Try deployment again
./scripts/95copy.sh --build
```

### Issue: "Frontend still showing 404s after deployment"
```bash
# Use fix mode
./scripts/95copy.sh --fix

# Verify on server
curl http://116.118.48.208:12000
```

---

## Features

✅ **Intelligent Build Detection**
- Checks for bun, falls back to npm
- Only builds if `--build` flag used
- Verifies build output before deployment

✅ **Multiple Deployment Modes**
- Standard (full project)
- Build + Deploy (recommended)
- Verify only (no deployment)
- Fix mode (critical files only)

✅ **Comprehensive Verification**
- Checks all critical directories
- Counts CSS/JS files
- Verifies server connectivity
- Shows container status/logs

✅ **Smart Syncing**
- Excludes unnecessary files
- Uses compression for speed
- Deletes removed files on server
- Minimal bandwidth usage

✅ **Clear Output**
- Color-coded messages
- Step-by-step progress
- Container logs after deployment
- Deployment timestamps

---

## File Exclusions

The script excludes the following from rsync:

- `node_modules/.cache/`, `.cache/`, `.next/cache/`
- `.git/`, `.github/`, `.gitignore`
- `.vscode/`, `.idea/`, editor temp files
- `.env*` (environment files)
- `bun.lockb`, lock files
- Test coverage, logs
- Previous deploy scripts (96, 97, 98)

---

## Performance Tips

### Fastest deployment (backend only)
```bash
./scripts/95copy.sh
# ~30-60 seconds
```

### Faster build + deploy (with cache)
```bash
./scripts/95copy.sh --build
# ~2-3 minutes (if node_modules cached)
```

### Fix mode (fastest deployment)
```bash
./scripts/95copy.sh --fix
# ~1-2 minutes (frontend files only)
```

---

## Configuration

Edit these values in `scripts/95copy.sh`:

```bash
SERVER_IP="116.118.48.208"        # Production server
SERVER_USER="root"                 # SSH user
REMOTE_DIR="/root/shoprausach"    # Remote project path
LOCAL_DIR="$(pwd)"                 # Local project path
```

---

## Related Documentation

- **PRODUCTION_404_FIX.md** - Complete guide to 404 error issue and fix
- **DEPLOYMENT_README.md** - Comprehensive deployment guide
- **Dockerfile** - Frontend/backend container configuration
- **docker-compose.yml** - Container orchestration

---

## Migration from Old Scripts

If you have scripts referencing old files:

| Old Script | Use Instead | Reason |
|-----------|------------|--------|
| `scripts/95copy.sh` (old) | `scripts/95copy.sh` | Now unified |
| `scripts/96deploy-with-build.sh` | `scripts/95copy.sh --build` | Merged into main |
| `scripts/97fix-frontend-on-server.sh` | `scripts/95copy.sh --fix` | Merged into main |
| `scripts/98deploy-fix.sh` | `scripts/95copy.sh --fix` | Merged into main |

---

## Next Steps

1. ✅ Update CI/CD to use new script
2. ✅ Add `--build` flag for development deployments
3. ✅ Use `--verify` before deploying to catch issues
4. ✅ Use `--fix` for emergency 404 fixes

---

**Last Updated**: October 27, 2025  
**Unified Version**: 1.0  
**Status**: ✅ Production Ready
