# Frontend Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Key Features](#key-features)
4. [Development Setup](#development-setup)
5. [Component Architecture](#component-architecture)
6. [Authentication & RBAC](#authentication--rbac)
7. [Page Builder System](#page-builder-system)
8. [Advanced Components](#advanced-components)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Overview

The frontend is built with Next.js 15, TypeScript, React, and Tailwind CSS. It provides a comprehensive e-commerce and admin platform with advanced features like page building, RBAC, affiliate system, and LMS.

### Tech Stack
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context API + Apollo Client
- **Authentication**: JWT + Apollo Auth Guards
- **Build Tool**: Bun.js

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui components
│   │   ├── admin/                 # Admin components
│   │   ├── pagebuilder/           # Page builder components
│   │   └── ...
│   ├── pages/                     # Next.js pages
│   ├── lib/
│   │   ├── graphql/              # GraphQL queries/mutations
│   │   ├── utils/                # Utility functions
│   │   └── hooks/                # Custom hooks
│   ├── contexts/                  # React contexts
│   └── styles/                    # Global styles
├── public/                        # Static assets
└── package.json
```

## Key Features

### 1. **RBAC (Role-Based Access Control)**
- Comprehensive permission system with admin, user, and guest roles
- Dynamic menu rendering based on user permissions
- Protected routes with guards
- Permission-based component visibility

**Key Files**:
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/lib/utils/permission-utils.ts` - Permission utilities
- `src/hooks/useRbac.ts` - RBAC hooks

### 2. **Page Builder System**
- Drag-and-drop interface for creating pages
- Nested block support with parent-child relationships
- Template library with pre-built templates
- Save/restore functionality
- Advanced styling with style panel
- Dynamic data source binding
- Custom header/footer support

**Key Files**:
- `src/components/pagebuilder/` - Page builder components
- `src/lib/graphql/pagebuilder.queries.ts` - Page builder queries

### 3. **Advanced Table Component**
- Responsive table with sorting, filtering, pagination
- Row selection and bulk actions
- Column management
- Customizable cell rendering
- Excel export functionality

**Key Files**:
- `src/components/admin/AdvancedTable.tsx` - Main table component

### 4. **E-Commerce Features**
- Product browsing and search with fuzzy matching
- Invoice management with sync capabilities
- Shopping cart functionality
- Product detail pages with dynamic layouts

### 5. **Affiliate System**
- Affiliate dashboard
- Link creation and tracking
- Earnings tracking
- Campaign management
- Referral system

### 6. **LMS (Learning Management System)**
- Course management
- Lesson organization with modules
- Quiz system
- Student enrollment tracking
- Progress tracking

## Development Setup

### Prerequisites
```bash
- Node.js >= 18
- Bun.js >= 1.3.0
- Git
```

### Installation
```bash
cd frontend
bun install
```

### Development Server
```bash
bun dev
# Starts on http://localhost:3000
```

### Build for Production
```bash
bun run build
bun start
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:14000/graphql
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:14000/graphql
```

## Component Architecture

### Base Components (shadcn/ui)
- Button, Input, Select, Dialog, Tabs, etc.
- All located in `src/components/ui/`
- Fully typed with TypeScript

### Page Builder Components
- **LeftPanel**: Element library and block management
- **Canvas**: Main editing area
- **RightPanel**: Block properties and styling
- **StylePanel**: Advanced styling controls
- **Dialog System**: Modal dialogs for block configuration

### Admin Components
- **AdvancedTable**: Data table with advanced features
- **UserManagement**: User CRUD operations
- **RolePermissionModal**: RBAC UI
- **MenuManagement**: Dynamic menu configuration

## Authentication & RBAC

### Auth Flow
1. User logs in via LoginForm
2. Backend returns JWT token
3. Token stored in localStorage
4. Apollo Client includes token in Authorization header
5. AuthContext manages user state

### Permission Model
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  roleType?: string;      // Legacy field
  roles?: Role[];         // Current roles from database
  permissions?: Permission[];
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions?: Permission[];
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  resource?: string;
  action?: string;
}
```

### Permission Checking
```typescript
import { getUserRoleNames, hasPermission } from '@/lib/utils/permission-utils';

// Get user's role names
const roles = getUserRoleNames(user);  // ['admin', 'super_admin']

// Check if user has permission
const canEdit = hasPermission(user, 'pages:edit', ['admin']);

// In components
if (hasPermission(user, 'products:delete')) {
  // Show delete button
}
```

## Page Builder System

### Architecture
- **Canvas-centric**: Central editing area
- **Block-based**: Pages composed of configurable blocks
- **Nested Structure**: Blocks can contain child blocks
- **Template Support**: Save and load templates
- **Dynamic Data**: Bind blocks to GraphQL queries

### Block Types
- Text blocks (h1, h2, p, span)
- Button blocks
- Image blocks
- Grid/Layout blocks
- Product showcase blocks
- Custom blocks

### Key Features
1. **Drag & Drop**: Intuitive interface
2. **Nested Blocks**: Parent-child relationships
3. **Style Panel**: Advanced CSS styling
4. **Layout Settings**: Custom header/footer
5. **Template Library**: Pre-built templates
6. **Auto-save**: Periodic saving to backend

### Usage Example
```typescript
import { PageBuilder } from '@/components/pagebuilder/PageBuilder';

export default function CreatePage() {
  return (
    <PageBuilder
      pageId={id}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}
```

## Advanced Components

### Advanced Table
```typescript
import { AdvancedTable } from '@/components/admin/AdvancedTable';

<AdvancedTable
  columns={columns}
  data={data}
  onRowSelect={handleSelect}
  onBulkAction={handleBulkAction}
/>
```

### Data Fetching with GraphQL
```typescript
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/lib/graphql/queries';

function Users() {
  const { data, loading, error } = useQuery(GET_USERS);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.users.map(u => <div>{u.name}</div>)}</div>;
}
```

## Deployment

### Production Build
```bash
bun run build
```

### Docker Deployment
The frontend is containerized using optimized Dockerfiles:
- Base image: `node:20-slim`
- Multi-stage build: Build locally, copy to Docker
- Size: ~280MB (optimized from 1.2GB)
- Build time: ~2 minutes (optimized from 20 minutes)

### Deployment Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Database seeded with default data
- [ ] RBAC roles and permissions configured

## Troubleshooting

### Common Issues

**1. Authentication Errors**
- Clear localStorage: `localStorage.clear()`
- Check JWT token expiration
- Verify backend API is running
- Check CORS configuration

**2. Page Builder Issues**
- Ensure backend GraphQL endpoint is correct
- Check browser console for GraphQL errors
- Clear Apollo cache: `apolloClient.cache.reset()`
- Verify page permissions

**3. Permission Errors**
- Check user has required roles
- Verify roles are assigned in database
- Check permission names match exactly
- Review RBAC database seeding

**4. Performance Issues**
- Enable code splitting in webpack
- Use React.lazy for lazy loading
- Optimize images with next/image
- Enable caching headers
- Use CDN for static assets

### Debug Mode
```typescript
// Enable GraphQL logging
localStorage.setItem('DEBUG_GRAPHQL', 'true');

// Enable permission checking logs
localStorage.setItem('DEBUG_PERMISSIONS', 'true');
```

## Testing

### Unit Tests
```bash
bun test
```

### E2E Tests
```bash
bun run test:e2e
```

### Manual Testing Checklist
- [ ] Login/Logout flow
- [ ] Admin menu visibility
- [ ] Page creation and editing
- [ ] Product browsing
- [ ] Affiliate dashboard
- [ ] Invoice sync
- [ ] Responsive design (mobile, tablet, desktop)

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "feat: description"`
4. Push to branch: `git push origin feature/feature-name`
5. Create Pull Request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [GraphQL Documentation](https://graphql.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Support

For issues and questions:
1. Check existing GitHub issues
2. Review documentation in `/docs` directory
3. Check backend logs: `docker logs backend`
4. Check frontend logs: browser console
5. Contact development team

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainers**: Development Team
