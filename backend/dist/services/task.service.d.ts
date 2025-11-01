import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from '../graphql/inputs/task.input';
export declare class TaskService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string, filters?: TaskFilterInput): Promise<any>;
    findById(id: string, userId: string): Promise<any>;
    findSharedTasks(userId: string, filters?: TaskFilterInput): Promise<any>;
    create(input: CreateTaskInput, userId: string): Promise<any>;
    update(input: UpdateTaskInput, userId: string): Promise<any>;
    delete(id: string, userId: string): Promise<void>;
    findSubtasks(parentId: string, userId: string): Promise<any>;
    createSubtask(parentId: string, input: CreateTaskInput, userId: string): Promise<any>;
    findPaginated(userId: string, page: number, limit: number, filters?: TaskFilterInput): Promise<{
        data: any;
        total: any;
    }>;
    getTaskProgress(taskId: string, userId: string): Promise<{
        task: any;
        totalSubtasks: any;
        completedSubtasks: any;
        progressPercentage: number;
    }>;
    findByProjectId(projectId: string, userId: string, filters?: TaskFilterInput): Promise<any>;
    createProjectTask(projectId: string, userId: string, input: CreateTaskInput & {
        assignedTo?: string[];
        mentions?: string[];
        tags?: string[];
        order?: number;
    }): Promise<any>;
    updateTaskOrder(taskId: string, userId: string, newOrder: number): Promise<any>;
    assignTask(taskId: string, userId: string, assignedUserIds: string[]): Promise<any>;
    private createMentionNotifications;
    private createAssignmentNotifications;
}
