import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseFiltersInput } from './dto/course-filters.input';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRoleType } from '@prisma/client';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course, { name: 'createCourse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  createCourse(
    @CurrentUser() user: any,
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    return this.coursesService.create(user.userId, createCourseInput);
  }

  @Query(() => [Course], { name: 'courses' })
  findAll(@Args('filters', { nullable: true }) filters?: CourseFiltersInput) {
    return this.coursesService.findAll(filters || new CourseFiltersInput());
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.coursesService.findOne(id);
  }

  @Query(() => Course, { name: 'courseBySlug' })
  findBySlug(@Args('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Query(() => [Course], { name: 'myCourses' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  getMyCourses(@CurrentUser() user: any) {
    return this.coursesService.getMyCourses(user.userId);
  }

  @Mutation(() => Course, { name: 'updateCourse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  updateCourse(
    @CurrentUser() user: any,
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.update(updateCourseInput.id, user.userId, updateCourseInput);
  }

  @Mutation(() => Course, { name: 'publishCourse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  publishCourse(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.coursesService.publish(id, user.userId);
  }

  @Mutation(() => Course, { name: 'archiveCourse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  archiveCourse(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.coursesService.archive(id, user.userId);
  }

  @Mutation(() => Boolean, { name: 'deleteCourse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  async removeCourse(
    @CurrentUser() user: any,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const result = await this.coursesService.remove(id, user.userId);
    return result.success;
  }
}
