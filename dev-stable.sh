#!/bin/bash

# Kill existing processes
echo "🧹 Cleaning up existing processes..."
sudo fuser -k 13000/tcp 14000/tcp 2>/dev/null || true
pkill -f "bun.*dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait a moment
sleep 2

echo "🚀 Starting development servers..."

# Start backend without hot reload to avoid WebSocket conflicts
echo "📦 Starting backend on port 14000..."
cd backend && bun run dev:stable &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend on port 13000..."
cd frontend && bun run dev &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📦 Backend: http://localhost:14000/graphql"
echo "🌐 Frontend: http://localhost:13000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
