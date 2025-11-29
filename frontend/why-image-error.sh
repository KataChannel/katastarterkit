#!/bin/bash

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🔍 VÌ SAO HÌNH ẢNH BỊ LỖI 400 TRÊN PRODUCTION?          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🔴 URL LỖI:
   https://shop.rausachtrangia.com/_next/image?url=http%3A%2F%2Frausachtrangia.com%2Fquanly%2Ffileman%2FUploads%2FImages%2Fmuc-hap38718813.jpg&w=640&q=75

   Status: 400 Bad Request

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔬 ROOT CAUSE:

1. Frontend gửi HTTP URL: http://rausachtrangia.com/quanly/...
   ↓
2. Server Apache redirect: HTTP → HTTPS (301)
   ↓
3. HTTPS URL: https://rausachtrangia.com/quanly/...
   ↓
4. Server trả về: 404 Not Found
   ↓
5. Next.js Image API: ❌ 400 Bad Request

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  TẠI SAO?

❗ NGUYÊN NHÂN 1: HTTP → HTTPS REDIRECT
   Server rausachtrangia.com tự động redirect HTTP sang HTTPS
   Next.js Image Optimization KHÔNG FOLLOW REDIRECTS (security)

❗ NGUYÊN NHÂN 2: FILE KHÔNG TỒN TẠI TRÊN HTTPS
   HTTP: http://rausachtrangia.com/quanly/... → 301 Redirect
   HTTPS: https://rausachtrangia.com/quanly/... → 404 Not Found
   
   File chỉ tồn tại trong HTTP virtualhost!

❗ NGUYÊN NHÂN 3: NEXT.JS CONFIG
   next.config.js đã có rausachtrangia.com
   NHƯNG vấn đề không phải config, mà là SERVER!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ GIẢI PHÁP

🎯 Option 1: FIX APACHE SERVER (RECOMMENDED)

   Trên server rausachtrangia.com, disable redirect cho image folders:

   # File: /etc/apache2/sites-available/rausachtrangia.conf
   <VirtualHost *:80>
       ServerName rausachtrangia.com
       
       # Cho phép HTTP cho images
       <Location /quanly/fileman/Uploads>
           # Không redirect
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

   Sau đó restart Apache:
   sudo systemctl restart apache2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Option 2: COPY FILES TO HTTPS LOCATION

   Trên server rausachtrangia.com:
   
   # Find HTTP document root
   HTTP_ROOT="/var/www/rausachtrangia_http"
   
   # Find HTTPS document root  
   HTTPS_ROOT="/var/www/rausachtrangia_https"
   
   # Copy images
   cp -r $HTTP_ROOT/quanly $HTTPS_ROOT/
   cp -r $HTTP_ROOT/upload $HTTPS_ROOT/
   
   # Fix permissions
   chown -R www-data:www-data $HTTPS_ROOT/quanly
   chown -R www-data:www-data $HTTPS_ROOT/upload

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Option 3: UPDATE DATABASE URLs (MIGRATION)

   Đổi tất cả HTTP URLs → HTTPS trong database:
   
   UPDATE products 
   SET image_url = REPLACE(image_url, 
       'http://rausachtrangia.com', 
       'https://rausachtrangia.com')
   WHERE image_url LIKE 'http://rausachtrangia.com%';
   
   UPDATE blog_posts
   SET featured_image = REPLACE(featured_image,
       'http://rausachtrangia.com',
       'https://rausachtrangia.com')
   WHERE featured_image LIKE 'http://rausachtrangia.com%';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Option 4: QUICK FIX - NORMALIZE URLs IN CODE

   File: frontend/src/utils/image.ts
   
   export function normalizeImageUrl(url: string): string {
     if (url.startsWith('http://rausachtrangia.com')) {
       return url.replace('http://', 'https://');
     }
     return url;
   }
   
   Usage:
   <Image src={normalizeImageUrl(product.image)} ... />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Option 5: DISABLE IMAGE OPTIMIZATION (LAST RESORT)

   <Image 
     src="http://rausachtrangia.com/quanly/..."
     unoptimized={true}  // Skip Next.js optimization
     width={640}
     height={480}
   />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 TESTING

Test sau khi fix:

# 1. Test HTTP có còn redirect không
curl -I "http://rausachtrangia.com/quanly/fileman/Uploads/Images/muc-hap38718813.jpg"
# Should return: 200 OK (không redirect)

# 2. Test HTTPS
curl -I "https://rausachtrangia.com/quanly/fileman/Uploads/Images/muc-hap38718813.jpg"  
# Should return: 200 OK

# 3. Test Next.js Image API
curl -I 'https://shop.rausachtrangia.com/_next/image?url=http%3A%2F%2Frausachtrangia.com%2Fquanly%2Ffileman%2FUploads%2FImages%2Fmuc-hap38718813.jpg&w=640&q=75'
# Should return: 200 OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 KHUYẾN NGHỊ

NGẮN HẠN (Immediate):
  1. Fix Apache redirect cho image folders
  2. Hoặc copy files sang HTTPS location
  3. Test và verify

TRUNG HẠN (1-2 tuần):
  1. Migration script đổi URLs trong database
  2. Normalize URLs trong code
  3. Monitor broken images

DÀI HẠN (Best Practice):
  1. Use CDN (CloudFlare)
  2. HTTPS only
  3. Centralize image storage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TÓM TẮT

Root Cause: Server configuration issue
- HTTP redirect → HTTPS
- HTTPS files không tồn tại
- Next.js không follow redirects

Solution: Fix server, KHÔNG phải Next.js config!

Chi tiết: frontend/IMAGE_ERROR_ANALYSIS.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
