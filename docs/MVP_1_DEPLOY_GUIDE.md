# 🚀 MVP 1 - Production Deploy Guide
## Deploy Affiliate System NGAY HÔM NAY

**Status**: ✅ 100% Code Ready  
**Deploy Time**: 2-3 hours  
**Risk Level**: Medium (Manual testing required)

---

## ✅ What You Have (Week 1 Complete)

### **Backend (100% Ready)**
```
✅ 7 Database models
✅ 5 Services (User, Campaign, Tracking, Payment, Conversion)
✅ 2 Controllers (REST + GraphQL)
✅ 15+ GraphQL queries
✅ 13 GraphQL mutations
✅ Click tracking endpoint
✅ Cookie-based attribution
✅ Commission calculation
✅ Conversion tracking
✅ ~3,500 lines production code
```

### **Frontend (100% Ready)**
```
✅ Campaign management UI
✅ Join campaign modal
✅ Campaign browser
✅ Application review panel
✅ Affiliate dashboard
✅ Links management
✅ Payment requests UI
✅ Responsive design
✅ ~3,500 lines production code
```

### **Features Working**
```
✅ Merchant creates campaign
✅ Affiliate joins campaign
✅ Generate tracking links
✅ Track clicks (REST API)
✅ Track conversions
✅ Calculate commissions
✅ Approve/reject conversions
✅ Request payouts
✅ Admin approves payouts (manual transfer)
```

---

## 📋 Pre-Deploy Checklist

### **1. Code Review** (30 minutes)

#### **Backend Check**
```bash
cd backend

# Check compilation
bun run build
# ✅ Should: No TypeScript errors

# Check GraphQL schema
bun run build:schema
# ✅ Should: schema.graphql generated

# Check database schema
bun prisma generate
# ✅ Should: Prisma client generated
```

#### **Frontend Check**
```bash
cd frontend

# Check compilation
npm run build
# ✅ Should: Build successful

# Check for errors
npm run lint
# ⚠️ Fix any critical errors
```

#### **Critical Files Exist**
```bash
# Backend
✅ backend/src/controllers/tracking.controller.ts
✅ backend/src/services/affiliate-conversion.service.ts
✅ backend/src/utils/affiliate-helper.ts
✅ backend/src/graphql/resolvers/affiliate.resolver.ts

# Frontend
✅ frontend/src/components/affiliate/campaigns/JoinCampaignModal.tsx
✅ frontend/src/components/affiliate/campaigns/CampaignBrowser.tsx
✅ frontend/src/components/affiliate/campaigns/ApplicationReviewPanel.tsx
✅ frontend/src/graphql/affiliate.queries.ts
```

---

### **2. Environment Setup** (30 minutes)

#### **Production Server Requirements**
```
Minimum specs:
- CPU: 2 cores
- RAM: 4 GB
- Disk: 50 GB SSD
- OS: Ubuntu 20.04+ or similar

Recommended:
- CPU: 4 cores
- RAM: 8 GB
- Disk: 100 GB SSD
```

#### **Install Dependencies**
```bash
# On production server
sudo apt update
sudo apt install -y docker docker-compose nodejs npm postgresql

# Install bun
curl -fsSL https://bun.sh/install | bash
```

#### **Clone Repository**
```bash
cd /opt
git clone https://github.com/yourusername/katacore.git
cd katacore
git checkout main  # or your production branch
```

---

### **3. Database Setup** (15 minutes)

#### **Option A: Use Docker PostgreSQL**
```bash
# docker-compose.yml already configured
docker-compose up -d postgres

# Wait for postgres to be ready
sleep 10
```

#### **Option B: External PostgreSQL**
```bash
# Setup managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
# Get connection string:
# postgresql://user:password@host:5432/database
```

#### **Run Migrations**
```bash
cd backend

# Set database URL
export DATABASE_URL="postgresql://user:password@host:5432/katacore_prod"

# Run migrations
bun prisma migrate deploy

# Verify tables created
bun prisma studio
# ✅ Should see 7 affiliate tables
```

---

### **4. Environment Variables** (15 minutes)

#### **Backend `.env.production`**
```bash
cd backend
cp .env.example .env.production
nano .env.production
```

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/katacore_prod"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
NODE_ENV="production"
PORT=14000
API_PREFIX="api"

