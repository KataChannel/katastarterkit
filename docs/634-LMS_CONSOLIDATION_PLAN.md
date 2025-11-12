# LMS Consolidation Plan (Tổng Hợp Hệ Thống LMS)

**Ngày:** November 10, 2025 | **Status:** 📋 Planning Phase

## 📊 Current LMS Structure Analysis

### Existing Routes
```
/lms                          → Main LMS hub
├── /admin                    → Admin dashboard
├── /instructor               → Instructor dashboard (English name)
├── /student                  → Student dashboard
├── /courses                  → Course listing
├── /learn/[slug]             → Course learning interface
├── /my-learning              → My learning progress
├── /my-certificates          → My certificates
└── /certificates/verify      → Certificate verification
```

### Issues Identified
1. **Inconsistent naming**: `/lms/instructor` (English) should be `/lms/giangvien` (Vietnamese)
2. **Routing conflicts**: `instructor/page.tsx` currently redirects to `/lms/giangvien` but directory doesn't exist
3. **Broken links**: Multiple pages linking to non-existent `/lms/giangvien/courses/*` routes
4. **Incomplete migration**: Previous attempt to consolidate routing left halfway

### Scope of Work
- [ ] **Phase 1:** Rename `/lms/instructor` → `/lms/giangvien` (complete migration)
- [ ] **Phase 2:** Update all internal links across LMS ecosystem
- [ ] **Phase 3:** Consolidate layout structure (sidebar, navigation)
- [ ] **Phase 4:** Standardize component patterns across modules
- [ ] **Phase 5:** Verify routing and fix broken links

---

## 🔄 Phase 1: Directory Structure Migration

### Current Instructor Directory Contents
```
/lms/instructor/
├── layout.tsx             ← Sidebar + navigation
├── page.tsx               ← Dashboard (redirects to giangvien)
└── /courses/
    ├── /create/
    │   └── page.tsx       → Create new course
    ├── /[id]/
    │   ├── /edit/
    │   │   └── page.tsx   → Edit course
    │   ├── /manage/
    │   │   └── page.tsx   → Manage modules/lessons
    │   ├── /lessons/
    │   │   └── page.tsx   → Manage lessons
    │   └── /quizzes/
    │       └── page.tsx   → Manage quizzes
```

### Target Migration
```
/lms/giangvien/            ← Renamed from instructor
├── layout.tsx             ← Updated imports
├── page.tsx               ← Dashboard (refactored with mobile-first)
└── /courses/
    ├── /create/
    │   └── page.tsx       ← Updated paths
    ├── /[id]/
    │   ├── /edit/
    │   │   └── page.tsx   ← Updated paths
    │   ├── /manage/
    │   │   └── page.tsx   ← Updated paths
    │   ├── /lessons/
    │   │   └── page.tsx   ← Updated paths
    │   └── /quizzes/
    │       └── page.tsx   ← Updated paths
```

### Actions Required
1. ✅ Copy entire `/lms/instructor` → `/lms/giangvien`
2. ✅ Update all internal links `/lms/instructor/*` → `/lms/giangvien/*`
3. ✅ Update `ProtectedRoute` role check (if any)
4. ✅ Keep `/lms/instructor` for backwards compatibility (redirects)

---

## 🔗 Phase 2: Link Updates Required

### Files to Update
Location: `/lms/**/*.tsx` files containing `/lms/instructor` links

**Affected Files to Search:**
- [ ] `/lms/layout.tsx` - Main LMS layout (if has instructor links)
- [ ] `/lms/page.tsx` - LMS home page
- [ ] `/lms/admin/**/*.tsx` - Admin pages
- [ ] `/lms/courses/**/*.tsx` - Course pages
- [ ] `/lms/student/**/*.tsx` - Student pages (if any)
- [ ] Any navigation components

### Links to Update
```typescript
// OLD → NEW
'/lms/instructor' → '/lms/giangvien'
'/lms/instructor/courses' → '/lms/giangvien/courses'
'/lms/instructor/courses/create' → '/lms/giangvien/courses/create'
'/lms/instructor/courses/[id]/manage' → '/lms/giangvien/courses/[id]/manage'
'/lms/instructor/courses/[id]/lessons' → '/lms/giangvien/courses/[id]/lessons'
'/lms/instructor/courses/[id]/quizzes' → '/lms/giangvien/courses/[id]/quizzes'
'/lms/instructor/courses/[id]/edit' → '/lms/giangvien/courses/[id]/edit'
```

