import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<{
        task: {
            id: string;
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.TaskPriority;
            createdAt: Date;
            updatedAt: Date;
            dueDate: Date | null;
            userId: string;
            category: import(".prisma/client").$Enums.TaskCategory;
            completedAt: Date | null;
            parentId: string | null;
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
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
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
                roleType: import(".prisma/client").$Enums.UserRoleType;
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
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
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
                roleType: import(".prisma/client").$Enums.UserRoleType;
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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
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
                roleType: import(".prisma/client").$Enums.UserRoleType;
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
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                username: string;
                password: string | null;
                phone: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                roleType: import(".prisma/client").$Enums.UserRoleType;
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
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    })[]>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<{
        task: {
            id: string;
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.TaskPriority;
            createdAt: Date;
            updatedAt: Date;
            dueDate: Date | null;
            userId: string;
            category: import(".prisma/client").$Enums.TaskCategory;
            completedAt: Date | null;
            parentId: string | null;
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
            roleType: import(".prisma/client").$Enums.UserRoleType;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        parentId: string | null;
        content: string;
        taskId: string;
    }>;
    delete(commentId: string, userId: string): Promise<void>;
}
