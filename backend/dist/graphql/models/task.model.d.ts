import { User } from './user.model';
import { TaskMedia } from './task-media.model';
import { TaskShare } from './task-share.model';
import { TaskComment } from './task-comment.model';
import { TaskCategory, TaskPriority, TaskStatus } from '@prisma/client';
export declare class Task {
    id: string;
    title: string;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    userId: string;
    parentId?: string;
    parent?: Task;
    subtasks?: Task[];
    progress?: number;
    media?: TaskMedia[];
    shares?: TaskShare[];
    comments?: TaskComment[];
}
