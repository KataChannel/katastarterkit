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
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            userId: string;
            discussionId: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        content: string;
        lessonId: string | null;
        isPinned: boolean;
        userId: string;
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
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            userId: string;
            discussionId: string;
        })[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        content: string;
        lessonId: string | null;
        isPinned: boolean;
        userId: string;
        replyCount: number;
    })[]>;
    getDiscussion(id: string): Promise<{
        course: {
            id: string;
            title: string;
            slug: string;
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
                createdAt: Date;
                updatedAt: Date;
                parentId: string | null;
                content: string;
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
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            content: string;
            userId: string;
            discussionId: string;
        })[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        content: string;
        lessonId: string | null;
        isPinned: boolean;
        userId: string;
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
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
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
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        content: string;
        lessonId: string | null;
        isPinned: boolean;
        userId: string;
        replyCount: number;
    }>;
    deleteDiscussion(user: any, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(user: any, id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        content: string;
        lessonId: string | null;
        isPinned: boolean;
        userId: string;
        replyCount: number;
    }>;
}
