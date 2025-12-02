import { Module } from '@nestjs/common';
import { AcademyCourseCategoryService } from './course-category.service';
import { AcademyCourseCategoryResolver } from './course-category.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcademyCourseCategoryService, AcademyCourseCategoryResolver],
  exports: [AcademyCourseCategoryService],
})
export class AcademyCourseCategoryModule {}
