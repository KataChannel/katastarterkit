"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RbacService = class RbacService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPermissionById(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
        });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission not found with id: ${id}`);
        }
        return permission;
    }
    async createPermission(input) {
        const existing = await this.prisma.permission.findUnique({
            where: {
                resource_action_scope: {
                    resource: input.resource,
                    action: input.action,
                    scope: input.scope || null,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Permission "${input.resource}:${input.action}${input.scope ? ':' + input.scope : ''}" already exists`);
        }
        return this.prisma.permission.create({
            data: {
                name: input.name,
                displayName: input.displayName,
                description: input.description,
                resource: input.resource,
                action: input.action,
                scope: input.scope,
                category: input.category || 'general',
                conditions: input.conditions,
                metadata: input.metadata,
            },
        });
    }
    async updatePermission(id, input) {
        const permission = await this.prisma.permission.findUnique({ where: { id } });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        if (permission.isSystemPerm && input.isActive === false) {
            throw new common_1.ForbiddenException('Cannot deactivate system permission');
        }
        return this.prisma.permission.update({
            where: { id },
            data: input,
        });
    }
    async deletePermission(id) {
        const permission = await this.prisma.permission.findUnique({ where: { id } });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        if (permission.isSystemPerm) {
            throw new common_1.ForbiddenException('Cannot delete system permission');
        }
        await this.prisma.permission.delete({ where: { id } });
        return true;
    }
    async searchPermissions(input) {
        const where = {};
        if (input.search) {
            where.OR = [
                { name: { contains: input.search, mode: 'insensitive' } },
                { displayName: { contains: input.search, mode: 'insensitive' } },
                { description: { contains: input.search, mode: 'insensitive' } },
            ];
        }
        if (input.resource)
            where.resource = input.resource;
        if (input.action)
            where.action = input.action;
        if (input.category)
            where.category = input.category;
        if (input.isActive !== undefined)
            where.isActive = input.isActive;
        const [permissions, total] = await Promise.all([
            this.prisma.permission.findMany({
                where,
                skip: (input.page || 0) * (input.size || 20),
                take: input.size || 20,
                orderBy: {
                    [input.sortBy || 'name']: input.sortOrder || 'asc',
                },
            }),
            this.prisma.permission.count({ where }),
        ]);
        return {
            permissions,
            total,
            page: input.page || 0,
            size: input.size || 20,
            totalPages: Math.ceil(total / (input.size || 20)),
        };
    }
    async getRoleById(id) {
        const roleData = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
                children: true,
            },
        });
        if (!roleData) {
            throw new common_1.NotFoundException(`Role not found with id: ${id}`);
        }
        return {
            ...roleData,
            permissions: roleData.permissions.map(rp => rp.permission).filter(p => p !== null)
        };
    }
    async createRole(input) {
        const existing = await this.prisma.role.findUnique({
            where: { name: input.name },
        });
        if (existing) {
            throw new common_1.ConflictException(`Role "${input.name}" already exists`);
        }
        if (input.parentId) {
            const parent = await this.prisma.role.findUnique({
                where: { id: input.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent role not found');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const role = await tx.role.create({
                data: {
                    name: input.name,
                    displayName: input.displayName,
                    description: input.description,
                    parentId: input.parentId,
                    priority: input.priority || 0,
                    metadata: input.metadata,
                },
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                    children: true,
                },
            });
            if (input.permissionIds && input.permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: input.permissionIds.map((permId) => ({
                        roleId: role.id,
                        permissionId: permId,
                        effect: 'allow',
                    })),
                });
            }
            const updatedRole = await tx.role.findUnique({
                where: { id: role.id },
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                    children: true,
                },
            });
            return {
                ...updatedRole,
                permissions: updatedRole.permissions.map(rp => rp.permission).filter(p => p !== null)
            };
        });
    }
    async updateRole(id, input) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.isSystemRole && input.isActive === false) {
            throw new common_1.ForbiddenException('Cannot deactivate system role');
        }
        if (input.parentId) {
            const parent = await this.prisma.role.findUnique({
                where: { id: input.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent role not found');
            }
        }
        const roleData = await this.prisma.role.update({
            where: { id },
            data: input,
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
                children: true,
            },
        });
        return {
            ...roleData,
            permissions: roleData.permissions.map(rp => rp.permission).filter(p => p !== null)
        };
    }
    async deleteRole(id) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.isSystemRole) {
            throw new common_1.ForbiddenException('Cannot delete system role');
        }
        await this.prisma.role.delete({ where: { id } });
        return true;
    }
    async searchRoles(input) {
        const where = {};
        if (input.search) {
            where.OR = [
                { name: { contains: input.search, mode: 'insensitive' } },
                { displayName: { contains: input.search, mode: 'insensitive' } },
                { description: { contains: input.search, mode: 'insensitive' } },
            ];
        }
        if (input.isActive !== undefined)
            where.isActive = input.isActive;
        if (input.parentId)
            where.parentId = input.parentId;
        const [rolesData, total] = await Promise.all([
            this.prisma.role.findMany({
                where,
                skip: (input.page || 0) * (input.size || 20),
                take: input.size || 20,
                orderBy: {
                    [input.sortBy || 'name']: input.sortOrder || 'asc',
                },
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                    parent: true,
                    children: true,
                },
            }),
            this.prisma.role.count({ where }),
        ]);
        const roles = rolesData.map(role => ({
            ...role,
            permissions: role.permissions.map(rp => rp.permission).filter(p => p !== null)
        }));
        return {
            roles,
            total,
            page: input.page || 0,
            size: input.size || 20,
            totalPages: Math.ceil(total / (input.size || 20)),
        };
    }
    async assignRolePermissions(input) {
        await this.prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({
                where: { roleId: input.roleId },
            });
            if (input.permissionIds && input.permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: input.permissionIds.map((permId) => ({
                        roleId: input.roleId,
                        permissionId: permId,
                        effect: input.effect || 'allow',
                        conditions: input.conditions,
                        expiresAt: input.expiresAt,
                    })),
                });
            }
        });
        return true;
    }
    async assignUserRoles(input) {
        await this.prisma.$transaction(async (tx) => {
            await tx.userRoleAssignment.deleteMany({
                where: { userId: input.userId },
            });
            if (input.roleIds.length > 0) {
                await tx.userRoleAssignment.createMany({
                    data: input.roleIds.map((roleId) => ({
                        userId: input.userId,
                        roleId: roleId,
                        effect: input.effect || 'allow',
                        scope: input.scope,
                        conditions: input.conditions,
                        expiresAt: input.expiresAt,
                    })),
                });
            }
        });
        return true;
    }
    async assignUserPermissions(input) {
        await this.prisma.$transaction(async (tx) => {
            await tx.userPermission.deleteMany({
                where: { userId: input.userId },
            });
            if (input.permissionIds.length > 0) {
                await tx.userPermission.createMany({
                    data: input.permissionIds.map((permId) => ({
                        userId: input.userId,
                        permissionId: permId,
                        effect: input.effect || 'allow',
                        scope: input.scope,
                        conditions: input.conditions,
                        expiresAt: input.expiresAt,
                        reason: input.reason,
                    })),
                });
            }
        });
        return true;
    }
    async getUserEffectivePermissions(userId) {
        const [allRoleAssignments, allDirectPermissions] = await Promise.all([
            this.prisma.userRoleAssignment.findMany({
                where: { userId },
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.userPermission.findMany({
                where: { userId },
                include: {
                    permission: true,
                },
            }),
        ]);
        const roleAssignments = allRoleAssignments.map(assignment => ({
            ...assignment,
            role: {
                ...assignment.role,
                permissions: assignment.role.permissions
                    .map(rp => rp.permission)
                    .filter(p => p !== null && p.name !== null)
            }
        }));
        const allowedRoleAssignments = allRoleAssignments.filter(a => a.effect === 'allow');
        const deniedPermissions = new Set();
        allDirectPermissions
            .filter(up => up.effect === 'deny')
            .forEach(up => {
            if (up.permission && up.permission.name !== null) {
                deniedPermissions.add(up.permission.id);
            }
        });
        allRoleAssignments
            .filter(ra => ra.effect === 'deny')
            .forEach(ra => {
            ra.role.permissions.forEach(rp => {
                if (rp.permission && rp.permission.name !== null) {
                    deniedPermissions.add(rp.permission.id);
                }
            });
        });
        const rolePermissions = allowedRoleAssignments
            .flatMap((assignment) => assignment.role.permissions)
            .map(rp => rp.permission)
            .filter(p => p && p.name !== null && !deniedPermissions.has(p.id));
        const directAllowedPermissions = allDirectPermissions
            .filter(up => up.effect === 'allow' && up.permission && up.permission.name !== null)
            .map(up => up.permission)
            .filter(p => p && p.name !== null && !deniedPermissions.has(p.id));
        const allPermissions = [
            ...rolePermissions,
            ...directAllowedPermissions,
        ];
        const uniquePermissions = allPermissions.filter((permission, index, self) => permission && permission.name !== null && index === self.findIndex((p) => p && p.id === permission.id));
        const validDirectPermissions = allDirectPermissions
            .filter(up => up.permission && up.permission.name !== null);
        return {
            userId,
            roleAssignments,
            directPermissions: validDirectPermissions,
            effectivePermissions: uniquePermissions,
            deniedPermissions: Array.from(deniedPermissions),
            summary: {
                totalDirectPermissions: validDirectPermissions.filter(p => p.effect === 'allow').length,
                totalDeniedPermissions: deniedPermissions.size,
                totalRoleAssignments: allowedRoleAssignments.length,
                totalEffectivePermissions: uniquePermissions.length,
                lastUpdated: new Date(),
            },
        };
    }
    async initializeSystemRolePermissions() {
        const systemPermissions = [
            {
                name: 'users.create',
                displayName: 'Create Users',
                resource: 'user',
                action: 'create',
                category: 'user_management',
            },
            {
                name: 'users.read',
                displayName: 'Read Users',
                resource: 'user',
                action: 'read',
                category: 'user_management',
            },
            {
                name: 'users.update',
                displayName: 'Update Users',
                resource: 'user',
                action: 'update',
                category: 'user_management',
            },
            {
                name: 'users.delete',
                displayName: 'Delete Users',
                resource: 'user',
                action: 'delete',
                category: 'user_management',
            },
            {
                name: 'roles.manage',
                displayName: 'Manage Roles',
                resource: 'role',
                action: 'manage',
                category: 'role_management',
            },
            {
                name: 'permissions.manage',
                displayName: 'Manage Permissions',
                resource: 'permission',
                action: 'manage',
                category: 'permission_management',
            },
        ];
        for (const perm of systemPermissions) {
            await this.prisma.permission.upsert({
                where: {
                    resource_action_scope: {
                        resource: perm.resource,
                        action: perm.action,
                        scope: null,
                    },
                },
                update: {},
                create: {
                    ...perm,
                    isSystemPerm: true,
                },
            });
        }
        const superAdminRole = await this.prisma.role.upsert({
            where: { name: 'super_admin' },
            update: {},
            create: {
                name: 'super_admin',
                displayName: 'Super Administrator',
                description: 'Full system access',
                isSystemRole: true,
                priority: 1000,
            },
        });
        const adminRole = await this.prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: {
                name: 'admin',
                displayName: 'Administrator',
                description: 'Administrative access',
                isSystemRole: true,
                priority: 500,
            },
        });
        const allPermissions = await this.prisma.permission.findMany();
        for (const permission of allPermissions) {
            await this.prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: superAdminRole.id,
                        permissionId: permission.id,
                    },
                },
                update: {},
                create: {
                    roleId: superAdminRole.id,
                    permissionId: permission.id,
                    effect: 'allow',
                },
            });
        }
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map