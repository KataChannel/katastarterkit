# KataCore - User Guide

## 🚀 Hướng Dẫn Sử Dụng Toàn Diện

Chào mừng bạn đến với **KataCore**! Đây là hướng dẫn chi tiết để giúp bạn bắt đầu sử dụng và phát triển với KataCore một cách hiệu quả.

## 📋 Mục Lục

1. [Cài Đặt và Thiết Lập](#cài-đặt-và-thiết-lập)
2. [Khởi Chạy Dự Án](#khởi-chạy-dự-án)
3. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
4. [Development Workflow](#development-workflow)
5. [Database Management](#database-management)
6. [API Development](#api-development)
7. [Frontend Development](#frontend-development)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Monitoring và Debugging](#monitoring-và-debugging)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## 🛠️ Cài Đặt và Thiết Lập

### Yêu Cầu Hệ Thống

**Bắt buộc:**
- **Bun.js** >= 1.0.0 ([Cài đặt Bun](https://bun.sh))
- **Docker** >= 20.10.0 ([Cài đặt Docker](https://docker.com))
- **Docker Compose** >= 2.0.0
- **Git** >= 2.30.0

**Tùy chọn (cho production):**
- **kubectl** >= 1.25.0 (Kubernetes deployment)
- **Ubuntu Server** 20.04+ (Cloud deployment)

### Cài Đặt Nhanh

```bash
# 1. Clone repository
git clone https://github.com/katacore/katacore.git
cd katacore

# 2. Cài đặt dependencies
make install

# 3. Khởi động infrastructure
make docker-up

# 4. Thiết lập database
make db-setup

# 5. Chạy development servers
make dev
```

### Cài Đặt Thủ Công

**Step 1: Cài đặt Bun.js**
```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

**Step 2: Clone và Setup**
```bash
# Clone repository
git clone https://github.com/katacore/katacore.git
cd katacore

# Install root dependencies
bun install

# Install backend dependencies
cd backend && bun install && cd ..

# Install frontend dependencies
cd frontend && bun install && cd ..
```

**Step 3: Environment Configuration**
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**Cấu hình backend/.env:**
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/katacore_dev"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# MinIO
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Development
NODE_ENV="development"
PORT=4000
```

**Cấu hình frontend/.env.local:**
```env
# API Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:4000/graphql"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 🚀 Khởi Chạy Dự Án

### Quick Start

```bash
# Khởi động tất cả trong một lệnh
make dev
```

Sau khi chạy lệnh này, bạn có thể truy cập:
- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql
- **Database Admin**: http://localhost:5555 (Prisma Studio)

### Khởi Động Từng Phần

**1. Khởi động Infrastructure Services:**
```bash
make docker-up
# hoặc
docker-compose up -d postgres redis minio
```

**2. Thiết lập Database:**
```bash
make db-setup
# hoặc thủ công:
cd backend
bun run prisma:generate
bun run prisma:migrate
bun run prisma:seed
```

**3. Khởi động Backend:**
```bash
make dev-backend
# hoặc
cd backend && bun run dev
```

**4. Khởi động Frontend (terminal mới):**
```bash
make dev-frontend
# hoặc
cd frontend && bun run dev
```

### Verification

Kiểm tra các services đã hoạt động:
```bash
# Kiểm tra health của tất cả services
make health

# Xem logs
make logs

# Kiểm tra Docker services
docker-compose ps
```

---

## 📁 Cấu Trúc Dự Án

### Tổng Quan Cấu Trúc

```
katacore/
├── 📁 backend/                 # NestJS GraphQL API
│   ├── 📁 src/
│   │   ├── 📄 app.module.ts    # Main application module
│   │   ├── 📄 main.ts          # Application entry point
│   │   ├── 📁 auth/            # Authentication modules
│   │   ├── 📁 users/           # User management
│   │   ├── 📁 posts/           # Post features
│   │   ├── 📁 common/          # Shared utilities
│   │   ├── 📁 config/          # Configuration
│   │   └── 📁 graphql/         # GraphQL resolvers
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma    # Database schema
│   │   └── 📄 seed.ts          # Seed data
│   └── 📄 package.json
├── 📁 frontend/                # Next.js Application
│   ├── 📁 src/
│   │   ├── 📁 app/             # App Router pages
│   │   │   ├── 📄 layout.tsx   # Root layout
│   │   │   ├── 📄 page.tsx     # Home page
│   │   │   ├── 📁 auth/        # Auth pages
│   │   │   └── 📁 dashboard/   # Dashboard pages
│   │   ├── 📁 components/      # UI Components
│   │   │   ├── 📁 ui/          # Base UI components
│   │   │   ├── 📁 forms/       # Form components
│   │   │   └── 📁 layout/      # Layout components
│   │   └── 📁 lib/             # Utilities
│   │       ├── 📄 apollo.ts    # GraphQL client
│   │       ├── 📄 auth.ts      # Auth configuration
│   │       └── 📄 utils.ts     # Helper functions
│   └── 📄 package.json
├── 📁 k8s/                     # Kubernetes manifests
├── 📁 docs/                    # Documentation
├── 📁 .github/workflows/       # CI/CD pipelines
├── 📄 docker-compose.yml       # Development environment
├── 📄 Makefile                 # Automation commands
└── 📄 README.md
```

### Chi Tiết Các Module Chính

**Backend Modules:**
- **`auth/`**: JWT authentication, login/register, password reset
- **`users/`**: User management, profiles, roles
- **`posts/`**: Content management, CRUD operations
- **`comments/`**: Comment system, nested comments
- **`uploads/`**: File upload, image processing
- **`common/`**: Shared guards, decorators, pipes
- **`config/`**: Environment validation, configuration

**Frontend Components:**
- **`ui/`**: Button, Input, Modal, Toast components
- **`forms/`**: LoginForm, RegisterForm, ProfileForm
- **`layout/`**: Header, Sidebar, Footer
- **`features/`**: Dashboard, PostList, UserProfile

---

## 🔄 Development Workflow

### Daily Development

**1. Bắt đầu làm việc:**
```bash
# Khởi động development environment
make dev

# Hoặc khởi động từng phần
make docker-up
make dev-backend
make dev-frontend  # terminal mới
```

**2. Làm việc với database:**
```bash
# Xem database
make db-studio

# Tạo migration mới
cd backend
bun run prisma:migrate:dev --name add-new-feature

# Reset database (nếu cần)
make db-reset
```

**3. Testing trong quá trình development:**
```bash
# Chạy tests
make test

# Test riêng backend
make test-backend

# Test riêng frontend  
make test-frontend

# Test coverage
make test-coverage
```

**4. Code quality checks:**
```bash
# Lint và format code
make lint-fix
make format

# Type checking
make type-check
```

### Feature Development Workflow

**1. Tạo branch mới:**
```bash
git checkout -b feature/new-awesome-feature
```

**2. Backend Development:**
```bash
# Tạo module mới
cd backend/src
nest g module features/awesome
nest g service features/awesome  
nest g resolver features/awesome

# Cập nhật database schema
# Chỉnh sửa backend/prisma/schema.prisma
cd backend
bun run prisma:migrate:dev --name add-awesome-feature
```

**3. Frontend Development:**
```bash
# Tạo components mới
cd frontend/src/components
mkdir awesome-feature

# Tạo pages mới
cd frontend/src/app
mkdir awesome-feature
```

**4. Testing:**
```bash
# Viết tests cho backend
cd backend/src/features/awesome
# Tạo awesome.service.spec.ts
# Tạo awesome.resolver.spec.ts

# Viết tests cho frontend
cd frontend/src/components/awesome-feature
# Tạo AwesomeComponent.test.tsx
```

**5. Integration:**
```bash
# Test toàn bộ
make test

# Build production
make build

# Commit changes
git add .
git commit -m "feat: add awesome feature"
git push origin feature/new-awesome-feature
```

---

## 🗄️ Database Management

### Prisma Workflow

**1. Schema Development:**
```typescript
// backend/prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("posts")
}
```

**2. Migration Commands:**
```bash
# Tạo migration mới
make db-migrate
# hoặc chi tiết hơn:
cd backend && bun run prisma:migrate:dev --name describe-changes

# Apply migrations (production)
cd backend && bun run prisma:migrate:deploy

# Reset database (development only)
make db-reset
```

**3. Seeding Data:**
```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo sample users
  const user = await prisma.user.create({
    data: {
      email: 'admin@katacore.dev',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Tạo sample posts
  await prisma.post.create({
    data: {
      title: 'Welcome to KataCore',
      content: 'This is a sample post',
      authorId: user.id,
      published: true,
    },
  });
}

main();
```

**4. Database Operations:**
```bash
# Seed database
make db-seed

# Open Prisma Studio
make db-studio

# Generate Prisma Client
make db-generate

# Backup database
make backup-db
```

### Database Best Practices

**1. Migration Naming:**
```bash
# Good examples
bun run prisma:migrate:dev --name init
bun run prisma:migrate:dev --name add-user-roles
bun run prisma:migrate:dev --name update-post-schema

# Bad examples
bun run prisma:migrate:dev --name changes
bun run prisma:migrate:dev --name fix
```

**2. Schema Design:**
```typescript
// Sử dụng proper relations
model User {
  id    String @id @default(cuid())
  posts Post[]
  
  @@map("users")  // Explicit table naming
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  @@map("posts")
}
```

---

## 🔌 API Development

### GraphQL Schema Development

**1. Tạo GraphQL Types:**
```typescript
// backend/src/graphql/types/post.type.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.type';

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field()
  published: boolean;

  @Field(() => User)
  author: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
```

**2. Tạo Input Types:**
```typescript
// backend/src/graphql/inputs/create-post.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  published: boolean;
}
```

**3. Tạo Resolvers:**
```typescript
// backend/src/graphql/resolvers/post.resolver.ts
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PostService } from '../services/post.service';
import { Post } from '../types/post.type';
import { CreatePostInput } from '../inputs/create-post.input';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Args('input') input: CreatePostInput,
    @Context() context: any,
  ): Promise<Post> {
    return this.postService.create(input, context.req.user.id);
  }
}
```

**4. Tạo Services:**
```typescript
// backend/src/services/post.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostInput } from '../graphql/inputs/create-post.input';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: CreatePostInput, authorId: string) {
    return this.prisma.post.create({
      data: {
        ...input,
        authorId,
      },
      include: { author: true },
    });
  }
}
```

### API Testing

**1. GraphQL Playground:**
```bash
# Khởi động backend
make dev-backend

# Mở browser: http://localhost:4000/graphql
```

**Example Queries:**
```graphql
# Query posts
query GetPosts {
  posts {
    id
    title
    content
    published
    author {
      id
      name
      email
    }
    createdAt
  }
}

# Create post (requires authentication)
mutation CreatePost {
  createPost(input: {
    title: "My New Post"
    content: "This is the content"
    published: true
  }) {
    id
    title
    content
    published
    author {
      name
    }
  }
}

# Login (to get token)
mutation Login {
  login(input: {
    email: "admin@katacore.dev"
    password: "admin123"
  }) {
    accessToken
    user {
      id
      name
      email
    }
  }
}
```

**2. Automated API Testing:**
```typescript
// backend/src/app.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PostResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get posts', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            posts {
              id
              title
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.posts).toBeDefined();
      });
  });
});
```

---

## 🎨 Frontend Development

### Component Development

**1. Base UI Components:**
```typescript
// frontend/src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Button };
```

**2. GraphQL Integration:**
```typescript
// frontend/src/lib/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

