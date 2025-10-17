# Demo Pages Seeding Guide

**Date:** October 17, 2025  
**Purpose:** Seed 3 demo pages into PageBuilder database  
**Status:** ✅ Ready to use

---

## 📋 Overview

This guide explains how to seed 3 demo pages (Home, About Us, Products) into the PageBuilder database for testing and demonstration purposes.

---

## 🎯 Demo Pages

### 1. **Home Page** (`/home`)

**Content:**
- Hero section with CTA
- Features section
- Stats section (Users, Websites, Uptime, Support)
- CTA section

**Purpose:** Main landing page showcasing the platform

---

### 2. **About Us Page** (`/about-us`)

**Content:**
- Hero section
- Mission statement
- Team section (4 team members)
- Core values grid

**Purpose:** Company introduction and team showcase

---

### 3. **Products Page** (`/products`)

**Content:**
- Hero section
- Pricing grid (3 tiers: Starter, Professional, Enterprise)
- Features section
- Feature grid (6 features)
- CTA section

**Purpose:** Product/service offerings and pricing

---

## 🚀 Quick Start

### Method 1: Using Scripts Directly

```bash
# Seed demo pages
cd backend
npx ts-node scripts/seed-demo-pages.ts

# Or with Bun
bun run scripts/seed-demo-pages.ts
```

### Method 2: Using Package.json Scripts

Add to `backend/package.json`:

```json
{
  "scripts": {
    "seed:demo": "ts-node scripts/seed-demo-pages.ts",
    "cleanup:demo": "ts-node scripts/cleanup-demo-pages.ts"
  }
}
```

Then run:

```bash
npm run seed:demo
npm run cleanup:demo
```

### Method 3: Using Makefile

Add to `Makefile`:

```makefile
.PHONY: seed-demo cleanup-demo

seed-demo:
	@echo "🌱 Seeding demo pages..."
	cd backend && npx ts-node scripts/seed-demo-pages.ts

cleanup-demo:
	@echo "🧹 Cleaning up demo pages..."
	cd backend && npx ts-node scripts/cleanup-demo-pages.ts
```

Then run:

```bash
make seed-demo
make cleanup-demo
```

---

## 📁 Files Structure

```
backend/
├── scripts/
│   ├── seed-demo-pages.ts        # Seed script
│   └── cleanup-demo-pages.ts     # Cleanup script
└── prisma/
    └── schema.prisma              # Database schema
```

---

## 📊 Database Structure

### Page Table

```prisma
model Page {
  id             String     @id @default(uuid())
  title          String
  slug           String     @unique
  description    String?
  status         PageStatus @default(DRAFT)
  seoTitle       String?
  seoDescription String?
  seoKeywords    Json?
  layoutSettings Json?
  blocks         PageBlock[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  publishedAt    DateTime?
  createdBy      String
}
```

### PageBlock Table

```prisma
model PageBlock {
  id        String    @id @default(uuid())
  type      BlockType
  content   Json
  style     Json?
  order     Int       @default(0)
  depth     Int       @default(0)
  isVisible Boolean   @default(true)
  pageId    String
  page      Page      @relation(fields: [pageId], references: [id])
  parentId  String?
  children  PageBlock[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

---

## 🎨 Block Types Used

### Home Page
- `HERO` - Hero section with CTA
- `SECTION` - Content sections
- `STATS` - Statistics display

### About Us Page
- `HERO` - Header section
- `SECTION` - Mission statement
- `TEAM` - Team members grid
- `GRID` - Core values

### Products Page
- `HERO` - Product header
- `GRID` - Pricing tiers and features

---

## 📝 Example Output

```bash
🌱 Starting demo pages seed...

📄 Creating Home Page...
✅ Home Page created: 123e4567-e89b-12d3-a456-426614174000

📄 Creating About Us Page...
✅ About Us Page created: 223e4567-e89b-12d3-a456-426614174001

📄 Creating Products Page...
✅ Products Page created: 323e4567-e89b-12d3-a456-426614174002

📊 Seed Summary:
   - Home Page: /home (ID: 123e4567-e89b-12d3-a456-426614174000)
   - About Us: /about-us (ID: 223e4567-e89b-12d3-a456-426614174001)
   - Products: /products (ID: 323e4567-e89b-12d3-a456-426614174002)

