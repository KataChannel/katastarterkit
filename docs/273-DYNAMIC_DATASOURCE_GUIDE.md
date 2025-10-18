# 🚀 Dynamic Datasource Guide - PageBuilder Pattern

**Level**: Senior Developer  
**Date**: October 18, 2025  
**Version**: 2.0.0

---

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Pattern](#implementation-pattern)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Real Example: Product Blocks](#real-example-product-blocks)
5. [Advanced Patterns](#advanced-patterns)
6. [Best Practices](#best-practices)
7. [Common Pitfalls](#common-pitfalls)

---

## 🏗️ Architecture Overview

### Core Concept

```
Dynamic Block = Static UI + Dynamic Data + User Config

┌─────────────────────────────────────────────────────────┐
│                    Dynamic Block Flow                    │
└─────────────────────────────────────────────────────────┘

1. User adds block to PageBuilder
2. Block renders placeholder in EDIT mode (no data fetch)
3. User configures block via RightPanel (filters, options)
4. In VIEW mode, block fetches data via GraphQL
5. Data renders with configured options
```

### Layer Breakdown

```
┌──────────────────────────────────────────────────────────┐
│ Layer 1: Frontend Block Component                        │
│ - React component with UI                                │
│ - Handles edit/view mode                                 │
│ - Uses Apollo Client for GraphQL                         │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ Layer 2: GraphQL Query/Fragment                          │
│ - Defines data structure                                 │
│ - Reusable fragments                                     │
│ - Type-safe queries                                      │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ Layer 3: Backend Resolver                                │
│ - NestJS GraphQL resolver                                │
│ - Business logic                                         │
│ - Database queries                                       │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│ Layer 4: Database                                         │
│ - PostgreSQL with Prisma                                 │
│ - Normalized schema                                      │
│ - Relations and indexes                                  │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Implementation Pattern

### Pattern 1: List Block (Collection)

**Use Case**: Display multiple items from database

**Examples**: 
- Product List
- Blog Posts
- Team Members
- Testimonials

**Key Features**:
- Pagination
- Filtering
- Sorting
- Search

**Template**:

```typescript
// 1. Define Content Interface
export interface MyListBlockContent {
  title?: string;
  subtitle?: string;
  limit?: number;
  filters?: {
    category?: string;
    featured?: boolean;
    // ... custom filters
  };
  layout?: 'grid' | 'list' | 'carousel';
  columns?: 2 | 3 | 4;
  style?: any;
}

// 2. Define Block Props (Standard Interface)
export interface MyListBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

// 3. Component Implementation
export function MyListBlock({ 
  block, 
  isEditable = true, 
  onUpdate, 
  onDelete 
}: MyListBlockProps) {
  const content = (block.content || {}) as MyListBlockContent;
  const { title, limit = 12, filters = {} } = content;
  
  // 4. GraphQL Query (Skip in edit mode)
  const { data, loading, error } = useQuery(GET_MY_ITEMS, {
    variables: { input: { limit, filters } },
    skip: isEditable, // Don't fetch in edit mode
  });
  
  // 5. Edit Mode Placeholder
  if (isEditable) {
    return (
      <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg">
        <h3>My List Block</h3>
        <p>Will display {limit} items</p>
        {/* Show configuration preview */}
      </div>
    );
  }
  
  // 6. Loading/Error States
  if (loading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;
  
  // 7. Render Data
  const items = data?.myItems?.items || [];
  
  return (
    <div>
      {title && <h2>{title}</h2>}
      <div className={`grid grid-cols-${content.columns}`}>
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Detail Block (Single Item)

**Use Case**: Display single item details

**Examples**:
- Product Detail
- Blog Post Detail
- User Profile
- Event Detail

**Key Features**:
- Dynamic routing (URL slug)
- Fallback to config
- Rich content display

**Template**:

```typescript
// 1. Define Content Interface
export interface MyDetailBlockContent {
  itemSlug?: string; // Optional: can use URL slug
  showGallery?: boolean;
  showDescription?: boolean;
  showRelated?: boolean;
  layout?: 'default' | 'wide' | 'sidebar';
  style?: any;
}

// 2. Component Implementation
export function MyDetailBlock({ 
  block, 
  isEditable = true, 
  onUpdate, 
  onDelete 
}: MyDetailBlockProps) {
  const content = (block.content || {}) as MyDetailBlockContent;
  const { itemSlug: configSlug } = content;
  
  // 3. Get slug from URL or config
  const params = useParams();
  const urlSlug = params?.slug as string;
  
  // Edit mode: only use config
  // View mode: config first, fallback to URL
  const itemSlug = isEditable ? configSlug : (configSlug || urlSlug);
  
  // 4. GraphQL Query
  const { data, loading, error } = useQuery(GET_MY_ITEM_BY_SLUG, {
    variables: { slug: itemSlug },
    skip: isEditable || !itemSlug,
  });
  
  // 5. Edit Mode with Warning
  if (isEditable) {
    return (
      <div className="p-6 border-2 border-dashed border-green-300 rounded-lg">
        <h3>My Detail Block</h3>
        {itemSlug ? (
          <p>Displaying: <strong>{itemSlug}</strong></p>
        ) : (
          <div className="text-orange-600">
            ⚠️ Please configure item slug in RightPanel
          </div>
        )}
      </div>
    );
  }
  
  // 6. Render Detail
  const item = data?.myItemBySlug;
  if (!item) return <NotFound />;
  
  return (
    <div>
      <h1>{item.name}</h1>
      {content.showGallery && <Gallery images={item.images} />}
      {content.showDescription && <Description text={item.description} />}
    </div>
  );
}
```

### Pattern 3: Dynamic Content Block

**Use Case**: Mixed content types from CMS

**Examples**:
- Dynamic sections
- Custom content types
- CMS blocks

**Template**:

```typescript
export interface DynamicBlockContent {
  contentType: string; // 'hero' | 'features' | 'testimonials'
  dataSource: string;  // GraphQL query name or endpoint
  variables?: any;     // Dynamic query variables
  template?: string;   // Template variant
  style?: any;
}

export function DynamicBlock({ block, isEditable, onUpdate, onDelete }: DynamicBlockProps) {
  const content = (block.content || {}) as DynamicBlockContent;
  const { contentType, dataSource, variables } = content;
  
  // Dynamic query selection
  const query = QUERY_MAP[dataSource];
  const { data, loading, error } = useQuery(query, {
    variables,
    skip: isEditable,
  });
  
  // Edit mode
  if (isEditable) {
    return (
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-6">
        <h3>Dynamic Block</h3>
        <p>Type: {contentType}</p>
        <p>Source: {dataSource}</p>
      </div>
    );
  }
  
  // Dynamic rendering based on content type
  const Renderer = RENDERER_MAP[contentType];
  return <Renderer data={data} />;
}
```

---

## 📝 Step-by-Step Guide

### Step 1: Define Your Data Model

**Backend: Prisma Schema**

```prisma
// backend/prisma/schema.prisma

model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String
  excerpt     String?
  thumbnail   String?
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  isFeatured  Boolean  @default(false)
  isPublished Boolean  @default(true)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([categoryId])
  @@index([isFeatured])
}
```

### Step 2: Create GraphQL Types

**Backend: GraphQL Type Definition**

```typescript
// backend/src/graphql/types/post.type.ts

import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => CategoryType, { nullable: true })
  category?: CategoryType;

  @Field(() => UserType)
  author: UserType;

  @Field()
  isFeatured: boolean;

  @Field()
  isPublished: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PostsResponse {
  @Field(() => [PostType])
  items: PostType[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  totalPages: number;
}
```

### Step 3: Create Resolver

**Backend: GraphQL Resolver**

```typescript
// backend/src/graphql/resolvers/post.resolver.ts

import { Resolver, Query, Args } from '@nestjs/graphql';
import { PostType, PostsResponse } from '../types/post.type';
import { PrismaService } from '../../prisma/prisma.service';

@Resolver(() => PostType)
export class PostResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => PostsResponse)
  async posts(
    @Args('input', { nullable: true }) input?: GetPostsInput
  ): Promise<PostsResponse> {
    const { 
      limit = 10, 
      page = 1, 
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = input || {};

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { isPublished: true };
    
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }
    
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    // Execute queries
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: { category: true, author: true }
      }),
      this.prisma.post.count({ where })
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @Query(() => PostType, { nullable: true })
  async postBySlug(
    @Args('slug') slug: string
  ): Promise<PostType | null> {
    return this.prisma.post.findUnique({
      where: { slug, isPublished: true },
      include: { category: true, author: true }
    });
  }
}
```

### Step 4: Create Frontend GraphQL Queries

**Frontend: GraphQL Queries**

```typescript
// frontend/src/graphql/post.queries.ts

import { gql } from '@apollo/client';

// Fragments for reusability
export const POST_BASIC_FRAGMENT = gql`
  fragment PostBasicFields on PostType {
    id
    title
    slug
    excerpt
    thumbnail
    isFeatured
    publishedAt
    createdAt
  }
`;

export const POST_FULL_FRAGMENT = gql`
  ${POST_BASIC_FRAGMENT}
  fragment PostFullFields on PostType {
    ...PostBasicFields
    content
    category {
      id
      name
      slug
    }
    author {
      id
      name
      avatar
    }
  }
`;

// Queries
export const GET_POSTS = gql`
  ${POST_BASIC_FRAGMENT}
  query GetPosts($input: GetPostsInput) {
    posts(input: $input) {
      items {
        ...PostBasicFields
        category {
          id
          name
          slug
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  ${POST_FULL_FRAGMENT}
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      ...PostFullFields
    }
  }
`;

// TypeScript Interfaces
export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  thumbnail?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface PostsResponse {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Step 5: Create Block Component

**Frontend: Block Component**

```typescript
// frontend/src/components/page-builder/blocks/PostListBlock.tsx

'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS, Post } from '@/graphql/post.queries';
import { PageBlock } from '@/types/page-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, BookOpen } from 'lucide-react';

export interface PostListBlockContent {
  title?: string;
  subtitle?: string;
  limit?: number;
  categoryId?: string;
  filters?: {
    isFeatured?: boolean;
    search?: string;
  };
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  showAuthor?: boolean;
  showCategory?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  style?: any;
}

export interface PostListBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

export function PostListBlock({ 
  block, 
  isEditable = true, 
  onUpdate, 
  onDelete 
}: PostListBlockProps) {
  const content = (block.content || {}) as PostListBlockContent;
  const {
    title = 'Bài viết',
    subtitle,
    limit = 9,
    categoryId,
    filters = {},
    layout = 'grid',
    columns = 3,
    showAuthor = true,
    showCategory = true,
    showExcerpt = true,
    showDate = true,
  } = content;

  const [page, setPage] = useState(1);

  // Build query variables
  const variables = {
    input: {
      limit,
      page,
      filters: {
        ...filters,
        ...(categoryId && { categoryId }),
      },
      sortBy: 'publishedAt',
      sortOrder: 'DESC'
    },
  };

  // GraphQL Query (skip in edit mode)
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables,
    skip: isEditable,
  });

  // Grid layout classes
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  // Edit Mode Placeholder
  if (isEditable) {
    return (
      <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-blue-500" />
          <h3 className="text-lg font-semibold mb-2">Post List Block</h3>
          <p className="text-sm text-gray-600 mb-4">
            Hiển thị {limit} bài viết
            {categoryId && ' từ danh mục đã chọn'}
            {filters.isFeatured && ' (Nổi bật)'}
          </p>
          <div className="flex gap-2 justify-center text-xs text-gray-500">
            <Badge variant="secondary">Layout: {layout}</Badge>
            <Badge variant="secondary">Columns: {columns}</Badge>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !isEditable) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-center">
          Lỗi tải bài viết: {error.message}
        </p>
      </div>
    );
  }

  // Loading State
  if (loading && !isEditable) {
    return (
      <div className="container mx-auto py-8">
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const posts: Post[] = data?.posts?.items || [];
  const total = data?.posts?.total || 0;
  const totalPages = data?.posts?.totalPages || 1;

  return (
    <div className="container mx-auto py-8" style={content.style}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}

      {/* Posts Grid */}
      <div className={`grid ${gridCols} gap-6`}>
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                {post.isFeatured && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    Featured
                  </Badge>
                )}
              </div>
            )}

            <CardHeader>
              {/* Category */}
              {showCategory && post.category && (
                <Badge variant="secondary" className="w-fit mb-2">
                  {post.category.name}
                </Badge>
              )}

              {/* Title */}
              <CardTitle className="line-clamp-2 hover:text-primary">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </CardTitle>

              {/* Meta */}
              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                {showAuthor && post.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author.name}
                  </span>
                )}
                {showDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardHeader>

            {/* Excerpt */}
            {showExcerpt && post.excerpt && (
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.excerpt}
                </p>
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Đọc thêm →
                  </Link>
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Register Block Type

**Frontend: Add to BlockType Enum**

```typescript
// frontend/src/types/page-builder.ts

export enum BlockType {
  // ... existing types
  POST_LIST = 'POST_LIST',
  POST_DETAIL = 'POST_DETAIL',
}
```

**Backend: Update Database Enum**

```sql
-- backend/prisma/migrations/XXX_add_post_blocks.sql

ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'POST_LIST';
ALTER TYPE "BlockType" ADD VALUE IF NOT EXISTS 'POST_DETAIL';
```

**Backend: Update GraphQL Enum**

```typescript
// backend/src/graphql/models/page.model.ts

export enum BlockType {
  // ... existing types
  POST_LIST = 'POST_LIST',
  POST_DETAIL = 'POST_DETAIL',
}
```

### Step 7: Register in BlockRenderer

```typescript
// frontend/src/components/page-builder/blocks/BlockRenderer.tsx

import { PostListBlock } from './PostListBlock';
import { PostDetailBlock } from './PostDetailBlock';

// ... in switch statement
case BlockType.POST_LIST:
  blockContent = <PostListBlock {...commonProps} />;
  break;

case BlockType.POST_DETAIL:
  blockContent = <PostDetailBlock {...commonProps} />;
  break;
```

### Step 8: Add to Elements Library

```typescript
// frontend/src/components/page-builder/panels/LeftPanel/ElementsLibrary.tsx

import { BookOpen, FileText } from 'lucide-react';

const BLOCKS = [
  // ... existing blocks
  { id: BlockType.POST_LIST, icon: BookOpen, label: 'Post List', category: 'content' },
  { id: BlockType.POST_DETAIL, icon: FileText, label: 'Post Detail', category: 'content' },
];
```

### Step 9: Add Default Content

```typescript
// frontend/src/components/page-builder/PageBuilderProvider.tsx

const DEFAULT_BLOCK_CONTENT: Record<BlockType, any> = {
  // ... existing defaults
  [BlockType.POST_LIST]: {
    title: 'Bài viết mới nhất',
    subtitle: 'Khám phá những bài viết chất lượng',
    limit: 9,
    filters: {},
    layout: 'grid',
    columns: 3,
    showAuthor: true,
    showCategory: true,
    showExcerpt: true,
    showDate: true,
    style: {}
  },
  [BlockType.POST_DETAIL]: {
    postSlug: '',
    showAuthor: true,
    showCategory: true,
    showDate: true,
    showRelated: true,
    style: {}
  },
};
```

### Step 10: Add RightPanel Configuration

```typescript
// frontend/src/components/page-builder/panels/RightPanel/RightPanel.tsx

{/* Post Slug (for POST_DETAIL block) */}
{selectedBlock.content.postSlug !== undefined && (
  <div>
    <Label htmlFor="block-postSlug" className="text-xs">
      Post Slug <span className="text-red-500">*</span>
    </Label>
    <Input
      id="block-postSlug"
      value={selectedBlock.content.postSlug || ''}
      onChange={(e) => handleContentChange({ 
        ...selectedBlock.content, 
        postSlug: e.target.value 
      })}
      className="mt-1 text-sm"
      placeholder="my-blog-post-slug"
    />
  </div>
)}
```

---

## 🎯 Real Example: Product Blocks

### Current Implementation

```
Product Ecosystem:
├── Backend
│   ├── prisma/schema.prisma (Product model)
│   ├── graphql/types/product.type.ts (GraphQL types)
│   └── graphql/resolvers/product.resolver.ts (Queries)
│
├── Frontend Queries
│   └── graphql/product.queries.ts (Fragments + Queries)
│
├── Blocks
│   ├── ProductListBlock.tsx (List view)
│   └── ProductDetailBlock.tsx (Detail view)
│
└── Integration
    ├── BlockRenderer.tsx (Registration)
    ├── ElementsLibrary.tsx (UI library)
    ├── RightPanel.tsx (Configuration)
    └── PageBuilderProvider.tsx (Defaults)
```

### Key Files Reference

1. **GraphQL Queries**: `/frontend/src/graphql/product.queries.ts`
2. **ProductListBlock**: `/frontend/src/components/page-builder/blocks/ProductListBlock.tsx`
3. **ProductDetailBlock**: `/frontend/src/components/page-builder/blocks/ProductDetailBlock.tsx`
4. **Backend Resolver**: `/backend/src/graphql/resolvers/product.resolver.ts`

---

## 🚀 Advanced Patterns

### Pattern A: Server-Side Rendering (SSR)

For public pages with dynamic blocks:

```typescript
// app/website/[slug]/page.tsx

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { isPublished: true }
  });
  return pages.map(page => ({ slug: page.slug }));
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  // Fetch page with blocks
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: { blocks: true }
  });

  return (
    <div>
      {page.blocks.map(block => (
        <BlockRenderer
          key={block.id}
          block={block}
          isEditing={false}  // View mode - will fetch data
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
```

### Pattern B: Real-time Data with Subscriptions

For live updates:

```typescript
// Using GraphQL Subscriptions

const SUBSCRIBE_TO_PRODUCTS = gql`
  subscription OnProductUpdated {
    productUpdated {
      id
      name
      price
      stock
    }
  }
`;

export function LiveProductListBlock({ block, isEditable, onUpdate, onDelete }: Props) {
  const { data } = useSubscription(SUBSCRIBE_TO_PRODUCTS);
  
  useEffect(() => {
    if (data?.productUpdated) {
      // Update local state with new data
      updateProduct(data.productUpdated);
    }
  }, [data]);
  
  // ... rest of component
}
```

### Pattern C: Cached Data with Apollo Cache

```typescript
// Optimize with cache policies

const { data, loading } = useQuery(GET_PRODUCTS, {
  variables,
  skip: isEditable,
  // Cache configuration
  fetchPolicy: 'cache-first',        // Use cache if available
  nextFetchPolicy: 'cache-and-network', // Then update from network
  pollInterval: 30000,                // Refresh every 30s
});

// Manual cache update
const client = useApolloClient();

const handleProductUpdate = (updatedProduct: Product) => {
  client.writeFragment({
    id: `ProductType:${updatedProduct.id}`,
    fragment: PRODUCT_BASIC_FRAGMENT,
    data: updatedProduct,
  });
};
```

### Pattern D: Optimistic UI Updates

```typescript
const [updateProduct] = useMutation(UPDATE_PRODUCT, {
  optimisticResponse: {
    updateProduct: {
      __typename: 'ProductType',
      id: productId,
      name: newName,
      // ... other fields
    }
  },
  update(cache, { data }) {
    // Update cache immediately
    cache.modify({
      id: cache.identify({ __typename: 'ProductType', id: productId }),
      fields: {
        name: () => data.updateProduct.name,
      }
    });
  }
});
```

### Pattern E: Infinite Scroll

```typescript
export function InfiniteProductListBlock({ block, isEditable, onUpdate, onDelete }: Props) {
  const { data, loading, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { input: { limit: 12, page: 1 } },
    skip: isEditable,
  });

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        input: { 
          limit: 12, 
          page: (data?.products?.page || 0) + 1 
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          products: {
            ...fetchMoreResult.products,
            items: [
              ...prev.products.items,
              ...fetchMoreResult.products.items
            ]
          }
        };
      }
    });
  };

  return (
    <div>
      {/* Render products */}
      <InView onChange={(inView) => inView && handleLoadMore()}>
        <div>Loading more...</div>
      </InView>
    </div>
  );
}
```

---

## 💡 Best Practices

### 1. Separation of Concerns

```
✅ Good:
- Queries in separate file (product.queries.ts)
- Business logic in resolver
- UI logic in component
- Types shared across layers

❌ Bad:
- Inline GraphQL strings in components
- Business logic in components
- Mixed concerns
```

### 2. Type Safety

```typescript
// ✅ Good: Type-safe all the way
interface Product {
  id: string;
  name: string;
  price: number;
}

const GET_PRODUCTS = gql`...`;

const { data } = useQuery<{ products: { items: Product[] } }>(GET_PRODUCTS);
const products: Product[] = data?.products?.items || [];

// ❌ Bad: No types
const { data } = useQuery(GET_PRODUCTS);
const products = data?.products?.items || [];
```

### 3. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
if (error) {
  if (error.networkError) {
    return <NetworkError onRetry={refetch} />;
  }
  if (error.graphQLErrors) {
    return <GraphQLError errors={error.graphQLErrors} />;
  }
  return <GenericError message={error.message} />;
}

// ❌ Bad: Generic error
if (error) {
  return <div>Error: {error.message}</div>;
}
```

### 4. Loading States

```typescript
// ✅ Good: Skeleton with correct structure
if (loading) {
  return (
    <div className={`grid ${gridCols} gap-6`}>
      {Array.from({ length: limit }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ❌ Bad: Generic spinner
if (loading) return <Spinner />;
```

### 5. Memoization

```typescript
// ✅ Good: Memoize expensive computations
const filteredProducts = useMemo(() => {
  return products.filter(p => p.price > minPrice);
}, [products, minPrice]);

// ❌ Bad: Compute on every render
const filteredProducts = products.filter(p => p.price > minPrice);
```

### 6. Pagination

```typescript
// ✅ Good: Cursor-based pagination for large datasets
const { data, fetchMore } = useQuery(GET_PRODUCTS, {
  variables: { first: 10, after: null }
});

// ✅ Good: Offset pagination for small datasets
const { data } = useQuery(GET_PRODUCTS, {
  variables: { limit: 10, page: 1 }
});
```

---

## ⚠️ Common Pitfalls

### 1. Fetching in Edit Mode ❌

```typescript
// ❌ Wrong: Always fetches
const { data } = useQuery(GET_PRODUCTS, {
  variables
});

// ✅ Correct: Skip in edit mode
const { data } = useQuery(GET_PRODUCTS, {
  variables,
  skip: isEditable  // Don't fetch when editing
});
```

### 2. Not Handling Empty States ❌

```typescript
// ❌ Wrong: Crashes on empty array
return <div>{products[0].name}</div>;

// ✅ Correct: Handle empty
if (products.length === 0) {
  return <EmptyState message="No products found" />;
}
```

### 3. Memory Leaks ❌

```typescript
// ❌ Wrong: No cleanup
useEffect(() => {
  const interval = setInterval(refetch, 5000);
}, []);

// ✅ Correct: Cleanup
useEffect(() => {
  const interval = setInterval(refetch, 5000);
  return () => clearInterval(interval);
}, [refetch]);
```

### 4. Over-fetching Data ❌

```typescript
// ❌ Wrong: Fetch all fields
query GetProducts {
  products {
    id name description content images variants
    category author reviews comments ...
  }
}

// ✅ Correct: Only what you need
query GetProductsList {
  products {
    id name thumbnail price isFeatured
  }
}
```

### 5. Not Using Fragments ❌

```typescript
// ❌ Wrong: Duplicate field lists
const QUERY1 = gql`query { product { id name price } }`;
const QUERY2 = gql`query { products { items { id name price } } }`;

// ✅ Correct: Reusable fragments
const PRODUCT_FIELDS = gql`
  fragment ProductFields on ProductType {
    id name price
  }
`;
const QUERY1 = gql`${PRODUCT_FIELDS} query { product { ...ProductFields } }`;
const QUERY2 = gql`${PRODUCT_FIELDS} query { products { items { ...ProductFields } } }`;
```

---

## 📚 Additional Resources

### Documentation
- `/PAGEBUILDER_ECOMMERCE_INTEGRATION_COMPLETE.md` - Product blocks implementation
- `/GRAPHQL_SCHEMA_MISMATCH_FIX.md` - GraphQL schema alignment
- `/PRODUCT_BLOCKS_EDIT_FIX.md` - Edit mode configuration

### Code Examples
- ProductListBlock: `/frontend/src/components/page-builder/blocks/ProductListBlock.tsx`
- ProductDetailBlock: `/frontend/src/components/page-builder/blocks/ProductDetailBlock.tsx`
- Product Queries: `/frontend/src/graphql/product.queries.ts`
- Product Resolver: `/backend/src/graphql/resolvers/product.resolver.ts`

### Tools
- Apollo Client DevTools: Browser extension for debugging GraphQL
- GraphQL Playground: http://localhost:14000/graphql
- Prisma Studio: `npx prisma studio` for database GUI

---

## 🎓 Summary

### Key Takeaways

1. **Architecture**: 4-layer architecture (Component → GraphQL → Resolver → Database)
2. **Patterns**: List blocks vs Detail blocks vs Dynamic blocks
3. **Edit Mode**: Skip queries, show placeholders, configure via RightPanel
4. **View Mode**: Fetch data, handle loading/error, render content
5. **Type Safety**: Use TypeScript interfaces across all layers
6. **Performance**: Cache, pagination, memoization, lazy loading
7. **UX**: Loading skeletons, error handling, empty states

### Quick Reference Commands

```bash
# Generate Prisma client
cd backend && npx prisma generate

# Create migration
cd backend && npx prisma migrate dev --name add_posts

# Test GraphQL query
curl -X POST http://localhost:14000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products { items { id name } } }"}'

# Check for errors
npm run type-check
npm run lint
```

---

**Next Steps**: 
1. Review existing Product blocks implementation
2. Apply patterns to create new dynamic blocks (Posts, Events, etc.)
3. Test thoroughly in both edit and view modes
4. Monitor performance with Apollo DevTools

**Version**: 2.0.0  
**Last Updated**: October 18, 2025  
**Author**: Senior AI Assistant
