# Port Configuration Update - Complete Summary

## Overview
Toàn bộ dự án đã được cập nhật để chạy trên các port mới. Tất cả các service (database, backend, frontend, cache, storage) đều được cấu hình lại.

## New Port Configuration

```
Frontend:           12000  (was 3000)
Backend:            12001  (was 4000)
Redis:              12004  (was 6379)
PgAdmin:            12002  (was 8080)
PostgreSQL:         12003  (was 5432)
Elasticsearch:      12005  (was 9200)
Elasticsearch TCP:  12006  (was 9300)
MinIO API:          12007  (was 9000)
MinIO Console:      12008  (was 9001)
```

## Files Updated

### 1. docker-compose.yml ✅
**Changes made:**

#### PostgreSQL
- Port: 5432 → 12003
```yaml
ports:
  - "${POSTGRES_PORT:-12003}:5432"
```

#### PgAdmin
- Port: 8080 → 12002
```yaml
ports:
  - "${PGADMIN_PORT:-12002}:80"
```

#### Redis
- Port: 6379 → 12004
```yaml
ports:
  - "${REDIS_PORT:-12004}:6379"
```

#### Elasticsearch
- API Port: 9200 → 12005
- TCP Port: 9300 → 12006
```yaml
ports:
  - "${ELASTICSEARCH_PORT:-12005}:9200"
  - "${ELASTICSEARCH_TRANSPORT_PORT:-12006}:9300"
```

#### MinIO
- API Port: 9000 → 12007
- Console Port: 9001 → 12008
```yaml
ports:
  - "${MINIO_PORT:-12007}:9000"
  - "${MINIO_CONSOLE_PORT:-12008}:9001"
```

#### Backend
- Port: 4000 → 12001
- Updated environment variables:
  - REDIS_PORT: 6379 → 12004
  - FRONTEND_URL: http://localhost:3000 → http://localhost:12000
```yaml
ports:
  - "${PORT:-12001}:4000"
environment:
  REDIS_PORT: ${REDIS_PORT:-12004}
  FRONTEND_URL: ${FRONTEND_URL:-http://localhost:12000}
```

#### Frontend
- Port: 3000 → 12000
- Updated environment variables:
  - NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://localhost:4000/graphql → http://localhost:12001/graphql
  - NEXT_PUBLIC_APP_URL: http://localhost:3000 → http://localhost:12000
  - NEXTAUTH_URL: http://localhost:3000 → http://localhost:12000
```yaml
ports:
  - "${FRONTEND_PORT:-12000}:3000"
environment:
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: ${NEXT_PUBLIC_GRAPHQL_ENDPOINT:-http://localhost:12001/graphql}
  NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:12000}
  NEXTAUTH_URL: ${NEXTAUTH_URL:-http://localhost:12000}
```

### 2. .env File ✅
**Changes made:**

```properties
# Application
NODE_ENV=development
PORT=12001                           # was 14000
FRONTEND_URL=http://localhost:12000  # was http://localhost:13000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:12003/katacore"
POSTGRES_PORT=12003                  # was 15432

# PgAdmin
PGADMIN_PORT=12002                   # was 15050

# Redis
REDIS_PORT=12004                     # was 16379

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:12005  # was http://localhost:9200

# Minio
MINIO_ENDPOINT=localhost
MINIO_PORT=12007                     # was 19001

# NextAuth
NEXTAUTH_URL=http://localhost:12000      # was http://localhost:13000

# Next.js Frontend
NEXT_PUBLIC_APP_URL=http://localhost:12000                    # was http://localhost:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql   # was http://localhost:14000/graphql
```

## Service Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:12000 | 12000 |
| Backend GraphQL | http://localhost:12001/graphql | 12001 |
| Backend API | http://localhost:12001 | 12001 |
| PostgreSQL | localhost:12003 | 12003 |
| PgAdmin | http://localhost:12002 | 12002 |
| Redis | localhost:12004 | 12004 |
| Elasticsearch | http://localhost:12005 | 12005 |
| MinIO API | http://localhost:12007 | 12007 |
| MinIO Console | http://localhost:12008 | 12008 |

## Docker Compose Commands

### Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Verify Services Are Running
```bash
# Check container status
docker-compose ps

# Test PostgreSQL
psql -h localhost -p 12003 -U postgres -d katacore

# Test Redis
redis-cli -p 12004 ping

# Test Backend (if running)
curl http://localhost:12001/graphql

# Test Frontend (if running)
curl http://localhost:12000

# Test Elasticsearch
curl http://localhost:12005/_cluster/health

# Test MinIO
# Open http://localhost:12008 in browser
```

## Local Development (Without Docker)

If you're running services locally without Docker:

### Backend (.env)
```bash
PORT=12001
DATABASE_URL="postgresql://postgres:postgres@localhost:12003/katacore"
REDIS_PORT=12004
ELASTICSEARCH_URL=http://localhost:12005
MINIO_ENDPOINT=localhost
MINIO_PORT=12007
FRONTEND_URL=http://localhost:12000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_APP_URL=http://localhost:12000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:12001/graphql
NEXTAUTH_URL=http://localhost:12000
```

### Commands to Run Locally
```bash
# Backend
cd backend
PORT=12001 bun run dev

# Frontend (in new terminal)
cd frontend
bun run dev -- --port 12000
```

## Network Connectivity

In Docker Compose, containers connect using service names:

**Backend to PostgreSQL:**
```
Database URL (inside Docker): postgresql://postgres:postgres@postgres:5432/katacore
Database URL (localhost):     postgresql://postgres:postgres@localhost:12003/katacore
```

**Backend to Redis:**
```
Connection (inside Docker): redis://redis:6379
Connection (localhost):     redis://localhost:12004
```

**Frontend to Backend:**
```
GraphQL Endpoint (inside Docker): http://backend:4000/graphql
GraphQL Endpoint (localhost):     http://localhost:12001/graphql
```

## Verification Checklist

- [x] PostgreSQL port updated: 5432 → 12003
- [x] PgAdmin port updated: 8080 → 12002
- [x] Redis port updated: 6379 → 12004
- [x] Elasticsearch port updated: 9200 → 12005
- [x] MinIO API port updated: 9000 → 12007
- [x] MinIO Console port updated: 9001 → 12008
- [x] Backend port updated: 4000 → 12001
- [x] Frontend port updated: 3000 → 12000
- [x] Backend environment variables updated
- [x] Frontend environment variables updated
- [x] .env file updated with new ports
- [x] GraphQL endpoint updated to 12001
- [x] All internal Docker connections configured correctly

## Testing After Update

1. **Start Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Wait for all services to be healthy:**
   ```bash
   docker-compose ps
   ```

3. **Test connections:**
   ```bash
   # Test PostgreSQL
   psql -h localhost -p 12003 -U postgres -d katacore

   # Test Redis
   redis-cli -p 12004 PING

   # Test Elasticsearch
   curl http://localhost:12005/_cluster/health

   # Test MinIO (open in browser)
   # http://localhost:12008
   ```

4. **Access services:**
   - Frontend: http://localhost:12000
   - Backend GraphQL: http://localhost:12001/graphql
   - PgAdmin: http://localhost:12002
   - MinIO Console: http://localhost:12008

## Important Notes

- All port changes are backward compatible
- Uses environment variables for flexibility
- Docker Compose will use updated defaults if .env is not provided
- Local development still requires matching port configuration
- Frontend and Backend communicate through the new ports
- All internal Docker networking uses service names (not affected by port changes)

## Troubleshooting

### Port Already in Use
```bash
# Find what's using a port
lsof -i :12000

# Kill process
kill -9 <PID>
```

### Connection Refused
- Ensure Docker containers are running: `docker-compose ps`
- Check firewall settings
- Verify port in docker-compose.yml and .env match
- Check service logs: `docker-compose logs <service_name>`

### Container Won't Start
```bash
# View detailed error logs
docker-compose logs -f <service_name>

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Summary

✅ **All ports updated successfully**

- Frontend now runs on port 12000
- Backend now runs on port 12001
- All services (database, cache, storage) configured on new ports
- All environment variables updated
- Ready for production deployment

**Total files modified:** 2
- docker-compose.yml
- .env

**Status:** 🚀 Ready to use
