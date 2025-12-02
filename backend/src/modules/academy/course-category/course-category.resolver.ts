import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { AcademyCourseCategoryService } from './course-category.service';
import { AcademyCourseCategoryModel } from './models/course-category.model';
import { 
  CreateAcademyCourseCategoryInput, 
  UpdateAcademyCourseCategoryInput, 
  AcademyCourseCategoryFilterInput 
} from './dto/course-category.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => AcademyCourseCategoryModel)
export class AcademyCourseCategoryResolver {
  constructor(private readonly courseCategoryService: AcademyCourseCategoryService) {}

  // Public Queries
  @Query(() => [AcademyCourseCategoryModel], { name: 'getAcademyCourseCategories' })
  @Public()
  async getCategories(
    @Args('filter', { nullable: true }) filter?: AcademyCourseCategoryFilterInput
  ) {
    return this.courseCategoryService.findAll(filter);
  }

  @Query(() => AcademyCourseCategoryModel, { name: 'getAcademyCourseCategory' })
  @Public()
  async getCategory(@Args('id', { type: () => ID }) id: string) {
    return this.courseCategoryService.findOne(id);
  }

  @Query(() => AcademyCourseCategoryModel, { name: 'getAcademyCourseCategoryBySlug' })
  @Public()
  async getCategoryBySlug(@Args('slug') slug: string) {
    return this.courseCategoryService.findBySlug(slug);
  }

  @Query(() => [AcademyCourseCategoryModel], { name: 'getActiveAcademyCourseCategories' })
  @Public()
  async getActiveCategories() {
    return this.courseCategoryService.findActive();
  }

  // Admin Mutations
  @Mutation(() => AcademyCourseCategoryModel, { name: 'createAcademyCourseCategory' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategory(@Args('input') input: CreateAcademyCourseCategoryInput) {
    return this.courseCategoryService.create(input);
  }

  @Mutation(() => AcademyCourseCategoryModel, { name: 'updateAcademyCourseCategory' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAcademyCourseCategoryInput
  ) {
    return this.courseCategoryService.update(id, input);
  }

  @Mutation(() => AcademyCourseCategoryModel, { name: 'deleteAcademyCourseCategory' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    return this.courseCategoryService.delete(id);
  }

  @Mutation(() => AcademyCourseCategoryModel, { name: 'toggleAcademyCourseCategoryActive' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleCategoryActive(@Args('id', { type: () => ID }) id: string) {
    return this.courseCategoryService.toggleActive(id);
  }

  @Mutation(() => AcademyCourseCategoryModel, { name: 'updateAcademyCourseCategoryDisplayOrder' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategoryDisplayOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('displayOrder', { type: () => Int }) displayOrder: number
  ) {
    return this.courseCategoryService.updateDisplayOrder(id, displayOrder);
  }
}
