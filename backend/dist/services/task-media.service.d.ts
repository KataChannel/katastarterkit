import { PrismaService } from '../prisma/prisma.service';
export declare class TaskMediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByTaskId(taskId: string): Promise<({
        uploader: {
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
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.MediaType;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        taskId: string;
        caption: string | null;
        uploadedBy: string;
    })[]>;
    create(taskId: string, uploaderId: string, mediaData: any): Promise<{
        uploader: {
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
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.MediaType;
        url: string;
        filename: string;
        mimeType: string;
        size: number;
        taskId: string;
        caption: string | null;
        uploadedBy: string;
    }>;
    delete(mediaId: string, userId: string): Promise<void>;
}
