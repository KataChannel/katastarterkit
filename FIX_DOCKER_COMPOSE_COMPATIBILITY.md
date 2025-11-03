# Fix: Docker Compose Compatibility

## Vấn đề (Problem)

Khi chạy lệnh:
```bash
make -f Makefile.hybrid start-all
```

Gặp lỗi:
```
make: docker-compose: No such file or directory
make: *** [Makefile.hybrid:63: start-all] Error 127
```

## Nguyên nhân (Root Cause)

- **Docker Compose v1** (cũ): Sử dụng command `docker-compose` (binary độc lập)
- **Docker Compose v2** (mới): Sử dụng command `docker compose` (plugin của Docker)

Makefiles cũ hardcode sử dụng `docker-compose`, không tương thích với Docker Compose v2.

## Giải pháp (Solution)

Thêm auto-detection vào đầu Makefile để tự động phát hiện và sử dụng đúng command:

```makefile
# Auto-detect docker-compose command (v1 vs v2)
DOCKER_COMPOSE := $(shell which docker-compose 2>/dev/null)
ifeq ($(DOCKER_COMPOSE),)
	DOCKER_COMPOSE := docker compose
endif
```

Sau đó thay thế tất cả `docker-compose` bằng `$(DOCKER_COMPOSE)` trong các target:

```makefile
# Trước (Before)
start-all:
	@docker-compose -f $(COMPOSE_FILE) up -d

# Sau (After)
start-all:
	@$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d
```

## Files đã fix (Fixed Files)

✅ **Makefile.hybrid** - Hybrid deployment automation
- Dòng 9-12: Thêm auto-detection
- Tất cả commands: Thay `docker-compose` → `$(DOCKER_COMPOSE)`

✅ **Makefile.multi-domain** - Shared infrastructure automation
- Dòng 9-12: Thêm auto-detection
- Tất cả commands: Thay `docker-compose` → `$(DOCKER_COMPOSE)`

## Kiểm tra (Verification)

### Kiểm tra Docker Compose version:

```bash
# Kiểm tra v1 (standalone)
which docker-compose
# Output: /usr/local/bin/docker-compose (nếu có)
# Output: nothing (nếu không có)

# Kiểm tra v2 (plugin)
docker compose version
# Output: Docker Compose version v2.x.x
```

### Test Makefiles:

```bash
# Test Hybrid
make -f Makefile.hybrid help
make -f Makefile.hybrid status

# Test Multi-domain
make -f Makefile.multi-domain help
make -f Makefile.multi-domain status
```

## Kết quả (Results)

✅ Cả 2 Makefiles hoạt động với:
- Docker Compose v1 (`docker-compose`)
- Docker Compose v2 (`docker compose`)

✅ Tự động phát hiện và sử dụng đúng command

✅ Không cần sửa code khi upgrade/downgrade Docker Compose

## Cảnh báo có thể bỏ qua (Ignorable Warnings)

Khi chạy với Docker Compose v2, có thể thấy warning:

```
WARN[0000] /path/to/docker-compose.yml: the attribute `version` is obsolete
```

**Giải thích:**
- Docker Compose v2 không cần field `version:` trong YAML nữa
- Warning này không ảnh hưởng đến hoạt động
- Có thể bỏ qua hoặc xóa `version: "3.8"` trong file docker-compose.yml

## Next Steps

1. ✅ Fix hoàn tất và đã test
2. 📝 Update documentation để hướng dẫn users
3. 🚀 Ready để deploy với cả Docker Compose v1 và v2

---

**Thời gian fix:** 2025-01-07  
**Tác động:** Tất cả Makefiles cho multi-domain deployment  
**Trạng thái:** ✅ RESOLVED
