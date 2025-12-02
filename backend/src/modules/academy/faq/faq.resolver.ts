import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { AcademyFAQService } from './faq.service';
import { AcademyFAQModel } from './models/faq.model';
import { 
  CreateAcademyFAQInput, 
  UpdateAcademyFAQInput, 
  AcademyFAQFilterInput 
} from './dto/faq.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => AcademyFAQModel)
export class AcademyFAQResolver {
  constructor(private readonly faqService: AcademyFAQService) {}

  // Public Queries
  @Query(() => [AcademyFAQModel], { name: 'getAcademyFAQs' })
  @Public()
  async getFAQs(
    @Args('filter', { nullable: true }) filter?: AcademyFAQFilterInput
  ) {
    return this.faqService.findAll(filter);
  }

  @Query(() => AcademyFAQModel, { name: 'getAcademyFAQ' })
  @Public()
  async getFAQ(@Args('id', { type: () => ID }) id: string) {
    return this.faqService.findOne(id);
  }

  @Query(() => [AcademyFAQModel], { name: 'getActiveAcademyFAQs' })
  @Public()
  async getActiveFAQs() {
    return this.faqService.findActive();
  }

  @Query(() => [AcademyFAQModel], { name: 'getAcademyFAQsByCategory' })
  @Public()
  async getFAQsByCategory(@Args('category') category: string) {
    return this.faqService.findByCategory(category);
  }

  @Query(() => [AcademyFAQModel], { name: 'getAcademyFAQsByCourse' })
  @Public()
  async getFAQsByCourse(@Args('courseId', { type: () => ID }) courseId: string) {
    return this.faqService.findByCourse(courseId);
  }

  @Query(() => [String], { name: 'getAcademyFAQCategories' })
  @Public()
  async getFAQCategories() {
    return this.faqService.getCategories();
  }

  // Admin Mutations
  @Mutation(() => AcademyFAQModel, { name: 'createAcademyFAQ' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createFAQ(@Args('input') input: CreateAcademyFAQInput) {
    return this.faqService.create(input);
  }

  @Mutation(() => AcademyFAQModel, { name: 'updateAcademyFAQ' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateFAQ(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAcademyFAQInput
  ) {
    return this.faqService.update(id, input);
  }

  @Mutation(() => AcademyFAQModel, { name: 'deleteAcademyFAQ' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteFAQ(@Args('id', { type: () => ID }) id: string) {
    return this.faqService.delete(id);
  }

  @Mutation(() => AcademyFAQModel, { name: 'toggleAcademyFAQActive' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleFAQActive(@Args('id', { type: () => ID }) id: string) {
    return this.faqService.toggleActive(id);
  }
}
