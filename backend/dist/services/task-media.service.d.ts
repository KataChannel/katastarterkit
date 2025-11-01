import { PrismaService } from '../prisma/prisma.service';
export declare class TaskMediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByTaskId(taskId: string): Promise<any>;
    create(taskId: string, uploaderId: string, mediaData: any): Promise<any>;
    delete(mediaId: string, userId: string): Promise<void>;
}
