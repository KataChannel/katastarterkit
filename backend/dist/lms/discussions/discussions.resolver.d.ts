import { DiscussionsService } from './discussions.service';
import { CreateDiscussionInput, CreateReplyInput, UpdateDiscussionInput } from './dto/discussion.input';
export declare class DiscussionsResolver {
    private readonly discussionsService;
    constructor(discussionsService: DiscussionsService);
    createDiscussion(user: any, input: CreateDiscussionInput): Promise<any>;
    getCourseDiscussions(courseId: string, lessonId?: string): Promise<any>;
    getDiscussion(id: string): Promise<any>;
    createReply(user: any, input: CreateReplyInput): Promise<any>;
    updateDiscussion(user: any, input: UpdateDiscussionInput): Promise<any>;
    deleteDiscussion(user: any, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(user: any, id: string): Promise<any>;
}
