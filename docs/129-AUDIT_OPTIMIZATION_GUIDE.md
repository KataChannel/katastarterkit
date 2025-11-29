# 📊 Hướng Dẫn Tối Ưu Hóa Audit Logs

## 📈 Phân Tích Hiện Tại

**Vấn đề:**
- 277,827 logs trong 30 ngày
- ~505 MB dung lượng
- 99.97% logs có performance data không cần thiết
- 193,290 logs từ health check endpoint (`POST_/`)
- 84,424 logs từ GraphQL queries

**Tốc độ tăng trưởng:**
- ~9,260 logs/ngày
- ~16.8 MB/ngày
- ~6.1 GB/năm (nếu không tối ưu)

---

## 🎯 9 Chiến Lược Tối Ưu Hóa

### 1️⃣ **Skip Logging cho Health Checks**
**Giảm:** ~70% logs
```typescript
// Không log các endpoint:
- /health, /ping, /metrics
- /favicon.ico, /_next/
- GET /
```

### 2️⃣ **Conditional Performance Data**
**Giảm:** ~40% dung lượng
```typescript
// Chỉ lưu performance data cho:
- warn, error, critical logs
- Không lưu cho info, debug
```

### 3️⃣ **Log Sampling**
**Giảm:** ~90% logs cho high-frequency endpoints
```typescript
// Sample rate:
- debug: 1% (0.01)
- info: 10% (0.1)
- warn: 50% (0.5)
- error/critical: 100% (1.0)
```

### 4️⃣ **Data Compression**
**Giảm:** ~30% dung lượng
```typescript
// Remove:
- null/undefined values
- Empty strings
- Duplicate data
- Truncate user agents
- Normalize endpoints (remove IDs)
```

### 5️⃣ **Log Aggregation**
**Giảm:** ~50% logs giống nhau
```typescript
// Nhóm logs lặp đi lặp lại
// Ví dụ: 100 GraphQL queries giống nhau -> 1 aggregated log
```

### 6️⃣ **Retention Policy**
**Tự động xóa logs cũ:**
```typescript
- Debug: 7 ngày
- Info: 30 ngày
- Warn: 90 ngày
- Error/Critical: 180 ngày
- Sensitive/Review: Permanent
```

### 7️⃣ **Archive Old Logs**
**Di chuyển sang cold storage:**
```typescript
// Sau 90 ngày -> Archive to:
- S3/MinIO
- Compressed files
- External logging service
```

### 8️⃣ **Cleanup Duplicates**
**Xóa logs trùng lặp:**
```typescript
// Tìm và xóa logs duplicate
// (cùng action, resourceId, timestamp trong 1 giây)
```

### 9️⃣ **Database Partitioning**
**Tăng tốc query:**
```typescript
// Partition by month
- audit_logs_2024_11
- audit_logs_2024_12
- ...
```

---

## 🚀 Cách Triển Khai

### Bước 1: Cài đặt Services

```bash
cd /mnt/chikiet/kataoffical/shoprausach/backend

# 1. Add to app.module.ts
```

**File: `src/app.module.ts`**
```typescript
import { AuditOptimizationService } from './services/audit-optimization.service';
import { SmartAuditService } from './services/smart-audit.service';

@Module({
  imports: [
    // ... existing imports
    ScheduleModule.forRoot(), // Enable cron jobs
  ],
  providers: [
    // ... existing providers
    AuditOptimizationService,
    SmartAuditService,
  ],
})
export class AppModule {}
```

### Bước 2: Thay thế EnhancedAuditService

**Tìm và thay thế trong code:**
```typescript
// OLD
constructor(private auditService: EnhancedAuditService) {}

// NEW
constructor(private auditService: SmartAuditService) {}
```

### Bước 3: Update Schema (Optional - Partitioning)

**File: `prisma/schema.prisma`**
```prisma
model AuditLog {
  // ... existing fields

  // Add retention field
  retentionPeriod Int? @default(30) // Days to retain

  // Indexes for performance
  @@index([timestamp, severity])
  @@index([action, endpoint, timestamp])
  
  @@map("audit_logs")
}
```

