import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiscussionInput, CreateReplyInput, UpdateDiscussionInput } from './dto/discussion.input';
export declare class DiscussionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDiscussion(userId: string, input: CreateDiscussionInput): Promise<any>;
    getCourseDiscussions(courseId: string, lessonId?: string): Promise<any>;
    getDiscussion(id: string): Promise<any>;
    createReply(userId: string, input: CreateReplyInput): Promise<any>;
    updateDiscussion(userId: string, input: UpdateDiscussionInput): Promise<any>;
    deleteDiscussion(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(userId: string, id: string): Promise<any>;
}
