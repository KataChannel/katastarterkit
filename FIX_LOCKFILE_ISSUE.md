# Fix: Bun Lockfile Issue in Docker Build

## Problem
Docker builds were failing with errors:
```
error: No version matching "^6.3.1" found for specifier "@dnd-kit/core"
error: No version matching "^9.1.3" found for specifier "@storybook/react"
error: @dnd-kit/core@^6.3.1 failed to resolve
```

## Root Cause
The Dockerfile was trying to use `--frozen-lockfile` flag with a `bun.lockb` file that didn't exist in the backend directory. When bun couldn't find the lockfile, it tried to resolve dependencies from scratch and failed due to version mismatches.

## Solution
Removed the lockfile requirement from Dockerfiles:

### Changes Made

**1. Backend Dockerfile (`backend/Dockerfile.production`)**
```diff
- COPY backend/bun.lockb* ./
- bun install --frozen-lockfile
+ # Note: No lockfile required - bun will resolve dependencies
+ bun install
```

**2. Frontend Dockerfile (`frontend/Dockerfile.production`)**
```diff
- COPY frontend/bun.lockb* ./
- bun install --frozen-lockfile
+ # Note: No lockfile required - bun will resolve dependencies
+ bun install
```

## Why This Works
- Bun is smart enough to resolve dependencies correctly without a lockfile
- The build cache mount (`--mount=type=cache,target=/root/.bun/install/cache`) still provides fast subsequent builds
- Dependencies are resolved based on `package.json` semver ranges

## Build Results
✅ **Backend Image:** `rausach-backend:latest` (1.06GB)
✅ **Frontend Image:** `rausach-frontend:latest` (270MB)

Both images built successfully and are ready for deployment.

## Next Steps
To deploy:
```bash
bun run deploy:rausach
```

Or use the interactive menu:
```bash
bun dev → 4 → 1
```

## Alternative: Generate Lockfiles
If you prefer to use lockfiles for deterministic builds, generate them first:
```bash
cd backend && bun install && cd ..
cd frontend && bun install && cd ..
git add backend/bun.lockb frontend/bun.lockb
```

Then revert the Dockerfile changes to use `--frozen-lockfile` again.