### Bước 4: Chạy Migration

```bash
# Optional: Backup first
bun run db:backup

# Run migration
bunx prisma migrate dev --name add_audit_retention
```

### Bước 5: Manual Cleanup (One-time)

```bash
# Create cleanup script
cat > cleanup-audit-logs.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('Starting manual cleanup...\n');

  // 1. Delete health check logs
  const healthChecks = await prisma.auditLog.deleteMany({
    where: {
      OR: [
        { endpoint: '/' },
        { endpoint: { startsWith: '/health' } },
        { endpoint: { startsWith: '/ping' } },
        { endpoint: { startsWith: '/_next' } },
      ]
    }
  });
  console.log(`✅ Deleted ${healthChecks.count} health check logs`);

  // 2. Delete old debug logs
  const oldDebug = await prisma.auditLog.deleteMany({
    where: {
      severity: 'debug',
      timestamp: {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });
  console.log(`✅ Deleted ${oldDebug.count} old debug logs`);

  // 3. Delete old info logs
  const oldInfo = await prisma.auditLog.deleteMany({
    where: {
      severity: 'info',
      timestamp: {
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      requiresReview: false,
      sensitiveData: false
    }
  });
  console.log(`✅ Deleted ${oldInfo.count} old info logs`);

  // 4. Stats
  const remaining = await prisma.auditLog.count();
  console.log(`\n📊 Remaining logs: ${remaining.toLocaleString()}`);

  await prisma.$disconnect();
}

cleanup().catch(console.error);
EOF

# Run cleanup
bun cleanup-audit-logs.ts
```

---

## 📊 Dự Kiến Kết Quả

### Trước tối ưu:
- Logs: 277,827
- Dung lượng: ~505 MB
- Tăng trưởng: ~16.8 MB/ngày

### Sau tối ưu:
- Logs: ~20,000 (giảm 93%)
- Dung lượng: ~35 MB (giảm 93%)
- Tăng trưởng: ~1.2 MB/ngày (giảm 93%)

### Lợi ích:
✅ Giảm 93% dung lượng database
✅ Query nhanh hơn 10-20x
✅ Giảm chi phí lưu trữ
✅ Vẫn giữ đủ logs quan trọng
✅ Tự động cleanup hàng ngày

---

## 🔧 Cấu Hình Nâng Cao

### Tuning Sample Rates

```typescript
// File: smart-audit.service.ts
private getSampleRate(severity?: string): number {
  // Điều chỉnh theo nhu cầu:
  
  // Nếu cần debug nhiều:
  case 'debug': return 0.05; // 5%
  
  // Nếu cần tiết kiệm hơn:
  case 'info': return 0.05;  // 5%
  
  // Production recommended:
  case 'info': return 0.1;   // 10%
}
```

### Tuning Retention Periods

```typescript
// File: audit-optimization.service.ts
const policies = [
  { severity: 'info', retentionDays: 30 },      // Giảm xuống 7 nếu cần
  { severity: 'debug', retentionDays: 7 },       // Giữ nguyên
  { severity: 'warn', retentionDays: 90 },       // Tăng lên 180 nếu cần
  { severity: ['error', 'critical'], retentionDays: 180 },
];
```

### Archive Storage Options

**Option 1: MinIO/S3**
```typescript
async archiveToS3(logs: any[]) {
  const s3 = new S3Client({});
  const key = `audit-logs/${new Date().toISOString()}.json.gz`;
  
  const compressed = gzip(JSON.stringify(logs));
  
  await s3.send(new PutObjectCommand({
    Bucket: 'audit-archives',
    Key: key,
    Body: compressed,
  }));
}
```

**Option 2: File System**
```typescript
async archiveToFile(logs: any[]) {
  const fs = require('fs');
  const zlib = require('zlib');
  
  const filename = `./archives/audit-${Date.now()}.json.gz`;
  const data = JSON.stringify(logs);
  const compressed = zlib.gzipSync(data);
  
  fs.writeFileSync(filename, compressed);
}
```

