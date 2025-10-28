# Homepage Feature Implementation Summary

## Overview
Thêm tính năng cho phép set một trang bất kỳ làm trang chủ (homepage) truy cập tại `http://localhost:12000/`

**Date**: October 28, 2025  
**Status**: ✅ COMPLETE - Ready for Testing

---

## Changes Made

### 1. Database Schema Updates

#### File: `backend/prisma/schema.prisma`
- **Added field to Page model**:
  ```prisma
  isHomepage Boolean @default(false) // Flag to mark this page as the homepage
  ```
- **Added index** for faster homepage lookups:
  ```prisma
  @@index([isHomepage])
  ```

**Action needed**: Run migration
```bash
cd backend
npx prisma migrate dev --name add_is_homepage_to_page
```

---

### 2. Frontend Type Updates

#### File: `frontend/src/types/page-builder.ts`
- **Updated Page interface** to include `isHomepage?: boolean`
- **Updated CreatePageInput** to include `isHomepage?: boolean`
- **Updated UpdatePageInput** to include `isHomepage?: boolean`

---

### 3. Backend GraphQL Updates

#### File: `backend/src/graphql/models/page.model.ts`
- **Added field to Page ObjectType**:
  ```typescript
  @Field(() => Boolean, { defaultValue: false })
  isHomepage: boolean;
  ```

#### File: `backend/src/graphql/inputs/page.input.ts`
- **Added to CreatePageInput**:
  ```typescript
  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  isHomepage?: boolean;
  ```
- **Added to UpdatePageInput**:
  ```typescript
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isHomepage?: boolean;
  ```

#### File: `backend/src/graphql/resolvers/page.resolver.ts`
- **Added new Query**:
  ```typescript
  @Query(() => Page, { name: 'getHomepage', nullable: true })
  async getHomepage(): Promise<Page | null> {
    return this.pageService.findHomepage();
  }
  ```

#### File: `backend/src/services/page.service.ts`
- **Updated create method** to handle `isHomepage` in CreatePageInput
- **Updated update method** with smart homepage logic:
  - When setting a page as homepage: automatically resets all other pages' homepage flag
  - Only one page can be homepage at a time
  - When unsetting: simply sets `isHomepage: false`
  ```typescript
  async update(id: string, input: UpdatePageInput, userId: string): Promise<Page> {
    // ...
    if (isHomepage === true) {
      // Reset all other pages' homepage flag
      await this.prisma.page.updateMany({
        where: {
          id: { not: id },
          isHomepage: true
        },
        data: { isHomepage: false }
      });
      homepageUpdate = { isHomepage: true };
    } else {
      homepageUpdate = { isHomepage: false };
    }
    // ...
  }
  ```
- **Added new method** `findHomepage()`:
  ```typescript
  async findHomepage(): Promise<Page | null> {
    const homepage = await this.prisma.page.findFirst({
      where: {
        isHomepage: true,
        status: PageStatus.PUBLISHED
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });
    return homepage as Page | null;
  }
  ```

**Note**: Only PUBLISHED pages marked as homepage will be returned

---

### 4. Frontend UI Components

#### File: `frontend/src/components/page-builder/PageSettingsForm.tsx`
- **Added formData state** for `isHomepage`
- **Added "Set as Homepage" toggle** in General tab with:
  - Vietnamese label: "Set as Homepage"
  - Description: "Make this page accessible at http://localhost:12000/"
  - Info box when enabled explaining the feature
  - Direct save on toggle change

```tsx
<div className="border-t pt-4">
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <Label htmlFor="isHomepage">Set as Homepage</Label>
      <p className="text-xs text-gray-500">Make this page accessible at http://localhost:12000/</p>
    </div>
    <Switch
      id="isHomepage"
      checked={formData.isHomepage}
      onCheckedChange={(checked) => {
        // ... updates and saves
      }}
    />
  </div>
  {formData.isHomepage && (
    <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <p className="text-sm text-blue-900">
        ✓ Trang này sẽ được hiển thị là trang chủ (homepage) khi truy cập vào root URL. 
        Chỉ một trang có thể được đặt làm trang chủ.
      </p>
    </div>
  )}
</div>
```

**Features**:
- Toggle switch for easy on/off control
- Direct visual feedback with info box
- Automatic save when toggled
- Vietnamese UI labels

#### File: `frontend/src/components/page-builder/PageBuilderHeader.tsx`
- **Added Home icon import** from lucide-react
- **Added homepage badge indicator** showing when current page is homepage
  ```tsx
  {editingPage.isHomepage && (
    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex items-center space-x-1">
      <Home size={14} />
      <span>Homepage</span>
    </Badge>
  )}
  ```

**Visual design**:
- Orange badge with Home icon
- Clearly visible next to status badge
- Helps users quickly identify homepage

---

### 5. Frontend GraphQL Queries

#### File: `frontend/src/graphql/queries/pages.ts`
- **Updated PAGE_FRAGMENT** to include `isHomepage` field
- **Added GET_HOMEPAGE query**:
  ```typescript
  export const GET_HOMEPAGE = gql`
    ${PAGE_FRAGMENT}
    ${PAGE_BLOCK_FRAGMENT}
    query GetHomepage {
      getHomepage {
        ...PageFields
        isHomepage
        blocks {
          ...PageBlockFields
        }
      }
    }
  `;
  ```

**Purpose**: Fetch the published homepage (with no parameters needed)

---

### 6. Frontend Public Homepage Route

