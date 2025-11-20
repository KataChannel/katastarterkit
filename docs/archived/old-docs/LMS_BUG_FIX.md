# LMS GraphQL Bug Fixes - Course Query Issues

## Bug #1: Cannot Query Field 'instructor'
**Lỗi**: `Cannot query field 'instructor' on type 'Course'`

### Nguyên nhân
- **Frontend query** yêu cầu nested `instructor` object với các field: `id, username, firstName, lastName, avatar`
- **Backend GraphQL schema** chỉ expose `instructorId` (String), không expose `instructor` relation
- **Prisma schema** có đầy đủ relation: `instructor User @relation("InstructorCourses")`
- **Service layer** đã include instructor trong query nhưng GraphQL entity không expose field này

### Giải pháp
**File**: `backend/src/lms/courses/entities/course.entity.ts`

```typescript
// Import User model
import { User } from '../../../graphql/models/user.model';
import { CourseCategory } from '../../categories/entities/course-category.entity';

@ObjectType()
export class Course {
  // ... các field khác ...
  
  @Field(() => String)
  instructorId: string;

  // Relations - Thêm field để expose qua GraphQL
  @Field(() => User, { nullable: true })
  instructor?: User;

  @Field(() => CourseCategory, { nullable: true })
  category?: CourseCategory;
}
```

---

## Bug #2: Expected Iterable for Query.courses
**Lỗi**: `Expected Iterable, but did not find one for field "Query.courses"`

### Nguyên nhân
- **GraphQL resolver** khai báo return type là `[Course]` (array)
- **Service method** trả về object pagination: `{ data, total, page, limit, totalPages }`
- **Type mismatch**: GraphQL expect array nhưng nhận được object

### Giải pháp

#### 1. Tạo PaginatedCourses Entity
**File**: `backend/src/lms/courses/entities/paginated-courses.entity.ts`

```typescript
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Course } from './course.entity';

@ObjectType()
export class PaginatedCourses {
  @Field(() => [Course])
  data: Course[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
```

#### 2. Update Resolver Return Type
**File**: `backend/src/lms/courses/courses.resolver.ts`

```typescript
import { PaginatedCourses } from './entities/paginated-courses.entity';

@Resolver(() => Course)
export class CoursesResolver {
  @Query(() => PaginatedCourses, { name: 'courses' })  // ✅ Thay đổi từ [Course]
  findAll(@Args('filters', { nullable: true }) filters?: CourseFiltersInput) {
    return this.coursesService.findAll(filters || new CourseFiltersInput());
  }
}
```

#### 3. Update Frontend Query
**File**: `frontend/src/graphql/lms/courses.graphql.ts`

```typescript
export const GET_COURSES = gql`
  query GetCourses($filters: CourseFiltersInput) {
    courses(filters: $filters) {
      data {                    # ✅ Thêm wrapper 'data'
        ...CourseBasic
        categoryId
        instructor {
          id
          username
          firstName
          lastName
          avatar
        }
      }
      total                     # ✅ Thêm pagination meta
      page
      limit
      totalPages
    }
  }
  ${COURSE_BASIC_FRAGMENT}
`;
```

#### 4. Update Component Data Access
**File**: `frontend/src/app/lms/courses/page.tsx`

```typescript
const { data, loading, error } = useQuery(GET_COURSES, {
  variables: {
    filters: {
      search: searchTerm || undefined,
      categoryId: selectedCategory || undefined,
      level: selectedLevel || undefined,
      status: 'PUBLISHED',
      page: 1,                  # ✅ Sử dụng page thay vì skip
      limit: 100,               # ✅ Sử dụng limit thay vì take
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  },
});

const courses = data?.courses?.data || [];  # ✅ Access data.courses.data
const pagination = {
  total: data?.courses?.total || 0,
  page: data?.courses?.page || 1,
  limit: data?.courses?.limit || 100,
  totalPages: data?.courses?.totalPages || 0,
};
```

