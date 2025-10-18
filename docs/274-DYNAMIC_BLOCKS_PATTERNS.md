# 🎯 Dynamic Blocks - Quick Patterns Reference

**For**: Senior Developers  
**Date**: October 18, 2025

---

## 📋 3 Main Patterns

### Pattern 1️⃣: List Block (Collection)

**Use for**: Products, Posts, Team, Galleries

```typescript
export function MyListBlock({ block, isEditable, onUpdate, onDelete }) {
  const content = block.content as MyListContent;
  
  // 1. GraphQL Query - Skip in edit mode
  const { data, loading, error } = useQuery(GET_MY_ITEMS, {
    variables: { input: { limit: content.limit, filters: content.filters } },
    skip: isEditable, // ⚠️ Important: Don't fetch when editing
  });
  
  // 2. Edit Mode - Show preview
  if (isEditable) {
    return <EditPlaceholder config={content} />;
  }
  
  // 3. Loading/Error
  if (loading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  
  // 4. Render items
  const items = data?.myItems?.items || [];
  return <Grid items={items} />;
}
```

### Pattern 2️⃣: Detail Block (Single Item)

**Use for**: Product Detail, Post Detail, Profile

```typescript
export function MyDetailBlock({ block, isEditable, onUpdate, onDelete }) {
  const content = block.content as MyDetailContent;
  const params = useParams();
  
  // 1. Slug priority: config > URL
  const itemSlug = isEditable 
    ? content.itemSlug           // Edit: only config
    : (content.itemSlug || params.slug); // View: config or URL
  
  // 2. Query - Skip if no slug or editing
  const { data, loading, error } = useQuery(GET_ITEM_BY_SLUG, {
    variables: { slug: itemSlug },
    skip: isEditable || !itemSlug,
  });
  
  // 3. Edit Mode - Show warning if no slug
  if (isEditable) {
    return itemSlug 
      ? <EditPlaceholder slug={itemSlug} />
      : <Warning>⚠️ Configure slug in RightPanel</Warning>;
  }
  
  // 4. Render detail
  const item = data?.myItemBySlug;
  if (!item) return <NotFound />;
  return <DetailView item={item} />;
}
```

### Pattern 3️⃣: Dynamic Block (CMS)

**Use for**: Mixed content types, flexible sections

```typescript
export function DynamicBlock({ block, isEditable, onUpdate, onDelete }) {
  const content = block.content as DynamicContent;
  
  // 1. Select query based on content type
  const queryMap = {
    'products': GET_PRODUCTS,
    'posts': GET_POSTS,
    'testimonials': GET_TESTIMONIALS,
  };
  const query = queryMap[content.dataSource];
  
  // 2. Fetch data
  const { data, loading, error } = useQuery(query, {
    variables: content.variables,
    skip: isEditable,
  });
  
  // 3. Select renderer
  const rendererMap = {
    'products': ProductRenderer,
    'posts': PostRenderer,
    'testimonials': TestimonialRenderer,
  };
  const Renderer = rendererMap[content.dataSource];
  
  if (isEditable) return <EditPreview config={content} />;
  return <Renderer data={data} />;
}
```

---

## 🔧 Standard Props Interface

**Always use this**:

```typescript
export interface MyBlockProps {
  block: PageBlock;              // ✅ Contains content, style, etc.
  isEditable?: boolean;          // ✅ Edit vs View mode
  onUpdate: (content, style?) => void;  // ✅ Update handler
  onDelete: () => void;          // ✅ Delete handler
}

export function MyBlock({ block, isEditable = true, onUpdate, onDelete }: MyBlockProps) {
  const content = (block.content || {}) as MyBlockContent;
  // ...
}
```

**❌ Don't use**:
```typescript
// Wrong interface
export interface MyBlockProps {
  content: MyBlockContent;  // ❌ Should be block
  isEditing?: boolean;      // ❌ Should be isEditable
  onUpdate?: (content) => void; // ❌ Missing style param
}
```

---

## 🎨 GraphQL Query Pattern

### Step 1: Define Fragment

```typescript
export const MY_ITEM_FRAGMENT = gql`
  fragment MyItemFields on MyItemType {
    id
    name
    slug
    thumbnail
    createdAt
  }