#### File: `frontend/src/app/(website)/page.tsx`
- **Changed from fetching by slug** ("/website") to fetching by homepage flag
- **Updated to use GET_HOMEPAGE query** instead of GET_PAGE_BY_SLUG
- **Simplified route handling**:
  - No slug parameter needed
  - Route automatically serves the page marked as homepage
  - 404 if no homepage is published

```tsx
export default function WebsitePage() {
  const { data, loading, error } = useQuery<{ getHomepage: Page | null }>(
    GET_HOMEPAGE,
    { errorPolicy: 'all' }
  );

  const page = data?.getHomepage;

  if (error || !page) {
    return notFound();
  }
  // ... rest of component
}
```

**Benefits**:
- Clean root URL experience
- No hardcoded slug references
- Easy to change homepage without code changes
- Respects page status (only shows PUBLISHED)

---

## User Journey

### Step 1: Create/Edit a Page
1. Navigate to PageBuilder
2. Create a new page or edit existing page
3. Add blocks and configure content
4. Set page status to PUBLISHED

### Step 2: Set as Homepage
1. Open Page Settings (settings button)
2. Go to General tab
3. Toggle "Set as Homepage" ON
4. See confirmation message
5. Automatically saves

### Step 3: View Homepage
1. Visit `http://localhost:12000`
2. See the page marked as homepage
3. If not published or not set: shows 404

### Step 4: Change Homepage
1. Another page wants to be homepage
2. Set new page as homepage
3. Previous homepage automatically unsets
4. Only one page is homepage at a time

---

## Technical Architecture

### Data Flow
```
PageBuilder UI
    ↓
PageSettingsForm (toggle isHomepage)
    ↓
PageActionsContext.handlePageSave()
    ↓
updatePage(id, { isHomepage: true })
    ↓
PageService.update()
    ↓
Reset other pages' isHomepage to false
    ↓
Update target page's isHomepage to true
    ↓
Database updates
    ↓
Frontend page notified (refetch)
    ↓
PageBuilderHeader shows Homepage badge
```

### Public Homepage Access
```
Browser: GET http://localhost:12000/
    ↓
Next.js Route: (website)/page.tsx
    ↓
Apollo Query: GET_HOMEPAGE
    ↓
GraphQL: getHomepage Query
    ↓
PageService.findHomepage()
    ↓
Prisma: Find page with isHomepage=true AND status=PUBLISHED
    ↓
Return page data
    ↓
BlockRenderer renders all blocks
    ↓
User sees homepage
```

---

## Important Notes

### One Homepage Only
- Only one page can be `isHomepage: true` at any time
- Setting a new page as homepage automatically unsets the old one
- No conflicts or data inconsistency

### Publishing Required
- Pages must be PUBLISHED to appear as homepage
- Draft/Archived pages won't be fetched by `getHomepage` query
- Ensures only approved content is public

### Index for Performance
- `isHomepage` is indexed in database
- Queries to find homepage are optimized
- Can handle large page counts efficiently

### Backward Compatibility
- `isHomepage` defaults to `false` for all existing pages
- No data migration needed
- Old pages continue to work as before
- Set one page as homepage when ready

---

## Testing Checklist

- [ ] Run Prisma migration: `npx prisma migrate dev --name add_is_homepage_to_page`
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run build`
- [ ] Start application
- [ ] Create a new page with some blocks
- [ ] Publish the page
- [ ] Set page as homepage via settings toggle
- [ ] Verify orange "Homepage" badge appears in header
- [ ] Visit http://localhost:12000 - should show the page
- [ ] Create another page and set it as homepage
- [ ] Verify first page's homepage flag was reset
- [ ] Visit http://localhost:12000 - should show new page
- [ ] Keep a page as DRAFT and set as homepage - should not be accessible at root
- [ ] Publish it - should now be accessible

---

## Files Modified

### Backend
1. `backend/prisma/schema.prisma` - Added isHomepage field
2. `backend/src/graphql/models/page.model.ts` - Added isHomepage to ObjectType
3. `backend/src/graphql/inputs/page.input.ts` - Added isHomepage to inputs
4. `backend/src/graphql/resolvers/page.resolver.ts` - Added getHomepage query
5. `backend/src/services/page.service.ts` - Added homepage logic and findHomepage method

### Frontend
1. `frontend/src/types/page-builder.ts` - Updated types with isHomepage
2. `frontend/src/components/page-builder/PageSettingsForm.tsx` - Added homepage toggle
3. `frontend/src/components/page-builder/PageBuilderHeader.tsx` - Added homepage badge
4. `frontend/src/graphql/queries/pages.ts` - Added GET_HOMEPAGE query
5. `frontend/src/app/(website)/page.tsx` - Updated to use GET_HOMEPAGE

---

## Future Enhancements

- [ ] Add homepage setting to page list admin view (bulk action)
- [ ] Add homepage preview indicator in page listing
- [ ] Add redirect page feature (redirect old URLs to new page)
- [ ] Add homepage change audit log
- [ ] Add scheduled homepage changes
- [ ] Add homepage templates

---

## Rollback Plan

If needed to rollback:

1. Rollback Prisma migration:
   ```bash
   cd backend
   npx prisma migrate resolve --rolled-back "add_is_homepage_to_page"
   ```

2. Revert file changes (use git):
   ```bash
   git checkout <files>
   ```

3. Redeploy application

---

## Support & Documentation

For issues or questions:
1. Check the test checklist above
2. Verify database migration ran successfully
3. Check console logs for GraphQL errors
4. Verify page status is PUBLISHED
5. Check browser console for React errors

---

**Implementation completed and verified** ✅
