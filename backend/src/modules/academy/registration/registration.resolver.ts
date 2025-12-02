import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { AcademyRegistrationService } from './registration.service';
import { AcademyCourseRegistrationModel, AcademyRegistrationStatus } from './models/registration.model';
import { 
  CreateAcademyRegistrationInput, 
  UpdateAcademyRegistrationInput, 
  AcademyRegistrationFilterInput 
} from './dto/registration.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => AcademyCourseRegistrationModel)
export class AcademyRegistrationResolver {
  constructor(private readonly registrationService: AcademyRegistrationService) {}

  // Admin Queries
  @Query(() => [AcademyCourseRegistrationModel], { name: 'getAcademyRegistrations' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRegistrations(
    @Args('filter', { nullable: true }) filter?: AcademyRegistrationFilterInput
  ) {
    return this.registrationService.findAll(filter);
  }

  @Query(() => AcademyCourseRegistrationModel, { name: 'getAcademyRegistration' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRegistration(@Args('id', { type: () => ID }) id: string) {
    return this.registrationService.findOne(id);
  }

  @Query(() => [AcademyCourseRegistrationModel], { name: 'getAcademyRegistrationsByCourse' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRegistrationsByCourse(@Args('courseId', { type: () => ID }) courseId: string) {
    return this.registrationService.findByCourse(courseId);
  }

  @Query(() => [AcademyCourseRegistrationModel], { name: 'getAcademyRegistrationsByPhone' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getRegistrationsByPhone(@Args('phone') phone: string) {
    return this.registrationService.findByPhone(phone);
  }

  // Public Mutation - Anyone can register
  @Mutation(() => AcademyCourseRegistrationModel, { name: 'createAcademyRegistration' })
  @Public()
  async createRegistration(@Args('input') input: CreateAcademyRegistrationInput) {
    return this.registrationService.create(input);
  }

  // Admin Mutations
  @Mutation(() => AcademyCourseRegistrationModel, { name: 'updateAcademyRegistration' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRegistration(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAcademyRegistrationInput
  ) {
    return this.registrationService.update(id, input);
  }

  @Mutation(() => AcademyCourseRegistrationModel, { name: 'updateAcademyRegistrationStatus' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRegistrationStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => AcademyRegistrationStatus }) status: AcademyRegistrationStatus,
    @Args('statusNote', { nullable: true }) statusNote?: string
  ) {
    return this.registrationService.updateStatus(id, status as any, statusNote);
  }

  @Mutation(() => AcademyCourseRegistrationModel, { name: 'deleteAcademyRegistration' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteRegistration(@Args('id', { type: () => ID }) id: string) {
    return this.registrationService.delete(id);
  }
}
