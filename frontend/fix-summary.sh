#!/bin/bash

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           ✅ FIX NEXT.JS IMAGE OPTIMIZATION ERROR            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🐛 VẤN ĐỀ:
   URL: https://shop.rausachtrangia.com/_next/image?url=...
   Error: "url" parameter is not allowed

🔧 ĐÃ SỬA:
   ✓ Thêm domains array trong next.config.js
   ✓ Thay wildcard *.rausachtrangia.com bằng domains cụ thể
   ✓ Thêm www.rausachtrangia.com support
   ✓ Ensure tất cả paths (/**) được cover

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 THAY ĐỔI TRONG next.config.js:

1. Thêm domains array (backward compatibility):
   domains: [
     'rausachtrangia.com',
     'www.rausachtrangia.com',
     'storage.rausachtrangia.com',
     'images.rausachtrangia.com',
     ...
   ]

2. Update remotePatterns:
   - Xóa: hostname: '*.rausachtrangia.com' ❌
   - Thêm: hostname: 'www.rausachtrangia.com' ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 TIẾP THEO - REBUILD & DEPLOY:

1️⃣  REBUILD FRONTEND:
   cd /mnt/chikiet/kataoffical/shoprausach/frontend
   npm run build

2️⃣  TEST LOCAL (optional):
   npm run start
   # Test: http://localhost:3000/_next/image?url=https%3A%2F%2Frausachtrangia.com%2Fupload%2Fsanpham%2Fklt43748123.jpg&w=64&q=75

3️⃣  DEPLOY TO PRODUCTION:
   cd /mnt/chikiet/kataoffical/shoprausach
   bun run docker:prod

4️⃣  VERIFY:
   curl -I 'https://shop.rausachtrangia.com/_next/image?url=https%3A%2F%2Frausachtrangia.com%2Fupload%2Fsanpham%2Fklt43748123.jpg&w=64&q=75'
   # Should return: 200 OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ URLs SẼ WORK:

Main domain:
  ✓ https://rausachtrangia.com/upload/sanpham/*.jpg
  ✓ https://rausachtrangia.com/quanly/fileman/Uploads/Images/*.jpg
  ✓ http://rausachtrangia.com/**

WWW subdomain:
  ✓ https://www.rausachtrangia.com/**
  ✓ http://www.rausachtrangia.com/**

Storage subdomain:
  ✓ https://storage.rausachtrangia.com/**
  ✓ http://storage.rausachtrangia.com/**

Images subdomain:
  ✓ https://images.rausachtrangia.com/**
  ✓ http://images.rausachtrangia.com/**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TẠI SAO LOCAL WORK NHƯNG PRODUCTION KHÔNG?

Local (Development):
  • Next.js cho phép tất cả domains (insecure)
  • Không check remotePatterns strict

Production:
  • Next.js enforce security
  • PHẢI có domain trong config
  • Wildcard không work tốt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 TÀI LIỆU:

Chi tiết đầy đủ:
  frontend/IMAGE_FIX_GUIDE.md

Test script:
  frontend/test-image-config.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ TÓM TẮT:

Vấn đề: ❌ "url" parameter is not allowed
Fix:    ✅ Thêm domains + update remotePatterns
Action: 🚀 Rebuild frontend và deploy

Sau khi deploy, tất cả image URLs từ rausachtrangia.com
sẽ work bình thường! 🎉

EOF
