#!/bin/bash

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          📋 TÓM TẮT: VÌ SAO HÌNH ẢNH BỊ LỖI 400?            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🔴 VẤN ĐỀ

URL: http://rausachtrangia.com/quanly/fileman/Uploads/Images/muc-hap38718813.jpg
Status: 400 Bad Request khi qua Next.js Image Optimization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔬 NGUYÊN NHÂN

1️⃣  HTTP → HTTPS REDIRECT (301)
   Server Apache redirect tất cả HTTP sang HTTPS

2️⃣  FILE KHÔNG TỒN TẠI TRÊN HTTPS (404)
   File chỉ có trong HTTP virtualhost
   HTTPS path không có file

3️⃣  NEXT.JS KHÔNG FOLLOW REDIRECTS
   Security & Performance reasons
   Expect stable URLs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ GIẢI PHÁP ĐÃ TRIỂN KHAI

📦 1. FRONTEND UTILITIES

   ✓ src/utils/image-url.ts
     - normalizeImageUrl(): Convert HTTP → HTTPS
     - shouldDisableOptimization(): Check problematic URLs
     - getOptimizedImageProps(): Get props cho Next.js Image
     
   ✓ src/components/OptimizedImage.tsx
     - Auto-normalize URLs
     - Fallback support
     - Error handling

   Usage:
   import OptimizedImage from '@/components/OptimizedImage';
   
   <OptimizedImage
     src={product.image}  // Auto-normalize
     width={640}
     height={480}
     alt="Product"
     fallback="/images/placeholder.jpg"
   />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 2. DATABASE MIGRATION

   ✓ backend/migrations/normalize-image-urls.sql
     - Update products table
     - Update blog_posts table
     - Update categories table
     - Update users table
     - Update pages table
     - Update website_settings
     - Verification queries

   Run:
   # 1. Backup first!
   pg_dump -U postgres -d rausach > backup.sql
   
   # 2. Run migration
   psql -U postgres -d rausach -f backend/migrations/normalize-image-urls.sql
   
   # 3. Verify
   # Check output for remaining HTTP URLs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 3. SERVER FIX (RECOMMENDED)

   Option A: Disable redirect cho image folders
   
   File: /etc/apache2/sites-available/rausachtrangia.conf
   
   <VirtualHost *:80>
       ServerName rausachtrangia.com
       
       <Location /quanly/fileman/Uploads>
           # Không redirect - cho phép HTTP
       </Location>
       
       <Location /upload>
           # Không redirect
       </Location>
       
       # Redirect các paths khác
       RewriteEngine On
       RewriteCond %{REQUEST_URI} !^/quanly/fileman/Uploads
       RewriteCond %{REQUEST_URI} !^/upload
       RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
   </VirtualHost>
   
   sudo systemctl restart apache2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Option B: Copy files to HTTPS location
   
   ssh user@rausachtrangia.com
   
   # Find document roots
   HTTP_ROOT="/var/www/rausachtrangia_http"
   HTTPS_ROOT="/var/www/rausachtrangia_https"
   
   # Copy images
   cp -r $HTTP_ROOT/quanly $HTTPS_ROOT/
   cp -r $HTTP_ROOT/upload $HTTPS_ROOT/
   
   # Fix permissions
   chown -R www-data:www-data $HTTPS_ROOT/quanly
   chmod -R 755 $HTTPS_ROOT/quanly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 KHUYẾN NGHỊ TRIỂN KHAI

NGẮN HẠN (Immediate):
  1. ✅ Deploy frontend utilities (OptimizedImage)
  2. ✅ Update components sử dụng OptimizedImage
  3. 🔧 Fix server (Option A hoặc B)
  4. ✅ Test URLs

TRUNG HẠN (1-2 tuần):
  1. 📊 Run database migration
  2. 🔍 Monitor broken images
  3. 🧹 Cleanup old HTTP URLs
  4. 📝 Update documentation

DÀI HẠN (Best Practice):
  1. ☁️  Use CDN (CloudFlare)
  2. 🔒 HTTPS only
  3. 📦 Centralize image storage
  4. 🚀 Optimize image pipeline

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 TESTING CHECKLIST

Frontend:
  [ ] Import OptimizedImage component
  [ ] Replace Image with OptimizedImage
  [ ] Test with HTTP URLs
  [ ] Test with HTTPS URLs
  [ ] Check fallback images
  [ ] Test error handling

Server:
  [ ] Test HTTP access: curl -I http://rausachtrangia.com/quanly/...
  [ ] Should return: 200 OK (not 301)
  [ ] Test HTTPS access: curl -I https://rausachtrangia.com/quanly/...
  [ ] Should return: 200 OK
  [ ] Test Next.js API: curl https://shop.rausachtrangia.com/_next/image?url=...
  [ ] Should return: 200 OK

Database:
  [ ] Backup database
  [ ] Run migration
  [ ] Verify no HTTP URLs remain
  [ ] Test images load correctly
  [ ] Check all tables updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 TÀI LIỆU

Chi tiết đầy đủ:
  ✓ frontend/IMAGE_ERROR_ANALYSIS.md - Root cause analysis
  ✓ frontend/why-image-error.sh - Quick explanation
  ✓ frontend/IMAGE_FIX_GUIDE.md - Fix guide

Code:
  ✓ frontend/src/utils/image-url.ts - Utilities
  ✓ frontend/src/components/OptimizedImage.tsx - Component
  ✓ backend/migrations/normalize-image-urls.sql - Migration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 QUICK START

# 1. Deploy frontend fix (immediate)
cd frontend
npm run build
# Deploy

# 2. Test một image
curl -I 'https://shop.rausachtrangia.com/_next/image?url=http%3A%2F%2Frausachtrangia.com%2Fquanly%2Ffileman%2FUploads%2FImages%2Fmuc-hap38718813.jpg&w=640&q=75'

# 3. Fix server (nếu vẫn 400)
ssh user@rausachtrangia.com
# Apply Option A or B

# 4. Run database migration (optional, sau khi test)
psql -U postgres -d rausach -f backend/migrations/normalize-image-urls.sql

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ KẾT QUẢ MONG ĐỢI

TRƯỚC FIX:
  ❌ 400 Bad Request
  ❌ Images không load
  ❌ Console errors

SAU FIX:
  ✅ 200 OK
  ✅ Images load bình thường
  ✅ Auto-normalize URLs
  ✅ Fallback cho broken images

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
