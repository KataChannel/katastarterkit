#!/bin/bash
# Quick Build Test - Verify optimizations are working

echo "🧪 Testing Docker Build Optimizations..."
echo ""

# Enable BuildKit
export DOCKER_BUILDKIT=1

echo "1️⃣ Checking BuildKit availability..."
if docker buildx version &>/dev/null; then
    echo "   ✅ BuildKit available: $(docker buildx version | head -1)"
else
    echo "   ❌ BuildKit not available - install docker-buildx-plugin"
    exit 1
fi

echo ""
echo "2️⃣ Checking Dockerfile modifications..."

# Check backend Dockerfile
if grep -q "mount=type=cache" backend/Dockerfile.production; then
    echo "   ✅ Backend Dockerfile has cache mounts"
else
    echo "   ❌ Backend Dockerfile missing cache mounts"
fi

# Check frontend Dockerfile
if grep -q "mount=type=cache" frontend/Dockerfile.production; then
    echo "   ✅ Frontend Dockerfile has cache mounts"
else
    echo "   ❌ Frontend Dockerfile missing cache mounts"
fi

echo ""
echo "3️⃣ Checking .dockerignore files..."

# Check backend .dockerignore doesn't exclude lockfile
if ! grep -q "^bun.lockb$" backend/.dockerignore; then
    echo "   ✅ Backend keeps bun.lockb in context"
else
    echo "   ⚠️  Backend .dockerignore excludes bun.lockb"
fi

# Check frontend .dockerignore doesn't exclude lockfile
if ! grep -q "^bun.lockb$" frontend/.dockerignore; then
    echo "   ✅ Frontend keeps bun.lockb in context"
else
    echo "   ⚠️  Frontend .dockerignore excludes bun.lockb"
fi

echo ""
echo "4️⃣ Checking build scripts..."
if [ -x "scripts/build-optimized.sh" ] && [ -x "scripts/build-parallel.sh" ]; then
    echo "   ✅ Build scripts are executable"
else
    echo "   ⚠️  Build scripts need chmod +x"
fi

echo ""
echo "5️⃣ Checking Docker build cache..."
docker system df --format 'table {{.Type}}\t{{.Size}}' | grep -E '(TYPE|Build)'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ All checks complete!"
echo ""
echo "To test the optimization, run:"
echo "  time ./scripts/build-parallel.sh"
echo ""
echo "Expected results:"
echo "  • First build: ~220s (no cache)"
echo "  • Second build: ~10-20s (with cache) 🚀"
