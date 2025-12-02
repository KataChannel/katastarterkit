import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { AcademyCourseService } from './course.service';
import { AcademyCourseModel } from './models/course.model';
import { CreateAcademyCourseInput, UpdateAcademyCourseInput, AcademyCourseFilterInput } from './dto/course.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

// Public decorator
const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => AcademyCourseModel)
export class AcademyCourseResolver {
  constructor(private readonly courseService: AcademyCourseService) {}

  // ============ PUBLIC QUERIES ============

  @Public()
  @Query(() => [AcademyCourseModel], { name: 'academyCourses', description: 'Lấy danh sách khóa học' })
  async getCourses(
    @Args('filter', { nullable: true }) filter?: AcademyCourseFilterInput,
  ) {
    return this.courseService.findAll(filter);
  }

  @Public()
  @Query(() => Int, { name: 'academyCoursesCount', description: 'Đếm số khóa học' })
  async getCoursesCount(
    @Args('filter', { nullable: true }) filter?: AcademyCourseFilterInput,
  ) {
    return this.courseService.count(filter);
  }

  @Public()
  @Query(() => AcademyCourseModel, { name: 'academyCourse', description: 'Lấy chi tiết khóa học theo ID' })
  async getCourse(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.findOne(id);
  }

  @Public()
  @Query(() => AcademyCourseModel, { name: 'academyCourseBySlug', description: 'Lấy chi tiết khóa học theo slug' })
  async getCourseBySlug(@Args('slug') slug: string) {
    return this.courseService.findBySlug(slug);
  }

  @Public()
  @Query(() => [AcademyCourseModel], { name: 'featuredAcademyCourses', description: 'Lấy khóa học nổi bật' })
  async getFeaturedCourses(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 6 }) limit: number,
  ) {
    return this.courseService.getFeaturedCourses(limit);
  }

  @Public()
  @Query(() => [AcademyCourseModel], { name: 'popularAcademyCourses', description: 'Lấy khóa học phổ biến' })
  async getPopularCourses(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 6 }) limit: number,
  ) {
    return this.courseService.getPopularCourses(limit);
  }

  @Public()
  @Query(() => [AcademyCourseModel], { name: 'newAcademyCourses', description: 'Lấy khóa học mới' })
  async getNewCourses(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 6 }) limit: number,
  ) {
    return this.courseService.getNewCourses(limit);
  }

  @Public()
  @Query(() => [AcademyCourseModel], { name: 'relatedAcademyCourses', description: 'Lấy khóa học liên quan' })
  async getRelatedCourses(
    @Args('courseId', { type: () => ID }) courseId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 4 }) limit: number,
  ) {
    return this.courseService.getRelatedCourses(courseId, limit);
  }

  // ============ ADMIN MUTATIONS ============

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => AcademyCourseModel, { description: 'Tạo khóa học mới' })
  async createAcademyCourse(@Args('input') input: CreateAcademyCourseInput) {
    return this.courseService.create(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => AcademyCourseModel, { description: 'Cập nhật khóa học' })
  async updateAcademyCourse(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAcademyCourseInput,
  ) {
    return this.courseService.update(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean, { description: 'Xóa khóa học' })
  async deleteAcademyCourse(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => AcademyCourseModel, { description: 'Bật/tắt trạng thái hoạt động' })
  async toggleAcademyCourseActive(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.toggleActive(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => AcademyCourseModel, { description: 'Bật/tắt trạng thái nổi bật' })
  async toggleAcademyCourseFeatured(@Args('id', { type: () => ID }) id: string) {
    return this.courseService.toggleFeatured(id);
  }
}
