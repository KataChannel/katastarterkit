import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project, ProjectMember } from '@prisma/client';

export interface CreateProjectInput {
  name: string;
  description?: string;
  avatar?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  avatar?: string;
  isArchived?: boolean;
}

export interface AddMemberInput {
  userId: string;
  role?: 'owner' | 'admin' | 'member';
}

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // ==================== PROJECT CRUD ====================

  /**
   * Tạo dự án mới
   * Owner tự động được thêm vào project_members
   */
  async createProject(
    ownerId: string,
    input: CreateProjectInput,
  ): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        avatar: input.avatar,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'owner',
          },
        },
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return project;
  }

  /**
   * Lấy tất cả projects mà user là thành viên
   * Dùng cho ProjectSidebar (25% bên trái)
   */
  async getMyProjects(userId: string, includeArchived = false): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
        isArchived: includeArchived ? undefined : false,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            chatMessages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Lấy chi tiết 1 project
   * Kiểm tra quyền truy cập
   */
  async getProjectById(projectId: string, userId: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            chatMessages: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user is member
    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return project;
  }

  /**
   * Update project
   * Chỉ owner hoặc admin mới được update
   */
  async updateProject(
    projectId: string,
    userId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    // Check permission
    await this.checkAdminPermission(projectId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: input,
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /**
   * Xóa project (soft delete = archive)
   * Chỉ owner mới được xóa
   */
  async deleteProject(projectId: string, userId: string): Promise<Project> {
    // Check if user is owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can delete the project');
    }

    // Soft delete
    return this.prisma.project.update({
      where: { id: projectId },
      data: { isArchived: true },
    });
  }

  // ==================== MEMBER MANAGEMENT ====================

  /**
   * Thêm thành viên vào project
   * Owner/Admin permission required
   */
  async addMember(
    projectId: string,
    currentUserId: string,
    input: AddMemberInput,
  ): Promise<ProjectMember> {
    // Check permission
    await this.checkAdminPermission(projectId, currentUserId);

    // Check if user already member
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: input.userId,
        },
      },
    });

    if (existingMember) {
      throw new ForbiddenException('User is already a member of this project');
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId: input.userId,
        role: input.role || 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
                lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Xóa thành viên khỏi project
   * Owner/Admin permission required
   * Không thể xóa owner
   */
  async removeMember(
    projectId: string,
    currentUserId: string,
    memberUserId: string,
  ): Promise<void> {
    // Check permission
    await this.checkAdminPermission(projectId, currentUserId);

    // Check if trying to remove owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (project.ownerId === memberUserId) {
      throw new ForbiddenException('Cannot remove project owner');
    }

    await this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId,
        },
      },
    });
  }

  /**
   * Update role của member
   * Chỉ owner mới được update role
   */
  async updateMemberRole(
    projectId: string,
    currentUserId: string,
    memberUserId: string,
    newRole: 'owner' | 'admin' | 'member',
  ): Promise<ProjectMember> {
    // Check if current user is owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.ownerId !== currentUserId) {
      throw new ForbiddenException('Only project owner can update member roles');
    }

    return this.prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUserId,
        },
      },
      data: { role: newRole },
      include: {
        user: true,
      },
    });
  }

  /**
   * Lấy danh sách members của project
   * Dùng cho @mention autocomplete
   */
  async getProjectMembers(projectId: string, userId: string): Promise<ProjectMember[]> {
    // Check if user is member
    await this.getProjectById(projectId, userId);

    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
                lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Kiểm tra xem user có quyền admin (owner hoặc admin) không
   */
  private async checkAdminPermission(projectId: string, userId: string): Promise<void> {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      include: {
        project: true,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (member.role !== 'owner' && member.role !== 'admin') {
      throw new ForbiddenException('Only project owners or admins can perform this action');
    }
  }

  /**
   * Kiểm tra xem user có phải member của project không
   */
  async isMember(projectId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return !!member;
  }
}
