# LMS Role-Based Access Control (RBAC)

## Overview

The LMS system implements role-based access control to protect instructor and admin routes.

## Backend Implementation

### Guards & Decorators

**Location:** `/backend/src/common/`

1. **RolesGuard** (`guards/roles.guard.ts`)
   - Validates user has required role(s)
   - Works with GraphQL context
   - Throws ForbiddenException if unauthorized

2. **Roles Decorator** (`decorators/roles.decorator.ts`)
   - Metadata decorator to specify required roles
   - Usage: `@Roles(UserRoleType.ADMIN)`

3. **CurrentUser Decorator** (`decorators/current-user.decorator.ts`)
   - Extracts user from GraphQL context
   - Usage: `@CurrentUser() user: any`

### Protected Resolvers

#### Course Mutations (ADMIN only)
```typescript
@Mutation(() => Course, { name: 'createCourse' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN)
createCourse(@CurrentUser() user: any, @Args('createCourseInput') input: CreateCourseInput)
```

**Protected mutations:**
- `createCourse` - Create new course
- `updateCourse` - Update course details
- `publishCourse` - Publish draft course
- `archiveCourse` - Archive published course
- `deleteCourse` - Delete course
- `myCourses` - Get instructor's courses

#### Category Mutations (ADMIN only)
```typescript
@Mutation(() => CourseCategory, { name: 'createCourseCategory' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN)
createCategory(@Args('createCourseCategoryInput') input: CreateCourseCategoryInput)
```

**Protected mutations:**
- `createCourseCategory` - Create category
- `updateCourseCategory` - Update category
- `deleteCourseCategory` - Delete category

### Public Queries
These queries are accessible without authentication:
- `courses` - List all published courses
- `course` - Get course by ID
- `courseBySlug` - Get course by slug
- `courseCategories` - List all categories
- `courseCategoryTree` - Get category hierarchy

### User Queries
These require authentication but no specific role:
- `myEnrollments` - Get user's enrolled courses
- `enrollCourse` - Enroll in a course
- `dropCourse` - Drop from a course

## Frontend Implementation

### Protected Routes

**Location:** `/frontend/src/app/(lms)/instructor/`

1. **ProtectedRoute Component** (`/components/auth/ProtectedRoute.tsx`)
   - Client-side route protection
   - Checks JWT token in localStorage
   - Validates user role from token payload
   - Redirects unauthorized users

2. **Instructor Layout** (`/app/(lms)/instructor/layout.tsx`)
   - Wraps all instructor routes
   - Requires `ADMIN` role
   - Redirects non-admins to courses page

### Protected Pages

#### Instructor Dashboard
**URL:** `/instructor/dashboard`
**Role Required:** ADMIN

**Features:**
- View all instructor's courses
- Course statistics (students, revenue, ratings)
- Quick actions (edit, view, archive)
- Create new course button

## Testing RBAC

### Test Accounts

**Instructors (ADMIN role):**
```
Email: john.instructor@katacore.com
Username: john_instructor
Password: password123
```

```
Email: jane.instructor@katacore.com
Username: jane_instructor
Password: password123
```

**Student (USER role):**
```
Email: alice.student@katacore.com
Username: alice_student
Password: password123
```

### Test Scenarios

1. **Unauthorized Access**
   - Login as `alice_student`
   - Try to access `/instructor/dashboard`
   - Should redirect to `/courses?error=unauthorized`
   - Try mutation `createCourse` in GraphQL playground
   - Should return `ForbiddenException`

2. **Authorized Access**
   - Login as `john_instructor`
   - Access `/instructor/dashboard`
   - Should show instructor dashboard
   - Execute mutation `createCourse` in GraphQL playground
   - Should succeed

3. **Token Validation**
   - Remove `accessToken` from localStorage
   - Try to access `/instructor/dashboard`
   - Should redirect to `/login?redirect=/instructor/dashboard`

## Error Handling

### Backend Errors
```graphql
{
  "errors": [
    {
      "message": "Access denied. Required roles: ADMIN. Your role: USER",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Frontend Errors
- **No token:** Redirect to `/login?redirect={currentPath}`
- **Invalid role:** Redirect to `/courses?error=unauthorized`
- **Token expired:** Redirect to `/login`

## Security Considerations

1. **JWT Validation:** Backend validates JWT on every request
2. **Role Checking:** RolesGuard checks role from verified JWT payload
3. **Client-side Protection:** ProtectedRoute provides UX (not security)
4. **Server Authority:** All security enforced on backend
5. **Token Storage:** Stored in localStorage (consider httpOnly cookies for production)

## Future Enhancements

- [ ] Add `INSTRUCTOR` role separate from `ADMIN`
- [ ] Implement course ownership validation
- [ ] Add permission-based access (beyond roles)
- [ ] Implement refresh token rotation
- [ ] Add audit logging for admin actions
- [ ] Create admin-only analytics dashboard
- [ ] Add bulk operations for instructors
