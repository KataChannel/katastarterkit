import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
        user: {
            id: string;
            updatedAt: Date;
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
            departmentId: string | null;
        };
        task: {
            category: import("@prisma/client").$Enums.TaskCategory;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            projectId: string | null;
            mentions: string[];
            createdAt: Date;
            userId: string;
            title: string;
            priority: import("@prisma/client").$Enums.TaskPriority;
            status: import("@prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            completedAt: Date | null;
            assignedTo: string[];
            tags: string[];
            parentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                updatedAt: Date;
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
                departmentId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            parentId: string | null;
        })[];
        parent: {
            user: {
                id: string;
                updatedAt: Date;
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
                departmentId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            parentId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        taskId: string;
        parentId: string | null;
    }>;
    findByTaskId(taskId: string): Promise<({
        user: {
            id: string;
            updatedAt: Date;
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
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                updatedAt: Date;
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
                departmentId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        taskId: string;
        parentId: string | null;
    })[]>;
    findById(id: string): Promise<{
        user: {
            id: string;
            updatedAt: Date;
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
            departmentId: string | null;
        };
        replies: ({
            user: {
                id: string;
                updatedAt: Date;
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
                departmentId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            parentId: string | null;
        })[];
        parent: {
            user: {
                id: string;
                updatedAt: Date;
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
                departmentId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            parentId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        taskId: string;
        parentId: string | null;
    }>;
    findReplies(parentId: string): Promise<({
        user: {
            id: string;
            updatedAt: Date;
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
            departmentId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        taskId: string;
        parentId: string | null;
    })[]>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<{
        user: {
            id: string;
            updatedAt: Date;
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
            departmentId: string | null;
        };
        task: {
            category: import("@prisma/client").$Enums.TaskCategory;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            projectId: string | null;
            mentions: string[];
            createdAt: Date;
            userId: string;
            title: string;
            priority: import("@prisma/client").$Enums.TaskPriority;
            status: import("@prisma/client").$Enums.TaskStatus;
            dueDate: Date | null;
            completedAt: Date | null;
            assignedTo: string[];
            tags: string[];
            parentId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        taskId: string;
        parentId: string | null;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