**3. GraphQL Queries/Mutations:**
```typescript
// frontend/src/lib/graphql/posts.ts
import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      published
      author {
        id
        name
      }
      createdAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      published
      author {
        name
      }
    }
  }
`;
```

**4. Page Components:**
```typescript
// frontend/src/app/posts/page.tsx
'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_POSTS, CREATE_POST } from '@/lib/graphql/posts';
import { Button } from '@/components/ui/Button';
import { PostForm } from '@/components/forms/PostForm';
import { PostList } from '@/components/features/PostList';

export default function PostsPage() {
  const { data, loading, error, refetch } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: () => refetch(),
  });

  const handleCreatePost = async (formData: any) => {
    try {
      await createPost({
        variables: { input: formData },
      });
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button onClick={() => setShowForm(true)}>
          Create Post
        </Button>
      </div>
      
      <PostForm onSubmit={handleCreatePost} />
      <PostList posts={data?.posts || []} />
    </div>
  );
}
```

### State Management

**1. Zustand Store:**
```typescript
// frontend/src/lib/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**2. Form Handling:**
```typescript
// frontend/src/components/forms/PostForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  published: z.boolean().default(false),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const handleFormSubmit = (data: PostFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('title')}
          placeholder="Post title"
          error={errors.title?.message}
        />
      </div>
      
      <div>
        <Textarea
          {...register('content')}
          placeholder="Post content"
          rows={4}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('published')}
          id="published"
        />
        <label htmlFor="published">Publish immediately</label>
      </div>
      
      <Button type="submit">Create Post</Button>
    </form>
  );
}
```

