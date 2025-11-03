# Multi-Domain Deployment - Quick Reference

## 🎯 Triển khai 2 domain trên 1 server cấu hình thấp

**Server:** 1 Core / 1GB RAM / 5GB Disk

### ⚡ Bắt Đầu Ngay

```bash
# 1. Kiểm tra hệ thống
./check-system-multi-domain.sh

# 2. Tạo swap file (BẮT BUỘC)
make -f Makefile.multi-domain setup-swap

# 3. Khởi động
make -f Makefile.multi-domain start-all
```

### 🌐 URLs Truy Cập

- **Rausach**: http://116.118.49.243:12000
- **Tazagroup**: http://116.118.49.243:13000

### 📋 Lệnh Thường Dùng

```bash
make -f Makefile.multi-domain help              # Xem menu
make -f Makefile.multi-domain status            # Trạng thái
make -f Makefile.multi-domain logs              # Xem logs
make -f Makefile.multi-domain stop-all          # Dừng tất cả
./deploy-multi-domain.sh                        # Menu tương tác
```

### 📚 Tài Liệu Chi Tiết

- [Quick Start Guide](QUICK_START_MULTI_DOMAIN.md) - Hướng dẫn nhanh
- [Hướng Dẫn Đầy Đủ](HUONG_DAN_MULTI_DOMAIN.md) - Chi tiết setup
- [So Sánh Phương Án](SO_SANH_PHUONG_AN_DEPLOY.md) - Lựa chọn deployment
- [Setup Complete](MULTI_DOMAIN_SETUP_COMPLETE.md) - Tổng hợp

### 🎉 Xem Thông Tin Setup

```bash
./show-multi-domain-info.sh
```
