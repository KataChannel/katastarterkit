# Call Center Module Refactoring Documentation

## Tổng quan

Module Call Center đã được refactor theo Clean Architecture để:
- **Dễ bảo trì**: Mỗi file có responsibility rõ ràng
- **Dễ đọc**: Code được tổ chức logic theo chức năng
- **Tái sử dụng**: Components và hooks có thể sử dụng lại
- **Type-safe**: TypeScript types được định nghĩa tập trung

## Cấu trúc thư mục

```
frontend/src/app/admin/callcenter/
├── page.tsx              # Main page component (điều phối)
├── types.ts              # Định nghĩa types & interfaces
├── constants.ts          # Constants & GraphQL operations  
├── utils.ts              # Helper functions
├── hooks/                # Custom React hooks
│   ├── index.ts          # Barrel exports
│   ├── useCallCenterData.ts     # Data fetching & mutations
│   ├── useCallCenterFilters.ts  # Filter management
│   └── useComparison.ts         # Comparison feature
└── components/           # UI Components
    ├── index.ts          # Barrel exports
    ├── AudioPlayer.tsx   # Audio playback component
    ├── ConfigDialog.tsx  # API configuration dialog
    ├── DateRangeDialog.tsx # Sync date selection dialog
    ├── HeaderSection.tsx # Page header with actions
    ├── ProgressTab.tsx   # Sync progress display
    ├── RecordsTab.tsx    # Call records table + filters
    ├── StatsBar.tsx      # Compact stats summary
    ├── SummaryTab.tsx    # Statistics & comparison
    ├── SyncLogsTab.tsx   # Sync history logs
    └── SyncProgressDialog.tsx # Real-time sync progress
```

## Các file chính

### 1. `types.ts` - Type Definitions

Định nghĩa tất cả types và interfaces:

```typescript
// Config
export interface CallCenterConfig { ... }

// Records
export interface CallCenterRecord { ... }

// Sync
export interface CallCenterSyncLog { ... }
export interface SyncStats { ... }

// Filters
export interface RecordFilters { ... }
export interface CallCenterFilters { ... }

// Comparison
export interface ComparisonPeriod { ... }
export interface ComparisonSummary { ... }

// Props types cho components
export interface RecordsTabProps { ... }
export interface SummaryTabProps { ... }
// ...
```

### 2. `constants.ts` - Constants & GraphQL

```typescript
// GraphQL Mutations
export const SYNC_CALLCENTER_DATA = gql`...`;
export const STOP_SYNC_PROCESS = gql`...`;

// Quick select options
export const QUICK_FILTER_OPTIONS = [...];
export const CALL_DIRECTION_OPTIONS = [...];
export const CALL_STATUS_OPTIONS = [...];

// Status badge variants
export const CALL_STATUS_VARIANTS = {...};
export const SYNC_STATUS_VARIANTS = {...};

// Default values
export const DEFAULT_PAGINATION = {...};
export const DEFAULT_CONFIG = {...};
```

### 3. `utils.ts` - Helper Functions

```typescript
// Date/Time formatting
export const formatEpoch = (epoch: string): string => {...};
export const formatDuration = (seconds: string): string => {...};
export const formatTotalDuration = (seconds: number): string => {...};

// Date range calculations  
export const getQuickFilterDateRange = (type: QuickFilterType) => {...};
export const daysBetween = (from: string, to: string): number => {...};

// Filter building
export const buildRecordFilters = (...) => {...};
export const buildComparisonFilters = (...) => {...};

// Summary calculations
export const calculateSummary = (records: CallCenterRecord[]) => {...};
export const calculateComparisonSummary = (records) => {...};
export const calculateChange = (current, previous) => {...};
```

### 4. Hooks

#### `useCallCenterData.ts`

Hook quản lý tất cả data operations:

```typescript
export function useCallCenterData(): UseCallCenterDataReturn {
  // Config management
  config, configLoading, refetchConfig, updateConfig, createConfig
  
  // Records
  records, recordsLoading, refetchRecords
  pagination, setPagination
  filters, setFilters
  
  // Summary
  summaryRecords, summaryLoading
  summaryFilters, setSummaryFilters
  
  // Sync logs
  syncLogs, logsLoading, refetchLogs
  
  // Sync operations
  syncing, stopping, startSync, stopSync
  currentSyncLogId, syncStats, showSyncProgress
}
```