---

## Bug #3: Cannot Return Null for Non-Nullable Field Course.rating
**Lỗi**: `Cannot return null for non-nullable field Course.rating`

### Nguyên nhân
- **GraphQL entity** có field `rating` (non-nullable) nhưng **Prisma schema không có field này**
- Prisma chỉ có `avgRating`, `reviewCount`, `enrollmentCount` với `@default(0)`
- Field `rating` là duplicate không cần thiết (đã có `avgRating`)
- Các field stats có thể null cho courses mới chưa có enrollment/reviews

### Giải pháp

#### 1. Xóa Field `rating` Khỏi Course Entity
**File**: `backend/src/lms/courses/entities/course.entity.ts`

```typescript
@ObjectType()
export class Course {
  // ... các field khác ...

  @Field(() => Int, { defaultValue: 0 })
  enrollmentCount: number;

  @Field(() => Float, { defaultValue: 0 })  // ✅ Chỉ giữ avgRating
  avgRating: number;

  @Field(() => Int, { defaultValue: 0 })
  reviewCount: number;

  // ❌ Xóa field rating (duplicate với avgRating)
}
```

#### 2. Update Frontend GraphQL Query
**File**: `frontend/src/graphql/lms/courses.graphql.ts`

```typescript
export const COURSE_BASIC_FRAGMENT = gql`
  fragment CourseBasic on Course {
    id
    title
    slug
    description
    thumbnail
    price
    level
    status
    duration
    avgRating        # ✅ Chỉ query avgRating
    enrollmentCount
    reviewCount
    createdAt
    publishedAt
  }
`;
```

#### 3. Update Components
**Files cần fix**: 
- `frontend/src/components/lms/CourseCard.tsx`
- `frontend/src/app/lms/instructor/dashboard/page.tsx`
- `frontend/src/app/lms/courses/[slug]/page.tsx`

```typescript
// ❌ BEFORE
<span>{course.rating.toFixed(1)}</span>

// ✅ AFTER
<span>{course.avgRating.toFixed(1)}</span>
```

#### 4. Prisma Schema (Already Correct)
**File**: `backend/prisma/schema.prisma`

```prisma
model Course {
  // Stats với default values
  avgRating       Float @default(0) @db.DoublePrecision
  reviewCount     Int   @default(0)
  enrollmentCount Int   @default(0)
  viewCount       Int   @default(0)
  
  // ❌ KHÔNG có field "rating"
}
```

---

## Kết Quả
✅ **Bug #1**: Frontend query `GetCourses` hoạt động với instructor relation
✅ **Bug #2**: GraphQL query trả về pagination object thay vì array
✅ **Bug #3**: Xóa field `rating` duplicate, chỉ dùng `avgRating` với defaultValue
✅ Instructor data đầy đủ: id, username, firstName, lastName, avatar
✅ Pagination metadata: total, page, limit, totalPages
✅ Component access data qua `data.courses.data`
✅ Tất cả stats fields có defaultValue = 0 cho courses mới

## Kiểm Tra
Query GraphQL sau fix:

```graphql
query GetCourses {
  courses(filters: { 
    page: 1, 
    limit: 10,
    status: PUBLISHED,
    sortBy: "createdAt",
    sortOrder: "desc"
  }) {
    data {
      id
      title
      instructor {
        id
        username
        firstName
        lastName
        avatar
      }
    }
    total
    page
    limit
    totalPages
  }
}
```

## Lưu Ý Quan Trọng
1. **NestJS Code-First GraphQL**: Prisma relations KHÔNG tự động thành GraphQL field → Cần `@Field()` decorator
2. **Type Matching**: Resolver return type PHẢI match với service response structure
3. **Pagination Pattern**: Sử dụng wrapper object với `data` array + metadata thay vì return trực tiếp array
4. **Frontend Update**: Khi thay đổi GraphQL schema, phải update cả query GraphQL và component data access
