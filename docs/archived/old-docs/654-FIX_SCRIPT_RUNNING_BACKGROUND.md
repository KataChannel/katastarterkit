# 🐛 Vấn Đề: Script Vẫn Chạy Ẩn Sau Khi Ctrl+C

## ❓ Vấn đề bạn gặp phải

Khi chạy script số 4 (`4docsclean.sh`) hoặc bất kỳ script nào khởi động dev servers, sau khi nhấn **Ctrl+C** để tắt, các processes vẫn **tiếp tục chạy ẩn** trong background.

## 🔍 Nguyên nhân

### 1. **Concurrently chạy nhiều child processes**
Khi bạn chạy `bun run dev:rausach`, nó thực chất chạy:
```bash
concurrently "bun run dev:rausach:backend" "bun run dev:rausach:frontend"
```

Điều này tạo ra **cây processes**:
```
bun run dev:rausach (PID 384670)
└── node concurrently (PID 384671)
    ├── bun run dev:rausach:backend (PID 384707)
    │   └── ts-node-dev main.ts (PID 384714)
    │       └── node main.ts (PID 384759)
    └── bun run dev:rausach:frontend (PID 384709)
        └── next dev -p 12000 (PID 384715)
            └── postcss.js (PID 385623)
```

### 2. **Ctrl+C chỉ kill process cha**
Khi nhấn **Ctrl+C** trong terminal:
- Signal `SIGINT` được gửi tới **process cha** (bun run dev:rausach)
- **Nhưng các child processes** (`ts-node-dev`, `next dev`, `postcss`) vẫn tiếp tục chạy
- Chúng trở thành **orphan processes** và được adopt bởi `systemd` hoặc `init`

### 3. **Script 4docsclean.sh đặc biệt**
Script này sử dụng `find` để search đệ quy:
```bash
find . -type f -name "*.md" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  ...
```

Trong project lớn, `find` có thể:
- Tạo nhiều subprocesses để scan directories
- Chạy lâu nếu có nhiều files/folders
- Các subprocesses này có thể không bị kill khi Ctrl+C

## ✅ Giải pháp

### **Option 1: Kill bằng script tự động (Khuyến nghị)**

Sử dụng script `6kill-dev-servers.sh`:
```bash
./menu.sh
# Chọn 6 - kill-dev-servers.sh
```

Hoặc chạy trực tiếp:
```bash
bash scripts/6kill-dev-servers.sh
```

### **Option 2: Kill bằng lệnh thủ công**

```bash
# Kill tất cả dev servers
pkill -9 -f "concurrently.*rausach"
pkill -9 -f "ts-node-dev.*main.ts"
pkill -9 -f "next dev.*12000"

# Verify
ps aux | grep -E "concurrently|ts-node-dev|next dev" | grep -v grep
```

### **Option 3: Kill theo ports**

Sử dụng script `5killport.sh`:
```bash
./menu.sh
# Chọn 5 - killport.sh
```

Sau đó nhập ports: `4000 12000`

### **Option 4: Kill toàn bộ Node processes (Cẩn thận!)**

```bash
pkill -9 node
pkill -9 bun
```

⚠️ **Chú ý**: Sẽ kill **TẤT CẢ** Node/Bun processes trên máy!

## 🛠️ Cách phòng tránh

### 1. **Sử dụng trap để cleanup**

Thêm vào script:
```bash
#!/bin/bash

# Cleanup function
cleanup() {
    echo "🛑 Đang dọn dẹp processes..."
    pkill -P $$  # Kill all child processes
    exit
}

# Trap signals
trap cleanup EXIT INT TERM

# Your script logic here...
```

### 2. **Chạy trong tmux/screen session**

```bash
# Start tmux
tmux new -s dev

# Run your script
./menu.sh

# Detach: Ctrl+B, D
# Kill session: tmux kill-session -t dev
```

### 3. **Sử dụng PM2 cho dev servers**

```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start "bun run dev:rausach:backend" --name backend

# Start frontend
pm2 start "bun run dev:rausach:frontend" --name frontend

# Stop all
pm2 stop all

# Kill all
pm2 kill
```

## 🔧 Scripts có sẵn

| Script | Mục đích | Cách dùng |
|--------|----------|-----------|
| `5killport.sh` | Kill process theo port | `./menu.sh` → chọn 5 |
| `6kill-dev-servers.sh` | Kill dev servers | `./menu.sh` → chọn 6 |
| `fix-file-watchers.sh` | Fix file watcher limits | `./menu.sh` → chọn 6 |

## 📊 Debug Commands

### Kiểm tra processes đang chạy
```bash
# Xem tất cả processes liên quan
ps aux | grep -E "concurrently|ts-node-dev|next dev|bun" | grep -v grep

# Xem cây processes
pstree -p | grep -A 10 concurrently
```

### Kiểm tra ports đang sử dụng
```bash
# Xem process trên port 4000 và 12000
lsof -ti:4000,12000

# Xem chi tiết
lsof -i:4000
lsof -i:12000
```

### Kiểm tra orphan processes
```bash
# Processes không có parent (PPID = 1)
ps -eo pid,ppid,comm | awk '$2 == 1'
```

## 💡 Best Practices

1. **Luôn kiểm tra processes trước khi start mới**
   ```bash
   lsof -ti:4000,12000 && echo "Port đang được sử dụng!" || echo "OK"
   ```

2. **Sử dụng script killport trước khi start**
   ```bash
   bash scripts/5killport.sh
   # Enter ports: 4000 12000
   ```

3. **Monitor processes khi chạy**
   ```bash
   # Terminal 1: Run server
   ./menu.sh
   
   # Terminal 2: Monitor
   watch -n 1 'ps aux | grep -E "concurrently|ts-node" | grep -v grep'
   ```

4. **Cleanup sau khi development**
   ```bash
   # Tạo alias trong ~/.bashrc
   alias killdev='pkill -9 -f "concurrently.*rausach"; pkill -9 -f "ts-node-dev"; pkill -9 -f "next dev"'
   
   # Sử dụng
   killdev
   ```

## 📝 Kết luận

**Vấn đề**: Script 4 không phải **chạy ẩn**, mà là các **dev servers** (backend/frontend) được start bởi script khác vẫn chạy sau khi Ctrl+C.

**Giải pháp nhanh**:
```bash
pkill -9 -f "concurrently.*rausach"
pkill -9 -f "ts-node-dev"
pkill -9 -f "next dev"
```

**Giải pháp tốt**: Sử dụng `scripts/6kill-dev-servers.sh` hoặc `scripts/5killport.sh`

---

**Last Updated**: 2024-11-11  
**Author**: GitHub Copilot
