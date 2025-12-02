import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AcademyRegistrationStatus } from '@prisma/client';
import { 
  CreateAcademyRegistrationInput, 
  UpdateAcademyRegistrationInput, 
  AcademyRegistrationFilterInput 
} from './dto/registration.dto';

@Injectable()
export class AcademyRegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter?: AcademyRegistrationFilterInput) {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { fullName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
        { phone: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.courseId) {
      where.courseId = filter.courseId;
    }

    if (filter?.branchId) {
      where.branchId = filter.branchId;
    }

    if (filter?.source) {
      where.source = filter.source;
    }

    return this.prisma.academyCourseRegistration.findMany({
      where,
      include: {
        course: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const registration = await this.prisma.academyCourseRegistration.findUnique({
      where: { id },
      include: {
        course: true,
        branch: true,
      },
    });

    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    return registration;
  }

  async findByPhone(phone: string) {
    return this.prisma.academyCourseRegistration.findMany({
      where: { phone },
      include: {
        course: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.academyCourseRegistration.findMany({
      where: { courseId },
      include: {
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: CreateAcademyRegistrationInput) {
    // Check if already registered for this course with same phone
    const existingRegistration = await this.prisma.academyCourseRegistration.findFirst({
      where: {
        phone: input.phone,
        courseId: input.courseId,
      },
    });

    if (existingRegistration) {
      throw new ConflictException('Số điện thoại này đã đăng ký khóa học này rồi');
    }

    return this.prisma.academyCourseRegistration.create({
      data: {
        ...input,
        birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
        status: AcademyRegistrationStatus.NEW,
      },
      include: {
        course: true,
      },
    });
  }

  async update(id: string, input: UpdateAcademyRegistrationInput) {
    const existing = await this.prisma.academyCourseRegistration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    const updateData: any = { ...input };
    if (input.birthDate) {
      updateData.birthDate = new Date(input.birthDate);
    }

    return this.prisma.academyCourseRegistration.update({
      where: { id },
      data: updateData,
      include: {
        course: true,
      },
    });
  }

  async updateStatus(id: string, status: AcademyRegistrationStatus, statusNote?: string) {
    const existing = await this.prisma.academyCourseRegistration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    const updateData: any = { status, statusNote };
    
    // Update timestamp based on status
    if (status === AcademyRegistrationStatus.CONTACTED) {
      updateData.contactedAt = new Date();
    } else if (status === AcademyRegistrationStatus.CONFIRMED) {
      updateData.confirmedAt = new Date();
    } else if (status === AcademyRegistrationStatus.ENROLLED) {
      updateData.enrolledAt = new Date();
    }

    return this.prisma.academyCourseRegistration.update({
      where: { id },
      data: updateData,
      include: {
        course: true,
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.academyCourseRegistration.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    return this.prisma.academyCourseRegistration.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, newCount, contacted, confirmed, enrolled, cancelled, completed] = await Promise.all([
      this.prisma.academyCourseRegistration.count(),
      this.prisma.academyCourseRegistration.count({ where: { status: AcademyRegistrationStatus.NEW } }),
      this.prisma.academyCourseRegistration.count({ where: { status: AcademyRegistrationStatus.CONTACTED } }),
      this.prisma.academyCourseRegistration.count({ where: { status: AcademyRegistrationStatus.CONFIRMED } }),
      this.prisma.academyCourseRegistration.count({ where: { status: AcademyRegistrationStatus.ENROLLED } }),
      this.prisma.academyCourseRegistration.count({ where: { status: AcademyRegistrationStatus.CANCELLED } }),
      this.prisma.academyCourseRegistration.count({ where: { status: AcademyRegistrationStatus.COMPLETED } }),
    ]);

    return {
      total,
      new: newCount,
      contacted,
      confirmed,
      enrolled,
      cancelled,
      completed,
    };
  }
}
