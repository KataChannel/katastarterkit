import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRoadmapItemInput,
  UpdateRoadmapItemInput,
} from './dto/roadmap.dto';

@Injectable()
export class RoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Queries ====================

  async getRoadmapItems(projectId: string) {
    return this.prisma.roadmapItem.findMany({
      where: { projectId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // IN_PROGRESS first
        { priority: 'desc' }, // CRITICAL first
        { startDate: 'asc' },
      ],
    });
  }

  async getRoadmapItem(id: string) {
    const item = await this.prisma.roadmapItem.findUnique({
      where: { id },
      include: {
        owner: {
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

    if (!item) {
      throw new NotFoundException(`Roadmap item with ID ${id} not found`);
    }

    return item;
  }

  async getRoadmapByQuarter(projectId: string, quarter: string) {
    return this.prisma.roadmapItem.findMany({
      where: {
        projectId,
        quarter,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { progress: 'desc' },
      ],
    });
  }

  // ==================== Mutations ====================

  async createRoadmapItem(input: CreateRoadmapItemInput) {
    const { projectId, ownerId, ...data } = input;

    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if owner exists (if provided)
    if (ownerId) {
      const owner = await this.prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!owner) {
        throw new NotFoundException(`User with ID ${ownerId} not found`);
      }
    }

    return this.prisma.roadmapItem.create({
      data: {
        ...data,
        project: {
          connect: { id: projectId },
        },
        ...(ownerId && {
          owner: {
            connect: { id: ownerId },
          },
        }),
      },
      include: {
        owner: {
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

  async updateRoadmapItem(input: UpdateRoadmapItemInput) {
    const { id, ownerId, ...data } = input;

    const item = await this.prisma.roadmapItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Roadmap item with ID ${id} not found`);
    }

    // Check if new owner exists (if provided)
    if (ownerId) {
      const owner = await this.prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!owner) {
        throw new NotFoundException(`User with ID ${ownerId} not found`);
      }
    }

    return this.prisma.roadmapItem.update({
      where: { id },
      data: {
        ...data,
        ...(ownerId !== undefined && {
          owner: ownerId
            ? { connect: { id: ownerId } }
            : { disconnect: true },
        }),
      },
      include: {
        owner: {
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

  async deleteRoadmapItem(id: string) {
    const item = await this.prisma.roadmapItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Roadmap item with ID ${id} not found`);
    }

    await this.prisma.roadmapItem.delete({
      where: { id },
    });

    return { success: true, message: 'Roadmap item deleted successfully' };
  }
}
