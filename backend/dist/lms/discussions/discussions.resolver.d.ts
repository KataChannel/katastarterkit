import { DiscussionsService } from './discussions.service';
import { CreateDiscussionInput, CreateReplyInput, UpdateDiscussionInput } from './dto/discussion.input';
export declare class DiscussionsResolver {
    private readonly discussionsService;
    constructor(discussionsService: DiscussionsService);
    createDiscussion(user: any, input: CreateDiscussionInput): Promise<{
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        lesson: {
            id: string;
            title: string;
        };
        replies: {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            discussionId: string;
        }[];
    } & {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        lessonId: string | null;
        userId: string;
        isPinned: boolean;
        replyCount: number;
    }>;
    getCourseDiscussions(courseId: string, lessonId?: string): Promise<({
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        lesson: {
            id: string;
            title: string;
        };
        replies: ({
            user: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            discussionId: string;
        })[];
    } & {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        lessonId: string | null;
        userId: string;
        isPinned: boolean;
        replyCount: number;
    })[]>;
    getDiscussion(id: string): Promise<{
        course: {
            id: string;
            slug: string;
            title: string;
        };
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        lesson: {
            id: string;
            title: string;
        };
        replies: ({
            children: ({
                user: {
                    id: string;
                    username: string;
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
            } & {
                id: string;
                content: string;
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                userId: string;
                discussionId: string;
            })[];
            user: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            discussionId: string;
        })[];
    } & {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        lessonId: string | null;
        userId: string;
        isPinned: boolean;
        replyCount: number;
    }>;
    createReply(user: any, input: CreateReplyInput): Promise<{
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        userId: string;
        discussionId: string;
    }>;
    updateDiscussion(user: any, input: UpdateDiscussionInput): Promise<{
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        lessonId: string | null;
        userId: string;
        isPinned: boolean;
        replyCount: number;
    }>;
    deleteDiscussion(user: any, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(user: any, id: string): Promise<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        lessonId: string | null;
        userId: string;
        isPinned: boolean;
        replyCount: number;
    }>;
}
