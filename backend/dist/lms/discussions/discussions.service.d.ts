import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiscussionInput, CreateReplyInput, UpdateDiscussionInput } from './dto/discussion.input';
export declare class DiscussionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDiscussion(userId: string, input: CreateDiscussionInput): Promise<{
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
    createReply(userId: string, input: CreateReplyInput): Promise<{
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
    updateDiscussion(userId: string, input: UpdateDiscussionInput): Promise<{
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
    deleteDiscussion(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(userId: string, id: string): Promise<{
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
