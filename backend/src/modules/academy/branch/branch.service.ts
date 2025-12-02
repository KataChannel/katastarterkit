import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBranchInput, UpdateBranchInput, BranchFilterInput } from './dto/branch.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async findAll(filter?: BranchFilterInput) {
    const where: Prisma.BranchWhereInput = {};

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.isFeatured !== undefined) {
      where.isFeatured = filter.isFeatured;
    }

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { address: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.branch.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException(`Chi nhánh với ID ${id} không tồn tại`);
    }

    return branch;
  }

  async findBySlug(slug: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { slug },
    });

    if (!branch) {
      throw new NotFoundException(`Chi nhánh với slug ${slug} không tồn tại`);
    }

    return branch;
  }

  async create(input: CreateBranchInput) {
    const slug = input.slug || this.generateSlug(input.name);

    // Check slug uniqueness
    const existingSlug = await this.prisma.branch.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Slug "${slug}" đã tồn tại`);
    }

    return this.prisma.branch.create({
      data: {
        ...input,
        slug,
      },
    });
  }

  async update(id: string, input: UpdateBranchInput) {
    await this.findOne(id);

    // Check slug uniqueness if updating slug
    if (input.slug) {
      const existingSlug = await this.prisma.branch.findFirst({
        where: {
          slug: input.slug,
          id: { not: id },
        },
      });

      if (existingSlug) {
        throw new ConflictException(`Slug "${input.slug}" đã tồn tại`);
      }
    }

    return this.prisma.branch.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    await this.prisma.branch.delete({
      where: { id },
    });

    return true;
  }

  async updateDisplayOrder(id: string, displayOrder: number) {
    await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: { displayOrder },
    });
  }

  async toggleActive(id: string) {
    const branch = await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: { isActive: !branch.isActive },
    });
  }

  async toggleFeatured(id: string) {
    const branch = await this.findOne(id);

    return this.prisma.branch.update({
      where: { id },
      data: { isFeatured: !branch.isFeatured },
    });
  }
}
