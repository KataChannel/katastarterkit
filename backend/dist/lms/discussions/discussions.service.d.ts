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
            content: string;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            discussionId: string;
        }[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        userId: string;
        isPinned: boolean;
        lessonId: string | null;
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
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            discussionId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        userId: string;
        isPinned: boolean;
        lessonId: string | null;
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
                content: string;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
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
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            discussionId: string;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        userId: string;
        isPinned: boolean;
        lessonId: string | null;
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
        content: string;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        userId: string;
        isPinned: boolean;
        lessonId: string | null;
        replyCount: number;
    }>;
    deleteDiscussion(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    togglePin(userId: string, id: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        userId: string;
        isPinned: boolean;
        lessonId: string | null;
        replyCount: number;
    }>;
}
