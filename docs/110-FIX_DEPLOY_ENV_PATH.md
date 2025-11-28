# Fix: Deploy Script Cannot Find env Files

## Issue
When running deploy from menu, getting error:
```
$ cp .env.prod.tazagroup backend/.env && cp .env.prod.tazagroup frontend/.env.local
cp: cannot stat '.env.prod.tazagroup': No such file or directory
```

## Root Cause
The package.json has been updated to use `env/.env.prod.*` paths, but the error shows it's trying to use `.env.prod.*` (without `env/` prefix). This can be caused by:
1. Bun package manager caching old package.json scripts
2. Script running from wrong directory
3. Old process still running with cached commands

## Solution

### Option 1: Clear Bun Cache and Reinstall (Recommended)
```bash
cd /mnt/chikiet/kataoffical/shoprausach

# Clear bun cache
rm -rf node_modules
rm -f bun.lockb

# Reinstall
bun install

# Try deploy again
bun run deploy:tazagroup
```

### Option 2: Run Deploy Directly (Quick Fix)
```bash
cd /mnt/chikiet/kataoffical/shoprausach

# Copy env files manually
cp env/.env.prod.tazagroup backend/.env
cp env/.env.prod.tazagroup frontend/.env.local

# Build images
bun run build:tazagroup:image

# Save images
bun run build:tazagroup:save

# Deploy
./scripts/deploy/deploy-tazagroup.sh
```

### Option 3: Kill All Node/Bun Processes
```bash
# Kill any running bun/node processes that might have cached the old commands
pkill -9 bun
pkill -9 node

# Try deploy again
cd /mnt/chikiet/kataoffical/shoprausach
bun run deploy:tazagroup
```

### Option 4: Verify and Fix package.json (if needed)
```bash
cd /mnt/chikiet/kataoffical/shoprausach

# Check current deploy command
cat package.json | grep "deploy:tazagroup"

# Should show:
# "deploy:tazagroup": "cp env/.env.prod.tazagroup backend/.env && cp env/.env.prod.tazagroup frontend/.env.local && ..."

# If it shows without 'env/' prefix, the file needs to be updated
```

## Verification

After applying fix, verify:
```bash
cd /mnt/chikiet/kataoffical/shoprausach

# Check env files exist
ls -la env/.env.prod.*

# Test copy command
cp env/.env.prod.tazagroup /tmp/test.env && echo "✅ Copy works"

# Try deploy
bun run deploy:tazagroup
```

## Prevention

To avoid this issue in the future:
1. Always run scripts from project root directory
2. Clear bun cache when making package.json changes
3. Use absolute paths in scripts when possible
4. Restart terminal after major script changes

## Current Status

- ✅ package.json is correct (using `env/.env.prod.*`)
- ✅ All env files exist in `env/` directory
- ✅ Manual cp commands work
- ❌ Bun run command shows old path (likely cache issue)

## Quick Test

```bash
# From project root
cd /mnt/chikiet/kataoffical/shoprausach

# This should work:
cp env/.env.prod.tazagroup backend/.env
echo "✅ If you see this, files are in correct location"

# If this fails, env files are not in env/ directory
```
