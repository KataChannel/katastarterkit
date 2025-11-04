# SSL Setup Guide - appapi.tazagroup.vn

## 📋 Overview
Cấu hình SSL cho Tazagroup Backend API
- **Domain**: appapi.tazagroup.vn
- **Backend Port**: 13001 (Tazagroup Backend)
- **Server IP**: 116.118.49.243

## 🚀 Quick Start

### Bước 1: Cấu hình DNS
Trỏ domain về server:
```
Type: A Record
Name: appapi
Value: 116.118.49.243
TTL: Auto/3600
```

Kiểm tra DNS:
```bash
dig +short appapi.tazagroup.vn
# Hoặc
nslookup appapi.tazagroup.vn
```

### Bước 2: Chạy script setup SSL
```bash
./setup-ssl-tazagroup.sh
```

Script sẽ tự động:
1. Kiểm tra DNS
2. Deploy nginx config lên server
3. Cài đặt Certbot (nếu chưa có)
4. Hỏi chọn phương thức SSL (Cloudflare hoặc Let's Encrypt)
5. Cấu hình SSL
6. Hướng dẫn cập nhật CORS

## 🌐 Phương thức SSL

### Option 1: Cloudflare (Recommended) ⭐
**Ưu điểm:**
- ✅ Free forever
- ✅ Tự động renew
- ✅ CDN + DDoS protection
- ✅ Setup trong 5 phút
- ✅ Không cần mở port 80

**Bước thực hiện:**
1. Login vào Cloudflare Dashboard
2. Chọn domain `tazagroup.vn`
3. DNS → Add Record:
   - Type: `A`
   - Name: `appapi`
   - IPv4: `116.118.49.243`
   - Proxy status: ✅ **Proxied** (orange cloud)
4. SSL/TLS → Overview:
   - Chọn **Full (strict)**
5. SSL/TLS → Edge Certificates:
   - Enable **Always Use HTTPS**
   - Enable **Automatic HTTPS Rewrites**
6. Đợi 5-10 phút để Cloudflare cấp certificate

**Test:**
```bash
curl -I https://appapi.tazagroup.vn/graphql
```

### Option 2: Let's Encrypt
**Ưu điểm:**
- ✅ Free
- ✅ Tự động renew
- ✅ Trusted by all browsers

**Yêu cầu:**
- ❗ Port 80 phải mở
- ❗ DNS đã trỏ đúng

**Tự động qua script:**
```bash
./setup-ssl-tazagroup.sh
# Chọn option 2 khi được hỏi
```

**Hoặc thủ công:**
```bash
# Trên server 116.118.49.243
sudo certbot --nginx -d appapi.tazagroup.vn
```

## 🔧 Cấu hình Backend

### 1. Update CORS (Đã thêm vào main.ts)
```typescript
const corsOrigins = [
  // ... existing origins
  'https://appapi.tazagroup.vn',
  'http://appapi.tazagroup.vn',
];
```

### 2. Rebuild và Deploy Backend
```bash
cd /chikiet/kataoffical/shoprausach
./deploy.sh
```

## 🔄 Cập nhật Frontend

Sau khi SSL hoạt động, cập nhật frontend để dùng domain mới:

### File: `.env.tazagroup`
```bash
# Trước (IP:Port)
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://v3api.tazagroup.com/graphql

# Sau (Domain)
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://appapi.tazagroup.vn/graphql
```

### Rebuild Frontend
```bash
./build-frontend.sh
./deploy.sh
```

## ✅ Verification

### 1. Test SSL Certificate
```bash
# Check SSL
openssl s_client -connect appapi.tazagroup.vn:443 -servername appapi.tazagroup.vn

# SSL Labs Test
https://www.ssllabs.com/ssltest/analyze.html?d=appapi.tazagroup.vn
```

### 2. Test GraphQL Endpoint
```bash
# HTTP (should redirect to HTTPS)
curl -I http://appapi.tazagroup.vn/graphql

# HTTPS
curl -I https://appapi.tazagroup.vn/graphql

# GraphQL Query
curl -X POST https://appapi.tazagroup.vn/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

### 3. Test CORS
```bash
curl -I -X OPTIONS https://appapi.tazagroup.vn/graphql \
  -H "Origin: https://app.tazagroup.com" \
  -H "Access-Control-Request-Method: POST"
```

Expect:
```
Access-Control-Allow-Origin: https://app.tazagroup.com
Access-Control-Allow-Credentials: true
```

## 🔒 Security Checklist

- [x] SSL Certificate installed (Cloudflare/Let's Encrypt)
- [x] HTTPS redirect enabled
- [x] CORS properly configured
- [x] Security headers added (X-Frame-Options, etc.)
- [x] Auto-renewal enabled
- [ ] Firewall rules configured (optional)
- [ ] Rate limiting (Cloudflare handles this)

## 📊 Monitoring

### Check SSL Expiry
```bash
# On server
sudo certbot certificates

# Or check via API
curl https://appapi.tazagroup.vn/graphql -v 2>&1 | grep "expire"
```

### Auto-renewal Status (Let's Encrypt only)
```bash
# On server
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

### Nginx Logs
```bash
# On server
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🆘 Troubleshooting

### SSL Certificate Error
```bash
# Check certificate
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check nginx config
sudo nginx -t
```

### CORS Issues
1. Check backend CORS config in `backend/src/main.ts`
2. Rebuild backend: `./deploy.sh`
3. Check browser console for exact error

### Domain Not Resolving
```bash
# Clear DNS cache
sudo systemd-resolve --flush-caches

# Check DNS
dig +trace appapi.tazagroup.vn
```

## 📚 Related Domains

- `api.rausachtrangia.com` → Port 12001 (Rausach Backend)
- `appapi.tazagroup.vn` → Port 13001 (Tazagroup Backend) ⭐ **NEW**
- `shop.rausachtrangia.com` → Port 12000 (Rausach Frontend)
- `app.tazagroup.com` → Port 13000 (Tazagroup Frontend)

## 🎯 Next Steps

1. ✅ Setup SSL cho appapi.tazagroup.vn
2. Test GraphQL endpoint với HTTPS
3. Update frontend .env.tazagroup
4. Rebuild và deploy frontend
5. Test toàn bộ flow từ frontend → backend
6. Monitor logs và SSL expiry

---

**Last Updated**: 2025-11-04
**Maintained by**: Kata Team
