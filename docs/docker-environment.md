# Docker Environment Variables Guide

Hướng dẫn chi tiết về cách sử dụng environment variables với Docker Compose trong dự án TimonaCore.

## 📋 Tổng quan

Docker Compose của TimonaCore được cấu hình để sử dụng dynamic environment variables từ file `.env`, cho phép:

- ✅ **Flexible Configuration**: Dễ dàng thay đổi cấu hình mà không cần edit docker-compose.yml
- ✅ **Environment-specific Settings**: Khác nhau giữa development, staging, production
- ✅ **Security**: Sensitive data được lưu trong .env (không commit vào git)
- ✅ **Port Management**: Dễ dàng thay đổi port mappings
- ✅ **Container Naming**: Tùy chỉnh tên containers

## 🔧 Cấu hình Environment Variables

### 1. Application Settings

```bash
# Core application settings
NODE_ENV=development                    # Application environment
PORT=4000                              # Backend API port
FRONTEND_PORT=3000                     # Frontend port
FRONTEND_URL=http://localhost:3000     # CORS origin URL
```

### 2. Database Configuration

```bash
# Local database connection (cho development ngoài Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/timonacore"

# Docker database settings
POSTGRES_DB=timonacore                 # Database name
POSTGRES_USER=postgres                 # Database user
POSTGRES_PASSWORD=postgres             # Database password
POSTGRES_PORT=5432                     # Database port

# Docker internal URL (cho backend container)
DOCKER_DATABASE_URL="postgresql://postgres:postgres@postgres:5432/timonacore"
```

### 3. Redis Configuration

```bash
# Local Redis connection
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=                        # Empty for development

# Docker internal Redis (cho backend container)
DOCKER_REDIS_HOST=redis
```

### 4. MinIO Object Storage

```bash
# Local MinIO connection
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=uploads

# Docker internal MinIO (cho backend container)
DOCKER_MINIO_ENDPOINT=minio
```

### 5. Authentication

```bash
# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
JWT_EXPIRES_IN=7d

# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 6. Docker Container Configuration

```bash
# Container names (có thể customize)
POSTGRES_CONTAINER_NAME=timonacore-postgres
REDIS_CONTAINER_NAME=timonacore-redis
MINIO_CONTAINER_NAME=timonacore-minio
BACKEND_CONTAINER_NAME=timonacore-backend
FRONTEND_CONTAINER_NAME=timonacore-frontend

# Network name
DOCKER_NETWORK_NAME=timonacore-network

# Image tags (cho production builds)
POSTGRES_IMAGE=postgres:16-alpine
REDIS_IMAGE=redis:7.4-alpine
MINIO_IMAGE=minio/minio:RELEASE.2024-08-26T15-33-07Z
```

## 🚀 Cách sử dụng

### 1. Setup Environment

```bash
# Copy template
cp .env.example .env

# Edit values
nano .env

# Validate configuration
./scripts/validate-docker-env.sh
```

### 2. Development Mode

```bash
# Start with development overrides
make docker-dev
# hoặc
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### 3. Production Mode

```bash
# Start with production configuration
make docker-prod
# hoặc
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

## 📁 Docker Compose Files

### 1. `docker-compose.yml` (Base Configuration)

- **Purpose**: Core service definitions
- **Features**: 
  - Dynamic environment variables với `${VAR:-default}` syntax
  - Service dependencies và health checks
  - Volume và network configuration

### 2. `docker-compose.override.yml` (Development)

- **Purpose**: Development-specific overrides
- **Features**:
  - Hot reload với volume mounts
  - Debug ports
  - Development logging
  - Exposed database ports

### 3. `docker-compose.prod.yml` (Production)

- **Purpose**: Production-specific configuration
- **Features**:
  - Resource limits
  - Security hardening
  - No exposed internal ports
  - Production restart policies

## 🔍 Environment Variable Syntax

Docker Compose hỗ trợ nhiều cách để sử dụng environment variables:

```yaml
# Basic substitution
image: ${POSTGRES_IMAGE}

