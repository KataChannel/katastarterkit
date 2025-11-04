#!/bin/bash

# Demo Script - Quick Start Multi-Domain
# Hiển thị các lệnh thường dùng

cat << 'EOF'
╔════════════════════════════════════════════════════════════╗
║        🚀 MULTI-DOMAIN DEPLOYMENT - QUICK COMMANDS        ║
╚════════════════════════════════════════════════════════════╝

📦 HYBRID DEPLOYMENT (Khuyên dùng - Production)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Khởi động:
    ./start-hybrid.sh all          # Tất cả services
    ./start-hybrid.sh rausach      # Chỉ Rausach
    ./start-hybrid.sh tazagroup    # Chỉ Tazagroup
    ./start-hybrid.sh shared       # Chỉ Redis + Minio

  Dừng:
    ./stop-hybrid.sh all           # Dừng tất cả
    ./stop-hybrid.sh rausach       # Dừng Rausach
    ./stop-hybrid.sh tazagroup     # Dừng Tazagroup

  Quản lý:
    ./logs-hybrid.sh all           # Xem logs tất cả
    ./logs-hybrid.sh rausach       # Logs Rausach
    ./logs-hybrid.sh tazagroup     # Logs Tazagroup
    ./status-hybrid.sh             # Trạng thái & resource

  Menu tương tác:
    ./deploy-hybrid.sh             # Menu với 18 options

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 MULTI-DOMAIN DEPLOYMENT (Testing/Development)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Khởi động:
    ./start-multi-domain.sh all          # Tất cả
    ./start-multi-domain.sh rausach      # Chỉ Rausach
    ./start-multi-domain.sh tazagroup    # Chỉ Tazagroup

  Dừng:
    ./stop-multi-domain.sh all           # Dừng tất cả
    ./stop-multi-domain.sh rausach       # Dừng Rausach
    ./stop-multi-domain.sh tazagroup     # Dừng Tazagroup

  Menu tương tác:
    ./deploy-multi-domain.sh             # Menu interactive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 DOCKER COMPOSE TRỰC TIẾP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Hybrid:
    docker compose -f docker-compose.hybrid.yml up -d
    docker compose -f docker-compose.hybrid.yml down
    docker compose -f docker-compose.hybrid.yml ps
    docker compose -f docker-compose.hybrid.yml logs -f

  Multi-Domain:
    docker compose -f docker-compose.multi-domain.yml up -d
    docker compose -f docker-compose.multi-domain.yml down
    docker compose -f docker-compose.multi-domain.yml ps
    docker compose -f docker-compose.multi-domain.yml logs -f

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 URLS TRUY CẬP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Rausach (12xxx):
    Frontend:  http://116.118.49.243:12000
    Backend:   http://116.118.49.243:12001/graphql
    Database:  116.118.49.243:12003

  Tazagroup (13xxx):
    Frontend:  http://116.118.49.243:13000
    Backend:   http://116.118.49.243:13001/graphql
    Database:  116.118.49.243:13003

  Shared:
    Minio:     http://116.118.49.243:12008
    Redis:     116.118.49.243:12004

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 TÀI LIỆU CHI TIẾT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  cat HUONG_DAN_DEPLOY_NO_MAKEFILE.md
  cat LOAI_BO_MAKEFILE.md
  cat SO_SANH_PHUONG_AN_DEPLOY.md
  cat HUONG_DAN_HYBRID_DEPLOYMENT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 GỢI Ý
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Dùng Hybrid cho Production (ổn định hơn)
  ✅ Dùng Multi-Domain cho Testing (tiết kiệm RAM)
  ✅ Không cần Makefile nữa - chỉ cần bash!
  ✅ Scripts tự động detect Docker Compose v1/v2

EOF
