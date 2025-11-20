# 🐛 FIX: Blog Detail 404 Error - Menu Redirect Issue

## ✅ Vấn Đề Đã Fix

**Bug:** Menu "Về Chúng Tôi" (`/ve-chung-toi`) cấu hình redirect đến bài viết "Cung cấp rau cho nhà hàng" nhưng frontend trả về lỗi **404 Not Found**.

**Root Cause:** Frontend code sử dụng **sai tên field** khi đọc data từ GraphQL query response.

## 🔍 Chi Tiết Lỗi

### GraphQL Query Definition
```typescript
// frontend/src/graphql/blog.queries.ts
export const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    blogBySlug(slug: $slug) {  // ← Resolver name: "blogBySlug"
      id
      title
      slug
      content
      ...
    }
  }
`;
```

### Frontend Code (BEFORE - WRONG ❌)
```typescript
// frontend/src/app/(website)/bai-viet/[slug]/page.tsx
const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
  variables: { slug },
  skip: !slug,
});

const blog = data?.getBlogBySlug;  // ❌ WRONG - Field không tồn tại!
```

**Vấn đề:**
- GraphQL query định nghĩa resolver `blogBySlug`
- Nhưng code đọc `data.getBlogBySlug` → **undefined**
- Component render 404 vì `blog` là `undefined`

### Frontend Code (AFTER - FIXED ✅)
```typescript
// frontend/src/app/(website)/bai-viet/[slug]/page.tsx
const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
  variables: { slug },
  skip: !slug,
});

const blog = data?.blogBySlug;  // ✅ CORRECT - Khớp với resolver name!
```

## 📝 File Đã Sửa

### `/frontend/src/app/(website)/bai-viet/[slug]/page.tsx`

**Line 36:** Đổi từ `data?.getBlogBySlug` → `data?.blogBySlug`

```diff
  // Fetch blog post
  const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

- const blog = data?.getBlogBySlug;
+ const blog = data?.blogBySlug;
```

## ✅ Verification

### Database Check (Confirmed ✓)
```bash
bun backend/scripts/check-blog-slug.ts
```

**Result:**
```
Blog Post: "Cung cấp rau cho nhà hàng"
- Slug: cung-cap-rau-cho-nha-hang
- Status: PUBLISHED
- Visibility: PUBLIC

Menu: "ve-chung-toi"
- Link Type: BLOG_DETAIL
- Blog Post ID: 393db28d-69ac-4483-bc17-4650ab8e949c
- Custom Data: { blogPostSlug: "cung-cap-rau-cho-nha-hang" }
- Linked blog: VERIFIED - EXISTS and PUBLISHED ✅
```

### Backend Resolver Check (Confirmed ✓)
```typescript
// backend/src/graphql/resolvers/blog.resolver.ts
@Query(() => BlogType, { name: 'blogBySlug' })  // ← Resolver name
async getBlogBySlug(@Args('slug') slug: string) {
  return this.blogService.getBlogBySlug(slug);
}
```

### Backend Service Check (Confirmed ✓)
```typescript
// backend/src/services/blog.service.ts
async getBlogBySlug(slug: string) {
  const blog = await this.prisma.blogPost.findUnique({ 
    where: { slug }, 
    include: { category: true, author: {...}, tags: {...} } 
  });
  if (!blog) throw new NotFoundException(`Blog post with slug ${slug} not found`);
  // ... increment viewCount ...
  return { ...blog, tags: blog.tags.map(t => t.tag) };
}
```

**Test Query Result:** ✅ Blog found successfully

## 🚀 Deployment Steps

### 1. Build Frontend
```bash
cd /mnt/chikiet/kataoffical/shoprausach/frontend
npm run build
```

### 2. Restart Frontend (Development)
```bash
# Stop current process
pkill -f "next dev" || pkill -f "next start"

# Start development
cd /mnt/chikiet/kataoffical/shoprausach/frontend
npm run dev
```

### 3. Restart Frontend (Production - Server)
```bash
# Method 1: PM2
pm2 restart frontend

# Method 2: Direct restart
pkill -f "next start"
cd /path/to/project/frontend
npm run build
npm start
```

### 4. Test URLs

**Menu URL:**
```
http://yourdomain.com/ve-chung-toi
```
**Expected:** Redirect to blog detail page

**Blog Detail URL (Direct):**
```
http://yourdomain.com/bai-viet/cung-cap-rau-cho-nha-hang
```
**Expected:** Display blog post "Cung cấp rau cho nhà hàng"

## 🔗 Related Fixes (Session)

Trong session này đã fix **6 bugs**:

1. ✅ **Routes Standardization** - Cập nhật menu routes theo Vietnamese SEO URLs
2. ✅ **GraphQL customData Error** - Fix handleDynamicLinkChange destructuring
3. ✅ **GraphQL Schema Missing Fields** - Add customData/metadata to MenuResponseDto
4. ✅ **Menu Selector Bug** - Remove onChange wrapper in DynamicMenuLinkSelector
5. ✅ **Blog Detail 404 Error** - Fix data field name mismatch (MAIN FIX)
6. ✅ **setState-in-render Error** - Move router.push to useEffect hook

**Documents:**
- This file: Blog 404 error fix
- `/FIX_SETSTATE_IN_RENDER_ERROR.md`: React warning fix

## 📊 Impact

**Before:**
- Menu /ve-chung-toi → Redirect → 404 Error ❌
- Direct access /bai-viet/cung-cap-rau-cho-nha-hang → 404 Error ❌

**After:**
- Menu /ve-chung-toi → Redirect → Blog detail page ✅
- Direct access /bai-viet/cung-cap-rau-cho-nha-hang → Blog detail page ✅

## 📌 Notes

- **One-line fix** nhưng impact lớn - tất cả blog detail pages đều bị 404
- Lỗi này xuất hiện khi có mismatch giữa GraphQL query name và code đọc data
- **Lesson:** Always check GraphQL query field names match với code

## 🛠️ Testing Checklist

- [x] Database verification passed
- [x] Backend resolver confirmed
- [x] Backend service test passed
- [x] Frontend fix applied
- [x] Build successful
- [ ] Production deployment (pending user action)
- [ ] End-to-end test on server (pending user action)

---

**Fix Date:** November 6, 2025  
**Fixed By:** GitHub Copilot  
**Severity:** Critical (404 on all blog detail pages)  
**Status:** ✅ Fixed - Awaiting Production Deployment