✨ Demo pages seeded successfully!
✅ All done!
```

---

## 🔍 Verification

### Check Pages in Database

```sql
-- PostgreSQL
SELECT id, title, slug, status, 
       (SELECT COUNT(*) FROM "PageBlock" WHERE "pageId" = "Page".id) as block_count
FROM "Page"
WHERE slug IN ('home', 'about-us', 'products');
```

### Via Prisma Studio

```bash
cd backend
npx prisma studio
```

Then navigate to the `Page` and `PageBlock` tables.

---

## 🧪 Testing the Pages

### 1. GraphQL Query

```graphql
query GetDemoPages {
  getPages(filters: { slug: "home" }) {
    items {
      id
      title
      slug
      status
      blocks {
        id
        type
        content
        order
      }
    }
  }
}
```

### 2. API Endpoint

```bash
# Get home page
curl http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ getPages(filters: {slug: \"home\"}) { items { id title slug } } }"}'
```

### 3. Frontend Display

Navigate to:
- `http://localhost:3000/pages/home`
- `http://localhost:3000/pages/about-us`
- `http://localhost:3000/pages/products`

---

## 🔄 Reseed Pages

If you need to update the demo pages:

```bash
# 1. Cleanup old pages
npm run cleanup:demo

# 2. Seed new pages
npm run seed:demo
```

---

## 🛠️ Customization

### Modify Page Content

Edit `backend/scripts/seed-demo-pages.ts`:

```typescript
// Change hero content
{
  type: 'HERO',
  content: {
    title: 'Your Custom Title',      // ← Edit this
    subtitle: 'Your Subtitle',       // ← Edit this
    description: 'Your description', // ← Edit this
    // ...
  },
}
```

### Add More Pages

Create additional pages in the seed script:

```typescript
const contactPage = await prisma.page.create({
  data: {
    title: 'Contact Us',
    slug: 'contact',
    // ... blocks
  },
});
```

### Change SEO Settings

```typescript
seoTitle: 'Custom SEO Title',
seoDescription: 'Custom meta description',
seoKeywords: ['keyword1', 'keyword2'],
```

---

## ⚠️ Important Notes

### 1. **Unique Slugs**
Each page must have a unique slug. The script will fail if slugs already exist.

### 2. **Cleanup Before Reseed**
Always run cleanup before reseeding to avoid conflicts:
```bash
npm run cleanup:demo && npm run seed:demo
```

### 3. **Production Warning**
⚠️ **DO NOT** run these scripts in production without reviewing the data!

### 4. **Database Backup**
Always backup your database before running cleanup:
```bash
# PostgreSQL backup
pg_dump kata_db > backup.sql
```

---

## 🐛 Troubleshooting

### Error: "Unique constraint failed on slug"

**Solution:** Run cleanup first:
```bash
npm run cleanup:demo
```

### Error: "Cannot find module '@prisma/client'"

**Solution:** Generate Prisma client:
```bash
cd backend
npx prisma generate
```

### Error: "Database connection failed"

**Solution:** Check `.env` file and ensure database is running:
```bash
# Check connection
cd backend
npx prisma db pull
```

### Pages Not Showing in Frontend

**Checklist:**
1. ✅ Check page status is `PUBLISHED`
2. ✅ Verify GraphQL API is working
3. ✅ Check frontend routing configuration
4. ✅ Clear browser cache

---

## 📈 Performance

### Seed Time

| Pages | Blocks | Time |
|-------|--------|------|
| 3     | ~15    | ~2s  |

### Database Size

| Component | Size |
|-----------|------|
| Pages     | ~3KB |
| Blocks    | ~50KB |
| Total     | ~53KB |

---

## 🔐 Security

### Seed User

Pages are created with `createdBy: 'system'`. Update this if needed:

```typescript
createdBy: 'your-admin-user-id'
```

### Access Control

Ensure proper RBAC permissions are set for:
- Viewing pages
- Editing pages
- Deleting pages

---

## 📚 Additional Resources

- [PageBuilder Documentation](../PAGEBUILDER_PROGRESS_REPORT.md)
- [Prisma Schema](../backend/prisma/schema.prisma)
- [GraphQL API Docs](./GRAPHQL_API.md)

---

## ✅ Checklist

Before seeding:
- [ ] Database is running
- [ ] Prisma client is generated
- [ ] `.env` is configured correctly
- [ ] Backup is created (if production)

After seeding:
- [ ] Verify pages in database
- [ ] Test GraphQL queries
- [ ] Check frontend display
- [ ] Validate SEO metadata

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
