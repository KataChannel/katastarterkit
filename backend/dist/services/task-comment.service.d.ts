import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../graphql/inputs/task-comment.input';
export declare class TaskCommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateTaskCommentInput, authorId: string): Promise<any>;
    findByTaskId(taskId: string): Promise<any>;
    findById(id: string): Promise<any>;
    findReplies(parentId: string): Promise<any>;
    update(input: UpdateTaskCommentInput, userId: string): Promise<any>;
    delete(commentId: string, userId: string): Promise<void>;
}
