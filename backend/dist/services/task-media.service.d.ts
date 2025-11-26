import { PrismaService } from '../prisma/prisma.service';
export declare class TaskMediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByTaskId(taskId: string): Promise<({
        uploader: {
            id: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            password: string | null;
            phone: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isVerified: boolean;
            address: string | null;
            city: string | null;
            district: string | null;
            ward: string | null;
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
        type: import("@prisma/client").$Enums.MediaType;
        taskId: string;
        url: string;
        mimeType: string;
        filename: string;
        size: number;
        caption: string | null;
        uploadedBy: string;
    })[]>;
    create(taskId: string, uploaderId: string, mediaData: any): Promise<{
        uploader: {
            id: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            password: string | null;
            phone: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isVerified: boolean;
            address: string | null;
            city: string | null;
            district: string | null;
            ward: string | null;
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
        type: import("@prisma/client").$Enums.MediaType;
        taskId: string;
        url: string;
        mimeType: string;
        filename: string;
        size: number;
        caption: string | null;
        uploadedBy: string;
    }>;
    delete(mediaId: string, userId: string): Promise<void>;
}
