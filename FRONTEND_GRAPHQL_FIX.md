# Frontend GraphQL Endpoint Fix - Production Deployment

## Problem
Frontend container vẫn cố gọi `http://localhost:12001/graphql` thay vì backend service thực tế khi deploy lên server.

## Root Cause

### Development Environment (Local)
- Frontend (localhost:12000) + Backend (localhost:12001) = tách rời
- Environment: `.env` + localhost hardcoding
- Apollo Client fallback: `http://localhost:14000/graphql`

### Production Environment (Docker)
- Frontend container + Backend container = trong same Docker network
- **WRONG**: Frontend vẫn dùng localhost → không thể reach backend
- **CORRECT**: Frontend phải dùng Docker service name `http://backend:4000/graphql`

### Example Scenarios

**Không hoạt động (khi deploy):**
```javascript
// frontend/.env + local development fallback
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql
// Container không thể reach localhost, vì localhost = container itself!
```

**Hoạt động (production):**
```javascript
// frontend/.env.production + Docker network
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://backend:4000/graphql
// backend = Docker service name in docker-compose.yml
// 4000 = port bên trong container
```

## Solution Implemented

### 1. Created `.env.production` Files

**frontend/.env.production:**
```
NODE_ENV=production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://backend:4000/graphql
NEXTAUTH_URL=http://localhost
# Các biến khác...
```

**backend/.env.production:**
```
NODE_ENV=production
FRONTEND_URL=http://frontend:3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/rausachcore
REDIS_HOST=redis
ELASTICSEARCH_URL=http://elasticsearch:9200
MINIO_ENDPOINT=minio
# Các biến khác...
```

### 2. Updated Frontend Dockerfile

**Added .env files copy step:**
```dockerfile
# Copy environment files for production build
COPY frontend/.env* ./
```

**Why?** Next.js build process phải có access tới .env.production để correctly embed `NEXT_PUBLIC_*` biến vào static bundle.

### 3. Updated Deployment Script (3deploy.sh)

**Added environment verification:**
```bash
# Ensure .env.production exists for frontend
if [ ! -f "frontend/.env.production" ]; then
    echo "⚠️  frontend/.env.production not found, using development .env"
fi
```

**Added explanation output:**
```bash
echo "🚀 Starting deployment with production environment..."
echo "   - Frontend will use .env.production with NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://backend:4000/graphql"
echo "   - Backend will communicate via Docker network"
```

## How It Works Now

### Build Time
1. Docker build frontend image
2. Dockerfile copies `frontend/.env*` vào build context
3. Next.js build process nhận biến từ `.env.production` (NODE_ENV=production)
4. `NEXT_PUBLIC_GRAPHQL_ENDPOINT` embedded vào JavaScript bundle
5. Value: `http://backend:4000/graphql`

### Runtime
1. Frontend container starts
2. Apollo Client loads → đọc `http://backend:4000/graphql` từ bundle
3. Frontend container trong Docker network
4. DNS resolver chuyển `backend` → service `backend` trong docker-compose.yml
5. Request tới port 4000 của backend container ✅

### Docker Network Magic
```yaml
# docker-compose.yml
services:
  backend:        # Service name = DNS name inside network
    ports:
      - "12001:4000"   # host:container
    networks:
      - rausachcore-network

  frontend:       # Service name = DNS name inside network
    ports:
      - "12000:3000"   # host:container
    networks:
      - rausachcore-network

# Inside frontend container:
# - localhost = frontend container itself (WRONG)
# - backend:4000 = backend service (CORRECT) ✅
# - backend = DNS resolves to backend service container
```

## Verification

### Check if fix worked

**Inside frontend container:**
```bash
docker exec rausachcore-frontend cat /app/.env.production
# Should show: NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://backend:4000/graphql
```

**Check Apollo Client logs:**
```javascript
// Browser console / server logs
// Should see requests to http://backend:4000/graphql
// NOT http://localhost:12001/graphql
```

**Network test inside container:**
```bash
docker exec rausachcore-frontend curl -s http://backend:4000/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{__typename}"}'
# Should return GraphQL response (not connection refused)
```

## Environment Variable Priority

**Next.js loads environment in this order:**

1. `.env.local` (local machine only)
2. `.env.production` (if NODE_ENV=production)
3. `.env` (fallback)
4. System environment variables
5. Hardcoded fallback in code

**For Docker production build:**
- `NODE_ENV=production` (set in Dockerfile)
- → Next.js loads `.env.production` ✅
- → `NEXT_PUBLIC_*` variables embedded into build

**Important:** `NEXT_PUBLIC_*` variables must be set at **build time**, not runtime!

## Troubleshooting

### If frontend still shows localhost

**Check 1:** Verify Dockerfile includes env files
```bash
# Check built image
docker run --rm rausachcore-frontend cat /app/.env.production
```

**Check 2:** Verify NODE_ENV=production during build
```dockerfile
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
```

**Check 3:** Check build logs
```bash
docker compose build --no-cache frontend 2>&1 | grep -i "NEXT_PUBLIC"
```

**Check 4:** Inspect bundle
```bash
# Inside container, check actual loaded endpoint
docker exec rausachcore-frontend grep -r "backend:4000" .next/
```

### If backend can't reach frontend

**Use** `FRONTEND_URL=http://frontend:3000` in backend `.env.production`

**Not** `http://localhost:12000` (localhost = backend container)

## Deployment Command

```bash
# Push changes with new .env.production files
git add frontend/.env.production backend/.env.production frontend/Dockerfile scripts/3deploy.sh
git commit -m "fix: use Docker network for GraphQL endpoint in production"
git push

# Run deployment
bash scripts/3deploy.sh
```

## Files Changed

1. ✅ `frontend/.env.production` - NEW
2. ✅ `backend/.env.production` - NEW
3. ✅ `frontend/Dockerfile` - Updated to copy env files
4. ✅ `scripts/3deploy.sh` - Updated with environment verification

## Reference

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Docker Compose Networking](https://docs.docker.com/compose/networking/)
- [Apollo Client Configuration](https://www.apollographql.com/docs/react/networking/authentication/)
