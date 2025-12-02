#!/bin/bash
# Debug Google Drive Configuration

echo "======================================"
echo "🔍 Google Drive Debug - TazaGroup"
echo "======================================"
echo ""

# 1. Check .env file
echo "1️⃣  Checking backend/.env file..."
if [ -f "backend/.env" ]; then
    if grep -q "GOOGLE_DRIVE_CREDENTIALS_JSON=" backend/.env; then
        LENGTH=$(grep "GOOGLE_DRIVE_CREDENTIALS_JSON=" backend/.env | wc -c)
        if [ $LENGTH -gt 100 ]; then
            echo "   ✅ GOOGLE_DRIVE_CREDENTIALS_JSON exists (${LENGTH} bytes)"
            EMAIL=$(grep "client_email" backend/.env | grep -oP '"client_email":"[^"]*"' | cut -d'"' -f4 | head -1)
            echo "   📧 Service Account: $EMAIL"
        else
            echo "   ❌ GOOGLE_DRIVE_CREDENTIALS_JSON is empty or too short"
            exit 1
        fi
    else
        echo "   ❌ GOOGLE_DRIVE_CREDENTIALS_JSON not found in .env"
        exit 1
    fi
else
    echo "   ❌ backend/.env file not found"
    exit 1
fi
echo ""

# 2. Check backend process
echo "2️⃣  Checking backend process..."
BACKEND_PID=$(ps aux | grep "ts-node-dev.*main.ts" | grep -v grep | awk '{print $2}' | head -1)
if [ -n "$BACKEND_PID" ]; then
    echo "   ✅ Backend running (PID: $BACKEND_PID)"
    BACKEND_START=$(ps -p $BACKEND_PID -o lstart= 2>/dev/null)
    echo "   ⏰ Started: $BACKEND_START"
else
    echo "   ❌ Backend not running"
    echo "   💡 Starting backend..."
    cd backend && nohup bun run dev > /tmp/backend_debug.log 2>&1 &
    sleep 10
    echo "   ✅ Backend started"
fi
echo ""

# 3. Wait for backend
echo "3️⃣  Waiting for backend to be ready..."
for i in {1..15}; do
    if curl -s http://localhost:13001/api/lms/source-documents/google-drive/status > /dev/null 2>&1; then
        echo "   ✅ Backend is responding"
        break
    fi
    echo "   ⏳ Attempt $i/15..."
    sleep 1
done
echo ""

# 4. Test API endpoint
echo "4️⃣  Testing Google Drive API endpoint..."
RESPONSE=$(curl -s http://localhost:13001/api/lms/source-documents/google-drive/status 2>&1)
echo "   Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "Unauthorized"; then
    echo "   ⚠️  Endpoint requires authentication (this is NORMAL)"
    echo ""
    echo "5️⃣  This means backend is working!"
    echo "   The ⚠️ warning on frontend might be because:"
    echo "   a) You're not logged in"
    echo "   b) Frontend needs refresh"
    echo "   c) Browser cache issue"
elif echo "$RESPONSE" | grep -q "connected"; then
    echo "   ✅ Google Drive is connected!"
else
    echo "   ❌ Unexpected response"
fi
echo ""

# 5. Check logs for Google Drive
echo "6️⃣  Checking logs for Google Drive initialization..."
LOG_FILES=(
    "/tmp/backend_debug.log"
    "/tmp/backend_fresh.log"
    "/tmp/backend.log"
    "backend/logs/application-2025-12-02.log"
    "backend/logs/all-2025-12-02.log"
)

for LOG_FILE in "${LOG_FILES[@]}"; do
    if [ -f "$LOG_FILE" ]; then
        GDRIVE_LOG=$(grep -i "google drive" "$LOG_FILE" 2>/dev/null | tail -3)
        if [ -n "$GDRIVE_LOG" ]; then
            echo "   📝 Found in $LOG_FILE:"
            echo "$GDRIVE_LOG" | sed 's/^/      /'
            break
        fi
    fi
done
echo ""

# 6. Frontend check
echo "7️⃣  Frontend checklist:"
echo "   📍 URL: http://localhost:13000/lms/admin/source-documents/new"
echo "   "
echo "   Steps to fix ⚠️ warning:"
echo "   1. Make sure you're logged in (have accessToken)"
echo "   2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo "   3. Clear browser cache if needed"
echo "   4. Open DevTools (F12) → Console"
echo "   5. Look for /google-drive/status API call"
echo "   6. Check if it returns: {\"connected\":true,...}"
echo ""

# 7. Manual test command
echo "8️⃣  Manual test (replace YOUR_TOKEN with real token from browser):"
echo "   "
echo "   curl -H \"Authorization: Bearer YOUR_TOKEN\" \\"
echo "     http://localhost:13001/api/lms/source-documents/google-drive/status"
echo ""
echo "   Expected response:"
echo "   {\"connected\":true,\"message\":\"Kết nối Google Drive thành công\"}"
echo ""

echo "======================================"
echo "✅ Debug Complete!"
echo "======================================"