`;
```

### Step 2: Define Queries

```typescript
// List query
export const GET_MY_ITEMS = gql`
  ${MY_ITEM_FRAGMENT}
  query GetMyItems($input: GetMyItemsInput) {
    myItems(input: $input) {
      items {
        ...MyItemFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

// Detail query
export const GET_MY_ITEM_BY_SLUG = gql`
  ${MY_ITEM_FRAGMENT}
  query GetMyItemBySlug($slug: String!) {
    myItemBySlug(slug: $slug) {
      ...MyItemFields
      description
      content
    }
  }
`;
```

### Step 3: Define TypeScript Types

```typescript
export interface MyItem {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  createdAt: string;
}

export interface MyItemsResponse {
  items: MyItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## 🏗️ Backend Pattern

### Step 1: Prisma Model

```prisma
model MyItem {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  thumbnail   String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([isActive])
}
```

### Step 2: GraphQL Type

```typescript
@ObjectType()
export class MyItemType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class MyItemsResponse {
  @Field(() => [MyItemType])
  items: MyItemType[];

  @Field()
  total: number;
}
```

### Step 3: Resolver

```typescript
@Resolver(() => MyItemType)
export class MyItemResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => MyItemsResponse)
  async myItems(@Args('input') input: GetMyItemsInput) {
    const { limit = 10, page = 1, filters = {} } = input;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.myItem.findMany({ where, skip, take: limit }),
      this.prisma.myItem.count({ where })
    ]);

    return { items, total, page, limit };
  }

  @Query(() => MyItemType, { nullable: true })
  async myItemBySlug(@Args('slug') slug: string) {
    return this.prisma.myItem.findUnique({
      where: { slug, isActive: true }
    });
  }
}
```

---

## ⚙️ Configuration Pattern

### RightPanel Fields

Add to `RightPanel.tsx`:

```typescript
{/* My Item Slug */}
{selectedBlock.content.myItemSlug !== undefined && (
  <div>
    <Label>Item Slug *</Label>
    <Input
      value={selectedBlock.content.myItemSlug || ''}
      onChange={(e) => handleContentChange({
        ...selectedBlock.content,
        myItemSlug: e.target.value
      })}
      placeholder="item-slug-here"
    />
  </div>
)}

{/* Limit */}
{selectedBlock.content.limit !== undefined && (
  <div>
    <Label>Limit</Label>
    <Input
      type="number"
      value={selectedBlock.content.limit || 12}
      onChange={(e) => handleContentChange({
        ...selectedBlock.content,
        limit: parseInt(e.target.value) || 12
      })}
      min="1"
      max="100"
    />
  </div>
)}
```

---

## 🔄 Registration Checklist

### ✅ Checklist for New Dynamic Block

- [ ] **Backend**
  - [ ] Prisma model with indexes
  - [ ] GraphQL type with @ObjectType
  - [ ] Resolver with queries
  - [ ] Add to BlockType enum
  - [ ] Create migration

- [ ] **Frontend GraphQL**
  - [ ] Create fragments
  - [ ] Create queries (list + detail)
  - [ ] Define TypeScript interfaces
  - [ ] Export everything

- [ ] **Frontend Block**
  - [ ] Create block component
  - [ ] Use standard props interface
  - [ ] Implement edit/view modes
  - [ ] Handle loading/error states
  - [ ] Add to BlockType enum

- [ ] **Integration**
  - [ ] Add to BlockRenderer switch
  - [ ] Add to ElementsLibrary
  - [ ] Add default content in PageBuilderProvider
  - [ ] Add config fields in RightPanel

- [ ] **Testing**
  - [ ] Test in edit mode
  - [ ] Test in view mode
  - [ ] Test GraphQL query
  - [ ] Test error handling
  - [ ] Test empty states

---

## 🎯 Code Templates

### Complete List Block Template

```typescript
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_ITEMS, MyItem } from '@/graphql/myitem.queries';
import { PageBlock } from '@/types/page-builder';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface MyListBlockContent {
  title?: string;
  limit?: number;
  filters?: Record<string, any>;
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  style?: any;
}

export interface MyListBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

export function MyListBlock({ 
  block, 
  isEditable = true, 
  onUpdate, 
  onDelete 
}: MyListBlockProps) {
  const content = (block.content || {}) as MyListBlockContent;
  const { title, limit = 12, filters = {}, layout = 'grid', columns = 3 } = content;

  const { data, loading, error } = useQuery(GET_MY_ITEMS, {
    variables: { input: { limit, filters } },
    skip: isEditable,
  });

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];

  // Edit mode
  if (isEditable) {
    return (
      <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold">My List Block</h3>
        <p className="text-sm text-gray-600">Displaying {limit} items</p>
      </div>
    );
  }

  // Error
  if (error && !isEditable) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  // Loading
  if (loading && !isEditable) {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  const items: MyItem[] = data?.myItems?.items || [];

  // Render
  return (
    <div className="container mx-auto py-8" style={content.style}>
      {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
      <div className={`grid ${gridCols} gap-6`}>
        {items.map(item => (
          <Card key={item.id}>
            <h3>{item.name}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Complete Detail Block Template

```typescript
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_MY_ITEM_BY_SLUG, MyItem } from '@/graphql/myitem.queries';
import { PageBlock } from '@/types/page-builder';

export interface MyDetailBlockContent {
  itemSlug?: string;
  showDescription?: boolean;
  layout?: 'default' | 'wide';
  style?: any;
}

export interface MyDetailBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

export function MyDetailBlock({ 
  block, 
  isEditable = true, 
  onUpdate, 
  onDelete 
}: MyDetailBlockProps) {
  const content = (block.content || {}) as MyDetailBlockContent;
  const { itemSlug: configSlug, showDescription = true } = content;

  const params = useParams();
  const urlSlug = params?.slug as string;
  const itemSlug = isEditable ? configSlug : (configSlug || urlSlug);

  const { data, loading, error } = useQuery(GET_MY_ITEM_BY_SLUG, {
    variables: { slug: itemSlug },
    skip: isEditable || !itemSlug,
  });

  // Edit mode
  if (isEditable) {
    return (
      <div className="p-6 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
        <h3 className="text-lg font-semibold">My Detail Block</h3>
        {itemSlug ? (
          <p>Displaying: <strong>{itemSlug}</strong></p>
        ) : (
          <p className="text-orange-600">⚠️ Configure slug in RightPanel</p>
        )}
      </div>
    );
  }

  // Loading
  if (loading) return <div>Loading...</div>;

  // Error
  if (error) return <div>Error: {error.message}</div>;

  // Not found
  const item = data?.myItemBySlug;
  if (!item) return <div>Item not found</div>;

  // Render
  return (
    <div className="container mx-auto py-8" style={content.style}>
      <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
      {showDescription && item.description && (
        <p className="text-lg text-gray-600">{item.description}</p>
      )}
    </div>
  );
}
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Always Fetching

```typescript
// Wrong
const { data } = useQuery(GET_ITEMS, { variables });

// Correct
const { data } = useQuery(GET_ITEMS, { 
  variables,
  skip: isEditable  // Don't fetch in edit mode
});
```

### ❌ Mistake 2: Wrong Props

```typescript
// Wrong
interface Props {
  content: MyContent;
  isEditing?: boolean;
}

// Correct
interface Props {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}
```

### ❌ Mistake 3: No Edit Placeholder

```typescript
// Wrong - No edit mode UI
if (isEditable) return null;

// Correct - Show preview
if (isEditable) {
  return <EditPlaceholder config={content} />;
}
```

### ❌ Mistake 4: Using URL Slug in Edit Mode

```typescript
// Wrong - Will use page slug in editor
const slug = configSlug || urlSlug;

// Correct - Only config in edit mode
const slug = isEditable ? configSlug : (configSlug || urlSlug);
```

---

## 📚 Quick Links

- **Full Guide**: `/DYNAMIC_DATASOURCE_GUIDE.md`
- **Product Example**: `/frontend/src/components/page-builder/blocks/ProductListBlock.tsx`
- **GraphQL Schema**: `http://localhost:14000/graphql`
- **Apollo DevTools**: Browser extension

---

**Remember**: 
1. Skip queries in edit mode
2. Use standard props interface
3. Handle loading/error/empty states
4. Test both edit and view modes

**Version**: 1.0.0  
**Date**: October 18, 2025
