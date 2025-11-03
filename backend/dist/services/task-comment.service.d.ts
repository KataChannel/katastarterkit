import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
        user: {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
        };
        parent: {
            user: {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            taskId: string;
        };
        replies: ({
            user: {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            taskId: string;
        })[];
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            tags: string[];
            category: import("@prisma/client").$Enums.TaskCategory;
            order: number;
            projectId: string | null;
            completedAt: Date | null;
            dueDate: Date | null;
            assignedTo: string[];
            mentions: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        content: string;
        taskId: string;
    }>;
    findByTaskId(taskId: string): Promise<({
        user: {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        content: string;
        taskId: string;
    })[]>;
    findById(id: string): Promise<{
        user: {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
        };
        parent: {
            user: {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            taskId: string;
        };
        replies: ({
            user: {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            taskId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        content: string;
        taskId: string;
    }>;
    findReplies(parentId: string): Promise<({
        user: {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        content: string;
        taskId: string;
    })[]>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<{
        user: {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
        };
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            priority: import("@prisma/client").$Enums.TaskPriority;
            userId: string;
            title: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            tags: string[];
            category: import("@prisma/client").$Enums.TaskCategory;
            order: number;
            projectId: string | null;
            completedAt: Date | null;
            dueDate: Date | null;
            assignedTo: string[];
            mentions: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        content: string;
        taskId: string;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
