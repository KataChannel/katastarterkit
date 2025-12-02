import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { AcademyInstructorService } from './instructor.service';
import { AcademyInstructorModel } from './models/instructor.model';
import { 
  CreateAcademyInstructorInput, 
  UpdateAcademyInstructorInput, 
  AcademyInstructorFilterInput 
} from './dto/instructor.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => AcademyInstructorModel)
export class AcademyInstructorResolver {
  constructor(private readonly instructorService: AcademyInstructorService) {}

  // Public Queries
  @Query(() => [AcademyInstructorModel], { name: 'getAcademyInstructors' })
  @Public()
  async getInstructors(
    @Args('filter', { nullable: true }) filter?: AcademyInstructorFilterInput
  ) {
    return this.instructorService.findAll(filter);
  }

  @Query(() => AcademyInstructorModel, { name: 'getAcademyInstructor' })
  @Public()
  async getInstructor(@Args('id', { type: () => ID }) id: string) {
    return this.instructorService.findOne(id);
  }

  @Query(() => AcademyInstructorModel, { name: 'getAcademyInstructorBySlug' })
  @Public()
  async getInstructorBySlug(@Args('slug') slug: string) {
    return this.instructorService.findBySlug(slug);
  }

  @Query(() => [AcademyInstructorModel], { name: 'getFeaturedAcademyInstructors' })
  @Public()
  async getFeaturedInstructors() {
    return this.instructorService.findFeatured();
  }

  @Query(() => [AcademyInstructorModel], { name: 'getActiveAcademyInstructors' })
  @Public()
  async getActiveInstructors() {
    return this.instructorService.findActive();
  }

  // Admin Mutations
  @Mutation(() => AcademyInstructorModel, { name: 'createAcademyInstructor' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createInstructor(@Args('input') input: CreateAcademyInstructorInput) {
    return this.instructorService.create(input);
  }

  @Mutation(() => AcademyInstructorModel, { name: 'updateAcademyInstructor' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateInstructor(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAcademyInstructorInput
  ) {
    return this.instructorService.update(id, input);
  }

  @Mutation(() => AcademyInstructorModel, { name: 'deleteAcademyInstructor' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteInstructor(@Args('id', { type: () => ID }) id: string) {
    return this.instructorService.delete(id);
  }

  @Mutation(() => AcademyInstructorModel, { name: 'toggleAcademyInstructorActive' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleInstructorActive(@Args('id', { type: () => ID }) id: string) {
    return this.instructorService.toggleActive(id);
  }

  @Mutation(() => AcademyInstructorModel, { name: 'toggleAcademyInstructorFeatured' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleInstructorFeatured(@Args('id', { type: () => ID }) id: string) {
    return this.instructorService.toggleFeatured(id);
  }
}
