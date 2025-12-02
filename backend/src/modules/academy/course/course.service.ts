import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAcademyCourseInput, UpdateAcademyCourseInput, AcademyCourseFilterInput } from './dto/course.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AcademyCourseService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
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

  async findAll(filter?: AcademyCourseFilterInput) {
    const where: Prisma.AcademyCourseWhereInput = {};

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.isFeatured !== undefined) {
      where.isFeatured = filter.isFeatured;
    }

    if (filter?.isPopular !== undefined) {
      where.isPopular = filter.isPopular;
    }

    if (filter?.isNew !== undefined) {
      where.isNew = filter.isNew;
    }

    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }

    if (filter?.categorySlug) {
      where.category = { slug: filter.categorySlug };
    }

    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { shortDescription: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.academyCourse.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: filter?.limit || undefined,
      skip: filter?.offset || undefined,
    });
  }

  async count(filter?: AcademyCourseFilterInput) {
    const where: Prisma.AcademyCourseWhereInput = {};

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }

    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.academyCourse.count({ where });
  }

  async findOne(id: string) {
    const course = await this.prisma.academyCourse.findUnique({
      where: { id },
      include: {
        category: true,
        registrations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Khóa học với ID ${id} không tồn tại`);
    }

    return course;
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.academyCourse.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Khóa học với slug ${slug} không tồn tại`);
    }

    // Increment views
    await this.prisma.academyCourse.update({
      where: { id: course.id },
      data: { views: { increment: 1 } },
    });

    return course;
  }

  async create(input: CreateAcademyCourseInput) {
    const slug = input.slug || this.generateSlug(input.title);

    const existingSlug = await this.prisma.academyCourse.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Slug "${slug}" đã tồn tại`);
    }

    return this.prisma.academyCourse.create({
      data: {
        ...input,
        slug,
        price: input.price ? new Prisma.Decimal(input.price) : null,
        discountPrice: input.discountPrice ? new Prisma.Decimal(input.discountPrice) : null,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, input: UpdateAcademyCourseInput) {
    await this.findOne(id);

    if (input.slug) {
      const existingSlug = await this.prisma.academyCourse.findFirst({
        where: {
          slug: input.slug,
          id: { not: id },
        },
      });

      if (existingSlug) {
        throw new ConflictException(`Slug "${input.slug}" đã tồn tại`);
      }
    }

    return this.prisma.academyCourse.update({
      where: { id },
      data: {
        ...input,
        price: input.price !== undefined ? (input.price ? new Prisma.Decimal(input.price) : null) : undefined,
        discountPrice: input.discountPrice !== undefined ? (input.discountPrice ? new Prisma.Decimal(input.discountPrice) : null) : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    await this.prisma.academyCourse.delete({
      where: { id },
    });

    return true;
  }

  async toggleActive(id: string) {
    const course = await this.findOne(id);

    return this.prisma.academyCourse.update({
      where: { id },
      data: { isActive: !course.isActive },
      include: { category: true },
    });
  }

  async toggleFeatured(id: string) {
    const course = await this.findOne(id);

    return this.prisma.academyCourse.update({
      where: { id },
      data: { isFeatured: !course.isFeatured },
      include: { category: true },
    });
  }

  async getFeaturedCourses(limit = 6) {
    return this.prisma.academyCourse.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: { category: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    });
  }

  async getPopularCourses(limit = 6) {
    return this.prisma.academyCourse.findMany({
      where: {
        isActive: true,
        isPopular: true,
      },
      include: { category: true },
      orderBy: [{ enrollments: 'desc' }, { views: 'desc' }],
      take: limit,
    });
  }

  async getNewCourses(limit = 6) {
    return this.prisma.academyCourse.findMany({
      where: {
        isActive: true,
        isNew: true,
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRelatedCourses(courseId: string, limit = 4) {
    const course = await this.findOne(courseId);

    return this.prisma.academyCourse.findMany({
      where: {
        isActive: true,
        id: { not: courseId },
        categoryId: course.categoryId,
      },
      include: { category: true },
      orderBy: [{ displayOrder: 'asc' }, { views: 'desc' }],
      take: limit,
    });
  }
}
