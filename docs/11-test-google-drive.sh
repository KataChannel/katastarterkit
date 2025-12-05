#!/bin/bash
# Test Google Drive configuration

echo "==================================="
echo "Testing Google Drive Configuration"
echo "==================================="
echo ""

# 1. Check if GOOGLE_DRIVE_CREDENTIALS_JSON is set
echo "1. Checking GOOGLE_DRIVE_CREDENTIALS_JSON in .env..."
if grep -q "GOOGLE_DRIVE_CREDENTIALS_JSON=" backend/.env && [ $(grep "GOOGLE_DRIVE_CREDENTIALS_JSON=" backend/.env | wc -c) -gt 100 ]; then
    echo "   ✅ GOOGLE_DRIVE_CREDENTIALS_JSON is set"
    echo "   Email: $(grep "client_email" backend/.env | grep -oP '"client_email":"[^"]*"' | cut -d'"' -f4)"
else
    echo "   ❌ GOOGLE_DRIVE_CREDENTIALS_JSON is NOT set or empty"
    exit 1
fi
echo ""

# 2. Check if backend is running
echo "2. Checking backend status..."
if pgrep -f "ts-node-dev.*main.ts" > /dev/null; then
    echo "   ✅ Backend is running (PID: $(pgrep -f 'ts-node-dev.*main.ts'))"
else
    echo "   ❌ Backend is NOT running"
    exit 1
fi
echo ""

# 3. Wait for backend to be ready
echo "3. Waiting for backend to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:13001/api/lms/source-documents/google-drive/status > /dev/null 2>&1; then
        echo "   ✅ Backend is responding"
        break
    fi
    echo "   ⏳ Waiting... ($i/10)"
    sleep 1
done
echo ""

# 4. Test Google Drive status endpoint (without auth)
echo "4. Testing Google Drive status endpoint..."
RESPONSE=$(curl -s http://localhost:13001/api/lms/source-documents/google-drive/status)
echo "   Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "Unauthorized"; then
    echo "   ⚠️  Endpoint requires authentication (expected)"
    echo ""
    echo "5. Testing with mock token..."
    # Try with a mock bearer token
    RESPONSE_WITH_AUTH=$(curl -s -H "Authorization: Bearer mock-token" http://localhost:13001/api/lms/source-documents/google-drive/status)
    echo "   Response: $RESPONSE_WITH_AUTH"
fi
echo ""

# 6. Check backend logs for Google Drive initialization
echo "6. Checking backend logs..."
if grep -q "Google Drive API initialized successfully" /tmp/backend.log 2>/dev/null; then
    echo "   ✅ Google Drive API initialized successfully"
elif grep -q "GOOGLE_DRIVE_CREDENTIALS_JSON not set" /tmp/backend.log 2>/dev/null; then
    echo "   ❌ GOOGLE_DRIVE_CREDENTIALS_JSON not set in backend"
else
    echo "   ⚠️  No Google Drive initialization log found"
fi
echo ""

echo "==================================="
echo "Next Steps:"
echo "==================================="
echo "1. Login to frontend: http://localhost:13000"
echo "2. Go to: http://localhost:13000/lms/admin/source-documents/new"
echo "3. The Google Drive button should be enabled (no ⚠️ icon)"
echo "4. If still showing error:"
echo "   - Open browser DevTools (F12)"
echo "   - Go to Console tab"
echo "   - Look for any errors"
echo "   - Check Network tab for API calls"
echo ""
echo "Service Account Email:"
echo "  app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com"
echo ""
echo "Make sure this email has Editor access to:"
echo "  https://drive.google.com/drive/folders/1kSEvP8QlhhZoOjtemtLuKA_LkuWr2OTG"
echo "==================================="