---

## 🧪 Testing

### Backend Testing

**1. Unit Tests:**
```typescript
// backend/src/services/post.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [{ id: '1', title: 'Test Post' }];
      jest.spyOn(prisma.post, 'findMany').mockResolvedValue(posts as any);

      const result = await service.findAll();
      expect(result).toEqual(posts);
      expect(prisma.post.findMany).toHaveBeenCalledWith({
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
```

**2. Integration Tests:**
```typescript
// backend/src/graphql/resolvers/post.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostResolver } from './post.resolver';
import { PostService } from '../services/post.service';

describe('PostResolver', () => {
  let resolver: PostResolver;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostResolver,
        {
          provide: PostService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PostResolver>(PostResolver);
    service = module.get<PostService>(PostService);
  });

  describe('posts', () => {
    it('should return posts array', async () => {
      const posts = [{ id: '1', title: 'Test' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(posts as any);

      const result = await resolver.posts();
      expect(result).toEqual(posts);
    });
  });
});
```

### Frontend Testing

**1. Component Tests:**
```typescript
// frontend/src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

**2. Page Tests:**
```typescript
// frontend/src/app/posts/page.test.tsx
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import PostsPage from './page';
import { GET_POSTS } from '@/lib/graphql/posts';

const mocks = [
  {
    request: {
      query: GET_POSTS,
    },
    result: {
      data: {
        posts: [
          {
            id: '1',
            title: 'Test Post',
            content: 'Test content',
            published: true,
            author: { id: '1', name: 'Test User' },
            createdAt: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  },
];

describe('PostsPage', () => {
  it('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <PostsPage />
      </MockedProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders posts after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <PostsPage />
      </MockedProvider>
    );
    
    expect(await screen.findByText('Test Post')).toBeInTheDocument();
  });
});
```

### Testing Commands

```bash
# Chạy tất cả tests
make test

# Test với coverage
make test-coverage

# Watch mode (development)
cd backend && bun run test:watch
cd frontend && bun run test:watch

# E2E tests
make test-e2e

# Specific test files
cd backend && bun run test post.service.spec.ts
cd frontend && bun run test Button.test.tsx
```

---

## 🚀 Deployment

### Development Deployment

```bash
# Local development
make dev

# Docker development
make docker-up
make dev
```

### Staging Deployment

```bash
# Build production images
make docker-build

# Deploy to staging Kubernetes
make deploy-staging

# Verify deployment
kubectl get pods -n katacore-staging
make k8s-status
```

### Production Deployment

**Option 1: Automated (Recommended)**
```bash
# Setup cloud server automatically
curl -fsSL https://raw.githubusercontent.com/katacore/katacore/main/k8s/scripts/setup-cloud-server.sh | bash

# Deploy application
git clone https://github.com/katacore/katacore.git
cd katacore
chmod +x k8s/scripts/deploy.sh
./k8s/scripts/deploy.sh
```

**Option 2: Manual**
```bash
# Build and push images
docker build -t your-registry/katacore-backend:v1.0.0 backend/
docker build -t your-registry/katacore-frontend:v1.0.0 frontend/
docker push your-registry/katacore-backend:v1.0.0
docker push your-registry/katacore-frontend:v1.0.0

# Update manifests
sed -i 's|katacore/backend:latest|your-registry/katacore-backend:v1.0.0|g' k8s/backend/backend.yaml
sed -i 's|katacore/frontend:latest|your-registry/katacore-frontend:v1.0.0|g' k8s/frontend/frontend.yaml

# Deploy to Kubernetes
kubectl apply -f k8s/

# Verify deployment
make verify-production
```

### CI/CD Deployment

**GitHub Actions triggers:**
- **Develop branch** → Auto-deploy to staging
- **Version tags** (v1.0.0) → Auto-deploy to production
- **Pull requests** → Run tests only

**Manual deployment:**
```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Run tests
# 2. Build Docker images
# 3. Deploy to production
# 4. Send notifications
```

---

## 📊 Monitoring và Debugging

### Monitoring Dashboard

**Access Grafana:**
```bash
# Local development
make monitor

# Production
https://grafana.yourdomain.com
# Username: admin
# Password: admin123 (thay đổi sau lần đầu đăng nhập)
```

**Available Dashboards:**
- **KataCore Overview**: Application performance, response times
- **Infrastructure**: CPU, memory, disk usage
- **Database**: PostgreSQL performance, connections
- **Redis**: Cache hit rates, memory usage
- **NGINX**: Request rates, response codes

### Application Logs

```bash
# View all logs
make logs

# Backend logs only
kubectl logs -f deployment/backend -n katacore

# Frontend logs only  
kubectl logs -f deployment/frontend -n katacore

# Database logs
kubectl logs -f deployment/postgres -n katacore

# Follow logs from multiple pods
kubectl logs -f -l app=backend -n katacore
```

### Health Checks

```bash
# Check all services health
make health

# Manual health checks
curl http://localhost:4000/health       # Backend
curl http://localhost:3000              # Frontend
curl http://localhost:9000/minio/health # MinIO

# Kubernetes health
kubectl get pods -n katacore
kubectl describe pod <pod-name> -n katacore
```

### Database Monitoring

```bash
# Prisma Studio
make db-studio

# Direct database access
kubectl exec -it deployment/postgres -n katacore -- psql -U timonacore -d timonacore_prod

# Query performance
kubectl exec -it deployment/postgres -n katacore -- psql -U timonacore -d timonacore_prod -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"
```

### Debugging

**1. Backend Debugging:**
```bash
# Development với debugger
cd backend
bun run dev:debug

# Attach debugger ở port 9229
# VS Code: Thêm configuration:
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Backend",
  "port": 9229
}
```

**2. Frontend Debugging:**
```bash
# Next.js built-in debugging
cd frontend
ANALYZE=true bun run build  # Bundle analysis

# Browser DevTools:
# - React Developer Tools
# - Apollo Client DevTools
# - Redux DevTools (nếu dùng Redux)
```

**3. Database Debugging:**
```bash
# Enable query logging
# Thêm vào .env:
DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public&logging=true"

# Prisma query logging
cd backend
DEBUG="prisma:query" bun run dev
```

---

## 🎯 Best Practices

### Code Organization

**1. Backend Structure:**
```
backend/src/
├── modules/          # Feature modules
│   ├── auth/
│   ├── users/
│   └── posts/
├── common/           # Shared code
│   ├── decorators/
│   ├── guards/
│   ├── pipes/
│   └── interfaces/
├── config/           # Configuration
└── utils/            # Utilities
```

**2. Frontend Structure:**
```
frontend/src/
├── app/              # Pages (App Router)
├── components/       # Reusable components
│   ├── ui/          # Base components
│   ├── forms/       # Form components
│   └── features/    # Feature components
├── lib/              # Utilities
│   ├── graphql/     # GraphQL queries
│   ├── store/       # State management
│   └── utils/       # Helper functions
└── styles/           # Styling
```

### Coding Standards

**1. TypeScript:**
```typescript
// Sử dụng strict types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Tránh any, sử dụng unknown
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return null;
}

