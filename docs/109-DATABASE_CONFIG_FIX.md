# Database PostgreSQL Configuration Fix

**Date:** November 28, 2024  
**Status:** ✅ Completed

## Summary

Updated all environment files to use the correct PostgreSQL server configuration. All domains now use the same PostgreSQL server on port **12003** with different database names.

## Changes Made

### PostgreSQL Server Configuration
- **Server:** 116.118.49.243
- **Port:** 12003 (unified for all domains)
- **Databases:** 
  - rausachcore
  - tazagroupcore
  - timonacore

## Updated Files

### RAUSACH Domain
✅ Already correct - no changes needed
- `env/.env.dev.rausach`: `116.118.49.243:12003/rausachcore`
- `env/.env.prod.rausach`: `127.0.0.1:12003/rausachcore`
- `env/.env.backup.rausach`: `116.118.49.243:12003/rausachcore`

### TAZAGROUP Domain
✅ Fixed from port 13003 → 12003
- `env/.env.dev.tazagroup`: `116.118.49.243:13003` → `116.118.49.243:12003/tazagroupcore`
- `env/.env.prod.tazagroup`: `127.0.0.1:13003` → `127.0.0.1:12003/tazagroupcore`
- `env/.env.backup.tazagroup`: `116.118.49.243:13003` → `116.118.49.243:12003/tazagroupcore`

### TIMONA Domain
✅ Fixed from port 15003 → 12003
- `env/.env.dev.timona`: `116.118.49.243:15003` → `116.118.49.243:12003/timonacore`
- `env/.env.prod.timona`: `127.0.0.1:15003` → `127.0.0.1:12003/timonacore`
- `env/.env.backup.timona`: `116.118.49.243:15003` → `116.118.49.243:12003/timonacore`

## Configuration Table

| Domain | Environment | Host | Port | Database | Full URL |
|--------|-------------|------|------|----------|----------|
| RAUSACH | Dev | 116.118.49.243 | 12003 | rausachcore | `postgresql://postgres:postgres@116.118.49.243:12003/rausachcore` |
| RAUSACH | Prod | 127.0.0.1 | 12003 | rausachcore | `postgresql://postgres:postgres@127.0.0.1:12003/rausachcore` |
| RAUSACH | Backup | 116.118.49.243 | 12003 | rausachcore | `postgresql://postgres:postgres@116.118.49.243:12003/rausachcore` |
| TAZAGROUP | Dev | 116.118.49.243 | 12003 | tazagroupcore | `postgresql://postgres:postgres@116.118.49.243:12003/tazagroupcore` |
| TAZAGROUP | Prod | 127.0.0.1 | 12003 | tazagroupcore | `postgresql://postgres:postgres@127.0.0.1:12003/tazagroupcore` |
| TAZAGROUP | Backup | 116.118.49.243 | 12003 | tazagroupcore | `postgresql://postgres:postgres@116.118.49.243:12003/tazagroupcore` |
| TIMONA | Dev | 116.118.49.243 | 12003 | timonacore | `postgresql://postgres:postgres@116.118.49.243:12003/timonacore` |
| TIMONA | Prod | 127.0.0.1 | 12003 | timonacore | `postgresql://postgres:postgres@127.0.0.1:12003/timonacore` |
| TIMONA | Backup | 116.118.49.243 | 12003 | timonacore | `postgresql://postgres:postgres@116.118.49.243:12003/timonacore` |

## Key Points

1. **Single PostgreSQL Server:** All domains now use the same PostgreSQL instance on port 12003
2. **Separate Databases:** Each domain has its own database for data isolation
3. **Development Environment:** Uses remote server IP (116.118.49.243) for development
4. **Production Environment:** Uses localhost (127.0.0.1) when deployed on production server
5. **Backup Operations:** Always connect to remote server for backup/restore operations

## Impact

- ✅ All development commands will connect to the correct database
- ✅ All production deployments will use the correct database
- ✅ All backup/restore operations will connect to the correct database
- ✅ Database isolation between domains maintained via different database names

## Testing

To verify the configuration:

```bash
# Test RAUSACH connection
bun run dev:rausach

# Test TAZAGROUP connection
bun run dev:tazagroup

# Test TIMONA connection
bun run dev:timona
```

All connections should now work correctly with the unified PostgreSQL server on port 12003.
