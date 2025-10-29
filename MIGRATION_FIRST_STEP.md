# 🎯 BƯỚC ĐẦU TIÊN: Callcenter Page Migration

**Mục tiêu:** Migrate file đầu tiên để làm quen với quy trình

---

## ✅ Prisma Models Đã Xác Định

Từ `backend/prisma/schema.prisma`:
- ✅ `CallCenterRecord` - Bản ghi cuộc gọi
- ✅ `CallCenterConfig` - Cấu hình  
- ✅ `CallCenterSyncLog` - Log đồng bộ

**Lưu ý:** Tên model là **PascalCase** trong Prisma, nhưng Dynamic GraphQL sẽ tự convert.

---

## 🚀 THỰC HÀNH NGAY

### Bước 1: Backup File (30 giây)

```bash
cd /mnt/chikiet/kataoffical/shoprausach

# Tạo backup
cp frontend/src/app/admin/callcenter/page.tsx \
   frontend/src/app/admin/callcenter/page.tsx.BACKUP
```

---

### Bước 2: Chuẩn Bị Migration

Tôi sẽ giúp bạn migrate từng phần. Bắt đầu với **imports** trước:

#### 2.1. Import Changes

**Tìm dòng này trong file:**
```tsx
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
```

**Thay thế bằng:**
```tsx
import { 
  useFindUnique, 
  useFindMany, 
  useFindManyPaginated,
  useCreateOne,
  useUpdateOne,
  useMutation // Giữ lại cho custom mutations
} from '@/hooks/useDynamicGraphQL';
import { gql } from '@apollo/client'; // Giữ cho custom mutations
```

---

### Bước 3: Migrate Queries (Từng cái một)

#### Query 1: GET_CALLCENTER_CONFIG → useFindUnique

**TÌM dòng này (khoảng line 498):**
```tsx
const { data: configData, loading: configLoading, refetch: refetchConfig } = useQuery(GET_CALLCENTER_CONFIG);
```

**THAY BẰNG:**
```tsx
const { 
  data: configData, 
  loading: configLoading, 
  refetch: refetchConfig 
} = useFindUnique('callCenterConfig', {
  where: { 
    // Lấy config đầu tiên hoặc theo id
    // Cần xác định logic lấy config nào
  }
});
```

**LƯU Ý:** Nếu chỉ có 1 config duy nhất, có thể dùng:
```tsx
const { data: configs = [] } = useFindMany('callCenterConfig', { take: 1 });
const configData = configs[0];
```

#### Query 2: GET_CALLCENTER_RECORDS → useFindManyPaginated

**TÌM dòng này (khoảng line 499-502):**
```tsx
const { data: recordsData, loading: recordsLoading, refetch: refetchRecords } = useQuery(GET_CALLCENTER_RECORDS, {
  variables: {
    pagination: { page: currentPage, limit: pageSize },
    filters: filters
  }
});
```

**THAY BẰNG:**
```tsx
const { 
  data: recordItems = [], 
  meta: recordsMeta,
  loading: recordsLoading, 
  refetch: refetchRecords,
  nextPage,
  prevPage,
  goToPage
} = useFindManyPaginated('callCenterRecord', {
  page: currentPage || 1,
  limit: pageSize || 10,
  where: filters, // Prisma where syntax
  orderBy: { startEpoch: 'desc' }
});

// Tạo lại structure cũ để không phải sửa code khác
const recordsData = {
  getCallCenterRecords: {
    items: recordItems,
    pagination: recordsMeta
  }
};
```

#### Query 3: GET_SYNC_LOGS → useFindMany

**TÌM dòng này (khoảng line 502-505):**
```tsx
const { data: logsData, loading: logsLoading, refetch: refetchLogs } = useQuery(GET_SYNC_LOGS, {
  variables: { limit: 20 }
});
```

**THAY BẰNG:**
```tsx
const { 
  data: syncLogsItems = [], 
  loading: logsLoading, 
  refetch: refetchLogs 
} = useFindMany('callCenterSyncLog', {
  take: 20,
  orderBy: { createdAt: 'desc' }
});

// Tạo lại structure cũ
const logsData = {
  getSyncLogs: syncLogsItems
};
```

