import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  CreateAcademyTestimonialInput, 
  UpdateAcademyTestimonialInput, 
  AcademyTestimonialFilterInput 
} from './dto/testimonial.dto';

@Injectable()
export class AcademyTestimonialService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter?: AcademyTestimonialFilterInput) {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { studentName: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
        { courseName: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.isFeatured !== undefined) {
      where.isFeatured = filter.isFeatured;
    }

    if (filter?.isVerified !== undefined) {
      where.isVerified = filter.isVerified;
    }

    return this.prisma.academyTestimonial.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.academyTestimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return testimonial;
  }

  async findFeatured() {
    return this.prisma.academyTestimonial.findMany({
      where: { 
        isActive: true,
        isFeatured: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.academyTestimonial.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(input: CreateAcademyTestimonialInput) {
    return this.prisma.academyTestimonial.create({
      data: {
        ...input,
        completedDate: input.completedDate ? new Date(input.completedDate) : undefined,
      },
    });
  }

  async update(id: string, input: UpdateAcademyTestimonialInput) {
    const existing = await this.prisma.academyTestimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    const updateData: any = { ...input };
    if (input.completedDate) {
      updateData.completedDate = new Date(input.completedDate);
    }
    if (input.isVerified === true) {
      updateData.verifiedAt = new Date();
    }

    return this.prisma.academyTestimonial.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.academyTestimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return this.prisma.academyTestimonial.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const existing = await this.prisma.academyTestimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return this.prisma.academyTestimonial.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  }

  async toggleFeatured(id: string) {
    const existing = await this.prisma.academyTestimonial.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return this.prisma.academyTestimonial.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
  }
}