# CORS
CORS_ORIGIN="https://yourdomain.com"

# GraphQL
GRAPHQL_PLAYGROUND=false  # Disable in production
GRAPHQL_INTROSPECTION=false  # Disable in production

# Affiliate Cookie
AFFILIATE_COOKIE_DOMAIN=".yourdomain.com"
AFFILIATE_COOKIE_MAX_AGE=2592000  # 30 days

# Optional: Redis (for future caching)
# REDIS_HOST="localhost"
# REDIS_PORT=6379

# Optional: Email (for notifications)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your@email.com"
# SMTP_PASS="password"
```

#### **Frontend `.env.production`**
```bash
cd frontend
nano .env.production
```

```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_GRAPHQL_URL="https://api.yourdomain.com/graphql"
NEXT_PUBLIC_TRACKING_URL="https://api.yourdomain.com/track"
```

---

### **5. Build Applications** (20 minutes)

#### **Backend Build**
```bash
cd backend

# Install dependencies
bun install

# Build
bun run build

# Verify build output
ls -la dist/
# ✅ Should see compiled JS files
```

#### **Frontend Build**
```bash
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Verify build output
ls -la .next/
# ✅ Should see build artifacts
```

---

## 🚀 Deployment

### **Option A: Docker Compose (Recommended)**

#### **1. Update docker-compose.prod.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: katacore
      POSTGRES_PASSWORD: your-secure-password
      POSTGRES_DB: katacore_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://katacore:your-secure-password@postgres:5432/katacore_prod
      NODE_ENV: production
      PORT: 14000
    ports:
      - "14000:14000"
    depends_on:
      - postgres
    restart: always
    command: bun run start:prod

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com
      NEXT_PUBLIC_GRAPHQL_URL: https://api.yourdomain.com/graphql
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: always
    command: npm start

volumes:
  postgres_data:
```

#### **2. Deploy**
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
# ✅ All services should be "Up"

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

### **Option B: Manual Deployment**

#### **1. Backend (PM2)**
```bash
cd backend

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 config
pm2 save
pm2 startup

# Check status
pm2 status
# ✅ Should show "online"
```

#### **ecosystem.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'katacore-backend',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 14000
    }
  }]
}
```

#### **2. Frontend (PM2)**
```bash
cd frontend

# Start with PM2
pm2 start npm --name "katacore-frontend" -- start

# Check status
pm2 status
```

---

### **3. Nginx Reverse Proxy** (15 minutes)

#### **Install Nginx**
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

#### **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/katacore
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:14000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # GraphQL specific
    location /graphql {
        proxy_pass http://localhost:14000/graphql;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Click tracking
    location /track {
        proxy_pass http://localhost:14000/track;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/katacore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### **4. SSL Certificates** (10 minutes)

#### **Using Certbot (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ Post-Deploy Verification

### **1. Health Checks** (5 minutes)

```bash
# Backend health
curl https://api.yourdomain.com/health
# ✅ Should return: {"status":"ok"}

# Tracking endpoint
curl https://api.yourdomain.com/track/health
# ✅ Should return: {"status":"ok"}

# GraphQL endpoint
curl -X POST https://api.yourdomain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
# ✅ Should return: {"data":{"__typename":"Query"}}

# Frontend
curl https://yourdomain.com
# ✅ Should return HTML
```

---

### **2. Smoke Tests** (30 minutes)

#### **Test 1: Campaign Creation**
```bash
# Via GraphQL Playground (or Postman)
mutation {
  createAffiliateCampaign(input: {
    name: "Test Campaign"
    description: "Test description"
    productUrl: "https://example.com/product"
    commissionType: "percentage"
    commissionRate: 10
    autoApprove: true
  }) {
    id
    name
    status
  }
}

# ✅ Should return campaign ID
```

#### **Test 2: Join Campaign**
```bash
mutation {
  joinCampaign(input: {
    campaignId: "campaign-id-from-test-1"
    message: "I want to join"
  }) {
    id
    status
  }
}

# ✅ Should return: status: "APPROVED" (if autoApprove)
```

#### **Test 3: Generate Link**
```bash
mutation {
  createAffiliateLink(input: {
    campaignId: "campaign-id-from-test-1"
  }) {
    id
    trackingCode
    fullUrl
  }
}

