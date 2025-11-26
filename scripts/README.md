# Scripts Directory

Thư mục chứa tất cả các scripts quản lý, deployment và utilities của dự án.

## 📁 Cấu trúc

```
scripts/
├── deployment/           # Scripts triển khai lên server
│   ├── deploy-infrastructure.sh    # Deploy PostgreSQL, Redis, Minio
│   ├── deploy-optimized.sh         # Deploy Backend + Frontend
│   ├── rollback.sh                 # Rollback về version trước
│   └── stop-services.sh            # Dừng các services
│
├── docker/              # Scripts quản lý Docker
│   ├── cleanup-docker.sh           # Dọn dẹp Docker images/containers
│   ├── show-images.sh              # Hiển thị Docker images
│   └── start-infrastructure.sh     # Khởi động infrastructure locally
│
├── infrastructure/      # Scripts kiểm tra hạ tầng
│   ├── check-deployment-status.sh  # Kiểm tra trạng thái deployment
│   └── check-infrastructure.sh     # Kiểm tra infrastructure services
│
├── setup/              # Scripts cài đặt và cấu hình
│   ├── build-frontend-prod.sh      # Build frontend cho production
│   ├── create-env-production.sh    # Tạo file .env production
│   └── setup-storage-domain.sh     # Cấu hình storage domain
│
├── dev-deploy-menu.sh   # Menu deployment chính ⭐
├── dev-menu.sh          # Menu development
└── vscode-menu.sh       # Menu cho VS Code
```

## 🚀 Quick Start

```bash
# Mở menu deployment (khuyên dùng)
bun run dev

# Deployment nhanh
./scripts/deployment/deploy-infrastructure.sh  # Lần đầu
./scripts/deployment/deploy-optimized.sh       # Mỗi lần update code
```
