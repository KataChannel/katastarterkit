# Tính năng Dừng tiến trình đồng bộ (Stop Sync Process)

## Tổng quan

Thêm tính năng cho phép người dùng dừng tiến trình đồng bộ Call Center đang chạy.

## Các thay đổi

### Backend

#### 1. CallCenterService (`backend/src/services/callcenter.service.ts`)

- **Thêm Map tracking**: `runningSyncs` - lưu trữ các sync đang chạy với `AbortController`
- **Thêm method `stopSyncProcess`**: Dừng tiến trình sync theo `syncLogId`
- **Cập nhật `syncCallCenterData`**: 
  - Đăng ký sync vào `runningSyncs` khi bắt đầu
  - Kiểm tra abort signal trong vòng lặp fetch và process
  - Sử dụng `AbortController` để cancel fetch request
  - Tự động cleanup khi hoàn thành hoặc lỗi

#### 2. CallCenterModel (`backend/src/graphql/models/callcenter.model.ts`)

- **Thêm `StopSyncResponse`**: Response type cho mutation stop
  - `success`: Boolean - kết quả thành công/thất bại
  - `message`: String - thông báo
  - `syncLogId`: String - ID của sync log
  - `recordsProcessed`: Int (optional) - số records đã xử lý

#### 3. CallCenterResolver (`backend/src/graphql/resolvers/callcenter.resolver.ts`)

- **Thêm mutation `stopSyncProcess`**: GraphQL endpoint để dừng sync

### Frontend

#### 1. CallCenterPage (`frontend/src/app/admin/callcenter/page.tsx`)

- **Thêm mutation STOP_SYNC_PROCESS**: GraphQL mutation
- **Thêm state `stopping`**: Tracking trạng thái đang dừng
- **Thêm handler `handleStopSync`**: Xử lý gọi mutation stop
- **Cập nhật UI**:
  - Nút "Dừng" trong phần "Đồng bộ đang chạy"
  - Nút "Dừng" trong danh sách "Chi tiết đồng bộ gần đây" cho sync running
  - Badge trạng thái "Đã dừng" (stopped) với màu cam
  - Icon `StopCircle` cho trạng thái stopped

#### 2. SyncProgressDialog

- **Thêm props**: `onStop`, `stopping`
- **Thêm nút "Dừng đồng bộ"** trong DialogFooter
- **Xử lý trạng thái `stopped`**: Icon, message, logs

## Trạng thái Sync Log

| Status | Mô tả | Màu |
|--------|-------|-----|
| `running` | Đang chạy | Vàng |
| `success` | Thành công | Xanh lá |
| `error` | Thất bại | Đỏ |
| `stopped` | Đã dừng | Cam |

## Cách hoạt động

1. Khi bắt đầu sync, tạo `AbortController` và lưu vào `runningSyncs` Map
2. Trong vòng lặp fetch/process, kiểm tra `aborted` flag
3. Khi user nhấn Stop:
   - Gọi mutation `stopSyncProcess`
   - Backend đánh dấu `aborted = true` và gọi `signal.abort()`
   - Vòng lặp sync kiểm tra và thoát sớm
   - Cập nhật trạng thái trong database thành `stopped`
4. Frontend nhận response và refresh data

## Giao diện

### Nút Stop trong card đồng bộ đang chạy
- Vị trí: Bên trái nút "Chạy nền"
- Màu: Đỏ (destructive)
- Icon: Square (filled)

### Nút Stop trong danh sách sync logs
- Vị trí: Bên trái Badge status
- Hiển thị khi: `status === 'running'`
- Màu: Đỏ (destructive)

### SyncProgressDialog
- Nút "Dừng đồng bộ" trong footer
- Hiển thị khi đang running và có `onStop` callback

## API GraphQL

```graphql
mutation StopSyncProcess($syncLogId: String!) {
  stopSyncProcess(syncLogId: $syncLogId) {
    success
    message
    syncLogId
    recordsProcessed
  }
}
```

## Ngày cập nhật

03/12/2025