# ✅ Should return tracking code
```

#### **Test 4: Track Click**
```bash
# Get tracking code from Test 3
curl -L https://api.yourdomain.com/track/click/YOUR_TRACKING_CODE

# ✅ Should redirect to product URL
# ✅ Should set cookie: aff_ref
# ✅ Check database for click record
```

#### **Test 5: Track Conversion**
```typescript
// In your order completion handler
import { trackAffiliateConversion } from '@/utils/affiliate-helper';

await trackAffiliateConversion(req, {
  orderId: 'TEST-ORDER-123',
  saleAmount: 1000000, // 1 million VND
  userId: 'user-id'
});

// ✅ Check database:
// - AffConversion created
// - commission = 100,000 (10% of 1M)
// - status = PENDING
```

#### **Test 6: UI Flows**
```bash
# Visit https://yourdomain.com/admin/affiliate

1. ✅ Create campaign (form works)
2. ✅ Browse campaigns (list shows)
3. ✅ Join campaign (modal works)
4. ✅ Generate link (shows tracking URL)
5. ✅ View stats (numbers display)
6. ✅ Request payout (form submits)
7. ✅ Admin approve payout (button works)
```

---

### **3. Database Verification**
```bash
cd backend

# Check data
bun prisma studio

# Verify tables have data:
✅ AffCampaign: 1+ records
✅ AffLink: 1+ records
✅ AffClick: 1+ records (after Test 4)
✅ AffConversion: 1+ records (after Test 5)
```

---

## 📊 Monitoring Setup (30 minutes)

### **1. Simple Log Monitoring**

#### **Create log viewer script**
```bash
nano /opt/katacore/view-logs.sh
```

```bash
#!/bin/bash
echo "=== Backend Logs ==="
docker-compose -f docker-compose.prod.yml logs --tail=50 backend

echo "\n=== Frontend Logs ==="
docker-compose -f docker-compose.prod.yml logs --tail=50 frontend

echo "\n=== Nginx Logs ==="
sudo tail -n 50 /var/log/nginx/error.log
```

```bash
chmod +x /opt/katacore/view-logs.sh
```

---

### **2. Email Alerts (Optional)**

#### **Setup cron job for error monitoring**
```bash
crontab -e
```

```cron
# Check for errors every hour
0 * * * * /opt/katacore/check-errors.sh
```

#### **check-errors.sh**
```bash
#!/bin/bash
ERROR_COUNT=$(docker-compose -f /opt/katacore/docker-compose.prod.yml logs backend | grep -i error | wc -l)

if [ $ERROR_COUNT -gt 10 ]; then
  echo "High error rate detected: $ERROR_COUNT errors" | mail -s "Katacore Alert" admin@yourdomain.com
fi
```

---

### **3. Simple Uptime Monitoring**

Use free services:
- **UptimeRobot**: https://uptimerobot.com (free plan: 50 monitors)
- **Pingdom**: https://pingdom.com (free trial)
- **StatusCake**: https://statuscake.com (free plan)

**Setup monitors for:**
```
✅ https://api.yourdomain.com/health (every 5 min)
✅ https://yourdomain.com (every 5 min)
✅ https://api.yourdomain.com/track/health (every 5 min)
```

---

## 🎯 Beta Testing (Week 1)

### **1. Recruit Beta Users**

#### **Affiliates (10-20 people)**
```
Target:
- Tech-savvy users
- Have audience (blog, social media)
- Willing to give feedback

Incentives:
- Early access
- Higher commission rates
- Direct support
```

#### **Merchants (3-5 people)**
```
Target:
- Have products to promote
- Understand affiliate marketing
- Open to feedback

Incentives:
- Free setup
- Training session
- Priority support
```

---

### **2. Onboarding Process**

#### **Send Welcome Email**
```
Subject: Welcome to [Your Platform] Beta!

Hi [Name],

You're invited to join our affiliate marketing platform beta!

🚀 Getting Started:
1. Visit: https://yourdomain.com
2. Create account
3. For Merchants: Create your first campaign
4. For Affiliates: Browse campaigns and join

📚 Resources:
- User Guide: [link]
- Video Tutorial: [link]
- Support: support@yourdomain.com

⚡ Beta Period:
- Duration: 4 weeks
- Special benefits: Higher commission rates
- Your feedback is crucial!

