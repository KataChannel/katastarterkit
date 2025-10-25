#!/bin/bash

# Backend Docker Deployment Test Script

echo "=== Backend Docker Fix Verification ==="
echo ""

# Check 1: Verify Dockerfile uses Node.js
echo "✓ Checking Dockerfile production stage..."
if grep -q "FROM node:20-alpine AS production" backend/Dockerfile; then
    echo "  ✅ Production uses Node.js 20-alpine"
else
    echo "  ❌ ERROR: Production stage not using Node.js"
    exit 1
fi

# Check 2: Verify CMD uses node instead of bun
echo "✓ Checking Dockerfile CMD..."
if grep -q 'CMD \["node", "dist/main.js"\]' backend/Dockerfile; then
    echo "  ✅ CMD uses 'node dist/main.js'"
else
    echo "  ❌ ERROR: CMD not configured correctly"
    exit 1
fi

# Check 3: Verify MinioService has Docker detection
echo "✓ Checking MinioService Docker detection..."
if grep -q "const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined" backend/src/minio/minio.service.ts; then
    echo "  ✅ Docker environment detection added"
else
    echo "  ❌ ERROR: Docker detection not found"
    exit 1
fi

# Check 4: Verify MinioService uses DOCKER_MINIO_ENDPOINT
echo "✓ Checking MinioService endpoint logic..."
if grep -q "this.configService.get('DOCKER_MINIO_ENDPOINT', 'minio')" backend/src/minio/minio.service.ts; then
    echo "  ✅ DOCKER_MINIO_ENDPOINT used correctly"
else
    echo "  ❌ ERROR: DOCKER_MINIO_ENDPOINT not used"
    exit 1
fi

# Check 5: Verify .env has Docker MinIO config
echo "✓ Checking .env Docker MinIO configuration..."
if grep -q "DOCKER_MINIO_ENDPOINT=minio" backend/.env; then
    echo "  ✅ DOCKER_MINIO_ENDPOINT configured"
else
    echo "  ⚠️  WARNING: DOCKER_MINIO_ENDPOINT not found in .env"
fi

if grep -q "DOCKER_MINIO_PORT=9000" backend/.env; then
    echo "  ✅ DOCKER_MINIO_PORT configured"
else
    echo "  ⚠️  WARNING: DOCKER_MINIO_PORT not found in .env"
fi

echo ""
echo "=== Verification Results ==="
echo "✅ All fixes are correctly applied!"
echo ""
echo "Next steps:"
echo "1. docker compose build backend"
echo "2. docker compose up -d"
echo "3. docker compose logs backend -f"
echo ""
echo "Expected logs:"
echo "- 'Connecting to Minio: endpoint=minio, port=9000, useSSL=false, dockerEnv=true'"
echo "- No segmentation faults or SIGILL errors"
