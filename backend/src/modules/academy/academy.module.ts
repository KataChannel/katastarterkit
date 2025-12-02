import { Module } from '@nestjs/common';
import { BranchModule } from './branch/branch.module';
import { AcademyCourseModule } from './course/course.module';
import { AcademyCourseCategoryModule } from './course-category/course-category.module';
import { AcademyRegistrationModule } from './registration/registration.module';
import { AcademyInstructorModule } from './instructor/instructor.module';
import { AcademyTestimonialModule } from './testimonial/testimonial.module';
import { AcademyFAQModule } from './faq/faq.module';

@Module({
  imports: [
    BranchModule,
    AcademyCourseModule,
    AcademyCourseCategoryModule,
    AcademyRegistrationModule,
    AcademyInstructorModule,
    AcademyTestimonialModule,
    AcademyFAQModule,
  ],
  exports: [
    BranchModule,
    AcademyCourseModule,
    AcademyCourseCategoryModule,
    AcademyRegistrationModule,
    AcademyInstructorModule,
    AcademyTestimonialModule,
    AcademyFAQModule,
  ],
})
export class AcademyModule {}
