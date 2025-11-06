# 🚀 Next.js Full-Stack - Frontend

Next.js 14 Full-Stack application với Server Actions, Prisma, Redis caching, và MinIO storage.

## 📋 Yêu Cầu Hệ Thống

- **Node.js:** >= 18.x
- **pnpm/npm:** Latest version
- **PostgreSQL:** 16+ (external)
- **Redis:** 7+ (external)
- **MinIO:** Latest (external)

## 🛠️ Cài Đặt

### 1. Clone và Setup

```bash
cd /mnt/chikiet/Innerbright/innerv2/frontend
cp .env.example .env
```

### 2. Cấu Hình Environment

Chỉnh sửa `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:13003/innerv2core?schema=public"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="12004"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT="12007"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
```

### 3. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 🧪 Testing

### Quick Test Script

```bash
./quick-start-test.sh
```

### Manual Test

Visit: http://localhost:3000/test-actions

Expected output:
- ✅ Blog posts list
- ✅ Categories list
- ✅ Settings list
- ✅ Success message

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── test-actions/       # Test page
│   │   └── ...                 # Other pages
│   ├── actions/                # Server Actions (Business Logic)
│   │   ├── auth.actions.ts     # Authentication
│   │   ├── user.actions.ts     # User management
│   │   ├── blog.actions.ts     # Blog CRUD
│   │   ├── page.actions.ts     # PageBuilder CRUD
│   │   ├── settings.actions.ts # Settings management
│   │   ├── category-tag.actions.ts # Categories & Tags
│   │   └── index.ts            # Exports
│   ├── lib/                    # Infrastructure
│   │   ├── prisma.ts           # Prisma Client
│   │   ├── redis.ts            # Redis Cache
│   │   ├── minio.ts            # MinIO Storage
│   │   └── auth.ts             # Auth helpers
│   └── components/             # React Components
├── prisma/
│   └── schema.prisma           # Database schema
├── .env                        # Environment variables
└── package.json
```

## 🎯 Server Actions Usage

### Blog Actions

```typescript
import { getBlogPosts, createBlogPost } from '@/actions'

// Get posts
const { posts, total } = await getBlogPosts({ page: 1, limit: 10 })

// Create post
const post = await createBlogPost({
  title: 'My Post',
  content: 'Content here...',
  status: 'PUBLISHED'
})
```

### Auth Actions

```typescript
import { login, register, logout } from '@/actions'

// Register
await register({
  username: 'john',
  email: 'john@example.com',
  password: 'password123'
})

// Login
await login({
  username: 'john',
  password: 'password123'
})

// Logout
await logout()
```

### Settings Actions

```typescript
import { getSettingValue, upsertSetting } from '@/actions'

// Get setting
const siteName = await getSettingValue('site_name', 'Default Site')

// Update setting
await upsertSetting({
  key: 'site_name',
  value: 'Innerbright',
  type: 'string',
  group: 'general'
})
```

## 🔧 Development

### TypeScript Check

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## 📊 Performance

### Caching Strategy

| Resource | TTL | Cache Key Pattern |
|----------|-----|-------------------|
| Blog posts list | 5 min | `posts:list:*` |
| Single post | 10 min | `post:slug:*` |
| Categories | 10 min | `categories:*` |
| Tags | 10 min | `tags:*` |
| Settings | 1 hour | `settings:*` |
| User profile | 10 min | `user:profile:*` |

### Memory Target

- **Development:** ~200MB
- **Production:** ~400MB (vs 768MB with separate backend)

## 🚀 Deployment

### Docker Build

```bash
docker build -f Dockerfile.fullstack -t innerbright-fullstack .
```

### Docker Compose

```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_HOST=redis
MINIO_ENDPOINT=minio
NEXTAUTH_SECRET=<random-secret>
```

## 📚 Documentation

- [Migration Guide](../docs/MIGRATION_TO_NEXTJS_FULLSTACK.md)
- [Phase 1 Summary](../docs/PHASE1_COMPLETION_SUMMARY.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## 🐛 Troubleshooting

### Prisma Client not found

```bash
npx prisma generate
```

### Redis connection failed

Check Redis is running:
```bash
redis-cli -h localhost -p 12004 ping
```

### Database connection failed

Check PostgreSQL:
```bash
psql -h localhost -p 13003 -U user -d innerv2core
```

### TypeScript errors

Clear cache and rebuild:
```bash
rm -rf .next
npm run build
```

## 🤝 Contributing

1. Create feature branch
2. Write Server Actions following existing patterns
3. Add tests
4. Update documentation
5. Submit PR

## 📝 License

MIT License - See LICENSE file

## 👥 Team

- **Architecture:** Next.js Full-Stack
- **Database:** Prisma + PostgreSQL
- **Cache:** Redis
- **Storage:** MinIO
- **Auth:** NextAuth.js (planned)

---

**Status:** ✅ Phase 1 Complete (90%)  
**Next:** Phase 2 - API Routes & Admin UI
