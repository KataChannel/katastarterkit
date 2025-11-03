import { PrismaService } from '../prisma/prisma.service';
export declare class TaskMediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByTaskId(taskId: string): Promise<({
        uploader: {
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
        size: number;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        url: string;
        mimeType: string;
        caption: string | null;
        taskId: string;
        uploadedBy: string;
    })[]>;
    create(taskId: string, uploaderId: string, mediaData: any): Promise<{
        uploader: {
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
        size: number;
        type: import("@prisma/client").$Enums.MediaType;
        filename: string;
        url: string;
        mimeType: string;
        caption: string | null;
        taskId: string;
        uploadedBy: string;
    }>;
    delete(mediaId: string, userId: string): Promise<void>;
}
