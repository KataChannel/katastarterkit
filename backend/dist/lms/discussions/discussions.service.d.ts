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
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            parentId: string | null;
            discussionId: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        title: string;
        isPinned: boolean;
        courseId: string;
        replyCount: number;
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
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            parentId: string | null;
            discussionId: string;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        title: string;
        isPinned: boolean;
        courseId: string;
        replyCount: number;
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
                updatedAt: Date;
                content: string;
                createdAt: Date;
                userId: string;
                parentId: string | null;
                discussionId: string;
            })[];
        } & {
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            userId: string;
            parentId: string | null;
            discussionId: string;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        title: string;
        isPinned: boolean;
        courseId: string;
        replyCount: number;
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
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        parentId: string | null;
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
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        title: string;
        isPinned: boolean;
        courseId: string;
        replyCount: number;
        lessonId: string | null;
    }>;
    deleteDiscussion(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(userId: string, id: string): Promise<{
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        userId: string;
        title: string;
        isPinned: boolean;
        courseId: string;
        replyCount: number;
        lessonId: string | null;
    }>;
}
