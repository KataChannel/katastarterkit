import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from '../graphql/inputs/task.input';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string, filters?: TaskFilterInput) {
    const where: any = { userId };
    
    if (filters?.category) where.category = filters.category;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.status) where.status = filters.status;
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    if (filters?.dueBefore) where.dueDate = { lte: new Date(filters.dueBefore) };
    if (filters?.dueAfter) where.dueDate = { gte: new Date(filters.dueAfter) };

    return this.prisma.task.findMany({
      where,
      include: {
        user: true,
        media: true,
        shares: {
          include: {
            sharedByUser: true,
            sharedWithUser: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
        media: {
          include: {
            uploader: true,
          },
        },
        shares: {
          include: {
            sharedByUser: true,
            sharedWithUser: true,
          },
        },
        comments: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
          where: { parentId: null }, // Only top-level comments
          orderBy: { createdAt: 'desc' },
        },
        parent: {
          include: {
            user: true,
          },
        },
        subtasks: {
          include: {
            user: true,
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has access to this task
    const hasAccess = 
      task.userId === userId ||
      task.shares.some(share => share.sharedWith === userId);

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async findSharedTasks(userId: string, filters?: TaskFilterInput) {
    const where: any = {
      shares: {
        some: {
          sharedWith: userId,
          isActive: true,
        },
      },
    };

    if (filters?.category) where.category = filters.category;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.status) where.status = filters.status;
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    if (filters?.dueBefore) where.dueDate = { lte: new Date(filters.dueBefore) };
    if (filters?.dueAfter) where.dueDate = { gte: new Date(filters.dueAfter) };

    return this.prisma.task.findMany({
      where,
      include: {
        user: true,
        media: true,
        shares: {
          include: {
            sharedByUser: true,
            sharedWithUser: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async create(input: CreateTaskInput, userId: string) {
    return this.prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: true,
        media: true,
        shares: true,
        comments: true,
      },
    });
  }

  async update(input: UpdateTaskInput, userId: string) {
    const task = await this.findById(input.id, userId);

    // Check if user has edit permission
    const canEdit = 
      task.userId === userId ||
      task.shares.some(share => 
        share.sharedWith === userId && 
        (share.permission === 'EDIT' || share.permission === 'ADMIN')
      );

    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this task');
    }

    const data: any = {};
    
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.category !== undefined) data.category = input.category;
    if (input.priority !== undefined) data.priority = input.priority;
    if (input.status !== undefined) {
      data.status = input.status;
      if (input.status === 'COMPLETED') {
        data.completedAt = new Date();
      }
    }
    if (input.dueDate !== undefined) {
      data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }

    return this.prisma.task.update({
      where: { id: input.id },
      data,
      include: {
        user: true,
        media: true,
        shares: true,
        comments: true,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await this.findById(id, userId);

    // Only owner can delete the task
    if (task.userId !== userId) {
      throw new ForbiddenException('Only the task owner can delete this task');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  // Subtask Management
  async findSubtasks(parentId: string, userId: string) {
    // Verify user has access to parent task
    await this.findById(parentId, userId);
    
    return this.prisma.task.findMany({
      where: { parentId },
      include: {
        user: true,
        media: true,
        shares: {
          include: {
            sharedByUser: true,
            sharedWithUser: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
        subtasks: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async createSubtask(parentId: string, input: CreateTaskInput, userId: string) {
    // Verify user has access to parent task
    const parentTask = await this.findById(parentId, userId);
    
    // Check if user has edit permission
    const canEdit = 
      parentTask.userId === userId ||
      parentTask.shares.some(share => 
        share.sharedWith === userId && 
        (share.permission === 'EDIT' || share.permission === 'ADMIN')
      );

    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to create subtasks for this task');
    }

    return this.prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        user: {
          connect: { id: userId },
        },
        parent: {
          connect: { id: parentId },
        },
      },
      include: {
        user: true,
        parent: true,
        attachments: true,
        shares: true,
        comments: true,
        subtasks: true,
      },
    });
  }

  async getTaskProgress(taskId: string, userId: string) {
    const task = await this.findById(taskId, userId);
    
    const subtasks = await this.prisma.task.findMany({
      where: { parentId: taskId },
      select: {
        id: true,
        status: true,
      },
    });

    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(st => st.status === 'COMPLETED').length;
    
    return {
      task,
      totalSubtasks,
      completedSubtasks,
      progressPercentage: totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0,
    };
  }
}
