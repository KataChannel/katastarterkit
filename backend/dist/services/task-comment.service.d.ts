import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            parentId: string | null;
            taskId: string;
        })[];
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            parentId: string | null;
            taskId: string;
        };
        task: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TaskStatus;
            completedAt: Date | null;
            title: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TaskCategory;
            order: number;
            parentId: string | null;
            tags: string[];
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        parentId: string | null;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            parentId: string | null;
            taskId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        parentId: string | null;
        taskId: string;
    })[]>;
    findById(id: string): Promise<{
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            parentId: string | null;
            taskId: string;
        })[];
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            parentId: string | null;
            taskId: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        parentId: string | null;
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
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        parentId: string | null;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TaskStatus;
            completedAt: Date | null;
            title: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TaskCategory;
            order: number;
            parentId: string | null;
            tags: string[];
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        parentId: string | null;
        taskId: string;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
