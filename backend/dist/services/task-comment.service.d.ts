import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            departmentId: string | null;
        };
        parent: {
            user: {
                id: string;
                createdAt: Date;
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
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            taskId: string;
        };
        task: {
            id: string;
            userId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: import("@prisma/client").$Enums.TaskStatus;
            completedAt: Date | null;
            title: string;
            category: import("@prisma/client").$Enums.TaskCategory;
            parentId: string | null;
            order: number;
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            projectId: string | null;
            assignedTo: string[];
            mentions: string[];
        };
        replies: ({
            user: {
                id: string;
                createdAt: Date;
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
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    findByTaskId(taskId: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                createdAt: Date;
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
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
        taskId: string;
    })[]>;
    findById(id: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            departmentId: string | null;
        };
        parent: {
            user: {
                id: string;
                createdAt: Date;
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
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            taskId: string;
        };
        replies: ({
            user: {
                id: string;
                createdAt: Date;
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
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    findReplies(parentId: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            departmentId: string | null;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
        taskId: string;
    })[]>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            departmentId: string | null;
        };
        task: {
            id: string;
            userId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: import("@prisma/client").$Enums.TaskStatus;
            completedAt: Date | null;
            title: string;
            category: import("@prisma/client").$Enums.TaskCategory;
            parentId: string | null;
            order: number;
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
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
