import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFiltersInput } from './dto/course-filters.input';
import { Prisma, CourseStatus } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCourseInput: CreateCourseInput) {
    const { title, categoryId, ...rest } = createCourseInput;
    
    // Generate slug from title
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (await this.prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Validate category exists if provided
    if (categoryId) {
      const category = await this.prisma.courseCategory.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    return this.prisma.course.create({
      data: {
        ...rest,
        title,
        slug,
        instructorId: userId,
        categoryId,
      },
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  async findAll(filters: CourseFiltersInput) {
    const { 
      search, 
      categoryId, 
      level, 
      status, 
      minPrice, 
      maxPrice, 
      instructorId,
      tags,
      page, 
      limit, 
      sortBy, 
      sortOrder 
    } = filters;

    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (level) {
      where.level = level;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Tags filter removed - field doesn't exist in schema

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          instructor: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          category: true,
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug ${slug} not found`);
    }

    return course;
  }

  async update(id: string, userId: string, updateCourseInput: UpdateCourseInput) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Check if user is the instructor or admin
    if (course.instructorId !== userId) {
      throw new ForbiddenException('You do not have permission to update this course');
    }

    const { id: _, categoryId, ...rest } = updateCourseInput;

    // Validate category exists if provided
    if (categoryId) {
      const category = await this.prisma.courseCategory.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        ...rest,
        categoryId,
      },
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  async publish(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You do not have permission to publish this course');
    }

    // Validation: Course must have at least one module with lessons
    if (course.modules.length === 0) {
      throw new BadRequestException('Course must have at least one module before publishing');
    }

    const hasLessons = course.modules.some(module => module.lessons.length > 0);
    if (!hasLessons) {
      throw new BadRequestException('Course must have at least one lesson before publishing');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        status: CourseStatus.PUBLISHED,
      },
    });
  }

  async archive(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You do not have permission to archive this course');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        status: CourseStatus.ARCHIVED,
      },
    });
  }

  async remove(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this course');
    }

    // Prevent deletion if there are active enrollments
    if (course.enrollments.length > 0) {
      throw new BadRequestException('Cannot delete course with active enrollments. Archive it instead.');
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return { success: true, message: 'Course deleted successfully' };
  }

  async getMyCourses(userId: string) {
    return this.prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        category: true,
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
