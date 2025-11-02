import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    user?: any;
}
export declare class ProjectChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    private jwtService;
    server: Server;
    private activeConnections;
    private onlineUsers;
    constructor(prisma: PrismaService, jwtService: JwtService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): Promise<void>;
    handleJoinProject(data: {
        projectId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        error: string;
        projectId?: undefined;
        onlineUsers?: undefined;
    } | {
        success: boolean;
        projectId: string;
        onlineUsers: string[];
        error?: undefined;
    }>;
    handleLeaveProject(data: {
        projectId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    handleLoadMessages(data: {
        projectId: string;
        take?: number;
        skip?: number;
    }, client: AuthenticatedSocket): Promise<void>;
    handleSendMessage(data: {
        projectId: string;
        content: string;
        replyToId?: string;
        mentions?: string[];
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        message: {
            sender: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
            replyTo: {
                sender: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    avatar: string;
                };
            } & {
                projectId: string;
                id: string;
                content: string;
                mentions: string[];
                reactions: import("@prisma/client/runtime/library").JsonValue | null;
                isEdited: boolean;
                editedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                senderId: string;
                replyToId: string | null;
            };
        } & {
            projectId: string;
            id: string;
            content: string;
            mentions: string[];
            reactions: import("@prisma/client/runtime/library").JsonValue | null;
            isEdited: boolean;
            editedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            senderId: string;
            replyToId: string | null;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleTypingStart(data: {
        projectId: string;
    }, client: AuthenticatedSocket): void;
    handleTypingStop(data: {
        projectId: string;
    }, client: AuthenticatedSocket): void;
    handleAddReaction(data: {
        messageId: string;
        emoji: string;
        projectId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        reactions: import("@prisma/client/runtime/library").JsonValue;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        reactions?: undefined;
    }>;
    handleRemoveReaction(data: {
        messageId: string;
        emoji: string;
        projectId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        reactions: import("@prisma/client/runtime/library").JsonValue;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        reactions?: undefined;
    }>;
    handleEditMessage(data: {
        messageId: string;
        content: string;
        projectId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        message: {
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
        } & {
            projectId: string;
            id: string;
            content: string;
            mentions: string[];
            reactions: import("@prisma/client/runtime/library").JsonValue | null;
            isEdited: boolean;
            editedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            senderId: string;
            replyToId: string | null;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleDeleteMessage(data: {
        messageId: string;
        projectId: string;
    }, client: AuthenticatedSocket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    sendSystemMessage(projectId: string, content: string): Promise<void>;
    getOnlineUsers(projectId: string): string[];
}
export {};
