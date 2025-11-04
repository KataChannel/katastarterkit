#!/bin/bash

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║             ✅ ĐÃ FIX XONG - FRONTEND PORT 13000              ║
╚═══════════════════════════════════════════════════════════════╝

🎯 VẤN ĐỀ ĐÃ FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ❌ TRƯỚC: http://116.118.48.208:13000 gọi http://api.rausachtrangia.com/graphql
  ✅ SAU:   http://116.118.48.208:13000 gọi http://116.118.48.208:13001/graphql

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ NHỮNG GÌ ĐÃ LÀM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ✅ Tạo file frontend/.env.local với config đúng:
   - NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
   - NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000
   - NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001

2. ✅ Dừng frontend đang chạy port 12000 (Rausach)
   - Killed PID: 34639

3. ✅ Xóa .next cache để rebuild
   - rm -rf frontend/.next

4. ✅ Start frontend trên port 13000 (Innerv2)
   - Process: node ...next dev -p 13000
   - PID: 37897
   - Status: ✅ RUNNING

5. ✅ Tạo scripts hỗ trợ:
   - start-frontend-innerv2.sh
   - start-frontend-rausach.sh
   - test-frontend-api.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 TRẠNG THÁI HIỆN TẠI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backend (Innerv2):
  ✅ URL:    http://116.118.48.208:13001/graphql
  ✅ Status: RUNNING
  ✅ Port:   13001

Frontend (Innerv2):
  ✅ URL:    http://116.118.48.208:13000
  ✅ Status: RUNNING
  ✅ Port:   13000
  ✅ Config: .env.local (CORRECT)

Database (Innerv2):
  ✅ URL:    116.118.48.208:13003
  ✅ DB:     innerv2core

Shared Services:
  ✅ Redis:  116.118.48.208:12004
  ✅ Minio:  http://116.118.48.208:12008

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 CÁCH KIỂM TRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Mở trình duyệt: http://116.118.48.208:13000

2. Nhấn F12 để mở DevTools

3. Chuyển sang tab "Network"

4. Reload trang (F5)

5. Tìm requests tới GraphQL:
   ✅ ĐÚNG: http://116.118.48.208:13001/graphql
   ❌ SAI:  http://api.rausachtrangia.com/graphql

6. Kiểm tra response:
   - Status: 200 OK
   - Data: {...}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 LỆNH HỮU ÍCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Kiểm tra frontend đang chạy
ps aux | grep "next.*13000"

# Kiểm tra port
ss -tlnp | grep 13000

# Xem logs frontend
# (Xem terminal đang chạy npm run dev)

# Restart frontend
kill <PID>
./start-frontend-innerv2.sh

# Kiểm tra backend
curl http://116.118.48.208:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__typename}"}'

# Test CORS
curl -I -X OPTIONS http://116.118.48.208:13001/graphql \
  -H "Origin: http://116.118.48.208:13000"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 NẾU CẦN RESTART
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Innerv2 (Port 13000)
./start-frontend-innerv2.sh

# Rausach (Port 12000)
./start-frontend-rausach.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 FILES ĐÃ TẠO/SỬA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ frontend/.env.local              - Config Innerv2
✅ start-frontend-innerv2.sh      - Script start Innerv2
✅ start-frontend-rausach.sh        - Script start Rausach
✅ test-frontend-api.sh             - Script test API
✅ FIX_MINIO_ACCESS_KEY_ERROR.md    - Fix Minio credentials
✅ FIX_FRONTEND_API_CONNECTION.md   - Fix frontend API
✅ CRITICAL_PORT_13000_WRONG_API.md - Phân tích vấn đề
✅ SUCCESS_PORT_13000_FIXED.sh      - File này

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 KẾT QUẢ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Frontend port 13000 đã kết nối đúng API
✅ Backend port 13001 hoạt động bình thường
✅ CORS đã được cấu hình đúng
✅ Minio credentials đã được fix
✅ Environment variables đã đúng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 READY TO USE!

   Truy cập: http://116.118.48.208:13000
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
