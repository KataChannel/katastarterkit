# InnerV2 Infrastructure Deployment - Quick Reference

## 🎯 What's Been Updated

### ✅ Removed from Docker Compose
- ❌ Elasticsearch (removed completely)
- ❌ Backend NestJS (will run locally for development)
- ❌ Frontend Next.js container (will run locally for development)

### ✅ Deployed to Server (116.118.48.208)
- ✅ PostgreSQL Database (port 14003)
- ✅ pgAdmin (port 14002)
- ✅ Redis Cache (port 14004)
- ✅ MinIO Object Storage (ports 14007-14008)

## 🚀 Deployment Commands

### Option 1: Complete Auto Deployment (Recommended)
```bash
./deploy-all.sh
```

### Option 2: Infrastructure Only
```bash
./deploy-infrastructure.sh
```

### Option 3: Manual Steps
```bash
# 1. Deploy infrastructure
./deploy-infrastructure.sh

# 2. Update frontend config
./update-frontend-env.sh

# 3. Sync database
cd frontend && bunx prisma db push && bunx prisma generate
```

## 🔧 Management Commands

```bash
# Quick infrastructure management
./infra.sh status          # Check containers
./infra.sh logs            # View all logs
./infra.sh restart         # Restart services
./infra.sh stop            # Stop services
./infra.sh start           # Start services
./infra.sh backup-db       # Backup database
./infra.sh psql            # Connect to database
./infra.sh redis-cli       # Connect to Redis
```

## 📊 Service Access

| Service | URL/Connection | Credentials |
|---------|---------------|-------------|
| PostgreSQL | `116.118.48.208:14003` | postgres/postgres |
| pgAdmin | http://116.118.48.208:14002 | admin@innerv2core.com/admin123 |
| Redis | `116.118.48.208:14004` | Password: 123456 |
| MinIO API | http://116.118.48.208:14007 | innerv2core-admin/innerv2core-secret-2025 |
| MinIO Console | http://116.118.48.208:14008 | innerv2core-admin/innerv2core-secret-2025 |

## 🏃 Running Development

After infrastructure is deployed:

```bash
# Frontend only (connects to remote infrastructure)
cd frontend
bun run dev
# Access at http://localhost:14000
```

## 📁 Files Created

```
.
├── deploy-all.sh               # Complete deployment script
├── deploy-infrastructure.sh    # Deploy only infrastructure
├── update-frontend-env.sh      # Update frontend config
├── infra.sh                    # Infrastructure management CLI
├── DEPLOYMENT.md               # Full deployment documentation
├── docker-compose.yml          # Updated (infra only)
└── backups/                    # Database backups directory
```

## 🔥 Quick Troubleshooting

### Can't connect to services?
```bash
# Check if containers are running
./infra.sh status

# Check logs
./infra.sh logs

# Restart services
./infra.sh restart
```

### Database connection failed?
```bash
# Test connection
psql "postgresql://postgres:postgres@116.118.48.208:14003/innerv2core"

# Or use infra script
./infra.sh psql
```

### Need to update deployment?
```bash
# Update and restart
./infra.sh update
```

## 📖 Full Documentation

See `DEPLOYMENT.md` for complete documentation including:
- Detailed deployment steps
- Database management
- MinIO configuration
- Redis management
- Firewall setup
- Backup/restore procedures
- Troubleshooting guide

## 🎉 Next Steps

1. Run deployment: `./deploy-all.sh`
2. Verify services: `./infra.sh status`
3. Start frontend: `cd frontend && bun run dev`
4. Access app: http://localhost:14000

## 📝 Notes

- Infrastructure runs on server 116.118.48.208
- Frontend runs locally and connects to remote infrastructure
- Backend removed from Docker (GraphQL eliminated, using Next.js fullstack)
- All data persisted in Docker volumes on server
- Automatic health checks for all services
