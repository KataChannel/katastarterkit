# Frontend CSS/JS Loading Fix ✅

## Issue
Frontend at http://116.118.48.208:12000 was not loading CSS and JavaScript files, showing plain HTML without styling.

```
HTTP/1.1 404 Not Found
/_next/static/css/35b2bf174148f9cd.css
```

## Root Cause
The Dockerfile was copying `.next/static` files to the wrong location:

**Problem:**
1. Next.js standalone build creates: `/app/frontend/.next/standalone/` structure
2. Server runs from `/app/frontend/` (executes `frontend/server.js`)
3. When server looks for static files, it searches relative to working directory: `/app/frontend/.next/static/`
4. But Dockerfile was copying `.next/static` to `/app/.next/static/`
5. Result: Server couldn't find files → 404 errors

**Directory Structure:**
```
/app/
├── frontend/              (copied from .next/standalone/frontend/)
│   ├── .next/
│   │   ├── app/
│   │   ├── server/        (Next.js server files)
│   │   └── static/        ← Server looks HERE (was empty!)
│   └── server.js          (entry point, run from /app/frontend/)
├── node_modules/
└── package.json
```

## Solution
Changed Dockerfile to copy `.next/static/` to the correct location:

### Before (Broken):
```dockerfile
# Copying to wrong location
COPY --chown=nextjs:nodejs frontend/.next/static/ ./.next/static/
# Creates /app/.next/static/ but server looks at /app/frontend/.next/static/
```

### After (Fixed):
```dockerfile
# Copy static files to correct location
COPY --chown=nextjs:nodejs frontend/.next/static/ ./frontend/.next/static/
# Now /app/frontend/.next/static/ where server expects it!
```

## Files Modified
- `frontend/Dockerfile` - Corrected `.next/static` copy destination

## Verification

### Test 1: CSS File Access
```bash
curl -sI http://116.118.48.208:12000/_next/static/css/35b2bf174148f9cd.css
# ✅ Result: HTTP/1.1 200 OK
```

### Test 2: HTML Includes CSS/JS
```bash
curl http://116.118.48.208:12000 | grep "stylesheet\|<script"
# ✅ Result: Multiple CSS and JS files loaded
```

### Test 3: Cache Headers
```
Cache-Control: public, max-age=31536000, immutable
# ✅ Static assets properly cached for 1 year
```

## Frontend Structure

### What .next/standalone Contains
```
.next/standalone/
├── frontend/                      (the actual app)
│   ├── .next/
│   │   ├── BUILD_ID
│   │   ├── app-path-routes-manifest.json
│   │   ├── build-manifest.json
│   │   ├── prerender-manifest.json
│   │   ├── routes-manifest.json
│   │   ├── required-server-files.json
│   │   └── server/               (Next.js server build)
│   ├── node_modules/             (bundled dependencies)
│   ├── .env
│   ├── .env.production
│   ├── server.js                 (Next.js server entry)
│   └── package.json
├── node_modules/                 (top-level dependencies)
└── package.json
```

### Why Structure Matters
- Server runs from `/app/frontend/` (working directory)
- Server executes `node frontend/server.js`
- `__dirname` in `server.js` = `/app/frontend/`
- Static files must be at `/app/frontend/.next/static/` (relative to `__dirname`)
- If placed at `/app/.next/static/`, server can't find them

## Deployment

### Build & Deploy Process
```bash
# 1. Build frontend locally
cd frontend && npm run build
# Creates .next/ folder with all build artifacts

# 2. Deploy with fix
cd .. && ./scripts/95copy.sh
# Copies .next/static/ to correct location in Docker
```

### Docker Build Flow
```
FROM node:22-alpine
WORKDIR /app
COPY frontend/.next/standalone/ ./
  # Copies frontend/ directory to /app/frontend/
COPY frontend/node_modules/ ./node_modules/
  # Copies top-level node_modules
COPY frontend/.next/static/ ./frontend/.next/static/
  # IMPORTANT: Copies to frontend/.next/static/
CMD ["node", "frontend/server.js"]
  # Runs from /app, executes /app/frontend/server.js
```

## Performance Improvements

### Cache Headers
```
Cache-Control: public, max-age=31536000, immutable
```
- Static assets cached for 1 year
- Reduces server load
- Faster page loads for returning users

### File Sizes
- CSS files: ~150KB + 2.2KB + 32KB = 184KB
- JS files: Multiple chunks, optimal splitting
- Compression: Brotli/gzip enabled

## Testing Commands

```bash
# Test CSS loads
curl -I http://116.118.48.208:12000/_next/static/css/35b2bf174148f9cd.css

# Test JavaScript loads
curl -I http://116.118.48.208:12000/_next/static/chunks/webpack-8ea77f8cbd5bd9c0.js

# Test images load
curl -I http://116.118.48.208:12000/_next/static/media/e4af272ccee01ff0-s.p.woff2

# Verify HTML includes references
curl http://116.118.48.208:12000 | grep "stylesheet"
curl http://116.118.48.208:12000 | grep "<script"
```

## Related Configuration

### Next.js Config
```javascript
export const config = {
  distDir: "./.next",
  cleanDistDir: true,
  output: "standalone",  // Creates standalone build
  // ...
}
```

### Entry Point
The server.js expects:
- Working directory: current dir
- `.next` folder: in current dir
- When run as `node frontend/server.js`, expects `.next` at `frontend/.next/`

## Summary

| Issue | Cause | Fix |
|-------|-------|-----|
| CSS 404 errors | Wrong copy path | Copy to `./frontend/.next/static/` |
| JS 404 errors | Server can't find files | Align with working directory |
| Static assets fail | Directory mismatch | Use correct relative paths |

---

**Status**: ✅ FIXED  
**Date**: October 27, 2025  
**Deployment**: Production (116.118.48.208)  
**Frontend**: ✅ Loading with CSS/JS  
**CSS Files**: ✅ 200 OK  
**JavaScript**: ✅ 200 OK  
**Images**: ✅ 200 OK  
**Cache**: ✅ 1-year immutable caching  
