import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { AcademyTestimonialService } from './testimonial.service';
import { AcademyTestimonialModel } from './models/testimonial.model';
import { 
  CreateAcademyTestimonialInput, 
  UpdateAcademyTestimonialInput, 
  AcademyTestimonialFilterInput 
} from './dto/testimonial.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => AcademyTestimonialModel)
export class AcademyTestimonialResolver {
  constructor(private readonly testimonialService: AcademyTestimonialService) {}

  // Public Queries
  @Query(() => [AcademyTestimonialModel], { name: 'getAcademyTestimonials' })
  @Public()
  async getTestimonials(
    @Args('filter', { nullable: true }) filter?: AcademyTestimonialFilterInput
  ) {
    return this.testimonialService.findAll(filter);
  }

  @Query(() => AcademyTestimonialModel, { name: 'getAcademyTestimonial' })
  @Public()
  async getTestimonial(@Args('id', { type: () => ID }) id: string) {
    return this.testimonialService.findOne(id);
  }

  @Query(() => [AcademyTestimonialModel], { name: 'getFeaturedAcademyTestimonials' })
  @Public()
  async getFeaturedTestimonials() {
    return this.testimonialService.findFeatured();
  }

  @Query(() => [AcademyTestimonialModel], { name: 'getActiveAcademyTestimonials' })
  @Public()
  async getActiveTestimonials() {
    return this.testimonialService.findActive();
  }

  // Admin Mutations
  @Mutation(() => AcademyTestimonialModel, { name: 'createAcademyTestimonial' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createTestimonial(@Args('input') input: CreateAcademyTestimonialInput) {
    return this.testimonialService.create(input);
  }

  @Mutation(() => AcademyTestimonialModel, { name: 'updateAcademyTestimonial' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateTestimonial(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAcademyTestimonialInput
  ) {
    return this.testimonialService.update(id, input);
  }

  @Mutation(() => AcademyTestimonialModel, { name: 'deleteAcademyTestimonial' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteTestimonial(@Args('id', { type: () => ID }) id: string) {
    return this.testimonialService.delete(id);
  }

  @Mutation(() => AcademyTestimonialModel, { name: 'toggleAcademyTestimonialActive' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleTestimonialActive(@Args('id', { type: () => ID }) id: string) {
    return this.testimonialService.toggleActive(id);
  }

  @Mutation(() => AcademyTestimonialModel, { name: 'toggleAcademyTestimonialFeatured' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleTestimonialFeatured(@Args('id', { type: () => ID }) id: string) {
    return this.testimonialService.toggleFeatured(id);
  }
}