#### `useCallCenterFilters.ts`

Hook quản lý filter state:

```typescript
export function useCallCenterFilters(
  onFiltersChange,
  onSummaryFiltersChange,
  onPaginationReset
): UseCallCenterFiltersReturn {
  // Records filters
  filterState, setFilterState
  quickFilter, showFilters
  applyFilters, handleQuickFilter, clearAllFilters
  
  // Summary filters  
  summaryFilterState, setSummaryFilterState
  summaryQuickFilter
  applySummaryFilters, handleSummaryQuickFilter, clearSummaryFilters
}
```

#### `useComparison.ts`

Hook quản lý tính năng so sánh:

```typescript
export function useComparison(): UseComparisonReturn {
  enableComparison, setEnableComparison
  comparisonPeriods
  comparisonExtension, setComparisonExtension
  comparisonLoading
  comparisonResults
  
  // Actions
  addComparisonPeriod, removeComparisonPeriod, updateComparisonPeriod
  applyComparisonFilters, clearComparison
  initializeComparison
}
```

### 5. Components

| Component | Mô tả | Props chính |
|-----------|-------|-------------|
| `AudioPlayer` | Phát recording cuộc gọi | `recordPath`, `domain` |
| `ConfigDialog` | Cấu hình API kết nối | `config`, `onSave` |
| `DateRangeDialog` | Chọn khoảng ngày sync | `dateRange`, `onSync` |
| `HeaderSection` | Header với actions | `onRefresh`, `onOpenConfig` |
| `ProgressTab` | Hiển thị tiến độ sync | `syncStats`, `isSyncing` |
| `RecordsTab` | Bảng cuộc gọi + filters | `records`, `filterState` |
| `StatsBar` | Thanh thống kê compact | `records` |
| `SummaryTab` | Thống kê + so sánh | `records`, `filters` |
| `SyncLogsTab` | Lịch sử đồng bộ | `logs`, `onRefresh` |
| `SyncProgressDialog` | Dialog tiến độ realtime | `syncLogId`, `onStop` |

## Sử dụng

### Import trong page.tsx:

```typescript
// Types
import type { CallCenterFilters, RecordFilters } from './types';

// Hooks
import { useCallCenterData } from './hooks/useCallCenterData';
import { useCallCenterFilters } from './hooks/useCallCenterFilters';
import { useComparison } from './hooks/useComparison';

// Components
import {
  HeaderSection,
  StatsBar,
  RecordsTab,
  SummaryTab,
  // ...
} from './components';

// Constants
import { DEFAULT_PAGINATION } from './constants';
```

### Cách sử dụng hooks:

```typescript
// Data hook
const {
  config, records, syncLogs,
  startSync, stopSync,
  // ...
} = useCallCenterData();

// Filters hook  
const {
  filterState, setFilterState,
  handleQuickFilter, applyFilters,
  // ...
} = useCallCenterFilters(setRecordFilters, setSummaryFilters, handlePaginationReset);

// Comparison hook
const {
  enableComparison, comparisonResults,
  initializeComparison, setEnableComparison,
  // ...
} = useComparison();
```

## Quy tắc phát triển

1. **Types**: Thêm types mới vào `types.ts`
2. **Constants**: Thêm constants/GraphQL vào `constants.ts`
3. **Utils**: Thêm helper functions vào `utils.ts`
4. **Hooks**: Tạo custom hook trong `hooks/` nếu logic phức tạp
5. **Components**: Tách UI thành component riêng trong `components/`

## Migration Notes

### Từ file cũ (3127 dòng) sang cấu trúc mới:

1. File backup: `page.tsx.backup`
2. Tách types → `types.ts`
3. Tách constants → `constants.ts`
4. Tách utils → `utils.ts`
5. Tách logic vào hooks
6. Tách UI vào components
7. Page.tsx giờ chỉ orchestrate các modules

### Breaking changes:
- Không có breaking changes về functionality
- API và behavior giữ nguyên
- Chỉ thay đổi cấu trúc code

## Lợi ích

✅ **Maintainability**: Dễ tìm và sửa code  
✅ **Testability**: Dễ viết unit tests cho từng module  
✅ **Readability**: Code dễ đọc và hiểu  
✅ **Reusability**: Components/hooks có thể dùng lại  
✅ **Scalability**: Dễ thêm tính năng mới  
✅ **Type Safety**: TypeScript types được quản lý tập trung
