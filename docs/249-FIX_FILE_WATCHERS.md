# Fix Bug: ENOSPC File Watchers

## 🐛 Lỗi

```
Watchpack Error (watcher): Error: ENOSPC: System limit for number of file watchers reached
```

## 🔍 Nguyên Nhân

Linux giới hạn số lượng file watchers mà một user có thể tạo. Next.js/React development servers cần nhiều watchers để hot-reload.

**Giới hạn mặc định:** 65,536 (thường không đủ cho dự án lớn)

## ✅ Giải Pháp

### Cách 1: Chạy Script Tự Động

```bash
./fix-file-watchers.sh
```

### Cách 2: Manual Fix

```bash
# Tăng giới hạn lên 524,288
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
echo fs.inotify.max_user_instances=256 | sudo tee -a /etc/sysctl.conf
echo fs.inotify.max_queued_events=16384 | sudo tee -a /etc/sysctl.conf

# Apply ngay
sudo sysctl -p

# Verify
cat /proc/sys/fs/inotify/max_user_watches
```

**Kết quả mong đợi:** `524288`

## 📝 Technical Details

### inotify Parameters

| Parameter | Giá trị cũ | Giá trị mới | Mô tả |
|-----------|-----------|-------------|-------|
| `max_user_watches` | 65,536 | 524,288 | Số file có thể watch |
| `max_user_instances` | 128 | 256 | Số inotify instances |
| `max_queued_events` | 16,384 | 16,384 | Event queue size |

### Tại sao 524,288?

- **65,536** (mặc định): Đủ cho ~1,000 files
- **524,288** (recommended): Đủ cho ~8,000 files
- Dự án này có nhiều files: frontend, backend, node_modules, .next cache

### File được watch

```bash
# Kiểm tra số files đang được watch
find . -type f | wc -l

# Kiểm tra số watchers đang dùng
cat /proc/$(pgrep -f "next dev")/fd | wc -l
```

## 🔄 Sau Khi Fix

1. **Restart development server:**
   ```bash
   cd frontend
   bun dev
   ```

2. **Verify không còn lỗi:**
   - Terminal sẽ không hiện `ENOSPC` error
   - Hot-reload hoạt động bình thường

## 🚀 Deployment

**File created:**
- ✅ `fix-file-watchers.sh` - Script tự động fix

**System changes:**
- ✅ `/etc/sysctl.conf` - Tăng `fs.inotify.max_user_watches` lên 524,288
- ✅ Applied với `sysctl -p`

**Permanent:** Thay đổi sẽ tồn tại sau khi reboot

## 📌 Note

- **Chỉ cần chạy 1 lần** - Thay đổi là permanent
- **Không ảnh hưởng performance** - Chỉ tăng giới hạn, không dùng thêm RAM
- **Safe** - Giá trị 524,288 là recommended cho development

---

**Fixed:** 1/11/2025  
**Status:** ✅ Resolved
