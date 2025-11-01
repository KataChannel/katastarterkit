#!/bin/bash

echo "🧪 Testing if middleware is invoked..."
echo ""
echo "Instructions:"
echo "1. Start frontend: cd frontend && npm run dev"
echo "2. Open browser to: http://localhost:12000/"
echo "3. Check terminal output"
echo ""
echo "Expected to see:"
echo "  [Main Middleware] 🚀 MIDDLEWARE INVOKED for: /"
echo "  [Offline Middleware] Processing: /"
echo ""
echo "If you DON'T see these logs, middleware is NOT running!"
echo "If you DO see these logs but NO redirect, check the logic."
echo ""
echo "Current settings:"
echo ""

cd /mnt/chikiet/kataoffical/shoprausach

# Test offline setting
node test-offline-settings.js | grep -A 10 "📊 OFFLINE"

echo ""
echo "To test:"
echo "  1. If offline = true: Should redirect to /maintenance"
echo "  2. If offline = false && homepage_url = /lms: Should redirect to /lms"
echo ""
