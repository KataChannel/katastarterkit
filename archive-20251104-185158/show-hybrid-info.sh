#!/bin/bash

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ✅ PHƯƠNG ÁN 3 - HYBRID DEPLOYMENT READY! 🎯                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🏆 KHUYẾN NGHỊ: Phương Án TỐI ƯU cho Production!

📦 KIẾN TRÚC:
   ┌────────────────────────────────────────┐
   │  Database: DEDICATED (Quan trọng!)    │
   │  • Rausach DB:    Port 12003          │
   │  • Tazagroup DB:  Port 13003          │
   └────────────────────────────────────────┘
   ┌────────────────────────────────────────┐
   │  Cache & Storage: SHARED (Tiết kiệm)  │
   │  • Redis:  Port 12004                 │
   │  • Minio:  Port 12007/12008           │
   └────────────────────────────────────────┘

💾 TÀI NGUYÊN:
   • RAM Usage:      ~1.8GB (with 1GB swap)
   • Min RAM:        1.5GB
   • Disk:           ~4GB
   • CPU:            1-2 Cores

🚀 QUICK START:

   1. Setup swap (khuyến nghị 1GB):
      sudo fallocate -l 1G /swapfile
      sudo chmod 600 /swapfile
      sudo mkswap /swapfile
      sudo swapon /swapfile

   2. Khởi động (chọn 1 trong 3):
      
      a) Makefile (khuyến nghị):
         make -f Makefile.hybrid start-all
      
      b) Script menu:
         ./deploy-hybrid.sh
      
      c) Docker Compose:
         docker-compose -f docker-compose.hybrid.yml up -d

   3. Kiểm tra:
      make -f Makefile.hybrid status

🌐 URLS:
   Rausach:
   • Frontend:   http://116.118.49.243:12000
   • Backend:    http://116.118.49.243:12001/graphql
   • Database:   116.118.49.243:12003

   Tazagroup:
   • Frontend:   http://116.118.49.243:13000
   • Backend:    http://116.118.49.243:13001/graphql
   • Database:   116.118.49.243:13003

   Shared:
   • Minio:      http://116.118.49.243:12008
   • Redis:      116.118.49.243:12004

📋 LỆNH HAY DÙNG:

   # Quản lý
   make -f Makefile.hybrid help              # Menu
   make -f Makefile.hybrid status            # Trạng thái
   make -f Makefile.hybrid logs              # Logs tất cả
   make -f Makefile.hybrid logs-rausach      # Logs Rausach
   make -f Makefile.hybrid logs-tazagroup    # Logs Tazagroup

   # Khởi động riêng lẻ (tiết kiệm RAM)
   make -f Makefile.hybrid start-rausach     # Chỉ Rausach
   make -f Makefile.hybrid start-tazagroup   # Chỉ Tazagroup

   # Backup
   make -f Makefile.hybrid backup-rausach
   make -f Makefile.hybrid backup-tazagroup

   # Restore
   make -f Makefile.hybrid restore-rausach BACKUP_FILE=./backups/file.sql

   # Dừng
   make -f Makefile.hybrid stop-all

✨ ƯU ĐIỂM PHƯƠNG ÁN HYBRID:

   ✅ Database DEDICATED    - An toàn, dễ backup
   ✅ Performance tốt       - DB không bị share
   ✅ Chi phí hợp lý        - Tiết kiệm cache/storage
   ✅ Production-ready      - Đáng tin cậy
   ✅ Dễ scale             - Tách DB ra sau này
   ✅ Cân bằng tốt nhất    - Cost vs Performance

📊 SO SÁNH:

   Phương án 1 (Shared):      RAM: 1.5GB   | Score: 6.5/10
   Phương án 2 (Isolated):    RAM: 2.5GB   | Score: 8.5/10
   Phương án 3 (Hybrid):      RAM: 1.8GB   | Score: 9/10 🏆

⚠️  LƯU Ý:

   ✓ BẮT BUỘC có swap file (ít nhất 1GB)
   ✓ Backup database mỗi ngày
   ✓ Monitor RAM thường xuyên
   ✓ Đổi mật khẩu mặc định trong .env files
   ✓ Setup firewall cho ports

📚 TÀI LIỆU:

   • HUONG_DAN_HYBRID_DEPLOYMENT.md  - Hướng dẫn chi tiết
   • SO_SANH_PHUONG_AN_DEPLOY.md     - So sánh 3 phương án
   • Makefile.hybrid                 - Makefile commands
   • deploy-hybrid.sh                - Interactive menu

🎯 PHƯƠNG ÁN NÀY PHÙ HỢP:

   ✅ Production environment
   ✅ Server 1.5-2GB RAM
   ✅ Cần database isolation
   ✅ Budget trung bình (~250k VNĐ/tháng)
   ✅ Traffic trung bình (100-1000 users/day)
   ✅ Startup đang growth
   ✅ Cần backup/restore dễ dàng

❌ KHÔNG PHÙ HỢP:

   ❌ Server < 1.4GB RAM (dùng Phương án 1)
   ❌ Traffic cực cao (dùng Phương án 2)
   ❌ Budget rất thấp (dùng Phương án 1)

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🎉 Sẵn sàng deploy Production! Chúc bạn thành công! 🚀    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

EOF