# With default value
image: ${POSTGRES_IMAGE:-postgres:16-alpine}

# In environment section
environment:
  NODE_ENV: ${NODE_ENV:-development}
  DATABASE_URL: ${DOCKER_DATABASE_URL}

# In ports section
ports:
  - "${PORT:-4000}:4000"

# In container names
container_name: ${BACKEND_CONTAINER_NAME:-timonacore-backend}
```

## 🛠️ Management Commands

### Makefile Commands

```bash
# Validate environment
make docker-validate

# Start development
make docker-dev

# Start production
make docker-prod

# View logs
make docker-logs

# Stop services
make docker-down

# Clean everything
make docker-clean
```

### Direct Docker Commands

```bash
# Start with custom env file
docker-compose --env-file .env.staging up -d

# Override specific variables
PORT=8080 FRONTEND_PORT=8081 docker-compose up -d

# Check loaded environment
docker-compose config

# View service configuration
docker-compose config --services
```

## 🔒 Security Best Practices

### 1. Environment Files

```bash
# .env files hierarchy (loaded in order)
.env.local          # Local overrides (git ignored)
.env                # Main environment file (git ignored)
.env.example        # Template (committed to git)
```

### 2. Sensitive Data

```bash
# Use strong secrets
JWT_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 24)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Different secrets per environment
JWT_SECRET_DEV=dev-secret-key
JWT_SECRET_STAGING=staging-secret-key
JWT_SECRET_PROD=production-secret-key
```

### 3. Production Hardening

```bash
# Production environment variables
NODE_ENV=production
DEBUG=false
POSTGRES_LOG_STATEMENT=none
REDIS_PASSWORD=strong-redis-password
MINIO_USE_SSL=true
```

## 🐛 Troubleshooting

### Common Issues

1. **"Variable not found" error**
   ```bash
   # Check .env file exists and is properly formatted
   cat .env | grep -v '^#' | grep -v '^$'
   
   # Validate environment
   ./scripts/validate-docker-env.sh
   ```

2. **Port conflicts**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Change port in .env
   FRONTEND_PORT=3001
   ```

3. **Container name conflicts**
   ```bash
   # Stop existing containers
   docker-compose down
   
   # Remove old containers
   docker container prune
   
   # Use different names
   BACKEND_CONTAINER_NAME=timonacore-backend-v2
   ```

4. **Environment not loading**
   ```bash
   # Check Docker Compose loads .env
   docker-compose config
   
   # Manually specify env file
   docker-compose --env-file .env up
   ```

### Debug Commands

```bash
# Check loaded configuration
docker-compose config

# Check environment variables in container
docker-compose exec backend env

# Check logs for environment issues
docker-compose logs backend | grep -i env

# Validate Docker Compose syntax
docker-compose config --quiet
```

## 📊 Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Application environment |
| `PORT` | No | `4000` | Backend API port |
| `FRONTEND_PORT` | No | `3000` | Frontend port |
| `POSTGRES_DB` | Yes | - | Database name |
| `POSTGRES_USER` | Yes | - | Database username |
| `POSTGRES_PASSWORD` | Yes | - | Database password |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `MINIO_ACCESS_KEY` | Yes | - | MinIO access key |
| `MINIO_SECRET_KEY` | Yes | - | MinIO secret key |

## 📞 Support

### Debug Steps

1. Run validation script: `./scripts/validate-docker-env.sh`
2. Check Docker Compose config: `docker-compose config`
3. Verify environment loading: `docker-compose exec backend env`
4. Check service logs: `docker-compose logs [service]`

### Getting Help

- 📖 Docker Compose documentation: https://docs.docker.com/compose/
- 🐛 Project issues: Create an issue in the repository
- 💬 Environment questions: Check this documentation first