// Sử dụng enum cho constants
enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

**2. Error Handling:**
```typescript
// Backend
import { HttpException, HttpStatus } from '@nestjs/common';

throw new HttpException(
  'User not found',
  HttpStatus.NOT_FOUND
);

// Frontend
try {
  const result = await createPost(data);
  toast.success('Post created successfully');
} catch (error) {
  toast.error(error.message || 'Something went wrong');
  console.error('Create post error:', error);
}
```

**3. Environment Variables:**
```typescript
// Backend validation
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ConfigDto {
  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  @IsOptional()
  PORT?: number = 4000;
}
```

### Security Best Practices

**1. Authentication:**
```typescript
// Secure JWT implementation
const payload = { 
  sub: user.id, 
  email: user.email,
  role: user.role,
  iat: Math.floor(Date.now() / 1000),
};

const token = this.jwtService.sign(payload, {
  expiresIn: '15m',
  issuer: 'katacore',
  audience: 'katacore-users',
});
```

**2. Input Validation:**
```typescript
// Sử dụng pipes cho validation
@Post()
async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}

// DTO với validation
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}
```

**3. Authorization:**
```typescript
// Role-based guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Mutation(() => User)
async deleteUser(@Args('id') id: string) {
  return this.userService.delete(id);
}
```