---

## 🎨 Phase 3: Layout & Navigation Consolidation

### Current Layout Pattern (Instructor)
```
├── ProtectedRoute (role: GIANGVIEN)
├── Desktop Sidebar
│   └── 6 menu items
└── Mobile Sheet Menu
    └── Same 6 items
```

### Target Pattern (Consolidated)
- ✅ Keep same structure (already solid)
- ✅ Update route paths in menu items
- ✅ Ensure admin link detection works
- ✅ Verify mobile responsiveness

### Menu Items to Verify
```typescript
const menuItems = [
  { title: 'Tổng quan', icon: LayoutDashboard, href: '/lms/giangvien' },
  { title: 'Khóa học của tôi', icon: BookOpen, href: '/lms/giangvien/courses' },
  // ... (verify all paths use /lms/giangvien)
];
```

---

## 🏗️ Phase 4: Component Pattern Consolidation

### Admin Dashboard Pattern
- Header with breadcrumbs
- Sidebar with navigation
- Main content area
- Card-based layouts
- shadcn UI components

### Instructor Dashboard Pattern (After Refactor)
- ✅ Header with action buttons
- ✅ Sidebar with navigation
- ✅ Main content area
- ✅ Card-based stats grid
- ✅ Responsive table

### Student Dashboard Pattern
- Check if follows same pattern
- Apply mobile-first responsive if needed
- Use shadcn UI components

### Standardization Checklist
- [ ] All use `Card`, `Button`, `Badge` from shadcn/ui
- [ ] All use Lucide icons consistently
- [ ] All implement mobile-first responsive
- [ ] All have proper loading states
- [ ] All have error handling
- [ ] All have Vietnamese UI

---

## ✅ Phase 5: Verification & Testing

### Routing Tests
- [ ] `/lms/giangvien` → Dashboard loads
- [ ] `/lms/giangvien/courses` → Courses list loads
- [ ] `/lms/giangvien/courses/create` → Create form loads
- [ ] `/lms/giangvien/courses/[id]/manage` → Manage page loads
- [ ] All action buttons work
- [ ] Internal links don't break

### TypeScript Checks
- [ ] 0 compilation errors
- [ ] 0 console warnings
- [ ] Proper imports throughout

### Mobile Responsiveness
- [ ] Works on 320px (mobile)
- [ ] Works on 768px (tablet)
- [ ] Works on 1024px (desktop)
- [ ] Works on 1280px (large desktop)

### Browser Compatibility
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

---

## 📈 Summary Stats

| Metric | Count |
|--------|-------|
| Directories to migrate | 1 (/lms/instructor → /lms/giangvien) |
| Files to copy | 11+ (layout, page, courses/*) |
| Links to update | 20+ across LMS |
| Components to standardize | 5+ (Admin, Instructor, Student, Courses, Learning) |
| TypeScript files affected | 30+ |

---

## 🚀 Expected Outcomes

✅ **Unified LMS Structure:**
- Consistent Vietnamese naming
- Clear role-based routing (ADMIN → /lms/admin, GIANGVIEN → /lms/giangvien)
- Predictable URL patterns

✅ **Improved Developer Experience:**
- Easier to navigate codebase
- Clear separation of concerns
- Reusable layout components

✅ **Better User Experience:**
- Consistent interface across modules
- Mobile-first responsive design
- Faster loading times

✅ **Future Maintainability:**
- Clear patterns for new features
- Easy to extend
- Reduced technical debt

---

## 📝 Next Steps

1. **Execute Phase 1:** Copy `/lms/instructor` → `/lms/giangvien`
2. **Execute Phase 2:** Update all links across LMS
3. **Execute Phase 3:** Verify layouts are consistent
4. **Execute Phase 4:** Apply component standards
5. **Execute Phase 5:** Run full test suite
6. **Deploy:** Merge to production

---

**Last Updated:** November 10, 2025
**Status:** 📋 Ready for implementation
