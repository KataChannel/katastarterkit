import { PrismaService } from '../../prisma/prisma.service';
import { RBACCacheService } from './rbac-cache.service';
import { AuditLogService } from './audit-log.service';
export declare class RBACService {
    private prisma;
    private cacheService;
    private auditLogService;
    constructor(prisma: PrismaService, cacheService: RBACCacheService, auditLogService: AuditLogService);
    getAllRoles(): Promise<({
        _count: {
            userRoles: number;
        };
        permissions: ({
            permission: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isActive: boolean;
                category: string;
                displayName: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                createdBy: string | null;
                action: string;
                scope: string | null;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                resource: string;
                isSystemPerm: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            roleId: string;
            effect: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            permissionId: string;
            grantedBy: string | null;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        parentId: string | null;
        displayName: string;
        isSystemRole: boolean;
        priority: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    })[]>;
    getRoleById(roleId: string): Promise<{
        userRoles: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            expiresAt: Date | null;
            roleId: string;
            effect: string;
            scope: string | null;
            assignedBy: string | null;
            assignedAt: Date;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        permissions: ({
            permission: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isActive: boolean;
                category: string;
                displayName: string;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                createdBy: string | null;
                action: string;
                scope: string | null;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                resource: string;
                isSystemPerm: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date | null;
            roleId: string;
            effect: string;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            permissionId: string;
            grantedBy: string | null;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        parentId: string | null;
        displayName: string;
        isSystemRole: boolean;
        priority: number;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
    }>;
    getAllPermissions(): Promise<Record<string, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        category: string;
        displayName: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdBy: string | null;
        action: string;
        scope: string | null;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
        resource: string;
        isSystemPerm: boolean;
    }[]>>;
    getUserRoles(userId: string): Promise<any[]>;
    getUserPermissions(userId: string): Promise<any[]>;
    assignRoleToUser(userId: string, roleId: string, assignedBy?: string, expiresAt?: Date): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            parentId: string | null;
            displayName: string;
            isSystemRole: boolean;
            priority: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdBy: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        expiresAt: Date | null;
        roleId: string;
        effect: string;
        scope: string | null;
        assignedBy: string | null;
        assignedAt: Date;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    removeRoleFromUser(userId: string, roleId: string, currentUserId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    userHasPermission(userId: string, resource: string, action: string, scope?: string): Promise<boolean>;
    getUsersByRole(roleId: string): Promise<({
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            createdAt: Date;
            isActive: boolean;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        expiresAt: Date | null;
        roleId: string;
        effect: string;
        scope: string | null;
        assignedBy: string | null;
        assignedAt: Date;
        conditions: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
