#!/bin/bash
# Quick Deploy Guide - Copy and paste these commands

echo "🚀 InnerV2 Production Deployment - Quick Start"
echo "=============================================="
echo ""

# Step 1: Check requirements
echo "Step 1: Checking system..."
free -h
df -h /

# Step 2: Stop old services
echo ""
echo "Step 2: Stopping old services..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Step 3: Clean up
echo ""
echo "Step 3: Cleaning up Docker..."
docker system prune -f

# Step 4: Deploy
echo ""
echo "Step 4: Deploying..."
./deploy-low-memory.sh

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Monitor: ./monitor.sh"
echo "Logs: docker compose -f docker-compose.prod.yml logs -f"
echo ""
