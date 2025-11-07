# 🚀 InnerV2 - Next.js Fullstack Starter Kit

![InnerV2](https://img.shields.io/badge/InnerV2-Fullstack%20Next.js-blue)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.1.12-38B2AC)](https://tailwindcss.com/)

A modern, production-ready Next.js fullstack starter kit. Built entirely with Next.js 15 using Server Actions, API Routes, and Server Components - no separate backend needed!

## ✨ Features

### 🎯 **Fullstack Next.js 15**
- ⚡ **Next.js 15** with App Router & Server Actions
- ⚛️ **React 19** with latest features  
- 🎨 **TailwindCSS v4** with latest improvements
- 📱 **Responsive Design** with mobile-first approach
- 🔒 **Custom Authentication** with session management
- 🗄️ **Prisma ORM** with PostgreSQL
- ⚡ **Redis** for caching and sessions
- 📦 **MinIO** for object storage
- 🧪 **Testing** setup ready

### 🛠️ **Developer Experience**
- 🏃‍♂️ **Bun.js** for ultra-fast package management
- 🐳 **Docker** for infrastructure (PostgreSQL, Redis, MinIO)
- 💻 **TypeScript** throughout
- 📝 **ESLint** and **Prettier** configured
- 🔥 **Hot Module Replacement**
- 📚 **Comprehensive documentation**

## 🏗️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 15.5.0 | Fullstack React framework |
| **UI** | React | 19.1.1 | UI library |
| **Styling** | TailwindCSS | 4.1.12 | CSS framework |
| **Database** | PostgreSQL | 16+ | Primary database |
| **Cache** | Redis | 7+ | Caching and sessions |
| **Storage** | MinIO | Latest | Object storage |
| **ORM** | Prisma | 6+ | Database toolkit |
| **Runtime** | Bun.js | 1.0+ | JavaScript runtime |
| **Container** | Docker | 20+ | Infrastructure |

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/KataChannel/katastarterkit.git innerv2
cd innerv2
```

### 2. Start Infrastructure

Start PostgreSQL, Redis, and MinIO with Docker:

```bash
docker-compose up -d
```

**Services:**
- PostgreSQL: `localhost:14003`
- pgAdmin: `http://localhost:14002`
- Redis: `localhost:14004`
- MinIO: `http://localhost:14007` (Console: `http://localhost:14008`)

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
bun install

# Copy environment file
cp .env.example .env.local

# Generate Prisma Client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Seed database with sample data
bunx prisma db seed
```

### 4. Start Development Server

```bash
# Development mode with hot reload
bun dev

# Or with turbopack (faster)
bun dev:turbo
```

Frontend will be available at: **http://localhost:3000**

### 5. Default Admin Account

After seeding, you can login with:

- **Email**: `katachanneloffical@gmail.com`
- **Password**: `Kata@@2024`

See [ADMIN_SETUP.md](ADMIN_SETUP.md) for more details.

## 📁 Project Structure

```
innerv2/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── actions/         # Server Actions
│   │   ├── lib/             # Utilities & configs
│   │   └── styles/          # Global styles
│   ├── prisma/              # Database schema & migrations
│   │   ├── schema.prisma    # Prisma schema
│   │   ├── migrations/      # Database migrations
│   │   └── seed.ts          # Database seeder
│   ├── public/              # Static files
│   └── package.json
├── docker-compose.yml       # Infrastructure services
├── .env                     # Root environment
└── README.md
```

## 🔧 Development

### Available Scripts

```bash
# Frontend development
cd frontend
bun dev              # Start dev server (port 3000)
bun dev:turbo        # Start with Turbopack
bun build            # Production build
bun start            # Start production server

# Database
bunx prisma generate    # Generate Prisma Client
bunx prisma migrate dev # Run migrations
bunx prisma db seed     # Seed database
bunx prisma studio      # Open Prisma Studio

# Testing
bun test            # Run tests
bun test:watch      # Watch mode

# Linting
bun lint            # Check code
bun lint:fix        # Auto-fix issues
```

### Database Management

```bash
# Create new migration
cd frontend
bunx prisma migrate dev --name your_migration_name

# Reset database (careful!)
bunx prisma migrate reset

# Open Prisma Studio (GUI)
bunx prisma studio
```

### Infrastructure Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart postgres
```

## 🌐 API Structure

### Server Actions (Recommended)

Located in `frontend/src/actions/`:

```typescript
// Example: frontend/src/actions/posts.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  
  const post = await prisma.post.create({
    data: { title, /* ... */ }
  })
  
  revalidatePath('/posts')
  return post
}
```

### API Routes (Alternative)

Located in `frontend/src/app/api/`:

```typescript
// Example: frontend/src/app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany()
  return NextResponse.json(posts)
}
```

## 🔐 Authentication

Custom authentication system using:

- **Session-based** auth with Redis
- **HTTP-only cookies** for security
- **Server Actions** for login/register
- **Middleware** for route protection

**Key files:**
- `frontend/src/actions/auth.ts` - Auth Server Actions
- `frontend/src/contexts/AuthContext.tsx` - Auth state
- `frontend/src/middleware.ts` - Route protection

See [ADMIN_SETUP.md](ADMIN_SETUP.md) for admin setup.

## 📦 Database Schema

Key models in `frontend/prisma/schema.prisma`:

- **User** - User accounts
- **AuthMethod** - OAuth providers (Google, Facebook)
- **Post** - Blog posts
- **Product** - E-commerce products
- **Order** - Shopping orders
- **Menu** - Dynamic menus
- **Page** - CMS pages
- **Block** - Page builder blocks

Run `bunx prisma studio` to explore your data visually.

## 🎨 Styling

### TailwindCSS v4

Configuration in `frontend/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        // Custom colors
      }
    }
  }
}
```

### UI Components

Using Shadcn/ui components in `frontend/src/components/ui/`:

```bash
# Add new component
bunx shadcn-ui@latest add button
bunx shadcn-ui@latest add dialog
```

## 🚀 Deployment

### Build for Production

```bash
cd frontend
bun run build
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

**Environment Variables to set:**
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection  
- `MINIO_ENDPOINT` - MinIO endpoint
- `MINIO_ACCESS_KEY` - MinIO credentials
- `MINIO_SECRET_KEY` - MinIO credentials

### Self-Hosted with Docker

```bash
# Build production image
cd frontend
docker build -t innerv2-frontend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e REDIS_URL="..." \
  innerv2-frontend
```

## 📊 Monitoring

### Health Checks

Built-in health check endpoints:

- `/api/health` - Application health
- `/api/health/db` - Database connection
- `/api/health/redis` - Redis connection

### Logging

Using `console` methods:

```typescript
console.log('Info message')
console.error('Error message')
console.warn('Warning message')
```

For production, consider adding:
- **Pino** for structured logging
- **Sentry** for error tracking
- **Datadog** for APM

## 🧪 Testing

```bash
cd frontend

# Run all tests
bun test

# Watch mode
bun test:watch

# Coverage
bun test:coverage
```

Test structure:
```
frontend/
├── __tests__/
│   ├── components/
│   ├── actions/
│   └── lib/
```

## 📚 Documentation

- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Admin account setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [frontend/README.md](frontend/README.md) - Frontend details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- TailwindCSS for beautiful styling
- Shadcn for UI components

## 📧 Support

- **Email**: katachanneloffical@gmail.com
- **Issues**: [GitHub Issues](https://github.com/KataChannel/katastarterkit/issues)

---

**Built with ❤️ using Next.js 15**
