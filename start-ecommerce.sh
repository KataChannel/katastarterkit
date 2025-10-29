#!/bin/bash

# 🚀 E-COMMERCE & BLOG SYSTEM - QUICK START
# Run this script to start both backend and frontend

set -e

echo "======================================"
echo "🚀 Starting E-commerce & Blog System"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running (for PostgreSQL & Redis)
if ! docker ps > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Starting Docker services...${NC}"
    docker-compose up -d postgres redis
    echo -e "${GREEN}✅ Docker services started${NC}"
    sleep 5
fi

# Backend setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please configure it.${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing backend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

# Run Prisma migrations
echo -e "${BLUE}🔄 Running Prisma migrations...${NC}"
npx prisma migrate deploy
echo -e "${GREEN}✅ Database migrated${NC}"

# Generate Prisma Client
echo -e "${BLUE}🔧 Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"

# Start backend in background
echo -e "${BLUE}🚀 Starting Backend on http://localhost:12001${NC}"
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}📊 GraphQL Playground: http://localhost:12001/graphql${NC}"

cd ..

# Frontend setup
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing frontend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

# Start frontend in background
echo -e "${BLUE}🚀 Starting Frontend on http://localhost:12000${NC}"
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

cd ..

# Wait for services to start
echo ""
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 5

# Display status
echo ""
echo "======================================"
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo "======================================"
echo ""
echo "📍 Access points:"
echo "  - Frontend:        http://localhost:12000"
echo "  - Backend API:     http://localhost:12001"
echo "  - GraphQL:         http://localhost:12001/graphql"
echo ""
echo "🛍️  E-commerce pages:"
echo "  - Products:        http://localhost:12000/products"
echo "  - Cart:            http://localhost:12000/cart"
echo "  - Checkout:        http://localhost:12000/checkout"
echo ""
echo "📝 Blog pages:"
echo "  - Blog listing:    http://localhost:12000/blog"
echo ""
echo "📊 Logs:"
echo "  - Backend:         tail -f logs/backend.log"
echo "  - Frontend:        tail -f logs/frontend.log"
echo ""
echo "🛑 To stop services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or run: ./stop.sh"
echo ""
echo "======================================"

# Create stop script
cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping services..."
kill $(ps aux | grep 'npm run dev' | grep -v grep | awk '{print $2}') 2>/dev/null
echo "✅ All services stopped"
EOF

chmod +x stop.sh

# Save PIDs for stop script
echo "BACKEND_PID=$BACKEND_PID" > .pids
echo "FRONTEND_PID=$FRONTEND_PID" >> .pids

echo -e "${GREEN}🎉 Ready for testing!${NC}"
