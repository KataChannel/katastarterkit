import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  CreateAcademyFAQInput, 
  UpdateAcademyFAQInput, 
  AcademyFAQFilterInput 
} from './dto/faq.dto';

@Injectable()
export class AcademyFAQService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter?: AcademyFAQFilterInput) {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { question: { contains: filter.search, mode: 'insensitive' } },
        { answer: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.category) {
      where.category = filter.category;
    }

    return this.prisma.academyFAQ.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const faq = await this.prisma.academyFAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return faq;
  }

  async findActive() {
    return this.prisma.academyFAQ.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.academyFAQ.findMany({
      where: { 
        category,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getCategories() {
    const faqs = await this.prisma.academyFAQ.findMany({
      where: { 
        isActive: true,
        category: { not: null },
      },
      select: { category: true },
      distinct: ['category'],
    });

    return faqs.map(f => f.category).filter(Boolean);
  }

  async create(input: CreateAcademyFAQInput) {
    return this.prisma.academyFAQ.create({
      data: input,
    });
  }

  async update(id: string, input: UpdateAcademyFAQInput) {
    const existing = await this.prisma.academyFAQ.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return this.prisma.academyFAQ.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.academyFAQ.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return this.prisma.academyFAQ.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const existing = await this.prisma.academyFAQ.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return this.prisma.academyFAQ.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }
}
