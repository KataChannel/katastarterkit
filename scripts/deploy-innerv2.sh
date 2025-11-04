#!/bin/bash

# Deploy Innerv2 to Production Server
# Usage: ./scripts/deploy-innerv2.sh

set -e

SERVER_IP="116.118.48.208"
SERVER_USER="root"
REMOTE_DIR="/root/innerv2"
ENV_FILE=".env.prod.innerv2"

echo "🚀 DEPLOYING INNERV2 TO PRODUCTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Server: ${SERVER_IP}"
echo "Directory: ${REMOTE_DIR}"
echo ""

# Step 0: Check and create environment file if not exists
echo "🔍 Step 0/7: Checking environment file..."
if [ ! -f "${ENV_FILE}" ]; then
    echo "⚠️  ${ENV_FILE} not found. Creating with default configuration..."
    
    cat > ${ENV_FILE} << 'ENVEOF'
# ============================================================================
# INNERV2 PRODUCTION ENVIRONMENT
# ============================================================================

NODE_ENV=production

# Server Configuration
PORT=13001
FRONTEND_PORT=13000
FRONTEND_URL=http://116.118.48.208:13000
API_URL=http://116.118.48.208:13001

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@116.118.48.208:13003/innerv2core"
POSTGRES_DB=innerv2core
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=13003

# Redis Configuration (Shared)
REDIS_HOST=116.118.48.208
REDIS_PORT=12004
REDIS_PASSWORD=

# MinIO Configuration (Shared)
MINIO_ENDPOINT=116.118.48.208
MINIO_PORT=12007
MINIO_CONSOLE_PORT=12008
MINIO_ACCESS_KEY=minio-admin
MINIO_SECRET_KEY=minio-secret-2025
MINIO_BUCKET_NAME=innerv2-uploads
MINIO_USE_SSL=false

# JWT Configuration
JWT_SECRET=innerv2-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=7d

# NextAuth Configuration
NEXTAUTH_SECRET=innerv2-nextauth-secret-change-this-in-production
NEXTAUTH_URL=http://116.118.48.208:13000

# API Endpoints
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT=ws://116.118.48.208:13001/graphql
NEXT_PUBLIC_API_URL=http://116.118.48.208:13001
NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000

# Next.js Optimization
NEXT_OTEL_ENABLED=false
NEXT_TELEMETRY_DISABLED=1

# Container Names
POSTGRES_CONTAINER_NAME=innerv2-postgres
BACKEND_CONTAINER_NAME=innerv2-backend
FRONTEND_CONTAINER_NAME=innerv2-frontend

# Docker Network
DOCKER_NETWORK_NAME=innerv2-network
ENVEOF

    echo "✅ Created ${ENV_FILE}"
    echo ""
    echo "⚠️  IMPORTANT: Update these production secrets later:"
    echo "   - JWT_SECRET"
    echo "   - NEXTAUTH_SECRET"
    echo "   - POSTGRES_PASSWORD"
    echo ""
else
    echo "✅ Environment file found: ${ENV_FILE}"
fi

# Step 1: Create remote directory
echo "📁 Step 1/7: Creating remote directory..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${REMOTE_DIR}"

# Step 1.5: Build locally before copying
echo "🏗️  Step 1.5/7: Building backend and frontend locally..."
echo "Building backend..."
cd backend
if [ ! -d "dist" ]; then
    echo "  Installing backend dependencies..."
    bun install
    echo "  Building backend..."
    bun run build
else
    echo "  ✅ Backend dist already exists"
fi
cd ..

echo "Building frontend..."
cd frontend
if [ ! -d ".next" ]; then
    echo "  Installing frontend dependencies..."
    bun install
    echo "  Building frontend..."
    bun run build
else
    echo "  ✅ Frontend .next already exists"
fi
cd ..
echo "✅ Local builds complete"

