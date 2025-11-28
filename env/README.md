# Environment Files Directory

This directory contains all environment configuration files for the multi-domain application.

## File Structure

```
env/
├── .env.dev.rausach          # Development environment for RAUSACH domain
├── .env.dev.tazagroup        # Development environment for TAZAGROUP domain
├── .env.dev.timona           # Development environment for TIMONA domain
├── .env.prod.rausach         # Production environment for RAUSACH domain
├── .env.prod.tazagroup       # Production environment for TAZAGROUP domain
├── .env.prod.timona          # Production environment for TIMONA domain
├── .env.backup.rausach       # Backup connection config for RAUSACH (116.118.49.243:12003)
├── .env.backup.tazagroup     # Backup connection config for TAZAGROUP (116.118.49.243:13003)
└── .env.backup.timona        # Backup connection config for TIMONA (116.118.49.243:15003)
```

## Environment Types

### Development (.env.dev.*)
- Used for local development with `bun run dev:*` commands
- Frontend runs on localhost with domain-specific ports
- Backend connects to remote production database (116.118.49.243)
- Redis and MinIO services use remote production server

### Production (.env.prod.*)
- Used for production deployment with `bun run deploy:*` commands
- All services (frontend, backend, database, redis, minio) use production URLs
- Domain-specific configuration for each site

### Backup (.env.backup.*)
- Used exclusively for database backup/restore operations
- Connects to production database server at 116.118.49.243
- Used by `bun run db:backup:*` and `bun run db:restore:*` commands

## Domain Configuration

| Domain | Dev Ports | Prod Ports | Database Port | Redis Port | MinIO Ports |
|--------|-----------|------------|---------------|------------|-------------|
| RAUSACH | 12000-12001 | 12000-12001 | 12003 | 12004 | 12007-12008 |
| TAZAGROUP | 13000-13001 | 13000-13001 | 13003 | 13004 | 13007-13008 |
| TIMONA | 15000-15001 | 15000-15001 | 15003 | 15004 | 15007-15008 |

## Usage

Environment files are automatically copied by package.json scripts:

```bash
# Development
bun run dev:rausach         # Uses env/.env.dev.rausach
bun run dev:tazagroup       # Uses env/.env.dev.tazagroup
bun run dev:timona          # Uses env/.env.dev.timona

# Production deployment
bun run deploy:rausach      # Uses env/.env.prod.rausach
bun run deploy:tazagroup    # Uses env/.env.prod.tazagroup
bun run deploy:timona       # Uses env/.env.prod.timona

# Database operations
bun run db:backup:rausach   # Uses env/.env.backup.rausach
bun run db:restore:rausach  # Uses env/.env.backup.rausach
```

## Security Notes

⚠️ **IMPORTANT**: All files in this directory contain sensitive credentials and should:
- Never be committed to version control (included in .gitignore)
- Be kept secure with appropriate file permissions
- Be backed up separately from the codebase
- Have different credentials for dev/prod environments when possible

## File Synchronization

When environment files are used, they are copied to:
- `backend/.env` - Backend application reads configuration from here
- `frontend/.env.local` - Frontend application reads configuration from here

This ensures each workspace (backend/frontend) has its own isolated environment configuration.
