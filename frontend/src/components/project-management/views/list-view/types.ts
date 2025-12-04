// Types cho ListView
export type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  storyPoints?: number;
  user?: {
    id: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface NewTaskForm {
  title: string;
  description: string;
  priority: string;
  category: string;
}

export interface ListViewProps {
  projectId: string;
}

// Labels
export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  IN_PROGRESS: 'Đang thực hiện',
  REVIEW: 'Đang review',
  COMPLETED: 'Hoàn thành',
};

export const PRIORITY_LABELS: Record<string, string> = {
  URGENT: 'Khẩn cấp',
  HIGH: 'Cao',
  MEDIUM: 'Trung bình',
  LOW: 'Thấp',
};

export const CATEGORY_OPTIONS = [
  { value: 'OTHER', label: 'Khác' },
  { value: 'WORK', label: 'Công việc' },
  { value: 'PERSONAL', label: 'Cá nhân' },
  { value: 'SHOPPING', label: 'Mua sắm' },
  { value: 'HEALTH', label: 'Sức khỏe' },
];

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Thấp' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HIGH', label: 'Cao' },
  { value: 'URGENT', label: 'Khẩn cấp' },
];

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
