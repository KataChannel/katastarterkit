# TimonaCore - Port Configuration Update

## Updated Port Configuration

✅ **Application Services**
- **Frontend (Next.js)**: http://localhost:13000
- **Backend (NestJS + GraphQL)**: http://localhost:14000
- **GraphQL Playground**: http://localhost:14000/graphql

✅ **Infrastructure Services**
- **PostgreSQL Database**: localhost:15432
- **Redis Cache**: localhost:16379
- **MinIO Object Storage**: localhost:19001
- **MinIO Console**: http://localhost:9001

## Configuration Files Updated

### 1. Root Environment (`.env`)
```properties
# Application
PORT=14000
FRONTEND_URL=http://localhost:13000

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/timonacore"
POSTGRES_PORT=15432

# Minio Object Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=19001
```

### 2. Backend Environment (`backend/.env.local`)
```properties
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:15432/timonacore"

# Minio Object Storage
MINIO_PORT=19001
```

### 3. Frontend Configuration
- **Package.json**: Updated dev script to use port 13000
  ```json
  "dev": "next dev -p 13000"
  ```

- **Next.config.js**: Updated MinIO port reference
  ```javascript
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '19001',
    pathname: '/uploads/**',
  }
  ```

- **Environment**: GraphQL endpoint points to backend at port 14000
  ```properties
  NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:14000/graphql
  NEXT_PUBLIC_API_URL=http://localhost:14000
  ```

## Deployment Status

✅ **Docker Services**: All running and healthy
- PostgreSQL: Healthy on port 15432
- Redis: Healthy on port 16379  
- MinIO: Healthy on port 19001

✅ **Backend Server**: Running successfully
- NestJS application started
- GraphQL schema generated
- Database connected on port 15432
- GraphQL endpoint responding at /graphql

✅ **Frontend Server**: Running successfully
- Next.js 14.2.5 running on port 13000
- React 18 + TailwindCSS configured
- GraphQL client configured to connect to backend

## Testing

### Backend API Test
```bash
curl -X POST http://localhost:14000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ hello version }"}'

# Response:
{"data":{"hello":"Hello from TimonaCore GraphQL API!","version":"1.1.0"}}
```

### Service Access URLs
- **Frontend Application**: http://localhost:13000
- **Backend API**: http://localhost:14000
- **GraphQL Playground**: http://localhost:14000/graphql
- **MinIO Console**: http://localhost:9001

## Summary

✅ All services successfully updated to new port configuration
✅ Database migrated and connected on new port (15432)
✅ Frontend and backend communication verified
✅ GraphQL API responding correctly
✅ All infrastructure services healthy

The TimonaCore fullstack application is now deployed with the requested port configuration and all services are operational.
