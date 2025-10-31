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
            userId: string;
            content: string;
            discussionId: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        title: string;
        isPinned: boolean;
        replyCount: number;
        courseId: string;
        lessonId: string | null;
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
            userId: string;
            content: string;
            discussionId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        title: string;
        isPinned: boolean;
        replyCount: number;
        courseId: string;
        lessonId: string | null;
    })[]>;
    getDiscussion(id: string): Promise<{
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        course: {
            id: string;
            slug: string;
            title: string;
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
                userId: string;
                content: string;
                discussionId: string;
                parentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            discussionId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        title: string;
        isPinned: boolean;
        replyCount: number;
        courseId: string;
        lessonId: string | null;
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
        userId: string;
        content: string;
        discussionId: string;
        parentId: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        title: string;
        isPinned: boolean;
        replyCount: number;
        courseId: string;
        lessonId: string | null;
    }>;
    deleteDiscussion(user: any, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        title: string;
        isPinned: boolean;
        replyCount: number;
        courseId: string;
        lessonId: string | null;
    }>;
}
