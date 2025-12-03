import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SaveProjectViewConfigInput,
  GetProjectViewConfigsInput,
} from './dto/view-config.dto';

@Injectable()
export class ViewConfigService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Queries ====================

  async getProjectViewConfigs(input: GetProjectViewConfigsInput) {
    const { projectId, userId } = input;

    // If userId provided, get user-specific configs first, fallback to project defaults
    if (userId) {
      const userConfigs = await this.prisma.projectViewConfig.findMany({
        where: {
          projectId,
          userId,
        },
        orderBy: { order: 'asc' },
      });

      if (userConfigs.length > 0) {
        return userConfigs;
      }
    }

    // Return project defaults (userId = null)
    return this.prisma.projectViewConfig.findMany({
      where: {
        projectId,
        userId: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  async getDefaultView(projectId: string, userId?: string) {
    // Try user-specific default first
    if (userId) {
      const userDefault = await this.prisma.projectViewConfig.findFirst({
        where: {
          projectId,
          userId,
          isDefault: true,
        },
      });

      if (userDefault) {
        return userDefault;
      }
    }

    // Fallback to project default
    return this.prisma.projectViewConfig.findFirst({
      where: {
        projectId,
        userId: null,
        isDefault: true,
      },
    });
  }

  // ==================== Mutations ====================

  async saveProjectViewConfig(input: SaveProjectViewConfigInput) {
    const { id, projectId, userId, isDefault, ...data } = input;

    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user exists (if userId provided)
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }

    // If setting as default, unset other defaults for this project/user
    if (isDefault) {
      await this.prisma.projectViewConfig.updateMany({
        where: {
          projectId,
          userId: userId || null,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update existing or create new
    if (id) {
      return this.prisma.projectViewConfig.update({
        where: { id },
        data: {
          ...data,
          isDefault,
        },
      });
    }

    return this.prisma.projectViewConfig.create({
      data: {
        ...data,
        isDefault,
        project: {
          connect: { id: projectId },
        },
        ...(userId && {
          user: {
            connect: { id: userId },
          },
        }),
      },
    });
  }

  async deleteProjectViewConfig(id: string) {
    const config = await this.prisma.projectViewConfig.findUnique({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException(`View config with ID ${id} not found`);
    }

    await this.prisma.projectViewConfig.delete({
      where: { id },
    });

    return { success: true, message: 'View config deleted successfully' };
  }
}
