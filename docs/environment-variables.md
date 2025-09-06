# Environment Variables Configuration

Dự án Katacore sử dụng environment variables để quản lý cấu hình của ứng dụng. Tài liệu này hướng dẫn cách thiết lập và sử dụng các biến môi trường.

## 📁 Cấu trúc File Environment

```
katacore/
├── .env                    # File environment chính (root level)
├── .env.example            # Template cho environment variables
├── backend/
│   └── .env.local         # Environment variables cho backend development
└── frontend/
    └── .env.local         # Environment variables cho frontend development
```

## 🔧 Thiết lập Environment Variables

### 1. Backend Environment Variables

File: `backend/.env.local`

```bash
# Application
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/katacore"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
JWT_EXPIRES_IN=7d

# Minio Object Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=uploads
```

### 2. Frontend Environment Variables

File: `frontend/.env.local`

```bash
# Next.js Frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql

# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Cách sử dụng Environment Variables trong Code

### 1. Backend (NestJS)

#### Sử dụng ConfigService:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return this.configService.get<number>('PORT', 4000);
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
}
```

#### Sử dụng EnvConfigService (Recommended):

```typescript
import { Injectable } from '@nestjs/common';
import { EnvConfigService } from './config/env-config.service';

@Injectable()
export class MyService {
  constructor(private envConfig: EnvConfigService) {}

  getApplicationInfo() {
    return {
      port: this.envConfig.port,
      isProduction: this.envConfig.isProduction,
      databaseUrl: this.envConfig.databaseUrl,
      jwtSecret: this.envConfig.jwtSecret,
    };
  }
}
```

### 2. Frontend (Next.js)

```typescript
// Sử dụng trong component
const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// Sử dụng trong API routes
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
```

## 🔍 Validation và Kiểm tra

### 1. Kiểm tra Environment Variables

```bash
# Kiểm tra environment variables của backend
cd backend
bun run check-env

# Output:
# ✅ All required environment variables are set!
# Ready to start the application.
```

### 2. Validation Schema

File: `backend/src/config/validation.ts`

Environment variables được validate tự động khi ứng dụng khởi động:

```typescript
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().port().default(4000),
  DATABASE_URL: Joi.string().required().pattern(/^postgresql:\/\//),
  JWT_SECRET: Joi.string().min(32).required(),
  // ... other validations
});
```

## 📋 Environment Variables Reference

### Required Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `DATABASE_URL` | String | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | String | JWT signing secret (min 32 chars) | `your-super-secret-jwt-key...` |
| `MINIO_ACCESS_KEY` | String | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | String | MinIO secret key | `minioadmin` |

### Optional Variables (với default values)

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | String | `development` | Application environment |
| `PORT` | Number | `4000` | Backend server port |
| `FRONTEND_URL` | String | `http://localhost:3000` | Frontend URL for CORS |
| `REDIS_HOST` | String | `localhost` | Redis server host |
| `REDIS_PORT` | Number | `6379` | Redis server port |
| `JWT_EXPIRES_IN` | String | `7d` | JWT token expiration time |
| `MINIO_ENDPOINT` | String | `localhost` | MinIO server endpoint |
| `MINIO_PORT` | Number | `9000` | MinIO server port |
| `MINIO_USE_SSL` | Boolean | `false` | Use SSL for MinIO connection |
| `MINIO_BUCKET_NAME` | String | `uploads` | Default MinIO bucket name |

## 🛠️ Development Workflow

### 1. Local Development

```bash
# 1. Copy environment templates
cp .env.example .env
cp backend/.env.local.example backend/.env.local  # if exists
cp frontend/.env.local.example frontend/.env.local  # if exists

# 2. Update values trong .env files
# 3. Check environment variables
cd backend && bun run check-env

# 4. Start development servers
cd backend && bun run start:dev
cd frontend && bun run dev
```

### 2. Production Deployment

```bash
# 1. Set production environment variables
export NODE_ENV=production
export DATABASE_URL="your-production-database-url"
export JWT_SECRET="your-production-jwt-secret"

# 2. Check environment
bun run check-env

# 3. Build and start
bun run build
bun run start:prod
```

## 🔒 Security Best Practices

1. **Never commit sensitive data**: Đảm bảo `.env*` files được include trong `.gitignore`
2. **Use strong secrets**: JWT_SECRET phải có ít nhất 32 ký tự
3. **Different secrets per environment**: Sử dụng secrets khác nhau cho development, staging, và production
4. **Validate on startup**: Ứng dụng sẽ validate tất cả environment variables khi khởi động
5. **Mask sensitive data**: Sensitive data sẽ được mask khi log ra console

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **"Environment variable X is not defined"**
   - Kiểm tra file `.env` hoặc `.env.local`
   - Chạy `bun run check-env` để kiểm tra

2. **"JWT_SECRET must be at least 32 characters long"**
   - Cập nhật JWT_SECRET với string dài hơn 32 ký tự

3. **"DATABASE_URL must be a valid PostgreSQL connection string"**
   - Đảm bảo DATABASE_URL bắt đầu với `postgresql://`

4. **Environment variables không load được**
   - Kiểm tra đường dẫn file `.env`
   - Đảm bảo không có space xung quanh dấu `=`

### Debug Environment Loading:

```typescript
// Thêm vào main.ts để debug
console.log('Environment variables loaded:');
console.log({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  // ... other vars
});
```

## 📞 Support

Nếu có vấn đề với environment variables, vui lòng:
1. Chạy `bun run check-env` để kiểm tra
2. Kiểm tra validation errors trong console
3. Xem lại documentation này
4. Tạo issue trong repository
