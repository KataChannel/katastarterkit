import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
        user: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        task: {
            id: string;
            category: import(".prisma/client").$Enums.TaskCategory;
            description: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            tags: string[];
            parentId: string | null;
            priority: import(".prisma/client").$Enums.TaskPriority;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            completedAt: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
        parent: {
            user: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            parentId: string | null;
            content: string;
            taskId: string;
        };
        replies: ({
            user: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            parentId: string | null;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    findByTaskId(taskId: string): Promise<({
        user: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            parentId: string | null;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    })[]>;
    findById(id: string): Promise<{
        user: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        parent: {
            user: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            parentId: string | null;
            content: string;
            taskId: string;
        };
        replies: ({
            user: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            parentId: string | null;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    findReplies(parentId: string): Promise<({
        user: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    })[]>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<{
        user: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        task: {
            id: string;
            category: import(".prisma/client").$Enums.TaskCategory;
            description: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            tags: string[];
            parentId: string | null;
            priority: import(".prisma/client").$Enums.TaskPriority;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            completedAt: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
