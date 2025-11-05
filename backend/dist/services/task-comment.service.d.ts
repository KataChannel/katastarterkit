import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
        parent: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import("@prisma/client").$Enums.UserRoleType;
                isActive: boolean;
                isVerified: boolean;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            taskId: string;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        task: {
            id: string;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.TaskStatus;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            parentId: string | null;
            tags: string[];
            category: import("@prisma/client").$Enums.TaskCategory;
            userId: string;
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            completedAt: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
        replies: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import("@prisma/client").$Enums.UserRoleType;
                isActive: boolean;
                isVerified: boolean;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        taskId: string;
    }>;
    findByTaskId(taskId: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import("@prisma/client").$Enums.UserRoleType;
                isActive: boolean;
                isVerified: boolean;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        taskId: string;
    })[]>;
    findById(id: string): Promise<{
        parent: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import("@prisma/client").$Enums.UserRoleType;
                isActive: boolean;
                isVerified: boolean;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            taskId: string;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import("@prisma/client").$Enums.UserRoleType;
                isActive: boolean;
                isVerified: boolean;
                isTwoFactorEnabled: boolean;
                failedLoginAttempts: number;
                lockedUntil: Date | null;
                lastLoginAt: Date | null;
                departmentId: string | null;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            taskId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        taskId: string;
    }>;
    findReplies(parentId: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        taskId: string;
    })[]>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        task: {
            id: string;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.TaskStatus;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            parentId: string | null;
            tags: string[];
            category: import("@prisma/client").$Enums.TaskCategory;
            userId: string;
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            completedAt: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        taskId: string;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
