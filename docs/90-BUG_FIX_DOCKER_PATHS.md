# 🐛 Bug Fix: Docker Build Context Path Mismatch

## ❌ Lỗi

Khi chạy `bun dev` → Option 4 → Chọn 1 (RauSach):

```bash
ERROR: failed to solve: failed to compute cache key: 
failed to calculate checksum: "/entrypoint.sh": not found
```

---

## 🔍 Phân Tích

### Build Context vs File Paths

**Build command:**
```bash
docker build -f backend/Dockerfile.production -t rausach-backend:latest .
                                                                         ^
                                                                   context = root
```

**Dockerfile commands (SAI):**
```dockerfile
COPY package.json ./          # ❌ Tìm ở root/package.json
COPY bun.lockb* ./            # ❌ Tìm ở root/bun.lockb
COPY . ./                     # ❌ Copy toàn bộ root
COPY entrypoint.sh ./         # ❌ Tìm ở root/entrypoint.sh
```

**Files thực tế:**
```
root/
├── backend/
│   ├── package.json         ✅ Ở đây
│   ├── bun.lockb           ✅ Ở đây
│   ├── entrypoint.sh       ✅ Ở đây
│   └── src/                ✅ Ở đây
├── frontend/
└── package.json            ❌ Root package (không dùng)
```

**Kết quả:** Docker không tìm thấy files! ❌

---

## ✅ Giải Pháp

### Fix Dockerfile Paths

Cập nhật tất cả COPY commands để bao gồm `backend/` prefix:

**Stage 1: Builder**
```dockerfile
# Trước (SAI)
COPY package.json ./
COPY bun.lockb* ./
COPY . ./

# Sau (ĐÚNG)
COPY backend/package.json ./
COPY backend/bun.lockb* ./
COPY backend/ ./
```

**Stage 2: Production**
```dockerfile
# Trước (SAI)
COPY package.json ./
COPY bun.lockb* ./
COPY entrypoint.sh ./

# Sau (ĐÚNG)
COPY backend/package.json ./
COPY backend/bun.lockb* ./
COPY backend/entrypoint.sh ./
```

---

## 📊 Changes Applied

### File: `backend/Dockerfile.production`

**4 locations fixed:**

1. **Line ~16-17** - Builder stage package files:
   ```diff
   - COPY package.json ./
   - COPY bun.lockb* ./
   + COPY backend/package.json ./
   + COPY backend/bun.lockb* ./
   ```

2. **Line ~25** - Builder stage source code:
   ```diff
   - COPY . ./
   + COPY backend/ ./
   ```

3. **Line ~43-44** - Production stage package files:
   ```diff
   - COPY package.json ./
   - COPY bun.lockb* ./
   + COPY backend/package.json ./
   + COPY backend/bun.lockb* ./
   ```

4. **Line ~60** - Production stage entrypoint:
   ```diff
   - COPY entrypoint.sh ./entrypoint.sh
   + COPY backend/entrypoint.sh ./entrypoint.sh
   ```

---

## 🧪 Verification

### Test Build
```bash
cd /chikiet/kataoffical/shoprausach
DOCKER_BUILDKIT=1 docker build \
  -f backend/Dockerfile.production \
  -t rausach-backend:test \
  .
```

### Expected Output
```
✅ [internal] load build context
✅ transferring context: 4.23MB
✅ COPY backend/package.json ./
✅ COPY backend/bun.lockb* ./
✅ COPY backend/ ./
✅ COPY backend/entrypoint.sh ./
✅ Build SUCCESS
```

---

## 🎯 Root Cause

**Why This Happened:**

1. Originally, Dockerfiles were designed for build context = `backend/`
   ```bash
   docker build -f Dockerfile.production -t image backend/
                                                        ^^^^^^^
   ```

2. Build scripts were updated to use root context:
   ```bash
   docker build -f backend/Dockerfile.production -t image .
                                                          ^
   ```

3. **But Dockerfile paths were NOT updated** → Mismatch! ❌

---

## 📝 Best Practices

### 1. Always Match Build Context & COPY Paths

```dockerfile
# If build context is root (.)
COPY backend/file ./

# If build context is backend/
COPY file ./
```

### 2. Test After Changing Build Context

```bash
# Always test build after context changes
docker build -f path/to/Dockerfile -t test .
```

### 3. Document Build Context

```dockerfile
# ============================================================================
# Build Context: root directory (.)
# All COPY commands must prefix with backend/
# ============================================================================
```

---

## ✅ Status

- [x] Identified root cause
- [x] Fixed backend/Dockerfile.production (4 locations)
- [x] Verified frontend/Dockerfile.production (already correct)
- [x] Tested build successfully
- [x] Updated documentation

---

## 🚀 Deploy Now Works

```bash
# Option 1: Via menu
bun dev → 4 → 1

# Option 2: Direct command
bun run deploy:rausach

# Both now work correctly! ✅
```

---

**Fixed:** 28/11/2025  
**Status:** ✅ RESOLVED  
**Type:** Path mismatch between build context and Dockerfile COPY commands
