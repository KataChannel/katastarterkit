import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSprintInput,
  UpdateSprintInput,
  CloseSprintInput,
  SprintStatus,
} from './dto/sprint.dto';

@Injectable()
export class SprintService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Queries ====================

  async getSprints(projectId: string) {
    return this.prisma.sprint.findMany({
      where: { projectId },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            storyPoints: true,
            completedAt: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // ACTIVE first, then PLANNED, then COMPLETED
        { startDate: 'desc' },
      ],
    });
  }

  async getSprint(id: string) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            storyPoints: true,
            completedAt: true,
          },
        },
      },
    });

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }

    return sprint;
  }

  async getActiveSprint(projectId: string) {
    return this.prisma.sprint.findFirst({
      where: {
        projectId,
        status: SprintStatus.ACTIVE,
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            storyPoints: true,
            completedAt: true,
          },
        },
      },
    });
  }

  // ==================== Mutations ====================

  async createSprint(input: CreateSprintInput) {
    const { projectId, ...data } = input;

    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if there's already an active sprint
    const activeSprint = await this.prisma.sprint.findFirst({
      where: {
        projectId,
        status: SprintStatus.ACTIVE,
      },
    });

    const status = activeSprint ? SprintStatus.PLANNED : SprintStatus.ACTIVE;

    return this.prisma.sprint.create({
      data: {
        ...data,
        status,
        project: {
          connect: { id: projectId },
        },
      },
      include: {
        tasks: true,
      },
    });
  }

  async updateSprint(input: UpdateSprintInput) {
    const { id, ...data } = input;

    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
    });

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }

    // If setting to ACTIVE, make sure no other sprint is active
    if (data.status === SprintStatus.ACTIVE) {
      const activeSprint = await this.prisma.sprint.findFirst({
        where: {
          projectId: sprint.projectId,
          status: SprintStatus.ACTIVE,
          id: { not: id },
        },
      });

      if (activeSprint) {
        throw new BadRequestException(
          `Cannot activate sprint. Sprint "${activeSprint.name}" is already active.`
        );
      }
    }

    return this.prisma.sprint.update({
      where: { id },
      data,
      include: {
        tasks: true,
      },
    });
  }

  async closeSprint(input: CloseSprintInput) {
    const { id, moveUnfinishedToSprintId } = input;

    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }

    if (sprint.status === SprintStatus.COMPLETED) {
      throw new BadRequestException('Sprint is already completed');
    }

    // Calculate velocity
    const completedStoryPoints = sprint.tasks
      .filter((task) => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0);

    // Move unfinished tasks to another sprint if specified
    if (moveUnfinishedToSprintId) {
      const targetSprint = await this.prisma.sprint.findUnique({
        where: { id: moveUnfinishedToSprintId },
      });

      if (!targetSprint) {
        throw new NotFoundException(
          `Target sprint with ID ${moveUnfinishedToSprintId} not found`
        );
      }

      await this.prisma.task.updateMany({
        where: {
          sprintId: id,
          status: { not: 'COMPLETED' },
        },
        data: {
          sprintId: moveUnfinishedToSprintId,
        },
      });
    } else {
      // Move to backlog (sprintId = null)
      await this.prisma.task.updateMany({
        where: {
          sprintId: id,
          status: { not: 'COMPLETED' },
        },
        data: {
          sprintId: null,
          kanbanColumn: 'backlog',
        },
      });
    }

    // Update sprint status
    return this.prisma.sprint.update({
      where: { id },
      data: {
        status: SprintStatus.COMPLETED,
        completed: completedStoryPoints,
        velocity: completedStoryPoints,
      },
      include: {
        tasks: true,
      },
    });
  }

  async deleteSprint(id: string) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }

    // Move all tasks to backlog before deleting
    if (sprint.tasks.length > 0) {
      await this.prisma.task.updateMany({
        where: { sprintId: id },
        data: {
          sprintId: null,
          kanbanColumn: 'backlog',
        },
      });
    }

    await this.prisma.sprint.delete({
      where: { id },
    });

    return { success: true, message: 'Sprint deleted successfully' };
  }
}
