# 🌱 Database Seeding Guide

## Overview

This project includes two seeding methods:

1. **Basic Seed** - Creates minimal data (admin, test users, sample content)
2. **Comprehensive Seed** - Creates data for ALL 42 models with demo content

## Quick Start

### Using Makefile (Recommended)

```bash
# From project root
make db-seed                    # Basic seed
make db-seed-comprehensive      # Full demo data
make db-studio                  # View data in Prisma Studio
```

### Using Bun Scripts

```bash
cd backend

# Basic seed
bun run prisma:seed
# or
bun run db:seed
# or
bun prisma db seed

# Comprehensive seed
bun run seed:comprehensive
```

## Seed Methods Comparison

### Basic Seed (`prisma/seed.ts`)

**Creates:**
- 👤 2 Users (admin + test user)
- 🏷️ 4 Tags (Next.js, NestJS, GraphQL, Prisma)
- 📝 3 Sample Posts

**Credentials:**
- **Admin**: `admin@rausachcore.dev` / `admin123`
- **Test User**: `user@rausachcore.dev` / `user123`

**Use When:**
- ✅ Starting fresh development
- ✅ Testing authentication
- ✅ Minimal data needed

### Comprehensive Seed (`src/scripts/run-comprehensive-seeder.ts`)

**Creates data for ALL 42 models:**

1. 👤 **Admin User** - `katachanneloffical@gmail.com` / `Admin@2024`
2. 🔐 **RBAC** - 4 roles, 9 permissions, assignments
3. 📝 **Content** - 10 posts, 4 tags, 15 comments, 7 likes
4. ✅ **Tasks** - 20 tasks with various statuses
5. 📋 **Menus** - Sidebar and header menus
6. 📄 **Pages** - Pages with hero and feature blocks
7. 🤖 **AI/Chatbot** - Model and training data
8. 💰 **Affiliate** - Campaign, links, tracking
9. 🔒 **Security** - MFA settings
10. 🔔 **Notifications** - Welcome notifications

**Use When:**
- ✅ Testing complete system
- ✅ Demonstrating to stakeholders
- ✅ Development of complex features
- ✅ Testing relationships between models

## Commands Reference

| Command | Description | Location |
|---------|-------------|----------|
| `make db-seed` | Basic seed | Root |
| `make db-seed-comprehensive` | Full seed | Root |
| `make db-migrate` | Run migrations | Root |
| `make db-reset` | Reset database | Root |
| `make db-studio` | Open Prisma Studio | Root |
| `bun run prisma:seed` | Basic seed | Backend |
| `bun run seed:comprehensive` | Full seed | Backend |
| `bun prisma db seed` | Prisma CLI seed | Backend |

## Troubleshooting

### Error: "No seed command found"

**Solution:** Package.json missing Prisma config

```json
{
  "prisma": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

This is now fixed! ✅

### Error: "Table does not exist"

**Solution:** Run migrations first

```bash
make db-migrate
# or
cd backend && bun prisma migrate dev
```

### Error: "Unique constraint failed"

**Solution:** Data already exists. This is normal for `create()` operations.

**Options:**
1. Reset database: `make db-reset`
2. Ignore (if using upsert, it's safe)
3. Manual cleanup via Prisma Studio

### Error: "ts-node command not found"

**Solution:** Update to use Bun (already fixed)

**Before:**
```json
"prisma:seed": "ts-node prisma/seed.ts"
```

**After:**
```json
"prisma:seed": "bun run prisma/seed.ts"
```

## Docker Auto-Seed

The backend `entrypoint.sh` automatically seeds in development mode:

```bash
if [ "$NODE_ENV" = "development" ]; then
  echo "🌱 Seeding database..."
  bun prisma db seed
fi
```

**To disable:** Set `NODE_ENV=production` or remove from entrypoint.sh

## Testing Seeds

### Run Test Script

```bash
cd backend
chmod +x test-seed.sh
./test-seed.sh
```

**Expected Output:**
```
🧪 Testing Database Seed...

📋 Step 1: Generate Prisma Client
✅ Prisma client generated

📋 Step 2: Run Database Seed
🌱 Starting seed...
✅ Seed completed successfully!

🎉 All tests passed!
```

### Verify in Prisma Studio

```bash
make db-studio
```

Then navigate to: http://localhost:5555

## Best Practices

### Development
- ✅ Use basic seed for daily work
- ✅ Use comprehensive seed when testing integrations
- ✅ Commit seed files to version control
- ✅ Document any new seed data

### Production
- ❌ **NEVER** auto-seed in production
- ❌ **NEVER** use `db:reset` in production
- ✅ Use migrations for schema changes
- ✅ Use scripts for production data
- ✅ Always backup before operations

### Testing
- ✅ Reset database before tests
- ✅ Use transactions for test isolation
- ✅ Clean up test data after runs

## Advanced Usage

### Custom Seed Script

Create custom seed in `prisma/seeds/`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function customSeed() {
  // Your custom seed logic
}

customSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run with:
```bash
bun run prisma/seeds/your-seed.ts
```

### Conditional Seeding

Add environment checks:

```typescript
if (process.env.SEED_COMPREHENSIVE === 'true') {
  await seedComprehensive();
} else {
  await seedBasic();
}
```

## Files Structure

```
backend/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Basic seed
│   └── seeds/                  # Custom seeds (optional)
├── src/
│   ├── scripts/
│   │   ├── comprehensive-seeder.service.ts  # Comprehensive seeder
│   │   └── run-comprehensive-seeder.ts      # Runner script
│   └── seed/
│       ├── seed.service.ts     # Auto-seed service
│       └── seed.module.ts      # Seed module
├── package.json                # Includes prisma.seed config
└── test-seed.sh                # Test script
```

## Related Documentation

- [Comprehensive Seeder Complete](/docs/COMPREHENSIVE-SEEDER-COMPLETE.md)
- [Auto Seed Implementation](/docs/196-AUTO_SEED_IMPLEMENTATION.md)
- [Database Seed Bug Fix](/DATABASE_SEED_BUG_FIX.md)
- [Prisma Documentation](https://www.prisma.io/docs/guides/database/seed-database)

## Support

If you encounter issues:

1. Check this README
2. Review error messages
3. Check database connection
4. Verify migrations are applied
5. Check Prisma schema matches models

---

**Last Updated:** October 15, 2025  
**Status:** ✅ All seeding methods working with Bun.js