### Performance Optimization

**1. Database Queries:**
```typescript
// Sử dụng include thay vì N+1 queries
const posts = await this.prisma.post.findMany({
  include: {
    author: true,
    comments: {
      include: { author: true }
    }
  },
  take: 10,
  skip: page * 10,
});

// Pagination
const [posts, total] = await Promise.all([
  this.prisma.post.findMany({ skip, take }),
  this.prisma.post.count(),
]);
```

**2. Caching:**
```typescript
// Redis caching
@Cacheable('posts', 300) // 5 minutes
async findAll() {
  return this.prisma.post.findMany();
}

// Frontend caching
const { data, loading } = useQuery(GET_POSTS, {
  fetchPolicy: 'cache-first',
  nextFetchPolicy: 'cache-first',
});
```

**3. Bundle Optimization:**
```typescript
// Dynamic imports
const ChartComponent = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>
});

// Image optimization
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
/>
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Port Already in Use:**
```bash
# Tìm process sử dụng port
lsof -ti:3000
lsof -ti:4000

# Kill process
kill -9 $(lsof -ti:3000)

# Hoặc thay đổi port
PORT=3001 make dev-frontend
PORT=4001 make dev-backend
```

**2. Docker Issues:**
```bash
# Clean Docker
make docker-clean

# Reset Docker completely
docker system prune -a --volumes

