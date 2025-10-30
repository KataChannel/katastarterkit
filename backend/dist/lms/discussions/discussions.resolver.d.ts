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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            discussionId: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        userId: string;
        courseId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            discussionId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        userId: string;
        courseId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
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
            title: string;
            slug: string;
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
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                discussionId: string;
                parentId: string | null;
            })[];
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            discussionId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        userId: string;
        courseId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
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
        userId: string;
        createdAt: Date;
        updatedAt: Date;
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
        userId: string;
        courseId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
        lessonId: string | null;
    }>;
    deleteDiscussion(user: any, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(user: any, id: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPinned: boolean;
        lessonId: string | null;
    }>;
}
