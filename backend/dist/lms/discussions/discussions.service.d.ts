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
        replies: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            discussionId: string;
        }[];
        lesson: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        courseId: string;
        lessonId: string | null;
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
            userId: string;
            content: string;
            discussionId: string;
        })[];
        lesson: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        courseId: string;
        lessonId: string | null;
        isPinned: boolean;
        replyCount: number;
    })[]>;
    getDiscussion(id: string): Promise<{
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
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
                parentId: string | null;
                userId: string;
                content: string;
                discussionId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            userId: string;
            content: string;
            discussionId: string;
        })[];
        course: {
            id: string;
            title: string;
            slug: string;
        };
        lesson: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        courseId: string;
        lessonId: string | null;
        isPinned: boolean;
        replyCount: number;
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
        parentId: string | null;
        userId: string;
        content: string;
        discussionId: string;
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
        title: string;
        content: string;
        courseId: string;
        lessonId: string | null;
        isPinned: boolean;
        replyCount: number;
    }>;
    deleteDiscussion(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        courseId: string;
        lessonId: string | null;
        isPinned: boolean;
        replyCount: number;
    }>;
}