---

### Bước 4: Migrate Mutations

#### Mutation 1: CREATE_CALLCENTER_CONFIG → useCreateOne

**TÌM dòng này (khoảng line 509):**
```tsx
const [createConfig, { loading: creating }] = useMutation(CREATE_CALLCENTER_CONFIG);
```

**THAY BẰNG:**
```tsx
const [createConfigMutation, { loading: creating }] = useCreateOne('callCenterConfig');

// Wrapper để giữ API cũ
const createConfig = async (options: any) => {
  return createConfigMutation({
    data: options.variables.input
  });
};
```

#### Mutation 2: UPDATE_CALLCENTER_CONFIG → useUpdateOne

**TÌM dòng này (khoảng line 508):**
```tsx
const [updateConfig, { loading: updating }] = useMutation(UPDATE_CALLCENTER_CONFIG);
```

**THAY BẰNG:**
```tsx
const [updateConfigMutation, { loading: updating }] = useUpdateOne('callCenterConfig');

// Wrapper để giữ API cũ
const updateConfig = async (options: any) => {
  const { id, input } = options.variables;
  return updateConfigMutation({
    where: { id },
    data: input
  });
};
```

#### Mutation 3: SYNC_CALLCENTER_DATA (Custom - Giữ nguyên)

**GIỮ NGUYÊN (nếu là custom operation):**
```tsx
const [syncData, { loading: syncing }] = useMutation(SYNC_CALLCENTER_DATA);
```

---

### Bước 5: Xóa GraphQL Definitions (Tùy chọn)

Sau khi test thành công, XÓA các định nghĩa GraphQL queries (khoảng line 50-250):

```tsx
// XÓA TẤT CẢ NÀY (chỉ sau khi test xong):
const GET_CALLCENTER_CONFIG = gql`...`;
const GET_CALLCENTER_RECORDS = gql`...`;
const GET_SYNC_LOGS = gql`...`;
const CREATE_CALLCENTER_CONFIG = gql`...`;
const UPDATE_CALLCENTER_CONFIG = gql`...`;
// GIỮ LẠI custom mutations nếu cần
```

---

## 🧪 Testing Plan

### Test 1: TypeScript Compile
```bash
cd frontend
npm run type-check
```

**Expected:** No errors

### Test 2: Run Dev Server
```bash
npm run dev
```

**Expected:** Server starts

### Test 3: Open Page
```
http://localhost:3000/admin/callcenter
```

**Expected:** 
- ✅ Page loads
- ✅ No console errors
- ✅ Data displays

### Test 4: Test Each Feature
- [ ] View config
- [ ] View records table
- [ ] Pagination works
- [ ] View sync logs
- [ ] Create config (if applicable)
- [ ] Update config
- [ ] Trigger sync

---

## 🎯 Quick Action Plan

**Bạn có 3 lựa chọn:**

### Option A: Tôi Làm Cho Bạn (5 phút)
Tôi sẽ tạo file migrated hoàn chỉnh để bạn copy-paste

### Option B: Hướng Dẫn Từng Bước (15 phút)
Tôi hướng dẫn bạn sửa từng dòng, bạn tự làm

### Option C: Bạn Tự Làm (30 phút)
Bạn follow guide trên, tôi support khi cần

---

## 💡 Khuyến Nghị

**Nên chọn Option A** lần đầu để:
1. Xem kết quả ngay
2. So sánh before/after
3. Hiểu pattern
4. Tự tin làm các file tiếp

Sau đó dùng Option B hoặc C cho các file còn lại.

---

## 📞 Bạn Muốn Gì?

Hãy cho tôi biết:
- **Option A**: "Làm cho tôi" → Tôi tạo file migrated ngay
- **Option B**: "Hướng dẫn từng bước" → Tôi guide chi tiết
- **Option C**: "Tôi tự làm" → Tôi support khi cần

**Hoặc nếu muốn thử file khác đơn giản hơn trước?**

Bạn chọn gì? 🎯
