import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  CreateAcademyInstructorInput, 
  UpdateAcademyInstructorInput, 
  AcademyInstructorFilterInput 
} from './dto/instructor.dto';

@Injectable()
export class AcademyInstructorService {
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
      const existing = await this.prisma.academyInstructor.findUnique({
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

  async findAll(filter?: AcademyInstructorFilterInput) {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { title: { contains: filter.search, mode: 'insensitive' } },
        { specialization: { contains: filter.search, mode: 'insensitive' } },
        { bio: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.isFeatured !== undefined) {
      where.isFeatured = filter.isFeatured;
    }

    return this.prisma.academyInstructor.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const instructor = await this.prisma.academyInstructor.findUnique({
      where: { id },
      include: {
        courses: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return instructor;
  }

  async findBySlug(slug: string) {
    const instructor = await this.prisma.academyInstructor.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException(`Instructor with slug "${slug}" not found`);
    }

    return instructor;
  }

  async findFeatured() {
    return this.prisma.academyInstructor.findMany({
      where: { 
        isActive: true,
        isFeatured: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.academyInstructor.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(input: CreateAcademyInstructorInput) {
    const slug = input.slug || this.generateSlug(input.name);
    const uniqueSlug = await this.ensureUniqueSlug(slug);

    return this.prisma.academyInstructor.create({
      data: {
        ...input,
        slug: uniqueSlug,
      },
    });
  }

  async update(id: string, input: UpdateAcademyInstructorInput) {
    const existing = await this.prisma.academyInstructor.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = await this.ensureUniqueSlug(input.slug, id);
    } else if (input.name && !input.slug) {
      slug = await this.ensureUniqueSlug(this.generateSlug(input.name), id);
    }

    return this.prisma.academyInstructor.update({
      where: { id },
      data: {
        ...input,
        slug,
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.academyInstructor.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return this.prisma.academyInstructor.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const existing = await this.prisma.academyInstructor.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return this.prisma.academyInstructor.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }

  async toggleFeatured(id: string) {
    const existing = await this.prisma.academyInstructor.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return this.prisma.academyInstructor.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
  }
}
