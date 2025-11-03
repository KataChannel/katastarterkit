# QUẢN LÝ HỌC VIÊN LMS

## 📁 FILE MỚI
- `/frontend/src/app/lms/admin/students/page.tsx` (308 dòng)

## ✅ TÍNH NĂNG HOÀN THÀNH

### 1. **Hiển thị danh sách học viên**
- Grid responsive: 1 → 2 → 3 → 4 columns (Mobile → Desktop)
- Card hiển thị: Avatar, Tên, Username, Email, Phone
- Stats: Số khóa học, Chứng chỉ, Đánh giá
- Timeline: Ngày tham gia, Lần hoạt động cuối
- Loading, Error, Empty states

### 2. **Tìm kiếm học viên**
- Search real-time theo: username, email, firstName, lastName
- Icon Search trong input

### 3. **Lọc theo trạng thái**
- Tất cả
- Hoạt động (isActive = true)
- Không hoạt động (isActive = false)

### 4. **Badges trạng thái**
- Hoạt động / Tạm khóa
- Đã xác thực (nếu isVerified = true)

### 5. **Avatar hiển thị**
- Nếu có avatar: Hiển thị ảnh
- Nếu không: Icon UserCircle2 trong background màu

## 🎨 UI/UX THEO RULEPROMT

### ✅ Mobile First + Responsive
```css
Grid: 
- Mobile: 1 column
- MD: 2 columns  
- LG: 3 columns
- XL: 4 columns

Header:
- Mobile: flex-col
- Desktop: flex-row

Stats:
- Grid 3 columns
- Text responsive (xs → base)
```

### ✅ Shadcn UI Components
- Card (Student cards)
- Button (Filters, Actions)
- Input (Search)
- Badge (Status badges)

### ✅ Tiếng Việt
- Tất cả labels, messages tiếng Việt
- Format ngày theo locale vi-VN

### ✅ Icons
- UserCircle2: Avatar default, Empty state
- Mail, Phone: Contact info
- BookOpen: Số khóa học
- Award: Chứng chỉ
- TrendingUp: Đánh giá
- Calendar: Ngày tham gia
- Users: Hoạt động cuối
- Search: Tìm kiếm
- AlertCircle: Error state

## 🔧 DYNAMIC GRAPHQL

### Query - Fetch Students
```typescript
useFindMany('User', {
  where: {
    roleType: 'USER',  // Chỉ lấy học viên
  },
  select: {
    id: true,
    username: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatar: true,
    isActive: true,
    isVerified: true,
    createdAt: true,
    lastLoginAt: true,
  },
  include: {
    _count: {
      select: {
        enrollments: true,
        certificates: true,
        courseReviews: true,
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
})
```

## 📊 DỮ LIỆU HIỂN THỊ

### Student Card Info:
```typescript
{
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  avatar: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  lastLoginAt: string
  
  _count: {
    enrollments: number      // Số khóa học đã ghi danh
    certificates: number     // Số chứng chỉ đã nhận
    courseReviews: number    // Số đánh giá đã viết
  }
}
```

## 🎯 BUSINESS LOGIC

### 1. **Get Full Name**
```typescript
const getFullName = (student: Student) => {
  if (student.firstName && student.lastName) {
    return `${student.firstName} ${student.lastName}`;
  }
  return student.username;
};
```

### 2. **Format Date**
```typescript
const formatDate = (dateString: string) => {
  if (!dateString) return 'Chưa có';
  return new Date(dateString).toLocaleDateString('vi-VN');
};
```

### 3. **Filter Logic**
```typescript
- Search: username OR email OR firstName OR lastName
- Status: all | active (isActive=true) | inactive (isActive=false)
- Combine: matchesSearch AND matchesFilter
```

## 📱 RESPONSIVE DESIGN

### Breakpoints:
```typescript
Mobile:   < 768px  (md)
Tablet:   768px+   (md)
Desktop:  1024px+  (lg)
Large:    1280px+  (xl)
```

### Card Layout:
- **Mobile**: Full width, stacked info
- **Tablet**: 2 columns grid
- **Desktop**: 3 columns grid
- **Large**: 4 columns grid

## 🎨 COLOR SCHEME

- **Blue**: Primary, Active status, Course icon
- **Yellow**: Certificate icon
- **Green**: Review icon
- **Gray**: Inactive status, Text secondary
- **Red**: Error state

## ⚡ PERFORMANCE

- Client-side filtering (real-time)
- Optimized _count queries
- Only select needed fields
- Sorted by newest first

## ✨ HIGHLIGHTS

1. **Code Senior**: Clean, typed, well-structured
2. **Dynamic GraphQL**: Universal hooks
3. **Mobile First**: Responsive từ 375px
4. **Tiếng Việt**: 100% UI
5. **Stats Cards**: Grid layout cho 3 metrics
6. **Avatar Handling**: Có/không có ảnh
7. **Date Format**: Vietnamese locale
8. **Badge System**: Status + Verification

## 🔄 USER FLOWS

### Xem danh sách
```
Load page
  → Query User với roleType='USER'
  → Hiển thị grid cards
  → Show stats mỗi student
```

### Tìm kiếm
```
Type vào search box
  → Real-time filter
  → Update grid display
```

### Lọc theo trạng thái
```
Click filter button
  → Update filterStatus state
  → Re-filter students
  → Update grid
```

## 📝 CHƯA IMPLEMENT

- [ ] View student detail page
- [ ] Edit student info
- [ ] Suspend/Activate student
- [ ] View student's enrollments
- [ ] View student's certificates
- [ ] Export students list
- [ ] Pagination (khi có nhiều students)

---

**Status**: ✅ HOÀN THÀNH
**Date**: 03/11/2024
**Tuân thủ**: 100% Rulepromt.txt
