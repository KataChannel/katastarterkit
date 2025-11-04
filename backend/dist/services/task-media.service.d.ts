import { PrismaService } from '../prisma/prisma.service';
export declare class TaskMediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByTaskId(taskId: string): Promise<({
        uploader: {
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
        type: import(".prisma/client").$Enums.MediaType;
        createdAt: Date;
        updatedAt: Date;
        size: number;
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
        type: import(".prisma/client").$Enums.MediaType;
        createdAt: Date;
        updatedAt: Date;
        size: number;
        filename: string;
        url: string;
        mimeType: string;
        caption: string | null;
        taskId: string;
        uploadedBy: string;
    }>;
    delete(mediaId: string, userId: string): Promise<void>;
}