# Step 2: Copy files
echo "📦 Step 2/7: Copying files to server..."
rsync -avz --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'backend/node_modules' \
  --exclude 'frontend/node_modules' \
  --exclude 'frontend/.next' \
  --exclude 'backend/dist' \
  --exclude '.env*' \
  ./ ${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/

# Step 3: Copy environment file
echo "🔧 Step 3/7: Copying environment file..."
scp ${ENV_FILE} ${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/${ENV_FILE}
echo "✅ Environment file copied successfully"

# Step 4: Cleanup Docker
echo "🧹 Step 4/7: Cleaning up Docker resources..."
ssh ${SERVER_USER}@${SERVER_IP} "bash -s" << 'CLEANUP_EOF'
    echo "Stopping old containers..."
    docker compose -f /root/innerv2/docker-compose.innerv2.yml down 2>/dev/null || true
    
    echo "Removing old images..."
    docker rmi innerv2-innerv2-backend 2>/dev/null || true
    docker rmi innerv2-innerv2-frontend 2>/dev/null || true
    
    echo "Cleaning Docker system..."
    docker system prune -af --filter "until=24h"
    
    echo "✅ Cleanup complete"
CLEANUP_EOF

# Step 5: Setup database
echo "🗄️  Step 5/7: Setting up database..."
ssh ${SERVER_USER}@${SERVER_IP} "bash -s" << 'DB_EOF'
    # Check if innerv2-postgres container exists
    if ! docker ps -a --format '{{.Names}}' | grep -q '^innerv2-postgres$'; then
        echo "Creating innerv2-postgres container..."
        docker run -d \
          --name innerv2-postgres \
          --restart unless-stopped \
          -e POSTGRES_DB=innerv2core \
          -e POSTGRES_USER=postgres \
          -e POSTGRES_PASSWORD=postgres \
          -p 13003:5432 \
          -v innerv2-postgres-data:/var/lib/postgresql/data \
          postgres:16-alpine
        
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5
        echo "✅ PostgreSQL container created"
    else
        echo "✅ PostgreSQL container already exists"
        # Start if not running
        docker start innerv2-postgres 2>/dev/null || true
    fi
    
    # Verify database exists
    sleep 2
    docker exec innerv2-postgres psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='innerv2core'" | grep -q 1 && \
        echo "✅ Database innerv2core exists" || \
        (docker exec innerv2-postgres psql -U postgres -c "CREATE DATABASE innerv2core;" && echo "✅ Database innerv2core created")
DB_EOF

# Step 6: Build and Deploy
echo "🏗️  Step 6/7: Building and deploying containers..."
ssh ${SERVER_USER}@${SERVER_IP} "bash -s" << 'DEPLOY_EOF'
    cd /root/innerv2
    
    # Auto-detect docker-compose command
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_CMD="docker compose"
    fi
    
    echo "Using: $COMPOSE_CMD"
    
    # Build and start
    echo "Building containers..."
    $COMPOSE_CMD -f docker-compose.innerv2.yml build --no-cache
    
    echo "Starting containers..."
    $COMPOSE_CMD -f docker-compose.innerv2.yml up -d
    
    echo "✅ Deployment complete"
DEPLOY_EOF

# Step 7: Verify deployment
echo "✅ Step 7/7: Verifying deployment..."
sleep 5

ssh ${SERVER_USER}@${SERVER_IP} "bash -s" << 'VERIFY_EOF'
    cd /root/innerv2
    
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        COMPOSE_CMD="docker compose"
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 CONTAINER STATUS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    $COMPOSE_CMD -f docker-compose.innerv2.yml ps
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "💾 MEMORY USAGE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.CPUPerc}}" \
      innerv2-backend innerv2-frontend innerv2-postgres
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 URLs"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Frontend: http://116.118.48.208:13000"
    echo "Backend:  http://116.118.48.208:13001/graphql"
    echo "Database: 116.118.48.208:13003"
VERIFY_EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Test URLs:"
echo "  curl http://116.118.48.208:13000"
echo "  curl http://116.118.48.208:13001/graphql"
echo ""
echo "📋 View logs:"
echo "  ssh root@116.118.48.208 'cd /root/innerv2 && docker compose -f docker-compose.innerv2.yml logs -f'"
echo ""
echo "📊 Check status:"
echo "  ssh root@116.118.48.208 'docker ps --filter name=innerv2'"
echo ""
echo "⚠️  Security reminder: Update production secrets in ${ENV_FILE}:"
echo "   - JWT_SECRET"
echo "   - NEXTAUTH_SECRET"
echo "   - POSTGRES_PASSWORD"
echo ""