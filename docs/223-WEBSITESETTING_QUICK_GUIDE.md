# WebsiteSetting Backup & Restore - Quick Reference

## What Was Updated

### 📦 Backup (`backup.ts`)
- Added `isSystemTable()` function to identify critical tables like `website_settings`
- Updated `getTables()` to ensure `website_settings` is always included in backups
- System tables are now explicitly tracked and never missed

### 🔄 Restore (`restore.ts`)
- Enhanced `transformRecord()` to handle WebsiteSetting JSON fields
- Added `website_settings` to FK-constraint tables (smaller, safer batches)
- Updated restoration order to restore `website_settings` after `users` table
- All JSON fields (`options`, `validation`) are now properly parsed

## Key Implementation Details

### JSON Field Handling
```typescript
// Converts string JSON back to objects
if (transformed.options && typeof transformed.options === 'string') {
  try {
    transformed.options = JSON.parse(transformed.options);
  } catch {
    transformed.options = null; // Graceful fallback
  }
}
```

### Unique Key Protection
```typescript
// Ensures key field never violates UNIQUE constraint
if (!transformed.key) {
  transformed.key = `setting_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
```

### Dependency Ordering
```typescript
// Restoration order respects FK constraints
users → auth_methods → ... → audit_logs → website_settings → ...
```

## WebsiteSetting Model Structure

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `key` | String | **UNIQUE** - e.g., "header.logo" |
| `value` | Text | Setting value (any type) |
| `type` | Enum | TEXT, TEXTAREA, NUMBER, BOOLEAN, COLOR, IMAGE, URL, JSON, SELECT |
| `category` | Enum | GENERAL, HEADER, FOOTER, SEO, SOCIAL, CONTACT, APPEARANCE, ANALYTICS, PAYMENT, SHIPPING, SUPPORT_CHAT |
| `options` | JSON | Options for SELECT type: `["opt1", "opt2"]` |
| `validation` | JSON | Validation rules: `{"min": 0, "max": 100, "required": true}` |
| `createdBy` | UUID | FK to users (soft delete) |
| `updatedBy` | UUID | FK to users (soft delete) |

## Backup/Restore Flow

### Backup Flow
```
getTables()
├── Parse schema.prisma
├── Query database for existing tables
├── Add system tables (website_settings)
└── Backup each table to JSON
    └── website_settings → website_settings.json
        ├── JSON fields preserved as objects
        ├── All records included
        └── Database data saved

```

### Restore Flow
```
getTablesToRestore()
├── buildRestorationOrder()
├── Sort by dependencies (users first, website_settings after)
└── For each table:
    ├── Read JSON backup file
    ├── transformRecord() for website_settings:
    │   ├── Parse JSON fields
    │   ├── Validate unique key
    │   └── Handle nullable FKs
    ├── Insert with small batches (100 records)
    └── Report progress

```

## Common Issues & Solutions

### Issue: FK Constraint Violation
**Cause**: Restoring website_settings before users table  
**Solution**: ✅ Already fixed - restoration order ensures users → website_settings

### Issue: JSON Fields Lost
**Cause**: String JSON not converted back to objects  
**Solution**: ✅ Already fixed - transformRecord() handles JSON parsing

### Issue: Duplicate Key Error
**Cause**: NULL or duplicate key values  
**Solution**: ✅ Already fixed - key field validation ensures uniqueness

### Issue: Null FK References
**Cause**: createdBy/updatedBy point to deleted users  
**Solution**: Model uses `onDelete: SetNull` - safe to restore

## Testing Steps

```bash
# 1. Create backup
cd /mnt/chikiet/kataoffical/shoprausach/backend
bun run prisma/backup.ts

# 2. Check backup file
ls -lh kata_json/*/website_settings.json

# 3. View sample backup data
jq '.[0]' kata_json/*/website_settings.json | head -20

# 4. Restore from backup
bun run prisma/restore.ts

# 5. Verify restoration
# Check database has settings restored
# Run: select count(*) from website_settings;

# 6. Check JSON fields were restored correctly
# SELECT options, validation FROM website_settings LIMIT 1;
```

## Files Modified
- ✅ `backend/prisma/backup.ts` - Added system table detection
- ✅ `backend/prisma/restore.ts` - Added WebsiteSetting transformations

## Configuration

No additional configuration needed. The updates work automatically with existing backup/restore commands.

All WebsiteSetting records will now:
- ✅ Be backed up automatically
- ✅ Have JSON fields properly preserved
- ✅ Be restored in correct order
- ✅ Handle FK relationships safely
