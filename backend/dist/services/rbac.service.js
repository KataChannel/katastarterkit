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
                resource_action: {
                    resource: input.resource,
                    action: input.action,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Permission "${input.resource}:${input.action}" already exists`);
        }
        return this.prisma.permission.create({
            data: {
                description: input.description,
                resource: input.resource,
                action: input.action,
                createdById: 'system',
            },
        });
    }
    async updatePermission(id, input) {
        const permission = await this.prisma.permission.findUnique({ where: { id } });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
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
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        if (!roleData) {
            throw new common_1.NotFoundException(`Role not found with id: ${id}`);
        }
        return {
            ...roleData,
            permissions: roleData.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
        };
    }
    async createRole(input) {
        const existing = await this.prisma.role.findUnique({
            where: { name: input.name },
        });
        if (existing) {
            throw new common_1.ConflictException(`Role "${input.name}" already exists`);
        }
        return this.prisma.$transaction(async (tx) => {
            const role = await tx.role.create({
                data: {
                    name: input.name,
                    description: input.description,
                    createdById: 'system',
                },
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            });
            if (input.permissionIds && input.permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: input.permissionIds.map((permId) => ({
                        roleId: role.id,
                        permissionId: permId,
                    })),
                });
            }
            const updatedRole = await tx.role.findUnique({
                where: { id: role.id },
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            });
            return {
                ...updatedRole,
                permissions: updatedRole?.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
            };
        });
    }
    async updateRole(id, input) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.isSystem && input.isActive === false) {
            throw new common_1.ForbiddenException('Cannot deactivate system role');
        }
        const roleData = await this.prisma.role.update({
            where: { id },
            data: input,
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        return {
            ...roleData,
            permissions: roleData.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
        };
    }
    async deleteRole(id) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.isSystem) {
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
                { description: { contains: input.search, mode: 'insensitive' } },
            ];
        }
        if (input.isActive !== undefined)
            where.isActive = input.isActive;
        const [rolesData, total] = await Promise.all([
            this.prisma.role.findMany({
                where,
                skip: (input.page || 0) * (input.size || 20),
                take: input.size || 20,
                orderBy: {
                    [input.sortBy || 'name']: input.sortOrder || 'asc',
                },
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            }),
            this.prisma.role.count({ where }),
        ]);
        const roles = rolesData.map(role => ({
            ...role,
            permissions: role.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
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
                            rolePermissions: {
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
                permissions: assignment.role.rolePermissions?.map(rp => rp.permission).filter(p => p !== null) || []
            }
        }));
        const rolePermissions = allRoleAssignments
            .flatMap((assignment) => assignment.role.rolePermissions || [])
            .map(rp => rp.permission)
            .filter(p => p !== null);
        const directPermissionsOnly = allDirectPermissions
            .map(up => up.permission)
            .filter(p => p !== null);
        const allPermissions = [
            ...rolePermissions,
            ...directPermissionsOnly,
        ];
        const uniquePermissions = allPermissions.filter((permission, index, self) => permission && index === self.findIndex((p) => p && p.id === permission.id));
        return {
            userId,
            roleAssignments,
            directPermissions: allDirectPermissions,
            effectivePermissions: uniquePermissions,
            summary: {
                totalDirectPermissions: allDirectPermissions.length,
                totalRoleAssignments: allRoleAssignments.length,
                totalEffectivePermissions: uniquePermissions.length,
                lastUpdated: new Date(),
            },
        };
    }
    async initializeSystemRolePermissions() {
        const systemPermissions = [
            {
                resource: 'user',
                action: 'create',
                description: 'Create Users',
            },
            {
                resource: 'user',
                action: 'read',
                description: 'Read Users',
            },
            {
                resource: 'user',
                action: 'update',
                description: 'Update Users',
            },
            {
                resource: 'user',
                action: 'delete',
                description: 'Delete Users',
            },
            {
                resource: 'role',
                action: 'manage',
                description: 'Manage Roles',
            },
            {
                resource: 'permission',
                action: 'manage',
                description: 'Manage Permissions',
            },
        ];
        for (const perm of systemPermissions) {
            await this.prisma.permission.upsert({
                where: {
                    resource_action: {
                        resource: perm.resource,
                        action: perm.action,
                    },
                },
                update: {},
                create: {
                    ...perm,
                    createdById: 'system',
                },
            });
        }
        const superAdminRole = await this.prisma.role.upsert({
            where: { name: 'super_admin' },
            update: {},
            create: {
                name: 'super_admin',
                description: 'Full system access',
                isSystem: true,
                createdById: 'system',
            },
        });
        const adminRole = await this.prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: {
                name: 'admin',
                description: 'Administrative access',
                isSystem: true,
                createdById: 'system',
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