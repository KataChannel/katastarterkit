# Call Center Troubleshooting Guide

## Quick Diagnostic Commands

### Check Configuration Status
```bash
cd backend
bun run test-callcenter-setup.ts
```

### View All Configurations
```bash
bun run check-all-callcenter-configs.ts
```

### Activate All Configurations
```bash
bun run activate-callcenter-config.ts
```

### Clean Up Duplicates (Keep Most Recent Active)
```bash
bun run cleanup-callcenter-configs.ts
```

## Common Issues & Solutions

### Issue 1: "Config is not active" Error

**Symptoms:**
```
GraphQL Error: Cấu hình Call Center chưa được kích hoạt
```

**Quick Fix:**
```bash
bun run activate-callcenter-config.ts
```

**Root Causes:**
- Configuration was manually deactivated in admin UI
- Multiple configs exist and wrong one is selected
- New config created with `isActive: false`

**Prevention:**
- UI now shows confirmation before deactivating
- Backend prioritizes active configs
- New configs default to `isActive: true`

### Issue 2: Multiple Configurations

**Symptoms:**
- Inconsistent sync behavior
- Config settings don't persist
- Random "Config is not active" errors

**Quick Fix:**
```bash
bun run cleanup-callcenter-configs.ts
```

**How It Works:**
- Keeps most recently updated active config
- Deletes all duplicates
- Safe operation (preserves data)

### Issue 3: Sync Not Working

**Checklist:**
1. ✅ Check config is active:
   ```bash
   bun run test-callcenter-setup.ts
   ```

2. ✅ Verify API credentials:
   - Check `apiUrl`: https://pbx01.onepos.vn:8080/api/v2/cdrs
   - Check `domain`: tazaspa102019
   - Test API connectivity

3. ✅ Check recent logs:
   ```sql
   SELECT * FROM call_center_sync_log 
   ORDER BY started_at DESC 
   LIMIT 5;
   ```

4. ✅ Verify no duplicate configs:
   ```bash
   bun run check-all-callcenter-configs.ts
   ```

## Configuration Best Practices

### Creating New Config
```typescript
{
  apiUrl: 'https://pbx01.onepos.vn:8080/api/v2/cdrs',
  domain: 'tazaspa102019',
  syncMode: 'MANUAL',
  isActive: true,  // Always start active
  defaultDaysBack: 30,
  batchSize: 200
}
```

### Updating Config
- Always verify changes in UI before saving
- Confirm before deactivating
- Test sync after changes

### Deleting Config
⚠️ **WARNING**: Never delete the only config!
- Check for duplicates first
- Keep at least one active config
- Use cleanup script instead of manual deletion

## Database Schema

### call_center_config Table
```sql
id                  UUID PRIMARY KEY
api_url             VARCHAR NOT NULL
domain              VARCHAR NOT NULL
api_key             VARCHAR (optional)
sync_mode           ENUM (MANUAL, SCHEDULED)
cron_expression     VARCHAR (optional)
is_active           BOOLEAN DEFAULT true
default_days_back   INTEGER DEFAULT 30
batch_size          INTEGER DEFAULT 200
last_sync_at        TIMESTAMP
last_sync_status    VARCHAR
last_sync_error     TEXT
total_records_synced INTEGER DEFAULT 0
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### Important: `is_active` Field
- Controls whether sync operations are allowed
- Checked before every sync
- Should be `true` for normal operation
- UI enforces confirmation before disabling

## Monitoring

### Check Sync Health
```bash
# View recent sync logs
bun run -e "
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const logs = await p.callCenterSyncLog.findMany({
  take: 5,
  orderBy: { startedAt: 'desc' }
});
console.log(logs);
await p.\$disconnect();
"
```

### Check Record Count
```bash
# Count synced records
bun run -e "
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const count = await p.callCenterRecord.count();
console.log('Total records:', count);
await p.\$disconnect();
"
```

## Emergency Procedures

### If Sync Completely Broken

1. **Backup current config:**
   ```bash
   bun run -e "
   import { PrismaClient } from '@prisma/client';
   const p = new PrismaClient();
   const cfg = await p.callCenterConfig.findFirst();
   console.log(JSON.stringify(cfg, null, 2));
   await p.\$disconnect();
   " > callcenter-config-backup.json
   ```

2. **Delete all configs:**
   ```bash
   bun run -e "
   import { PrismaClient } from '@prisma/client';
   const p = new PrismaClient();
   await p.callCenterConfig.deleteMany({});
   console.log('All configs deleted');
   await p.\$disconnect();
   "
   ```

3. **Restart backend** (will auto-create new config with defaults)

4. **Configure via UI** at `/admin/callcenter`

### If Database Corrupted
```bash
# Last resort: Drop and recreate tables
bun run prisma migrate reset
bun run prisma migrate dev
```

## Contact & Support

**Developer**: Check `FIX_CALLCENTER_SYNC_BUG.md` for detailed fix history

**Related Files:**
- Backend Service: `backend/src/services/callcenter.service.ts`
- Frontend Page: `frontend/src/app/admin/callcenter/page.tsx`
- GraphQL Resolver: `backend/src/graphql/resolvers/callcenter.resolver.ts`
- Prisma Schema: `backend/prisma/schema.prisma` (search: `CallCenterConfig`)

**Utility Scripts Location:**
- `backend/test-callcenter-setup.ts`
- `backend/check-all-callcenter-configs.ts`
- `backend/activate-callcenter-config.ts`
- `backend/cleanup-callcenter-configs.ts`