# Check Docker daemon
docker info
docker version
```

**3. Database Connection:**
```bash
# Check PostgreSQL
docker-compose ps postgres
docker-compose logs postgres

# Reset database
make db-reset

# Check connection manually
docker-compose exec postgres psql -U postgres -d katacore_dev
```

**4. Bun Issues:**
```bash
# Clear Bun cache
bun pm cache rm

# Reinstall dependencies
rm -rf node_modules bun.lock
bun install

# Update Bun
bun upgrade
```

**5. Kubernetes Issues:**
```bash
# Check pod status
kubectl get pods -n katacore
kubectl describe pod <pod-name> -n katacore

# Check logs
kubectl logs <pod-name> -n katacore

# Restart deployment
kubectl rollout restart deployment/backend -n katacore

# Port forward for debugging
kubectl port-forward svc/backend 4000:4000 -n katacore
```

### Debug Mode

**1. Enable Debug Logging:**
```bash
# Backend
DEBUG=* make dev-backend

# Database queries
DEBUG="prisma:query" make dev-backend

# GraphQL
DEBUG="apollo:*" make dev-backend
```

**2. Browser DevTools:**
```javascript
// Frontend debugging
window.__APOLLO_CLIENT__ = apolloClient;
window.__NEXT_DATA__ = nextData;

// Check GraphQL cache
console.log(apolloClient.cache.extract());

// Network monitoring
console.log(performance.getEntriesByType('navigation'));
```

### Performance Issues

**1. Slow API Responses:**
```bash
# Check database performance
kubectl exec -it deployment/postgres -n katacore -- psql -U timonacore -d timonacore_prod -c "
SELECT query, mean_time, calls, total_time 
FROM pg_stat_statements 
WHERE mean_time > 100 
ORDER BY mean_time DESC;"

# Check Redis
kubectl exec -it deployment/redis-master -n katacore -- redis-cli info memory
kubectl exec -it deployment/redis-master -n katacore -- redis-cli info stats
```

**2. Memory Issues:**
```bash
# Check memory usage
kubectl top pods -n katacore
kubectl top nodes

# Node.js memory debugging
NODE_OPTIONS="--max-old-space-size=4096" make dev-backend
```

**3. Build Issues:**
```bash
# Clean builds
make clean
make build

# Check bundle size
cd frontend
ANALYZE=true bun run build

# TypeScript issues
cd backend && bun run type-check
cd frontend && bun run type-check
```

### Getting Help

**1. Check Documentation:**
- [Project README](../README.md)
- [Deployment Guide](./deployment.md)
- [API Documentation](./api.md)

**2. GitHub Issues:**
- Search existing issues: https://github.com/katacore/katacore/issues
- Create new issue with:
  - Environment details
  - Steps to reproduce
  - Error messages
  - Expected vs actual behavior

**3. Community:**
- GitHub Discussions: https://github.com/katacore/katacore/discussions
- Discord (if available)
- Stack Overflow tag: `katacore`

---

## 🎉 Kết Luận

KataCore cung cấp một nền tảng hoàn chỉnh để phát triển các ứng dụng web hiện đại với:

- **Development Experience**: Tools và automation để tăng productivity
- **Production Ready**: Kubernetes deployment với monitoring
- **Best Practices**: Security, performance, và maintainability
- **Comprehensive Testing**: Unit, integration, và E2E testing
- **Modern Stack**: Latest technologies với optimization

Hãy khám phá, thử nghiệm, và xây dựng những ứng dụng tuyệt vời với KataCore! 🚀
