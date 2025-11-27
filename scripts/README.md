# Scripts Directory

Thư mục chứa tất cả các scripts quản lý, deployment và utilities của dự án multi-domain.

## 🚀 Quick Start

```bash
# Cách 1: Qua package.json (khuyến nghị)
bun run dev

# Cách 2: Qua menu script
bun run menu

# Cách 3: Chạy trực tiếp
./scripts/dev-deploy-menu.sh
```

## 📁 Cấu trúc

```
scripts/
├── dev-deploy-menu.sh   # ⭐ Menu chính - Multi-domain interactive menu
├── menu.sh              # Quick launcher
│
├── deploy-rausach.sh    # Deploy RAUSACH (shop.rausachtrangia.com)
├── deploy-tazagroup.sh  # Deploy TAZAGROUP (app.tazagroup.vn)
├── deploy-timona.sh     # Deploy TIMONA (app.timona.edu.vn)
│
├── kill-ports.sh        # Kill processes on ports
│
├── deployment/          # Scripts triển khai lên server (legacy)
├── docker/              # Scripts quản lý Docker (legacy)
├── infrastructure/      # Scripts kiểm tra hạ tầng (legacy)
└── setup/               # Scripts cài đặt và cấu hình (legacy)
```

## 🏢 Multi-Domain Support

Hệ thống hỗ trợ 3 domains chạy song song:

### RAUSACH - shop.rausachtrangia.com
- Frontend: Port 12000
- Backend: Port 12001
- Bucket: shopuploads

### TAZAGROUP - app.tazagroup.vn
- Frontend: Port 13000
- Backend: Port 13001
- Bucket: tazagroup-uploads

### TIMONA - app.timona.edu.vn
- Frontend: Port 15000
- Backend: Port 15001
- Bucket: timona-uploads
