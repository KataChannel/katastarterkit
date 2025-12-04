# Tính năng Đồng bộ Ghi âm Call Center lên Google Drive

## Tổng quan

Cập nhật tính năng đồng bộ Call Center để tự động tải file ghi âm từ PBX server (pbx01.onepos.vn) và lưu trữ backup lên Google Drive công ty.

## Thay đổi chính

### 1. Database Schema
- Thêm 2 trường mới vào `CallCenterRecord`:
  - `googleDriveUrl`: URL xem file trên Google Drive
  - `googleDriveFileId`: ID file trên Google Drive

### 2. Backend Service
- **CallCenterService**: 
  - Tích hợp `GoogleDriveService` 
  - Tự động upload recording lên folder Google Drive: `1sqxPHnJmHCwyVD9vghPe-i8nbKonmjHT`
  - Chỉ upload file mới, giữ nguyên URL cũ cho record đã có

- **GoogleDriveService**: 
  - Thêm method `uploadFileToFolder()` để upload vào folder cụ thể
  - Sử dụng service account `lms-576@app-tazagroup.iam.gserviceaccount.com`

### 3. Frontend
- **AudioPlayer Component**: 
  - Hỗ trợ 2 nguồn phát: PBX Server và Google Drive
  - Chuyển đổi nguồn bằng badge selector
  - Ưu tiên nguồn Google Drive nếu có

- **GraphQL Query**: 
  - Thêm trường `googleDriveUrl` và `googleDriveFileId`

## Cấu trúc file đã thay đổi

```
backend/
├── prisma/schema.prisma              # Thêm googleDriveUrl, googleDriveFileId
├── src/
│   ├── callcenter/callcenter.module.ts   # Import GoogleDriveService
│   ├── services/
│   │   ├── callcenter.service.ts     # Logic upload recording
│   │   └── google-drive.service.ts   # Method uploadFileToFolder
│   └── graphql/
│       └── models/callcenter.model.ts # Fields GraphQL

frontend/
└── src/app/admin/callcenter/
    ├── types.ts                      # Type CallCenterRecord, AudioPlayerProps  
    ├── constants.ts                  # Query GET_CALLCENTER_RECORDS
    └── components/
        ├── AudioPlayer.tsx           # Dual source player
        └── RecordsTab.tsx            # Truyền googleDriveUrl
```

## Cách sử dụng

1. **Chạy migration** để cập nhật schema:
   ```bash
   bun run db:migrate
   ```

2. **Đồng bộ dữ liệu** Call Center như bình thường:
   - Các record mới có file ghi âm sẽ tự động được upload lên Google Drive
   - Record cũ giữ nguyên, không upload lại

3. **Nghe lại ghi âm**:
   - Click badge **"PBX"** để nghe từ server gốc
   - Click badge **"Drive"** để nghe từ Google Drive (nếu có)

## Lưu ý

- Yêu cầu `GOOGLE_DRIVE_CREDENTIALS_JSON` đã được cấu hình trong .env
- Folder Google Drive cần được chia sẻ với service account
- Quá trình upload có thể làm chậm sync nếu có nhiều recording
