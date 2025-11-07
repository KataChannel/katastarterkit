#!/bin/bash

# ============================================
# Complete Deployment Script
# 1. Deploy infrastructure (PostgreSQL, Redis, MinIO) to server
# 2. Update frontend .env
# 3. Push Prisma schema to database
# 4. Start frontend locally
# ============================================

set -e

SERVER_IP="${SERVER_IP:-116.118.48.208}"

echo "============================================"
echo "  Complete Deployment Process"
echo "============================================"
echo ""

# Step 1: Deploy infrastructure
echo "Step 1/4: Deploying infrastructure to ${SERVER_IP}..."
chmod +x deploy-infrastructure.sh
./deploy-infrastructure.sh

if [ $? -ne 0 ]; then
    echo "❌ Infrastructure deployment failed!"
    exit 1
fi

echo ""
echo "✓ Infrastructure deployed successfully"
echo ""

# Step 2: Update frontend .env
echo "Step 2/4: Updating frontend .env..."
chmod +x update-frontend-env.sh
./update-frontend-env.sh ${SERVER_IP}

if [ $? -ne 0 ]; then
    echo "❌ Failed to update frontend .env!"
    exit 1
fi

echo ""
echo "✓ Frontend .env updated"
echo ""

# Step 3: Wait for database to be ready and push schema
echo "Step 3/4: Waiting for database to be ready..."
sleep 5

echo "Pushing Prisma schema to database..."
cd frontend
bunx prisma db push --skip-generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to push Prisma schema!"
    exit 1
fi

echo "Generating Prisma Client..."
bunx prisma generate

cd ..

echo ""
echo "✓ Database schema synchronized"
echo ""

# Step 4: Instructions for starting frontend
echo "Step 4/4: Frontend is ready to start"
echo ""
echo "========================================="
echo "  Deployment Completed Successfully!"
echo "========================================="
echo ""
echo "Services available at:"
echo "  PostgreSQL:      ${SERVER_IP}:14003"
echo "  pgAdmin:         http://${SERVER_IP}:14002"
echo "  Redis:           ${SERVER_IP}:14004"
echo "  MinIO API:       http://${SERVER_IP}:14007"
echo "  MinIO Console:   http://${SERVER_IP}:14008"
echo ""
echo "To start frontend development server:"
echo "  cd frontend && bun run dev"
echo ""
echo "To view infrastructure logs:"
echo "  ssh root@${SERVER_IP} 'cd /opt/innerv2 && docker-compose logs -f'"
echo ""
echo "To stop infrastructure:"
echo "  ssh root@${SERVER_IP} 'cd /opt/innerv2 && docker-compose down'"
echo ""
