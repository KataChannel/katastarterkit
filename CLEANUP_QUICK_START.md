# ⚡ Quick Start - InnerBright Core Cleanup

## 📋 Checklist

- [x] Simplified schema created (18 core models)
- [x] Cleanup scripts ready
- [x] Documentation complete
- [ ] **Run cleanup** ← YOU ARE HERE
- [ ] Apply database migration
- [ ] Update backend code
- [ ] Update frontend code
- [ ] Test & deploy

---

## 🚀 Run Cleanup (3 Steps)

### Step 1: Review (RECOMMENDED)

```bash
# See what will be removed
cat CLEANUP_SUMMARY.md

# See full migration guide
cat docs/SCHEMA_SIMPLIFICATION_GUIDE.md
```

### Step 2: Execute Cleanup

```bash
# Run master cleanup script
./cleanup-all.sh
```

This will:
- ✅ Replace schema (107 → 18 models)
- ✅ Remove unused backend modules
- ✅ Remove unused frontend features
- ✅ Create backups of everything
- ✅ Generate new Prisma Client

### Step 3: Apply Database Migration

```bash
# IMPORTANT: Backup first!
cd backend
bun db:backup

# Create migration (dry run)
bun prisma migrate dev --name simplify_to_core --create-only

# Review SQL
cat prisma/migrations/*_simplify_to_core/migration.sql

# Apply migration (⚠️ DELETES DATA!)
bun prisma migrate dev
```

---

## ✅ What Gets Kept

**18 Core Models:**
- User, Auth, Sessions (5 models)
- Roles & Permissions (5 models)
- Menu Management (2 models)
- Page Builder (2 models)
- Blog/Posts (4 models)
- Settings (1 model)

---

## ❌ What Gets Removed

**89 Models:**
- E-commerce (Products, Orders, Payments)
- LMS (Courses, Lessons, Quizzes)
- Project Management
- Task Management
- Affiliate System
- Advanced Features (AI, Analytics, etc.)

---

## 📦 Backups Created

All removed code will be backed up to:

```
backend_modules_backup_YYYYMMDD_HHMMSS/
frontend_backup_YYYYMMDD_HHMMSS/
backend/prisma/schema.prisma.backup
```

---

## 🔄 Rollback

If needed, restore original schema:

```bash
cd backend/prisma
cp schema.prisma.backup schema.prisma
bun prisma generate
```

---

## 📖 Full Documentation

- **Quick Summary**: `CLEANUP_SUMMARY.md` (this file)
- **Complete Guide**: `docs/SCHEMA_SIMPLIFICATION_GUIDE.md`
- **Original Schema**: `backend/prisma/schema.prisma.backup`

---

## 🆘 Help

**Question**: What if I need a removed feature later?

**Answer**: All code is backed up! Just restore from backup directories.

**Question**: Will this break my current app?

**Answer**: Yes, if you run the migration. Always backup first and test in development!

**Question**: Can I customize what gets removed?

**Answer**: Yes! Edit `cleanup-backend.sh` and `cleanup-frontend.sh` before running.

---

## ✨ Ready?

```bash
./cleanup-all.sh
```

Let's simplify! 🚀
