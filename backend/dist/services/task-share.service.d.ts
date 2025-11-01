import { PrismaService } from '../prisma/prisma.service';
import { ShareTaskInput, UpdateTaskShareInput } from '../graphql/inputs/task-share.input';
export declare class TaskShareService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: ShareTaskInput, sharedById: string): Promise<any>;
    findByTaskId(taskId: string): Promise<any>;
    update(input: UpdateTaskShareInput, userId: string): Promise<any>;
    delete(shareId: string, userId: string): Promise<void>;
}
