# Docker Build Fix: NODE_ENV Warning in Next.js Build

## Problem
```
⚠ You are using a non-standard "NODE_ENV" value in your environment. 
This creates inconsistencies in the project and is strongly advised against.
```

The frontend Docker build was failing with a warning about non-standard `NODE_ENV` value.

## Root Cause
In the `frontend/Dockerfile`, the **builder stage** was not explicitly setting `NODE_ENV=production` before running `bun --bun next build`. 

When `docker-compose` passes `NODE_ENV=${NODE_ENV:-development}` to the container, if NODE_ENV is undefined in the docker-compose environment, it defaults to `development`. However, during the multi-stage build, environment variables from docker-compose are NOT automatically inherited by the build stages.

The build was inheriting whatever NODE_ENV was set in the base image or build context, which Next.js considers non-standard.

## Solution
✅ **Added explicit `NODE_ENV=production` in the builder stage**

### Changed in `frontend/Dockerfile`:

**Before:**
```dockerfile
# Build stage
FROM oven/bun:1.1.34 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun --bun next build
```

**After:**
```dockerfile
# Build stage
FROM oven/bun:1.1.34 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry and set production environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun --bun next build
```

## Why This Works

1. **Explicit NODE_ENV=production** - Next.js recognizes `production` as a standard value
2. **Build-time consistency** - The build happens with `NODE_ENV=production`, optimizing the bundle for production
3. **Runtime override** - The production stage and docker-compose can still override NODE_ENV for runtime behavior if needed

## NODE_ENV Values

Next.js officially supports these NODE_ENV values:
- `production` - Optimized build, no debug info
- `development` - Development build with source maps
- `test` - Testing environment (rarely used in Docker)

Any other value triggers the warning and may cause inconsistent behavior.

## Files Modified
- `/frontend/Dockerfile` - Added `ENV NODE_ENV=production` in builder stage

## Testing the Fix

Rebuild the Docker image:
```bash
docker-compose build frontend
```

The warning should no longer appear during the build process:
```
=> [frontend builder 5/5] RUN bun --bun next build
# Should complete without NODE_ENV warnings
```

## Related Files
- `docker-compose.yml` - Still passes NODE_ENV to the runtime container (this is correct)
- `frontend/Dockerfile` - Now explicitly sets NODE_ENV for build stage (this is the fix)

---

**Date Fixed:** 2025-10-24  
**Impact:** Prevents build warnings and ensures consistent Next.js build behavior
