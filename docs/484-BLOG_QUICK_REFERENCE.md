# Website Blog System - Quick Reference

## What Was Created

✅ **Blog Listing Page** - `/website/baiviet`  
✅ **Blog Detail Page** - `/website/baiviet/[slug]`  
✅ **4 React Components** - BlogListPage, BlogCard, BlogDetail, RelatedBlogs  
✅ **GraphQL Queries** - 6 blog-related queries  
✅ **TypeScript Types** - Blog, BlogCategory, BlogTag interfaces  

## File Structure

```
frontend/src/
├── app/website/baiviet/
│   ├── page.tsx .......................... Blog listing
│   └── [slug]/page.tsx .................. Blog detail
├── components/blog/
│   ├── BlogListPage.tsx ................. Main listing
│   ├── BlogCard.tsx ..................... Card component
│   ├── BlogDetail.tsx ................... Detail view
│   ├── RelatedBlogs.tsx ................. Related items
│   └── index.ts ......................... Exports
└── graphql/
    └── blog.queries.ts .................. GraphQL & types
```

## Pages

### Blog Listing (`/website/baiviet`)
- 3-column grid (responsive)
- Search input
- Category filter dropdown
- Sort options (latest, popular, featured)
- Pagination controls
- Featured badges
- Loading skeletons

### Blog Detail (`/website/baiviet/[slug]`)
- Full article content
- Hero banner/image
- Author info
- Metadata (date, views, author)
- Social sharing button
- Save/favorite button
- Tags section
- Related blogs (3 articles)
- Breadcrumb navigation

## Components

| Component | Purpose | Props |
|-----------|---------|-------|
| BlogListPage | Main listing page | None |
| BlogCard | Card for blog preview | blog, className, showCategory, showTags |
| BlogDetail | Full article view | blog, onShare, onToggleFavorite, className |
| RelatedBlogs | Related articles widget | categoryId, excludeBlogId, limit, title, className |

## GraphQL Queries

```
GET_BLOGS ...................... Paginated blog list with filters
GET_BLOG_BY_SLUG ............... Single blog by slug
GET_FEATURED_BLOGS ............. Featured blogs for homepage
GET_BLOGS_BY_CATEGORY .......... Category-filtered blogs
GET_RELATED_BLOGS .............. Related blogs from same category
GET_BLOG_CATEGORIES ............ All blog categories
```

## Key Features

✅ Search & filter  
✅ Category filtering  
✅ Multiple sort options  
✅ Pagination  
✅ Featured articles  
✅ Social sharing  
✅ Save/favorite  
✅ Related articles  
✅ Full content rendering  
✅ Author information  
✅ Responsive design  
✅ Loading states  
✅ Error handling  

## Database Schema Needed

### Blog Table
```sql
- id (UUID, PK)
- title (String)
- slug (String, UNIQUE)
- content (TEXT)
- shortDescription (String)
- author (String)
- thumbnailUrl (String)
- bannerUrl (String)
- viewCount (Integer)
- publishedAt (DateTime)
- updatedAt (DateTime)
- categoryId (UUID, FK)
- isFeatured (Boolean)
- isPublished (Boolean)
```

### BlogCategory Table
```sql
- id (UUID, PK)
- name (String)
- slug (String, UNIQUE)
```

### BlogTag Table
```sql
- id (UUID, PK)
- name (String)
- slug (String, UNIQUE)
```

## Usage Examples

### Display Blog Listing
```tsx
import { BlogListPage } from '@/components/blog';

export default function BlogPage() {
  return <BlogListPage />;
}
```

### Show Blog Detail
```tsx
import { BlogDetail } from '@/components/blog';
import { useQuery } from '@apollo/client';
import { GET_BLOG_BY_SLUG } from '@/graphql/blog.queries';

const { data } = useQuery(GET_BLOG_BY_SLUG, {
  variables: { slug }
});

return <BlogDetail blog={data.blogBySlug} />;
```

### Display Blog Cards
```tsx
import { BlogCard } from '@/components/blog';

blogs.map(blog => (
  <Link href={`/website/baiviet/${blog.slug}`} key={blog.id}>
    <BlogCard blog={blog} showCategory={true} />
  </Link>
))
```

### Show Related Articles
```tsx
import { RelatedBlogs } from '@/components/blog';

<RelatedBlogs
  categoryId={blog.category.id}
  excludeBlogId={blog.id}
  limit={3}
/>
```

## Styling

- TailwindCSS v4
- Mobile-first responsive design
- Blue (#2563eb) primary color
- Consistent 8px spacing
- Hover effects for interactivity
- Skeleton loading states

## TypeScript Types

```typescript
interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  author: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  viewCount: number;
  publishedAt: string;
  updatedAt: string;
  category: BlogCategory;
  tags: BlogTag[];
  isFeatured: boolean;
  isPublished: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}
```

## Comparison with Product System

| Feature | Product System | Blog System |
|---------|---|---|
| Listing | ✅ ProductShopPage | ✅ BlogListPage |
| Detail | ✅ ProductDetail | ✅ BlogDetail |
| Cards | ✅ ProductCard | ✅ BlogCard |
| Related | ✅ RelatedProducts | ✅ RelatedBlogs |
| Search | ✅ Yes | ✅ Yes |
| Filter | ✅ Category | ✅ Category |
| Sort | ✅ Price/New | ✅ Date/Popular |

## Next Steps

1. **Backend Setup**
   - Create Blog models in database
   - Implement GraphQL resolvers
   - Setup database migrations

2. **Admin Interface**
   - Blog management CRUD
   - Rich text editor
   - Featured image upload
   - Category/tag management

3. **Enhancements**
   - Comments system
   - Article ratings
   - Newsletter signup
   - Blog sitemap

## Status

✅ **Frontend**: Complete  
✅ **Components**: 4 components  
✅ **Pages**: 2 pages  
✅ **GraphQL**: 6 queries defined  
✅ **TypeScript**: Fully typed  
✅ **Responsive**: Yes  
⏳ **Backend**: Ready for implementation  

---

See `BLOG_SYSTEM_IMPLEMENTATION.md` for complete details.
