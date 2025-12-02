import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  CreateAcademyCourseCategoryInput, 
  UpdateAcademyCourseCategoryInput, 
  AcademyCourseCategoryFilterInput 
} from './dto/course-category.dto';

@Injectable()
export class AcademyCourseCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    let finalSlug = slug;
    let counter = 1;
    
    while (true) {
      const existing = await this.prisma.academyCourseCategory.findUnique({
        where: { slug: finalSlug },
      });
      
      if (!existing || (excludeId && existing.id === excludeId)) {
        break;
      }
      
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    return finalSlug;
  }

  async findAll(filter?: AcademyCourseCategoryFilterInput) {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    const categories = await this.prisma.academyCourseCategory.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const courseCount = await this.prisma.academyCourse.count({
          where: { categoryId: category.id },
        });
        return {
          ...category,
          courseCount,
        };
      })
    );

    return categoriesWithCount;
  }

  async findOne(id: string) {
    const category = await this.prisma.academyCourseCategory.findUnique({
      where: { id },
      include: {
        courses: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }

    const courseCount = await this.prisma.academyCourse.count({
      where: { categoryId: id },
    });

    return {
      ...category,
      courseCount,
    };
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.academyCourseCategory.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Course category with slug "${slug}" not found`);
    }

    const courseCount = await this.prisma.academyCourse.count({
      where: { categoryId: category.id },
    });

    return {
      ...category,
      courseCount,
    };
  }

  async findActive() {
    const categories = await this.prisma.academyCourseCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const courseCount = await this.prisma.academyCourse.count({
          where: { categoryId: category.id },
        });
        return {
          ...category,
          courseCount,
        };
      })
    );

    return categoriesWithCount;
  }

  async create(input: CreateAcademyCourseCategoryInput) {
    const slug = input.slug || this.generateSlug(input.name);
    const uniqueSlug = await this.ensureUniqueSlug(slug);

    return this.prisma.academyCourseCategory.create({
      data: {
        ...input,
        slug: uniqueSlug,
      },
    });
  }

  async update(id: string, input: UpdateAcademyCourseCategoryInput) {
    const existing = await this.prisma.academyCourseCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }

    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = await this.ensureUniqueSlug(input.slug, id);
    } else if (input.name && !input.slug) {
      slug = await this.ensureUniqueSlug(this.generateSlug(input.name), id);
    }

    return this.prisma.academyCourseCategory.update({
      where: { id },
      data: {
        ...input,
        slug,
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.academyCourseCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }

    if (existing._count.courses > 0) {
      throw new ConflictException(
        `Cannot delete category with ${existing._count.courses} courses. Please move or delete courses first.`
      );
    }

    return this.prisma.academyCourseCategory.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const existing = await this.prisma.academyCourseCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }

    return this.prisma.academyCourseCategory.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }

  async updateDisplayOrder(id: string, displayOrder: number) {
    const existing = await this.prisma.academyCourseCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }

    return this.prisma.academyCourseCategory.update({
      where: { id },
      data: { displayOrder },
    });
  }
}