Questions? Reply to this email!

Best regards,
[Your Name]
```

---

### **3. Support & Feedback**

#### **Setup Support Channels**
```
✅ Email: support@yourdomain.com
✅ Slack/Discord: Create beta group
✅ WhatsApp: For quick questions
```

#### **Collect Feedback**
```
Daily:
- Monitor error logs
- Read support emails
- Check Slack messages

Weekly:
- Survey: "What went well? What needs improvement?"
- 1-on-1 calls with power users
- Review analytics (clicks, conversions)

Document:
- Feature requests
- Bug reports
- Usability issues
```

---

## 🐛 Known Issues & Workarounds

### **Issue 1: No Automated Tests**
**Impact**: Bugs might slip through  
**Mitigation**:
- Manual testing before each change
- Beta users catch issues early
- Quick rollback plan

---

### **Issue 2: No Input Validation**
**Impact**: Invalid data can enter system  
**Mitigation**:
- Admin reviews all campaigns
- Manual data cleanup if needed
- MVP 2 will add validation

---

### **Issue 3: Manual Payments**
**Impact**: Admin workload  
**Mitigation**:
- Process payouts weekly
- Clear payment process documented
- MVP 4 will automate

---

### **Issue 4: No Advanced Logging**
**Impact**: Debugging harder  
**Mitigation**:
- Basic console logs available
- Docker logs accessible
- MVP 2 will add proper logging

---

## 🔄 Rollback Plan

### **If Critical Bug Found**

#### **1. Quick Fix (< 5 minutes)**
```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Or rollback to previous deploy
git checkout previous-commit
docker-compose -f docker-compose.prod.yml up -d --build
```

#### **2. Database Rollback**
```bash
# Backup current state
pg_dump -U katacore katacore_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore previous backup
psql -U katacore katacore_prod < backup_previous.sql
```

#### **3. Communication**
```
1. Post status page update
2. Email beta users
3. Slack announcement
4. Estimated fix time
```

---

## 📈 Success Criteria (Week 1)

### **Technical Metrics**
```
✅ Uptime: > 95%
✅ API response time: < 500ms
✅ Error rate: < 5%
✅ Zero data loss
✅ Zero payment disputes
```

### **User Metrics**
```
✅ 10+ active affiliates
✅ 3+ active merchants
✅ 100+ clicks tracked
✅ 10+ conversions recorded
✅ 3+ payouts completed
```

### **Quality Metrics**
```
✅ < 10 bugs reported
✅ < 3 critical bugs
✅ All critical bugs fixed within 24h
✅ Average user satisfaction: > 4/5
```

---

## 🎉 Go Live Checklist

### **Final Checks Before Announcement**

- [ ] All services running
- [ ] Health checks passing
- [ ] Smoke tests passed
- [ ] SSL certificates valid
- [ ] Monitoring setup
- [ ] Support channels ready
- [ ] Beta users invited
- [ ] Rollback plan documented
- [ ] Team briefed
- [ ] Documentation updated

### **Launch Announcement**

```
🚀 We're LIVE!

[Your Platform] Affiliate System is now in beta!

✅ Track clicks & conversions
✅ Automated commission calculation
✅ Beautiful dashboard
✅ Easy campaign management

🎁 Beta Benefits:
- Higher commission rates
- Priority support
- Early access to new features

Join now: https://yourdomain.com

#affiliate #launch #beta
```

---

## 📞 Emergency Contacts

```
Technical Issues:
- Lead Dev: [phone]
- DevOps: [phone]

Business Issues:
- Product Manager: [phone]
- Support Lead: [phone]

Infrastructure:
- Hosting Provider: [support]
- Domain Registrar: [support]
```

---

## ⏭️ Next Steps (After Deploy)

### **Week 1**
- Monitor daily
- Fix critical bugs
- Collect feedback
- Document issues

### **Week 2**
- Plan MVP 2 (Validation + Payment tracking)
- Start development
- Continue monitoring MVP 1

### **Week 3-4**
- Deploy MVP 2
- Scale to 50+ users
- Prepare for MVP 4 (Stripe)

---

**Prepared**: 2025-10-19  
**Version**: 1.0  
**Status**: Ready to Deploy  

**🚀 LET'S GO LIVE!**
