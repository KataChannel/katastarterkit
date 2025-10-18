# 🎨 Demo Pages - Quick Reference

3 demo pages đã được tạo trong database PageBuilder:

## 📄 Pages Created

### 1. **Trang Chủ** (`/home`)
- **ID:** `bcab937d-555c-4d8a-a341-bce217d8d823`
- **Blocks:** 4 blocks
  - Hero section với CTA
  - Features section
  - Stats (10K users, 50K websites, 99.9% uptime)
  - CTA section

### 2. **About Us** (`/about-us`)
- **ID:** `c1f72b94-cc9c-48ee-9276-d080cc986e36`
- **Blocks:** 4 blocks
  - Hero section
  - Mission statement
  - Team section (4 members)
  - Core values grid

### 3. **Products** (`/products`)
- **ID:** `563be3d1-de55-48b2-9d00-47556e01d62e`
- **Blocks:** 5 blocks
  - Hero section
  - Pricing grid (3 tiers)
  - Features section
  - Feature grid (6 features)
  - CTA section

---

## ⚡ Quick Commands

```bash
# Seed demo pages
npm run seed:demo
# or
./manage-demo-pages.sh seed

# Cleanup demo pages
npm run cleanup:demo
# or
./manage-demo-pages.sh cleanup

# Reseed (cleanup + seed)
npm run reseed:demo
# or
./manage-demo-pages.sh reseed
```

---

## 🔍 View Pages

### GraphQL Playground
```graphql
query GetDemoPages {
  getPages {
    items {
      id
      title
      slug
      status
      blocks {
        id
        type
        order
      }
    }
  }
}
```

### Prisma Studio
```bash
cd backend
npm run db:studio
```

### Frontend (if configured)
- http://localhost:3000/pages/home
- http://localhost:3000/pages/about-us
- http://localhost:3000/pages/products

---

## 📊 Database Stats

| Page | Blocks | Status | SEO |
|------|--------|--------|-----|
| Home | 4 | PUBLISHED | ✅ |
| About Us | 4 | PUBLISHED | ✅ |
| Products | 5 | PUBLISHED | ✅ |

**Total:** 3 pages, 13 blocks

---

## 📚 Full Documentation

See [DEMO_PAGES_SEED_GUIDE.md](./docs/DEMO_PAGES_SEED_GUIDE.md) for complete guide.

---

**Created:** October 17, 2025  
**Status:** ✅ Ready to use