**Option 3: External Service**
```typescript
// Elasticsearch, Datadog, etc.
async archiveToElastic(logs: any[]) {
  const client = new Client({ node: 'http://localhost:9200' });
  
  await client.bulk({
    body: logs.flatMap(log => [
      { index: { _index: 'audit-logs' } },
      log
    ])
  });
}
```

---

## 📅 Cron Schedule

**Automatic cleanup runs:**
```typescript
// Every day at 2 AM
@Cron('0 2 * * *')
async scheduledCleanup() {
  // 1. Cleanup duplicates
  // 2. Aggregate similar logs
  // 3. Apply retention policy
  // 4. Archive old logs (weekly)
}
```

**Tùy chỉnh:**
```typescript
// Every hour
@Cron('0 * * * *')

// Every 6 hours
@Cron('0 */6 * * *')

// Weekly on Sunday at 3 AM
@Cron('0 3 * * 0')
```

---

## 🔍 Monitoring

### Check storage size:

```typescript
import { AuditOptimizationService } from './services/audit-optimization.service';

// In controller or script
const stats = await optimizationService.getStorageStats();
console.log(stats);
// Output:
// {
//   total_size: '505 MB',
//   table_size: '420 MB',
//   indexes_size: '85 MB',
//   total_rows: 277827,
//   last_7_days: 101641,
//   last_30_days: 272376
// }
```

### Create monitoring endpoint:

```typescript
@Get('/api/admin/audit-stats')
@UseGuards(AdminGuard)
async getAuditStats() {
  return await this.optimizationService.getStorageStats();
}
```

---

## ⚠️ Important Notes

1. **Backup trước khi cleanup:**
   ```bash
   bun run db:backup
   ```

2. **Test trên staging trước:**
   - Deploy lên staging
   - Chạy 1 tuần
   - Monitor logs và performance
   - Sau đó mới deploy production

3. **Giữ logs quan trọng:**
   - `requiresReview: true` → không bao giờ xóa
   - `sensitiveData: true` → retention period dài hơn
   - error/critical → giữ lâu nhất

4. **Performance impact:**
   - Aggregation và cleanup chạy off-peak hours (2-4 AM)
   - Batch size: 1000 để tránh lock table
   - Cron job có thể skip nếu đang có high load

---

## 🎓 Best Practices

### ✅ DO:
- Log tất cả errors và security events
- Sử dụng sampling cho high-frequency endpoints
- Archive logs cũ thay vì xóa ngay
- Monitor storage size thường xuyên
- Review retention policies định kỳ

### ❌ DON'T:
- Log mọi request (quá lãng phí)
- Lưu full request/response body cho mọi log
- Giữ debug logs lâu dài
- Quên backup trước khi cleanup
- Deploy trực tiếp lên production

---

## 🆘 Troubleshooting

### Issue: Cleanup quá chậm
**Solution:**
```typescript
// Tăng batch size
const batchSize = 5000; // từ 1000

// Hoặc chạy parallel
await Promise.all([
  this.cleanupDuplicates(),
  this.applyRetentionPolicy(),
]);
```

### Issue: Mất logs quan trọng
**Solution:**
```typescript
// Restore từ backup
bun run db:restore

// Hoặc từ archive
await this.restoreFromArchive(date);
```

### Issue: Query vẫn chậm
**Solution:**
```sql
-- Check indexes
SELECT * FROM pg_indexes WHERE tablename = 'audit_logs';

-- Add missing indexes
CREATE INDEX idx_audit_timestamp_severity 
ON audit_logs(timestamp DESC, severity);

-- Analyze table
ANALYZE audit_logs;
```

---

## 📞 Support

Nếu cần hỗ trợ hoặc có câu hỏi:
1. Check logs: `tail -f backend/logs/app.log`
2. Check cron jobs: `ps aux | grep cron`
3. Manual cleanup: `bun cleanup-audit-logs.ts`
4. Contact: #tech-support

---

**Last updated:** 2024-11-29
**Version:** 1.0.0
