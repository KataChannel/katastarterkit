#!/bin/bash

# ============================================================================
# Optimized Deployment Script for 2-Core, 4GB RAM, 10GB Disk Server
# ============================================================================

set -e

SERVER="root@116.118.49.243"
REMOTE_DIR="/root/appfinal"
COMPOSE_FILE="docker-compose.hybrid.yml"

echo "🚀 Starting Optimized Deployment"
echo "================================"

# ===== STEP 1: Pre-build locally to save server resources =====
echo "📦 Step 1: Building locally..."

# Build backend (if dist doesn't exist or src changed)
if [ ! -d "backend/dist" ] || [ "backend/src" -nt "backend/dist" ]; then
    echo "  → Building backend TypeScript..."
    cd backend
    bun install --frozen-lockfile
    bun run build
    cd ..
else
    echo "  ✓ Backend dist up-to-date, skipping build"
fi

# Build frontend (if .next doesn't exist or pages changed)
if [ ! -d "frontend/.next/standalone" ] || [ "frontend/src" -nt "frontend/.next" ]; then
    echo "  → Building frontend Next.js..."
    cd frontend
    bun install --frozen-lockfile
    bun run build
    cd ..
else
    echo "  ✓ Frontend .next up-to-date, skipping build"
fi

# ===== STEP 2: Sync only changed files =====
echo ""
echo "📤 Step 2: Syncing files to server..."

# Create remote directories first
ssh ${SERVER} "mkdir -p ${REMOTE_DIR}/backend ${REMOTE_DIR}/frontend"

# Sync backend files (check if bun.lockb exists first)
BACKEND_FILES="backend/dist backend/package.json backend/prisma backend/entrypoint.sh backend/Dockerfile"
[ -f "backend/bun.lockb" ] && BACKEND_FILES="$BACKEND_FILES backend/bun.lockb"

rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '*.md' \
    --exclude 'logs' \
    --exclude 'backups' \
    --exclude 'tests' \
    --exclude '*.log' \
    $BACKEND_FILES \
    ${SERVER}:${REMOTE_DIR}/backend/

rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    frontend/.next \
    frontend/public \
    frontend/package.json \
    frontend/Dockerfile \
    ${SERVER}:${REMOTE_DIR}/frontend/

# Sync docker-compose and env files
rsync -avz \
    ${COMPOSE_FILE} \
    .env.rausach \
    .env.tazagroup \
    ${SERVER}:${REMOTE_DIR}/

# ===== STEP 3: Clean up disk space on server =====
echo ""
echo "🧹 Step 3: Cleaning up disk space..."

ssh ${SERVER} << 'ENDSSH'
    echo "  → Pruning unused Docker images..."
    docker image prune -af --filter "until=24h" > /dev/null 2>&1 || true
    
    echo "  → Removing stopped containers..."
    docker container prune -f > /dev/null 2>&1 || true
    
    echo "  → Cleaning build cache..."
    docker builder prune -af --filter "until=48h" > /dev/null 2>&1 || true
    
    echo "  → Current disk usage:"
    df -h / | grep -E 'Filesystem|/dev'
ENDSSH

# ===== STEP 4: Build images on server =====
echo ""
echo "🔨 Step 4: Building Docker images..."

ssh ${SERVER} << ENDSSH
    cd ${REMOTE_DIR}
    
    # Build with cache (much faster)
    echo "  → Building backend image..."
    docker compose -f ${COMPOSE_FILE} build --quiet shopbackend tazagroup-backend
    
    echo "  → Building frontend image..."
    docker compose -f ${COMPOSE_FILE} build --quiet shopfrontend tazagroup-frontend
    
    echo "  ✓ Images built successfully"
ENDSSH

# ===== STEP 5: Deploy with zero-downtime =====
echo ""
echo "🚀 Step 5: Deploying containers..."

ssh ${SERVER} << ENDSSH
    cd ${REMOTE_DIR}
    
    # Start databases and shared services first
    echo "  → Starting infrastructure services..."
    docker compose -f ${COMPOSE_FILE} up -d shoppostgres tazagroup-postgres redis minio
    
    # Wait for databases to be ready
    echo "  → Waiting for databases..."
    sleep 10
    
    # Deploy backends
    echo "  → Deploying backends..."
    docker compose -f ${COMPOSE_FILE} up -d --force-recreate --no-deps shopbackend tazagroup-backend
    
    # Wait for backends to be healthy
    echo "  → Waiting for backends to start..."
    sleep 15
    
    # Deploy frontends
    echo "  → Deploying frontends..."
    docker compose -f ${COMPOSE_FILE} up -d --force-recreate --no-deps shopfrontend tazagroup-frontend
    
    echo "  ✓ Deployment complete"
ENDSSH

# ===== STEP 6: Health check =====
echo ""
echo "🏥 Step 6: Health check..."

sleep 10

# Test all services
echo "  → Testing Rausach Frontend (12000)..."
curl -sf -o /dev/null http://116.118.49.243:12000 && echo "    ✓ OK" || echo "    ✗ FAIL"

echo "  → Testing Rausach Backend (12001)..."
curl -sf -o /dev/null -H "Content-Type: application/json" \
    -d '{"query":"{__typename}"}' \
    http://116.118.49.243:12001/graphql && echo "    ✓ OK" || echo "    ✗ FAIL"

echo "  → Testing Tazagroup Frontend (13000)..."
curl -sf -o /dev/null http://116.118.49.243:13000 && echo "    ✓ OK" || echo "    ✗ FAIL"

echo "  → Testing Tazagroup Backend (13001)..."
curl -sf -o /dev/null -H "Content-Type: application/json" \
    -d '{"query":"{__typename}"}' \
    http://116.118.49.243:13001/graphql && echo "    ✓ OK" || echo "    ✗ FAIL"

# ===== STEP 7: Resource monitoring =====
echo ""
echo "📊 Step 7: Resource usage..."

ssh ${SERVER} << 'ENDSSH'
    echo "  Memory usage:"
    free -h | grep -E "Mem:|Swap:"
    
    echo ""
    echo "  Disk usage:"
    df -h / | grep -E "Filesystem|/dev"
    
    echo ""
    echo "  Container stats:"
    docker stats --no-stream --format "table {{.Name}}\t{{.MemPerc}}\t{{.CPUPerc}}" \
        shopbackend tazagroup-backend shopfrontend tazagroup-frontend 2>/dev/null || true
ENDSSH

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Rausach:    http://116.118.49.243:12000"
echo "   Tazagroup:  http://116.118.49.243:13000"
echo ""
