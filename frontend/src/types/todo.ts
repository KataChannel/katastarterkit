export enum TaskCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  STUDY = 'STUDY',
}

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SharePermission {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  ADMIN = 'ADMIN',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Task comment interface
export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

// Task media/attachment interface
export interface TaskMedia {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize?: number;
  mimeType: string;
  taskId: string;
  uploadedById: string;
  uploadedBy: User;
  createdAt: string;
}

// Task sharing interface
export interface TaskShare {
  id: string;
  taskId: string;
  userId: string;
  user: User;
  permission: SharePermission;
  sharedById: string;
  sharedBy: User;
  createdAt: string;
}

// Share permission enum
export enum SharePermission {
  READ = 'READ',
  WRITE = 'WRITE',
}

// Updated Task interface with relationships
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  category?: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  comments?: TaskComment[];
  media?: TaskMedia[];
  shares?: TaskShare[];
}

export interface TaskMedia {
  id: string;
  filename: string;
  url: string;
  type: MediaType;
  size: number;
  mimeType: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  uploadedBy: string;
  uploader: User;
}

export interface TaskShare {
  id: string;
  permission: SharePermission;
  shareToken: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  sharedBy: string;
  sharedByUser: User;
  sharedWith?: string;
  sharedWithUser?: User;
}

export interface TaskComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;
  user: User;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  user: User;
}

// Input Types
export interface CreateTaskInput {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskFilterInput {
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  search?: string;
  dueBefore?: string;
  dueAfter?: string;
}

export interface ShareTaskInput {
  taskId: string;
  sharedWithId: string;
  permission: SharePermission;
}

export interface CreateTaskCommentInput {
  taskId: string;
  content: string;
}
