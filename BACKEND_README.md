# Backend Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [GraphQL API](#graphql-api)
6. [Authentication & Authorization](#authentication--authorization)
7. [RBAC System](#rbac-system)
8. [Database Integration](#database-integration)
9. [Services & Business Logic](#services--business-logic)
10. [Error Handling](#error-handling)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## Overview

The backend is built with NestJS, GraphQL, Prisma, and PostgreSQL. It provides a comprehensive REST/GraphQL API for the e-commerce platform with advanced features like RBAC, page building, affiliate tracking, and LMS.

### Key Capabilities
- ✅ GraphQL API with type-safe schemas
- ✅ JWT-based authentication
- ✅ Role-Based Access Control (RBAC)
- ✅ Page builder backend
- ✅ Product and invoice management
- ✅ Affiliate tracking system
- ✅ LMS (Learning Management System)
- ✅ Audit logging
- ✅ File management with MinIO
- ✅ Real-time notifications with WebSockets

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **API**: GraphQL
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Storage**: MinIO / AWS S3
- **Cache**: Redis
- **Server**: Node.js or Bun.js
- **Build Tool**: NestJS CLI

## Project Structure

```
backend/
├── src/
│   ├── app.module.ts              # Root module
│   ├── main.ts                    # Application entry point
│   ├── auth/                      # Authentication module
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── auth.service.ts
│   ├── graphql/
│   │   ├── resolvers/            # GraphQL resolvers
│   │   ├── models/               # GraphQL object types
│   │   ├── inputs/               # GraphQL input types
│   │   └── guards/               # Authorization guards
│   ├── services/                 # Business logic services
│   │   ├── rbac.service.ts
│   │   ├── page.service.ts
│   │   ├── product.service.ts
│   │   └── ...
│   ├── prisma/                   # Prisma integration
│   │   └── prisma.service.ts
│   ├── security/                 # Security middleware
│   └── ...
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── src/main.ts                   # Entry point
└── package.json
```

## Architecture

### Layered Architecture
```
┌─────────────────────────────┐
│      GraphQL Resolvers      │ (API Layer)
├─────────────────────────────┤
│   Authorization Guards      │ (Security Layer)
├─────────────────────────────┤
│   Services & Business Logic │ (Business Layer)
├─────────────────────────────┤
│    Data Access (Prisma)     │ (Data Layer)
├─────────────────────────────┤
│      PostgreSQL Database    │ (Storage Layer)
└─────────────────────────────┘
```

### Module Organization
```
AuthModule          → Authentication & JWT handling
RbacModule          → Role-Based Access Control
PageModule          → Page builder backend
ProductModule       → Product management
InvoiceModule       → Invoice management
AffiliateModule     → Affiliate tracking & payments
LmsModule           → Learning management system
FileModule          → File upload & management
NotificationModule  → Real-time notifications
AuditModule         → Audit logging
```

## GraphQL API

### Query Examples

```graphql
# User Authentication
query GetCurrentUser {
  getMe {
    id
    email
    username
    roleType
    roles {
      id
      name
      displayName
      permissions {
        id
        name
        displayName
        resource
        action
      }
    }
    permissions {
      id
      name
      displayName
    }
  }
}

# RBAC Data
query GetUserRolePermissions($userId: String!) {
  getUserRolePermissions(userId: $userId) {
    userId
    roleAssignments {
      id
      role {
        id
        name
        displayName
        permissions {
          id
          name
          displayName
        }
      }
    }
    effectivePermissions {
      id
      name
      displayName
    }
  }
}

# Page Builder
query GetPageById($id: String!) {
  getPageById(id: $id) {
    id
    title
    slug
    blocks {
      id
      type
      order
      properties
      children {
        id
        type
        order
      }
    }
  }
}
```

### Mutation Examples

```graphql
# Login
mutation LoginUser($input: LoginUserInput!) {
  loginUser(input: $input) {
    user {
      id
      email
      username
    }
    accessToken
  }
}

# Create Page
mutation CreatePage($input: CreatePageInput!) {
  createPage(input: $input) {
    id
    title
    slug
    createdAt
  }
}

# Assign Role to User
mutation AssignUserRoles($input: AssignUserRoleInput!) {
  assignUserRoles(input: $input)
}
```

## Authentication & Authorization

### JWT Authentication Flow
```
1. User submits credentials (email/password)
2. Backend validates credentials
3. Backend generates JWT token (access + refresh)
4. Client stores token in localStorage/sessionStorage
5. Client includes token in Authorization header for subsequent requests
6. Backend validates token and extracts user info
```

### JWT Payload
```json
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "username": "username",
  "roleType": "ADMIN",
  "iat": 1635873600,
  "exp": 1635960000
}
```

### Guards Implementation
```typescript
// JWT Auth Guard - validates token exists and is valid
@UseGuards(JwtAuthGuard)
async getMe(@CurrentUser() user: User): Promise<User> {
  return user;
}

// Roles Guard - validates user has required role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN)
async adminFunction(): Promise<void> {
  // Only ADMIN can access
}
```

## RBAC System

### Core Concepts

**Role**: A group of permissions
- Examples: admin, super_admin, editor, viewer
- Can be hierarchical (parent-child relationships)
- Can have direct permissions assigned

**Permission**: An individual action/resource pair
- Format: `resource:action`
- Examples: `users:read`, `pages:edit`, `products:delete`
- Has display name and description

**User Role Assignment**: Links users to roles
- Includes effect (allow/deny)
- Can have conditions and metadata
- Optional expiration date

### Database Model
```prisma
model Role {
  id                  String
  name                String      // Unique role name
  displayName         String
  description         String?
  isActive            Boolean
  isSystemRole        Boolean
  priority            Int?
  
  permissions         RolePermission[]  // Many-to-many
  userAssignments     UserRoleAssignment[]
  parentId            String?
  children            Role[]
}

model Permission {
  id                  String
  name                String      // resource:action format
  displayName         String
  description         String?
  resource            String?
  action              String?
  scope               String?
  isActive            Boolean
  
  roles               RolePermission[]
  users               UserPermission[]
}

model UserRoleAssignment {
  id                  String
  userId              String
  roleId              String
  effect              RoleEffect     // ALLOW, DENY
  scope               String?
  expiresAt           DateTime?
  conditions          Json?
  
  user                User
  role                Role
}
```

### Permission Checking Service
```typescript
@Injectable()
export class RbacService {
  async checkPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    // 1. Get user's roles
    // 2. Get role permissions
    // 3. Get direct permissions
    // 4. Merge and check for permission
    // 5. Return true if found
  }

  async getUserEffectivePermissions(
    userId: string
  ): Promise<UserRolePermissionSummary> {
    // Return all effective permissions for user
  }
}
```

## Database Integration

### Prisma Setup
```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Database Seeding
```bash
# Run migrations
bun run prisma:migrate

# Seed database with default data
bun run prisma:seed

# Reset database (development only!)
bun run prisma:reset
```

### Key Models
- **User**: System users with authentication
- **Role**: Permission groups
- **Permission**: Individual actions/resources
- **Page**: Page builder pages with blocks
- **Block**: Page builder blocks with nesting support
- **Product**: E-commerce products
- **Invoice**: Invoice data
- **Affiliate**: Affiliate tracking and links
- **Course**: LMS courses
- **Audit Log**: Audit trail of changes

## Services & Business Logic

### Key Services

**AuthService**
- User registration and login
- JWT token generation and validation
- Password management
- Two-factor authentication

**RbacService**
- Role and permission management
- User role assignment
- Permission checking
- Effective permission calculation

**PageService**
- CRUD operations for pages
- Block management
- Template save/restore
- Page publishing

**ProductService**
- Product CRUD operations
- Fuzzy matching for search
- Product normalization
- Category management

**InvoiceService**
- Invoice import and sync
- Bearer token integration
- Status tracking
- Search and filtering

**AffiliateService**
- Link creation and tracking
- Commission calculations
- Affiliate dashboard data
- Payment processing

### Service Pattern
```typescript
@Injectable()
export class ExampleService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private rbac: RbacService,
  ) {}

  async create(input: CreateInput): Promise<Entity> {
    try {
      // Business logic
      return await this.prisma.entity.create({ data: input });
    } catch (error) {
      this.logger.error('Error creating entity', error);
      throw new Error('Failed to create entity');
    }
  }
}
```

## Error Handling

### Custom Exceptions
```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

class NotFoundException extends HttpException {
  constructor(resource: string) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
```

### GraphQL Error Handling
```typescript
import { GraphQLError } from 'graphql';

@Query()
async getUser(@Args('id') id: string): Promise<User> {
  const user = await this.userService.findById(id);
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }
  return user;
}
```

### Global Exception Filter
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getMessage();
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
```

## Deployment

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/shoprausach

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600

# File Storage
MINIO_ENDPOINT=localhost:9000
MINIO_REGION=us-east-1
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API
API_PORT=14000
NODE_ENV=production
```

### Docker Deployment
```dockerfile
FROM node:20-slim

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

EXPOSE 14000

CMD ["bun", "start"]
```

### Production Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RBAC roles seeded
- [ ] SSL certificates configured
- [ ] Redis running
- [ ] MinIO/S3 configured
- [ ] Logging enabled
- [ ] Error monitoring setup (Sentry)
- [ ] Rate limiting enabled

## Troubleshooting

### Common Issues

**1. JWT Token Errors**
```
Error: "Invalid token"
Solution:
- Check JWT_SECRET is same on frontend and backend
- Check token expiration time
- Verify token format in header: "Authorization: Bearer <token>"
```

**2. GraphQL Query Errors**
```
Error: "Expected Iterable, but did not find one for field"
Solution:
- Check GraphQL schema field type matches resolver return type
- Use @Field(() => [Type]) for arrays
- Use @Field({ nullable: true }) for optional fields
```

**3. RBAC Permission Denied**
```
Error: "User does not have required permissions"
Solution:
- Verify user has required role assigned
- Check role has permission assigned
- Verify permission name matches exactly (case-sensitive)
- Check database seeding completed
```

**4. Database Connection Error**
```
Error: "connect ECONNREFUSED 127.0.0.1:5432"
Solution:
- Verify PostgreSQL is running: docker ps
- Check DATABASE_URL is correct
- Verify database exists
- Check firewall/network access
```

### Debugging Tips

```typescript
// Enable detailed logging
this.logger.debug('Message', 'context');

// Log SQL queries
DATABASE_LOG=true bun dev

// GraphQL introspection
# Visit http://localhost:14000/graphql in browser
```

## Testing

### Unit Tests
```bash
bun test
bun test --coverage
```

### E2E Tests
```bash
bun test:e2e
```

### Manual API Testing
```bash
# GraphQL Playground
http://localhost:14000/graphql

# API Documentation
http://localhost:14000/api/docs
```

## Performance Optimization

### Caching Strategy
- Use Redis for frequently accessed data
- Implement Apollo Cache directives
- Enable HTTP caching headers

### Database Optimization
- Add indexes on frequently queried fields
- Use database query plans (EXPLAIN)
- Implement connection pooling

### GraphQL Optimization
- Use DataLoader for batching queries
- Implement query complexity analysis
- Use pagination for large datasets

## Contributing

1. Create a feature branch
2. Make changes following NestJS best practices
3. Add tests for new features
4. Update GraphQL schema documentation
5. Create PR with detailed description

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Documentation](https://jwt.io)

## Support

For issues and questions:
1. Check backend logs: `docker logs backend`
2. Check database: `docker exec -it postgres psql`
3. Test GraphQL: Visit `/graphql` endpoint
4. Review error stack traces
5. Contact development team

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainers**: Development Team
